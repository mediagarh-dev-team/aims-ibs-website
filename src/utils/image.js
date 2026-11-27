/**
 * image.js — Frontend-safe image helpers
 *
 * getOptimizedImage(src, opts) :
 *   - Cloudinary URLs  → auto format + auto quality + optional width/height
 *   - Local /public paths → prefixed with IMG_PATH (same as before)
 *
 * This function NEVER touches server-only env vars — the Cloudinary
 * cloud name is already embedded in the URL itself, so it works
 * identically on the server and in the browser.
 */

const IMG_PATH = process.env.IMG_PATH || '/';

/**
 * Returns an optimised image src for <Image> / <img> / background-image.
 *
 * @param {string} src    - Cloudinary secure_url, absolute http(s) URL, or local path
 * @param {object} [opts]
 * @param {number} [opts.width]   - target width (Cloudinary c_fill resize)
 * @param {number} [opts.height] - target height (Cloudinary c_fill resize)
 * @param {string} [opts.quality] - "auto" (default) or 1-100
 * @returns {string}
 */
export function getOptimizedImage(src, opts = {}) {
  if (!src) return '';

  // Absolute URL — Cloudinary or any other CDN
  if (src.startsWith('http')) {
    // Cloudinary delivery URL:
    //   https://res.cloudinary.com/<cloud>/image/upload/<version>/<id>.<ext>
    if (src.includes('res.cloudinary.com')) {
      return insertCloudinaryTransforms(src, opts);
    }
    return src; // other absolute URLs — pass through untouched
  }

  // Local path under /public (keep legacy IMG_PATH prefixing)
  const withSlash = src.startsWith('/') ? src : `/${src}`;
  return IMG_PATH + withSlash.replace(/^\//, '');
}

/**
 * Same as getOptimizedImage but for video files (mp4 etc.)
 * Cloudinary video URLs get f_auto/q_auto; local paths get IMG_PATH.
 */
export function getOptimizedVideo(src) {
  if (!src) return '';
  if (src.startsWith('http')) {
    if (src.includes('res.cloudinary.com')) {
      // /video/upload/ → /video/upload/f_auto,q_auto/
      return src.replace('/video/upload/', '/video/upload/f_auto,q_auto/');
    }
    return src;
  }
  return IMG_PATH + (src.startsWith('/') ? src.slice(1) : src);
}

/* ── internal ─────────────────────────────────────────────────── */

function insertCloudinaryTransforms(url, { width, height, quality = 'auto' } = {}) {
  const parts = ['/f_auto', `/q_${quality}`];

  if (width || height) {
    const size = [`c_fill`, `g_auto`];
    if (width) size.push(`w_${width}`);
    if (height) size.push(`h_${height}`);
    parts.unshift(size.join(','));
  }

  // Insert after "/image/upload"
  const marker = '/image/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const before = url.slice(0, idx + marker.length);
  const after = url.slice(idx + marker.length);

  // If the next path segment looks like a transformation (contains a comma
  // or matches t_ / w_ / c_ etc.) keep it — we prepend ours.
  const transformChain = parts.join('/');

  return `${before}${transformChain}/${after}`;
}
