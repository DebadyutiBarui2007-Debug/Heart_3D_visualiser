/**
 * Heart Disease & Coronary Artery Reference Dataset
 * Extracted from Official Project Documentation & Educational Starter Reference (PDF)
 *
 * SCOPE NOTE:
 * The project documentation identifies Coronary Artery Disease (CAD) and stenosis of the LAD, LCX,
 * and RCA as prediction targets. The broader disease reference below is a structured educational
 * expansion adhering to the CDC and MedlinePlus descriptive frameworks.
 *
 * CRITICAL ML & SAFETY PROTOCOL:
 * 1. The explanatory disease table is kept strictly separate from patient-level prediction datasets.
 * 2. When predicting LAD, LCX, or RCA stenosis, direct target labels and catheterization results
 *    are excluded from input features to prevent target leakage.
 */

export interface HeartDiseaseReferenceItem {
  disease_id: string;
  disease_name: string;
  affected_structure: string;
  effect_on_heart: string;
  blood_flow_effect: 'Reduced' | 'Disrupted' | 'Variable' | 'Compromised';
  possible_complication: string;
}

export interface CoronaryArteryTerritoryItem {
  artery_code: 'LAD' | 'LCX' | 'RCA';
  artery_name: string;
  anatomical_region: string;
  perfusion_territory: string;
  clinical_consequence: string;
  clinical_significance: string;
}

export const HEART_DISEASE_REFERENCE_DATA: HeartDiseaseReferenceItem[] = [
  {
    disease_id: 'D001',
    disease_name: 'Coronary Artery Disease (CAD)',
    affected_structure: 'Coronary arteries',
    effect_on_heart: 'Plaque narrows coronary arteries, reducing blood flow to heart muscle.',
    blood_flow_effect: 'Reduced',
    possible_complication: 'Heart attack (Myocardial Infarction), Ischemia',
  },
  {
    disease_id: 'D002',
    disease_name: 'Atherosclerosis',
    affected_structure: 'Artery walls',
    effect_on_heart: 'Fatty plaque builds up inside arteries and restricts blood flow.',
    blood_flow_effect: 'Reduced',
    possible_complication: 'Arterial stenosis, Plaque rupture, Thrombosis',
  },
  {
    disease_id: 'D003',
    disease_name: 'Angina',
    affected_structure: 'Heart muscle blood supply',
    effect_on_heart: 'Reduced blood supply causes chest discomfort; a symptom rather than a distinct disease.',
    blood_flow_effect: 'Reduced',
    possible_complication: 'Acute Coronary Syndrome, Unstable angina',
  },
  {
    disease_id: 'D004',
    disease_name: 'Myocardial Infarction (heart attack)',
    affected_structure: 'Heart muscle',
    effect_on_heart: 'Blocked blood flow damages or kills part of the heart muscle.',
    blood_flow_effect: 'Disrupted',
    possible_complication: 'Cardiogenic shock, Ventricular fibrillation, Heart failure',
  },
  {
    disease_id: 'D005',
    disease_name: 'Heart Failure',
    affected_structure: 'Heart muscle and chambers',
    effect_on_heart: "The heart cannot pump enough blood to meet the body's needs.",
    blood_flow_effect: 'Reduced',
    possible_complication: 'Pulmonary edema, End-organ hypoperfusion, Cachexia',
  },
  {
    disease_id: 'D006',
    disease_name: 'Arrhythmia',
    affected_structure: 'Electrical conduction system',
    effect_on_heart: 'Electrical signals cause an irregular, unusually fast, or slow heartbeat.',
    blood_flow_effect: 'Variable',
    possible_complication: 'Fainting or poor circulation, Syncope, Sudden cardiac arrest',
  },
  {
    disease_id: 'D007',
    disease_name: 'Atrial Fibrillation',
    affected_structure: 'Atria',
    effect_on_heart: 'The upper chambers beat irregularly; blood clots may form.',
    blood_flow_effect: 'Variable',
    possible_complication: 'Embolic stroke, Thromboembolism, Tachycardiomyopathy',
  },
  {
    disease_id: 'D008',
    disease_name: 'Cardiomyopathy',
    affected_structure: 'Heart muscle',
    effect_on_heart: 'Heart muscle becomes enlarged, thickened, stiff, or weakened.',
    blood_flow_effect: 'Variable',
    possible_complication: 'Congestive heart failure, Ventricular arrhythmias',
  },
  {
    disease_id: 'D009',
    disease_name: 'Valvular Heart Disease',
    affected_structure: 'Heart valves',
    effect_on_heart: 'A valve narrows or leaks, disrupting blood flow.',
    blood_flow_effect: 'Disrupted',
    possible_complication: 'Regurgitation, Stenosis, Chamber dilation, Heart failure',
  },
  {
    disease_id: 'D010',
    disease_name: 'Congenital Heart Disease',
    affected_structure: 'Chambers, walls, or valves',
    effect_on_heart: 'A structural abnormality present at birth affects blood flow.',
    blood_flow_effect: 'Disrupted',
    possible_complication: 'Cyanosis, Eisenmenger syndrome, Heart failure',
  },
  {
    disease_id: 'D011',
    disease_name: 'Rheumatic Heart Disease',
    affected_structure: 'Heart valves',
    effect_on_heart: 'Inflammation after rheumatic fever can scar and damage valves.',
    blood_flow_effect: 'Disrupted',
    possible_complication: 'Mitral stenosis, Aortic insufficiency, Infective endocarditis',
  },
  {
    disease_id: 'D012',
    disease_name: 'Myocarditis',
    affected_structure: 'Heart muscle',
    effect_on_heart: 'Inflammation may weaken pumping or disrupt rhythm.',
    blood_flow_effect: 'Variable',
    possible_complication: 'Reduced pumping function, Dilated cardiomyopathy, Death',
  },
  {
    disease_id: 'D013',
    disease_name: 'Pericarditis',
    affected_structure: 'Pericardium',
    effect_on_heart: 'Inflammation of the sac around the heart causes irritation and sometimes fluid buildup.',
    blood_flow_effect: 'Compromised',
    possible_complication: 'Cardiac tamponade, Constrictive pericarditis',
  },
  {
    disease_id: 'D014',
    disease_name: 'Endocarditis',
    affected_structure: 'Inner lining and valves',
    effect_on_heart: 'Infection of the inner lining can damage valves.',
    blood_flow_effect: 'Disrupted',
    possible_complication: 'Septic emboli, Valve destruction, Congestive heart failure',
  },
  {
    disease_id: 'D015',
    disease_name: 'Aortic Aneurysm',
    affected_structure: 'Aorta',
    effect_on_heart: 'A section of the aorta bulges and may become vulnerable to rupture.',
    blood_flow_effect: 'Compromised',
    possible_complication: 'Aortic dissection, Fatal internal hemorrhage, Rupture',
  },
  {
    disease_id: 'D016',
    disease_name: 'Hypertensive Heart Disease',
    affected_structure: 'Left ventricle and blood vessels',
    effect_on_heart: 'Long-term high blood pressure increases workload and may thicken or weaken heart muscle.',
    blood_flow_effect: 'Compromised',
    possible_complication: 'Left ventricular hypertrophy (LVH), Diastolic dysfunction, Heart failure',
  },
];

