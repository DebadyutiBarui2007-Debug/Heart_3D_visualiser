import React, { useState } from 'react';
import { PatientData } from '../../types/cardio';
import { Stethoscope, CheckSquare, Square, AlertCircle, FileText, Calendar, Clock, User, ShieldAlert, Award } from 'lucide-react';

interface CathPrepSuiteViewProps {
  patient: PatientData;
  onOpenBookingModal: () => void;
  onExportDicom: () => void;
}

export const CathPrepSuiteView: React.FC<CathPrepSuiteViewProps> = ({
  patient,
  onOpenBookingModal,
  onExportDicom,
}) => {
  // Interactive Checklist State
  const [checklist, setChecklist] = useState({
    informedConsent: true,
    npoStatus: true,
    aspirinLoad: true,
    p2y12Load: true,
    allensTest: true,
    renalEgfr: true,
    contrastHydration: false,
    ivAccessBilateral: true,
  });

  // Stent sizing interactive calculator
  const [vesselDiameter, setVesselDiameter] = useState(3.0);
  const [lesionLength, setLesionLength] = useState(18);
  const [selectedStentType, setSelectedStentType] = useState('Everolimus-Eluting (Xience Sierra)');

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-6 shadow-xl border border-cyan-500/25 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#171f33] flex items-center justify-center text-[#4cd7f6] shadow-[0_0_16px_rgba(76,215,246,0.35)] border border-[#4cd7f6]/30">
            <Stethoscope className="w-6 h-6 text-[#4cd7f6]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#dae2fd]">Invasive Catheterization Preparation Suite</h2>
              <span className="text-[10px] font-mono bg-[#ff1744]/20 text-[#ffb4ab] border border-[#ff1744]/40 px-2 py-0.5 rounded font-bold">
                Priority 1: {patient.triagePriority}
              </span>
            </div>
            <p className="text-xs text-[#bcc9cd] mt-0.5">
              Protocolized surgical staging, pre-op verification, and stent sizing for Patient #{patient.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportDicom}
            className="px-3.5 py-2 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] text-xs font-medium transition-all border border-white/5 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-[#4cd7f6]" />
            <span>Export DICOM Brief</span>
          </button>
          <button
            onClick={onOpenBookingModal}
            className="px-4 py-2 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-bold transition-all shadow-[0_0_14px_rgba(76,215,246,0.4)] flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule / Confirm Suite</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pre-Procedure Checklist & Stent Sizing */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Pre-Procedure Checklist */}
          <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-5 shadow-xl border border-cyan-500/20 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2.5">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#dae2fd]">Pre-Operative Safety Checklist</h3>
                <span className="text-xs text-[#bcc9cd]">Mandatory pre-catheterization safety verification</span>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${completedCount === totalCount ? 'bg-[#10b981]/20 text-[#34d399]' : 'bg-[#ffb95f]/20 text-[#ffb95f]'}`}>
                {completedCount} of {totalCount} Cleared
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { key: 'informedConsent', label: 'Informed Consent Signed', sub: 'Coronary angiography & possible PCI' },
                { key: 'npoStatus', label: 'NPO Status Verified', sub: 'Strict fasting for > 6 hours' },
                { key: 'aspirinLoad', label: 'Aspirin 325mg Loaded', sub: 'Chewable non-enteric formulation' },
                { key: 'p2y12Load', label: 'P2Y12 Inhibitor Loaded', sub: 'Ticagrelor 180mg or Clopidogrel 600mg' },
                { key: 'allensTest', label: 'Radial Allen\'s Test Positive', sub: 'Adequate palmar arch collateral perfusion' },
                { key: 'renalEgfr', label: 'Renal Function eGFR > 60', sub: 'Serum creatinine calibrated' },
                { key: 'contrastHydration', label: 'Pre-Hydration Protocol Active', sub: '0.9% Normal Saline 1 mL/kg/h' },
                { key: 'ivAccessBilateral', label: 'Bilateral Large-Bore IV Access', sub: '20-gauge or 18-gauge catheter' },
              ].map((item) => {
                const k = item.key as keyof typeof checklist;
                const checked = checklist[k];
                return (
                  <div
                    key={k}
                    onClick={() => toggleCheck(k)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      checked
                        ? 'bg-[#131b2e]/90 border-cyan-500/30 text-[#dae2fd]'
                        : 'bg-[#131b2e]/40 border-white/5 text-[#869397] hover:border-white/10'
                    }`}
                  >
                    <div className="mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-[#4cd7f6]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#869397]" />
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className={`text-xs font-medium ${checked ? 'text-[#dae2fd]' : 'text-[#869397]'}`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] text-[#869397] font-mono">{item.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stent Selection & Lesion Geometry Sizing */}
          <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-5 shadow-xl border border-cyan-500/20 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <h3 className="text-base font-bold text-[#dae2fd]">Lesion Stent Geometry Calculator</h3>
              <span className="text-[10px] font-mono text-[#4cd7f6]">LAD Proximal Target</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#bcc9cd] font-sans">Reference Vessel Diameter (RVD):</span>
                  <span className="text-[#4cd7f6] font-bold">{vesselDiameter} mm</span>
                </div>
                <input
                  type="range"
                  min="2.25"
                  max="4.5"
                  step="0.25"
                  value={vesselDiameter}
                  onChange={(e) => setVesselDiameter(Number(e.target.value))}
                  className="w-full accent-[#4cd7f6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869397] font-mono">
                  <span>2.25 mm</span>
                  <span>3.0 mm (Nominal)</span>
                  <span>4.5 mm</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#bcc9cd] font-sans">Lesion Length:</span>
                  <span className="text-[#ffb95f] font-bold">{lesionLength} mm</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="38"
                  step="2"
                  value={lesionLength}
                  onChange={(e) => setLesionLength(Number(e.target.value))}
                  className="w-full accent-[#ffb95f] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869397] font-mono">
                  <span>12 mm (Focal)</span>
                  <span>18 mm</span>
                  <span>38 mm (Diffuse)</span>
                </div>
              </div>
            </div>

            {/* Recommended Stent Box */}
            <div className="p-3.5 rounded-xl bg-[#131b2e]/90 border border-cyan-500/30 flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-[#869397]">Recommended DES Specification</span>
                <span className="text-sm font-bold text-[#4cd7f6] font-mono">
                  {vesselDiameter}mm × {lesionLength}mm {selectedStentType}
                </span>
                <span className="text-[11px] text-[#bcc9cd] mt-0.5">
                  Nominal inflation pressure: 12-14 atm | Balloon-to-artery ratio: 1.1:1.0
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] text-xs font-bold font-mono">
                Optimal Sizing
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Physiological Assessment (FFR) & Cath Lab Scheduler */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* FFR / Physiological Hemodynamic Assessment */}
          <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-5 shadow-xl border border-cyan-500/20 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <h3 className="text-base font-bold text-[#dae2fd]">Physiological Assessment (FFR / iFR)</h3>
              <span className="text-[10px] font-mono text-[#ff1744] font-bold">Ischemic Threshold &lt; 0.80</span>
            </div>

            <div className="p-4 rounded-xl bg-[#131b2e]/80 border border-white/5 flex flex-col gap-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#bcc9cd]">Fractional Flow Reserve (FFR):</span>
                <span className="text-2xl font-mono font-bold text-[#ff1744]">{patient.ffrEstimate}</span>
              </div>
              <div className="w-full bg-[#222a3d] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#ff1744] h-full rounded-full shadow-[0_0_8px_#ff1744]"
                  style={{ width: `${(patient.ffrEstimate / 1.0) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-[#bcc9cd]">
                FFR of {patient.ffrEstimate} is strictly below the 0.80 diagnostic threshold, confirming hemodynamically significant ischemia requiring revascularization.
              </p>
            </div>

            <div className="text-[11px] font-mono text-[#869397] flex flex-col gap-1">
              <span>• Adenosine infusion standby: 140 mcg/kg/min IV</span>
              <span>• Pressure wire sensor equalization at aortic ostium</span>
            </div>
          </div>

          {/* Cath Lab Suite Reservation Card */}
          <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-5 shadow-2xl border border-cyan-500/25 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4cd7f6]" />
                <h3 className="text-base font-bold text-[#dae2fd]">Cath Lab Suite Staging</h3>
              </div>
              <span className="text-xs font-mono font-semibold text-[#4cd7f6]">{patient.cathSuite}</span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between py-1.5 px-3 rounded bg-[#131b2e]/70 text-[#dae2fd] border border-white/5">
                <span className="text-[#bcc9cd]">Interventional Cardiologist:</span>
                <span className="font-semibold text-[#4cd7f6]">Dr. D. Barui, MD, FSCAI</span>
              </div>
              <div className="flex justify-between py-1.5 px-3 rounded bg-[#131b2e]/70 text-[#dae2fd] border border-white/5">
                <span className="text-[#bcc9cd]">Planned Access:</span>
                <span className="font-mono text-[#ffb95f]">Right Radial Artery (6 French)</span>
              </div>
              <div className="flex justify-between py-1.5 px-3 rounded bg-[#131b2e]/70 text-[#dae2fd] border border-white/5">
                <span className="text-[#bcc9cd]">Surgical Backup:</span>
                <span className="font-mono text-[#dae2fd]">CVICU / CT Surgery on Standby</span>
              </div>
            </div>

            <button
              onClick={onOpenBookingModal}
              className="w-full py-2.5 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] font-bold text-xs transition-all shadow-[0_0_12px_rgba(76,215,246,0.4)] mt-2"
            >
              Confirm Suite Allocation & PACS Push
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
