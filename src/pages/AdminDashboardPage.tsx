import React, { useState } from 'react';
import { supabase, isSupabaseConfigured, localDb } from '../lib/supabase';
import { EnquiryList } from '../components/admin/EnquiryList';
import { SiteSettingsEditor } from '../components/admin/SiteSettingsEditor';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onReturnHome: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onLogout, onReturnHome }) => {
  const [tab, setTab] = useState<'enquiries' | 'settings'>('enquiries');

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localDb.setLocalAdminLoggedIn(false);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-blue-500/20">
              SW
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">Solutions Way</span>
              <span className="text-xs text-blue-400 ml-2 font-mono">Control Centre</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onReturnHome}
              className="text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>Public Portal</span>
              <span className="text-slate-500">↗</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded text-slate-300 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex border-b border-slate-800 mb-8 space-x-6">
          <button
            onClick={() => setTab('enquiries')}
            className={`pb-3 text-xs font-semibold transition border-b-2 ${
              tab === 'enquiries'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Client Enquiries
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`pb-3 text-xs font-semibold transition border-b-2 ${
              tab === 'settings'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Website Settings &amp; Legal
          </button>
        </div>

        {tab === 'enquiries' ? <EnquiryList /> : <SiteSettingsEditor />}
      </main>
    </div>
  );
};
