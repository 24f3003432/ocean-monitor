import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapComponent from './components/MapComponent';
import WeatherWidget from './components/WeatherWidget';
import DriftTimelineSlider from './components/DriftTimelineSlider';
import DebrisDetailModal from './components/DebrisDetailModal';
import SpotImageryInspector from './components/SpotImageryInspector';
import { DEBRIS_DETECTIONS, INCIDENT_METADATA } from './data/mscElsaDebrisData';
import { fetchLiveOceanConditions } from './services/marineWeatherApi';
import { Bell, CheckCircle2, ShieldAlert, Sparkles, Navigation2 } from 'lucide-react';

export default function App() {
  // AI/ML Filtering State
  const [filters, setFilters] = useState({
    minConfidence: 0.75,
    types: ['nurdle', 'container', 'sheet', 'gear'],
    priority: 'ALL'
  });

  // GIS Layer Visibility State
  const [layers, setLayers] = useState({
    debrisClusters: true,
    sinkingOrigin: true,
    driftTrajectory: true,
    cleanupSectors: true,
    currentVectors: true,
    shorelineAlerts: true
  });

  // Basemap selection
  const [basemap, setBasemap] = useState('satellite');

  // Selected debris cluster for detailed spectral analysis modal
  const [selectedDebris, setSelectedDebris] = useState(null);

  // Timeline slider index for INCOIS SARAT simulation (0 to 4)
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);

  // Active spot inspected via real-time satellite imagery
  const [activeSpot, setActiveSpot] = useState({
    lat: 9.8724,
    lng: 76.0152,
    isDebris: true,
    confidence: 0.96,
    distanceOffshoreNm: 13.0,
    notes: "MSC ELSA 3 sinking epicenter. Real-time satellite imagery centered on high-density flotsam and nurdles dispersion."
  });

  // Dynamic list of debris including any user-pinned spots
  const [customDebrisList, setCustomDebrisList] = useState([]);

  // Map camera focus state { coords, zoom }
  const [mapCenterFocus, setMapCenterFocus] = useState(null);

  // Live Marine & Meteorological conditions
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  // Operational notification toast
  const [toastMessage, setToastMessage] = useState(null);

  // Load live ocean conditions
  const loadOceanData = async () => {
    setLoadingWeather(true);
    const data = await fetchLiveOceanConditions(
      INCIDENT_METADATA.incidentLocation.lat,
      INCIDENT_METADATA.incidentLocation.lng
    );
    setWeatherData(data);
    setLoadingWeather(false);
  };

  useEffect(() => {
    loadOceanData();
  }, []);

  // Filtered debris list based on user controls
  const allDebris = useMemo(() => {
    return [...DEBRIS_DETECTIONS, ...customDebrisList];
  }, [customDebrisList]);

  const filteredDebris = useMemo(() => {
    return allDebris.filter(item => {
      const matchConfidence = item.confidence >= filters.minConfidence;
      const matchType = filters.types.includes(item.debrisType);
      const matchPriority = filters.priority === 'ALL' || item.priority === filters.priority;
      return matchConfidence && matchType && matchPriority;
    });
  }, [allDebris, filters]);

  // Aggregate metrics
  const criticalCount = useMemo(() => {
    return filteredDebris.filter(d => d.priority === 'CRITICAL').length;
  }, [filteredDebris]);

  const totalEstimatedWeight = useMemo(() => {
    return filteredDebris.reduce((acc, d) => acc + d.estimatedWeightTons, 0);
  }, [filteredDebris]);

  // Handle spot click anywhere on map or debris point
  const handleSpotClick = (spotData) => {
    setActiveSpot(spotData);
    showToast(`Streaming real-time satellite imagery for [${spotData.lat.toFixed(4)}°N, ${spotData.lng.toFixed(4)}°E]`);
  };

  // Add custom pinned debris from spot inspector
  const handleAddCustomDetection = ({ lat, lng }) => {
    const newId = `ANOMALY-${Date.now().toString().slice(-4)}`;
    const newDebris = {
      id: newId,
      name: `Tagged Marine Flotsam Anomaly (${lat.toFixed(3)}°N)`,
      coordinates: [lat, lng],
      debrisType: "nurdle",
      confidence: 0.88,
      area_sqm: 42000,
      estimatedWeightTons: 12.5,
      densityIndex: "Suspicious Surface Anomaly (FDI Spiked)",
      priority: "HIGH",
      cleanUpFeasibility: "Drone Survey & Surface Booming",
      detectedBy: "User Target Reticle + Sentinel FDI Real-Time Pipeline",
      spectralIndices: {
        fdi: 0.041,
        ndpi: 0.33,
        ndvi_offset: -0.11,
        sar_backscatter_anomaly: "+3.4 dB"
      },
      detectionDate: new Date().toISOString().replace('T', ' ').substring(0, 16) + " UTC",
      driftSpeedKnots: 1.1,
      driftBearingDeg: 155,
      distanceOffshoreNm: 7.2,
      shorelineRisk: "Monitored via INCOIS trajectory",
      notes: "Newly identified floating plastic slick confirmed via real-time satellite spot inspector."
    };

    setCustomDebrisList(prev => [newDebris, ...prev]);
    setActiveSpot({ ...newDebris, lat, lng, isDebris: true });
    showToast(`Pinned new debris anomaly #${newId} to GIS tracker!`);
  };

  // Reset map view
  const handleResetView = () => {
    setMapCenterFocus({
      coords: [9.0, 77.2],
      zoom: 8
    });
  };

  // Center on specific debris item
  const handleSelectDebris = (debris) => {
    setSelectedDebris(debris);
    setMapCenterFocus({
      coords: debris.coordinates,
      zoom: 12
    });
  };

  // Focus clean-up sector
  const handleFocusSector = (sector) => {
    setMapCenterFocus({
      coords: sector.coordinates,
      zoom: 11
    });
    showToast(`Focused Clean-Up Sector: ${sector.name} (${sector.sectorId})`);
  };

  // Focus timeline coordinates
  const handleFocusCoordinates = (coords, zoom = 10) => {
    setMapCenterFocus({
      coords,
      zoom
    });
  };

  // Export GeoJSON
  const handleExportGeoJSON = () => {
    const geojson = {
      type: "FeatureCollection",
      metadata: {
        incident: INCIDENT_METADATA.vesselName,
        exportTimestamp: new Date().toISOString(),
        totalDetections: filteredDebris.length,
        crs: "EPSG:4326"
      },
      features: filteredDebris.map(d => ({
        type: "Feature",
        id: d.id,
        geometry: {
          type: "Point",
          coordinates: [d.coordinates[1], d.coordinates[0]] // GeoJSON standard [lng, lat]
        },
        properties: {
          name: d.name,
          debrisType: d.debrisType,
          confidence: d.confidence,
          area_sqm: d.area_sqm,
          estimatedWeightTons: d.estimatedWeightTons,
          densityIndex: d.densityIndex,
          priority: d.priority,
          cleanUpFeasibility: d.cleanUpFeasibility,
          fdi: d.spectralIndices.fdi,
          ndpi: d.spectralIndices.ndpi,
          sarBackscatter: d.spectralIndices.sar_backscatter_anomaly,
          detectionDate: d.detectionDate
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `marine_plastic_debris_${INCIDENT_METADATA.vesselName.replace(/\s+/g, '_')}_${Date.now()}.geojson`;
    link.click();
    URL.revokeObjectURL(url);

    showToast("Exported GeoJSON for INCOIS / Indian Coast Guard response!");
  };

  // Dispatch alert handler
  const handleDispatchAlert = (debris) => {
    showToast(`Response unit alerted for ${debris.name} [${debris.coordinates[0].toFixed(2)}°N, ${debris.coordinates[1].toFixed(2)}°E]`);
  };

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-ocean-950 text-slate-100 font-sans">
      {/* Top Navigation & Status Bar */}
      <Header
        totalDetections={filteredDebris.length}
        criticalCount={criticalCount}
        totalEstimatedWeight={totalEstimatedWeight}
        onResetView={handleResetView}
        onExportGeoJSON={handleExportGeoJSON}
        liveWeather={weatherData}
      />

      {/* Main Workspace: Sidebar + GIS Map */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Filter & Analysis Sidebar */}
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          layers={layers}
          setLayers={setLayers}
          basemap={basemap}
          setBasemap={setBasemap}
          debrisList={filteredDebris}
          onSelectDebris={handleSelectDebris}
          onFocusSector={handleFocusSector}
        />

        {/* Core Interactive Leaflet Map Area */}
        <div className="flex-1 h-full relative overflow-hidden">
          <MapComponent
            debrisList={filteredDebris}
            layers={layers}
            basemap={basemap}
            selectedDebris={selectedDebris}
            onSelectDebris={handleSelectDebris}
            currentTimelineIndex={currentTimelineIndex}
            mapCenterFocus={mapCenterFocus}
            onSpotClick={handleSpotClick}
            activeSpot={activeSpot}
          />

          {/* Interactive Spot Imagery Prompt Pill */}
          <div className="absolute top-4 left-4 z-20 glass-panel px-3 py-1.5 rounded-full border border-cyan-400/40 text-[11px] text-cyan-200 flex items-center gap-1.5 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Tap <strong>any spot</strong> on the ocean map to inspect actual real-time satellite imagery</span>
          </div>

          {/* Floating Live Ocean Conditions Card (Top-Right) */}
          <div className="absolute top-14 right-4 z-20">
            <WeatherWidget
              weatherData={weatherData}
              loading={loadingWeather}
              onRefresh={loadOceanData}
            />
          </div>

          {/* Floating Drift Simulation Slider (Bottom-Center) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] sm:w-auto">
            <DriftTimelineSlider
              currentStepIndex={currentTimelineIndex}
              onStepChange={setCurrentTimelineIndex}
              onFocusCoordinates={handleFocusCoordinates}
            />
          </div>

          {/* Floating Map Legend (Bottom-Left) */}
          <div className="hidden md:block absolute bottom-6 left-4 z-20 glass-panel p-3 rounded-xl border border-ocean-700/60 text-[11px] space-y-1.5 shadow-lg">
            <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5 mb-1">
              <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Map Legend</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow"></span>
              <span className="text-slate-300">Resin Pellets (Nurdles)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow"></span>
              <span className="text-slate-300">Macroplastic / Containers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-pink-500 shadow"></span>
              <span className="text-slate-300">Polymer Film / Sheeting</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow"></span>
              <span className="text-slate-300">Synthetic Strapping / Gear</span>
            </div>
            <div className="pt-1 border-t border-ocean-800 text-[10px] text-cyan-300">
              -- INCOIS SARAT Drift Vector
            </div>
          </div>
        </div>
      </div>

      {/* Spectral Breakdown & AI Detail Modal */}
      {selectedDebris && (
        <DebrisDetailModal
          debris={selectedDebris}
          onClose={() => setSelectedDebris(null)}
          onDispatchAlert={handleDispatchAlert}
        />
      )}

      {/* Real-Time Live Satellite Spot Inspector (when user taps anywhere on map) */}
      {activeSpot && (
        <SpotImageryInspector
          spot={activeSpot}
          onClose={() => setActiveSpot(null)}
          onAddCustomDetection={handleAddCustomDetection}
        />
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 glass-panel-elevated p-3.5 rounded-xl border border-cyan-400/50 shadow-2xl flex items-center space-x-3 text-xs text-white animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
