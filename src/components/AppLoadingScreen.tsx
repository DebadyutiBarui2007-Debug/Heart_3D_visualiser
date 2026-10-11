import React, { useEffect, useState } from 'react';
import { Heart, Activity, ShieldCheck, Cpu, Zap, Lock } from 'lucide-react';

interface AppLoadingScreenProps {
  onLoadingComplete: () => void;
}

export const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING CLINICAL KERNEL & DICOM PROTOCOLS...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds max duration (strictly under 3s)

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 30) {
        setStatusText('INITIALIZING CLINICAL KERNEL & DICOM PROTOCOLS...');
      } else if (pct < 65) {
        setStatusText('CALIBRATING DUAL-BRANCH GRAPHNET v2.4 (IRB CAD-2024)...');
      } else if (pct < 90) {
        setStatusText('RECONSTRUCTING 3D BIOLUMINESCENT ARTERIAL TWIN...');
      } else {
        setStatusText('HEMODYNAMIC SPATIAL SYNC COMPLETE • SYSTEM ACTIVE');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onLoadingComplete();
        }, 350); // Fast, graceful fade-out transition
      }
    }, 28);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#060E20] flex flex-col items-center justify-center p-6 select-none transition-all duration-500 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background radial bioluminescent glows */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#00f0ff]/10 blur-[130px] pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-[#ff0055]/10 blur-[110px] pointer-events-none" />

      {/* Main Holographic Cardiac Chamber */}
      <div className="relative flex flex-col items-center gap-6 max-w-md w-full z-10">
        {/* Pulsing Concentric Heart Core */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Rings */}
          <div className="absolute w-28 h-28 rounded-full border border-cyan-400/25 animate-ping" />
          <div className="absolute w-36 h-36 rounded-full border border-cyan-400/15 animate-pulse" />
          <div className="absolute w-48 h-48 rounded-full border border-red-500/10 animate-pulse" />

          {/* Central Hexagonal Bioluminescent Emblem */}
          <div className="w-20 h-20 rounded-2xl bg-[#0b1326] border border-cyan-400/40 shadow-[0_0_35px_rgba(76,215,246,0.45)] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-transparent to-red-500/15" />
            <Heart className="w-10 h-10 text-[#4cd7f6] fill-[#4cd7f6]/20 animate-pulse" />
          </div>
        </div>

        {/* Brand Title & Typography */}
        <div className="flex flex-col items-center text-center gap-1 mt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
            <h1 className="text-xl font-bold tracking-tight text-[#dae2fd] font-sans">
              CARDIO-ML 3D INTELLIGENCE
            </h1>
          </div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#4cd7f6] font-semibold">
            3D Diagnostic Hub & Arterial Digital Twin
          </span>
        </div>

        {/* Animated ECG Waveform Trace SVG */}
        <div className="w-full h-12 relative flex items-center justify-center overflow-hidden my-1">
          <svg className="w-full h-full" viewBox="0 0 300 40" fill="none">
            {/* Background grid line */}
            <path
              d="M0 20 H300"
              stroke="rgba(76, 215, 246, 0.15)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {/* Cardiac ECG P-Q-R-S-T wave pulse */}
            <path
              d="M0 20 L60 20 L75 20 L80 16 L85 24 L90 20 L110 20 L116 22 L122 2 L130 36 L136 15 L142 20 L160 20 L170 12 L180 20 L300 20"
              stroke="#4cd7f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_8px_#4cd7f6]"
            />
          </svg>
        </div>

        {/* Telemetry Progress Bar & Percentage */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#bcc9cd] truncate max-w-[280px] text-[11px]">{statusText}</span>
            <span className="text-[#4cd7f6] font-bold text-sm tabular-nums">{progress}%</span>
          </div>

          <div className="h-2 w-full bg-[#131b2e] rounded-full overflow-hidden p-0.5 border border-cyan-500/20">
            <div
              className="h-full bg-gradient-to-r from-[#00f0ff] via-[#4cd7f6] to-[#ff0055] rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(76,215,246,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Clinical Hardware Verification Badges */}
        <div className="flex items-center justify-between w-full pt-3 border-t border-white/5 text-[10px] font-mono text-[#869397]">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#4cd7f6]" />
            CUDA LATENCY: 14.2ms
          </span>
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#4cd7f6]" />
            STREAM: 98.4 Hz
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#4cd7f6]" />
            PACS ENCRYPTED
          </span>
        </div>

        {/* Quick Skip button for immediate entry */}
        <button
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(onLoadingComplete, 200);
          }}
          className="text-[10px] font-mono text-[#869397] hover:text-[#4cd7f6] transition-colors mt-1"
        >
          [ Skip Startup Animation → ]
        </button>
      </div>
    </div>
  );
};
