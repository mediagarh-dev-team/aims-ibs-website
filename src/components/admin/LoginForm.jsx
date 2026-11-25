'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdminAuth } from './AdminAuthProvider';

export default function LoginForm() {
  const { login } = useAdminAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid credentials. Please try again.');
        return;
      }
      login(data.data.token, data.data.admin);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      {/* ── Left branding panel ─────────────────────────────────── */}
      <div className="relative hidden flex-col overflow-hidden bg-[#43358F] lg:flex lg:w-[52%]">
        {/* Geometric background shapes */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Large circle top-right */}
          <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute -right-16 -top-16 h-[320px] w-[320px] rounded-full border border-white/8" />
          {/* Orange accent bottom-left */}
          <div className="absolute -bottom-20 -left-20 h-[380px] w-[380px] rounded-full bg-[#F04B1D]/15" />
          {/* Grid dots */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
          {/* Diagonal accent line */}
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1.5 shadow-lg">
              <Image src="/images/logo.svg" alt="AIMS IBS" width={40} height={28} className="object-contain" />
            </div>
            <div>
              <p className="text-base font-bold tracking-wide text-white">AIMS IBS</p>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">Mediagarh</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="max-w-[420px]">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F04B1D]" />
              Secure Admin Portal
            </span>
            <h1 className="mb-5 text-[42px] font-bold leading-[1.1] text-white xl:text-[52px]">
              Manage your
              <br />
              institute <span className="text-[#F04B1D]">smarter.</span>
            </h1>
            <p className="text-base leading-relaxed text-white/55">
              All your placement records, student enquiries, and batch data — managed from one powerful dashboard.
              Authorized access only.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 border-t border-white/15 pt-8">
            {[
              { value: '300+', label: 'Students Placed' },
              { value: '50+', label: 'Hiring Companies' },
              { value: '3', label: 'Active Batches' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-white/45">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom brand strip */}
        <div className="relative z-10 border-t border-white/10 px-12 py-4 xl:px-16">
          <p className="text-[11px] text-white/30">
            © {new Date().getFullYear()} AIMS IBS Mediagarh. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right login panel ──────────────────────────────────── */}
      <div className="relative flex flex-1 items-center justify-center bg-[#F4F6FB] p-6 lg:p-10">
        {/* Subtle bg pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(67,53,143,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div
          className={`relative w-full max-w-[420px] transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Mobile logo — only on small screens */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white p-1.5 shadow-md">
              <Image src="/images/logo.svg" alt="AIMS IBS" width={36} height={26} className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#43358F]">AIMS IBS</p>
              <p className="text-[10px] uppercase tracking-wider text-[#999]">Mediagarh</p>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-black/[0.08] ring-1 ring-black/[0.04] md:p-10">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#43358F]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#43358F]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                Admin Access
              </div>
              <h2 className="text-2xl font-bold text-[#090909] md:text-[28px]">Welcome back</h2>
              <p className="mt-1.5 text-sm text-[#888]">Sign in to access your dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email field */}
              <div className="group">
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#444]">
                  Email address
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C0C0C0] transition group-focus-within:text-[#43358F]">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@aims-ibs.com"
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] py-3 pl-10 pr-4 text-sm text-[#090909] outline-none transition-all placeholder:text-[#CACACA] focus:border-[#43358F] focus:bg-white focus:shadow-[0_0_0_3px_rgba(67,53,143,0.1)]"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="group">
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[#444]">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C0C0C0] transition group-focus-within:text-[#43358F]">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] py-3 pl-10 pr-11 text-sm text-[#090909] outline-none transition-all placeholder:text-[#CACACA] focus:border-[#43358F] focus:bg-white focus:shadow-[0_0_0_3px_rgba(67,53,143,0.1)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-[#BBBBBB] transition hover:text-[#43358F]"
                  >
                    {showPwd ? (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <svg
                    className="mt-0.5 shrink-0"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="relative mt-2 w-full overflow-hidden rounded-xl bg-[#43358F] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#43358F]/25 transition-all hover:bg-[#3a2d7a] hover:shadow-lg hover:shadow-[#43358F]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43358F] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {/* Shine effect */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign in to Dashboard
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-[#BBBBBB]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <span>
                Session expires in <strong className="text-[#999]">24 hours</strong> · Authorized personnel only
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
