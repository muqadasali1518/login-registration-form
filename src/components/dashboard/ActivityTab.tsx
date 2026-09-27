import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Search, 
  Filter, 
  ChevronRight, 
  X,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ActivityItem } from '../../types/auth';

export const ActivityTab: React.FC = () => {
  const { activities } = useAuth();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const filtered = activities.filter((act) => {
    const matchesFilter = filter === 'all' || act.category === filter;
    const matchesSearch =
      !search ||
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      (act.device && act.device.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Audit & Activity Log</h2>
        <p className="text-xs text-slate-400">Cryptographically signed user events</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search activity records..."
          className="w-full pl-9 pr-8 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Segmented Buttons */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Events' },
          { id: 'security', label: 'Security' },
          { id: 'transaction', label: 'Transactions' },
          { id: 'access', label: 'Sessions' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              filter === f.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl divide-y divide-slate-800/80 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No events found matching your criteria.</p>
          </div>
        ) : (
          filtered.map((item) => (
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
                    <span className="tabular-nums">{item.timestamp}</span>
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
          ))
        )}
      </div>

      {/* Details Modal */}
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
            <p className="text-xs text-slate-400 mt-1">Audit verification receipt</p>

            <div className="mt-4 space-y-2.5 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Event ID</span>
                <span className="text-white font-mono">{selectedActivity.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span className="text-white capitalize">{selectedActivity.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 font-medium capitalize">
                  {selectedActivity.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp</span>
                <span className="text-white tabular-nums">{selectedActivity.timestamp}</span>
              </div>
              {selectedActivity.device && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Client / Node</span>
                  <span className="text-white truncate max-w-[180px]">
                    {selectedActivity.device}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedActivity(null)}
              className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
