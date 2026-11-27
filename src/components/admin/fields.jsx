'use client';

/**
 * fields.jsx — Shared form primitives for the CMS admin pages
 */

import { useRef, useState } from 'react';
import { UploadCloud, X, ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useAdminAuth } from './AdminAuthProvider';

/* ── Label wrapper (div, NOT label — prevents click conflicts) ── */
export function Field({ label, hint, children }) {
  return (
    <div className="block">
      {label && (
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#555]">{label}</span>
      )}
      {children}
      {hint && <span className="mt-1 block text-[11px] text-[#999]">{hint}</span>}
    </div>
  );
}

/* ── Text input ─────────────────────────────────────────────── */
export function TextInput({ value = '', onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#111] outline-none transition focus:border-[#43358F] focus:ring-2 focus:ring-[#43358F]/15"
    />
  );
}

/* ── Textarea ───────────────────────────────────────────────── */
export function TextArea({ value = '', onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full resize-y rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-[#111] outline-none transition focus:border-[#43358F] focus:ring-2 focus:ring-[#43358F]/15"
    />
  );
}

/* ── Toggle ─────────────────────────────────────────────────── */
export function Toggle({ checked = false, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-2.5">
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-[#43358F]' : 'bg-[#DDD]'}`}
      >
        <span
          className={`absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`}
        />
      </span>
      {label && <span className="text-sm text-[#333]">{label}</span>}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ImageUpload
   ───────────────────────────────────────────────────────────────
   variant:
     "square"    — 1:1 square, fills grid cell  (default, used in grid lists)
     "landscape" — wide 16:9 strip, 120px tall  (bg images, posters, ranked bg)
     "inline"    — small fixed box 112×72px placed LEFT of alt text
                   (program card images, partner logos, single images in forms)
   ═══════════════════════════════════════════════════════════════ */
export function ImageUpload({ value, onChange, folder = 'aims-ibs', variant = 'square' }) {
  const { getToken } = useAdminAuth();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  /* ── upload fn ── */
  const upload = async (file) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files accepted.');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      if (value?.publicId) fd.append('oldPublicId', value.publicId);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Upload failed');
      onChange({ url: json.data.secure_url, publicId: json.data.public_id, alt: value?.alt || '' });
    } catch (err) {
      setError(err.message || 'Upload failed — check Cloudinary env vars');
    } finally {
      setUploading(false);
    }
  };

  const openPicker = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    inputRef.current?.click();
  };
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  };
  const displayName = value?.url ? value.url.split('/').pop().split('?')[0] : null;

  /* ── Box size classes ── */
  const boxCls =
    {
      square: 'aspect-square w-full', // fills grid cell — no fixed dimension
      landscape: 'w-full h-[110px]', // full-width horizontal strip
      inline: 'w-28 h-[72px] shrink-0', // small fixed box
    }[variant] ?? 'aspect-square w-full';

  /* ── Outer wrapper ── */
  const isInline = variant === 'inline';

  return (
    <div className={isInline ? 'flex items-start gap-3' : 'flex flex-col gap-1'}>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        tabIndex={-1}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (f) upload(f);
        }}
      />

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={value?.url ? 'Replace image' : 'Upload image'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') openPicker(e);
        }}
        onClick={openPicker}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={[
          'group relative shrink-0 cursor-pointer select-none overflow-hidden rounded-lg border-2 transition',
          boxCls,
          value?.url
            ? 'border-[#43358F]/20'
            : 'border-dashed border-[#DDD] bg-[#FAFAFA] hover:border-[#43358F]/40 hover:bg-[#F8F7FF]',
        ].join(' ')}
      >
        {value?.url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.url}
              alt={value.alt || 'preview'}
              className="h-full w-full object-cover"
              draggable={false}
            />
            {/* Replace hover overlay */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
              <UploadCloud className="size-4 text-white" />
              <span className="text-[9px] font-semibold text-white">Replace</span>
            </div>
            {/* Remove × */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange({ url: '', publicId: '', alt: '' });
              }}
              className="absolute right-1 top-1 z-10 grid size-5 place-items-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100 hover:!bg-red-600"
              aria-label="Remove image"
            >
              <X className="size-2.5" />
            </button>
          </>
        ) : (
          <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-0.5 p-1 text-[#BBBBBB]">
            {uploading ? (
              <div className="size-4 animate-spin rounded-full border-2 border-[#43358F] border-t-transparent" />
            ) : (
              <UploadCloud className="size-4" />
            )}
            <span className="text-center text-[9px] leading-tight">{uploading ? '…' : 'Click / drop'}</span>
          </div>
        )}
      </div>

      {/* Meta: filename + alt text */}
      <div className="min-w-0 flex-1 flex flex-col gap-1">
        {displayName && (
          <p className="truncate text-[10px] text-[#999]" title={value?.url}>
            {displayName}
          </p>
        )}
        {value?.url && (
          <input
            value={value.alt || ''}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onFocus={(e) => e.stopPropagation()}
            placeholder="Alt text (SEO)"
            className="w-full rounded-md border border-[#E0E0E0] px-2 py-1 text-[11px] outline-none focus:border-[#43358F]"
          />
        )}
        {value?.url && !value.alt && <p className="text-[10px] text-amber-500">Add alt text</p>}
        {error && <p className="text-[10px] text-red-500">{error}</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ListEditor
   ───────────────────────────────────────────────────────────────
   grid=false (default) — stacked vertical list, good for complex items
   grid=true            — 3-col CSS grid, ideal for image-only lists
   ═══════════════════════════════════════════════════════════════ */
export function ListEditor({ items = [], onChange, createItem, render, grid = false, addLabel = 'Add item' }) {
  const move = (i, dir) => {
    const arr = [...items];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const patch = (i, p) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...p } : it)));

  if (grid) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-1">
            {render(item, (p) => patch(i, p), i)}
            {/* move + delete row */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex gap-0.5">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="grid size-5 place-items-center rounded bg-[#F5F5F5] text-[#999] hover:bg-[#43358F]/10 hover:text-[#43358F]"
                  aria-label="Move left"
                >
                  <ChevronUp className="size-3 -rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  className="grid size-5 place-items-center rounded bg-[#F5F5F5] text-[#999] hover:bg-[#43358F]/10 hover:text-[#43358F]"
                  aria-label="Move right"
                >
                  <ChevronDown className="size-3 -rotate-90" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="grid size-5 place-items-center rounded bg-[#F5F5F5] text-[#CCC] hover:bg-red-50 hover:text-red-500"
                aria-label="Remove"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          </div>
        ))}
        {/* Add cell */}
        <button
          type="button"
          onClick={() => onChange([...items, createItem()])}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#DDD] text-[#CCC] transition hover:border-[#43358F]/40 hover:bg-[#F8F7FF] hover:text-[#43358F]"
        >
          <Plus className="size-5" />
          <span className="text-[10px] font-semibold">Add</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="relative rounded-xl border border-[#EBEBEB] bg-[#FAFAFC] p-3 pl-10">
          <div className="absolute left-2 top-2 flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => move(i, -1)}
              className="grid size-5 place-items-center rounded text-[#999] hover:bg-[#EEE] hover:text-[#43358F]"
              aria-label="Move up"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              className="grid size-5 place-items-center rounded text-[#999] hover:bg-[#EEE] hover:text-[#43358F]"
              aria-label="Move down"
            >
              <ChevronDown className="size-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute right-2 top-2 grid size-6 place-items-center rounded-lg text-[#CCC] hover:bg-red-50 hover:text-red-500"
            aria-label="Remove item"
          >
            <Trash2 className="size-3.5" />
          </button>
          {render(item, (p) => patch(i, p), i)}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, createItem()])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#CCC] px-3.5 py-2 text-xs font-semibold text-[#666] transition hover:border-[#43358F] hover:bg-[#F8F7FF] hover:text-[#43358F]"
      >
        <Plus className="size-3.5" /> {addLabel}
      </button>
    </div>
  );
}

