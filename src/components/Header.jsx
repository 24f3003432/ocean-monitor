import React from 'react';
import { 
  AlertTriangle, 
  Satellite, 
  Waves, 
  Radio, 
  Layers, 
  Crosshair,
  ShieldAlert,
  Download
} from 'lucide-react';
import { INCIDENT_METADATA } from '../data/mscElsaDebrisData';

export default function Header({ 
  totalDetections, 
  criticalCount, 
  totalEstimatedWeight, 
  onResetView,
  onExportGeoJSON,
  liveWeather
}) {
  return (
    <header className="h-16 px-5 bg-ocean-900/95 border-b border-ocean-700/50 backdrop-blur-md flex items-center justify-between z-30 relative shadow-lg">
      {/* Brand & Incident Tag */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                AQUAGUARD AI
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  GIS v2.4
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Marine Plastic Debris & Nurdles Tracking
            </p>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-ocean-700/60 hidden md:block" />

        {/* Case Study Indicator */}
        <div className="hidden lg:flex items-center space-x-2 bg-ocean-950/80 px-3 py-1.5 rounded-lg border border-amber-500/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <div className="text-xs">
            <span className="text-amber-300 font-semibold">CASE STUDY:</span>{' '}
            <span className="text-slate-200 font-medium">{INCIDENT_METADATA.vesselName}</span>
            <span className="text-slate-400 ml-1.5 text-[11px]">(Kerala - Dhanushkodi Corridor)</span>
          </div>
        </div>
      </div>

      {/* Center Quick Stats */}
      <div className="hidden xl:flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-ocean-800/60 px-3 py-1.5 rounded-lg border border-ocean-700/40">
          <Satellite className="w-4 h-4 text-cyan-400" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Sensors</span>
            <span className="text-white font-mono font-bold">Sentinel-1/2 + Landsat</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-ocean-800/60 px-3 py-1.5 rounded-lg border border-ocean-700/40">
          <Radio className="w-4 h-4 text-emerald-400" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Detections</span>
            <span className="text-white font-mono font-bold">{totalDetections} Clusters</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-ocean-800/60 px-3 py-1.5 rounded-lg border border-red-500/30">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <div className="text-xs">
            <span className="text-red-300 block text-[10px] uppercase font-semibold">Critical Zones</span>
            <span className="text-red-200 font-mono font-bold">{criticalCount} Areas</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-ocean-800/60 px-3 py-1.5 rounded-lg border border-amber-500/30">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <div className="text-xs">
            <span className="text-amber-300 block text-[10px] uppercase font-semibold">Est. Debris Volume</span>
            <span className="text-amber-200 font-mono font-bold">~{totalEstimatedWeight.toFixed(1)} Metric Tons</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onResetView}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-ocean-800 hover:bg-ocean-700 text-slate-200 hover:text-white text-xs font-medium border border-ocean-600/40 transition-colors shadow-sm"
          title="Reset map camera to MSC ELSA 3 incident corridor"
        >
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Reset Camera</span>
        </button>

        <button
          onClick={onExportGeoJSON}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/25 transition-all"
          title="Export detected debris coordinates as GeoJSON for field response teams"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export GeoJSON</span>
        </button>
      </div>
    </header>
  );
}
