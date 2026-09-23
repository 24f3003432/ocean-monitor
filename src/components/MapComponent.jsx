import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  INCIDENT_METADATA, 
  DRIFT_TRAJECTORY_COORDS, 
  CLEANUP_SECTORS,
  DEBRIS_TYPES,
  INCOIS_DRIFT_TIMELINE
} from '../data/mscElsaDebrisData';

// Basemap URLs
const BASEMAP_URLS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  },
  ocean: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
    maxZoom: 13
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }
};

export default function MapComponent({
  debrisList,
  layers,
  basemap,
  selectedDebris,
  onSelectDebris,
  currentTimelineIndex,
  mapCenterFocus,
  onSpotClick,
  activeSpot
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  
  // Layer group references
  const debrisLayerGroupRef = useRef(null);
  const trajectoryLayerGroupRef = useRef(null);
  const sinkingLayerGroupRef = useRef(null);
  const sectorsLayerGroupRef = useRef(null);
  const timelinePlumeGroupRef = useRef(null);
  const currentVectorsGroupRef = useRef(null);
  const activeSpotPinGroupRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Southwest India (Kerala to Tamil Nadu / Dhanushkodi corridor)
    const map = L.map(mapContainerRef.current, {
      center: [9.0, 77.2],
      zoom: 8,
      minZoom: 6,
      maxZoom: 18,
      zoomControl: false
    });

    // Add zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer
    const config = BASEMAP_URLS[basemap] || BASEMAP_URLS.satellite;
    tileLayerRef.current = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom
    }).addTo(map);

    // Create Layer Groups
    sinkingLayerGroupRef.current = L.layerGroup().addTo(map);
    trajectoryLayerGroupRef.current = L.layerGroup().addTo(map);
    sectorsLayerGroupRef.current = L.layerGroup().addTo(map);
    debrisLayerGroupRef.current = L.layerGroup().addTo(map);
    timelinePlumeGroupRef.current = L.layerGroup().addTo(map);
    currentVectorsGroupRef.current = L.layerGroup().addTo(map);
    activeSpotPinGroupRef.current = L.layerGroup().addTo(map);

    // Click handler for any ocean spot
    map.on('click', (e) => {
      if (onSpotClick) {
        onSpotClick({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          isDebris: false,
          notes: `Inspecting ocean coordinates at ${e.latlng.lat.toFixed(4)}°N, ${e.latlng.lng.toFixed(4)}°E. High-resolution satellite snapshot requested in real time.`
        });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap Tiles
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const config = BASEMAP_URLS[basemap] || BASEMAP_URLS.satellite;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom
    }).addTo(mapInstanceRef.current);
  }, [basemap]);

  // Handle camera focus props
  useEffect(() => {
    if (!mapInstanceRef.current || !mapCenterFocus) return;
    mapInstanceRef.current.flyTo(mapCenterFocus.coords, mapCenterFocus.zoom || 11, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [mapCenterFocus]);

  // Render Sinking Origin of MSC ELSA 3
  useEffect(() => {
    if (!sinkingLayerGroupRef.current) return;
    sinkingLayerGroupRef.current.clearLayers();

    if (!layers.sinkingOrigin) return;

    const { lat, lng } = INCIDENT_METADATA.incidentLocation;

    // Pulsing Radar Ring
    const radarIcon = L.divIcon({
      className: 'radar-marker',
      html: `
        <div class="relative flex items-center justify-center w-12 h-12">
          <div class="absolute w-12 h-12 rounded-full bg-red-600 opacity-60 radar-ping"></div>
          <div class="absolute w-8 h-8 rounded-full bg-red-500 opacity-80 animate-ping"></div>
          <div class="relative w-7 h-7 rounded-full bg-gradient-to-tr from-red-700 to-rose-500 border-2 border-white shadow-xl flex items-center justify-center text-white">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 1 2-1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1a2.4 2.4 0 0 1 2-1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2-1"/>
              <path d="M4 18L3 13h18l-1 5"/>
              <path d="M12 4v9"/>
              <path d="M8 8h8"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    const marker = L.marker([lat, lng], { icon: radarIcon });
    marker.bindPopup(`
      <div class="p-2 space-y-2 text-xs">
        <div class="flex items-center space-x-2">
          <span class="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30 text-[10px] uppercase">
            INCIDENT ORIGIN
          </span>
          <span class="text-[10px] text-slate-400">25 May 2025</span>
        </div>
        <h3 class="font-bold text-white text-sm">${INCIDENT_METADATA.vesselName} Sinking Site</h3>
        <p class="text-slate-300 leading-snug">${INCIDENT_METADATA.incidentLocation.description}</p>
        <div class="bg-ocean-950/80 p-2 rounded border border-ocean-700/80 space-y-1 font-mono text-[11px]">
          <div class="text-cyan-300">Lat/Lng: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E</div>
          <div class="text-amber-300">Cargo Lost: Plastic resin pellets & containers</div>
          <div class="text-emerald-300">Depth: ~45 meters</div>
        </div>
      </div>
    `);

    sinkingLayerGroupRef.current.addLayer(marker);
  }, [layers.sinkingOrigin]);

  // Render INCOIS SARAT Drift Trajectory
  useEffect(() => {
    if (!trajectoryLayerGroupRef.current) return;
    trajectoryLayerGroupRef.current.clearLayers();

    if (!layers.driftTrajectory) return;

    // Outer glow polyline
    const glowLine = L.polyline(DRIFT_TRAJECTORY_COORDS, {
      color: '#06b6d4',
      weight: 8,
      opacity: 0.25,
      lineCap: 'round',
      lineJoin: 'round'
    });

    // Core animated dashed line
    const coreLine = L.polyline(DRIFT_TRAJECTORY_COORDS, {
      color: '#38bdf8',
      weight: 3.5,
      opacity: 0.95,
      dashArray: '10, 8',
      className: 'drift-flow-line'
    });

    coreLine.bindTooltip('INCOIS SARAT Ocean Current Drift Path (Kochi to Dhanushkodi)', {
      sticky: true,
      className: 'bg-ocean-900 text-cyan-300 border border-cyan-500 font-mono text-xs'
    });

    trajectoryLayerGroupRef.current.addLayer(glowLine);
    trajectoryLayerGroupRef.current.addLayer(coreLine);
  }, [layers.driftTrajectory]);

  // Render Clean-up Sectors
  useEffect(() => {
    if (!sectorsLayerGroupRef.current) return;
    sectorsLayerGroupRef.current.clearLayers();

    if (!layers.cleanupSectors) return;

    CLEANUP_SECTORS.forEach(sec => {
      const circle = L.circle(sec.coordinates, {
        radius: sec.radiusKm * 1000,
        color: sec.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b',
        weight: 1.5,
        dashArray: '4, 4',
        fillColor: sec.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b',
        fillOpacity: 0.08
      });

      circle.bindPopup(`
        <div class="p-2 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-mono text-cyan-400 font-bold">${sec.sectorId}</span>
            <span class="px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
              sec.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
            }">${sec.priority} PRIORITY</span>
          </div>
          <h4 class="font-bold text-white text-sm">${sec.name}</h4>
          <p class="text-slate-300">${sec.recommendedAction}</p>
          <div class="bg-ocean-950 p-2 rounded text-[11px] text-slate-300 space-y-0.5">
            <div>Vessel: <strong class="text-cyan-300">${sec.vesselAssigned}</strong></div>
            <div>Debris Est: <strong class="text-amber-300 font-mono">~${sec.estDebrisTons} tons</strong></div>
          </div>
        </div>
      `);

      sectorsLayerGroupRef.current.addLayer(circle);
    });
  }, [layers.cleanupSectors]);

  // Render Ocean Current Vectors
  useEffect(() => {
    if (!currentVectorsGroupRef.current) return;
    currentVectorsGroupRef.current.clearLayers();

    if (!layers.currentVectors) return;

    // Simulated ocean surface current vector markers at key points along the shelf
    const vectorPoints = [
      { pos: [9.70, 75.85], bearing: 165, speed: "1.4 kts", label: "West India Coastal Current" },
      { pos: [9.20, 76.10], bearing: 160, speed: "1.2 kts", label: "Equatorward Coastal Jet" },
      { pos: [8.65, 76.40], bearing: 150, speed: "1.1 kts", label: "WICC Shelf Flow" },
      { pos: [8.10, 77.20], bearing: 130, speed: "1.6 kts", label: "Cape Comorin Deflection" },
      { pos: [8.20, 77.85], bearing: 80, speed: "1.5 kts", label: "Southwest Monsoon Current" },
      { pos: [8.80, 78.60], bearing: 55, speed: "1.0 kts", label: "Gulf of Mannar Drift" },
      { pos: [9.20, 79.15], bearing: 45, speed: "0.8 kts", label: "Palk Strait Jet" }
    ];

    vectorPoints.forEach(pt => {
      const arrowIcon = L.divIcon({
        className: 'current-vector-icon',
        html: `
          <div class="flex items-center space-x-1 cursor-pointer group" style="transform: rotate(${pt.bearing - 90}deg);">
            <div class="w-8 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-white shadow"></div>
            <div class="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-white"></div>
          </div>
        `,
        iconSize: [40, 20],
        iconAnchor: [20, 10]
      });

      const marker = L.marker(pt.pos, { icon: arrowIcon });
      marker.bindTooltip(`Current: ${pt.speed} (${pt.bearing}°) &bull; ${pt.label}`, {
        className: 'bg-ocean-950 text-cyan-300 border border-cyan-500/50 text-[10px] font-mono'
      });
      currentVectorsGroupRef.current.addLayer(marker);
    });
  }, [layers.currentVectors]);

  // Render Simulation Plume Circle based on Timeline
  useEffect(() => {
    if (!timelinePlumeGroupRef.current) return;
    timelinePlumeGroupRef.current.clearLayers();

    const currentStep = INCOIS_DRIFT_TIMELINE[currentTimelineIndex];
    if (!currentStep) return;

    const dispersionCircle = L.circle(currentStep.center, {
      radius: currentStep.plumeSpreadRadiusM,
      color: '#f59e0b',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#f59e0b',
      fillOpacity: 0.15
    });

    dispersionCircle.bindTooltip(`Simulation Plume: ${currentStep.label} (~${(currentStep.plumeSpreadRadiusM / 1000).toFixed(1)} km)`, {
      sticky: true,
      className: 'bg-ocean-950 text-amber-300 border border-amber-500/50 font-mono text-xs'
    });

    timelinePlumeGroupRef.current.addLayer(dispersionCircle);
  }, [currentTimelineIndex]);

  // Render AI Debris Detections
  useEffect(() => {
    if (!debrisLayerGroupRef.current) return;
    debrisLayerGroupRef.current.clearLayers();

    if (!layers.debrisClusters) return;

    debrisList.forEach(debris => {
      const typeDef = DEBRIS_TYPES[debris.debrisType.toUpperCase()] || {
        color: '#38bdf8'
      };

      const isCritical = debris.priority === 'CRITICAL';
      const confPercent = Math.round(debris.confidence * 100);

      const markerHtml = `
        <div class="relative group cursor-pointer">
          ${isCritical ? '<div class="absolute -inset-2 rounded-full bg-red-500/30 animate-ping"></div>' : ''}
          <div 
            class="w-7 h-7 rounded-xl flex items-center justify-center text-white font-bold text-[10px] shadow-lg border-2 transition-transform transform group-hover:scale-125"
            style="background: ${typeDef.color}; border-color: #ffffff;"
          >
            ${confPercent}%
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-ocean-950/90 text-[9px] font-mono text-slate-200 px-1.5 py-0.5 rounded border border-ocean-700 whitespace-nowrap shadow-md hidden group-hover:block z-50">
            ${debris.name.substring(0, 18)}...
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'debris-detection-marker',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(debris.coordinates, { icon: customIcon });

      // Interactive popup
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 space-y-2 text-xs max-w-xs';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
            isCritical ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }">${debris.priority} PRIORITY</span>
          <span class="font-mono text-emerald-400 font-bold">${confPercent}% Conf</span>
        </div>
        <h4 class="font-bold text-white text-sm leading-tight">${debris.name}</h4>
        <div class="text-[11px] text-slate-300 space-y-0.5">
          <div>Class: <strong class="text-amber-300">${typeDef.label}</strong></div>
          <div>Footprint: <strong class="text-cyan-300">${(debris.area_sqm / 10000).toFixed(1)} ha</strong> (${debris.estimatedWeightTons}t)</div>
          <div>FDI Index: <strong class="text-purple-300 font-mono">${debris.spectralIndices.fdi}</strong></div>
          <div>SAR Anomaly: <strong class="text-emerald-300 font-mono">${debris.spectralIndices.sar_backscatter_anomaly}</strong></div>
        </div>
        <button id="inspect-btn-${debris.id}" class="w-full mt-2 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all">
          Inspect AI Spectral Profile
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`inspect-btn-${debris.id}`);
        if (btn) {
          btn.onclick = () => onSelectDebris(debris);
        }
      });

      marker.on('click', () => {
        if (onSpotClick) {
          onSpotClick({
            ...debris,
            lat: debris.coordinates[0],
            lng: debris.coordinates[1],
            isDebris: true
          });
        }
      });

      debrisLayerGroupRef.current.addLayer(marker);
    });
  }, [debrisList, layers.debrisClusters, onSelectDebris, onSpotClick]);

  // Render Target Reticle Pin on activeSpot
  useEffect(() => {
    if (!activeSpotPinGroupRef.current) return;
    activeSpotPinGroupRef.current.clearLayers();

    if (!activeSpot) return;

    const crosshairIcon = L.divIcon({
      className: 'active-spot-crosshair',
      html: `
        <div class="relative flex items-center justify-center w-10 h-10">
          <div class="absolute w-10 h-10 rounded-full border-2 border-cyan-400 animate-ping opacity-75"></div>
          <div class="absolute w-6 h-6 rounded-full bg-cyan-500/30 border border-cyan-300"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white shadow-lg"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = L.marker([activeSpot.lat, activeSpot.lng], { icon: crosshairIcon });
    activeSpotPinGroupRef.current.addLayer(marker);
  }, [activeSpot]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
}