export const CORONARY_ARTERY_TERRITORIES: CoronaryArteryTerritoryItem[] = [
  {
    artery_code: 'LAD',
    artery_name: 'Left Anterior Descending (LAD)',
    anatomical_region: 'Front wall of the heart',
    perfusion_territory:
      'Supplies the front wall of the left ventricle and much of the front portion of the interventricular septum.',
    clinical_consequence:
      'Significant narrowing can reduce blood flow to these regions and injure heart muscle. Critical prognostic indicator.',
    clinical_significance: 'Supplies blood to the front of the left ventricle; critical prognostic indicator.',
  },
  {
    artery_code: 'LCX',
    artery_name: 'Left Circumflex (LCX)',
    anatomical_region: 'Side and back walls of the heart',
    perfusion_territory:
      'Supplies the side and, depending on anatomy, part of the back of the left ventricle.',
    clinical_consequence:
      'Narrowing can reduce blood supply to lateral and posterior wall segments of the left ventricle.',
    clinical_significance: 'Supplies lateral and posterior wall segments of the left ventricle.',
  },
  {
    artery_code: 'RCA',
    artery_name: 'Right Coronary Artery (RCA)',
    anatomical_region: 'Right side and bottom of the heart',
    perfusion_territory:
      'Commonly supplies the right atrium, right ventricle, and part of the lower heart wall (inferior wall).',
    clinical_consequence:
      'Narrowing may also affect the electrical conduction system in some people (SA/AV nodal branches).',
    clinical_significance: 'Supplies the right atrium, right ventricle, and inferior wall.',
  },
];

/**
 * Returns formatted CSV string matching Section 3 of the PDF documentation exactly.
 */
export function getHeartDiseaseCSV(): string {
  const header = 'disease_id,disease_name,affected_structure,effect_on_heart,blood_flow_effect,possible_complication';
  const rows = HEART_DISEASE_REFERENCE_DATA.map(
    (item) =>
      `"${item.disease_id}","${item.disease_name}","${item.affected_structure}","${item.effect_on_heart}","${item.blood_flow_effect}","${item.possible_complication}"`
  );
  return [header, ...rows].join('\n');
}
