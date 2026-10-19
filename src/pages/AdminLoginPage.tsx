import React, { useState } from 'react';
import { supabase, isSupabaseConfigured, localDb } from '../lib/supabase';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onReturnHome?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onReturnHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Verify that this authenticated user is active in admin_profiles
        const { data: profile, error: profileErr } = await supabase
          .from('admin_profiles')
          .select('id, is_active')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileErr || !profile || !profile.is_active) {
          await supabase.auth.signOut();
          throw new Error('Access denied. Account is not authorised as an active administrator.');
        }
      } else {
        // Local preview validation
        if (email.toLowerCase() === 'admin@solutionsway.co.uk' || email.includes('@')) {
          localDb.setLocalAdminLoggedIn(true);
        } else {
          throw new Error('Please enter a valid administrator email address.');
        }
      }

      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    localDb.setLocalAdminLoggedIn(true);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg mx-auto mb-3 shadow-lg shadow-blue-500/20">
            SW
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Solutions Way Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Authorised Administrative Control Centre</p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-6 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-lg">
            {errorMsg}
          </div>
        )}

        {/* Demo Fast Login Banner */}
        <div className="mb-6 p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-slate-300">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-blue-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Preview Environment Active
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Demo Mode</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-2">
            Click below for instant one-click administrative access to review enquiry management and content tools.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600/90 hover:bg-blue-600 rounded-lg transition"
          >
            One-Click Admin Sign In →
          </button>
        </div>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider font-medium">
            or sign in with password
          </span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="admin@solutionsway.co.uk"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In with Supabase Credentials'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onReturnHome}
            className="text-xs text-slate-400 hover:text-white transition"
          >
            ← Return to public website
          </button>
        </div>
      </div>
    </div>
  );
};
