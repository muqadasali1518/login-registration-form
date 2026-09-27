import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Check, AlertCircle, Fingerprint } from 'lucide-react';
import { FormErrors, LoginFormData } from '../../types/auth';
import { validateEmail, validateLoginForm } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface Props {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<Props> = ({ onSwitchToRegister }) => {
  const { login, demoLogin, showToast } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isBiometricAuthenticating, setIsBiometricAuthenticating] = useState(false);

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const emailCheck = validateEmail(formData.email);
      setErrors((prev) => ({
        ...prev,
        email: emailCheck.isValid ? undefined : emailCheck.error,
      }));
    } else if (field === 'password') {
      if (!formData.password) {
        setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      } else {
        setErrors((prev) => ({ ...prev, password: undefined }));
      }
    }
  };

  const handleEmailChange = (val: string) => {
    setFormData((prev) => ({ ...prev, email: val }));
    if (touched.email) {
      const check = validateEmail(val);
      setErrors((prev) => ({
        ...prev,
        email: check.isValid ? undefined : check.error,
        general: undefined,
      }));
    } else if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setFormData((prev) => ({ ...prev, password: val }));
    if (touched.password && val.length > 0) {
      setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const formValidation = validateLoginForm(formData);
    if (Object.keys(formValidation).length > 0) {
      setErrors(formValidation);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await login(formData);
      if (!res.success) {
        setErrors({ general: res.error || 'Login failed. Please check credentials.' });
      }
    } catch {
      setErrors({ general: 'An unexpected connection error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setIsBiometricAuthenticating(true);
    // Simulate iOS Touch ID / Face ID prompt
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsBiometricAuthenticating(false);
    demoLogin();
    showToast('Biometric authentication verified', 'success');
  };

  const isEmailValid = touched.email && !errors.email && formData.email.length > 0;

  return (
    <div>
      {/* General error banner */}
      {errors.general && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-medium">{errors.general}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email field */}
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="alex.rivers@pulse.io"
              className={`w-full pl-10 pr-10 py-3 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 ${
                touched.email && errors.email
                  ? 'border-rose-500/80 focus:ring-rose-500/20'
                  : isEmailValid
                  ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {/* Live validation indicator */}
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              {isEmailValid && <Check className="w-4 h-4 text-emerald-400" />}
              {touched.email && errors.email && <AlertCircle className="w-4 h-4 text-rose-400" />}
            </div>
          </div>
          {touched.email && errors.email && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-12 py-3 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 ${
                touched.password && errors.password
                  ? 'border-rose-500/80 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors min-w-[44px] justify-center cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password}</p>
          )}
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-300 min-h-[44px]">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-0 transition-colors accent-indigo-600 cursor-pointer"
            />
            <span>Remember this device for 30 days</span>
          </label>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying credentials...</span>
            </span>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Biometric quick access */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleBiometricAuth}
            disabled={isBiometricAuthenticating}
            className="w-full min-h-[44px] py-2 px-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isBiometricAuthenticating ? (
              <span className="flex items-center gap-2 text-indigo-400">
                <Fingerprint className="w-4 h-4 animate-pulse" />
                <span>Reading Face ID / Touch ID...</span>
              </span>
            ) : (
              <>
                <Fingerprint className="w-4 h-4 text-indigo-400" />
                <span>Sign in with Face ID or Passkey</span>
              </>
            )}
          </button>
        </div>

        {/* Switch to Register */}
        <div className="pt-2 text-center text-xs text-slate-400">
          <span>Don&apos;t have an account yet? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer inline-flex items-center min-h-[44px]"
          >
            Create an account
          </button>
        </div>
      </form>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={formData.email}
      />
    </div>
  );
};
