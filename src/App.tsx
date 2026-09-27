/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthCard } from './components/auth/AuthCard';
import { MobileDashboard } from './components/dashboard/MobileDashboard';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { Toast } from './components/ui/Toast';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <DeviceFrame>
      <Toast />
      {isAuthenticated ? <MobileDashboard /> : <AuthCard />}
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
