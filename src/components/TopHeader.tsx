import React, { useState } from 'react';
import { SlidersHorizontal, RefreshCw, UserCheck, ChevronDown, Check } from 'lucide-react';
import { PatientData } from '../types/cardio';

interface TopHeaderProps {
  currentPatient: PatientData;
  allPatients: PatientData[];
  onSelectPatient: (patient: PatientData) => void;
  onOpenFilterModal: () => void;
  onOpenInferenceModal: () => void;
  isInferencing?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentPatient,
  allPatients,
  onSelectPatient,
  onOpenFilterModal,
  onOpenInferenceModal,
  isInferencing = false,
}) => {
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#060E20]/85 backdrop-blur-xl z-40 shadow-[0_2px_12px_rgba(0,0,0,0.5)] border-b border-cyan-500/15">
      <div className="h-16 w-full px-6 flex items-center justify-between gap-4">
        {/* Left Section: Brand & Patient Switcher */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]" />
              <span className="absolute w-4 h-4 rounded-full bg-[#4cd7f6]/40 animate-ping" />
            </div>
            <span className="font-semibold text-sm text-[#dae2fd] tracking-tight whitespace-nowrap">
              CARDIO-ML 3D INTELLIGENCE
            </span>
          </div>

          {/* Quick Patient Switcher Chip */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setPatientDropdownOpen(!patientDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131b2e]/80 border border-white/5 hover:border-cyan-500/30 transition-all text-left"
            >
              <span className="text-[10px] uppercase font-mono text-[#869397]">Target</span>
              <span className="text-xs font-mono font-semibold text-[#4cd7f6]">{currentPatient.name}</span>
              <span className="text-[#3d494c] text-xs">•</span>
              <span className="text-xs text-[#bcc9cd]">
                {currentPatient.gender}, {currentPatient.age}y
              </span>
              <span className="text-[#3d494c] text-xs">•</span>
              <span className="text-[10px] font-mono text-[#ffb95f] bg-[#e79400]/20 px-1.5 py-0.5 rounded">
                FBG {currentPatient.fastingGlucose} mg/dL
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#bcc9cd] ml-1" />
            </button>

            {patientDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-[#060e20] border border-cyan-500/30 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono text-[#869397] px-2 py-1">
                  Select Patient Record (Tehran Cohort)
                </span>
                {allPatients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPatient(p);
                      setPatientDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                      p.id === currentPatient.id
                        ? 'bg-[#171f33] text-[#4cd7f6] font-semibold border border-[#4cd7f6]/30'
                        : 'text-[#bcc9cd] hover:bg-[#131b2e] hover:text-[#dae2fd]'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <span className="font-mono">{p.name} ({p.gender}, {p.age}y)</span>
                      <span className="text-[10px] text-[#869397]">
                        CAD: {p.cadProbability}% | LAD: {p.ladStenosis}%
                      </span>
                    </div>
                    {p.id === currentPatient.id && <Check className="w-4 h-4 text-[#4cd7f6]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Engine Status, Action Buttons, Profile */}
        <div className="flex items-center gap-3">
          {/* Multi-Task Engine Stat */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171f33]/70 border border-cyan-500/20">
            <UserCheck className="w-4 h-4 text-[#4cd7f6]" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-mono text-[#bcc9cd]">Multi-Task ML Engine</span>
              <span className="text-[11px] font-mono font-bold text-[#4cd7f6]">AUC ≥ 0.88 (Nominal)</span>
            </div>
          </div>

          {/* Filter Stack */}
          <button
            onClick={onOpenFilterModal}
            className="px-3 py-1.5 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#bcc9cd] hover:text-[#dae2fd] text-xs font-medium transition-all flex items-center gap-1.5 border border-white/5 active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#4cd7f6]" />
            <span>Filter Stack</span>
          </button>

          {/* Re-Run Inference */}
          <button
            onClick={onOpenInferenceModal}
            disabled={isInferencing}
            className="px-3.5 py-1.5 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-[0_0_14px_rgba(76,215,246,0.45)] active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isInferencing ? 'animate-spin' : ''}`} />
            <span>Re-Run Inference</span>
          </button>

          {/* User Avatar */}
          <div
            title="Dr. D. Barui (Interventional Cardiology)"
            className="w-8 h-8 rounded-full bg-[#4cd7f6] flex items-center justify-center shrink-0 shadow-[0_0_8px_#4cd7f6] cursor-pointer hover:ring-2 hover:ring-[#4cd7f6]/50 transition-all"
          >
            <span className="material-symbols-outlined text-[#003640] text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
