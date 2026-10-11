import React from 'react';
import { Heart, Activity, Stethoscope, Users, ShieldCheck, Cpu, Lock } from 'lucide-react';

export type NavView = 'visualizer' | 'shap' | 'cath-prep' | 'registry' | 'governance';

interface NavigationSidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  latencyMs?: number;
  telemetryHz?: number;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentView,
  onSelectView,
  latencyMs = 14.2,
  telemetryHz = 98.4,
}) => {
  const navItems: { id: NavView; label: string; icon: React.ReactNode; symbol: string }[] = [
    { id: 'visualizer', label: '3D Twin Visualizer', icon: <Cpu className="w-5 h-5" />, symbol: 'view_in_ar' },
    { id: 'shap', label: 'SHAP Telemetry', icon: <Activity className="w-5 h-5" />, symbol: 'analytics' },
    { id: 'cath-prep', label: 'Cath Prep Suite', icon: <Stethoscope className="w-5 h-5" />, symbol: 'medical_services' },
    { id: 'registry', label: 'Patient Registry', icon: <Users className="w-5 h-5" />, symbol: 'groups' },
    { id: 'governance', label: 'Model Governance', icon: <ShieldCheck className="w-5 h-5" />, symbol: 'fact_check' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#060E20]/90 backdrop-blur-xl z-50 flex flex-col justify-between py-6 shadow-[0_1px_16px_rgba(0,0,0,0.6)] border-r border-cyan-500/15">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="px-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#171f33] flex items-center justify-center text-[#4cd7f6] shadow-[0_0_14px_rgba(76,215,246,0.4)] border border-[#4cd7f6]/30">
            <Heart className="w-5 h-5 text-[#4cd7f6] fill-[#4cd7f6]/20 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-[#dae2fd]">CARDIO-ML</span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#4cd7f6] font-semibold">3D Diagnostic Hub</span>
          </div>
        </div>

        {/* Cohort Baseline Chip */}
        <div className="px-4">
          <div className="p-3 rounded-xl bg-[#131b2e]/80 backdrop-blur-md flex flex-col gap-1.5 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-[#bcc9cd]">Cohort Baseline</span>
              <span className="text-[10px] text-[#4cd7f6] font-mono font-medium">ST-Elevation Triage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping" />
              <span className="text-xs text-[#dae2fd] font-medium">Dual-Branch GraphNet</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#06b6d4] text-[#003640] font-semibold shadow-[0_0_14px_rgba(6,182,212,0.45)]'
                    : 'text-[#bcc9cd] hover:bg-[#222a3d]/80 hover:text-[#dae2fd]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.symbol}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Telemetry Hardware Stats */}
      <div className="px-4 flex flex-col gap-4">
        <div className="p-3 rounded-xl bg-[#171f33]/70 backdrop-blur-md flex flex-col gap-1.5 border border-white/5">
          <div className="flex items-center justify-between text-[#bcc9cd]">
            <span className="text-[10px] uppercase font-mono">Telemetry Stream</span>
            <span className="text-[11px] text-[#4cd7f6] font-mono font-bold">{telemetryHz} Hz</span>
          </div>
          <div className="h-1.5 w-full bg-[#222a3d] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4cd7f6] rounded-full shadow-[0_0_8px_rgba(76,215,246,0.6)] transition-all duration-500"
              style={{ width: `${Math.min(100, (telemetryHz / 110) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-[#bcc9cd]">Inference Latency</span>
            <span className="text-[#dae2fd] font-bold">{latencyMs} ms</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] uppercase font-mono text-[#869397]">DICOM v3.0 PACS</span>
          <span className="text-[10px] text-[#4cd7f6] flex items-center gap-1 font-mono font-medium">
            <Lock className="w-3 h-3 text-[#4cd7f6]" />
            Encrypted
          </span>
        </div>
      </div>
    </aside>
  );
};
