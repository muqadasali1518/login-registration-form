import React, { useState } from 'react';
import { Shield, Sparkles, Chrome, Apple, Github } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../context/AuthContext';

export const AuthCard: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { demoLogin, showToast } = useAuth();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSocialAuth = async (provider: string) => {
    setSocialLoading(provider);
    await new Promise((resolve) => setTimeout(resolve, 850));
    setSocialLoading(null);
    demoLogin();
    showToast(`Successfully authenticated via ${provider}`, 'success');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/25 mb-3">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Pulse<span className="text-indigo-400">Auth</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          {mode === 'login'
            ? 'Sign in to access your secure mobile dashboard'
            : 'Register your account with encrypted security credentials'}
        </p>
      </div>

      {/* Demo Quick Access Banner */}
      <div className="mb-5 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 backdrop-blur-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Testing the UI?</p>
            <p className="text-[11px] text-slate-400 truncate">Skip form filling with pre-seeded data</p>
          </div>
        </div>
        <button
          type="button"
          onClick={demoLogin}
          className="shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm cursor-pointer whitespace-nowrap min-h-[36px] flex items-center"
        >
          1-Click Demo
        </button>
      </div>

      {/* Auth Card Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        {/* Segmented Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800/80">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
              mode === 'register'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Social Authentication Row */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleSocialAuth('Google')}
              className="min-h-[44px] py-2 px-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              aria-label="Sign in with Google"
            >
              {socialLoading === 'Google' ? (
                <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Chrome className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Google</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleSocialAuth('Apple')}
              className="min-h-[44px] py-2 px-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              aria-label="Sign in with Apple"
            >
              {socialLoading === 'Apple' ? (
                <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Apple className="w-4 h-4 text-slate-200" />
                  <span className="hidden sm:inline">Apple</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() => handleSocialAuth('GitHub')}
              className="min-h-[44px] py-2 px-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              aria-label="Sign in with GitHub"
            >
              {socialLoading === 'GitHub' ? (
                <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Github className="w-4 h-4 text-slate-200" />
                  <span className="hidden sm:inline">GitHub</span>
                </>
              )}
            </button>
          </div>

          {/* Hairline Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-slate-800" />
            <span className="absolute bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-medium">
              or continue with email
            </span>
          </div>
        </div>

        {/* Form Body */}
        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => setMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setMode('login')} />
        )}
      </div>

      {/* Security Trust Badges */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
        <span>End-to-End Encrypted</span>
        <span aria-hidden="true">·</span>
        <span>Passkey Compatible</span>
        <span aria-hidden="true">·</span>
        <span>SOC2 Type II</span>
      </div>
    </div>
  );
};
