'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useAdminAuth } from './AdminAuthProvider';

/* ── Nav config ─────────────────────────────────────────────────── */
// Groups with `accordion: true` render as a collapsible dropdown.
// Groups without it render as before (flat label + items).
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

  // ── Accordion group: Web Pages ───────────────────────────────
  {
    label: 'Web Pages',
    accordion: true, // ← triggers collapsible behaviour
    storageKey: 'sidebar_webpages_open', // localStorage key
    icon: (
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
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    items: [
      {
        label: 'Home Page',
        href: '/admin/pages/home',
        icon: (
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
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
      {
        label: 'Vision & Mission',
        href: '/admin/pages/vision-mission',
        icon: (
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        ),
      },
      {
        label: 'Admission Process',
        href: '/admin/pages/admission-process',
        icon: (
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      },
      {
        label: 'Placement Statistics',
        href: '/admin/pages/placement-statistics',
        icon: (
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
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        ),
      },
      {
        label: 'Rankings',
        href: '/admin/pages/rankings-credentials-our-strenghts',
        icon: (
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
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      },
      {
        label: 'Accreditations',
        href: '/admin/pages/accreditations-affiliations',
        icon: (
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
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        ),
      },
      {
        label: 'AIMS IBS Family',
        href: '/admin/pages/aims-ibs-family',
        icon: (
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        label: 'Experience AIMS IBS',
        href: '/admin/pages/experience-aims-ibs',
        icon: (
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ),
      },
      {
        label: 'Global Collaborations',
        href: '/admin/pages/industry-knowledge-partners',
        icon: (
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
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        ),
      },
      {
        label: 'Certifications',
        href: '/admin/pages/industry-relevant-certifications',
        icon: (
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
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        ),
      },
      {
        label: 'Proud Batches',
        href: '/admin/pages/proud-batches',
        icon: (
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      },
      {
        label: 'MBA Induction',
        href: '/admin/pages/mba-induction-program',
        icon: (
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
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        ),
      },
      {
        label: '360° Training',
        href: '/admin/pages/our-360-degree-training-approach',
        icon: (
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
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-.18-2.96" />
          </svg>
        ),
      },
      {
        label: 'Education Loan',
        href: '/admin/pages/education-loan-support',
        icon: (
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
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        ),
      },
      {
        label: 'Downloads',
        href: '/admin/pages/downloads-resources',
        icon: (
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        ),
      },
      {
        label: 'FAQ',
        href: '/admin/pages/faq',
        icon: (
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
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
        ),
      },
      {
        label: 'Share Feedback',
        href: '/admin/pages/share-your-feedback',
        icon: (
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
      {
        label: 'LOA & EOA',
        href: '/admin/pages/loa-eoa',
        icon: (
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
    ],
  },

  {
    label: 'SEO',
    items: [
      {
        label: 'SEO Manager',
        href: '/admin/seo',
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

/* ── Helpers ─────────────────────────────────────────────────────── */
function isActive(item, pathname) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function groupHasActive(group, pathname) {
  return group.items.some((item) => isActive(item, pathname));
}

function getPageTitle(pathname) {
  for (const g of NAV_GROUPS) {
    for (const item of g.items) {
      if (isActive(item, pathname)) return item.label;
    }
  }
  return 'Admin';
}

/* ── Accordion group (Web Pages) ─────────────────────────────────── */
function AccordionGroup({ group, pathname, onClose }) {
  const storageKey = group.storageKey || `sidebar_${group.label}_open`;
  const hasActive = groupHasActive(group, pathname);

  // Init from localStorage; auto-open if a child is active
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return hasActive;
    try {
      const stored = localStorage.getItem(storageKey);
      // If a child page is active, always open regardless of stored value
      return hasActive || stored === 'true';
    } catch {
      return hasActive;
    }
  });

  // Persist open state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(open));
    } catch {}
  }, [open, storageKey]);

  // When pathname changes to a child route, force-open
  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div>
      {/* Accordion trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          'group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
          hasActive ? 'bg-[#43358F]/8 text-[#43358F]' : 'text-[#666] hover:bg-[#F5F5FA] hover:text-[#43358F]',
        ].join(' ')}
      >
        <span className={hasActive ? 'text-[#43358F]' : 'text-[#BBBBBB] transition group-hover:text-[#43358F]'}>
          {group.icon}
        </span>
        <span className="flex-1 text-left">{group.label}</span>
        {/* Item count badge */}
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${hasActive ? 'bg-[#43358F]/15 text-[#43358F]' : 'bg-[#EEE] text-[#999]'}`}
        >
          {group.items.length}
        </span>
        <ChevronDown
          className={`size-3.5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''} ${hasActive ? 'text-[#43358F]' : 'text-[#BBBBBB]'}`}
        />
      </button>

      {/* Dropdown items */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-[#F0EEF9] pl-2">
          {group.items.map((item) => {
            const active = isActive(item, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={[
                  'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition-all duration-150',
                  active
                    ? 'bg-[#43358F] text-white shadow-sm shadow-[#43358F]/20'
                    : 'text-[#666] hover:bg-[#F5F5FA] hover:text-[#43358F]',
                ].join(' ')}
              >
                <span className={`shrink-0 ${active ? 'text-white' : 'text-[#C0B8E8]'}`}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
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
          <div className="border-b border-[#F5F5F5] px-4 py-3.5">
            <p className="text-xs font-semibold text-[#090909]">{admin?.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-[#999]">{admin?.email}</p>
          </div>
          <div className="border-b border-[#F5F5F5] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#999]">Session expires in</span>
              <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                {remaining || '…'}
              </span>
            </div>
          </div>
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
        {/* Logo */}
        <div className="flex h-[64px] shrink-0 items-center gap-3 border-b border-[#F5F5F5] px-5">
          <Image src="/images/logo.svg" alt="AIMS IBS" width={62} height={22} className="object-contain" />
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
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) =>
            group.accordion ? (
              // ── Accordion group ──────────────────────────────────
              <div key={group.label} className="mb-1">
                <AccordionGroup group={group} pathname={pathname} onClose={onClose} />
              </div>
            ) : (
              // ── Regular flat group ───────────────────────────────
              <div key={group.label} className="mb-3">
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
                        {active && <span className="absolute inset-y-0 left-0 w-0.5 rounded-r-full bg-white/40" />}
                        <span
                          className={active ? 'text-white' : 'text-[#BBBBBB] transition group-hover:text-[#43358F]'}
                        >
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
            ),
          )}
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

  const crumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      href: '/' + arr.slice(0, i + 1).join('/'),
    }));

  return (
    <header className="sticky top-0 z-[999] flex h-[64px] items-center justify-between border-b border-[#F0F0F0] bg-white/95 px-4 backdrop-blur-md md:px-6">
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

        <span className="font-semibold text-[#090909] md:hidden">{title}</span>
      </div>

      <div className="flex items-center gap-2">
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
