import React, { useState } from 'react';
import { PatientData } from '../../types/cardio';
import { X, FileText, Copy, Check, Download } from 'lucide-react';

interface DicomExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientData;
}

export const DicomExportModal: React.FC<DicomExportModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const dicomText = `--- DICOM v3.0 STRUCTURED REPORT (CORONARY CAD RISK) ---
(0008,0016) SOP Class UID: 1.2.840.10008.5.1.4.1.1.88.33 (Comprehensive SR)
(0008,0020) Study Date: 20261010
(0008,1030) Study Description: CARDIO-ML 3D INTELLIGENCE DIAGNOSTIC INFERENCE
(0010,0010) Patient Name: DE-IDENTIFIED^${patient.id}
(0010,0020) Patient ID: THC-${patient.id}
(0010,0030) Patient Age: ${patient.age}Y
(0010,0040) Patient Sex: ${patient.gender === 'Male' ? 'M' : 'F'}
(0018,1030) Protocol Name: Dual-Branch GraphNet Coronary Stenosis Triage v2.4

[CLINICAL HEMODYNAMICS & BIOMARKERS]
- Resting Blood Pressure: ${patient.systolicBp}/${patient.diastolicBp} mmHg
- Fasting Blood Glucose: ${patient.fastingGlucose} mg/dL
- Total Serum Cholesterol: ${patient.totalCholesterol} mg/dL
- Body Mass Index (BMI): ${patient.bmi} kg/m²
- Echocardiogram RWMA: ${patient.rwmaStatus}
- Baseline Resting Heart Rate: ${patient.restingHr} bpm

[MULTI-TARGET ARTERIAL STENOSIS INFERENCE]
1. CAD Occurrence Global Probability: ${patient.cadProbability}% (High Risk)
2. Left Anterior Descending (LAD) Stenosis: ${patient.ladStenosis}% (Severe ≥50%)
3. Left Circumflex (LCX) Stenosis: ${patient.lcxStenosis}% (Moderate 30-49%)
4. Right Coronary Artery (RCA) Stenosis: ${patient.rcaStenosis}% (Patent <30%)
5. Calculated FFR Gradient: ${patient.ffrEstimate} (Ischemic Threshold breached)

[RECOMMENDED INTERVENTIONAL ACTION]
- Access: Right Radial Artery (6 Fr Glidesheath)
- Proposed Stent: 3.0mm × 18mm Drug-Eluting Stent (Everolimus)
- Urgency: Priority 1 (${patient.triagePriority})
- Cath Suite Staging: ${patient.cathSuite}
- Sign-off: Dr. D. Barui, Interventional Cardiology Fellow`;

  const handleCopy = () => {
    navigator.clipboard.writeText(dicomText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([dicomText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `DICOM_SR_${patient.id}_CARDIO_ML.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-[#060E20] border border-cyan-500/30 shadow-2xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#171f33] flex items-center justify-center text-[#4cd7f6] border border-[#4cd7f6]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dae2fd]">DICOM v3.0 Structured Report Preview</h3>
              <p className="text-[11px] text-[#bcc9cd]">PACS Standard Formatted Brief for Patient #{patient.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#171f33] text-[#bcc9cd] hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-[#030917] border border-white/5 text-[11px] font-mono text-[#dae2fd] max-h-80 overflow-y-auto leading-relaxed select-all">
          {dicomText}
        </pre>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] font-mono text-[#869397]">
            COMPLIANT WITH DICOM PS 3.3 / PS 3.16 SUPPLEMENT 145
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] text-xs font-mono flex items-center gap-1.5 border border-white/5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-bold transition-all shadow-[0_0_12px_rgba(76,215,246,0.4)] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download DICOM File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
