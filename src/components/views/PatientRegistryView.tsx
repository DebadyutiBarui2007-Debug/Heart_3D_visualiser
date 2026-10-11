import React, { useState } from 'react';
import { PatientData } from '../../types/cardio';
import { Users, Search, ArrowRight, Eye, CheckCircle2, AlertTriangle, ShieldCheck, Heart, BookOpen, FileSpreadsheet, Layers, Download } from 'lucide-react';
import { HEART_DISEASE_REFERENCE_DATA, CORONARY_ARTERY_TERRITORIES, getHeartDiseaseCSV } from '../../data/heartDiseaseReference.ts';

interface PatientRegistryViewProps {
  patients: PatientData[];
  currentPatient: PatientData;
  onSelectPatient: (patient: PatientData) => void;
  onNavigateToTwin: (patient: PatientData) => void;
}

export const PatientRegistryView: React.FC<PatientRegistryViewProps> = ({
  patients,
  currentPatient,
  onSelectPatient,
  onNavigateToTwin,
}) => {
  const [activeTab, setActiveTab] = useState<'patients' | 'diseases' | 'arteries'>('patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'severe' | 'moderate' | 'low'>('all');

  const handleDownloadCSV = () => {
    const csvContent = getHeartDiseaseCSV();
    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = 'heart_disease_reference.csv';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rwmaStatus.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterSeverity === 'severe') return p.ladStenosis >= 50;
    if (filterSeverity === 'moderate') return p.ladStenosis >= 30 && p.ladStenosis < 50;
    if (filterSeverity === 'low') return p.ladStenosis < 30;
    return true;
  });

  const filteredDiseases = HEART_DISEASE_REFERENCE_DATA.filter((d) =>
    d.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.affected_structure.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.possible_complication.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-6 shadow-xl border border-cyan-500/25 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#171f33] flex items-center justify-center text-[#4cd7f6] shadow-[0_0_16px_rgba(76,215,246,0.35)] border border-[#4cd7f6]/30">
            {activeTab === 'patients' && <Users className="w-6 h-6 text-[#4cd7f6]" />}
            {activeTab === 'diseases' && <BookOpen className="w-6 h-6 text-[#ffb95f]" />}
            {activeTab === 'arteries' && <Layers className="w-6 h-6 text-[#34d399]" />}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#dae2fd]">
                {activeTab === 'patients' && 'UCI Z-Alizadeh Sani Cohort Registry'}
                {activeTab === 'diseases' && 'Heart Disease Reference Dataset (CDC / MedlinePlus)'}
                {activeTab === 'arteries' && 'Coronary Artery Territories & Perfusion Anatomy'}
              </h2>
              <span className="text-[10px] font-mono bg-[#4cd7f6]/10 text-[#4cd7f6] border border-[#4cd7f6]/30 px-2 py-0.5 rounded">
                {activeTab === 'patients' && 'Verified 303 Angiographic Patients'}
                {activeTab === 'diseases' && '16 Clinical Pathologies (PDF Section 3)'}
                {activeTab === 'arteries' && '3 Main Vessel Branches (PDF Section 2)'}
              </span>
            </div>
            <p className="text-xs text-[#bcc9cd] mt-0.5">
              {activeTab === 'patients' && 'Standard clinical evaluation cohort from Tehran Heart Center with multi-vessel stenosis calibration'}
              {activeTab === 'diseases' && 'Structured pathology table mapping affected anatomical structures, hemodynamic effects, and complications'}
              {activeTab === 'arteries' && 'Left anterior descending (LAD), circumflex (LCX), and right coronary artery (RCA) myocardial perfusion domains'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {activeTab === 'diseases' && (
            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-1.5 rounded-lg bg-[#4cd7f6] hover:bg-[#acedff] text-[#003640] text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_12px_rgba(76,215,246,0.4)] transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
          <div className="relative">
            <Search className="w-4 h-4 text-[#869397] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeTab === 'patients'
                  ? 'Search by ID or clinical finding...'
                  : 'Search condition or structure...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#131b2e] border border-white/10 text-xs text-[#dae2fd] placeholder-[#869397] focus:outline-none focus:border-[#4cd7f6] w-64"
            />
          </div>
        </div>
      </div>

      {/* Dataset Selection Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#131b2e]/80 border border-white/5">
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'patients'
                ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-[0_0_10px_rgba(76,215,246,0.4)]'
                : 'text-[#bcc9cd] hover:text-[#dae2fd]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Patients Cohort (303)</span>
          </button>
          <button
            onClick={() => setActiveTab('diseases')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'diseases'
                ? 'bg-[#ffb95f] text-[#003640] font-bold shadow-[0_0_10px_rgba(255,185,95,0.4)]'
                : 'text-[#bcc9cd] hover:text-[#dae2fd]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Heart Disease Reference (16)</span>
          </button>
          <button
            onClick={() => setActiveTab('arteries')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'arteries'
                ? 'bg-[#34d399] text-[#003640] font-bold shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                : 'text-[#bcc9cd] hover:text-[#dae2fd]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Coronary Territories (3)</span>
          </button>
        </div>

        {/* Severity filter (only visible for patients cohort) */}
        {activeTab === 'patients' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#869397] mr-1">Filter:</span>
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                filterSeverity === 'all'
                  ? 'bg-[#4cd7f6] text-[#003640] font-bold shadow-[0_0_10px_rgba(76,215,246,0.4)]'
                  : 'bg-[#171f33] text-[#bcc9cd] hover:text-[#dae2fd]'
              }`}
            >
              All ({patients.length})
            </button>
            <button
              onClick={() => setFilterSeverity('severe')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                filterSeverity === 'severe'
                  ? 'bg-[#ff1744] text-white font-bold shadow-[0_0_10px_rgba(255,23,68,0.4)]'
                  : 'bg-[#171f33] text-[#bcc9cd] hover:text-[#dae2fd]'
              }`}
            >
              Critical LAD (≥ 50%)
            </button>
            <button
              onClick={() => setFilterSeverity('moderate')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                filterSeverity === 'moderate'
                  ? 'bg-[#ffb95f] text-[#003640] font-bold shadow-[0_0_10px_rgba(255,185,95,0.4)]'
                  : 'bg-[#171f33] text-[#bcc9cd] hover:text-[#dae2fd]'
              }`}
            >
              Moderate (30-49%)
            </button>
            <button
              onClick={() => setFilterSeverity('low')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                filterSeverity === 'low'
                  ? 'bg-[#10b981] text-[#003640] font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'bg-[#171f33] text-[#bcc9cd] hover:text-[#dae2fd]'
              }`}
            >
              Patent (&lt; 30%)
            </button>
          </div>
        )}
      </div>

      {/* 1. Patients Table */}
      {activeTab === 'patients' && (
        <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl shadow-xl overflow-hidden border border-cyan-500/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131b2e] text-[#869397] uppercase font-mono text-[10px] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Patient Identifier</th>
                  <th className="py-3 px-4">Demographics</th>
                  <th className="py-3 px-4">Blood Pressure / FBG</th>
                  <th className="py-3 px-4">Echo RWMA Wall Motion</th>
                  <th className="py-3 px-4">LAD Stenosis</th>
                  <th className="py-3 px-4">CAD Global Risk</th>
                  <th className="py-3 px-4 text-right">Interactive 3D Twin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredPatients.map((p) => {
                  const isActive = p.id === currentPatient.id;
                  const isHigh = p.ladStenosis >= 50;

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors hover:bg-[#131b2e]/60 ${isActive ? 'bg-[#171f33]/90 border-l-2 border-[#4cd7f6]' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#dae2fd] font-sans">
                        <div className="flex items-center gap-2">
                          {isActive && <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping" />}
                          <span className="font-mono text-[#4cd7f6]">{p.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#bcc9cd]">
                        {p.gender}, {p.age} years
                      </td>

                      <td className="py-3.5 px-4 text-[#dae2fd]">
                        <span>{p.systolicBp}/{p.diastolicBp} mmHg</span>
                        <span className="text-[#869397] block text-[10px]">FBG {p.fastingGlucose} mg/dL</span>
                      </td>

                      <td className="py-3.5 px-4 font-sans text-xs">
                        <span className={`${p.rwmaStatus.includes('Hypokinesis') ? 'text-[#ff1744] font-medium' : 'text-[#34d399]'}`}>
                          {p.rwmaStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold">
                        <span className={`px-2 py-0.5 rounded ${isHigh ? 'bg-[#ff1744]/20 text-[#ffb4ab]' : 'bg-[#4cd7f6]/10 text-[#4cd7f6]'}`}>
                          {p.ladStenosis}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-sm">
                        <span className={p.cadProbability > 50 ? 'text-[#ff1744]' : 'text-[#4cd7f6]'}>
                          {p.cadProbability}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onNavigateToTwin(p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all inline-flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_10px_rgba(76,215,246,0.4)]'
                              : 'bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] border border-white/5'
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>{isActive ? 'Active in 3D Twin' : 'Load into 3D Twin'}</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Heart Disease Reference Table (Section 3 of PDF) */}
      {activeTab === 'diseases' && (
        <div className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl shadow-xl overflow-hidden border border-cyan-500/20">
          <div className="p-4 bg-[#131b2e]/60 border-b border-white/5 text-xs text-[#bcc9cd] flex items-center justify-between">
            <span>Schema: <strong className="font-mono text-[#dae2fd]">disease_id, disease_name, affected_structure, effect_on_heart, blood_flow_effect, possible_complication</strong></span>
            <span className="font-mono text-[10px] text-[#4cd7f6]">CDC / MedlinePlus Clinical Taxonomy</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131b2e] text-[#869397] uppercase font-mono text-[10px] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Disease / Condition</th>
                  <th className="py-3 px-4">Affected Structure</th>
                  <th className="py-3 px-4">Pathophysiological Effect</th>
                  <th className="py-3 px-4">Blood Flow Effect</th>
                  <th className="py-3 px-4">Possible Complications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDiseases.map((d) => (
                  <tr key={d.disease_id} className="hover:bg-[#131b2e]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#4cd7f6]">{d.disease_id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#dae2fd]">{d.disease_name}</td>
                    <td className="py-3.5 px-4 text-[#ffb95f] font-mono text-xs">{d.affected_structure}</td>
                    <td className="py-3.5 px-4 text-[#bcc9cd] text-xs max-w-sm leading-relaxed">{d.effect_on_heart}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        d.blood_flow_effect === 'Reduced' ? 'bg-[#ff1744]/20 text-[#ffb4ab]' :
                        d.blood_flow_effect === 'Disrupted' ? 'bg-[#ffb95f]/20 text-[#ffb95f]' :
                        'bg-[#4cd7f6]/15 text-[#4cd7f6]'
                      }`}>
                        {d.blood_flow_effect}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#869397] text-xs">{d.possible_complication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Coronary Artery Territories Table (Section 2 of PDF) */}
      {activeTab === 'arteries' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CORONARY_ARTERY_TERRITORIES.map((art) => (
            <div
              key={art.artery_code}
              className="rounded-2xl bg-[#060E20]/85 backdrop-blur-xl p-6 shadow-xl border border-cyan-500/25 flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${
                    art.artery_code === 'LAD' ? 'bg-[#ff1744] shadow-[0_0_8px_#ff1744]' :
                    art.artery_code === 'LCX' ? 'bg-[#ffb95f] shadow-[0_0_8px_#ffb95f]' :
                    'bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6]'
                  }`} />
                  <h3 className="text-base font-bold text-[#dae2fd]">{art.artery_name}</h3>
                </div>
                <span className="font-mono text-xs font-bold text-[#4cd7f6] bg-[#4cd7f6]/10 px-2 py-0.5 rounded border border-[#4cd7f6]/30">
                  {art.artery_code}
                </span>
              </div>

              <div className="flex flex-col gap-3 text-xs leading-relaxed">
                <div className="p-3 rounded-xl bg-[#131b2e]/70 border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-mono text-[#869397]">Anatomical Region</span>
                  <span className="text-[#dae2fd] font-medium">{art.anatomical_region}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#131b2e]/70 border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-mono text-[#869397]">Myocardial Perfusion Territory</span>
                  <span className="text-[#bcc9cd]">{art.perfusion_territory}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#131b2e]/70 border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-mono text-[#869397]">Clinical Consequence of Stenosis</span>
                  <span className="text-[#ffb4ab] font-medium">{art.clinical_consequence}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#171f33]/60 border border-cyan-500/15 flex items-center justify-between font-mono text-[11px] mt-1">
                  <span className="text-[#bcc9cd]">3D Digital Twin Mapping:</span>
                  <span className="text-[#4cd7f6] font-bold">Dynamic GLSL Shader Sync</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

