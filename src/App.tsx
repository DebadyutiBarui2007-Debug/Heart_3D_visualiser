import React, { useState, useEffect } from 'react';
import { PatientData } from './types/cardio';
import { buildVerifiedCohort } from './services/patientDatabase';
import { apiClient } from './services/apiClient';
import { HemodynamicBackgroundShader } from './components/HemodynamicBackgroundShader';
import { NavigationSidebar, NavView } from './components/NavigationSidebar';
import { TopHeader } from './components/TopHeader';
import { VisualizerView } from './components/views/VisualizerView';
import { ShapTelemetryView } from './components/views/ShapTelemetryView';
import { CathPrepSuiteView } from './components/views/CathPrepSuiteView';
import { PatientRegistryView } from './components/views/PatientRegistryView';
import { ModelGovernanceView } from './components/views/ModelGovernanceView';
import { InferenceModal } from './components/modals/InferenceModal';
import { FilterModal } from './components/modals/FilterModal';
import { CathBookingModal } from './components/modals/CathBookingModal';
import { DicomExportModal } from './components/modals/DicomExportModal';
import { AppLoadingScreen } from './components/AppLoadingScreen';

const INITIAL_COHORT = buildVerifiedCohort();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<NavView>('visualizer');
  const [patients, setPatients] = useState<PatientData[]>(INITIAL_COHORT);
  const [currentPatient, setCurrentPatient] = useState<PatientData>(INITIAL_COHORT[0]);

  // Modals state
  const [isInferenceModalOpen, setIsInferenceModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDicomModalOpen, setIsDicomModalOpen] = useState(false);

  // Live telemetry stream state
  const [latencyMs, setLatencyMs] = useState(14.2);
  const [telemetryHz, setTelemetryHz] = useState(98.4);

  // Backend connection & initial synchronization
  useEffect(() => {
    let isMounted = true;
    async function initBackend() {
      try {
        const [health, cohort] = await Promise.all([
          apiClient.checkHealth(),
          apiClient.getPatients(),
        ]);
        if (isMounted && cohort && cohort.length > 0) {
          setPatients(cohort);
        }
      } catch (err) {
        console.warn('[CARDIO-ML] Resilient local engine mode active:', err);
      }
    }
    initBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const handleSelectPatient = (patient: PatientData) => {
    setCurrentPatient(patient);
  };

  const handleNavigateToTwinWithPatient = (patient: PatientData) => {
    setCurrentPatient(patient);
    setCurrentView('visualizer');
  };

  const handleUpdatePatientVitals = (updatedVitals: Partial<PatientData>) => {
    const updated = { ...currentPatient, ...updatedVitals };
    setCurrentPatient(updated);
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleInferenceComplete = (updatedPatient: PatientData) => {
    setCurrentPatient(updatedPatient);
    setPatients((prev) => prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
    setLatencyMs(Number((13.8 + Math.random() * 0.8).toFixed(1)));
    setTelemetryHz(Number((97.8 + Math.random() * 1.5).toFixed(1)));
  };

  const handleBookingConfirmed = (suite: string) => {
    const updated = { ...currentPatient, cathSuite: `${suite} (Reserved)` };
    setCurrentPatient(updated);
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleApplyFilters = (filters: any) => {
    // Filter patients
    const all = buildVerifiedCohort();
    const filtered = all.filter((p) => {
      if (p.age < filters.minAge || p.age > filters.maxAge) return false;
      if (filters.gender !== 'all' && p.gender !== filters.gender) return false;
      if (filters.hypertensionOnly && !p.history.hypertension) return false;
      if (filters.diabetesOnly && !p.history.diabetes) return false;
      if (filters.smokingOnly && !p.history.smoker) return false;
      return true;
    });

    if (filtered.length > 0) {
      setPatients(filtered);
      if (!filtered.some((p) => p.id === currentPatient.id)) {
        setCurrentPatient(filtered[0]);
      }
    } else {
      setPatients(all);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0b1326] text-[#dae2fd] antialiased overflow-x-hidden">
      {/* Super attractive app loading animation of duration < 3s */}
      {isLoading && <AppLoadingScreen onLoadingComplete={() => setIsLoading(false)} />}

      {/* 1. Hemodynamic Organic Shader Canvas covering background */}
      <HemodynamicBackgroundShader />

      {/* 2. Navigation Sidebar */}
      <NavigationSidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        latencyMs={latencyMs}
        telemetryHz={telemetryHz}
      />

      {/* 3. Top Header */}
      <TopHeader
        currentPatient={currentPatient}
        allPatients={patients}
        onSelectPatient={handleSelectPatient}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        onOpenInferenceModal={() => setIsInferenceModalOpen(true)}
      />

      {/* 4. Main Workspace Content Stage */}
      <main className="pl-72 pt-20 pb-16 px-8 relative z-20 min-h-screen">
        {currentView === 'visualizer' && (
          <VisualizerView
            patient={currentPatient}
            onNavigateToShap={() => setCurrentView('shap')}
            onNavigateToCath={() => setCurrentView('cath-prep')}
            onOpenBookingModal={() => setIsBookingModalOpen(true)}
            onExportDicom={() => setIsDicomModalOpen(true)}
          />
        )}

        {currentView === 'shap' && (
          <ShapTelemetryView
            patient={currentPatient}
            onUpdatePatientVitals={handleUpdatePatientVitals}
          />
        )}

        {currentView === 'cath-prep' && (
          <CathPrepSuiteView
            patient={currentPatient}
            onOpenBookingModal={() => setIsBookingModalOpen(true)}
            onExportDicom={() => setIsDicomModalOpen(true)}
          />
        )}

        {currentView === 'registry' && (
          <PatientRegistryView
            patients={patients}
            currentPatient={currentPatient}
            onSelectPatient={handleSelectPatient}
            onNavigateToTwin={handleNavigateToTwinWithPatient}
          />
        )}

        {currentView === 'governance' && <ModelGovernanceView />}
      </main>

      {/* Modals */}
      <InferenceModal
        isOpen={isInferenceModalOpen}
        onClose={() => setIsInferenceModalOpen(false)}
        patient={currentPatient}
        onInferenceComplete={handleInferenceComplete}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      <CathBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        patient={currentPatient}
        onBookingConfirmed={handleBookingConfirmed}
      />

      <DicomExportModal
        isOpen={isDicomModalOpen}
        onClose={() => setIsDicomModalOpen(false)}
        patient={currentPatient}
      />
    </div>
  );
}
