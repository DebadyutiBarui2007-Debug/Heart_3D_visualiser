export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  systolicBp: number;
  diastolicBp: number;
  fastingGlucose: number;
  totalCholesterol: number;
  restingHr: number;
  bmi: number;
  chestPainType: 'Typical Angina' | 'Atypical' | 'Non-Anginal' | 'Asymptomatic';
  rwmaStatus: 'RWMA Anterior Hypokinesis' | 'Inferior Hypokinesis' | 'Lateral Hypokinesis' | 'Normal Wall Motion';
  ecgFinding: 'ST-T Wave Abnormality' | 'ST-Elevation Triage' | 'LVH' | 'Normal Sinus';
  cadProbability: number; // e.g. 82.4
  ladStenosis: number;    // e.g. 76.1
  lcxStenosis: number;    // e.g. 38.0
  rcaStenosis: number;    // e.g. 18.2
  ffrEstimate: number;    // e.g. 0.68
  rcaPatency: number;     // e.g. 82
  dominance: 'Right' | 'Left' | 'Co-Dominant';
  triagePriority: 'Urgent' | 'Semi-Urgent' | 'Routine' | 'Discharge';
  cathSuite: string;
  shapValues: {
    feature: string;
    value: string;
    impact: number; // positive = risk, negative = protective
    percentage: number;
    description: string;
  }[];
  history: {
    hypertension: boolean;
    diabetes: boolean;
    smoker: boolean;
    familyHistory: boolean;
  };
}

