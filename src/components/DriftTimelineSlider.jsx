import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, Clock, MapPin, AlertCircle } from 'lucide-react';
import { INCOIS_DRIFT_TIMELINE } from '../data/mscElsaDebrisData';

export default function DriftTimelineSlider({ 
  currentStepIndex, 
  onStepChange,
  onFocusCoordinates
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        onStepChange((prev) => {
          const next = (prev + 1) % INCOIS_DRIFT_TIMELINE.length;
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onStepChange]);

  const currentStep = INCOIS_DRIFT_TIMELINE[currentStepIndex];

  return (
    <div className="glass-panel-elevated rounded-xl p-3.5 shadow-2xl border border-cyan-500/30 w-full max-w-xl text-xs">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white text-sm tracking-wide">
            INCOIS SARAT Drift Simulation
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {currentStep.date}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-lg border transition-all flex items-center space-x-1 px-2.5 ${
              isPlaying 
                ? 'bg-amber-600/80 border-amber-400 text-white' 
                : 'bg-cyan-600/80 border-cyan-400 text-white hover:bg-cyan-500'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Simulate Drift</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Description box */}
      <div className="bg-ocean-950/80 p-2.5 rounded-lg border border-ocean-700/60 mb-3 flex items-start space-x-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-slate-100 flex items-center gap-2">
            {currentStep.label}
            <button 
              onClick={() => onFocusCoordinates(currentStep.center, 9)}
              className="text-[10px] text-cyan-400 hover:text-cyan-200 underline flex items-center gap-0.5 ml-1"
            >
              <MapPin className="w-3 h-3" /> Focus Zone
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
            {currentStep.description}
          </p>
        </div>
      </div>

      {/* Timeline tracker */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>Day 0 (Sinking)</span>
          <span>Day 3</span>
          <span>Day 7</span>
          <span>Day 12</span>
          <span>Day 21 (Dhanushkodi)</span>
        </div>

        <input
          type="range"
          min="0"
          max={INCOIS_DRIFT_TIMELINE.length - 1}
          value={currentStepIndex}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className="w-full h-2 bg-ocean-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
          <span>Current Speed: <strong className="text-cyan-300 font-mono">{currentStep.currentSpeedMps} m/s</strong></span>
          <span>Plume Dispersion: <strong className="text-amber-300 font-mono">~{(currentStep.plumeSpreadRadiusM / 1000).toFixed(1)} km</strong></span>
          <span>Wind: <strong className="text-slate-200 font-mono">{currentStep.windKnots} kts SW</strong></span>
        </div>
      </div>
    </div>
  );
}
