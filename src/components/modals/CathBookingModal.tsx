import React, { useState } from 'react';
import { PatientData } from '../../types/cardio';
import { X, Calendar, Stethoscope, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

interface CathBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientData;
  onBookingConfirmed: (suite: string) => void;
}

export const CathBookingModal: React.FC<CathBookingModalProps> = ({
  isOpen,
  onClose,
  patient,
  onBookingConfirmed,
}) => {
  const [selectedSuite, setSelectedSuite] = useState('Suite B (Radial Angiography)');
  const [scheduledTime, setScheduledTime] = useState('Today at 14:30');
  const [leadPhysician, setLeadPhysician] = useState('Dr. D. Barui, MD, FSCAI');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onBookingConfirmed(selectedSuite);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-[#060E20] border border-cyan-500/30 shadow-2xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#171f33] flex items-center justify-center text-[#4cd7f6] border border-[#4cd7f6]/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dae2fd]">Confirm Catheterization Lab Booking</h3>
              <p className="text-[11px] text-[#bcc9cd]">Patient #{patient.id} • Urgent LAD Stenosis ({patient.ladStenosis}%)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#171f33] text-[#bcc9cd] hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex flex-col items-center justify-center text-center gap-2">
            <CheckCircle2 className="w-10 h-10 text-[#34d399] animate-bounce" />
            <h4 className="text-base font-bold text-[#dae2fd]">Cath Lab Suite Confirmed!</h4>
            <p className="text-xs text-[#bcc9cd]">
              Reserved {selectedSuite} for {scheduledTime}. PACS order broadcasted.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-xs font-mono">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#bcc9cd] font-sans">Target Cath Suite:</label>
              <select
                value={selectedSuite}
                onChange={(e) => setSelectedSuite(e.target.value)}
                className="p-2 rounded-lg bg-[#131b2e] border border-white/10 text-[#dae2fd] focus:outline-none focus:border-[#4cd7f6]"
              >
                <option value="Suite B (Radial Angiography)">Suite B (Radial Angiography & IVUS) - Ready</option>
                <option value="Suite A (Hybrid OR & Stenting)">Suite A (Hybrid OR & High-Risk Stenting)</option>
                <option value="Suite C (Elective Diagnostic)">Suite C (Elective Diagnostic)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#bcc9cd] font-sans">Procedure Window:</label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="p-2 rounded-lg bg-[#131b2e] border border-white/10 text-[#dae2fd]"
                >
                  <option value="Today at 14:30">Today at 14:30 (Immediate)</option>
                  <option value="Today at 16:00">Today at 16:00</option>
                  <option value="Tomorrow at 08:30">Tomorrow at 08:30</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#bcc9cd] font-sans">Operating Physician:</label>
                <input
                  type="text"
                  value={leadPhysician}
                  onChange={(e) => setLeadPhysician(e.target.value)}
                  className="p-2 rounded-lg bg-[#131b2e] border border-white/10 text-[#dae2fd]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#131b2e] border border-[#ff1744]/30 flex flex-col gap-1 text-[11px] font-sans">
              <span className="font-bold text-[#ffb4ab] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#ff1744]" />
                Urgent Clinical Indicator
              </span>
              <p className="text-[#bcc9cd]">
                LAD stenosis is calibrated at {patient.ladStenosis}% with FFR {patient.ffrEstimate}. Coronary wire 0.014" and drug-eluting stent (3.0mm × 18mm) staged in pre-op inventory.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-bold transition-all shadow-[0_0_12px_rgba(76,215,246,0.4)]"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
