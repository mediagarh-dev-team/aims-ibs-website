'use client';

/**
 * HomePageEditor.jsx
 *
 * Section-level saving: each section has its own "Save" button that
 * calls PATCH /api/admin/pages/home with { section, data }.
 * Only the changed section is written to the DB — other sections are
 * never touched until their own Save is clicked.
 *
 * "Publish" at the top saves the publish flag via PATCH isPublished.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Save, Eye, AlertCircle, CheckCircle2, Loader2, ChevronDown, Plus } from 'lucide-react';
import { useAdminAuth } from '../AdminAuthProvider';
import { Field, TextInput, TextArea, Toggle, ImageUpload, VideoUpload, PdfUpload, ListEditor } from '../fields';

/* ── Toast ───────────────────────────────────────────────────── */
function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${
        type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'
      }`}
    >
      {type === 'success' ? <CheckCircle2 className="size-4" /> : <AlertCircle className="size-4" />}
      {msg}
    </div>
  );
}

/* ── Section wrapper ─────────────────────────────────────────── */
/**
 * Props:
 *   open         — controlled by parent (only one open at a time)
 *   onToggle     — called when header is clicked
 *   stickyTop    — px offset from top for the sticky header (accounts for the
 *                  DashboardShell topbar at 64px + TopBar at ~52px ≈ 120px)
 */
function Section({ id, title, icon, sectionKey, sectionData, onSave, open, onToggle, children }) {
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const initialRef = useRef(null);

  // Track dirty state
  useEffect(() => {
    if (initialRef.current === null) {
      initialRef.current = JSON.stringify(sectionData);
    } else {
      setDirty(JSON.stringify(sectionData) !== initialRef.current);
    }
  }, [sectionData]);

  // Reset dirty tracking when section is freshly saved (initialRef updated externally)
  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(sectionKey, sectionData);
    if (ok) {
      initialRef.current = JSON.stringify(sectionData);
      setDirty(false);
    }
    setSaving(false);
  };

  return (
    <section id={id} className="scroll-mt-[128px] overflow-clip rounded-2xl border border-[#EBEBEB] bg-white shadow-sm">
      {/*
        ── Sticky header ────────────────────────────────────────────
        When open, the header sticks to top so the Save button is
        always visible while editing content below.
        top-[120px] = DashboardShell topbar (64px) + TopBar h-14 (56px)
      */}
      <div
        className={[
          'flex items-center justify-between gap-3 border-b border-[#F5F5F5] px-4 py-3',
          open ? 'sticky top-[64px] z-10 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'bg-white',
        ].join(' ')}
      >
        {/* Toggle button */}
        <button type="button" onClick={onToggle} className="flex flex-1 items-center gap-2.5 text-left">
          {icon && (
            <span
              className={[
                'grid size-8 shrink-0 place-items-center rounded-lg text-base transition',
                open ? 'bg-[#43358F] text-white' : 'bg-[#43358F]/8 text-[#43358F]',
              ].join(' ')}
            >
              {icon}
            </span>
          )}
          <span className="text-sm font-bold text-[#090909]">{title}</span>
          {dirty && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">
              Unsaved
            </span>
          )}
          <ChevronDown
            className={`ml-auto size-4 shrink-0 text-[#999] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Save button — always visible in the sticky header */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
          title={dirty ? `Save "${title}" section` : 'No unsaved changes'}
          className={[
            'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition',
            dirty ? 'bg-[#43358F] text-white hover:bg-[#392b77]' : 'bg-[#F5F5F5] text-[#BBB] cursor-not-allowed',
          ].join(' ')}
        >
          {saving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
          Save
        </button>
      </div>

      {/* Collapsible body — smooth height animation */}
      <div className={open ? 'block' : 'hidden'}>
        <div className="space-y-4 p-4">{children}</div>
      </div>
    </section>
  );
}

