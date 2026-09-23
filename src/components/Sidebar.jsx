import React, { useState } from 'react';
import { 
  Filter, 
  Layers, 
  Map, 
  Sliders, 
  ChevronRight, 
  ChevronLeft,
  Ship,
  Sparkles,
  Compass,
  AlertCircle,
  Crosshair,
  ShieldAlert,
  Info
} from 'lucide-react';
import { DEBRIS_TYPES, CLEANUP_SECTORS } from '../data/mscElsaDebrisData';

export default function Sidebar({
  filters,
  setFilters,
  layers,
  setLayers,
  basemap,
  setBasemap,
  debrisList,
  onSelectDebris,
  onFocusSector
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('detections'); // 'detections' | 'cleanup' | 'layers'

  const toggleDebrisType = (typeKey) => {
    setFilters(prev => {
      const exists = prev.types.includes(typeKey);
      return {
        ...prev,
        types: exists 
          ? prev.types.filter(t => t !== typeKey) 
          : [...prev.types, typeKey]
      };
    });
  };

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  return (
    <aside 
      className={`relative z-20 h-full transition-all duration-300 flex flex-col ${
        collapsed ? 'w-12' : 'w-80 md:w-96'
      } bg-ocean-900/95 border-r border-ocean-700/60 backdrop-blur-md shadow-2xl`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-16 bg-ocean-700 border border-cyan-500/40 text-cyan-300 hover:text-white p-1 rounded-full shadow-lg z-30 transition-transform"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {collapsed ? (
        <div className="flex flex-col items-center py-6 space-y-6 text-slate-400">
          <button onClick={() => setCollapsed(false)} title="Filters">
            <Filter className="w-5 h-5 text-cyan-400" />
          </button>
          <button onClick={() => setCollapsed(false)} title="Layers">
            <Layers className="w-5 h-5 text-blue-400" />
          </button>
          <button onClick={() => setCollapsed(false)} title="Clean-up Sectors">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-ocean-800 bg-ocean-950/40 p-1 gap-1">
            <button
              onClick={() => setActiveTab('detections')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'detections'
                  ? 'bg-ocean-800 text-cyan-300 border border-cyan-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Detections ({debrisList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('cleanup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'cleanup'
                  ? 'bg-ocean-800 text-amber-300 border border-amber-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Clean-up ({CLEANUP_SECTORS.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('layers')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'layers'
                  ? 'bg-ocean-800 text-blue-300 border border-blue-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>
          </div>

          {/* Tab 1: Detections & AI Filters */}
          {activeTab === 'detections' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* AI Confidence Filter */}
              <div className="bg-ocean-950/70 p-3 rounded-xl border border-ocean-800">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Min. AI Confidence
                  </span>
                  <span className="font-mono font-bold text-cyan-300 text-sm">
                    {Math.round(filters.minConfidence * 100)}%
                  </span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.05"
                  value={filters.minConfidence}
                  onChange={(e) => setFilters(prev => ({ ...prev, minConfidence: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-ocean-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>50% (Permissive)</span>
                  <span>95% (Strict High Confidence)</span>
                </div>
              </div>

              {/* Debris Classification Filter */}
              <div className="bg-ocean-950/70 p-3 rounded-xl border border-ocean-800">
                <span className="font-semibold text-slate-200 block mb-2">
                  Debris Classification
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {Object.entries(DEBRIS_TYPES).map(([key, def]) => {
                    const active = filters.types.includes(def.id);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleDebrisType(def.id)}
                        className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                          active 
                            ? 'bg-ocean-800/80 border-cyan-500/40 text-slate-100 shadow-sm' 
                            : 'bg-ocean-950/40 border-ocean-800/80 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span 
                            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: def.color }}
                          />
                          <span className="text-[11px] font-medium leading-tight">{def.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={active}
                          readOnly
                          className="accent-cyan-400 cursor-pointer pointer-events-none"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detected Clusters List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-semibold px-1">
                  <span>AI Detections ({debrisList.length})</span>
                  <span className="text-[10px] text-slate-500">Click to center & inspect</span>
                </div>

                <div className="space-y-1.5">
                  {debrisList.map(debris => (
                    <div
                      key={debris.id}
                      onClick={() => onSelectDebris(debris)}
                      className="p-2.5 rounded-xl bg-ocean-950/60 hover:bg-ocean-800/80 border border-ocean-800 hover:border-cyan-500/40 cursor-pointer transition-all text-xs group"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-slate-200 group-hover:text-cyan-300 line-clamp-1">
                          {debris.name}
                        </h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ml-2 ${
                          debris.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {debris.priority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                        <span className="text-emerald-400 font-semibold">
                          {(debris.confidence * 100).toFixed(0)}% Conf
                        </span>
                        <span>{(debris.area_sqm / 10000).toFixed(1)} ha</span>
                        <span className="text-amber-300">{debris.estimatedWeightTons}t</span>
                      </div>
                    </div>
                  ))}
                  {debrisList.length === 0 && (
                    <div className="text-center py-6 text-slate-500 text-xs bg-ocean-950/40 rounded-xl border border-dashed border-ocean-800">
                      No debris matches current confidence or classification filters.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Clean-up Prioritization Sectors */}
          {activeTab === 'cleanup' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              <div className="bg-gradient-to-r from-red-950/40 to-ocean-950/80 p-3 rounded-xl border border-red-500/30">
                <div className="flex items-center gap-1.5 font-bold text-red-300 mb-1">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Targeted Removal Protocol</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Priority zones calculated from INCOIS hydrodynamic drift models, proximity to marine sanctuaries, and high-density pellet landfall predictions.
                </p>
              </div>

              {CLEANUP_SECTORS.map(sec => (
                <div 
                  key={sec.sectorId}
                  onClick={() => onFocusSector(sec)}
                  className="bg-ocean-950/70 hover:bg-ocean-800 p-3 rounded-xl border border-ocean-800 hover:border-amber-500/40 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">{sec.sectorId}</span>
                      <h4 className="font-bold text-slate-100 text-xs">{sec.name}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                      {sec.priority}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-normal">
                    {sec.recommendedAction}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-ocean-800/80">
                    <span className="text-cyan-300">Vessel: {sec.vesselAssigned}</span>
                    <span className="text-amber-300 font-mono font-bold">~{sec.estDebrisTons}t</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: GIS Layers & Basemaps */}
          {activeTab === 'layers' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* Basemap Selection */}
              <div className="bg-ocean-950/70 p-3 rounded-xl border border-ocean-800">
                <span className="font-semibold text-slate-200 block mb-2 flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5 text-cyan-400" />
                  Satellite & Ocean Basemaps
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'satellite', name: 'ESRI Satellite', desc: 'True color imagery' },
                    { id: 'ocean', name: 'ESRI Ocean', desc: 'Bathymetry & depth' },
                    { id: 'dark', name: 'Tactical Dark', desc: 'High-contrast night' },
                    { id: 'osm', name: 'OpenStreetMap', desc: 'Standard street/coast' }
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setBasemap(b.id)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        basemap === b.id 
                          ? 'bg-cyan-600/30 border-cyan-400 text-white shadow' 
                          : 'bg-ocean-900 border-ocean-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-[11px]">{b.name}</div>
                      <div className="text-[9px] text-slate-400">{b.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layer Toggles */}
              <div className="bg-ocean-950/70 p-3 rounded-xl border border-ocean-800 space-y-2">
                <span className="font-semibold text-slate-200 block mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  GIS Vector Overlays
                </span>

                {[
                  { key: 'debrisClusters', label: 'AI Debris Clusters & Nurdle Fields' },
                  { key: 'sinkingOrigin', label: 'MSC ELSA 3 Sinking Origin (~13 NM)' },
                  { key: 'driftTrajectory', label: 'INCOIS SARAT Drift Trajectory Line' },
                  { key: 'cleanupSectors', label: 'Clean-up Priority Sectors' },
                  { key: 'currentVectors', label: 'Ocean Current Flow Arrows' },
                  { key: 'shorelineAlerts', label: 'Shoreline Contamination Alerts' }
                ].map(item => (
                  <label 
                    key={item.key} 
                    className="flex items-center justify-between p-2 rounded-lg bg-ocean-900/60 hover:bg-ocean-900 border border-ocean-800/80 cursor-pointer"
                  >
                    <span className="text-[11px] text-slate-300">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={layers[item.key]}
                      onChange={() => toggleLayer(item.key)}
                      className="accent-cyan-400 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Footer Incident Info */}
          <div className="p-3 bg-ocean-950 border-t border-ocean-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>INCOIS SARAT Model Active</span>
            <span className="text-cyan-400 font-mono">EPSG:4326 WGS84</span>
          </div>
        </div>
      )}
    </aside>
  );
}
