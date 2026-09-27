import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { FormErrors, RegisterFormData } from '../../types/auth';
import { evaluatePasswordStrength, validateEmail, validateRegisterForm } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { TermsModal } from './TermsModal';

interface Props {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const passwordStrength = evaluatePasswordStrength(formData.password);

  const handleBlur = (field: keyof RegisterFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof RegisterFormData, value: unknown) => {
    const currentData = { ...formData, [field]: value };
    const allErrors = validateRegisterForm(currentData);
    setErrors((prev) => ({
      ...prev,
      [field]: allErrors[field as keyof FormErrors],
    }));
  };

  const handleChange = (field: keyof RegisterFormData, value: unknown) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touched[field]) {
      const allErrors = validateRegisterForm(updated);
      setErrors((prev) => ({
        ...prev,
        [field]: allErrors[field as keyof FormErrors],
        general: undefined,
      }));
    } else if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }

    // Special check: if password changes and confirmPassword was touched, revalidate confirmPassword
    if (field === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          formData.confirmPassword && value !== formData.confirmPassword
            ? 'Passwords do not match'
            : undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true,
    });

    const formValidation = validateRegisterForm(formData);
    if (Object.keys(formValidation).length > 0) {
      setErrors(formValidation);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await register(formData);
      if (!res.success) {
        setErrors({ general: res.error || 'Registration failed. Please check inputs.' });
      }
    } catch {
      setErrors({ general: 'Connection error occurred while registering account.' });
    } finally {
      setIsLoading(false);
    }
  };

  const isNameValid = touched.name && !errors.name && formData.name.length >= 2;
  const isEmailValid = touched.email && !errors.email && validateEmail(formData.email).isValid;
  const isConfirmMatch =
    touched.confirmPassword &&
    !errors.confirmPassword &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  return (
    <div>
      {/* General error notice */}
      {errors.general && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-medium">{errors.general}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Full Name field */}
        <div>
          <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <UserIcon className="w-4 h-4" />
            </div>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Jordan Hayes"
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 ${
                touched.name && errors.name
                  ? 'border-rose-500/80 focus:ring-rose-500/20'
                  : isNameValid
                  ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              {isNameValid && <Check className="w-4 h-4 text-emerald-400" />}
              {touched.name && errors.name && <AlertCircle className="w-4 h-4 text-rose-400" />}
            </div>
          </div>
          {touched.name && errors.name && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name}</p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Work or Personal Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="jordan@company.com"
              className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 ${
                touched.email && errors.email
                  ? 'border-rose-500/80 focus:ring-rose-500/20'
                  : isEmailValid
                  ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              {isEmailValid && <Check className="w-4 h-4 text-emerald-400" />}
              {touched.email && errors.email && <AlertCircle className="w-4 h-4 text-rose-400" />}
            </div>
          </div>
          {touched.email && errors.email && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email}</p>
          )}
        </div>

        {/* Password field with Live Strength Meter */}
        <div>
          <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Create Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Minimum 8 characters"
              className={`w-full pl-10 pr-12 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 ${
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

          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <div className="mt-2 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Password Strength:</span>
                <span
                  className={`font-semibold ${
                    passwordStrength.score >= 3
                      ? 'text-emerald-400'
                      : passwordStrength.score === 2
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.percentage}%` }}
                />
              </div>

              {/* Requirement Checklist */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                <div
                  className={`flex items-center gap-1.5 ${
                    passwordStrength.requirements.minLength ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  <Check className="w-3 h-3 shrink-0" />
                  <span>8+ characters</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    passwordStrength.requirements.hasUpper && passwordStrength.requirements.hasLower
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  <Check className="w-3 h-3 shrink-0" />
                  <span>Upper & lowercase</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    passwordStrength.requirements.hasNumber ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  <Check className="w-3 h-3 shrink-0" />
                  <span>At least 1 number</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    passwordStrength.requirements.hasSpecial ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  <Check className="w-3 h-3 shrink-0" />
                  <span>Symbol (!@#$%)</span>
                </div>
              </div>
            </div>
          )}

          {touched.password && errors.password && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password field */}
        <div>
          <label htmlFor="reg-confirm" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-confirm"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Re-enter password"
              className={`w-full pl-10 pr-12 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 ${
                touched.confirmPassword && errors.confirmPassword
                  ? 'border-rose-500/80 focus:ring-rose-500/20'
                  : isConfirmMatch
                  ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors min-w-[44px] justify-center cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms & Privacy checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-300 min-h-[44px]">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/30 accent-indigo-600 cursor-pointer shrink-0"
            />
            <span className="leading-snug">
              I agree to the{' '}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTermsModalOpen(true);
                }}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 cursor-pointer font-medium"
              >
                Terms of Service
              </button>{' '}
              and Privacy Policy.
            </span>
          </label>
          {touched.agreeToTerms && errors.agreeToTerms && (
            <p className="mt-1 text-xs text-rose-400 font-medium">{errors.agreeToTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating your account...</span>
            </span>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Switch to Login */}
        <div className="pt-2 text-center text-xs text-slate-400">
          <span>Already registered? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer inline-flex items-center min-h-[44px]"
          >
            Sign in here
          </button>
        </div>
      </form>

      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
    </div>
  );
};
