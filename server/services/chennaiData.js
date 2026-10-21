/**
 * Curated Chennai & Tamil Nadu Mock Datasets
 * Tailored for farmers in and around Chennai (Kanchipuram, Tiruvallur, Chengalpattu)
 * as well as Chennai urban residential neighborhoods (T. Nagar, Anna Nagar, Mylapore).
 */

const CHENNAI_PRESETS = [
  {
    id: 'chennai-paddy-kanchipuram',
    name: 'Kanchipuram Paddy Farm',
    shortName: 'Kanchipuram Paddy Farm',
    district: 'Kanchipuram Agrarian Belt (Greater Chennai)',
    lat: 12.8342,
    lon: 79.7036,
    crop: 'Rice',
    isField: true,
    classification: 'Agricultural Field / Farmland',
    confidence: 96,
    detectedName: 'Samba Paddy Basin, Kanchipuram, Tamil Nadu',
    summary: 'Water is sufficient. Light evening monsoon rain (~12mm) is expected. No extra pumping needed today.',
    audioMessage: 'Samba paddy field in Kanchipuram shows strong soil moisture. Evening rainfall is forecasted, so additional water pumping should be postponed.',
    metrics: {
      temperature: 30.2,
      humidity: 82,
      soilMoisture: 0.345,
      soilStatusText: 'Well Hydrated (34.5%)',
      precipitation: 12.5,
      evapotranspiration: 3.8,
      windSpeed: 12.4
    },
    indicators: {
      cadastralTag: 'landuse: farmland (Samba Paddy cultivation)',
      surfaceImperviousness: '< 8% (Porous Alluvial Soil)',
      rootZoneAccessible: true,
      zoningStatus: 'Agricultural Cultivation Zone'
    },
    explanation: 'Cadastral records identify this coordinate as active paddy cultivation land in Kanchipuram rural belt. Topsoil has high water-holding capacity and permeable root zone.',
    advisoryWarning: null,
    farmerAdvice: {
      watering: {
        title: 'Do Not Pump Water Today',
        action: 'Rain expected tonight (~12.5mm). Pumping extra water will waste electricity and overflow bunds.',
        urgency: 'Safe'
      },
      pests: {
        title: 'Fungal Alert: Paddy Blast',
        action: 'High humidity (82%) with 30°C temperature accelerates fungal spores. Spray neem oil (5ml/L) or Tricyclazole if small brown spots appear on leaf tips.',
        urgency: 'Warning'
      },
      fieldWork: {
        title: 'Clear Bund Drainage Outlets',
        action: 'Inspect field bunds to ensure standing water does not exceed 5cm to prevent submergence of young tillers.',
        urgency: 'Advisory'
      }
    },
    forecast: [
      { time: '2026-10-21', day: 'Today', temperature: 30, minTemperature: 24, precipitation: 12.5, et0: 3.8, condition: 'Evening Showers' },
      { time: '2026-10-22', day: 'Tomorrow', temperature: 29, minTemperature: 24, precipitation: 18.0, et0: 3.2, condition: 'Heavy Rain' },
      { time: '2026-10-23', day: 'Friday', temperature: 31, minTemperature: 25, precipitation: 4.0, et0: 4.1, condition: 'Scattered Rain' },
      { time: '2026-10-24', day: 'Saturday', temperature: 32, minTemperature: 25, precipitation: 0.0, et0: 4.6, condition: 'Sunny Day' },
      { time: '2026-10-25', day: 'Sunday', temperature: 33, minTemperature: 26, precipitation: 0.0, et0: 4.8, condition: 'Sunny Day' },
      { time: '2026-10-26', day: 'Monday', temperature: 32, minTemperature: 25, precipitation: 1.2, et0: 4.4, condition: 'Partly Cloudy' },
      { time: '2026-10-27', day: 'Tuesday', temperature: 31, minTemperature: 24, precipitation: 0.0, et0: 4.2, condition: 'Pleasant' }
    ]
  },

  {
    id: 'chennai-groundnut-tiruvallur',
    name: 'Tiruvallur Groundnut Farm',
    shortName: 'Tiruvallur Groundnut Field',
    district: 'Tiruvallur Farming District (North Chennai)',
    lat: 13.1432,
    lon: 79.9082,
    crop: 'Wheat',
    isField: true,
    classification: 'Agricultural Field / Farmland',
    confidence: 94,
    detectedName: 'Sandy Loam Farm Tract, Tiruvallur, Tamil Nadu',
    summary: 'Soil is becoming dry (18.5%). No rain for next 3 days. Run drip or sprinkler irrigation for 1.5 hours this evening.',
    audioMessage: 'Tiruvallur groundnut field topsoil moisture is declining. No rainfall is predicted for the next 3 days. Run drip or sprinkler irrigation this evening.',
    metrics: {
      temperature: 32.1,
      humidity: 68,
      soilMoisture: 0.185,
      soilStatusText: 'Getting Dry (18.5%)',
      precipitation: 0.0,
      evapotranspiration: 4.6,
      windSpeed: 10.2
    },
    indicators: {
      cadastralTag: 'landuse: agricultural (Groundnut & Pulses parcel)',
      surfaceImperviousness: '< 10% (Red Sandy Loam)',
      rootZoneAccessible: true,
      zoningStatus: 'Rural Cultivation Land'
    },
    explanation: 'Open agricultural field identified in Tiruvallur rural zone. Porous topsoil with active root zone dynamics.',
    advisoryWarning: null,
    farmerAdvice: {
      watering: {
        title: 'Water Field Today',
        action: 'Topsoil moisture has dropped to 18.5%. Water your field for 1.5 to 2 hours in the cool evening to prevent leaf wilting.',
        urgency: 'Action Needed'
      },
      pests: {
        title: 'Low Disease Threat',
        action: 'Dryer humidity (68%) keeps fungal spore growth low. Ideal weather for hand-weeding and soil loosening.',
        urgency: 'Safe'
      },
      fieldWork: {
        title: 'Mulching Recommended',
        action: 'Spread straw or dry leaves around plant bases to reduce high daytime evaporation (4.6 mm/day).',
        urgency: 'Advisory'
      }
    },
    forecast: [
      { time: '2026-10-21', day: 'Today', temperature: 32, minTemperature: 25, precipitation: 0.0, et0: 4.6, condition: 'Warm & Dry' },
      { time: '2026-10-22', day: 'Tomorrow', temperature: 33, minTemperature: 25, precipitation: 0.0, et0: 4.8, condition: 'Sunny' },
      { time: '2026-10-23', day: 'Friday', temperature: 32, minTemperature: 24, precipitation: 0.0, et0: 4.5, condition: 'Sunny' },
      { time: '2026-10-24', day: 'Saturday', temperature: 31, minTemperature: 24, precipitation: 2.0, et0: 4.1, condition: 'Light Mist' },
      { time: '2026-10-25', day: 'Sunday', temperature: 30, minTemperature: 24, precipitation: 8.5, et0: 3.5, condition: 'Cloudy Showers' },
      { time: '2026-10-26', day: 'Monday', temperature: 30, minTemperature: 23, precipitation: 5.0, et0: 3.6, condition: 'Passing Showers' },
      { time: '2026-10-27', day: 'Tuesday', temperature: 31, minTemperature: 24, precipitation: 0.0, et0: 4.0, condition: 'Clear' }
    ]
  },

  {
    id: 'chennai-veg-chengalpattu',
    name: 'Chengalpattu Vegetable Farm',
    shortName: 'Chengalpattu Vegetable Farm',
    district: 'Chengalpattu Rural District (South Chennai)',
    lat: 12.6841,
    lon: 79.9836,
    crop: 'Corn',
    isField: true,
    classification: 'Agricultural Field / Farmland',
    confidence: 95,
    detectedName: 'Horticulture & Vegetable Land, Chengalpattu, Tamil Nadu',
    summary: 'Heavy downpour expected (22mm). Soil is already very wet. Dig drainage trenches to prevent root rotting.',
    audioMessage: 'Heavy rainfall forecasted for Chengalpattu region. Saturated soil requires trench unblocking to avoid water stagnation and root rot.',
    metrics: {
      temperature: 29.4,
      humidity: 88,
      soilMoisture: 0.412,
      soilStatusText: 'Very Wet / Waterlogged (41.2%)',
      precipitation: 22.0,
      evapotranspiration: 2.9,
      windSpeed: 17.5
    },
    indicators: {
      cadastralTag: 'landuse: farmland (Vegetables & Horticulture)',
      surfaceImperviousness: '< 5% (Alluvial Loam)',
      rootZoneAccessible: true,
      zoningStatus: 'Horticulture Green Belt'
    },
    explanation: 'Low-lying fertile farmland parcel in Chengalpattu. High soil moisture retention and prone to waterlogging after heavy coastal showers.',
    advisoryWarning: null,
    farmerAdvice: {
      watering: {
        title: 'Hold All Irrigation',
        action: 'Soil moisture is at 41.2%, which is waterlogged. Additional irrigation will suffocate crop roots.',
        urgency: 'Action Needed'
      },
      pests: {
        title: 'High Root Rot & Blight Risk',
        action: 'Saturated wet soil breeds Phytophthora root rot. Do not apply chemical fertilizers now as they will wash away.',
        urgency: 'Warning'
      },
      fieldWork: {
        title: 'Dig Drainage Trenches',
        action: 'Immediately unblock drainage channels on field edges so pooled rain water drains away quickly.',
        urgency: 'Action Needed'
      }
    },
    forecast: [
      { time: '2026-10-21', day: 'Today', temperature: 29, minTemperature: 23, precipitation: 22.0, et0: 2.9, condition: 'Heavy Storm' },
      { time: '2026-10-22', day: 'Tomorrow', temperature: 28, minTemperature: 23, precipitation: 15.0, et0: 2.8, condition: 'Showers' },
      { time: '2026-10-23', day: 'Friday', temperature: 30, minTemperature: 24, precipitation: 6.0, et0: 3.5, condition: 'Cloudy' },
      { time: '2026-10-24', day: 'Saturday', temperature: 31, minTemperature: 25, precipitation: 0.0, et0: 4.2, condition: 'Clearing' },
      { time: '2026-10-25', day: 'Sunday', temperature: 32, minTemperature: 25, precipitation: 0.0, et0: 4.5, condition: 'Sunny' },
      { time: '2026-10-26', day: 'Monday', temperature: 31, minTemperature: 24, precipitation: 0.0, et0: 4.3, condition: 'Sunny' },
      { time: '2026-10-27', day: 'Tuesday', temperature: 31, minTemperature: 24, precipitation: 0.0, et0: 4.1, condition: 'Sunny' }
    ]
  },

  {
    id: 'chennai-house-tnagar',
    name: 'Residential House in T. Nagar, Chennai',
    shortName: 'T. Nagar House (Chennai City)',
    district: 'T. Nagar, Central Chennai (Urban Residential)',
    lat: 13.0418,
    lon: 80.2341,
    crop: 'Rice',
    isField: false,
    classification: 'Residential House / Built Structure',
    confidence: 97,
    detectedName: 'Usman Road / Ranganathan St Residential Area, T. Nagar, Chennai',
    summary: 'Non-Farm Location: This is a residential house/building with concrete roofs and paved roads. No crop soil exists here.',
    audioMessage: 'Urban residential property in central Chennai. Arable cropland is not present on paved surfaces.',
    metrics: {
      temperature: 32.4,
      humidity: 78,
      soilMoisture: 0.045,
      soilStatusText: 'Sealed Concrete (Impervious)',
      precipitation: 4.2,
      evapotranspiration: 4.8,
      windSpeed: 8.5
    },
    indicators: {
      cadastralTag: 'building: residential (Urban house & street cadastral parcel)',
      surfaceImperviousness: '92% (Concrete Roofs, Pavers & Asphalt)',
      rootZoneAccessible: false,
      zoningStatus: 'Commercial & Residential Urban Zone'
    },
    explanation: 'Cadastral mapping identifies this coordinate as a residential building parcel in T. Nagar, Chennai. The topsoil is sealed under concrete structures, tiles, and roads.',
    advisoryWarning: 'RESIDENTIAL BUILDING DETECTED: This coordinate is a house/building in T. Nagar, Chennai. Ambient city weather is shown, but crop root-zone advice cannot be applied to concrete roofs. Switch to a farm location above.',
    farmerAdvice: {
      watering: {
        title: 'Not An Agricultural Field',
        action: 'Irrigation models require open permeable farm soil. This coordinate is covered by concrete slabs and housing infrastructure.',
        urgency: 'Warning'
      },
      pests: {
        title: 'Urban Built Environment',
        action: 'Ambient humidity is 78%, but no crops are planted in this residential block.',
        urgency: 'Safe'
      },
      fieldWork: {
        title: 'Please Select A Farmland Coordinate',
        action: 'Click "Kanchipuram Paddy Farm" or "Tiruvallur Groundnut Field" to test realistic crop advisory logic.',
        urgency: 'Action Needed'
      }
    },
    forecast: [
      { time: '2026-10-21', day: 'Today', temperature: 32, minTemperature: 26, precipitation: 4.2, et0: 4.8, condition: 'City Showers' },
      { time: '2026-10-22', day: 'Tomorrow', temperature: 31, minTemperature: 25, precipitation: 8.0, et0: 4.0, condition: 'City Rain' },
      { time: '2026-10-23', day: 'Friday', temperature: 32, minTemperature: 26, precipitation: 0.0, et0: 4.9, condition: 'Humid & Sunny' },
      { time: '2026-10-24', day: 'Saturday', temperature: 33, minTemperature: 26, precipitation: 0.0, et0: 5.1, condition: 'Sunny' },
      { time: '2026-10-25', day: 'Sunday', temperature: 33, minTemperature: 27, precipitation: 0.0, et0: 5.2, condition: 'Sunny' },
      { time: '2026-10-26', day: 'Monday', temperature: 32, minTemperature: 26, precipitation: 0.0, et0: 4.7, condition: 'Clear' },
      { time: '2026-10-27', day: 'Tuesday', temperature: 32, minTemperature: 26, precipitation: 0.0, et0: 4.6, condition: 'Clear' }
    ]
  },

  {
    id: 'chennai-apt-annanagar',
    name: 'Anna Nagar Apartment Complex',
    shortName: 'Anna Nagar Apartment (Chennai)',
    district: 'Anna Nagar West, Chennai (Urban Residential)',
    lat: 13.0850,
    lon: 80.2101,
    crop: 'Wheat',
    isField: false,
    classification: 'Residential Apartment Complex',
    confidence: 98,
    detectedName: '2nd Avenue Residential Apartments, Anna Nagar, Chennai',
    summary: 'Non-Farm Location: Multi-story residential building with 95% paved surface.',
    audioMessage: 'Urban apartment complex in Anna Nagar. Impervious structures prevent water infiltration.',
    metrics: {
      temperature: 32.8,
      humidity: 76,
      soilMoisture: 0.038,
      soilStatusText: 'Impervious Concrete (95%)',
      precipitation: 3.5,
      evapotranspiration: 4.9,
      windSpeed: 9.0
    },
    indicators: {
      cadastralTag: 'building: apartments (Multi-story residential apartment)',
      surfaceImperviousness: '95% (Impervious Roof & Pavement)',
      rootZoneAccessible: false,
      zoningStatus: 'Urban High-Density Residential'
    },
    explanation: 'Cadastral zoning registers this parcel as a high-density apartment block. Zero arable soil profile.',
    advisoryWarning: 'RESIDENTIAL APARTMENT DETECTED: This coordinate is an urban residential block in Anna Nagar. Select a farmland location to view crop soil moisture guidance.',
    farmerAdvice: {
      watering: {
        title: 'Urban Apartment Building',
        action: 'No agricultural root zone detected. Concrete pavements restrict rainwater infiltration.',
        urgency: 'Warning'
      },
      pests: {
        title: 'Urban City Reading',
        action: 'Ambient temperatures reflect the urban heat island of central Chennai.',
        urgency: 'Safe'
      },
      fieldWork: {
        title: 'Switch to Farm Preset',
        action: 'Click any farm preset chip above to view active crop management advisories.',
        urgency: 'Action Needed'
      }
    },
    forecast: [
      { time: '2026-10-21', day: 'Today', temperature: 33, minTemperature: 26, precipitation: 3.5, et0: 4.9, condition: 'Scattered Showers' },
      { time: '2026-10-22', day: 'Tomorrow', temperature: 31, minTemperature: 25, precipitation: 7.0, et0: 4.1, condition: 'Rainy' },
      { time: '2026-10-23', day: 'Friday', temperature: 32, minTemperature: 26, precipitation: 0.0, et0: 5.0, condition: 'Sunny' },
      { time: '2026-10-24', day: 'Saturday', temperature: 33, minTemperature: 26, precipitation: 0.0, et0: 5.2, condition: 'Sunny' },
      { time: '2026-10-25', day: 'Sunday', temperature: 34, minTemperature: 27, precipitation: 0.0, et0: 5.3, condition: 'Hot' },
      { time: '2026-10-26', day: 'Monday', temperature: 33, minTemperature: 26, precipitation: 0.0, et0: 4.8, condition: 'Clear' },
      { time: '2026-10-27', day: 'Tuesday', temperature: 32, minTemperature: 25, precipitation: 0.0, et0: 4.6, condition: 'Clear' }
    ]
  }
];

function findChennaiPreset(lat, lon, presetId = null) {
  if (presetId) {
    const byId = CHENNAI_PRESETS.find(p => p.id === presetId);
    if (byId) return byId;
  }

  // Match by approximate coordinates (within 0.03 degrees ~3km)
  if (lat && lon) {
    const numLat = parseFloat(lat);
    const numLon = parseFloat(lon);
    const matched = CHENNAI_PRESETS.find(p => {
      return Math.abs(p.lat - numLat) < 0.04 && Math.abs(p.lon - numLon) < 0.04;
    });
    if (matched) return matched;
  }

  return null;
}

module.exports = {
  CHENNAI_PRESETS,
  findChennaiPreset
};
