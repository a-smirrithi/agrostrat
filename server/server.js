require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { fetchAgroData, generateAlerts, generateForecastChart, CROP_PROFILES } = require('./services/agroEngine');
const { classifyLandAtCoordinate } = require('./services/landClassifier');
const { CHENNAI_PRESETS, findChennaiPreset } = require('./services/chennaiData');
const AdvisoryHistory = require('./models/History');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory fallback history
const memoryHistory = [];

let isMongoConnected = false;
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { 
    serverSelectionTimeoutMS: 4000 
  })
    .then(() => {
      isMongoConnected = true;
      console.log('✓ Connected to MongoDB Atlas');
    })
    .catch(() => {
      isMongoConnected = false;
      console.warn('ℹ Notice: MongoDB Atlas offline. Using local in-memory storage.');
    });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ready',
    service: 'Agrostrat Agro Engine (Chennai Edition)',
    timestamp: new Date().toISOString()
  });
});

// Presets list endpoint - Returns curated Chennai mock datasets
app.get('/api/presets', (req, res) => {
  res.json(CHENNAI_PRESETS);
});

// Primary Agro Analysis Endpoint (with instant Chennai Mock Data support)
app.post('/api/analyze', async (req, res) => {
  try {
    const { lat, lon, cropType = 'Rice', presetId, forceMock = true } = req.body;

    // Check if coordinates or presetId match curated Chennai mock datasets
    const chennaiMock = findChennaiPreset(lat, lon, presetId);

    if (chennaiMock) {
      // Build alerts array from farmer advice for standard compatibility
      const alerts = [
        {
          type: chennaiMock.isField ? 'Irrigation Guidance' : 'Location Notice',
          severity: chennaiMock.farmerAdvice.watering.urgency === 'Safe' ? 'Optimal' : 'Warning',
          statusColor: chennaiMock.farmerAdvice.watering.urgency === 'Safe' ? 'emerald' : 'amber',
          message: `${chennaiMock.farmerAdvice.watering.title}: ${chennaiMock.farmerAdvice.watering.action}`,
          scientificReason: `Soil moisture observed at ${chennaiMock.metrics.soilMoisture} m³/m³. Atmospheric evaporation demand is ${chennaiMock.metrics.evapotranspiration} mm/day.`,
          triggerCondition: `Chennai Agro Model: Evaporation (${chennaiMock.metrics.evapotranspiration}mm) vs Forecast Rain (${chennaiMock.metrics.precipitation}mm)`,
          actionPlan: chennaiMock.farmerAdvice.watering.action
        },
        {
          type: 'Crop Health & Pest Alert',
          severity: chennaiMock.farmerAdvice.pests.urgency === 'Warning' ? 'Critical' : 'Advisory',
          statusColor: chennaiMock.farmerAdvice.pests.urgency === 'Warning' ? 'rose' : 'sky',
          message: `${chennaiMock.farmerAdvice.pests.title}: ${chennaiMock.farmerAdvice.pests.action}`,
          scientificReason: `Canopy humidity at ${chennaiMock.metrics.humidity}% and temperature at ${chennaiMock.metrics.temperature}°C influence fungal pathogen life cycle.`,
          triggerCondition: `Humidity ${chennaiMock.metrics.humidity}% vs Pathogen Sporulation Threshold (75%)`,
          actionPlan: chennaiMock.farmerAdvice.pests.action
        },
        {
          type: 'Field Soil & Bund Management',
          severity: 'Advisory',
          statusColor: 'emerald',
          message: `${chennaiMock.farmerAdvice.fieldWork.title}: ${chennaiMock.farmerAdvice.fieldWork.action}`,
          scientificReason: 'Surface drainage maintains aerobic respiration in root zone and prevents water stagnation.',
          triggerCondition: 'Field Management Protocol',
          actionPlan: chennaiMock.farmerAdvice.fieldWork.action
        }
      ];

      return res.json({
        success: true,
        isChennaiMock: true,
        selectedLocationName: chennaiMock.name,
        district: chennaiMock.district,
        summary: chennaiMock.summary,
        audioMessage: chennaiMock.audioMessage,
        metrics: chennaiMock.metrics,
        landClassification: {
          isField: chennaiMock.isField,
          classification: chennaiMock.classification,
          confidence: chennaiMock.confidence,
          detectedName: chennaiMock.detectedName,
          indicators: chennaiMock.indicators,
          explanation: chennaiMock.explanation,
          advisoryWarning: chennaiMock.advisoryWarning
        },
        farmerAdvice: chennaiMock.farmerAdvice,
        alerts,
        forecastChart: chennaiMock.forecast,
        cropProfile: CROP_PROFILES[chennaiMock.crop] || CROP_PROFILES.Rice
      });
    }

    // Otherwise, execute Live Open-Meteo & OpenStreetMap Pipeline for custom coordinates
    if (lat === undefined || lon === undefined || isNaN(Number(lat)) || isNaN(Number(lon))) {
      return res.status(400).json({ error: 'Valid latitude and longitude are required.' });
    }

    const numLat = parseFloat(lat);
    const numLon = parseFloat(lon);

    const rawAgroData = await fetchAgroData(numLat, numLon);
    
    const metrics = {
      temperature: rawAgroData.hourly?.temperature_2m?.[0] !== undefined 
        ? Number(rawAgroData.hourly.temperature_2m[0].toFixed(1)) : 30,
      humidity: rawAgroData.hourly?.relative_humidity_2m?.[0] !== undefined 
        ? Math.round(rawAgroData.hourly.relative_humidity_2m[0]) : 75,
      soilMoisture: rawAgroData.hourly?.soil_moisture_0_to_7cm?.[0] !== undefined 
        ? Number(rawAgroData.hourly.soil_moisture_0_to_7cm[0].toFixed(3)) : 0.25,
      precipitation: rawAgroData.daily?.precipitation_sum?.[0] !== undefined 
        ? Number(rawAgroData.daily.precipitation_sum[0].toFixed(1)) : 0,
      evapotranspiration: rawAgroData.daily?.et0_fao_evapotranspiration?.[0] !== undefined 
        ? Number(rawAgroData.daily.et0_fao_evapotranspiration[0].toFixed(2)) : 3.5,
      windSpeed: rawAgroData.hourly?.wind_speed_10m?.[0] !== undefined 
        ? Number(rawAgroData.hourly.wind_speed_10m[0].toFixed(1)) : 10
    };

    const landClassification = await classifyLandAtCoordinate(numLat, numLon, metrics.soilMoisture);
    const alerts = generateAlerts(rawAgroData, cropType);
    const forecastChart = generateForecastChart(rawAgroData);

    const isField = landClassification.isField;
    const summary = isField 
      ? `Field verified at ${landClassification.detectedName}. Soil moisture is ${metrics.soilMoisture} m³/m³.`
      : `Detected residential/built structure at ${landClassification.detectedName}. Showing ambient weather.`;

    const farmerAdvice = {
      watering: {
        title: isField ? 'Irrigation Status' : 'Non-Farmland Area',
        action: alerts[0]?.message || 'Maintain regular irrigation check.',
        urgency: alerts[0]?.severity || 'Advisory'
      },
      pests: {
        title: 'Crop Protection',
        action: alerts[1]?.message || 'No immediate pest threat detected.',
        urgency: alerts[1]?.severity || 'Safe'
      },
      fieldWork: {
        title: 'Cultural Operations',
        action: 'Inspect topsoil permeability and field bunds regularly.',
        urgency: 'Advisory'
      }
    };

    res.json({
      success: true,
      isChennaiMock: false,
      selectedLocationName: landClassification.detectedName,
      district: 'Live GPS Coordinate',
      summary,
      audioMessage: summary,
      metrics,
      landClassification,
      farmerAdvice,
      alerts,
      forecastChart,
      cropProfile: CROP_PROFILES[cropType] || CROP_PROFILES.Rice
    });

  } catch (error) {
    console.error('Error analyzing agro data:', error.stack || error);
    res.status(500).json({ error: error.message || 'Failed to process analysis.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Ankur Agro Engine API listening on http://localhost:${PORT}`);
});
