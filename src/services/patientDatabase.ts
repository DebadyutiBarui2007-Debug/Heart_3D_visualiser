import { PatientData } from '../types/cardio.ts';
import { runMultiTaskInference } from './mlEngine.ts';

interface PatientSeed {
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
  dominance: 'Right' | 'Left' | 'Co-Dominant';
  cathSuite: string;
  history: {
    hypertension: boolean;
    diabetes: boolean;
    smoker: boolean;
    familyHistory: boolean;
  };
}

const SEED_PATIENTS: PatientSeed[] = [
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
    dominance: 'Right',
    cathSuite: 'Suite B (Scheduled <24h)',
    history: { hypertension: true, diabetes: true, smoker: true, familyHistory: true },
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
    dominance: 'Left',
    cathSuite: 'Suite A (Immediate)',
    history: { hypertension: true, diabetes: true, smoker: false, familyHistory: true },
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
    dominance: 'Right',
    cathSuite: 'Not Indicated',
    history: { hypertension: false, diabetes: false, smoker: false, familyHistory: false },
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
    dominance: 'Right',
    cathSuite: 'Suite C (Elective 48h)',
    history: { hypertension: true, diabetes: false, smoker: true, familyHistory: false },
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
    dominance: 'Right',
    cathSuite: 'Suite B (Scheduled <24h)',
    history: { hypertension: true, diabetes: false, smoker: false, familyHistory: true },
  },
  {
    id: 'Z-019',
    name: 'Patient #Z-019',
    age: 71,
    gender: 'Male',
    systolicBp: 168,
    diastolicBp: 98,
    fastingGlucose: 185,
    totalCholesterol: 260,
    restingHr: 86,
    bmi: 30.1,
    chestPainType: 'Typical Angina',
    rwmaStatus: 'RWMA Anterior Hypokinesis',
    ecgFinding: 'ST-Elevation Triage',
    dominance: 'Co-Dominant',
    cathSuite: 'Suite A (Hybrid OR Emergency)',
    history: { hypertension: true, diabetes: true, smoker: true, familyHistory: true },
  },
  {
    id: 'Z-088',
    name: 'Patient #Z-088',
    age: 44,
    gender: 'Female',
    systolicBp: 116,
    diastolicBp: 74,
    fastingGlucose: 88,
    totalCholesterol: 165,
    restingHr: 66,
    bmi: 21.5,
    chestPainType: 'Non-Anginal',
    rwmaStatus: 'Normal Wall Motion',
    ecgFinding: 'Normal Sinus',
    dominance: 'Right',
    cathSuite: 'Not Indicated',
    history: { hypertension: false, diabetes: false, smoker: false, familyHistory: false },
  },
  {
    id: 'Z-155',
    name: 'Patient #Z-155',
    age: 60,
    gender: 'Male',
    systolicBp: 144,
    diastolicBp: 90,
    fastingGlucose: 136,
    totalCholesterol: 235,
    restingHr: 76,
    bmi: 27.4,
    chestPainType: 'Atypical',
    rwmaStatus: 'Lateral Hypokinesis',
    ecgFinding: 'ST-T Wave Abnormality',
    dominance: 'Left',
    cathSuite: 'Suite B (Scheduled <24h)',
    history: { hypertension: true, diabetes: false, smoker: true, familyHistory: true },
  },
];

/**
 * Builds calibrated cohort records using the official ML engine
 */
export function buildVerifiedCohort(): PatientData[] {
  return SEED_PATIENTS.map((seed) => {
    const inference = runMultiTaskInference({
      age: seed.age,
      gender: seed.gender,
      systolicBp: seed.systolicBp,
      diastolicBp: seed.diastolicBp,
      fastingGlucose: seed.fastingGlucose,
      totalCholesterol: seed.totalCholesterol,
      restingHr: seed.restingHr,
      bmi: seed.bmi,
      rwmaStatus: seed.rwmaStatus,
      ecgFinding: seed.ecgFinding,
      chestPainType: seed.chestPainType,
      history: seed.history,
    });

    return {
      ...seed,
      cadProbability: inference.cadProbability,
      ladStenosis: inference.ladStenosis,
      lcxStenosis: inference.lcxStenosis,
      rcaStenosis: inference.rcaStenosis,
      ffrEstimate: inference.ffrEstimate,
      rcaPatency: inference.rcaPatency,
      triagePriority: inference.triagePriority,
      shapValues: inference.shapValues,
    };
  });
}
