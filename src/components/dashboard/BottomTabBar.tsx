import React from 'react';
import { LayoutGrid, BarChart2, ListChecks, UserCheck } from 'lucide-react';
import { DashboardTab } from '../../types/auth';

interface Props {
  activeTab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
}

export const BottomTabBar: React.FC<Props> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    {
      id: 'overview' as DashboardTab,
      label: 'Home',
      icon: LayoutGrid,
    },
    {
      id: 'analytics' as DashboardTab,
      label: 'Analytics',
      icon: BarChart2,
    },
    {
      id: 'activity' as DashboardTab,
      label: 'Activity',
      icon: ListChecks,
    },
    {
      id: 'profile' as DashboardTab,
      label: 'Security',
      icon: UserCheck,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 max-w-md mx-auto"
    >
      <div className="grid grid-cols-4 items-center h-16 pb-safe">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className="flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer select-none group"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all duration-150 ${
                    isActive
                      ? 'text-indigo-400 scale-105 stroke-[2.3]'
                      : 'text-slate-400 group-hover:text-slate-200 stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
