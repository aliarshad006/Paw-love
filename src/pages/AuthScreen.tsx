import React, { useState } from 'react';
import { motion } from 'motion/react';
import { login, register } from '../lib/accounts';

export const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      const r = mode === 'login' ? await login(username, password) : await register(username, password);
      if (r.ok) location.reload();
      else setError(r.error || 'Something went wrong');
    } catch (error) {
      console.error('Account sign-in failed:', error);
      setError('Could not sign in right now. Please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1d1d26] text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-orange-400';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-[#2b0f08] to-[#8a2410]">
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 14 }}
        className="w-full max-w-sm bg-[#15151c]/95 backdrop-blur-xl rounded-3xl p-7 shadow-2xl border border-white/40"
      >
        <div className="text-center mb-5">
          <div className="text-5xl animate-bounce">🐾</div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">Ruff Luck</h1>
          <p className="text-xs font-bold text-white/50">Matches that never work 💔</p>
        </div>

        <div className="flex bg-black/40 rounded-xl p-1 mb-4 text-sm font-bold">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${mode === m ? 'bg-[#2a2a35] text-orange-400 shadow' : 'text-white/50'}`}
            >
              {m === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <input className={input} placeholder="Username (no email needed)" value={username} autoCapitalize="none"
            onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
          <div className="relative">
            <input className={input} placeholder="Password" type={show ? 'text' : 'password'} value={password}
              onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-400 cursor-pointer">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <div className="text-xs font-bold text-rose-600 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{error}</div>}
          <button
            onClick={submit}
            disabled={busy || !username || !password}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-black shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </div>
        <p className="mt-4 text-[11px] text-center text-white/50 font-medium">
          Use a fun username and a throwaway password. No email, no real personal data.
        </p>
      </motion.div>
    </div>
  );
};
