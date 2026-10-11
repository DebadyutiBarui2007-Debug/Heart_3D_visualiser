import React, { useState } from 'react';
import { PatientData } from '../../types/cardio';
import { runMultiTaskInference } from '../../services/mlEngine';
import { Sparkles, Sliders, ArrowUpRight, ArrowDownRight, RefreshCw, Info, HelpCircle } from 'lucide-react';

interface ShapTelemetryViewProps {
  patient: PatientData;
  onUpdatePatientVitals: (updatedVitals: Partial<PatientData>) => void;
}

export const ShapTelemetryView: React.FC<ShapTelemetryViewProps> = ({
  patient,
  onUpdatePatientVitals,
}) => {
  // Counterfactual What-If Simulation local state
  const [simBp, setSimBp] = useState(patient.systolicBp);
  const [simGlucose, setSimGlucose] = useState(patient.fastingGlucose);
  const [simChol, setSimChol] = useState(patient.totalCholesterol);
  const [simBmi, setSimBmi] = useState(patient.bmi);
  const [simRwma, setSimRwma] = useState(patient.rwmaStatus.includes('Hypokinesis'));

  // Calculate live counterfactual predictions using the authentic ML & SHAP engine
  const simPrediction = runMultiTaskInference({
    age: patient.age,
    gender: patient.gender,
    systolicBp: simBp,
    fastingGlucose: simGlucose,
    totalCholesterol: simChol,
    restingHr: patient.restingHr,
    bmi: simBmi,
    rwmaStatus: simRwma ? 'RWMA Anterior Hypokinesis' : 'Normal Wall Motion',
    ecgFinding: patient.ecgFinding,
    chestPainType: patient.chestPainType,
    history: patient.history,
  });

  const simulatedCadRisk = simPrediction.cadProbability;
  const simulatedLadStenosis = simPrediction.ladStenosis;

  const handleApplyToPatient = () => {
    onUpdatePatientVitals({
      systolicBp: simBp,
      fastingGlucose: simGlucose,
      totalCholesterol: simChol,
      bmi: simBmi,
      rwmaStatus: simRwma ? 'RWMA Anterior Hypokinesis' : 'Normal Wall Motion',
      cadProbability: simPrediction.cadProbability,
      ladStenosis: simPrediction.ladStenosis,
      lcxStenosis: simPrediction.lcxStenosis,
      rcaStenosis: simPrediction.rcaStenosis,
      ffrEstimate: simPrediction.ffrEstimate,
      rcaPatency: simPrediction.rcaPatency,
      triagePriority: simPrediction.triagePriority,
      shapValues: simPrediction.shapValues,
    });
  };

  const handleResetSim = () => {
    setSimBp(patient.systolicBp);
    setSimGlucose(patient.fastingGlucose);
    setSimChol(patient.totalCholesterol);
    setSimBmi(patient.bmi);
    setSimRwma(patient.rwmaStatus.includes('Hypokinesis'));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-6 shadow-xl border border-cyan-500/25 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#171f33] flex items-center justify-center text-[#4cd7f6] shadow-[0_0_16px_rgba(76,215,246,0.35)] border border-[#4cd7f6]/30">
            <Sparkles className="w-6 h-6 text-[#4cd7f6]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#dae2fd]">SHAP Explainability & Attribution Suite</h2>
              <span className="text-[10px] font-mono bg-[#4cd7f6]/10 text-[#4cd7f6] border border-[#4cd7f6]/30 px-2 py-0.5 rounded">
                KernelExplainer (n=303)
              </span>
            </div>
            <p className="text-xs text-[#bcc9cd] mt-0.5">
              Local and global game-theoretic attribution verifying model reasoning for Patient #{patient.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#131b2e]/80 border border-white/5 flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono text-[#869397]">Expected Base Value E[f(x)]</span>
            <span className="font-mono text-sm font-bold text-[#4cd7f6]">0.280 (28.0%)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#131b2e]/80 border border-white/5 flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono text-[#869397]">Model Output f(x)</span>
            <span className="font-mono text-sm font-bold text-[#ff1744]">{(simPrediction.cadProbability / 100).toFixed(3)} ({simPrediction.cadProbability}%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Waterfall Attribution Chart & Breakdown */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-5 shadow-xl border border-cyan-500/20 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#dae2fd]">Waterfall Force Attribution</h3>
                <span className="text-[11px] text-[#bcc9cd]">Diverging force plot showing directional risk pushes</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-[#4cd7f6]">
                  <span className="w-2 h-2 rounded bg-[#4cd7f6]" /> Protective
                </span>
                <span className="flex items-center gap-1 text-[#ff1744]">
                  <span className="w-2 h-2 rounded bg-[#ff1744]" /> Risk Acceleration
                </span>
              </div>
            </div>

            {/* Waterfall bars */}
            <div className="flex flex-col gap-3.5 pt-2">
              {simPrediction.shapValues.map((item, idx) => {
                const isRisk = item.impact > 0;
                return (
                  <div key={idx} className="p-3 rounded-xl bg-[#131b2e]/70 border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isRisk ? (
                          <ArrowUpRight className="w-4 h-4 text-[#ff1744]" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-[#4cd7f6]" />
                        )}
                        <span className="text-xs font-semibold text-[#dae2fd]">{item.feature}</span>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#171f33] text-[#bcc9cd]">
                          {item.value}
                        </span>
                      </div>
                      <span className={`text-xs font-mono font-bold ${isRisk ? 'text-[#ff1744]' : 'text-[#4cd7f6]'}`}>
                        {isRisk ? `+${item.impact.toFixed(3)}` : `${item.impact.toFixed(3)}`}
                      </span>
                    </div>

                    <div className="w-full bg-[#222a3d] h-2.5 rounded-full flex overflow-hidden">
                      {isRisk ? (
                        <>
                          <div className="w-1/2 bg-transparent" />
                          <div
                            className="h-full bg-[#ff1744] rounded-r-full shadow-[0_0_8px_#ff1744]"
                            style={{ width: `${Math.min(50, Math.abs(item.percentage))}%` }}
                          />
                        </>
                      ) : (
                        <>
                          <div
                            style={{ width: `${50 - Math.min(50, Math.abs(item.percentage))}%` }}
                            className="bg-transparent"
                          />
                          <div
                            className="h-full bg-[#4cd7f6] rounded-l-full shadow-[0_0_8px_#4cd7f6]"
                            style={{ width: `${Math.min(50, Math.abs(item.percentage))}%` }}
                          />
                          <div className="w-1/2 bg-transparent" />
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-[#869397] italic">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Global Cohort Feature Beeswarm Distribution */}
          <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-5 shadow-xl border border-cyan-500/20 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <h3 className="text-base font-bold text-[#dae2fd]">Global Cohort Feature Importance (Mean |SHAP|)</h3>
              <span className="text-[10px] font-mono text-[#869397]">n=303 records</span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs font-mono">
              {[
                { name: 'Systolic Blood Pressure', score: 0.324, width: '92%' },
                { name: 'Age', score: 0.285, width: '81%' },
                { name: 'Echocardiogram RWMA', score: 0.245, width: '70%' },
                { name: 'Fasting Blood Glucose', score: 0.198, width: '56%' },
                { name: 'Total Serum Cholesterol', score: 0.142, width: '40%' },
                { name: 'Chest Pain Type (Angina)', score: 0.118, width: '33%' },
                { name: 'Resting Heart Rate', score: 0.088, width: '25%' },
                { name: 'Body Mass Index (BMI)', score: 0.062, width: '18%' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <span className="text-[#bcc9cd] font-sans w-48 truncate">{row.name}</span>
                  <div className="flex-1 bg-[#222a3d] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4cd7f6] h-full rounded-full shadow-[0_0_6px_#4cd7f6]" style={{ width: row.width }} />
                  </div>
                  <span className="text-[#dae2fd] w-14 text-right">{row.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Counterfactual "What-If" Simulator */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-5 shadow-2xl border border-cyan-500/25 flex flex-col gap-4 sticky top-20">
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#4cd7f6]" />
                <h3 className="text-base font-bold text-[#dae2fd]">Counterfactual "What-If" Simulator</h3>
              </div>
              <button
                onClick={handleResetSim}
                className="text-[11px] text-[#bcc9cd] hover:text-[#4cd7f6] flex items-center gap-1 font-mono transition-colors"
                title="Reset to current baseline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <p className="text-xs text-[#bcc9cd]">
              Adjust biomarkers to simulate real-time model re-inference, vascular risk deceleration, or therapeutic intervention response.
            </p>

            {/* Simulated Live Outputs */}
            <div className="p-4 rounded-xl bg-[#131b2e]/80 border border-white/5 flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#bcc9cd]">Projected CAD Probability:</span>
                <span className={`text-2xl font-bold font-mono ${simulatedCadRisk > 50 ? 'text-[#ff1744]' : 'text-[#4cd7f6]'}`}>
                  {simulatedCadRisk}%
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#bcc9cd]">Projected LAD Stenosis:</span>
                <span className={`text-xl font-bold font-mono ${simulatedLadStenosis > 50 ? 'text-[#ff1744]' : 'text-[#ffb95f]'}`}>
                  {simulatedLadStenosis}%
                </span>
              </div>
              <div className="w-full bg-[#222a3d] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${simulatedCadRisk > 50 ? 'bg-[#ff1744]' : 'bg-[#4cd7f6]'}`}
                  style={{ width: `${simulatedCadRisk}%` }}
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="flex flex-col gap-4 text-xs">
              {/* SBP */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[#dae2fd] font-sans">Systolic BP:</span>
                  <span className="text-[#ffb95f] font-bold">{simBp} mmHg</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="200"
                  value={simBp}
                  onChange={(e) => setSimBp(Number(e.target.value))}
                  className="w-full accent-[#4cd7f6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869397] font-mono">
                  <span>90 (Optimal)</span>
                  <span>140 (Hypertensive)</span>
                  <span>200 (Stage 3)</span>
                </div>
              </div>

              {/* Fasting Glucose */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[#dae2fd] font-sans">Fasting Glucose:</span>
                  <span className="text-[#ffb95f] font-bold">{simGlucose} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="240"
                  value={simGlucose}
                  onChange={(e) => setSimGlucose(Number(e.target.value))}
                  className="w-full accent-[#4cd7f6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869397] font-mono">
                  <span>70 (Normal)</span>
                  <span>126 (Diabetic)</span>
                  <span>240 (Severe)</span>
                </div>
              </div>

              {/* Total Cholesterol */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[#dae2fd] font-sans">Total Cholesterol:</span>
                  <span className="text-[#ffb95f] font-bold">{simChol} mg/dL</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="320"
                  value={simChol}
                  onChange={(e) => setSimChol(Number(e.target.value))}
                  className="w-full accent-[#4cd7f6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#869397] font-mono">
                  <span>130 (Desirable)</span>
                  <span>200 (Borderline)</span>
                  <span>320 (High)</span>
                </div>
              </div>

              {/* Body Mass Index */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[#dae2fd] font-sans">BMI:</span>
                  <span className="text-[#4cd7f6] font-bold">{simBmi} kg/m²</span>
                </div>
                <input
                  type="range"
                  min="18.5"
                  max="38"
                  step="0.1"
                  value={simBmi}
                  onChange={(e) => setSimBmi(Number(e.target.value))}
                  className="w-full accent-[#4cd7f6] cursor-pointer"
                />
              </div>

              {/* RWMA Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#131b2e]/70 border border-white/5">
                <span className="text-[#dae2fd]">Anterior Wall Hypokinesis:</span>
                <button
                  type="button"
                  onClick={() => setSimRwma(!simRwma)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    simRwma ? 'bg-[#ff1744] text-white' : 'bg-[#171f33] text-[#bcc9cd]'
                  }`}
                >
                  {simRwma ? 'Present (RWMA+)' : 'Absent (Normal)'}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleApplyToPatient}
                className="w-full py-2.5 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] font-bold text-xs transition-all shadow-[0_0_12px_rgba(76,215,246,0.4)]"
              >
                Apply Parameters to Patient #{patient.id}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
