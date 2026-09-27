import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowUpRight, 
  CreditCard, 
  KeyRound, 
  Smartphone, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Lock,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ActivityItem } from '../../types/auth';

interface Props {
  onNavigateTab: (tab: 'overview' | 'analytics' | 'activity' | 'profile') => void;
}

export const OverviewTab: React.FC<Props> = ({ onNavigateTab }) => {
  const { currentUser, activities, showToast } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  // Horizontal date selector (e.g. current week)
  const [selectedDate, setSelectedDate] = useState('Today');
  const days = [
    { label: 'Mon', num: '22', id: 'Mon 22' },
    { label: 'Tue', num: '23', id: 'Tue 23' },
    { label: 'Wed', num: '24', id: 'Wed 24' },
    { label: 'Thu', num: '25', id: 'Thu 25' },
    { label: 'Fri', num: '26', id: 'Fri 26' },
    { label: 'Today', num: '27', id: 'Today' },
    { label: 'Sun', num: '28', id: 'Sun 28' },
  ];

  return (
    <div className="space-y-5 pb-24">
      {/* Hero Security & Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/90 via-slate-900 to-slate-950 border border-indigo-500/20 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Identity Protected · AES-256</span>
          </div>
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800/40">
            SESSION ACTIVE
          </span>
        </div>

        <div className="mt-4">
          <p className="text-xs text-slate-400 font-medium">Total Managed Balance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
              $18,450.80
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              +12.4%
            </span>
          </div>
        </div>

        {/* Security Progress Meter */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Security Health Rating</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {currentUser?.securityScore || 94}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                style={{ width: `${currentUser?.securityScore || 94}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('profile')}
            className="shrink-0 text-xs text-indigo-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Review</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Date Scroller */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Daily Timeline
          </h3>
          <span className="text-xs text-indigo-400 font-medium">September 2026</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {days.map((d) => {
            const isSelected = selectedDate === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDate(d.id)}
                className={`min-w-[52px] py-2 px-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-medium leading-none mb-1">{d.label}</span>
                <span className="text-sm font-bold tabular-nums leading-none">{d.num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action Shortcuts (44px+ hitboxes) */}
      <div className="grid grid-cols-4 gap-2.5">
        <button
          onClick={() => showToast('Instant transfer modal opened', 'info')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all cursor-pointer min-h-[64px]"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1.5">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium">Send</span>
        </button>

        <button
          onClick={() => showToast('Virtual card controls unlocked', 'info')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all cursor-pointer min-h-[64px]"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1.5">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium">Cards</span>
        </button>

        <button
          onClick={() => showToast('Passkey generated & synced', 'success')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all cursor-pointer min-h-[64px]"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1.5">
            <KeyRound className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium">Passkeys</span>
        </button>

        <button
          onClick={() => onNavigateTab('profile')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all cursor-pointer min-h-[64px]"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-1.5">
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium">Devices</span>
        </button>
      </div>

      {/* Top 2 Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Monthly Outflow</p>
          <p className="text-lg font-bold text-white mt-1 tabular-nums">$1,240.50</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
            <span>Budget</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">42% Used</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Active Devices</p>
          <p className="text-lg font-bold text-white mt-1 tabular-nums">2 Verified</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
            <span>Primary</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-400 font-medium">iPhone 16 Pro</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-semibold text-white">Recent Activities</h3>
          <button
            onClick={() => onNavigateTab('activity')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl divide-y divide-slate-800/80 overflow-hidden">
          {activities.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedActivity(item)}
              className="p-3.5 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-3 cursor-pointer min-h-[58px]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.category === 'security'
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : item.category === 'transaction'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : item.category === 'access'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.category === 'security' && <ShieldCheck className="w-4 h-4" />}
                  {item.category === 'transaction' && <CreditCard className="w-4 h-4" />}
                  {item.category === 'access' && <Lock className="w-4 h-4" />}
                  {item.category === 'system' && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{item.timestamp}</span>
                    {item.device && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.device}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.amount && (
                  <span className="text-xs font-semibold text-emerald-400 tabular-nums">
                    {item.amount}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-slate-100">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>

            <h3 className="text-base font-semibold text-white">{selectedActivity.title}</h3>
            <p className="text-xs text-slate-400 mt-1">Logged event details & cryptographic verification</p>

            <div className="mt-4 space-y-2.5 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 font-medium capitalize">
                  {selectedActivity.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span className="text-white capitalize">{selectedActivity.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp</span>
                <span className="text-white tabular-nums">{selectedActivity.timestamp}</span>
              </div>
              {selectedActivity.device && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Client Info</span>
                  <span className="text-white">{selectedActivity.device}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedActivity(null)}
              className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
