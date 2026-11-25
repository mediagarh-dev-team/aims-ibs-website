'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from './AdminAuthProvider';

/* ── Stat card ──────────────────────────────────────────────────── */
function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#999]">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[#090909]">
            {value ?? <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-[#F0F0F0]" />}
          </p>
          {sub && <p className="mt-1 text-xs text-[#BBBBBB]">{sub}</p>}
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: color + '18' }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Enquiry status badge ───────────────────────────────────────── */
const STATUS_STYLE = {
  new:         'bg-blue-50 text-blue-700',
  in_progress: 'bg-yellow-50 text-yellow-700',
  resolved:    'bg-green-50 text-green-700',
  spam:        'bg-red-50 text-red-600',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

/* ── Skeleton row ───────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="h-4 w-1/3 animate-pulse rounded bg-[#F0F0F0]" />
      <div className="h-4 w-1/4 animate-pulse rounded bg-[#F0F0F0]" />
      <div className="h-4 w-1/5 animate-pulse rounded bg-[#F0F0F0]" />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function DashboardHome() {
  const { getToken } = useAdminAuth();

  const [stats,      setStats]      = useState(null);
  const [enquiries,  setEnquiries]  = useState(null);
  const [statsErr,   setStatsErr]   = useState(false);

  useEffect(() => {
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch stats and recent enquiries in parallel
    Promise.all([
      fetch('/api/admin/dashboard', { headers }).then((r) => r.json()),
      fetch('/api/admin/enquiries?limit=5', { headers }).then((r) => r.json()),
    ])
      .then(([statsRes, enqRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        else setStatsErr(true);
        if (enqRes.success)   setEnquiries(enqRes.data.enquiries);
      })
      .catch(() => setStatsErr(true));
  }, [getToken]);

  const statCards = [
    {
      label: 'Total Enquiries',
      value: stats?.totalEnquiries,
      sub: `${stats?.newEnquiries ?? '—'} new`,
      color: '#43358F',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      label: 'Students Placed',
      value: stats?.totalPlacements,
      sub: 'across all batches',
      color: '#F04B1D',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
    },
    {
      label: 'New Enquiries',
      value: stats?.newEnquiries,
      sub: 'pending response',
      color: '#0CA5E9',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
        </svg>
      ),
    },
    {
      label: 'Placement Batches',
      value: stats ? stats.placementsByBatch.length : undefined,
      sub: stats
        ? stats.placementsByBatch.map((b) => `${b._id} (${b.count})`).join(', ')
        : undefined,
      color: '#22C55E',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#43358F] px-6 py-8 md:px-8">
        {/* decorative circle */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-[#F04B1D]/20" />

        <p className="text-sm font-medium text-white/60">Welcome back 👋</p>
        <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">
          AIMS IBS Admin Dashboard
        </h2>
        <p className="mt-2 max-w-md text-sm text-white/50">
          Here's an overview of your institute data. Manage placements, enquiries and more from the sidebar.
        </p>
      </div>

      {/* Stat cards */}
      {statsErr ? (
        <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-700 ring-1 ring-red-100">
          Could not load stats. Make sure the database is connected.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>
      )}

      {/* Two-column section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Recent enquiries */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#090909]">Recent Enquiries</h3>
            <a
              href="/admin/enquiries"
              className="text-xs font-medium text-[#43358F] hover:underline"
            >
              View all →
            </a>
          </div>

          {!enquiries ? (
            <div className="divide-y divide-[#F5F5F5]">
              {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : enquiries.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#BBBBBB]">No enquiries yet.</p>
          ) : (
            <div className="divide-y divide-[#F5F5F5]">
              {enquiries.map((e) => (
                <div key={e._id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#090909]">{e.name}</p>
                    <p className="truncate text-xs text-[#999]">{e.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={e.status} />
                    <p className="mt-1 text-[10px] text-[#BBBBBB]">
                      {new Date(e.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Placements by batch */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h3 className="mb-4 text-sm font-semibold text-[#090909]">Placements by Batch</h3>

          {!stats ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-xl bg-[#F0F0F0]" />
              ))}
            </div>
          ) : stats.placementsByBatch.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#BBBBBB]">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.placementsByBatch.map((b, i) => {
                const max = stats.placementsByBatch[0]?.count || 1;
                const pct = Math.round((b.count / max) * 100);
                const colors = ['#43358F', '#F04B1D', '#0CA5E9'];
                return (
                  <div key={b._id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#333]">{b._id} Batch</span>
                      <span className="font-semibold text-[#090909]">{b.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#F0F0F0]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: colors[i % 3] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