/* ── Top publish bar ─────────────────────────────────────────── */
function TopBar({ isPublished, onPublish, publishing }) {
  return (
    <div className="flex h-14 items-center justify-between gap-3 rounded-xl border border-[#EBEBEB] bg-white/95 px-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-[#090909]">Home Page</span>
        {isPublished ? (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700">
            Live
          </span>
        ) : (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
            Draft
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-[11px] text-[#999]">
        <span>Each section has its own Save button →</span>
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#43358F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#392b77] disabled:opacity-60"
        >
          {publishing ? <Loader2 className="size-3.5 animate-spin" /> : <Eye className="size-3.5" />}
          {isPublished ? 'Unpublish' : 'Publish'}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Section UI components (same as before — receive data + onChange)
   ═══════════════════════════════════════════════════════════════ */

function HeroForm({ data, onChange }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Heading (light)">
          <TextInput
            value={data.headingLight}
            onChange={(v) => set('headingLight', v)}
            placeholder="Not Your Average"
          />
        </Field>
        <Field label="Heading (bold)">
          <TextInput
            value={data.headingBold}
            onChange={(v) => set('headingBold', v)}
            placeholder="Business School in Bangalore"
          />
        </Field>
      </div>
      <Field label="Sub-text (HTML allowed)" hint="Wrap key words in <strong> for emphasis">
        <TextArea value={data.subtext} onChange={(v) => set('subtext', v)} rows={3} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary CTA Label">
          <TextInput value={data.ctaLabel} onChange={(v) => set('ctaLabel', v)} />
        </Field>
        <Field label="Primary CTA Link">
          <TextInput value={data.ctaHref} onChange={(v) => set('ctaHref', v)} placeholder="/apply-now" />
        </Field>
        <Field label="Secondary CTA Label">
          <TextInput value={data.secondaryCtaLabel} onChange={(v) => set('secondaryCtaLabel', v)} />
        </Field>
        <Field label="Secondary CTA Link">
          <TextInput value={data.secondaryCtaHref} onChange={(v) => set('secondaryCtaHref', v)} />
        </Field>
      </div>
      <Field label="Background Video" hint="Upload to Cloudinary or enter URL">
        <VideoUpload
          value={{ url: data.videoUrl || '' }}
          onChange={(v) => set('videoUrl', v.url || v)}
          folder="aims-ibs/home"
        />
      </Field>
      <Field label="Companies marquee title">
        <TextInput value={data.companiesTitle} onChange={(v) => set('companiesTitle', v)} />
      </Field>
      <Field label="Company Logos" hint="3 per row — click thumbnail to replace, drag to reorder">
        <ListEditor
          grid
          items={data.companyLogos || []}
          onChange={(v) => set('companyLogos', v)}
          createItem={() => ({ url: '', publicId: '', alt: '' })}
          render={(item, patch) => <ImageUpload value={item} onChange={patch} folder="aims-ibs/home/logos" />}
        />
      </Field>
    </>
  );
}

function StatsForm({ data, onChange }) {
  return (
    <ListEditor
      items={data || []}
      onChange={onChange}
      createItem={() => ({ label: '', value: '' })}
      render={(item, patch) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Label">
            <TextInput value={item.label} onChange={(v) => patch({ label: v })} placeholder="Overall Recruiters" />
          </Field>
          <Field label="Value">
            <TextInput value={item.value} onChange={(v) => patch({ value: v })} placeholder="4300+" />
          </Field>
        </div>
      )}
    />
  );
}

function ProgramsForm({ data, onChange }) {
  const setMasters = (patch) => onChange({ ...data, masters: { ...(data.masters || {}), ...patch } });
  const masters = data?.masters || {};
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-wide text-[#43358F]">Masters (MBA + PGPM)</p>
      <div className="ml-3 space-y-3 border-l-2 border-[#43358F]/15 pl-3">
        <Field label="Program Image">
          <ImageUpload
            value={masters.image}
            onChange={(v) => setMasters({ image: v })}
            folder="aims-ibs/home/programs"
            variant="inline"
          />
        </Field>
        <Field label="Program Link">
          <TextInput
            value={masters.href}
            onChange={(v) => setMasters({ href: v })}
            placeholder="/programs/pg/mba-pgpm"
          />
        </Field>
        <Field label="Meta items">
          <ListEditor
            items={masters.meta || []}
            onChange={(v) => setMasters({ meta: v })}
            createItem={() => ({ label: '', value: '' })}
            render={(item, patch) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Label">
                  <TextInput value={item.label} onChange={(v) => patch({ label: v })} />
                </Field>
                <Field label="Value">
                  <TextInput value={item.value} onChange={(v) => patch({ value: v })} />
                </Field>
              </div>
            )}
          />
        </Field>
        <Field label="Bullet Points">
          <ListEditor
            items={(masters.points || []).map((p) => ({ text: p }))}
            onChange={(v) => setMasters({ points: v.map((x) => x.text) })}
            createItem={() => ({ text: '' })}
            render={(item, patch) => <TextInput value={item.text} onChange={(v) => patch({ text: v })} />}
          />
        </Field>
        <Field label="Specialisations">
          <ListEditor
            items={masters.specialisations || []}
            onChange={(v) => setMasters({ specialisations: v })}
            createItem={() => ({ label: '', href: '' })}
            render={(item, patch) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Label">
                  <TextInput value={item.label} onChange={(v) => patch({ label: v })} />
                </Field>
                <Field label="Link">
                  <TextInput value={item.href} onChange={(v) => patch({ href: v })} />
                </Field>
              </div>
            )}
          />
        </Field>
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#43358F]">Bachelor's Programs</p>
      <div className="ml-3 border-l-2 border-[#43358F]/15 pl-3">
        <ListEditor
          items={data?.bachelors || []}
          onChange={(v) => onChange({ ...data, bachelors: v })}
          createItem={() => ({
            prefix: 'Bachelor of',
            name: '',
            image: { url: '', publicId: '', alt: '' },
            href: '',
            tags: [],
            points: [],
            affiliatedTo: 'Bangalore University',
          })}
          render={(item, patch) => (
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-3">
                <Field label="Prefix">
                  <TextInput value={item.prefix} onChange={(v) => patch({ prefix: v })} />
                </Field>
                <Field label="Name">
                  <TextInput value={item.name} onChange={(v) => patch({ name: v })} />
                </Field>
                <Field label="Link">
                  <TextInput value={item.href} onChange={(v) => patch({ href: v })} />
                </Field>
              </div>
              <Field label="Image">
                <ImageUpload
                  value={item.image}
                  onChange={(v) => patch({ image: v })}
                  folder="aims-ibs/home/programs"
                  variant="inline"
                />
              </Field>
              <Field label="Tags (comma-separated)">
                <TextInput
                  value={(item.tags || []).join(', ')}
                  onChange={(v) =>
                    patch({
                      tags: v
                        .split(',')
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>
              <Field label="Bullet Points">
                <ListEditor
                  items={(item.points || []).map((p) => ({ text: p }))}
                  onChange={(v) => patch({ points: v.map((x) => x.text) })}
                  createItem={() => ({ text: '' })}
                  render={(pt, pPt) => <TextInput value={pt.text} onChange={(v) => pPt({ text: v })} />}
                />
              </Field>
            </div>
          )}
        />
      </div>
    </>
  );
}

function RankedForm({ data, onChange }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Heading (light)">
          <TextInput value={data?.headingLight} onChange={(v) => onChange({ ...data, headingLight: v })} />
        </Field>
        <Field label="Heading (bold)">
          <TextInput value={data?.headingBold} onChange={(v) => onChange({ ...data, headingBold: v })} />
        </Field>
      </div>
      <Field label="Background Image">
        <ImageUpload
          value={data?.bgImage}
          onChange={(v) => onChange({ ...data, bgImage: v })}
          folder="aims-ibs/home"
          variant="landscape"
        />
      </Field>
      <Field label="Rank items">
        <ListEditor
          items={data?.ranks || []}
          onChange={(v) => onChange({ ...data, ranks: v })}
          createItem={() => ({ label: ['', ''], rank: '', logos: [] })}
          render={(item, patch) => (
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Label line 1">
                  <TextInput
                    value={item.label?.[0] || ''}
                    onChange={(v) => patch({ label: [v, item.label?.[1] || ''] })}
                  />
                </Field>
                <Field label="Label line 2">
                  <TextInput
                    value={item.label?.[1] || ''}
                    onChange={(v) => patch({ label: [item.label?.[0] || '', v] })}
                  />
                </Field>
              </div>
              <Field label="Rank value">
                <TextInput value={item.rank} onChange={(v) => patch({ rank: v })} placeholder="50th" />
              </Field>
              <Field label="Logos">
                <ListEditor
                  grid
                  items={item.logos || []}
                  onChange={(v) => patch({ logos: v })}
                  createItem={() => ({ image: { url: '', publicId: '', alt: '' }, w: 100, h: 50 })}
                  render={(logo, pLogo) => (
                    <ImageUpload
                      value={logo.image}
                      onChange={(v) => pLogo({ image: v })}
                      folder="aims-ibs/home/rankings"
                    />
                  )}
                />
              </Field>
            </div>
          )}
        />
      </Field>
    </>
  );
}

function GlobalCollabForm({ data, onChange }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Heading (light)">
          <TextInput value={data?.headingLight} onChange={(v) => onChange({ ...data, headingLight: v })} />
        </Field>
        <Field label="Heading (bold)">
          <TextInput value={data?.headingBold} onChange={(v) => onChange({ ...data, headingBold: v })} />
        </Field>
      </div>
      <Field label="Sub-text">
        <TextArea value={data?.subtext} onChange={(v) => onChange({ ...data, subtext: v })} />
      </Field>
      <Field label="Partner Cards">
        <ListEditor
          items={data?.partners || []}
          onChange={(v) => onChange({ ...data, partners: v })}
          createItem={() => ({
            name: '',
            logo: { url: '', publicId: '', alt: '' },
            bg: { url: '', publicId: '', alt: '' },
          })}
          render={(item, patch) => (
            <div className="space-y-2">
              <Field label="Partner Name">
                <TextInput value={item.name} onChange={(v) => patch({ name: v })} />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Logo">
                  <ImageUpload
                    value={item.logo}
                    onChange={(v) => patch({ logo: v })}
                    folder="aims-ibs/home/partners"
                    variant="inline"
                  />
                </Field>
                <Field label="Card Background">
                  <ImageUpload
                    value={item.bg}
                    onChange={(v) => patch({ bg: v })}
                    folder="aims-ibs/home/partners"
                    variant="landscape"
                  />
                </Field>
              </div>
            </div>
          )}
        />
      </Field>
    </>
  );
}

function GlobalExposureForm({ data, onChange }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Heading (light)">
          <TextInput value={data?.headingLight} onChange={(v) => onChange({ ...data, headingLight: v })} />
        </Field>
        <Field label="Heading (bold)">
          <TextInput value={data?.headingBold} onChange={(v) => onChange({ ...data, headingBold: v })} />
        </Field>
      </div>
      {['col1', 'col2', 'col3'].map((col, ci) => (
        <Field key={col} label={`Column ${ci + 1} photos`}>
          <ListEditor
            grid
            items={data?.[col] || []}
            onChange={(v) => onChange({ ...data, [col]: v })}
            createItem={() => ({ url: '', publicId: '', alt: '' })}
            render={(item, patch) => (
              <ImageUpload value={item} onChange={patch} folder="aims-ibs/home/global-exposure" />
            )}
          />
        </Field>
      ))}
    </>
  );
}

function PlacementsForm({ data, onChange }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Heading (light)">
          <TextInput value={data?.headingLight} onChange={(v) => onChange({ ...data, headingLight: v })} />
        </Field>
        <Field label="Heading (bold)">
          <TextInput value={data?.headingBold} onChange={(v) => onChange({ ...data, headingBold: v })} />
        </Field>
      </div>
      <Field label="Body text">
        <TextArea value={data?.bodyText} onChange={(v) => onChange({ ...data, bodyText: v })} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="CTA Label">
          <TextInput value={data?.ctaLabel} onChange={(v) => onChange({ ...data, ctaLabel: v })} />
        </Field>
        <Field label="CTA Link (PDF)">
          <TextInput value={data?.ctaHref} onChange={(v) => onChange({ ...data, ctaHref: v })} />
        </Field>
      </div>
      <Field label="Stats boxes">
        <ListEditor
          items={data?.stats || []}
          onChange={(v) => onChange({ ...data, stats: v })}
          createItem={() => ({ value: '', unit: '', label: '', highlight: false })}
          render={(item, patch) => (
            <div className="grid gap-2 sm:grid-cols-4">
              <Field label="Value">
                <TextInput value={item.value} onChange={(v) => patch({ value: v })} placeholder="₹14.5" />
              </Field>
              <Field label="Unit">
                <TextInput value={item.unit} onChange={(v) => patch({ unit: v })} placeholder="LPA" />
              </Field>
              <Field label="Label">
                <TextInput value={item.label} onChange={(v) => patch({ label: v })} />
              </Field>
              <Field label="Highlight">
                <div className="flex h-10 items-center">
                  <input
                    type="checkbox"
                    checked={!!item.highlight}
                    onChange={(e) => patch({ highlight: e.target.checked })}
                    className="accent-[#43358F]"
                  />
                </div>
              </Field>
            </div>
          )}
        />
      </Field>
      <Field label="Placement videos" hint="3 per row — name, video and poster on each card">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.videos || []).map((item, i) => {
            const patch = (p) =>
              onChange({
                ...data,
                videos: (data?.videos || []).map((it, idx) => (idx === i ? { ...it, ...p } : it)),
              });
            const move = (dir) => {
              const arr = [...(data?.videos || [])];
              const j = i + dir;
              if (j < 0 || j >= arr.length) return;
              [arr[i], arr[j]] = [arr[j], arr[i]];
              onChange({ ...data, videos: arr });
            };
            const remove = () => onChange({ ...data, videos: (data?.videos || []).filter((_, idx) => idx !== i) });
            return (
              <div key={i} className="flex flex-col gap-2 rounded-xl border border-[#EBEBEB] bg-[#FAFAFC] p-3">
                {/* card header: move + delete */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#999]">Video {i + 1}</span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(-1)}
                      aria-label="Move left"
                      className="grid size-5 place-items-center rounded bg-[#F5F5F5] text-[#999] hover:bg-[#43358F]/10 hover:text-[#43358F]"
                    >
                      <ChevronDown className="size-3 rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(1)}
                      aria-label="Move right"
                      className="grid size-5 place-items-center rounded bg-[#F5F5F5] text-[#999] hover:bg-[#43358F]/10 hover:text-[#43358F]"
                    >
                      <ChevronDown className="size-3 -rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={remove}
                      aria-label="Remove"
                      className="grid size-5 place-items-center rounded bg-[#F5F5F5] text-[#CCC] hover:bg-red-50 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <Field label="Student Name">
                  <TextInput value={item.name} onChange={(v) => patch({ name: v })} placeholder="Student name" />
                </Field>
                <Field label="Video">
                  <VideoUpload
                    value={{ url: item.videoUrl || '' }}
                    onChange={(v) => patch({ videoUrl: v.url || v })}
                    folder="aims-ibs/home/videos"
                  />
                </Field>
                <Field label="Poster">
                  <ImageUpload
                    value={item.poster}
                    onChange={(v) => patch({ poster: v })}
                    folder="aims-ibs/home/videos"
                    variant="landscape"
                  />
                </Field>
              </div>
            );
          })}
          {/* Add card */}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                videos: [
                  ...(data?.videos || []),
                  { name: '', videoUrl: '', poster: { url: '', publicId: '', alt: '' } },
                ],
              })
            }
            className="flex min-h-40 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#DDD] text-[#CCC] transition hover:border-[#43358F]/40 hover:bg-[#F8F7FF] hover:text-[#43358F]"
          >
            <Plus className="size-5" />
            <span className="text-[10px] font-semibold">Add Video</span>
          </button>
        </div>
      </Field>
      <Field label="Company logos — Row 1">
        <ListEditor
          grid
          items={data?.companyLogosRow1 || []}
          onChange={(v) => onChange({ ...data, companyLogosRow1: v })}
          createItem={() => ({ image: { url: '', publicId: '', alt: '' } })}
          render={(item, patch) => (
            <ImageUpload value={item.image} onChange={(v) => patch({ image: v })} folder="aims-ibs/home/logos" />
          )}
        />
      </Field>
      <Field label="Company logos — Row 2">
        <ListEditor
          grid
          items={data?.companyLogosRow2 || []}
          onChange={(v) => onChange({ ...data, companyLogosRow2: v })}
          createItem={() => ({ image: { url: '', publicId: '', alt: '' } })}
          render={(item, patch) => (
            <ImageUpload value={item.image} onChange={(v) => patch({ image: v })} folder="aims-ibs/home/logos" />
          )}
        />
      </Field>
    </>
  );
}

