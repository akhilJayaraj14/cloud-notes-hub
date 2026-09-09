'use client';

import React, { useState } from 'react';
import { X, Lock, Key, Check, ShieldCheck } from 'lucide-react';

interface AuthorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthorAuthModal({ isOpen, onClose, onSuccess }: AuthorAuthModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple PIN check for Akhil (e.g. 1409 or akhil or 1234)
    if (pin.trim().toLowerCase() === 'akhil' || pin.trim() === '1409' || pin.trim() === '1234' || pin.trim().toLowerCase() === 'admin') {
      localStorage.setItem('cloud_hub_author_mode', 'true');
      onSuccess();
      onClose();
      setError('');
      setPin('');
    } else {
      setError('Incorrect passcode. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Author Access</h3>
            <p className="text-xs text-slate-400">Unlock author privileges & publishing controls</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enter Passcode (e.g. <code className="text-sky-400">akhil</code> or <code className="text-sky-400">1409</code>)
            </label>
            <input
              type="password"
              placeholder="Enter passcode..."
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition shadow-lg shadow-sky-500/20"
            >
              Unlock Author Mode
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
