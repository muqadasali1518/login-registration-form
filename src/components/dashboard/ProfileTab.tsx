import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Key, 
  Smartphone, 
  LogOut, 
  Check, 
  Lock, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { evaluatePasswordStrength } from '../../utils/validation';

export const ProfileTab: React.FC = () => {
  const { currentUser, updateUser, logout, showToast } = useAuth();

  // Profile Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || '');

  // Password Change State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const passwordStrength = evaluatePasswordStrength(newPassword);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    updateUser({
      name: nameInput.trim(),
      phone: phoneInput.trim(),
    });
    setIsEditingName(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordError(null);
    setPasswordSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    showToast('Password updated successfully', 'success');

    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordChange(false);
    }, 1800);
  };

  const toggle2FA = () => {
    const updated = !currentUser?.twoFactorEnabled;
    updateUser({ twoFactorEnabled: updated });
    showToast(
      updated ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled',
      'info'
    );
  };

  const toggleBiometrics = () => {
    const updated = !currentUser?.biometricEnabled;
    updateUser({ biometricEnabled: updated });
    showToast(
      updated ? 'Face ID / Touch ID sign-in active' : 'Biometric sign-in turned off',
      'info'
    );
  };

  const handleTerminateOtherSessions = () => {
    showToast('Other sessions terminated across all devices', 'success');
  };

  return (
    <div className="space-y-5 pb-28">
      {/* Profile Header Card */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-600/20 shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white truncate">
              {currentUser?.name || 'Pulse Member'}
            </h2>
            <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
              <span>{currentUser?.role || 'Member'}</span>
              <span aria-hidden="true">·</span>
              <span>Joined {currentUser?.joinedDate || '2026'}</span>
            </div>
          </div>
        </div>

        {/* Edit profile toggler */}
        {!isEditingName ? (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center">
            <span className="text-xs text-slate-400">
              Phone: {currentUser?.phone || '+1 (555) 382-9102'}
            </span>
            <button
              onClick={() => setIsEditingName(true)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Edit Details
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="flex-1 py-1.5 bg-slate-800 text-xs font-medium text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-indigo-600 text-xs font-semibold text-white rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Security Preferences */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>Security & Authentication</span>
        </div>

        <div className="space-y-3 divide-y divide-slate-800/80">
          {/* 2FA Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="pr-4">
              <h4 className="text-xs font-semibold text-white">Two-Factor Authentication</h4>
              <p className="text-[11px] text-slate-400">Require an authenticator code on each new sign in</p>
            </div>
            <button
              type="button"
              onClick={toggle2FA}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer min-h-[44px] flex items-center ${
                currentUser?.twoFactorEnabled ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
              aria-label="Toggle Two-Factor Authentication"
            >
              <span
                className={`w-4 h-4 bg-white rounded-full transition-transform transform ${
                  currentUser?.twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Biometrics Toggle */}
          <div className="flex items-center justify-between pt-3">
            <div className="pr-4">
              <div className="flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />
                <h4 className="text-xs font-semibold text-white">Face ID / Touch ID</h4>
              </div>
              <p className="text-[11px] text-slate-400">Enable 1-tap passkey biometric verification</p>
            </div>
            <button
              type="button"
              onClick={toggleBiometrics}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer min-h-[44px] flex items-center ${
                currentUser?.biometricEnabled ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
              aria-label="Toggle Biometric Authentication"
            >
              <span
                className={`w-4 h-4 bg-white rounded-full transition-transform transform ${
                  currentUser?.biometricEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <div>
              <h4 className="text-xs font-semibold text-white">Master Password</h4>
              <p className="text-[11px] text-slate-400">Last rotated 30 days ago</p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            {showPasswordChange ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordChange && (
          <form onSubmit={handlePasswordSubmit} className="mt-4 pt-4 border-t border-slate-800 space-y-3">
            {passwordError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Password updated and encrypted!</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Mini Strength Bar */}
              {newPassword.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Strength:</span>
                    <span className="text-emerald-400 font-semibold">{passwordStrength.label}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-xl transition-colors cursor-pointer mt-1"
            >
              Update Password
            </button>
          </form>
        )}
      </div>

      {/* Active Device Sessions */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-semibold text-white">Active Device Sessions</h4>
          </div>
          <button
            onClick={handleTerminateOtherSessions}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
          >
            End Other Sessions
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white">iPhone 16 Pro</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  This device
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">San Francisco, US · Active now</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between opacity-80">
            <div>
              <span className="font-semibold text-white">MacBook Pro (Chrome 129)</span>
              <p className="text-[11px] text-slate-400 mt-0.5">San Francisco, US · 2 hours ago</p>
            </div>
            <span className="text-[11px] text-slate-500">Idle</span>
          </div>
        </div>
      </div>

      {/* Logout Action (Sticky Bottom Pattern Ergonomics) */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full h-12 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of PulseAuth</span>
        </button>
      </div>
    </div>
  );
};