function PlacedStudentsForm({ data, onChange }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Heading (light)">
          <TextInput value={data?.headingLight} onChange={(v) => onChange({ ...data, headingLight: v })} />
        </Field>
        <Field label="Heading (bold)">
          <TextInput value={data?.headingBold} onChange={(v) => onChange({ ...data, headingBold: v })} />
        </Field>
      </div>
      <Field label="Sub-text">
        <TextArea value={data?.subtext} onChange={(v) => onChange({ ...data, subtext: v })} />
      </Field>
      <Field label="Student photos">
        <ListEditor
          items={data?.students || []}
          onChange={(v) => onChange({ ...data, students: v })}
          createItem={() => ({ name: '', company: '', image: { url: '', publicId: '', alt: '' } })}
          render={(item, patch) => (
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Name">
                  <TextInput value={item.name} onChange={(v) => patch({ name: v })} />
                </Field>
                <Field label="Company">
                  <TextInput value={item.company} onChange={(v) => patch({ company: v })} />
                </Field>
              </div>
              <ImageUpload
                value={item.image}
                onChange={(v) => patch({ image: v })}
                folder="aims-ibs/home/placed-students"
                variant="inline"
              />
            </div>
          )}
        />
      </Field>
    </>
  );
}

function WhyChooseForm({ data, onChange }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Heading line 1">
          <TextInput value={data?.headingLine1} onChange={(v) => onChange({ ...data, headingLine1: v })} />
        </Field>
        <Field label="Heading line 2">
          <TextInput value={data?.headingLine2} onChange={(v) => onChange({ ...data, headingLine2: v })} />
        </Field>
        <Field label="Bold word">
          <TextInput value={data?.headingBold} onChange={(v) => onChange({ ...data, headingBold: v })} />
        </Field>
      </div>
      <Field label="Sub-text">
        <TextArea value={data?.subtext} onChange={(v) => onChange({ ...data, subtext: v })} />
      </Field>
      <Field label="Video">
        <VideoUpload
          value={{ url: data?.videoUrl || '' }}
          onChange={(v) => onChange({ ...data, videoUrl: v.url || v })}
          folder="aims-ibs/home/videos"
        />
      </Field>
      <Field label="Video Poster">
        <ImageUpload
          value={data?.videoPoster}
          onChange={(v) => onChange({ ...data, videoPoster: v })}
          folder="aims-ibs/home/videos"
          variant="landscape"
        />
      </Field>
    </>
  );
}

