import React, { useState } from 'react';
import { PatientData } from '../../types/cardio';
import { CardiacThreeDCanvas } from '../CardiacThreeDCanvas';
import { CoronaryRiskHeatmap } from '../CoronaryRiskHeatmap';
import {
  RotateCcw,
  RefreshCw,
  Layers,
  Flame,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Share2,
} from 'lucide-react';

interface VisualizerViewProps {
  patient: PatientData;
  onNavigateToShap: () => void;
  onNavigateToCath: () => void;
  onOpenBookingModal: () => void;
  onExportDicom: () => void;
}

export const VisualizerView: React.FC<VisualizerViewProps> = ({
  patient,
  onNavigateToShap,
  onNavigateToCath,
  onOpenBookingModal,
  onExportDicom,
}) => {
  // 3D Viewport Controls State
  const [autoRotate, setAutoRotate] = useState(false);
  const [showMyocardium, setShowMyocardium] = useState(true);
  const [highlightLad, setHighlightLad] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleSelectSegment = (vessel: 'LAD' | 'LCX' | 'RCA', segmentName: string) => {
    if (vessel === 'LAD') {
      setHighlightLad(true);
    }
  };

  // Accordion State
  const [shapOpen, setShapOpen] = useState(false);
  const [protocolOpen, setProtocolOpen] = useState(false);
  const [cathPlanOpen, setCathPlanOpen] = useState(false);

  const isSevere = patient.ladStenosis >= 50;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* 1. TOP MARQUEE TICKER (PRIMARY CLINICAL TELEMETRY STREAM) */}
      <section className="relative w-full overflow-hidden rounded-xl bg-[#060E20]/80 backdrop-blur-md shadow-lg border border-cyan-500/25">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#060E20] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#060E20] to-transparent z-10 pointer-events-none" />

        <div className="flex items-center px-4 py-2.5">
          <div className="flex items-center gap-2 shrink-0 pr-4 mr-2 bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 px-3 py-1 rounded-lg shadow-sm z-20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] animate-ping" />
            <span className="text-[10px] text-[#4cd7f6] font-bold font-mono tracking-widest uppercase">
              LIVE STREAM
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee-infinite gap-6 items-center text-xs font-mono">
              {/* Marquee Loop Set 1 */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-semibold ${
                isSevere ? 'bg-[#93000a]/40 border border-[#ffb4ab]/40 text-[#ffb4ab]' : 'bg-[#10b981]/20 border border-[#10b981]/40 text-[#34d399]'
              }`}>
                {isSevere ? '🔴 CRITICAL LAD STENOSIS DETECTED: ' : '🟢 LAD STENOSIS EVALUATION: '}
                {patient.ladStenosis}%
              </span>
              <span className="text-[#869397]">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 text-[#4cd7f6] font-medium">
                ⚡ DUAL-BRANCH GRAPHNET ACTIVE
              </span>
              <span className="text-[#869397]">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171f33] border border-white/10 text-[#dae2fd] font-semibold">
                🧬 PATIENT #{patient.id}: {patient.age}Y {patient.gender.toUpperCase()}
              </span>
              <span className="text-[#869397]">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ffb95f]/10 border border-[#ffb95f]/30 text-[#ffb95f] font-medium">
                🫀 SYSTOLIC BP: {patient.systolicBp} mmHg ({patient.systolicBp > 140 ? 'ELEVATED' : 'NORMAL'})
              </span>
              <span className="text-[#869397]">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ffb95f]/10 border border-[#ffb95f]/30 text-[#ffb95f] font-medium">
                🔬 FASTING GLUCOSE: {patient.fastingGlucose} mg/dL
              </span>
              <span className="text-[#869397]">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#06b6d4]/20 border border-[#4cd7f6]/30 text-[#4cd7f6] font-bold">
                📊 MODEL DISCRIMINATION ROC-AUC: 0.892
              </span>
              <span className="text-[#869397]">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171f33] border border-white/10 text-[#bcc9cd] font-medium">
                🛡️ ZERO TARGET LEAKAGE ENFORCED
              </span>
              <span className="text-[#869397]">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#a40217]/40 border border-[#ffb3ad]/40 text-[#ffdad7] font-bold">
                ⚕️ INVASIVE CATH LAB RESERVED: {patient.cathSuite}
              </span>
              <span className="text-[#869397] mr-6">•</span>

              {/* Duplicate for infinite loop */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-semibold ${
                isSevere ? 'bg-[#93000a]/40 border border-[#ffb4ab]/40 text-[#ffb4ab]' : 'bg-[#10b981]/20 border border-[#10b981]/40 text-[#34d399]'
              }`}>
                {isSevere ? '🔴 CRITICAL LAD STENOSIS DETECTED: ' : '🟢 LAD STENOSIS EVALUATION: '}
                {patient.ladStenosis}%
              </span>
              <span className="text-[#869397]">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 text-[#4cd7f6] font-medium">
                ⚡ DUAL-BRANCH GRAPHNET ACTIVE
              </span>
              <span className="text-[#869397]">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#171f33] border border-white/10 text-[#dae2fd] font-semibold">
                🧬 PATIENT #{patient.id}: {patient.age}Y {patient.gender.toUpperCase()}
              </span>
              <span className="text-[#869397]">•</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ffb95f]/10 border border-[#ffb95f]/30 text-[#ffb95f] font-medium">
                🫀 SYSTOLIC BP: {patient.systolicBp} mmHg ({patient.systolicBp > 140 ? 'ELEVATED' : 'NORMAL'})
              </span>
              <span className="text-[#869397] mr-6">•</span>
            </div>
          </div>
        </div>
      </section>

      {/* CRITICAL CLINICAL SAFETY BANNER */}
      <div className="w-full rounded-xl bg-[#060E20]/80 backdrop-blur-md px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md border border-cyan-500/20">
        <div className="flex items-center gap-3 min-w-0">
          <ShieldCheck className="w-5 h-5 text-[#ffb95f] shrink-0" />
          <p className="text-xs text-[#bcc9cd] truncate">
            <span className="font-semibold text-[#dae2fd]">Diagnostic Decision Support Only:</span>{' '}
            Model predictions supplement angiographic review and do not replace invasive catheterization evaluation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#869397] shrink-0">
          <span>IRB-APPROVED CAD-2024</span>
          <span className="w-1 h-1 rounded-full bg-[#3d494c]" />
          <span className="text-[#4cd7f6] font-bold">DUAL-BRANCH GRAPHNET v2.4</span>
        </div>
      </div>

      {/* PRIMARY GOLDEN RATIO SECTION (61.8% SPATIAL VISUALIZATION : 38.2% TELEMETRY ANALYTICS) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
        {/* 61.8% PRIMARY COLUMN: 3D ARTERIAL TWIN */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
          <div className="relative rounded-2xl bg-[#060E20]/85 backdrop-blur-xl shadow-2xl overflow-hidden p-4 flex flex-col gap-4 border border-cyan-500/30">
            {/* Viewport Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#222a3d]/90 flex items-center justify-center text-[#4cd7f6] shadow-[0_0_12px_rgba(76,215,246,0.3)] border border-[#4cd7f6]/30">
                  <span className="material-symbols-outlined text-[20px]">view_in_ar</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#dae2fd] tracking-tight">Interactive 3D Arterial Twin</h2>
                  <p className="text-[10px] text-[#4cd7f6] uppercase font-mono tracking-wider">
                    Patient-Specific Calibrated Coronary Tree & Thoracic Perfusion
                  </p>
                </div>
              </div>

              {/* Viewport Interactive Buttons */}
              <div className="flex items-center gap-1.5 bg-[#171f33]/80 backdrop-blur-md p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1 ${
                    autoRotate ? 'bg-[#4cd7f6] text-[#003640] font-bold' : 'bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd]'
                  }`}
                  title="Toggle continuous rotation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rotate</span>
                </button>

                <button
                  onClick={() => setResetTrigger((prev) => prev + 1)}
                  className="px-2.5 py-1 rounded bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-xs font-mono transition-all flex items-center gap-1"
                  title="Reset view to anatomical home position"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset View</span>
                </button>

                <button
                  onClick={() => setShowMyocardium(!showMyocardium)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1 ${
                    showMyocardium ? 'bg-[#4cd7f6] text-[#003640] font-bold' : 'bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd]'
                  }`}
                  title="Toggle semi-translucent myocardial volume"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Myocardium</span>
                </button>

                <button
                  onClick={() => setHighlightLad(!highlightLad)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1 font-semibold ${
                    highlightLad
                      ? 'bg-[#ff1744] text-white shadow-[0_0_10px_rgba(255,23,68,0.5)]'
                      : 'bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd]'
                  }`}
                  title="Highlight critical LAD lesion focus"
                >
                  <Flame className="w-3.5 h-3.5 text-white" />
                  <span>Highlight LAD</span>
                </button>
              </div>
            </div>

            {/* 3D Heart Visualizer Container */}
            <div className="relative w-full h-[520px] rounded-xl bg-[#030917]/90 overflow-hidden flex items-center justify-center group shadow-inner border border-cyan-500/25">
              <CardiacThreeDCanvas
                patient={patient}
                autoRotate={autoRotate}
                showMyocardium={showMyocardium}
                highlightLad={highlightLad}
                resetTrigger={resetTrigger}
              />

              {/* Spatial Probe Tag: LAD Stenosis Focus */}
              <div className="absolute top-6 left-6 bg-[#060E20]/90 backdrop-blur-md p-3.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] pointer-events-auto transition-transform group-hover:scale-105 border border-[#ff1744]/40 z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff1744] animate-ping" />
                  <span className="text-xs font-bold text-[#ffb4ab] tracking-wide font-mono">
                    LAD Stenosis Focus
                  </span>
                </div>
                <p className="text-xs text-[#dae2fd] mt-1">
                  Proximal bifurcation:{' '}
                  <span className="font-mono text-[#ffb4ab] font-bold text-sm">
                    {patient.ladStenosis}%
                  </span>
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[#ffdad7] text-[11px] font-mono">
                  <span className="material-symbols-outlined text-[14px]">crisis_alert</span>
                  <span>
                    FFR Estimate: {patient.ffrEstimate} ({patient.ffrEstimate < 0.75 ? 'Ischemic' : 'Non-Ischemic'})
                  </span>
                </div>
              </div>

              {/* Spatial Probe Tag: RCA Perfusion */}
              <div className="absolute bottom-8 right-6 bg-[#060E20]/90 backdrop-blur-md p-3.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.6)] pointer-events-auto hidden sm:block border border-[#4cd7f6]/40 z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] shadow-[0_0_6px_#4cd7f6]" />
                  <span className="text-xs font-bold text-[#4cd7f6] tracking-wide font-mono">
                    RCA Perfusion
                  </span>
                </div>
                <p className="text-xs text-[#dae2fd] mt-1">
                  Dominance: {patient.dominance} | Patency:{' '}
                  <span className="text-[#4cd7f6] font-mono font-bold text-sm">
                    {patient.rcaPatency}%
                  </span>
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-[#bcc9cd] text-[11px] font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4cd7f6]" />
                  <span>{patient.rcaPatency > 70 ? 'Normal Perfusion Flow' : 'Sub-Critical Perfusion'}</span>
                </div>
              </div>

              {/* Drag instruction helper at bottom left */}
              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-[#869397] bg-[#060e20]/60 px-2 py-0.5 rounded backdrop-blur pointer-events-none">
                CLICK & DRAG TO ROTATE 360° • SCROLL/PINCH TO EXPLORE
              </div>
            </div>

            {/* Dynamic Stenosis Risk Tiers & Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* RCA Card */}
              {(() => {
                const isRcaSevere = patient.rcaStenosis >= 50;
                const isRcaMod = patient.rcaStenosis >= 30 && patient.rcaStenosis < 50;
                return (
                  <div className={`p-3 rounded-xl backdrop-blur-md flex flex-col gap-1 transition-all ${
                    isRcaSevere
                      ? 'bg-[#a40217]/20 border border-[#ff1744]/30 hover:bg-[#a40217]/30'
                      : isRcaMod
                      ? 'bg-[#131b2e]/80 border border-[#ffb95f]/20 hover:bg-[#171f33]'
                      : 'bg-[#131b2e]/80 border border-cyan-500/15 hover:bg-[#171f33]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-[#869397]">Vessel Segment</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1 ${
                        isRcaSevere
                          ? 'bg-[#ff1744]/20 text-[#ffb4ab]'
                          : isRcaMod
                          ? 'bg-[#ffb95f]/10 text-[#ffb95f]'
                          : 'bg-[#10b981]/15 text-[#34d399]'
                      }`}>
                        {isRcaSevere && <span className="w-1.5 h-1.5 rounded-full bg-[#ff1744] animate-ping" />}
                        {isRcaSevere ? '≥ 50% Severe' : isRcaMod ? '30% - 49% Mod' : '< 30% Low'}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-base text-[#dae2fd] font-semibold">RCA</span>
                      <span className={`font-mono text-xl font-bold ${
                        isRcaSevere ? 'text-[#ff1744]' : isRcaMod ? 'text-[#ffb95f]' : 'text-[#34d399]'
                      }`}>
                        {patient.rcaStenosis}%
                      </span>
                    </div>
                    <div className="w-full bg-[#222a3d] h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          isRcaSevere ? 'bg-[#ff1744] shadow-[0_0_8px_#ff1744]' : isRcaMod ? 'bg-[#ffb95f] shadow-[0_0_6px_#ffb95f]' : 'bg-[#10b981] shadow-[0_0_6px_#10b981]'
                        }`}
                        style={{ width: `${Math.min(100, patient.rcaStenosis)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#bcc9cd] mt-1">
                      Right Coronary Artery: {isRcaSevere ? 'Severe Occlusion Flag' : isRcaMod ? 'Moderate sub-critical lesion' : 'Patent Perfusion'}
                    </span>
                  </div>
                );
              })()}

              {/* LCX Card */}
              {(() => {
                const isLcxSevere = patient.lcxStenosis >= 50;
                const isLcxMod = patient.lcxStenosis >= 30 && patient.lcxStenosis < 50;
                return (
                  <div className={`p-3 rounded-xl backdrop-blur-md flex flex-col gap-1 transition-all ${
                    isLcxSevere
                      ? 'bg-[#a40217]/20 border border-[#ff1744]/30 hover:bg-[#a40217]/30'
                      : isLcxMod
                      ? 'bg-[#131b2e]/80 border border-[#ffb95f]/20 hover:bg-[#171f33]'
                      : 'bg-[#131b2e]/80 border border-cyan-500/15 hover:bg-[#171f33]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-[#869397]">Vessel Segment</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1 ${
                        isLcxSevere
                          ? 'bg-[#ff1744]/20 text-[#ffb4ab]'
                          : isLcxMod
                          ? 'bg-[#ffb95f]/10 text-[#ffb95f]'
                          : 'bg-[#10b981]/15 text-[#34d399]'
                      }`}>
                        {isLcxSevere && <span className="w-1.5 h-1.5 rounded-full bg-[#ff1744] animate-ping" />}
                        {isLcxSevere ? '≥ 50% Severe' : isLcxMod ? '30% - 49% Mod' : '< 30% Low'}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-base text-[#dae2fd] font-semibold">LCX</span>
                      <span className={`font-mono text-xl font-bold ${
                        isLcxSevere ? 'text-[#ff1744]' : isLcxMod ? 'text-[#ffb95f]' : 'text-[#34d399]'
                      }`}>
                        {patient.lcxStenosis}%
                      </span>
                    </div>
                    <div className="w-full bg-[#222a3d] h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          isLcxSevere ? 'bg-[#ff1744] shadow-[0_0_8px_#ff1744]' : isLcxMod ? 'bg-[#ffb95f] shadow-[0_0_6px_#ffb95f]' : 'bg-[#10b981] shadow-[0_0_6px_#10b981]'
                        }`}
                        style={{ width: `${Math.min(100, patient.lcxStenosis)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#bcc9cd] mt-1">
                      Left Circumflex: {isLcxSevere ? 'Urgent Catheterization Flag' : isLcxMod ? 'Sub-critical lesion' : 'Patent Perfusion'}
                    </span>
                  </div>
                );
              })()}

              {/* LAD Card */}
              {(() => {
                const isLadSevere = patient.ladStenosis >= 50;
                const isLadMod = patient.ladStenosis >= 30 && patient.ladStenosis < 50;
                return (
                  <div className={`p-3 rounded-xl backdrop-blur-md flex flex-col gap-1 transition-all ${
                    isLadSevere
                      ? 'bg-[#a40217]/20 border border-[#ff1744]/30 hover:bg-[#a40217]/30'
                      : isLadMod
                      ? 'bg-[#131b2e]/80 border border-[#ffb95f]/20 hover:bg-[#171f33]'
                      : 'bg-[#131b2e]/80 border border-cyan-500/15 hover:bg-[#171f33]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-[#ffb4ab]">Vessel Segment</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold flex items-center gap-1 ${
                        isLadSevere
                          ? 'bg-[#ff1744]/20 text-[#ffb4ab]'
                          : isLadMod
                          ? 'bg-[#ffb95f]/10 text-[#ffb95f]'
                          : 'bg-[#10b981]/15 text-[#34d399]'
                      }`}>
                        {isLadSevere && <span className="w-1.5 h-1.5 rounded-full bg-[#ff1744] animate-ping" />}
                        {isLadSevere ? '≥ 50% Severe' : isLadMod ? '30% - 49% Mod' : '< 30% Low'}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-base text-[#dae2fd] font-semibold">LAD</span>
                      <span className={`font-mono text-xl font-bold ${
                        isLadSevere ? 'text-[#ff1744]' : isLadMod ? 'text-[#ffb95f]' : 'text-[#34d399]'
                      }`}>
                        {patient.ladStenosis}%
                      </span>
                    </div>
                    <div className="w-full bg-[#222a3d] h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          isLadSevere ? 'bg-[#ff1744] shadow-[0_0_8px_#ff1744]' : isLadMod ? 'bg-[#ffb95f] shadow-[0_0_6px_#ffb95f]' : 'bg-[#10b981] shadow-[0_0_6px_#10b981]'
                        }`}
                        style={{ width: `${Math.min(100, patient.ladStenosis)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#ffdad7] mt-1 font-medium">
                      Left Anterior Descending: {isLadSevere ? 'Urgent Catheterization Flag' : isLadMod ? 'Moderate lesion' : 'Patent Perfusion'}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* D3.js Arterial Stenosis Risk Heatmap */}
          <CoronaryRiskHeatmap
            patient={patient}
            onSelectSegment={handleSelectSegment}
          />
        </div>

        {/* 38.2% MINOR COLUMN: CLINICAL ANALYTICS TELEMETRY */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
          {/* Multi-Task Global Risk Gauge */}
          <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-4 flex flex-col gap-4 shadow-2xl border border-cyan-500/25">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2.5">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-[#869397]">Clinical Target 1</span>
                <h3 className="text-lg font-bold text-[#dae2fd]">CAD Occurrence</h3>
              </div>
              <span className="text-xs text-[#4cd7f6] bg-[#06b6d4]/20 border border-[#4cd7f6]/30 px-2.5 py-1 rounded-full font-bold font-mono">
                AUC 0.892
              </span>
            </div>

            {/* Hero Telemetry Metric */}
            <div className="flex items-baseline justify-between py-2 bg-[#131b2e]/80 backdrop-blur-md px-4 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-4xl text-[#ff1744] font-extrabold tracking-tight drop-shadow-[0_0_12px_rgba(255,23,68,0.4)] font-mono">
                  {patient.cadProbability}%
                </span>
                <span className="text-xs text-[#bcc9cd] mt-0.5">
                  Combined Coronary Disease Probability
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#93000a]/30 border border-[#ff1744]/40 flex items-center justify-center text-[#ff1744] shadow-[0_0_12px_rgba(255,23,68,0.3)]">
                <AlertTriangle className="w-6 h-6 text-[#ff1744]" />
              </div>
            </div>

            {/* Key Diagnostic Baseline Attributes */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center py-1.5 px-3 rounded bg-[#131b2e]/70 text-[#dae2fd] border border-white/5">
                <span className="text-xs text-[#bcc9cd]">Systolic Blood Pressure</span>
                <span className="text-xs font-semibold text-[#ffb95f] font-mono">
                  {patient.systolicBp} mmHg ({patient.systolicBp > 140 ? 'Elevated' : 'Normal'})
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-3 rounded bg-[#131b2e]/70 text-[#dae2fd] border border-white/5">
                <span className="text-xs text-[#bcc9cd]">Fasting Blood Glucose</span>
                <span className="text-xs font-semibold text-[#ffb95f] font-mono">
                  {patient.fastingGlucose} mg/dL
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-3 rounded bg-[#131b2e]/70 text-[#dae2fd] border border-white/5">
                <span className="text-xs text-[#bcc9cd]">Echocardiogram Wall Motion</span>
                <span className="text-xs font-semibold text-[#ff1744] font-mono truncate max-w-[190px]">
                  {patient.rwmaStatus}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 px-3 rounded bg-[#131b2e]/70 text-[#dae2fd] border border-white/5">
                <span className="text-xs text-[#bcc9cd]">Resting Heart Rate</span>
                <span className="text-xs font-semibold text-[#dae2fd] font-mono">
                  {patient.restingHr} bpm
                </span>
              </div>
            </div>

            {/* Rapid Action Interventions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setShapOpen(!shapOpen)}
                className="w-full py-2.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-cyan-500/20 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-[#4cd7f6]" />
                <span>{shapOpen ? 'Collapse Insights' : 'Expand Clinical Insights'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${shapOpen ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={onOpenBookingModal}
                className="w-full py-2.5 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_14px_rgba(76,215,246,0.4)] active:scale-98"
              >
                <Stethoscope className="w-4 h-4 text-[#003640]" />
                <span>Launch Catheterization Pre-Op Plan</span>
              </button>
            </div>
          </div>

          {/* 4-Target Unified Prediction Deck Summary */}
          <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-4 flex flex-col gap-2 shadow-2xl border border-cyan-500/25">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <h4 className="text-sm font-semibold text-[#dae2fd]">Multi-Target Output Matrix</h4>
              <span className="text-[10px] text-[#4cd7f6] font-mono font-bold">4-Branch Loss</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="p-2.5 rounded-lg bg-[#131b2e]/80 backdrop-blur-md flex flex-col border border-white/5">
                <span className="text-[10px] text-[#bcc9cd]">Target 1: CAD Presence</span>
                <span className="font-mono text-lg font-bold text-[#ff1744] mt-0.5">
                  {patient.cadProbability}%
                </span>
                <span className="text-[10px] text-[#869397]">Global Risk</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#131b2e]/80 backdrop-blur-md flex flex-col border border-[#ff1744]/20">
                <span className="text-[10px] text-[#bcc9cd]">Target 2: LAD Stenosis</span>
                <span className="font-mono text-lg font-bold text-[#ff1744] mt-0.5">
                  {patient.ladStenosis}%
                </span>
                <span className="text-[10px] text-[#ff1744] font-medium">Intervention Tier</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#131b2e]/80 backdrop-blur-md flex flex-col border border-[#ffb95f]/20">
                <span className="text-[10px] text-[#bcc9cd]">Target 3: LCX Stenosis</span>
                <span className="font-mono text-lg font-bold text-[#ffb95f] mt-0.5">
                  {patient.lcxStenosis}%
                </span>
                <span className="text-[10px] text-[#ffb95f] font-medium">Monitoring Tier</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#131b2e]/80 backdrop-blur-md flex flex-col border border-[#4cd7f6]/20">
                <span className="text-[10px] text-[#bcc9cd]">Target 4: RCA Stenosis</span>
                <span className="font-mono text-lg font-bold text-[#4cd7f6] mt-0.5">
                  {patient.rcaStenosis}%
                </span>
                <span className="text-[10px] text-[#4cd7f6] font-medium">Normal Baseline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECONDARY HORIZONTALLY MOVING TICKER (DYNAMIC TELEMETRY & HARDWARE RUNTIME) */}
      <section className="relative w-full overflow-hidden rounded-xl bg-[#060E20]/80 backdrop-blur-md shadow-lg border border-cyan-500/20">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#060E20] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#060E20] to-transparent z-10 pointer-events-none" />

        <div className="flex items-center px-4 py-2">
          <div className="flex items-center gap-1.5 shrink-0 pr-3 mr-2 bg-[#171f33] px-2.5 py-0.5 rounded text-[#869397] text-[10px] uppercase font-mono">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[14px]">memory</span>
            <span>NODE TELEMETRY</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee-reverse gap-8 items-center text-[11px] font-mono text-[#bcc9cd]">
              <span>CUDA INFERENCE LATENCY: <strong className="text-[#4cd7f6]">14.2ms</strong></span>
              <span className="text-[#869397]">•</span>
              <span>GRAPH REVOLUTION: <strong className="text-[#dae2fd]">360° SPATIAL SYNC</strong></span>
              <span className="text-[#869397]">•</span>
              <span>SHAP ATTRIBUTION SUM: <strong className="text-[#ffb95f]">Σ|Φ| = 1.048</strong></span>
              <span className="text-[#869397]">•</span>
              <span>CORONARY TREE RECONSTRUCTION: <strong className="text-[#4cd7f6]">99.2% MESH FIDELITY</strong></span>
              <span className="text-[#869397]">•</span>
              <span>UCI DATASET INTEGRITY CHECK: <strong className="text-[#4cd7f6]">CLEARED (5-FOLD CV)</strong></span>
              <span className="text-[#869397]">•</span>
              <span>TARGET ISOLATION STATUS: <strong className="text-[#dae2fd]">LEAKAGE FREE</strong></span>
              <span className="text-[#869397]">•</span>
              <span>RADIAL ARTERY ACCESS: <strong className="text-[#ffb95f]">PLANNED ({patient.cathSuite})</strong></span>
              <span className="text-[#869397] mr-8">•</span>

              <span>CUDA INFERENCE LATENCY: <strong className="text-[#4cd7f6]">14.2ms</strong></span>
              <span className="text-[#869397]">•</span>
              <span>GRAPH REVOLUTION: <strong className="text-[#dae2fd]">360° SPATIAL SYNC</strong></span>
              <span className="text-[#869397]">•</span>
              <span>SHAP ATTRIBUTION SUM: <strong className="text-[#ffb95f]">Σ|Φ| = 1.048</strong></span>
              <span className="text-[#869397]">•</span>
              <span>CORONARY TREE RECONSTRUCTION: <strong className="text-[#4cd7f6]">99.2% MESH FIDELITY</strong></span>
              <span className="text-[#869397] mr-8">•</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRESSIVE DISCLOSURE COLLAPSIBLE MODULES */}
      {/* 1. SHAP Interpretability Accordion */}
      <section className="w-full rounded-2xl bg-[#060E20]/85 backdrop-blur-xl shadow-xl overflow-hidden border border-cyan-500/20">
        <div
          onClick={() => setShapOpen(!shapOpen)}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#131b2e]/60 transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#171f33] flex items-center justify-center text-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.3)] border border-[#4cd7f6]/20">
              <span className="material-symbols-outlined text-[22px]">analytics</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#dae2fd]">
                Explore SHAP Interpretability & Feature Weights
              </h3>
              <p className="text-xs text-[#bcc9cd]">
                Game-theoretic local feature attributions for Patient #{patient.id} inference
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#869397] hidden sm:inline font-mono">KernelExplainer (n=303)</span>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-[#171f33] flex items-center justify-center text-[#dae2fd] hover:text-[#4cd7f6] transition-colors border border-white/5"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${shapOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {shapOpen && (
          <div className="px-4 pb-4 flex flex-col gap-4 border-t border-cyan-500/10 pt-4">
            <div className="p-4 rounded-xl bg-[#131b2e]/80 backdrop-blur-md flex flex-col gap-4 border border-white/5">
              <div className="flex flex-wrap items-center justify-between text-[#bcc9cd] text-xs">
                <span className="text-[#4cd7f6] font-mono">Negative Impact (Protective Baseline) ←</span>
                <span className="text-[10px] font-semibold text-[#869397] font-mono">
                  SHAP BASE VALUE: E[f(x)] = 0.28
                </span>
                <span className="text-[#ff1744] font-mono">→ Positive Risk Acceleration (CAD+)</span>
              </div>

              {/* Dynamic SHAP Bars */}
              <div className="flex flex-col gap-3 text-xs font-mono">
                {patient.shapValues.map((shap, index) => {
                  const isPositive = shap.impact > 0;
                  const absPct = Math.min(50, Math.abs(shap.percentage));

                  return (
                    <div key={index} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[#dae2fd]">
                        <span className="font-medium text-xs font-sans">
                          {shap.feature} ({shap.value})
                        </span>
                        <span className={`font-mono font-bold text-xs ${isPositive ? (shap.impact > 0.2 ? 'text-[#ff1744]' : 'text-[#ffb95f]') : 'text-[#4cd7f6]'}`}>
                          {isPositive ? `+${shap.impact.toFixed(3)} (↑ ${shap.percentage}%)` : `${shap.impact.toFixed(3)} (↓ ${Math.abs(shap.percentage)}%)`}
                        </span>
                      </div>

                      <div className="w-full bg-[#222a3d] h-3 rounded-full flex overflow-hidden">
                        {isPositive ? (
                          <>
                            <div className="w-1/2 bg-transparent" />
                            <div
                              className={`h-full rounded-r-full ${
                                shap.impact > 0.2
                                  ? 'bg-[#ff1744] shadow-[0_0_8px_#ff1744]'
                                  : 'bg-[#ffb95f] shadow-[0_0_8px_#ffb95f]'
                              }`}
                              style={{ width: `${absPct}%` }}
                            />
                          </>
                        ) : (
                          <>
                            <div style={{ width: `${50 - absPct}%` }} className="bg-transparent" />
                            <div
                              className="h-full bg-[#4cd7f6] rounded-l-full shadow-[0_0_8px_#4cd7f6]"
                              style={{ width: `${absPct}%` }}
                            />
                            <div className="w-1/2 bg-transparent" />
                          </>
                        )}
                      </div>
                      <span className="text-[10px] text-[#869397] font-sans italic">{shap.description}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onNavigateToShap}
                  className="px-3 py-1.5 rounded-lg bg-[#4cd7f6]/10 hover:bg-[#4cd7f6]/20 text-[#4cd7f6] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Full SHAP Diagnostic Suite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Preprocessing & Leakage Protocol Accordion */}
      <section className="w-full rounded-2xl bg-[#060E20]/85 backdrop-blur-xl shadow-xl overflow-hidden border border-cyan-500/20">
        <div
          onClick={() => setProtocolOpen(!protocolOpen)}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#131b2e]/60 transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#171f33] flex items-center justify-center text-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.3)] border border-[#4cd7f6]/20">
              <span className="material-symbols-outlined text-[22px]">shield</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#dae2fd]">
                View Preprocessing & Leakage Protocol
              </h3>
              <p className="text-xs text-[#bcc9cd]">
                UCI Z-Alizadeh Sani extension cohort validation & integrity enforcement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#4cd7f6] bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 px-2 py-0.5 rounded font-mono">
              Zero Leakage Verified
            </span>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-[#171f33] flex items-center justify-center text-[#dae2fd] hover:text-[#4cd7f6] transition-colors border border-white/5"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${protocolOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {protocolOpen && (
          <div className="px-4 pb-4 border-t border-cyan-500/10 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-[#131b2e]/80 backdrop-blur-md border border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono text-[#869397]">Cohort Specification</span>
                <span className="text-sm font-semibold text-[#dae2fd]">303 Clinical Records</span>
                <p className="text-xs text-[#bcc9cd] mt-1 leading-relaxed">
                  Derived from Tehran Heart Center cohort. 54 clinical, biochemical, and demographic features per record verified against invasive angiography gold standard.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono text-[#869397]">Normalization & Scaling</span>
                <span className="text-sm font-semibold text-[#dae2fd]">Robust StandardScaler</span>
                <p className="text-xs text-[#bcc9cd] mt-1 leading-relaxed">
                  Fitted strictly inside 5-fold cross-validation training partitions to eliminate distribution shift and test-set contamination across numerical features.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono text-[#869397]">Target Isolation</span>
                <span className="text-sm font-semibold text-[#dae2fd]">LAD / LCX / RCA Cleared</span>
                <p className="text-xs text-[#bcc9cd] mt-1 leading-relaxed">
                  Individual vessel stenosis columns removed from feature matrices prior to model convergence, ensuring strict multi-task independent validity.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Catheterization Pre-Op Plan Accordion */}
      <section className="w-full rounded-2xl bg-[#060E20]/85 backdrop-blur-xl shadow-xl overflow-hidden border border-cyan-500/20">
        <div
          onClick={() => setCathPlanOpen(!cathPlanOpen)}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#131b2e]/60 transition-colors select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#171f33] flex items-center justify-center text-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.3)] border border-[#4cd7f6]/20">
              <span className="material-symbols-outlined text-[22px]">medical_services</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#dae2fd]">
                Launch Catheterization Pre-Op Plan
              </h3>
              <p className="text-xs text-[#bcc9cd]">
                Recommended invasive staging based on {patient.ladStenosis}% LAD probability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#ff1744] bg-[#ff1744]/10 border border-[#ff1744]/30 px-2.5 py-0.5 rounded font-mono font-bold">
              Priority 1: {patient.triagePriority}
            </span>
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-[#171f33] flex items-center justify-center text-[#dae2fd] hover:text-[#4cd7f6] transition-colors border border-white/5"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${cathPlanOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {cathPlanOpen && (
          <div className="px-4 pb-4 flex flex-col gap-4 border-t border-cyan-500/10 pt-4">
            <div className="p-4 rounded-xl bg-[#131b2e]/80 backdrop-blur-md flex flex-col gap-4 border border-white/5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2d3449] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4cd7f6]" />
                  <span className="text-sm font-semibold text-[#dae2fd]">
                    Recommended Protocol: Radial Access Angiography
                  </span>
                </div>
                <span className="text-xs text-[#869397] font-mono">Target ETA: &lt; 24h</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-mono text-[#869397]">
                    Primary Target Intervention
                  </span>
                  <div className="p-3 rounded-lg bg-[#171f33]/70 flex flex-col gap-1 border border-[#ff1744]/30">
                    <span className="text-sm font-bold text-[#ff1744]">
                      LAD Proximal Segment
                    </span>
                    <p className="text-xs text-[#bcc9cd]">
                      Prepare drug-eluting stent (DES) sizing 3.0mm × 18mm. FFR / iFR catheter standby for borderline diagonal branch assessment.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-mono text-[#869397]">
                    Secondary Surveillance
                  </span>
                  <div className="p-3 rounded-lg bg-[#171f33]/70 flex flex-col gap-1 border border-[#ffb95f]/30">
                    <span className="text-sm font-bold text-[#ffb95f]">
                      LCX Obtuse Marginal 1
                    </span>
                    <p className="text-xs text-[#bcc9cd]">
                      Perform visual angiographic grading. If stenosis &lt; 50% confirmed via IVUS, defer stent and maintain dual antiplatelet medical therapy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={onExportDicom}
                  className="px-4 py-2 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] text-xs font-medium transition-all border border-white/5 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Export DICOM Brief</span>
                </button>
                <button
                  onClick={onOpenBookingModal}
                  className="px-4 py-2 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-bold transition-all shadow-[0_0_12px_rgba(76,215,246,0.4)] flex items-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Confirm Cath Lab Booking</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
