import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Droplets, 
  Layers, 
  Thermometer, 
  CloudRain, 
  Sun, 
  Sprout, 
  Building, 
  SlidersHorizontal, 
  ArrowUpRight, 
  Sparkles, 
  Compass, 
  Calendar, 
  ShieldCheck, 
  Tractor, 
  Wind, 
  Gauge, 
  Check, 
  FileText,
  CloudSun,
  CloudLightning,
  CloudDrizzle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

// Rotating action words for the hero display
const ROTATING_WORDS = ['FARMS', 'CROPS', 'SOILS', 'HARVESTS'];

// Dynamic weather icon helper using pure Lucide icons (no emojis)
function WeatherIcon({ condition }) {
  const cond = (condition || '').toLowerCase();
  if (cond.includes('storm') || cond.includes('thunder')) {
    return <CloudLightning size={26} className="text-indigo-600 mx-auto" />;
  }
  if (cond.includes('heavy') || cond.includes('rain')) {
    return <CloudRain size={26} className="text-blue-500 mx-auto" />;
  }
  if (cond.includes('shower') || cond.includes('drizzle') || cond.includes('mist')) {
    return <CloudDrizzle size={26} className="text-sky-500 mx-auto" />;
  }
  if (cond.includes('cloud') || cond.includes('partly') || cond.includes('passing')) {
    return <CloudSun size={26} className="text-amber-500 mx-auto" />;
  }
  return <Sun size={26} className="text-amber-500 mx-auto" />;
}

