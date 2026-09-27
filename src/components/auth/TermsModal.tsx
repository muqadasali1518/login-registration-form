import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Terms of Service & Privacy</h3>
              <p className="text-[11px] text-slate-400">Last updated September 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 text-xs text-slate-300 space-y-3 pr-1 leading-relaxed">
          <section>
            <h4 className="font-semibold text-white mb-1">1. User Verification & Accounts</h4>
            <p className="text-slate-400">
              By registering an account with PulseAuth, you agree to supply authentic credentials and maintain the confidentiality of your login secrets, passkeys, and two-factor recovery seeds.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-white mb-1">2. Data Privacy & Zero-Knowledge Architecture</h4>
            <p className="text-slate-400">
              Your biometric credentials remain securely on-device via WebAuthn standards. Password hashes are salted and strictly encrypted before transit. We never sell or exchange private identity telemetry with third parties.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-white mb-1">3. Permitted Platform Use</h4>
            <p className="text-slate-400">
              You agree not to automate credential brute-forcing, exploit session replay mechanisms, or bypass perimeter access controls on our infrastructure.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-white mb-1">4. Termination & Export</h4>
            <p className="text-slate-400">
              You maintain sovereign ownership of your audit records. You may export or purge your account and connected sessions anytime through your dashboard settings.
            </p>
          </section>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
