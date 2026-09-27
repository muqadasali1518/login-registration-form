import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActivityItem, LoginFormData, NotificationItem, RegisterFormData, User } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  demoLogin: () => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  activities: ActivityItem[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  resetPasswordRequest: (email: string) => Promise<boolean>;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const DEFAULT_USER: User = {
  id: 'usr_default_01',
  name: 'Alex Rivers',
  email: 'alex.rivers@pulse.io',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Product Lead',
  joinedDate: 'October 2024',
  phone: '+1 (555) 382-9102',
  biometricEnabled: true,
  twoFactorEnabled: true,
  securityScore: 94,
};

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Biometric Login via iOS Client',
    category: 'security',
    status: 'completed',
    timestamp: 'Just now',
    device: 'iPhone 16 Pro · San Francisco, US',
  },
  {
    id: 'act-2',
    title: 'Cloud Sync & Key Vault Update',
    category: 'system',
    status: 'completed',
    timestamp: '2 hours ago',
    device: 'Web Client · Chrome 129',
  },
  {
    id: 'act-3',
    title: 'Subscription Renewal (Pulse Pro)',
    category: 'transaction',
    amount: '-$24.00',
    status: 'completed',
    timestamp: 'Yesterday at 4:15 PM',
  },
  {
    id: 'act-4',
    title: 'Two-Factor Token Generated',
    category: 'security',
    status: 'completed',
    timestamp: '2 days ago',
    device: 'Pulse Authenticator',
  },
  {
    id: 'act-5',
    title: 'New Session Approved',
    category: 'access',
    status: 'completed',
    timestamp: 'Sep 22, 2026',
    device: 'MacBook Pro · macOS 15.1',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Device Recognized',
    message: 'A successful login was registered from iPhone 16 Pro in San Francisco, CA.',
    timestamp: '5m ago',
    read: false,
    type: 'security',
  },
  {
    id: 'notif-2',
    title: 'Security Health Score Upgraded',
    message: 'Your overall security rating is now 94/100 after enabling passkeys.',
    timestamp: '1h ago',
    read: false,
    type: 'account',
  },
  {
    id: 'notif-3',
    title: 'Monthly Security Digest',
    message: 'Zero suspicious access attempts recorded over the past 30 days.',
    timestamp: '1d ago',
    read: true,
    type: 'info',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pulse_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('pulse_activities');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('pulse_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('pulse_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('pulse_current_user');
      }
    } catch {
      // storage quota or private browsing
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('pulse_activities', JSON.stringify(activities));
    } catch {
      // ignore
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem('pulse_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const login = async (data: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    // Artificial latency for tactile feedback & realism
    await new Promise((resolve) => setTimeout(resolve, 650));

    // Check stored registered users
    let registeredUsers: Array<{ user: User; passwordHash: string }> = [];
    try {
      const raw = localStorage.getItem('pulse_registered_users');
      if (raw) registeredUsers = JSON.parse(raw);
    } catch {
      registeredUsers = [];
    }

    const matchedUser = registeredUsers.find(
      (u) => u.user.email.toLowerCase() === data.email.trim().toLowerCase()
    );

    if (matchedUser) {
      if (matchedUser.passwordHash !== data.password) {
        return { success: false, error: 'Incorrect password for this account. Please try again.' };
      }
      setCurrentUser(matchedUser.user);
      addActivity(`Logged in as ${matchedUser.user.name}`, 'security');
      showToast(`Welcome back, ${matchedUser.user.name.split(' ')[0]}!`, 'success');
      return { success: true };
    }

    // Default test account fallback
    if (data.email.trim().toLowerCase() === DEFAULT_USER.email.toLowerCase()) {
      setCurrentUser(DEFAULT_USER);
      addActivity('Signed in with Demo Credentials', 'security');
      showToast('Welcome back to Pulse Dashboard!', 'success');
      return { success: true };
    }

    // If account not found, guide the user
    return {
      success: false,
      error: 'No account registered with this email. Try the "Demo Account" button or register a new account.',
    };
  };

  const register = async (data: RegisterFormData): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    let registeredUsers: Array<{ user: User; passwordHash: string }> = [];
    try {
      const raw = localStorage.getItem('pulse_registered_users');
      if (raw) registeredUsers = JSON.parse(raw);
    } catch {
      registeredUsers = [];
    }

    const existing = registeredUsers.find(
      (u) => u.user.email.toLowerCase() === data.email.trim().toLowerCase()
    );

    if (existing || data.email.trim().toLowerCase() === DEFAULT_USER.email.toLowerCase()) {
      return { success: false, error: 'An account with this email address already exists. Please log in instead.' };
    }

    const newUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      name: data.name.trim(),
      email: data.email.trim(),
      role: 'Member',
      joinedDate: 'Just now',
      biometricEnabled: false,
      twoFactorEnabled: false,
      securityScore: 78,
    };

    registeredUsers.push({ user: newUser, passwordHash: data.password });
    try {
      localStorage.setItem('pulse_registered_users', JSON.stringify(registeredUsers));
    } catch {
      // ignore
    }

    setCurrentUser(newUser);
    addActivity('New account registered & verified', 'security');
    showToast(`Account created! Welcome, ${newUser.name.split(' ')[0]}!`, 'success');
    return { success: true };
  };

  const demoLogin = () => {
    setCurrentUser(DEFAULT_USER);
    addActivity('1-Click Demo Sign-in', 'access');
    showToast('Logged in as Alex Rivers (Demo)', 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out safely', 'info');
  };

  const updateUser = (updates: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      return updated;
    });
    showToast('Profile updated successfully', 'success');
  };

  const addActivity = (title: string, category: ActivityItem['category']) => {
    const newAct: ActivityItem = {
      id: `act_${Date.now()}`,
      title,
      category,
      status: 'completed',
      timestamp: 'Just now',
      device: 'Mobile Session',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetPasswordRequest = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    showToast(`Password reset link dispatched to ${email}`, 'success');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
        activities,
        notifications,
        markNotificationRead,
        clearNotifications,
        resetPasswordRequest,
        toast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
