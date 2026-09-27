import React, { useState } from 'react';
import { MobileHeader } from './MobileHeader';
import { OverviewTab } from './OverviewTab';
import { AnalyticsTab } from './AnalyticsTab';
import { ActivityTab } from './ActivityTab';
import { ProfileTab } from './ProfileTab';
import { BottomTabBar } from './BottomTabBar';
import { NotificationsDrawer } from './NotificationsDrawer';
import { DashboardTab } from '../../types/auth';

export const MobileDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-full flex flex-col bg-slate-900 text-slate-100 relative">
      {/* Top Mobile App Bar */}
      <MobileHeader onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Main Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'overview' && <OverviewTab onNavigateTab={setActiveTab} />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'activity' && <ActivityTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>

      {/* Fixed Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};
