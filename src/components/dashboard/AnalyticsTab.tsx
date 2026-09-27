import React, { useState } from 'react';
import { Shield, Smartphone, Globe, CheckCircle2, TrendingUp } from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const weeklyData = [
    { day: 'Mon', count: 18, height: '45%' },
    { day: 'Tue', count: 24, height: '60%' },
    { day: 'Wed', count: 32, height: '80%' },
    { day: 'Thu', count: 28, height: '70%' },
    { day: 'Fri', count: 40, height: '100%' },
    { day: 'Sat', count: 14, height: '35%' },
    { day: 'Sun', count: 22, height: '55%' },
  ];

  return (
    <div className="space-y-5 pb-24">
      {/* Header and Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Security Analytics</h2>
          <p className="text-xs text-slate-400">Identity verification & device throughput</p>
        </div>

        {/* Segmented Period Tabs */}
        <div className="flex p-0.5 bg-slate-900 border border-slate-800 rounded-xl">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                period === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 font-medium">Weekly Verifications</p>
            <p className="text-2xl font-bold text-white tabular-nums mt-0.5">178 Events</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>99.8% Success</span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-36 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[10px] text-slate-500 font-mono tabular-nums">{d.count}</span>
              <div className="w-full max-w-[32px] bg-slate-800/60 rounded-lg overflow-hidden flex flex-col justify-end h-24">
                <div
                  className="w-full bg-indigo-500 hover:bg-indigo-400 transition-all rounded-t-lg"
                  style={{ height: d.height }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Smartphone className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-300">Device Platform</span>
          </div>
          <p className="text-base font-bold text-white">74% iOS</p>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span>26% macOS</span>
            <span aria-hidden="true">·</span>
            <span>0% Unknown</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-semibold text-slate-300">Origin Geo</span>
          </div>
          <p className="text-base font-bold text-white">100% US</p>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <span>San Francisco</span>
            <span aria-hidden="true">·</span>
            <span>Verified ISP</span>
          </div>
        </div>
      </div>

      {/* Threat & Invariant Status Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Zero Suspicious Payloads Detected</h3>
            <p className="text-[11px] text-slate-400">
              Passkey authentication has mitigated 100% of automated credential stuffing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
