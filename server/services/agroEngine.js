const axios = require('axios');

/**
 * Agro-Intelligence Engine
 * Fetches real-time satellite & numerical weather prediction data from Open-Meteo
 * and applies crop-physiological models (FAO-56 Penman-Monteith, Disease Epidemiology)
 * to produce fully interpretable, explainable advisories.
 */

async function fetchAgroData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,et0_fao_evapotranspiration,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,relative_humidity_2m,soil_moisture_0_to_7cm,wind_speed_10m&timezone=auto`;
  const response = await axios.get(url, { timeout: 6000 });
  return response.data;
}

/**
 * Crop specific coefficients and agronomic thresholds
 */
const CROP_PROFILES = {
  Wheat: {
    kc: 1.15, // Mid-season crop coefficient (FAO-56)
    optimalMoistureMin: 0.20,
    optimalMoistureMax: 0.36,
    waterloggingLimit: 0.40,
    pestRhLimit: 75,
    pestTempRange: [15, 26],
    pestName: 'Wheat Leaf / Stripe Rust (Puccinia spp.)',
    sensitivity: 'Extremely susceptible to root zone hypoxia and fungal rust under damp canopy.'
  },
  Rice: {
    kc: 1.25,
    optimalMoistureMin: 0.32,
    optimalMoistureMax: 0.50,
    waterloggingLimit: 0.55,
    pestRhLimit: 82,
    pestTempRange: [22, 30],
    pestName: 'Rice Blast (Magnaporthe oryzae) & Sheath Blight',
    sensitivity: 'Requires semi-submerged or near-saturated soil; vulnerable to moisture stress below 0.30 m³/m³.'
  },
  Cotton: {
    kc: 1.05,
    optimalMoistureMin: 0.16,
    optimalMoistureMax: 0.30,
    waterloggingLimit: 0.35,
    pestRhLimit: 70,
    pestTempRange: [24, 34],
    pestName: 'Cotton Boll Rot Complex & Whitefly Outbreak',
    sensitivity: 'Deep taproot system; highly sensitive to waterlogging which induces flower & boll shedding.'
  },
  Corn: {
    kc: 1.20,
    optimalMoistureMin: 0.18,
    optimalMoistureMax: 0.34,
    waterloggingLimit: 0.38,
    pestRhLimit: 78,
    pestTempRange: [20, 28],
    pestName: 'Fall Armyworm & Northern Corn Leaf Blight',
    sensitivity: 'High water demand during silking/tasseling; intolerant of water stagnation exceeding 24 hours.'
  },
  Soybean: {
    kc: 1.10,
    optimalMoistureMin: 0.18,
    optimalMoistureMax: 0.33,
    waterloggingLimit: 0.37,
    pestRhLimit: 76,
    pestTempRange: [20, 28],
    pestName: 'Soybean Rust (Phakopsora pachyrhizi) & Pod Borer',
    sensitivity: 'Crucial pod-filling moisture needs; excess moisture encourages root rot pathogens.'
  }
};

function generateAlerts(data, cropType = 'Wheat') {
  const alerts = [];
  const profile = CROP_PROFILES[cropType] || CROP_PROFILES.Wheat;

  const soilMoistureArr = data.hourly?.soil_moisture_0_to_7cm || [];
  const precipArr = data.daily?.precipitation_sum || [];
  const humidityArr = data.hourly?.relative_humidity_2m || [];
  const tempArr = data.hourly?.temperature_2m || [];
  const et0Arr = data.daily?.et0_fao_evapotranspiration || [];

  const currentSm = soilMoistureArr.length ? Number(soilMoistureArr[0].toFixed(3)) : 0.20;
  const currentHumidity = humidityArr.length ? Math.round(humidityArr[0]) : 50;
  const currentTemp = tempArr.length ? Number(tempArr[0].toFixed(1)) : 25;
  const maxPrecip = precipArr.length ? Math.max(...precipArr) : 0;
  const todayPrecip = precipArr.length ? precipArr[0] : 0;
  const todayEt0 = et0Arr.length ? et0Arr[0] : 3.5;

  const isHeavyRain = precipArr.some(p => p >= 15);
  const maxHumidity = humidityArr.length ? Math.max(...humidityArr.slice(0, 24)) : currentHumidity;

  // 1. Waterlogging / Excess Moisture Assessment
  if (cropType === 'Rice') {
    if (isHeavyRain) {
      alerts.push({
        type: 'Heavy Rainfall Management',
        severity: 'Advisory',
        statusColor: 'emerald',
        message: `High rainfall (${maxPrecip}mm forecast) is advantageous for paddy standing water. Strengthen perimeter bunds to retain water.`,
        scientificReason: 'Rice fields utilize standing water (5-10cm) for anaerobic weed suppression, but overflowing bunds cause topsoil nutrient runoff.',
        triggerCondition: `Forecast Max Precipitation: ${maxPrecip}mm >= 15mm threshold`,
        actionPlan: 'Inspect and reinforce outer dyke spillways to prevent wall collapse while retaining beneficial flood depth.'
      });
    }
  } else {
    if (currentSm >= profile.waterloggingLimit || isHeavyRain) {
      alerts.push({
        type: 'Waterlogging & Root Hypoxia Risk',
        severity: 'Critical',
        statusColor: 'rose',
        message: `Critical root zone saturation! Soil moisture at ${currentSm} m³/m³ with up to ${maxPrecip}mm rain poses severe root rot risk for ${cropType}.`,
        scientificReason: `When volumetric soil moisture exceeds ${profile.waterloggingLimit} m³/m³, pore oxygen drops below 10%, causing root hypoxia, nitrogen denitrification, and Phytophthora root rot.`,
        triggerCondition: `Current Soil Moisture (${currentSm} m³/m³) >= Limit (${profile.waterloggingLimit}) OR Rain (${maxPrecip}mm) >= 15mm`,
        actionPlan: 'Immediately dig or unblock 15cm-deep perimeter drainage trenches. Suspend all planned fertilizer and chemical applications.'
      });
    }
  }

  // 2. Soil Moisture Deficit & Irrigation Scheduling (FAO-56 Penman-Monteith)
  if (currentSm < profile.optimalMoistureMin) {
    const dailyWaterDeficit = ((profile.optimalMoistureMin - currentSm) * 100 * 10).toFixed(1); // mm estimate
    alerts.push({
      type: 'Soil Moisture Deficit - Irrigation Scheduled',
      severity: 'Warning',
      statusColor: 'amber',
      message: `Active root zone depletion! Soil moisture (${currentSm} m³/m³) is below ${cropType} threshold (${profile.optimalMoistureMin} m³/m³).`,
      scientificReason: `Plant available water (PAW) has dropped below 50% of field capacity. Stomatal closure will reduce carbon fixation and stunt growth.`,
      triggerCondition: `Observed Soil Moisture (${currentSm} m³/m³) < Minimum Crop Threshold (${profile.optimalMoistureMin} m³/m³)`,
      actionPlan: `Schedule light drip/furrow irrigation (~${Math.max(15, Math.round(todayEt0 * profile.kc * 3))} mm depth) during evening or early morning to minimize evaporative loss.`
    });
  } else if (!alerts.some(a => a.type.includes('Waterlogging'))) {
    alerts.push({
      type: 'Optimal Soil Hydration',
      severity: 'Optimal',
      statusColor: 'emerald',
      message: `Soil moisture (${currentSm} m³/m³) is within the ideal agronomic window (${profile.optimalMoistureMin} - ${profile.optimalMoistureMax} m³/m³) for ${cropType}.`,
      scientificReason: `Balanced ratio of capillary soil water to pore aeration allows optimal microbial nitrogen mineralization and root respiration.`,
      triggerCondition: `Moisture (${currentSm}) is between ${profile.optimalMoistureMin} and ${profile.optimalMoistureMax} m³/m³`,
      actionPlan: 'Maintain current cultural practices. Monitor upcoming forecast before running routine irrigation cycles.'
    });
  }

  // 3. Pest & Fungal Epidemiology Model
  const inTempWindow = currentTemp >= profile.pestTempRange[0] && currentTemp <= profile.pestTempRange[1];
  if (maxHumidity >= profile.pestRhLimit && inTempWindow) {
    alerts.push({
      type: 'Pathogen & Spore Germination Warning',
      severity: 'Critical',
      statusColor: 'rose',
      message: `Elevated microclimate risk for ${profile.pestName}! Sustained humidity (${maxHumidity}%) and warm temperatures (${currentTemp}°C) accelerate infection.`,
      scientificReason: `Fungal urediniospores require leaf wetness duration > 6 hours and relative humidity >= ${profile.pestRhLimit}% to pierce crop cuticle and colonize mesophyll cells.`,
      triggerCondition: `Max 24h Humidity (${maxHumidity}%) >= ${profile.pestRhLimit}% AND Temp (${currentTemp}°C) within [${profile.pestTempRange[0]}°C - ${profile.pestTempRange[1]}°C]`,
      actionPlan: 'Scout leaf undersides for pustules or lesions. Consider prophylactic triazole or strobilurin bio-fungicide spray if canopy remains dense.'
    });
  }

  // 4. Evaporative Water Budgeting (ET0 & Crop ETc)
  const cropEtc = (todayEt0 * profile.kc).toFixed(2);
  alerts.push({
    type: 'Evaporative Water Budget (FAO-56)',
    severity: 'Advisory',
    statusColor: 'sky',
    message: `Daily crop water demand (ETc) is estimated at ${cropEtc} mm/day based on reference ET₀ (${todayEt0} mm/day) and Kc (${profile.kc}).`,
    scientificReason: 'Calculated via FAO-56 Penman-Monteith combining solar net radiation, ambient vapour pressure deficit, and atmospheric aerodynamic resistance.',
    triggerCondition: `Formula: ETc = Reference ET₀ (${todayEt0} mm) × Crop Coefficient Kc (${profile.kc})`,
    actionPlan: `If rain forecast is 0mm, soil reserve loses ~${cropEtc} liters/m² per day. Adjust your weekly irrigation budget accordingly.`
  });

  return alerts;
}

function generateForecastChart(data) {
  const chartData = [];
  const daily = data.daily || {};
  
  if (daily.time && daily.precipitation_sum && daily.temperature_2m_max) {
    for (let i = 0; i < daily.time.length; i++) {
      chartData.push({
        time: daily.time[i],
        temperature: daily.temperature_2m_max[i],
        minTemperature: daily.temperature_2m_min ? daily.temperature_2m_min[i] : null,
        precipitation: daily.precipitation_sum[i],
        et0: daily.et0_fao_evapotranspiration ? daily.et0_fao_evapotranspiration[i] : null
      });
    }
  }
  return chartData;
}

module.exports = {
  fetchAgroData,
  generateAlerts,
  generateForecastChart,
  CROP_PROFILES
};
