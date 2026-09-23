import React from 'react';
import { 
  X, 
  Satellite, 
  ShieldAlert, 
  MapPin, 
  BarChart2, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Anchor
} from 'lucide-react';
import { DEBRIS_TYPES } from '../data/mscElsaDebrisData';

export default function DebrisDetailModal({ debris, onClose, onDispatchAlert }) {
  if (!debris) return null;

  const typeConfig = DEBRIS_TYPES[debris.debrisType.toUpperCase()] || {
    label: debris.debrisType,
    color: '#38bdf8',
    badgeColor: 'bg-cyan-500/20 text-cyan-300'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel-elevated w-full max-w-2xl rounded-2xl p-6 border border-cyan-500/40 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-ocean-800/80 hover:bg-ocean-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3 pr-8 mb-5">
          <div className="p-3 rounded-xl bg-ocean-800/80 border border-ocean-700">
            <Satellite className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${typeConfig.badgeColor}`}>
                {typeConfig.label}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                debris.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {debris.priority} PRIORITY
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {debris.name}
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 font-mono">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {debris.coordinates[0].toFixed(4)}°N, {debris.coordinates[1].toFixed(4)}°E
              </span>
              <span>•</span>
              <span>{debris.distanceOffshoreNm} NM Offshore</span>
              <span>•</span>
              <span>{debris.detectionDate}</span>
            </div>
          </div>
        </div>

        {/* AI & Remote Sensing Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-ocean-950/70 p-3 rounded-xl border border-ocean-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Confidence</span>
            <div className="text-xl font-black font-mono text-emerald-400 mt-1">
              {(debris.confidence * 100).toFixed(0)}%
            </div>
            <span className="text-[10px] text-slate-400">Deep ResNet-50</span>
          </div>

          <div className="bg-ocean-950/70 p-3 rounded-xl border border-ocean-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Spatial Footprint</span>
            <div className="text-xl font-black font-mono text-cyan-300 mt-1">
              {(debris.area_sqm / 10000).toFixed(2)} <span className="text-xs font-normal">ha</span>
            </div>
            <span className="text-[10px] text-slate-400">{debris.area_sqm.toLocaleString()} m²</span>
          </div>

          <div className="bg-ocean-950/70 p-3 rounded-xl border border-ocean-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Debris Mass</span>
            <div className="text-xl font-black font-mono text-amber-300 mt-1">
              {debris.estimatedWeightTons} <span className="text-xs font-normal">tons</span>
            </div>
            <span className="text-[10px] text-slate-400">Pellets & Shards</span>
          </div>

          <div className="bg-ocean-950/70 p-3 rounded-xl border border-ocean-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Floating Debris Index</span>
            <div className="text-xl font-black font-mono text-purple-300 mt-1">
              {debris.spectralIndices.fdi}
            </div>
            <span className="text-[10px] text-slate-400">FDI Baseline &gt; 0.025</span>
          </div>
        </div>

        {/* Spectral Signature & SAR Backscatter Breakdown */}
        <div className="bg-ocean-950/80 rounded-xl p-4 border border-ocean-700/80 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Multi-Sensor Spectral Signature & SAR Anomaly
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">Sensor: {debris.detectedBy}</span>
          </div>

          {/* Synthetic Spectrum Bars */}
          <div className="space-y-2 mb-3">
            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Floating Debris Index (FDI - Red Edge / NIR baseline)</span>
                <span className="font-mono text-cyan-300 font-bold">{debris.spectralIndices.fdi} (Strong Absorption Dip)</span>
              </div>
              <div className="w-full h-2 bg-ocean-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  style={{ width: `${Math.min(100, debris.spectralIndices.fdi * 1600)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Normalized Difference Plastic Index (NDPI)</span>
                <span className="font-mono text-purple-300 font-bold">{debris.spectralIndices.ndpi}</span>
              </div>
              <div className="w-full h-2 bg-ocean-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                  style={{ width: `${Math.min(100, debris.spectralIndices.ndpi * 200)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>SAR Surface Roughness Damping (Sentinel-1 VV/VH)</span>
                <span className="font-mono text-emerald-300 font-bold">{debris.spectralIndices.sar_backscatter_anomaly}</span>
              </div>
              <div className="w-full h-2 bg-ocean-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-ocean-900/60 p-2.5 rounded-lg border border-ocean-800 leading-relaxed">
            <strong className="text-cyan-300">Analysis:</strong> {debris.notes}
          </p>
        </div>

        {/* Clean-up Action Recommendations */}
        <div className="bg-gradient-to-br from-ocean-900 to-ocean-800 p-4 rounded-xl border border-cyan-500/30 mb-5">
          <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Targeted Clean-Up Protocol (INCOIS / Indian Coast Guard)</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center space-x-2 text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Operational Recommendation:</strong> {debris.cleanUpFeasibility}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span><strong>Shoreline Risk:</strong> {debris.shorelineRisk}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-200">
              <Anchor className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span><strong>Current Trajectory:</strong> Heading {debris.driftBearingDeg}° at {debris.driftSpeedKnots} knots</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-ocean-700/60">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-ocean-800 hover:bg-ocean-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close Inspector
          </button>
          <button 
            onClick={() => {
              onDispatchAlert(debris);
              onClose();
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-500/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Alert to INCOIS Field Unit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