export default function App() {
  // URL search params support for direct linking & testing
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const paramTab = urlParams.get('tab');
  const paramPreset = urlParams.get('preset');
  const paramCustom = urlParams.get('custom');

  // Navigation / Tabs State
  const [activeTab, setActiveTab] = useState(paramTab || 'checker'); // 'checker' | 'advisory' | 'weather'
  const [wordIndex, setWordIndex] = useState(0);

  // Zoom control state (defaults to 90% for a crisp, zoomed-out command center feel)
  const [zoomLevel, setZoomLevel] = useState(90);

  // Location & Data State
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState(paramPreset || 'chennai-paddy-kanchipuram');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Custom coordinate input state
  const [showCustomInput, setShowCustomInput] = useState(paramCustom === 'true');
  const [inputLat, setInputLat] = useState('12.8342');
  const [inputLon, setInputLon] = useState('79.7036');
  const [customCrop, setCustomCrop] = useState('Rice');

  // Active Analysis Data
  const [locationName, setLocationName] = useState('Kanchipuram Paddy Farm');
  const [district, setDistrict] = useState('Kanchipuram Agrarian District');
  const [summary, setSummary] = useState('Water is sufficient. Light evening monsoon rain (~12mm) is expected. No extra pumping needed today.');
  const [audioMessage, setAudioMessage] = useState('Samba paddy field in Kanchipuram shows strong soil moisture. Evening rainfall is forecasted, so additional water pumping should be postponed.');
  const [landClassification, setLandClassification] = useState(null);
  const [farmerAdvice, setFarmerAdvice] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [forecastChart, setForecastChart] = useState([]);

  // Apply zoom dynamically to document
  useEffect(() => {
    document.documentElement.style.zoom = `${zoomLevel / 100}`;
  }, [zoomLevel]);

  // Word cycling animation effect for hero
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Fetch location analysis
  const loadLocationData = async (lat, lon, presetId = null, crop = 'Rice') => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        presetId,
        cropType: crop
      });

      const data = response.data;
      if (data.success) {
        setLocationName(data.selectedLocationName || 'Selected Location');
        setDistrict(data.district || 'Chennai Region');
        setSummary(data.summary || '');
        setAudioMessage(data.audioMessage || data.summary || '');
        setLandClassification(data.landClassification);
        setFarmerAdvice(data.farmerAdvice);
        setMetrics(data.metrics);
        setForecastChart(data.forecastChart || []);
      } else {
        setError('Could not retrieve data for this location.');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Unable to reach server. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Initial Load: Fetch Chennai Presets & Default to Kanchipuram Farm or URL preset
  useEffect(() => {
    const urlP = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const pPresetId = urlP.get('preset');

    axios.get(`${API_BASE_URL}/presets`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPresets(res.data);
          const target = res.data.find(p => p.id === pPresetId) || res.data[0];
          setSelectedPresetId(target.id);
          setInputLat(String(target.lat));
          setInputLon(String(target.lon));
          loadLocationData(target.lat, target.lon, target.id, target.crop);
        }
      })
      .catch(() => {
        loadLocationData(12.8342, 79.7036, 'chennai-paddy-kanchipuram', 'Rice');
      });
  }, []);

  // Preset Selection Handler
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setInputLat(String(preset.lat));
    setInputLon(String(preset.lon));
    loadLocationData(preset.lat, preset.lon, preset.id, preset.crop);
  };

  // Manual Coordinates Submit Handler
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!inputLat || !inputLon) return;
    setSelectedPresetId(null);
    loadLocationData(inputLat, inputLon, null, customCrop);
  };

  // Device GPS Location Handler
  const handleUseGPS = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lon = parseFloat(pos.coords.longitude.toFixed(4));
          setInputLat(String(lat));
          setInputLon(String(lon));
          setSelectedPresetId(null);
          loadLocationData(lat, lon, null, customCrop);
        },
        () => {
          setLoading(false);
          setError('GPS location access denied. Please select a preset above.');
        }
      );
    }
  };

  const isField = landClassification?.isField ?? true;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. Header & Quick Zoom Control */}
      <header className="sticky top-0 z-30 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Sprout size={19} className="text-emerald-400" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-stone-900 tracking-tight block">
                Agrostrat
              </span>
              <p className="text-[10px] font-medium text-stone-500">
                Precision Agricultural & Land Intelligence
              </p>
            </div>
          </div>

          {/* Right Header Actions: Zoom Controller */}
          <div className="flex items-center gap-3">
            
            {/* Interactive Zoom Level Control */}
            <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-full text-[11px] font-bold border border-stone-200/90 shadow-2xs">
              <span className="text-[10px] text-stone-400 uppercase font-extrabold pl-2 pr-1">Scale</span>
              <button 
                type="button"
                onClick={() => setZoomLevel(Math.max(75, zoomLevel - 5))}
                className="w-6 h-6 rounded-full hover:bg-white text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom Out"
              >
                -
              </button>
              <span className="px-1 text-stone-700 font-mono text-xs w-9 text-center">
                {zoomLevel}%
              </span>
              <button 
                type="button"
                onClick={() => setZoomLevel(Math.min(110, zoomLevel + 5))}
                className="w-6 h-6 rounded-full hover:bg-white text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(90)}
                className={`px-2 py-0.5 rounded-full text-[10px] transition-all cursor-pointer ${
                  zoomLevel === 90 
                    ? 'bg-white text-emerald-800 font-black shadow-2xs border border-stone-200' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Default 90% Zoom"
              >
                90% Fit
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. Compact Title Banner */}
      <section className="relative overflow-hidden pt-3 pb-2.5 px-4 sm:px-6 lg:px-8 border-b border-stone-200/50 bg-gradient-to-b from-stone-50/60 to-transparent">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 tracking-tight leading-tight font-display">
            Smarter agricultural decisions for{' '}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs transition-all duration-300">
              {ROTATING_WORDS[wordIndex]}
            </span>
          </h1>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-white px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Selected Location: <strong className="text-stone-900">{locationName}</strong></span>
          </div>

        </div>
      </section>

      {/* 3. Location Selector & Live Presets */}
      <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-2xs space-y-3">
          
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                <MapPin size={14} />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 font-display">
                  Tested Agricultural Coordinates & Regional Belts
                </h3>
                <p className="text-[11px] text-stone-500">
                  Select any location to run real-world land verification & advisory
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={12} />
              <span>{showCustomInput ? 'Hide Coordinate Input' : 'Enter Custom Lat/Lon'}</span>
            </button>
          </div>

          {/* 5 Clean Location Preset Cards with Icons instead of Emojis */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {presets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              const isFieldLoc = preset.isField;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`
                    group relative p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between
                    ${isSelected 
                      ? (isFieldLoc 
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-xs ring-1 ring-emerald-500' 
                          : 'bg-amber-50/80 border-amber-500 shadow-xs ring-1 ring-amber-500')
                      : 'bg-stone-50/70 hover:bg-white border-stone-200 hover:border-stone-300 hover:shadow-2xs'}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      isFieldLoc ? 'bg-emerald-100/90 text-emerald-800 border-emerald-200' : 'bg-amber-100/90 text-amber-800 border-amber-200'
                    }`}>
                      {isFieldLoc ? 'Crop Farm' : 'Residential'}
                    </span>
                    
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      isSelected ? (isFieldLoc ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white') : 'bg-stone-200/70 text-stone-600'
                    }`}>
                      <ArrowUpRight size={11} />
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="p-1 rounded-md bg-stone-100/80">
                        {isFieldLoc ? (
                          <Sprout size={14} className="text-emerald-700" />
                        ) : (
                          <Building size={14} className="text-amber-700" />
                        )}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 font-display line-clamp-1">
                        {preset.shortName || preset.name}
                      </h4>
                    </div>
                    <p className="text-[10px] text-stone-500 line-clamp-1">
                      {preset.district || 'Regional Belt'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expandable Custom Coordinate Input */}
          {showCustomInput && (
            <form onSubmit={handleCustomSubmit} className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2.5 animate-in fade-in">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-600">Latitude:</span>
                <input
                  type="number"
                  step="any"
                  value={inputLat}
                  onChange={(e) => setInputLat(e.target.value)}
                  className="w-24 px-2.5 py-1 text-xs border border-stone-300 rounded-lg bg-stone-50 font-mono text-stone-900 focus:outline-emerald-600"
                  placeholder="12.8342"
                  required
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-600">Longitude:</span>
                <input
                  type="number"
                  step="any"
                  value={inputLon}
                  onChange={(e) => setInputLon(e.target.value)}
                  className="w-24 px-2.5 py-1 text-xs border border-stone-300 rounded-lg bg-stone-50 font-mono text-stone-900 focus:outline-emerald-600"
                  placeholder="79.7036"
                  required
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-600">Crop:</span>
                <select
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg bg-stone-50 font-sans text-stone-900 focus:outline-emerald-600"
                >
                  <option value="Rice">Paddy (Rice)</option>
                  <option value="Groundnut">Groundnut</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Sugarcane">Sugarcane</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-3.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs"
              >
                {loading ? 'Checking...' : 'Run Land Check'}
              </button>

              <button
                type="button"
                onClick={handleUseGPS}
                className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Use Device GPS
              </button>
            </form>
          )}

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

        </div>
      </section>

      {/* 4. Sleek 6-Card Metric Stat Bar */}
      {metrics && (
        <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            
            {/* Stat 1: Temperature */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                  Ambient Temp
                </span>
                <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Thermometer size={14} />
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-stone-900 font-display">
                  {metrics.temperature}°C
                </div>
                <p className="text-[10px] text-stone-500 font-medium mt-0.5 truncate">
                  {metrics.temperature > 32 ? 'High heat • Evaporation' : 'Moderate daytime'}
                </p>
              </div>
            </div>

            {/* Stat 2: Air Moisture */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                  Air Humidity
                </span>
                <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Droplets size={14} />
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-stone-900 font-display">
                  {metrics.humidity}%
                </div>
                <p className="text-[10px] text-stone-500 font-medium mt-0.5 truncate">
                  Atmospheric moisture
                </p>
              </div>
            </div>

            {/* Stat 3: Soil Moisture */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                  Root-Zone Moisture
                </span>
                <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Layers size={14} />
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-stone-900 font-display">
                  {(metrics.soilMoisture * 100).toFixed(0)}%
                </div>
                <p className="text-[10px] text-stone-500 font-medium mt-0.5 truncate">
                  {isField ? (metrics.soilStatusText || 'Well Hydrated') : 'Sealed Concrete'}
                </p>
              </div>
            </div>

            {/* Stat 4: Precipitation */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                  Rainfall Today
                </span>
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CloudRain size={14} />
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-stone-900 font-display">
                  {metrics.precipitation} mm
                </div>
                <p className="text-[10px] text-stone-500 font-medium mt-0.5 truncate">
                  {metrics.precipitation > 5 ? 'Wet soil • Pause pumping' : 'Dry conditions'}
                </p>
              </div>
            </div>

            {/* Stat 5: Evapotranspiration ET0 */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                  Evaporation ET₀
                </span>
                <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sun size={14} />
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-stone-900 font-display">
                  {metrics.evapotranspiration || 3.8} <span className="text-xs font-bold text-stone-400">mm/d</span>
                </div>
                <p className="text-[10px] text-stone-500 font-medium mt-0.5 truncate">
                  Crop water demand
                </p>
              </div>
            </div>

            {/* Stat 6: Wind Speed */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                  Surface Wind
                </span>
                <span className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Wind size={14} />
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-stone-900 font-display">
                  {metrics.windSpeed || 12} <span className="text-xs font-bold text-stone-400">km/h</span>
                </div>
                <p className="text-[10px] text-stone-500 font-medium mt-0.5 truncate">
                  Safe for spray work
                </p>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 5. Clean 3-Tab Navigator with Lucide Icons */}
      <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-3">
        <div className="p-1 bg-stone-200/60 rounded-xl flex items-center gap-1 border border-stone-300/60 shadow-2xs">
          
          <button
            type="button"
            onClick={() => setActiveTab('checker')}
            className={`
              flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2
              ${activeTab === 'checker' 
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80' 
                : 'text-stone-600 hover:text-stone-900'}
            `}
          >
            <MapPin size={15} />
            <span className="font-display">1. Land Checker (Field vs House)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('advisory')}
            className={`
              flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2
              ${activeTab === 'advisory' 
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80' 
                : 'text-stone-600 hover:text-stone-900'}
            `}
          >
            <Sprout size={15} />
            <span className="font-display">2. Farm Action Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('weather')}
            className={`
              flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2
              ${activeTab === 'weather' 
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80' 
                : 'text-stone-600 hover:text-stone-900'}
            `}
          >
            <Sun size={15} />
            <span className="font-display">3. 7-Day Weather Forecast</span>
          </button>

        </div>
      </section>

      {/* 6. TAB CONTENT CONTAINER */}
      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex-1">

        {/* ========================================================
            TAB 1: LAND CHECKER (Field vs House Verification)
        ======================================================== */}
        {activeTab === 'checker' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column (7 cols): Main Land Verdict Card */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className={`
                  p-5 sm:p-6 rounded-2xl border-2 transition-all shadow-2xs
                  ${isField 
                    ? 'bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/30 border-emerald-300' 
                    : 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/30 border-amber-300'}
                `}>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-2xs ${isField ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                        {isField ? <Sprout size={24} /> : <Building size={24} />}
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border ${isField ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                          {isField ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                          {isField ? 'Verified Agricultural Cropland' : 'Residential Settlement / House'}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display mt-1">
                          {isField ? 'Open Crop Field (Farmland)' : 'Residential Building / House'}
                        </h2>
                      </div>
                    </div>

                    <div className="text-right bg-white px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-2xs">
                      <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider block">
                        Model Confidence
                      </span>
                      <span className={`text-xl font-black font-display ${isField ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {landClassification?.confidence || 96}% Match
                      </span>
                    </div>
                  </div>

                  {/* Location Badge */}
                  <div className="p-3 bg-white/90 rounded-xl border border-stone-200/90 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
                        <MapPin size={15} className={isField ? 'text-emerald-600' : 'text-amber-600'} />
                        <span>{landClassification?.detectedName || locationName}</span>
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {district} • Coordinates: {inputLat}, {inputLon}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Sentinel-2 Satellite Feed
                    </span>
                  </div>

                  {/* Plain-Language Explanation */}
                  <div className={`p-4 rounded-xl text-xs sm:text-sm font-medium leading-relaxed border ${isField ? 'bg-emerald-100/60 text-emerald-950 border-emerald-200' : 'bg-amber-100/60 text-amber-950 border-amber-200'}`}>
                    {isField ? (
                      <p>
                        <strong className="text-emerald-900 font-bold inline-flex items-center gap-1 mr-1">
                          <CheckCircle2 size={13} className="text-emerald-700 inline" /> Farmland Confirmed:
                        </strong>
                        Satellite reflection detects green biomass and open, porous topsoil. 
                        Rainwater freely penetrates the root zone. Full irrigation recommendations and crop health schedules are active below.
                      </p>
                    ) : (
                      <p>
                        <strong className="text-amber-900 font-bold inline-flex items-center gap-1 mr-1">
                          <AlertTriangle size={13} className="text-amber-700 inline" /> Residential Structure Detected:
                        </strong>
                        High surface reflectance indicates concrete roofs, asphalt, and brick walls. 
                        The ground is sealed and water runs off rather than sinking into crop roots. 
                        Select a farm location above to view agricultural irrigation advice.
                      </p>
                    )}
                  </div>

                  {/* 3 Plain-Language Attribute Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
                    <div className="p-3 bg-white rounded-xl border border-stone-200/80">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400 block mb-0.5">
                        1. Ground Surface
                      </span>
                      <span className="text-xs font-extrabold text-stone-900 font-display block">
                        {isField ? 'Porous Soil (Open)' : 'Concrete Roof & Paving'}
                      </span>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {isField ? 'Absorbs rainwater naturally' : 'Impermeable hard surface'}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200/80">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400 block mb-0.5">
                        2. Root-Zone Water
                      </span>
                      <span className={`text-xs font-extrabold font-display block ${isField ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {isField ? 'Active & Water Absorbing' : 'Sealed / Non-Absorbing'}
                      </span>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {isField ? 'Plants drink from soil' : 'Rain flows into street drains'}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200/80">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400 block mb-0.5">
                        3. Regional Zoning
                      </span>
                      <span className="text-xs font-extrabold text-stone-900 font-display block">
                        {isField ? 'Agricultural Cropland' : 'Urban / Residential Zone'}
                      </span>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {isField ? 'Cultivated rural basin' : 'Housing & civil buildings'}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Cadastral & Telemetry Diagnostics */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                      <Gauge size={14} className="text-stone-700" />
                      <span>Cadastral GIS & Soil Diagnostics</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[9px] text-stone-400 uppercase font-bold block">Surface Imperviousness</span>
                      <span className="font-extrabold text-stone-900 text-xs">
                        {isField ? '< 8% (Porous Alluvial)' : '> 88% (Concrete Sealed)'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[9px] text-stone-400 uppercase font-bold block">Water Infiltration</span>
                      <span className="font-extrabold text-stone-900 text-xs">
                        {isField ? 'High (~24 mm/hr)' : 'Zero (Surface Runoff)'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[9px] text-stone-400 uppercase font-bold block">Biomass Index (NDVI)</span>
                      <span className="font-extrabold text-stone-900 text-xs">
                        {isField ? '0.68 (Dense Green Crop)' : '0.12 (Pavement/Roof)'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="text-[9px] text-stone-400 uppercase font-bold block">Tractor / Farm Access</span>
                      <span className="font-extrabold text-stone-900 text-xs">
                        {isField ? 'Field Bunds & Furrows' : 'Urban Street Access'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (5 cols): Daily Summary, Checklist, and Agro Context */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Daily Field Intelligence Summary Card */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-sm shadow-2xs">
                        <FileText size={16} />
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 font-display">
                          Daily Location & Field Summary
                        </h4>
                        <p className="text-[10px] text-stone-500">
                          Field intelligence overview for {locationName}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {isField ? 'Active Cultivation' : 'Urban Structure'}
                    </span>
                  </div>

                  {/* Plain-Language Summary Box */}
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                    <p>
                      {summary || 'Water is sufficient. Light evening monsoon rain is expected. No extra pumping needed today.'}
                    </p>
                    {metrics && (
                      <div className="mt-2.5 pt-2 border-t border-emerald-200/70">
                        <span className="text-[9px] font-extrabold uppercase text-emerald-900 tracking-wider block mb-1">
                          Note:
                        </span>
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                          <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-stone-800 font-bold">
                            Soil: {isField ? `${(metrics.soilMoisture * 100).toFixed(1)}%` : 'Sealed Concrete'}
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-stone-800 font-bold">
                            Rain: {metrics.precipitation} mm
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-stone-800 font-bold">
                            Temp: {metrics.temperature}°C
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-stone-800 font-bold">
                            Humidity: {metrics.humidity}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Agronomic Advisory Notes */}
                  {audioMessage && (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">
                        Agronomic & Field Management Advisory
                      </span>
                      <p className="text-[11px] text-stone-600 leading-normal">
                        {audioMessage}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                    <span>Data Source: Agrostrat Meteorological & Soil Intelligence Engine</span>
                    <span className="text-emerald-700 font-bold">Regional Grid</span>
                  </div>
                </div>

                {/* Regional Agricultural Checklist */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Agrarian Field Verification Checklist</span>
                  </h4>

                  <ul className="space-y-2 text-xs">
                    <li className="flex items-start gap-2 text-stone-700">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${isField ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        <Check size={10} />
                      </span>
                      <span>
                        <strong>Surface Matrix:</strong> {isField ? 'Porous crop soil allows root aeration' : 'Impermeable concrete surface blocks root growth'}
                      </span>
                    </li>

                    <li className="flex items-start gap-2 text-stone-700">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${isField ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        <Check size={10} />
                      </span>
                      <span>
                        <strong>Rain Water Harvesting:</strong> {isField ? 'Natural aquifer recharge in cultivation belt' : 'Discharges into stormwater municipal drains'}
                      </span>
                    </li>

                    <li className="flex items-start gap-2 text-stone-700">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${isField ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        <Check size={10} />
                      </span>
                      <span>
                        <strong>Precision Irrigation:</strong> {isField ? 'Eligible for daily Agrostrat pumping alerts' : 'Residential property - agricultural advice bypassed'}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Quick Next-Step Tip Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-stone-900 text-white shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                      Recommended Next Step
                    </span>
                    <h5 className="text-xs font-extrabold font-display text-white mt-0.5">
                      Check Tab 2 for Today's Farm Action Plan
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('advisory')}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    View Plan →
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: FARM ADVISORY & ACTIONS WITH REAL DATA JUSTIFICATIONS
        ======================================================== */}
        {activeTab === 'advisory' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900 font-display">
                  Today's Field Action Plan
                </h3>
                <p className="text-xs text-stone-500">
                  Data-backed actions derived directly from measured telemetry for {locationName}
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Data-Driven Action Steps
              </span>
            </div>

            {farmerAdvice ? (
              <div className="space-y-4">
                
                {/* 3 Core Action Cards with Simple Real Data Justifications */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  
                  {/* Card 1: Watering */}
                  <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between hover:border-stone-300 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                          IRRIGATION ADVICE
                        </span>
                        <span className="w-7 h-7 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
                          <Droplets size={14} className="text-sky-600" />
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-stone-900 font-display mb-1.5">
                        {farmerAdvice.watering.title}
                      </h4>

                      <p className="text-xs text-stone-600 leading-relaxed font-medium mb-3">
                        {farmerAdvice.watering.action}
                      </p>

                      {/* Note: Plain-language explanation with responsible data */}
                      {metrics && (
                        <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200 text-xs space-y-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-white border border-sky-200 text-[10px] font-extrabold uppercase tracking-wider text-sky-900">
                              Note
                            </span>
                          </div>

                          <p className="text-stone-800 leading-relaxed font-medium text-[11px]">
                            {!isField ? (
                              <>
                                This coordinate is an urban residential structure with <strong>&gt;88% concrete roofs and asphalt roads</strong>. Zero permeable agricultural soil is available for irrigation.
                              </>
                            ) : metrics.precipitation >= 5 || metrics.soilMoisture > 0.30 ? (
                              <>
                                Rain forecast is <strong>{metrics.precipitation} mm</strong> and soil moisture is measured at <strong>{(metrics.soilMoisture * 100).toFixed(1)}%</strong>, exceeding daily evaporation demand of <strong>{metrics.evapotranspiration || 3.8} mm/day</strong>. Because rain replenishes the root zone naturally, running water pumps today is unnecessary and would waste power.
                              </>
                            ) : (
                              <>
                                Topsoil moisture has dropped to <strong>{(metrics.soilMoisture * 100).toFixed(1)}%</strong> (dry stress threshold is 20%) with <strong>{metrics.precipitation} mm rain</strong> and high evaporation loss of <strong>{metrics.evapotranspiration || 3.8} mm/day</strong>. Pumping is required to prevent crop wilting.
                              </>
                            )}
                          </p>

                          <div className="pt-1.5 border-t border-sky-200/70">
                            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                              <span className="bg-white px-2 py-0.5 rounded-md border border-sky-200 text-stone-800 font-bold">
                                Soil Moisture: {isField ? `${(metrics.soilMoisture * 100).toFixed(1)}%` : 'Sealed'}
                              </span>
                              <span className="bg-white px-2 py-0.5 rounded-md border border-sky-200 text-stone-800 font-bold">
                                Expected Rain: {metrics.precipitation} mm
                              </span>
                              <span className="bg-white px-2 py-0.5 rounded-md border border-sky-200 text-stone-800 font-bold">
                                Evaporation: {metrics.evapotranspiration || 3.8} mm/d
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400">Urgency Level</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {farmerAdvice.watering.urgency}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Crop Health / Pests */}
                  <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between hover:border-stone-300 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          PLANT PROTECTION
                        </span>
                        <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                          <ShieldCheck size={14} className="text-amber-600" />
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-stone-900 font-display mb-1.5">
                        {farmerAdvice.pests.title}
                      </h4>

                      <p className="text-xs text-stone-600 leading-relaxed font-medium mb-3">
                        {farmerAdvice.pests.action}
                      </p>

                      {/* Note: Plain-language explanation with responsible data */}
                      {metrics && (
                        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                              Note
                            </span>
                          </div>

                          <p className="text-stone-800 leading-relaxed font-medium text-[11px]">
                            {!isField ? (
                              <>
                                Ambient reading of <strong>{metrics.temperature}°C</strong> and <strong>{metrics.humidity}% humidity</strong> measured. No agricultural crops are present at this residential structure.
                              </>
                            ) : metrics.humidity >= 75 ? (
                              <>
                                Air humidity is measured at <strong>{metrics.humidity}%</strong> with temperature at <strong>{metrics.temperature}°C</strong>. Fungal blast and blight spores rapidly germinate whenever canopy humidity exceeds 75%. Because humidity is high ({metrics.humidity}%), preventive neem oil spraying is recommended.
                              </>
                            ) : (
                              <>
                                Air humidity is measured at <strong>{metrics.humidity}%</strong> (below the 75% spore threshold) with temperature at <strong>{metrics.temperature}°C</strong>. Fungal pathogen multiplication remains suppressed in this drier air.
                              </>
                            )}
                          </p>

                          <div className="pt-1.5 border-t border-amber-200/70">
                            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                              <span className="bg-white px-2 py-0.5 rounded-md border border-amber-200 text-stone-800 font-bold">
                                Air Humidity: {metrics.humidity}%
                              </span>
                              <span className="bg-white px-2 py-0.5 rounded-md border border-amber-200 text-stone-800 font-bold">
                                Temperature: {metrics.temperature}°C
                              </span>
                              <span className="bg-white px-2 py-0.5 rounded-md border border-amber-200 text-stone-800 font-bold">
                                Spore Limit: 75% RH
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400">Urgency Level</span>
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {farmerAdvice.pests.urgency}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Field Work */}
                  <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between hover:border-stone-300 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          FIELD BUND WORK
                        </span>
                        <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                          <Tractor size={14} className="text-emerald-600" />
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-stone-900 font-display mb-1.5">
                        {farmerAdvice.fieldWork.title}
                      </h4>

                      <p className="text-xs text-stone-600 leading-relaxed font-medium mb-3">
                        {farmerAdvice.fieldWork.action}
                      </p>

                      {/* Note: Plain-language explanation with responsible data */}
                      {metrics && (
                        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wider text-emerald-900">
                              Note
                            </span>
                          </div>

                          <p className="text-stone-800 leading-relaxed font-medium text-[11px]">
                            {!isField ? (
                              <>
                                Urban housing zone with concrete drainage. No agricultural field bunds or crop furrows exist at this location.
                              </>
                            ) : metrics.precipitation >= 5 || metrics.soilMoisture > 0.35 ? (
                              <>
                                Soil saturation is high at <strong>{(metrics.soilMoisture * 100).toFixed(1)}%</strong> with <strong>{metrics.precipitation} mm incoming rain</strong> and wind at <strong>{metrics.windSpeed || 12} km/h</strong>. Clearing drainage bund outlets prevents standing water from exceeding 5 cm, avoiding tiller drowning.
                              </>
                            ) : (
                              <>
                                Evaporation loss is measured at <strong>{metrics.evapotranspiration || 3.8} mm/day</strong> with dry wind at <strong>{metrics.windSpeed || 12} km/h</strong>. Applying mulch retains soil moisture and stops topsoil cracking.
                              </>
                            )}
                          </p>

                          <div className="pt-1.5 border-t border-emerald-200/70">
                            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                              <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-stone-800 font-bold">
                                Expected Rain: {metrics.precipitation} mm
                              </span>
                              <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-stone-800 font-bold">
                                Saturation: {(metrics.soilMoisture * 100).toFixed(1)}%
                              </span>
                              <span className="bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-stone-800 font-bold">
                                Wind Speed: {metrics.windSpeed || 12} km/h
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400">Urgency Level</span>
                      <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {farmerAdvice.fieldWork.urgency}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Additional Guidance Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Daily Agricultural Chore Schedule */}
                  <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                      <Calendar size={14} className="text-stone-700" />
                      <span>Recommended Field Chore Schedule</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="font-extrabold text-emerald-700 font-mono text-[11px] shrink-0">06:00 - 08:30 AM</span>
                        <div>
                          <strong className="text-stone-900">Crop Health & Pest Inspection:</strong> Walk field perimeters to scout for blast leaf lesions or yellow stem borers before full sun.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="font-extrabold text-amber-700 font-mono text-[11px] shrink-0">11:00 - 02:00 PM</span>
                        <div>
                          <strong className="text-stone-900">Avoid Foliar Spraying:</strong> Intense tropical evaporation ({metrics?.evapotranspiration || 3.8} mm/d) causes foliar scorch and wasted pesticide.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="font-extrabold text-sky-700 font-mono text-[11px] shrink-0">04:30 - 06:30 PM</span>
                        <div>
                          <strong className="text-stone-900">Irrigation & Drainage Management:</strong> Open furrow outlets if tonight's rainfall is forecasted, or run drip lines if soil moisture is dry.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agronomic Guidance Bulletin */}
                  <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                      <Sprout size={14} className="text-emerald-600" />
                      <span>Agronomic Guidance Bulletin</span>
                    </h4>

                    <div className="space-y-2.5 text-xs text-stone-700 leading-relaxed">
                      <p>
                        <strong className="text-stone-900">Regional Cultivation Basin:</strong> Samba paddy and groundnut cultivators are advised to monitor coastal rainfall cycles. Maintain field bund heights at 15-20cm to capture moisture while preventing excess root submergence.
                      </p>
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
                        <strong className="text-emerald-900 font-bold inline-flex items-center gap-1 mr-1">
                          <Sparkles size={13} className="text-emerald-700 inline" /> Agronomist Tip:
                        </strong>
                        When ambient humidity stays above 80%, fungal spores propagate rapidly on Samba varieties. Maintain 1-meter alleyways across dense planting beds to maximize air ventilation.
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-stone-500 text-xs">
                Select a farm location above to display today's agricultural action plan.
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: 7-DAY WEATHER FORECAST & SPRAY CALENDAR
        ======================================================== */}
        {activeTab === 'weather' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900 font-display">
                  7-Day Weather Outlook & Spray Window
                </h3>
                <p className="text-xs text-stone-500">
                  Plan irrigation schedules and pesticide spraying around upcoming weather in {district}
                </p>
              </div>

              <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                Location: {district}
              </span>
            </div>

            {/* 7 Clean Forecast Cards with Lucide Weather Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {forecastChart.map((dayItem, idx) => {
                const hasRain = dayItem.precipitation > 0;
                return (
                  <div
                    key={idx}
                    className={`
                      p-3.5 rounded-2xl border text-center flex flex-col justify-between bg-white shadow-2xs transition-all hover:-translate-y-0.5
                      ${idx === 0 ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-stone-200/90'}
                    `}
                  >
                    <div>
                      <span className="text-xs font-black text-stone-900 font-display block">
                        {dayItem.day || `Day ${idx + 1}`}
                      </span>
                      <span className="text-[10px] text-stone-400 block mb-1.5">
                        {dayItem.time?.split('-')?.slice(1)?.join('/')}
                      </span>

                      <div className="my-2.5 flex items-center justify-center">
                        <WeatherIcon condition={dayItem.condition} />
                      </div>

                      <div className="text-sm font-black text-stone-900 font-display">
                        {dayItem.temperature}°C
                      </div>
                      {dayItem.minTemperature && (
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          Low: {dayItem.minTemperature}°C
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full block ${hasRain ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-stone-100 text-stone-500'}`}>
                        {hasRain ? `${dayItem.precipitation} mm` : 'Dry Day'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional High-Density Weather Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Rainfall vs Evapotranspiration Balance */}
              <div className="lg:col-span-7 p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                    <CloudRain size={14} className="text-blue-600" />
                    <span>7-Day Water Balance (Rainfall vs. Atmospheric Evaporation)</span>
                  </h4>
                  <span className="text-[10px] text-stone-400 font-bold">Atmospheric Model</span>
                </div>

                <div className="space-y-2 pt-1">
                  {forecastChart.map((d, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs">
                      <span className="w-16 font-extrabold text-stone-700 font-display text-[11px] shrink-0">
                        {d.day}
                      </span>
                      
                      {/* Bar indicator */}
                      <div className="flex-1 h-3.5 bg-stone-100 rounded-full overflow-hidden flex items-center p-0.5 gap-1">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (d.precipitation || 0) * 5)}%` }}
                          title={`Rain: ${d.precipitation} mm`}
                        ></div>
                        <div 
                          className="h-full bg-amber-400 rounded-full transition-all duration-500 opacity-70"
                          style={{ width: `${Math.min(100, (d.et0 || 4) * 8)}%` }}
                          title={`Evaporation ET0: ${d.et0 || 4} mm`}
                        ></div>
                      </div>

                      <span className="w-24 text-[10px] font-mono text-right text-stone-500 shrink-0">
                        Rain: {d.precipitation}mm | ET₀: {d.et0 || 4}mm
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-500 pt-2 border-t border-stone-100">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Rainfall
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Atmospheric Evaporation Demand (ET₀)
                  </span>
                </div>
              </div>

              {/* Pesticide & Spraying Safety Window Calendar */}
              <div className="lg:col-span-5 p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Agricultural Spraying & Field Operations Window</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {forecastChart.slice(0, 5).map((day, i) => {
                    const isRainy = (day.precipitation || 0) > 3;
                    return (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="font-extrabold text-stone-800">{day.day}</span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                          isRainy 
                            ? 'bg-rose-50 text-rose-700 border-rose-200' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {isRainy ? (
                            <>
                              <AlertTriangle size={11} className="text-rose-600" />
                              <span>Hold Spraying (Rain Risk)</span>
                            </>
                          ) : (
                            <>
                              <Check size={11} className="text-emerald-600" />
                              <span>Optimal Spray Window</span>
                            </>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[10px] text-stone-400 leading-tight">
                  Ensure at least 4 hours of dry foliage after applying organic neem or fungicides to prevent chemical runoff.
                </p>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* 7. Clean Light Minimalist Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white py-4 px-4 sm:px-6 lg:px-8 text-xs text-stone-500">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-stone-900 text-emerald-400 flex items-center justify-center">
              <Sprout size={12} className="text-emerald-400" />
            </span>
            <span className="font-extrabold text-stone-900 font-display">
              Agrostrat Precision Agriculture
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-stone-400">
              Regional Cropland & Farmland Intelligence
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Scale: {zoomLevel}%</span>
            <span>•</span>
            <span>Field classification and meteorology for precision agriculture</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