export const INITIAL_PATIENTS: PatientData[] = [
  {
    id: 'Z-303',
    name: 'Patient #Z-303',
    age: 58,
    gender: 'Male',
    systolicBp: 148,
    diastolicBp: 92,
    fastingGlucose: 142,
    totalCholesterol: 215,
    restingHr: 78,
    bmi: 24.1,
    chestPainType: 'Typical Angina',
    rwmaStatus: 'RWMA Anterior Hypokinesis',
    ecgFinding: 'ST-Elevation Triage',
    cadProbability: 82.4,
    ladStenosis: 76.1,
    lcxStenosis: 38.0,
    rcaStenosis: 18.2,
    ffrEstimate: 0.68,
    rcaPatency: 82,
    dominance: 'Right',
    triagePriority: 'Urgent',
    cathSuite: 'Suite B (Scheduled <24h)',
    shapValues: [
      { feature: 'Resting SBP', value: '148 mmHg', impact: 0.342, percentage: 34, description: 'Elevated systolic pressure increases myocardial wall stress' },
      { feature: 'Patient Age', value: '58 years', impact: 0.264, percentage: 26, description: 'Age-associated progressive arterial calcification' },
      { feature: 'Regional Wall Motion', value: 'RWMA Hypokinesis', impact: 0.211, percentage: 21, description: 'Anterior wall motion abnormality signals LAD ischemia' },
      { feature: 'Fasting Blood Glucose', value: '142 mg/dL', impact: 0.145, percentage: 14, description: 'Hyperglycemia accelerates endothelial injury' },
      { feature: 'Total Cholesterol', value: '215 mg/dL', impact: 0.082, percentage: 8, description: 'Moderate hyperlipidemia contributing to atheroma' },
      { feature: 'BMI', value: '24.1 kg/m²', impact: -0.095, percentage: -9, description: 'Normal body mass index exhibits mild protective attribution' },
    ],
    history: {
      hypertension: true,
      diabetes: true,
      smoker: true,
      familyHistory: true,
    },
  },
  {
    id: 'Z-104',
    name: 'Patient #Z-104',
    age: 64,
    gender: 'Female',
    systolicBp: 156,
    diastolicBp: 96,
    fastingGlucose: 168,
    totalCholesterol: 242,
    restingHr: 84,
    bmi: 28.3,
    chestPainType: 'Atypical',
    rwmaStatus: 'Lateral Hypokinesis',
    ecgFinding: 'ST-T Wave Abnormality',
    cadProbability: 89.2,
    ladStenosis: 84.5,
    lcxStenosis: 62.0,
    rcaStenosis: 32.5,
    ffrEstimate: 0.61,
    rcaPatency: 68,
    dominance: 'Left',
    triagePriority: 'Urgent',
    cathSuite: 'Suite A (Immediate)',
    shapValues: [
      { feature: 'Resting SBP', value: '156 mmHg', impact: 0.395, percentage: 39, description: 'Severe stage 2 systolic hypertension' },
      { feature: 'Fasting Glucose', value: '168 mg/dL', impact: 0.288, percentage: 29, description: 'Uncontrolled diabetes mellitus' },
      { feature: 'Patient Age', value: '64 years', impact: 0.271, percentage: 27, description: 'Post-menopausal vascular stiffness profile' },
      { feature: 'Total Cholesterol', value: '242 mg/dL', impact: 0.165, percentage: 16, description: 'Significant hypercholesterolemia' },
      { feature: 'BMI', value: '28.3 kg/m²', impact: 0.085, percentage: 8, description: 'Overweight category adds metabolic stress' },
      { feature: 'Resting HR', value: '84 bpm', impact: 0.052, percentage: 5, description: 'Elevated baseline sympathetic tone' },
    ],
    history: {
      hypertension: true,
      diabetes: true,
      smoker: false,
      familyHistory: true,
    },
  },
  {
    id: 'Z-042',
    name: 'Patient #Z-042',
    age: 49,
    gender: 'Male',
    systolicBp: 122,
    diastolicBp: 78,
    fastingGlucose: 94,
    totalCholesterol: 172,
    restingHr: 62,
    bmi: 22.8,
    chestPainType: 'Non-Anginal',
    rwmaStatus: 'Normal Wall Motion',
    ecgFinding: 'Normal Sinus',
    cadProbability: 14.6,
    ladStenosis: 18.0,
    lcxStenosis: 12.5,
    rcaStenosis: 9.8,
    ffrEstimate: 0.94,
    rcaPatency: 96,
    dominance: 'Right',
    triagePriority: 'Routine',
    cathSuite: 'Not Indicated',
    shapValues: [
      { feature: 'Normal Wall Motion', value: 'Normal', impact: -0.320, percentage: -32, description: 'Uniform contractility indicates preserved perfusion' },
      { feature: 'Resting SBP', value: '122 mmHg', impact: -0.215, percentage: -21, description: 'Optimal blood pressure baseline' },
      { feature: 'Fasting Glucose', value: '94 mg/dL', impact: -0.198, percentage: -20, description: 'Euglycemia with healthy insulin sensitivity' },
      { feature: 'BMI', value: '22.8 kg/m²', impact: -0.112, percentage: -11, description: 'Ideal lean body mass index' },
      { feature: 'Patient Age', value: '49 years', impact: 0.095, percentage: 9, description: 'Moderate age risk bracket' },
    ],
    history: {
      hypertension: false,
      diabetes: false,
      smoker: false,
      familyHistory: false,
    },
  },
  {
    id: 'Z-188',
    name: 'Patient #Z-188',
    age: 62,
    gender: 'Male',
    systolicBp: 138,
    diastolicBp: 86,
    fastingGlucose: 118,
    totalCholesterol: 204,
    restingHr: 72,
    bmi: 26.5,
    chestPainType: 'Atypical',
    rwmaStatus: 'Inferior Hypokinesis',
    ecgFinding: 'ST-T Wave Abnormality',
    cadProbability: 64.8,
    ladStenosis: 42.0,
    lcxStenosis: 48.5,
    rcaStenosis: 71.0,
    ffrEstimate: 0.72,
    rcaPatency: 29,
    dominance: 'Right',
    triagePriority: 'Semi-Urgent',
    cathSuite: 'Suite C (Elective 48h)',
    shapValues: [
      { feature: 'Inferior RWMA', value: 'Inferior Hypokinesis', impact: 0.312, percentage: 31, description: 'Right coronary territory regional ischemia' },
      { feature: 'Patient Age', value: '62 years', impact: 0.245, percentage: 24, description: 'Age-related coronary endothelial stiffening' },
      { feature: 'Resting SBP', value: '138 mmHg', impact: 0.168, percentage: 17, description: 'Pre-hypertensive arterial stress' },
      { feature: 'Total Cholesterol', value: '204 mg/dL', impact: 0.078, percentage: 8, description: 'Borderline elevated lipid profile' },
      { feature: 'BMI', value: '26.5 kg/m²', impact: 0.054, percentage: 5, description: 'Mild overweight risk contributor' },
    ],
    history: {
      hypertension: true,
      diabetes: false,
      smoker: true,
      familyHistory: false,
    },
  },
  {
    id: 'Z-271',
    name: 'Patient #Z-271',
    age: 55,
    gender: 'Female',
    systolicBp: 142,
    diastolicBp: 88,
    fastingGlucose: 130,
    totalCholesterol: 228,
    restingHr: 75,
    bmi: 25.2,
    chestPainType: 'Typical Angina',
    rwmaStatus: 'RWMA Anterior Hypokinesis',
    ecgFinding: 'ST-Elevation Triage',
    cadProbability: 78.5,
    ladStenosis: 72.8,
    lcxStenosis: 41.2,
    rcaStenosis: 22.0,
    ffrEstimate: 0.70,
    rcaPatency: 78,
    dominance: 'Right',
    triagePriority: 'Urgent',
    cathSuite: 'Suite B (Scheduled <24h)',
    shapValues: [
      { feature: 'Anterior RWMA', value: 'RWMA Hypokinesis', impact: 0.288, percentage: 29, description: 'Focal anterior ischemia pointing to LAD lesion' },
      { feature: 'Resting SBP', value: '142 mmHg', impact: 0.245, percentage: 25, description: 'Stage 1 hypertension' },
      { feature: 'Fasting Glucose', value: '130 mg/dL', impact: 0.185, percentage: 19, description: 'Impaired fasting glucose state' },
      { feature: 'Total Cholesterol', value: '228 mg/dL', impact: 0.124, percentage: 12, description: 'Elevated atherogenic lipoproteins' },
      { feature: 'Patient Age', value: '55 years', impact: 0.115, percentage: 12, description: 'Mid-50s coronary vulnerability index' },
    ],
    history: {
      hypertension: true,
      diabetes: false,
      smoker: false,
      familyHistory: true,
    },
  },
];
