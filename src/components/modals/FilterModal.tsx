import React, { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [minAge, setMinAge] = useState(40);
  const [maxAge, setMaxAge] = useState(80);
  const [gender, setGender] = useState<'all' | 'Male' | 'Female'>('all');
  const [hypertensionOnly, setHypertensionOnly] = useState(false);
  const [diabetesOnly, setDiabetesOnly] = useState(false);
  const [smokingOnly, setSmokingOnly] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({
      minAge,
      maxAge,
      gender,
      hypertensionOnly,
      diabetesOnly,
      smokingOnly,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-[#060E20] border border-cyan-500/30 shadow-2xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#171f33] flex items-center justify-center text-[#4cd7f6] border border-[#4cd7f6]/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dae2fd]">Filter Cohort Stack</h3>
              <p className="text-[11px] text-[#bcc9cd]">Adjust Tehran Heart Center clinical cohort parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#171f33] text-[#bcc9cd] hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col gap-4 text-xs font-mono">
          {/* Age range */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#bcc9cd] font-sans">Age Range:</span>
              <span className="text-[#4cd7f6] font-bold">{minAge}y – {maxAge}y</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="30"
                max="90"
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="p-2 rounded-lg bg-[#131b2e] border border-white/10 text-[#dae2fd]"
                placeholder="Min Age"
              />
              <input
                type="number"
                min="30"
                max="90"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="p-2 rounded-lg bg-[#131b2e] border border-white/10 text-[#dae2fd]"
                placeholder="Max Age"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[#bcc9cd] font-sans">Gender:</span>
            <div className="grid grid-cols-3 gap-2">
              {(['all', 'Male', 'Female'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-1.5 rounded-lg border text-xs capitalize transition-all ${
                    gender === g
                      ? 'bg-[#4cd7f6] text-[#003640] font-bold border-[#4cd7f6]'
                      : 'bg-[#131b2e] text-[#bcc9cd] border-white/10'
                  }`}
                >
                  {g === 'all' ? 'All' : g}
                </button>
              ))}
            </div>
          </div>

          {/* Comorbidities */}
          <div className="flex flex-col gap-2 pt-1 font-sans">
            <span className="text-[#bcc9cd]">Clinical Sub-groups:</span>
            <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#131b2e] cursor-pointer">
              <input
                type="checkbox"
                checked={hypertensionOnly}
                onChange={(e) => setHypertensionOnly(e.target.checked)}
                className="accent-[#4cd7f6]"
              />
              <span className="text-xs text-[#dae2fd]">Hypertension Positive (HTN+)</span>
            </label>
            <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#131b2e] cursor-pointer">
              <input
                type="checkbox"
                checked={diabetesOnly}
                onChange={(e) => setDiabetesOnly(e.target.checked)}
                className="accent-[#4cd7f6]"
              />
              <span className="text-xs text-[#dae2fd]">Diabetes Mellitus (DM+)</span>
            </label>
            <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#131b2e] cursor-pointer">
              <input
                type="checkbox"
                checked={smokingOnly}
                onChange={(e) => setSmokingOnly(e.target.checked)}
                className="accent-[#4cd7f6]"
              />
              <span className="text-xs text-[#dae2fd]">Active Smoker</span>
            </label>
          </div>
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
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-bold transition-all shadow-[0_0_12px_rgba(76,215,246,0.4)]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
