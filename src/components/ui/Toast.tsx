import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Toast: React.FC = () => {
  const { toast, showToast } = useAuth();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <aside
      aria-label="Status notifications"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
    >
      <div
        className={`flex items-center gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-200 ${
          isSuccess
            ? 'bg-emerald-950/90 border-emerald-800/80 text-emerald-100'
            : isError
            ? 'bg-rose-950/90 border-rose-800/80 text-rose-100'
            : 'bg-slate-900/95 border-slate-800 text-slate-100'
        }`}
      >
        <div className="shrink-0">
          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
          {!isSuccess && !isError && <Info className="w-4 h-4 text-indigo-400" />}
        </div>
        <p className="text-xs font-medium flex-1 tracking-tight">{toast.message}</p>
        <button
          onClick={() => showToast('', 'info')}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