/* ── Section card wrapper ───────────────────────────────────── */
export function SectionCard({ id, title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} className="overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 border-b border-[#F5F5F5] px-4 py-3.5 text-left transition hover:bg-[#FAFAFC]"
      >
        <span className="flex items-center gap-3">
          {icon && (
            <span className="grid size-8 place-items-center rounded-lg bg-[#43358F]/8 text-[#43358F]">{icon}</span>
          )}
          <span className="text-sm font-bold text-[#090909]">{title}</span>
        </span>
        <ChevronDown className={`size-4 shrink-0 text-[#999] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="space-y-4 p-4">{children}</div>}
    </section>
  );
}

/* ── Video upload → /public/videos ─────────────────────────── */
export function VideoUpload({ value, onChange }) {
  const { getToken } = useAdminAuth();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const upload = async (file) => {
    setError('');
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('resourceType', 'video');
      const cur = typeof value === 'string' ? value : value?.url || '';
      if (cur.startsWith('/videos/')) fd.append('oldPath', cur);

      const json = await new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/admin/upload-local');
        xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try {
            const j = JSON.parse(xhr.responseText);
            xhr.status < 300 && j.success ? res(j) : rej(new Error(j.message || `${xhr.status}`));
          } catch {
            rej(new Error(`${xhr.status}`));
          }
        };
        xhr.onerror = () => rej(new Error('Network error'));
        xhr.send(fd);
      });
      onChange({ url: json.data.url, publicId: '', alt: '' });
      setProgress(0);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const cur = typeof value === 'string' ? value : value?.url || '';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <input
          value={cur}
          onChange={(e) =>
            onChange(typeof value === 'string' ? e.target.value : { ...(value || {}), url: e.target.value })
          }
          placeholder="/videos/your-video.mp4 — or click Upload"
          className="flex-1 rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#43358F]"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#43358F] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#392b77] disabled:opacity-60"
        >
          <UploadCloud className="size-3.5" />
          {uploading ? `${progress}%` : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            upload(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {uploading && (
        <div className="h-1 overflow-hidden rounded-full bg-[#EEE]">
          <div className="h-full rounded-full bg-[#43358F] transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <p className="text-[10px] text-[#999]">
        Saved to <code className="rounded bg-[#F5F5FA] px-1">public/videos/</code>
      </p>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

/* ── PDF upload → /public/pdfs ──────────────────────────────── */
export function PdfUpload({ value, onChange }) {
  const { getToken } = useAdminAuth();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const upload = async (file) => {
    setError('');
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('resourceType', 'pdf');
      const cur = typeof value === 'string' ? value : value?.url || '';
      if (cur.startsWith('/pdfs/')) fd.append('oldPath', cur);

      const json = await new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/admin/upload-local');
        xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try {
            const j = JSON.parse(xhr.responseText);
            xhr.status < 300 && j.success ? res(j) : rej(new Error(j.message || `${xhr.status}`));
          } catch {
            rej(new Error(`${xhr.status}`));
          }
        };
        xhr.onerror = () => rej(new Error('Network error'));
        xhr.send(fd);
      });
      onChange({ url: json.data.url, publicId: '', alt: '' });
      setProgress(0);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const cur = typeof value === 'string' ? value : value?.url || '';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <input
          value={cur}
          onChange={(e) =>
            onChange(typeof value === 'string' ? e.target.value : { ...(value || {}), url: e.target.value })
          }
          placeholder="/pdfs/document.pdf — or click Upload"
          className="flex-1 rounded-lg border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#43358F]"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#43358F] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#392b77] disabled:opacity-60"
        >
          <UploadCloud className="size-3.5" />
          {uploading ? `${progress}%` : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            upload(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {uploading && (
        <div className="h-1 overflow-hidden rounded-full bg-[#EEE]">
          <div className="h-full rounded-full bg-[#43358F] transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      <p className="text-[10px] text-[#999]">
        Saved to <code className="rounded bg-[#F5F5FA] px-1">public/pdfs/</code>
      </p>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
