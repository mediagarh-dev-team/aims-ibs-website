'use client';

/**
 * SeoManager.jsx
 *
 * Manage SEO metadata for every page from one place.
 * Clicking a page loads its SEO data inline; saving writes back to DB.
 */

import { useEffect, useState } from 'react';
import { Loader2, ChevronRight, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthProvider';
import { Field, TextInput, TextArea, Toggle, ImageUpload } from '../fields';

/* ── All website pages ───────────────────────────────────────── */
const ALL_PAGES = [
  { slug: 'home',                                    name: 'Home',                       path: '/' },
  { slug: 'accreditations-affiliations',             name: 'Accreditations & Affiliations', path: '/accreditations-affiliations' },
  { slug: 'admission-process',                       name: 'Admission Process',          path: '/admission-process' },
  { slug: 'aims-ibs-family',                         name: 'AIMS IBS Family',            path: '/aims-ibs-family' },
  { slug: 'downloads-resources',                     name: 'Downloads & Resources',      path: '/downloads-resources' },
  { slug: 'education-loan-support',                  name: 'Education Loan Support',     path: '/education-loan-support' },
  { slug: 'experience-aims-ibs',                     name: 'Experience AIMS IBS',        path: '/experience-aims-ibs' },
  { slug: 'faq',                                     name: 'FAQ',                        path: '/faq' },
  { slug: 'industry-knowledge-partners',             name: 'Industry Knowledge Partners',path: '/industry-knowledge-partners' },
  { slug: 'industry-relevant-certifications',        name: 'Industry Relevant Certifications', path: '/industry-relevant-certifications' },
  { slug: 'loa-eoa',                                 name: 'LOA & EOA',                  path: '/loa-eoa' },
  { slug: 'mba-induction-program',                   name: 'MBA Induction Program',      path: '/mba-induction-program' },
  { slug: 'our-360-degree-training-approach',        name: '360 Degree Training',        path: '/our-360-degree-training-approach' },
  { slug: 'placement-statistics',                    name: 'Placement Statistics',       path: '/placement-statistics' },
  { slug: 'privacy-policy',                          name: 'Privacy Policy',             path: '/privacy-policy' },
  { slug: 'proud-batches',                           name: 'Proud Batches',              path: '/proud-batches' },
  { slug: 'rankings-credentials-our-strenghts',      name: 'Rankings & Credentials',     path: '/rankings-credentials-our-strenghts' },
  { slug: 'refund-policy',                           name: 'Refund Policy',              path: '/refund-policy' },
  { slug: 'share-your-feedback',                     name: 'Share Your Feedback',        path: '/share-your-feedback' },
  { slug: 'value-added-programs-pedagogy',           name: 'Value-Added Programs',       path: '/value-added-programs-pedagogy' },
  { slug: 'vision-mission',                          name: 'Vision & Mission',           path: '/vision-mission' },
];

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${
      type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'
    }`}>
      {type === 'success' ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
      {msg}
    </div>
  );
}

function charCount(str, max) {
  const len = (str || '').length;
  return { len, over: len > max };
}

export default function SeoManager() {
  const { getToken } = useAdminAuth();
  const [selected, setSelected] = useState(null);
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [search, setSearch] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  const loadPage = async (page) => {
    setSelected(page);
    setLoading(true);
    setSeoData(null);
    try {
      const res = await fetch(`/api/admin/seo/${page.slug}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      setSeoData(
        json.data ?? {
          slug: page.slug,
          pageName: page.name,
          title: '',
          description: '',
          keywords: '',
          ogImage: { url: '', publicId: '', alt: '' },
          canonicalPath: page.path,
          index: true,
          isActive: true,
        }
      );
    } catch {
      showToast('Failed to load SEO data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!selected || !seoData) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/seo/${selected.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ ...seoData, pageName: selected.name }),
      });
      const json = await res.json();
      if (json.success) {
        setSeoData(json.data);
        showToast('SEO data saved ✅');
      } else {
        showToast(json.message || 'Save failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const set = (k, v) => setSeoData((prev) => ({ ...prev, [k]: v }));

  const filteredPages = ALL_PAGES.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.includes(search.toLowerCase())
  );

  const title = charCount(seoData?.title, 60);
  const desc  = charCount(seoData?.description, 160);

  return (
    <div className="flex gap-4 h-full" style={{ minHeight: 'calc(100vh - 100px)' }}>
      {/* Left: page list */}
      <aside className="w-72 shrink-0 overflow-y-auto rounded-2xl border border-[#EBEBEB] bg-white p-3">
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-2">
          <Search className="size-3.5 text-[#999]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#BBB]"
          />
        </div>
        <nav className="space-y-0.5">
          {filteredPages.map((page) => (
            <button
              key={page.slug}
              type="button"
              onClick={() => loadPage(page)}
              className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-left transition ${
                selected?.slug === page.slug
                  ? 'bg-[#43358F] font-semibold text-white'
                  : 'text-[#555] hover:bg-[#F5F5FA] hover:text-[#43358F]'
              }`}
            >
              <span className="truncate">{page.name}</span>
              <ChevronRight className={`size-3.5 shrink-0 ${selected?.slug === page.slug ? 'text-white/70' : 'text-[#CCC]'}`} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Right: editor */}
      <div className="flex-1 min-w-0">
        {!selected && (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[#DDD] text-[#BBB]">
            <span className="text-sm">← Select a page to edit its SEO</span>
          </div>
        )}

        {selected && loading && (
          <div className="flex h-64 items-center justify-center text-[#999]">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}

        {selected && !loading && seoData && (
          <div className="space-y-4 overflow-y-auto rounded-2xl border border-[#EBEBEB] bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#090909]">{selected.name}</h2>
                <p className="mt-0.5 text-xs text-[#999]">{selected.path}</p>
              </div>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#43358F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#392b77] disabled:opacity-60"
              >
                {saving ? <Loader2 className="size-3.5 animate-spin" /> : null}
                Save SEO
              </button>
            </div>

            <Field label="Page Title" hint={`${title.len}/60 characters ${title.over ? '— too long!' : ''}`}>
              <TextInput
                value={seoData.title}
                onChange={(v) => set('title', v)}
                placeholder="MBA & PGDM in Bangalore | AIMS IBS"
              />
            </Field>

            <Field label="Meta Description" hint={`${desc.len}/160 characters ${desc.over ? '— too long!' : ''}`}>
              <TextArea
                value={seoData.description}
                onChange={(v) => set('description', v)}
                placeholder="AIMS IBS is a top-ranked business school…"
                rows={3}
              />
            </Field>

            <Field label="Keywords" hint="Comma-separated list">
              <TextInput
                value={seoData.keywords}
                onChange={(v) => set('keywords', v)}
                placeholder="MBA Bangalore, PGDM Bangalore, business school"
              />
            </Field>

            <Field label="Canonical Path" hint="e.g. / or /admission-process">
              <TextInput
                value={seoData.canonicalPath}
                onChange={(v) => set('canonicalPath', v)}
              />
            </Field>

            <Field label="OG / Social Share Image" hint="1200×630px recommended">
              <ImageUpload
                value={seoData.ogImage}
                onChange={(v) => set('ogImage', v)}
                folder="aims-ibs/seo"
              />
            </Field>

            <div className="flex flex-wrap gap-6">
              <Toggle
                checked={seoData.index}
                onChange={(v) => set('index', v)}
                label="Index this page (robots)"
              />
              <Toggle
                checked={seoData.isActive}
                onChange={(v) => set('isActive', v)}
                label="SEO override active"
              />
            </div>

            {/* Live preview */}
            <div className="rounded-xl border border-[#EBEBEB] bg-[#FAFAFA] p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#999]">Google Preview</p>
              <p className="text-[18px] text-blue-700 hover:underline">{seoData.title || 'Page Title'}</p>
              <p className="mt-0.5 text-xs text-green-700">https://www.aimsibs.com{seoData.canonicalPath || selected.path}</p>
              <p className="mt-1 text-sm text-[#555]">{seoData.description || 'Meta description will appear here…'}</p>
            </div>
          </div>
        )}
      </div>

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}
