export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  joinedDate: string;
  phone?: string;
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  securityScore: number;
}

export interface PasswordRequirements {
  minLength: boolean; // >= 8 chars
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: string;
  percentage: number;
  requirements: PasswordRequirements;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  category: 'security' | 'transaction' | 'system' | 'access';
  amount?: string;
  status: 'completed' | 'pending' | 'flagged';
  timestamp: string;
  device?: string;
  location?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'security' | 'account' | 'alert' | 'update' | 'info';
}

export type DashboardTab = 'overview' | 'analytics' | 'activity' | 'profile';
