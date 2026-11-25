'use client';

/**
 * AdminAuthProvider.jsx
 *
 * Manages JWT token in localStorage with:
 * - 24-hour auto-logout via expiry check
 * - Protected route redirect to /admin/login
 * - Login / logout helpers
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext(null);

const TOKEN_KEY = 'aims_admin_token';
const ADMIN_KEY = 'aims_admin_info';

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds; Date.now() is in ms
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const router   = useRouter();
  const pathname = usePathname();

  // On mount — restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const info  = localStorage.getItem(ADMIN_KEY);

    if (token && info && !isTokenExpired(token)) {
      setAdmin(JSON.parse(info));
    } else {
      // Clear stale data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ADMIN_KEY);
    }
    setLoading(false);
  }, []);

  // Poll every 60 s to auto-logout when token expires
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && isTokenExpired(token)) {
        logout();
      }
    }, 60_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route guard — runs whenever pathname changes
  useEffect(() => {
    if (loading) return;

    const isLoginPage = pathname === '/admin/login';

    if (!admin && !isLoginPage) {
      router.replace('/admin/login');
    }
    if (admin && isLoginPage) {
      router.replace('/admin');
    }
  }, [admin, loading, pathname, router]);

  const login = useCallback((token, adminInfo) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(adminInfo));
    setAdmin(adminInfo);
    router.replace('/admin');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    setAdmin(null);
    router.replace('/admin/login');
  }, [router]);

  const getToken = useCallback(() => localStorage.getItem(TOKEN_KEY), []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}
