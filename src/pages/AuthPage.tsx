import React, { useState } from 'react';
import { Bug, Lock, Mail, User as UserIcon, ArrowRight, Check, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onSuccess }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('python');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onSuccess();
      } else if (mode === 'register') {
        await register(email, username, password, preferredLanguage);
        onSuccess();
      } else if (mode === 'forgot') {
        const res = await api.forgotPassword(email);
        setInfoMessage(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5 shadow-xl shadow-purple-600/20 mb-2">
          <div className="w-full h-full bg-[#0a0e17] rounded-[14px] flex items-center justify-center">
            <Bug className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white">
          {mode === 'login' && 'Sign in to BugHunt'}
          {mode === 'register' && 'Join the BugHunt Guild'}
          {mode === 'forgot' && 'Reset your password'}
        </h1>
        <p className="text-xs text-slate-400">
          {mode === 'login' && 'Track your streak, climb leaderboards, and solve live bugs.'}
          {mode === 'register' && 'Level up your debugging skills across 4 programming languages.'}
          {mode === 'forgot' && 'Enter your registered email address to receive recovery steps.'}
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl space-y-5">
        {/* Toggle Login/Register */}
        {mode !== 'forgot' && (
          <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'login' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'register' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Username
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g., CodeNinja42"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                    }}
                    className="text-[11px] text-purple-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Primary Programming Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="c">C</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:opacity-95 shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {mode === 'forgot' && (
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setMode('login');
                setError('');
                setInfoMessage('');
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Quick Demo Logins for instant evaluation */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-center">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              Instant Demo Access (One-Click)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@bughunt.dev', 'password123')}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-semibold text-white">AlexHunter</div>
              <div className="text-[10px] text-slate-400">Regular Hunter · Lvl 3</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@bughunt.dev', 'admin123')}
              className="p-2 rounded-xl bg-slate-950 border border-amber-900/50 hover:border-amber-500/60 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-semibold text-amber-300">Ada (Admin)</div>
              <div className="text-[10px] text-amber-400/80">Admin Panel Access</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
