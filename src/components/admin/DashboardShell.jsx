'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from './AdminAuthProvider';

/* ── Nav config ─────────────────────────────────────────────────── */
const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        exact: true,
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="7" height="9" x="3" y="3" rx="1.5" />
            <rect width="7" height="5" x="14" y="3" rx="1.5" />
            <rect width="7" height="9" x="14" y="12" rx="1.5" />
            <rect width="7" height="5" x="3" y="16" rx="1.5" />
          </svg>
        ),
      },
      {
        label: 'Enquiries',
        href: '/admin/enquiries',
        badge: 'new',
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
      {
        label: 'Placements',
        href: '/admin/placements',
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Settings',
        href: '/admin/settings',
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
    ],
  },
];

function isActive(item, pathname) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function getPageTitle(pathname) {
  for (const g of NAV_GROUPS) {
    for (const item of g.items) {
      if (isActive(item, pathname)) return item.label;
    }
  }
  return 'Admin';
}

/* ── Session timer hook ─────────────────────────────────────────── */
function useSessionTimer() {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    function calc() {
      const token = localStorage.getItem('aims_admin_token');
      if (!token) return;
      try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        const ms = exp * 1000 - Date.now();
        if (ms <= 0) {
          setRemaining('Expired');
          return;
        }
        const h = Math.floor(ms / 3_600_000);
        const m = Math.floor((ms % 3_600_000) / 60_000);
        setRemaining(h > 0 ? `${h}h ${m}m` : `${m}m`);
      } catch {
        setRemaining('');
      }
    }
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, []);

  return remaining;
}

/* ── User dropdown ──────────────────────────────────────────────── */
function UserDropdown({ admin, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const remaining = useSessionTimer();

  useEffect(() => {
    function outside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-xl border border-[#EBEBEB] bg-white px-3 py-2 transition hover:border-[#43358F]/30 hover:bg-[#F8F7FF]"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#43358F] text-xs font-bold text-white">
          {admin?.name?.[0]?.toUpperCase() ?? 'A'}
        </div>
        <div className="hidden text-left md:block">
          <p className="text-xs font-semibold text-[#090909] leading-tight">{admin?.name ?? 'Admin'}</p>
          <p className="text-[10px] capitalize text-[#999]">{admin?.role?.replace('_', ' ') ?? 'admin'}</p>
        </div>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-[#999] transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white shadow-xl shadow-black/10">
          {/* User info */}
          <div className="border-b border-[#F5F5F5] px-4 py-3.5">
            <p className="text-xs font-semibold text-[#090909]">{admin?.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-[#999]">{admin?.email}</p>
          </div>
          {/* Session info */}
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#999]">Session expires in</span>
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                {remaining || '…'}
              </span>
            </div>
          </div>
          {/* Actions */}
          <div className="p-1.5">
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
            >
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────── */
function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-[#F0F0F0] bg-white transition-transform duration-300 ease-in-out lg:translate-x-0',
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Logo area */}
        <div className="flex h-[64px] shrink-0 items-center gap-3 border-b border-[#F5F5F5] px-5">
          <div className="flex h-9 w-69 items-center rounded-xl bg-white">
            <Image src="/images/logo.svg" alt="AIMS IBS" width={62} height={22} className="object-contain" />
          </div>
          {/* Mobile close */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto rounded-lg p-1 text-[#BBBBBB] hover:text-[#333] lg:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#C8C8C8]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item, pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={[
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                        active
                          ? 'bg-[#43358F] text-white shadow-sm shadow-[#43358F]/20'
                          : 'text-[#666] hover:bg-[#F5F5FA] hover:text-[#43358F]',
                      ].join(' ')}
                    >
                      {/* Active indicator */}
                      {active && <span className="absolute inset-y-0 left-0 w-0.5 rounded-r-full bg-white/40" />}
                      <span className={active ? 'text-white' : 'text-[#BBBBBB] transition group-hover:text-[#43358F]'}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge === 'new' && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${active ? 'bg-white/20 text-white' : 'bg-[#43358F]/10 text-[#43358F]'}`}
                        >
                          New
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User card at bottom */}
        <div className="border-t border-[#F5F5F5] p-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#F8F7FF] px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#43358F] text-sm font-bold text-white">
              {admin?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#090909]">{admin?.name ?? 'Admin'}</p>
              <p className="truncate text-[10px] capitalize text-[#999]">{admin?.role?.replace('_', ' ') ?? 'admin'}</p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="shrink-0 rounded-lg p-1.5 text-[#CCCCCC] transition hover:bg-red-50 hover:text-red-500"
            >
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── Topbar ─────────────────────────────────────────────────────── */
function Topbar({ onMenuClick }) {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();
  const title = getPageTitle(pathname);

  // Breadcrumb segments
  const crumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      href: '/' + arr.slice(0, i + 1).join('/'),
    }));

  return (
    <header className="sticky top-0 z-10 flex h-[64px] items-center justify-between border-b border-[#F0F0F0] bg-white/95 px-4 backdrop-blur-md md:px-6">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl p-2 text-[#888] transition hover:bg-[#F5F5F5] hover:text-[#333] lg:hidden"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="8" y2="8" />
            <line x1="4" x2="20" y1="16" y2="16" />
          </svg>
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm md:flex">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#DDDDDD]"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
              {i === crumbs.length - 1 ? (
                <span className="font-semibold text-[#090909]">{c.label}</span>
              ) : (
                <Link href={c.href} className="text-[#999] transition hover:text-[#43358F]">
                  {c.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Mobile title */}
        <span className="font-semibold text-[#090909] md:hidden">{title}</span>
      </div>

      {/* Right: session badge + user dropdown */}
      <div className="flex items-center gap-2">
        {/* Session active badge */}
        <div className="hidden items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-[11px] font-medium text-green-700 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Session active
        </div>

        <UserDropdown admin={admin} logout={logout} />
      </div>
    </header>
  );
}

/* ── Shell ──────────────────────────────────────────────────────── */
export default function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F6FB]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col lg:ml-[260px]">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
