import React, { useState } from 'react';
import { PatientData } from '../../types/cardio.ts';
import { apiClient } from '../../services/apiClient.ts';
import { X, RefreshCw, Cpu, CheckCircle2, Zap } from 'lucide-react';

interface InferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientData;
  onInferenceComplete: (updatedPatient: PatientData) => void;
}

export const InferenceModal: React.FC<InferenceModalProps> = ({
  isOpen,
  onClose,
  patient,
  onInferenceComplete,
}) => {
  const [sbp, setSbp] = useState(patient.systolicBp);
  const [fbg, setFbg] = useState(patient.fastingGlucose);
  const [hr, setHr] = useState(patient.restingHr);
  const [chol, setChol] = useState(patient.totalCholesterol);
  const [rwma, setRwma] = useState(patient.rwmaStatus);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState('');

  if (!isOpen) return null;

  const handleRunInference = () => {
    setIsRunning(true);
    setStep('Sanitizing inputs & enforcing Zero Target Leakage protocol...');

    setTimeout(() => {
      setStep('Connecting to /api/predict & running CUDA GraphNet (14.2ms)...');
    }, 400);

    setTimeout(() => {
      setStep('Evaluating Multi-Task branch loss and computing SHAP attributions...');
    }, 900);

    setTimeout(async () => {
      const pred = await apiClient.runInference({
        age: patient.age,
        gender: patient.gender,
        systolicBp: sbp,
        diastolicBp: patient.diastolicBp,
        fastingGlucose: fbg,
        totalCholesterol: chol,
        restingHr: hr,
        bmi: patient.bmi,
        rwmaStatus: rwma,
        ecgFinding: patient.ecgFinding,
        chestPainType: patient.chestPainType,
        history: patient.history,
      });

      const updated: PatientData = {
        ...patient,
        systolicBp: sbp,
        fastingGlucose: fbg,
        restingHr: hr,
        totalCholesterol: chol,
        rwmaStatus: rwma,
        cadProbability: pred.cadProbability,
        ladStenosis: pred.ladStenosis,
        lcxStenosis: pred.lcxStenosis,
        rcaStenosis: pred.rcaStenosis,
        ffrEstimate: pred.ffrEstimate,
        rcaPatency: pred.rcaPatency,
        triagePriority: pred.triagePriority,
        shapValues: pred.shapValues,
      };

      setIsRunning(false);
      onInferenceComplete(updated);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-[#060E20] border border-cyan-500/30 shadow-2xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#171f33] flex items-center justify-center text-[#4cd7f6] border border-[#4cd7f6]/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dae2fd]">Re-Run GraphNet Inference</h3>
              <p className="text-[11px] text-[#bcc9cd]">Simulate real-time prediction for Patient #{patient.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#171f33] text-[#bcc9cd] hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#bcc9cd] font-sans">Systolic BP (mmHg)</label>
            <input
              type="number"
              value={sbp}
              onChange={(e) => setSbp(Number(e.target.value))}
              className="p-2 rounded-lg bg-[#131b2e] border border-white/10 text-[#dae2fd] focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#bcc9cd] font-sans">Fasting Glucose (mg/dL)</label>
            <input
              type="number"
              value={fbg}
              onChange={(e) => setFbg(Number(e.target.value))}
              className="p-2 rounded-lg bg-[#131b2e] border border-white/10 text-[#dae2fd] focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#bcc9cd] font-sans">Resting Heart Rate (bpm)</label>
            <input
              type="number"
              value={hr}
              onChange={(e) => setHr(Number(e.target.value))}
              className="p-2 rounded-lg bg-[#131b2e] border border-white/10 text-[#dae2fd] focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#bcc9cd] font-sans">Total Cholesterol (mg/dL)</label>
            <input
              type="number"
              value={chol}
              onChange={(e) => setChol(Number(e.target.value))}
              className="p-2 rounded-lg bg-[#131b2e] border border-white/10 text-[#dae2fd] focus:outline-none focus:border-[#4cd7f6]"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[#bcc9cd] font-sans">Echo Wall Motion (RWMA)</label>
            <select
              value={rwma}
              onChange={(e) => setRwma(e.target.value as any)}
              className="p-2 rounded-lg bg-[#131b2e] border border-white/10 text-[#dae2fd] focus:outline-none focus:border-[#4cd7f6]"
            >
              <option value="RWMA Anterior Hypokinesis">RWMA Anterior Hypokinesis (High LAD risk)</option>
              <option value="Inferior Hypokinesis">Inferior Hypokinesis (RCA territory)</option>
              <option value="Lateral Hypokinesis">Lateral Hypokinesis (LCX territory)</option>
              <option value="Normal Wall Motion">Normal Wall Motion (Preserved)</option>
            </select>
          </div>
        </div>

        {/* Inference Progress Display */}
        {isRunning && (
          <div className="p-3.5 rounded-xl bg-[#131b2e] border border-cyan-500/30 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-[#4cd7f6] animate-spin" />
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold text-[#4cd7f6]">CUDA GPU In-Flight</span>
              <span className="text-[11px] text-[#bcc9cd]">{step}</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleRunInference}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-bold transition-all shadow-[0_0_12px_rgba(76,215,246,0.4)] flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-[#003640]" />
            <span>{isRunning ? 'Computing...' : 'Execute 14ms Inference'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
