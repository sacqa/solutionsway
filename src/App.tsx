import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, localDb } from './lib/supabase';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { HomePage } from './pages/HomePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

export const App: React.FC = () => {
  const [isAdminPath, setIsAdminPath] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/admin');
  });
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState<boolean>(() => {
    return localDb.isLocalAdminLoggedIn();
  });
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  useEffect(() => {
    // Handle URL path changes
    const onLocationChange = () => {
      setIsAdminPath(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', onLocationChange);

    // Check existing Supabase session & verify admin role if configured
    const verifyAuth = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data: profile } = await supabase
              .from('admin_profiles')
              .select('id, is_active')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile && profile.is_active) {
              setIsAuthenticatedAdmin(true);
            } else {
              setIsAuthenticatedAdmin(false);
            }
          } else {
            setIsAuthenticatedAdmin(false);
          }
        } catch {
          setIsAuthenticatedAdmin(localDb.isLocalAdminLoggedIn());
        }
      } else {
        setIsAuthenticatedAdmin(localDb.isLocalAdminLoggedIn());
      }
      setAuthChecking(false);
    };

    verifyAuth();

    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminPath(true);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsAdminPath(false);
  };

  if (isAdminPath) {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
          Verifying security privileges...
        </div>
      );
    }

    if (!isAuthenticatedAdmin) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => setIsAuthenticatedAdmin(true)}
          onReturnHome={navigateToHome}
        />
      );
    }

    return (
      <SiteSettingsProvider>
        <AdminDashboardPage
          onLogout={() => setIsAuthenticatedAdmin(false)}
          onReturnHome={navigateToHome}
        />
      </SiteSettingsProvider>
    );
  }

  return (
    <SiteSettingsProvider>
      <HomePage onNavigateToAdmin={navigateToAdmin} />
    </SiteSettingsProvider>
  );
};

export default App;