function LifeAtIBSForm({ data, onChange }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Heading (light)">
          <TextInput value={data?.headingLight} onChange={(v) => onChange({ ...data, headingLight: v })} />
        </Field>
        <Field label="Heading (bold)">
          <TextInput value={data?.headingBold} onChange={(v) => onChange({ ...data, headingBold: v })} />
        </Field>
      </div>
      <Field label="Sub-text">
        <TextArea value={data?.subtext} onChange={(v) => onChange({ ...data, subtext: v })} />
      </Field>
      <Field label="Gallery photos" hint="Add at least 10 for a smooth marquee loop">
        <ListEditor
          grid
          items={data?.photos || []}
          onChange={(v) => onChange({ ...data, photos: v })}
          createItem={() => ({ url: '', publicId: '', alt: '' })}
          render={(item, patch) => <ImageUpload value={item} onChange={patch} folder="aims-ibs/home/life-at-ibs" />}
        />
      </Field>
    </>
  );
}

function SparkModelForm({ data, onChange }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Heading (light)">
          <TextInput value={data?.headingLight} onChange={(v) => onChange({ ...data, headingLight: v })} />
        </Field>
        <Field label="Heading (bold)">
          <TextInput value={data?.headingBold} onChange={(v) => onChange({ ...data, headingBold: v })} />
        </Field>
      </div>
      <Field label="Sub-text">
        <TextArea value={data?.subtext} onChange={(v) => onChange({ ...data, subtext: v })} />
      </Field>
      <Field label="SPARK Panels">
        <ListEditor
          items={data?.panels || []}
          onChange={(v) => onChange({ ...data, panels: v })}
          createItem={() => ({ label: '', desc: '', image: { url: '', publicId: '', alt: '' } })}
          render={(item, patch) => (
            <div className="space-y-2">
              <Field label="Title (e.g. Skills)">
                <TextInput value={item.label} onChange={(v) => patch({ label: v })} />
              </Field>
              <Field label="Description">
                <TextArea value={item.desc} onChange={(v) => patch({ desc: v })} rows={2} />
              </Field>
              <Field label="Background Image">
                <ImageUpload
                  value={item.image}
                  onChange={(v) => patch({ image: v })}
                  folder="aims-ibs/home/spark"
                  variant="landscape"
                />
              </Field>
            </div>
          )}
        />
      </Field>
    </>
  );
}

