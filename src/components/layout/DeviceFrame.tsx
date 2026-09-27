import React, { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<Props> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'fluid'>('mobile');
  const { isAuthenticated, logout, demoLogin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Preview Controls Bar (Responsive Switcher for desktop evaluators) */}
      <nav aria-label="Device viewport controls" className="w-full bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 z-40 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs">
          {/* Brand & Status */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white tracking-tight">PulseAuth</span>
            <span className="hidden sm:inline text-slate-500" aria-hidden="true">·</span>
            <span className="hidden sm:inline text-slate-400">
              {isAuthenticated ? 'Authenticated Session' : 'Login / Register Flow'}
            </span>
          </div>

          {/* Viewport Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'mobile'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Preview in Mobile Phone Frame (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Mobile Frame</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('fluid')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'fluid'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Expand to Full Responsive Width"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Fluid Full-Width</span>
              </button>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-rose-400 border border-slate-800 rounded-lg hover:border-rose-900/60 transition-colors cursor-pointer"
                title="Switch back to Login / Registration view"
              >
                Log Out
              </button>
            ) : (
              <button
                type="button"
                onClick={demoLogin}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 border border-indigo-900/50 bg-indigo-950/30 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Fill Demo</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-center justify-center p-0 sm:p-6 md:p-8">
        {viewMode === 'mobile' ? (
          /* Realistic iPhone Mobile Device Frame */
          <div className="relative w-full max-w-[400px] h-[860px] max-h-[92vh] bg-slate-900 border-[8px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col ring-1 ring-slate-700/50">
            {/* Dynamic Island Pill */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2 pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
              <div className="w-2 h-2 rounded-full bg-indigo-500/40" />
            </div>

            {/* Scrollable Mobile Viewport */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pt-7 relative bg-slate-900">
              {children}
            </div>

            {/* Mobile Home Bar Indicator */}
            <div className="h-4 bg-slate-900 flex items-center justify-center shrink-0 pointer-events-none pb-1">
              <div className="w-32 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>
        ) : (
          /* Fluid Responsive Viewport */
          <div className="w-full max-w-lg min-h-[700px] bg-slate-900 border border-slate-800 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
        )}
      </main>
    </div>
  );
};
