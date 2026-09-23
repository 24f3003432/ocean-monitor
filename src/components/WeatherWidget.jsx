import React from 'react';
import { Wind, Waves, Compass, Activity, Navigation, RefreshCw } from 'lucide-react';

export default function WeatherWidget({ weatherData, loading, onRefresh }) {
  if (!weatherData) return null;

  return (
    <div className="glass-panel rounded-xl p-4 shadow-xl border border-cyan-500/20 text-xs w-72">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-ocean-700/60">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Ocean State (Live API)</span>
        </div>
        <button 
          onClick={onRefresh} 
          disabled={loading}
          className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
          title="Refresh oceanographic conditions"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Wave Height */}
        <div className="bg-ocean-950/60 p-2.5 rounded-lg border border-ocean-800">
          <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
            <Waves className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] uppercase font-semibold">Wave Height</span>
          </div>
          <div className="font-mono text-base font-bold text-blue-200">
            {weatherData.waveHeightMeters} <span className="text-xs font-normal text-slate-400">m</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Swell: {weatherData.swellHeightMeters}m ({weatherData.wavePeriodSec}s)
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="bg-ocean-950/60 p-2.5 rounded-lg border border-ocean-800">
          <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase font-semibold">Surface Wind</span>
          </div>
          <div className="font-mono text-base font-bold text-cyan-200">
            {weatherData.windSpeedKnots} <span className="text-xs font-normal text-slate-400">kts</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-1">
            <Compass className="w-2.5 h-2.5 text-slate-300" />
            <span>{weatherData.windDirectionDeg}° (Gust {weatherData.windGustsKmh} km/h)</span>
          </div>
        </div>

        {/* Ocean Current Speed */}
        <div className="bg-ocean-950/60 p-2.5 rounded-lg border border-ocean-800 col-span-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] uppercase font-semibold">Surface Drift Velocity</span>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              weatherData.dispersionRiskLevel.includes('HIGH') 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {weatherData.dispersionRiskLevel}
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <div className="font-mono text-base font-bold text-amber-200">
              ~{weatherData.estimatedCurrentSpeedKnots} <span className="text-xs font-normal text-slate-400">knots</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Flow heading: <strong className="text-slate-200">{weatherData.estimatedCurrentDir}° (SSE)</strong>
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Model: {weatherData.source}
          </div>
        </div>
      </div>
    </div>
  );
}