function JoinCtaForm({ data, onChange }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Heading line 1">
          <TextInput value={data?.headingLine1} onChange={(v) => onChange({ ...data, headingLine1: v })} />
        </Field>
        <Field label="Heading (bold)">
          <TextInput value={data?.headingBold} onChange={(v) => onChange({ ...data, headingBold: v })} />
        </Field>
        <Field label="Heading line 2">
          <TextInput value={data?.headingLine2} onChange={(v) => onChange({ ...data, headingLine2: v })} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="CTA Label">
          <TextInput value={data?.ctaLabel} onChange={(v) => onChange({ ...data, ctaLabel: v })} />
        </Field>
        <Field label="CTA Link">
          <TextInput
            value={data?.ctaHref}
            onChange={(v) => onChange({ ...data, ctaHref: v })}
            placeholder="/apply-now"
          />
        </Field>
      </div>
      <Field label="Background Image">
        <ImageUpload
          value={data?.bgImage}
          onChange={(v) => onChange({ ...data, bgImage: v })}
          folder="aims-ibs/home"
          variant="landscape"
        />
      </Field>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main editor
   ═══════════════════════════════════════════════════════════════ */
export default function HomePageEditor() {
  const { getToken } = useAdminAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  // Accordion: only ONE section open at a time (id of open section, else null)
  const [openSection, setOpenSection] = useState('hero');

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  }, []);

  /* ── Fetch on mount ──────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/pages/home', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const json = await res.json();
        if (json.success) setData(json.data);
        else showToast('Failed to load page data', 'error');
      } catch {
        showToast('Could not connect to server', 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Section change ──────────────────────────────────────── */
  const updateSection = useCallback((section, value) => {
    setData((prev) => ({ ...prev, [section]: value }));
  }, []);

  /* ── Per-section save (PATCH) ────────────────────────────── */
  const saveSection = useCallback(
    async (section, sectionData) => {
      try {
        const res = await fetch('/api/admin/pages/home', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ section, data: sectionData }),
        });
        const json = await res.json();
        if (json.success) {
          showToast(`"${section}" saved ✅`);
          return true;
        }
        showToast(json.message || 'Save failed', 'error');
        return false;
      } catch {
        showToast('Network error', 'error');
        return false;
      }
    },
    [getToken, showToast],
  );

  /* ── Publish toggle ──────────────────────────────────────── */
  const togglePublish = async () => {
    setPublishing(true);
    try {
      const newState = !data.isPublished;
      const res = await fetch('/api/admin/pages/home', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ section: 'isPublished', data: newState }),
      });
      const json = await res.json();
      if (json.success) {
        setData((prev) => ({ ...prev, isPublished: newState }));
        showToast(newState ? '🚀 Page is now live!' : '📦 Page unpublished');
      } else {
        showToast(json.message || 'Failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-[#999]">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load home page data. Check your database connection.
      </div>
    );
  }

  /* ── Section definitions ─────────────────────────────────── */
  const SECTIONS = [
    { id: 'hero', key: 'hero', icon: '🎬', title: 'Hero Section', Form: HeroForm },
    { id: 'stats', key: 'stats', icon: '📊', title: 'Stats Bar', Form: StatsForm },
    { id: 'programs', key: 'programs', icon: '🎓', title: 'Programs Section', Form: ProgramsForm },
    { id: 'ranked', key: 'ranked', icon: '🏆', title: 'Ranked Section', Form: RankedForm },
    {
      id: 'globalCollaborations',
      key: 'globalCollaborations',
      icon: '🌍',
      title: 'Global Collaborations',
      Form: GlobalCollabForm,
    },
    {
      id: 'globalExposure',
      key: 'globalExposure',
      icon: '✈️',
      title: 'Global Exposure Photos',
      Form: GlobalExposureForm,
    },
    { id: 'placements', key: 'placements', icon: '💼', title: 'Placements Section', Form: PlacementsForm },
    {
      id: 'placedStudents',
      key: 'placedStudents',
      icon: '🎯',
      title: 'Placed Students Photos',
      Form: PlacedStudentsForm,
    },
    { id: 'whyChoose', key: 'whyChoose', icon: '✅', title: 'Why Choose AIMS IBS', Form: WhyChooseForm },
    { id: 'lifeAtIBS', key: 'lifeAtIBS', icon: '📸', title: 'Life at IBS Gallery', Form: LifeAtIBSForm },
    { id: 'sparkModel', key: 'sparkModel', icon: '✨', title: 'SPARK Model', Form: SparkModelForm },
    { id: 'joinCta', key: 'joinCta', icon: '🚀', title: 'Join CTA Section', Form: JoinCtaForm },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-4 pb-20">
      <TopBar isPublished={!!data.isPublished} onPublish={togglePublish} publishing={publishing} />

      {SECTIONS.map(({ id, key, icon, title, Form }) => (
        <Section
          key={key}
          id={id}
          title={title}
          icon={icon}
          sectionKey={key}
          sectionData={data[key] ?? (key === 'stats' ? [] : {})}
          onSave={saveSection}
          open={openSection === key}
          onToggle={() =>
            setOpenSection((prev) => {
              if (prev === key) return null;
              // Scroll the newly-opened section into view just under the sticky bars
              requestAnimationFrame(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              });
              return key;
            })
          }
        >
          <Form data={data[key] ?? (key === 'stats' ? [] : {})} onChange={(v) => updateSection(key, v)} />
        </Section>
      ))}

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}
