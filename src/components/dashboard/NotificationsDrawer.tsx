import React from 'react';
import { X, CheckCheck, ShieldAlert, UserCheck, Bell, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../types/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearNotifications } = useAuth();

  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'account':
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'alert':
        return <Bell className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg mx-auto bg-slate-900 border-t border-x border-slate-800 rounded-t-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-250"
      >
        {/* Grab Handle */}
        <div className="w-10 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-white">Notifications</h3>
            <p className="text-[11px] text-slate-400">Recent security alerts & updates</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearNotifications}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 p-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="overflow-y-auto py-3 space-y-2.5">
          {notifications.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">No notifications right now.</p>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                    : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{item.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
