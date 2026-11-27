/**
 * cloudinary.js
 *
 * Server-side Cloudinary helpers.
 * - getCloudinaryUrl()   — build an optimised URL from a public_id
 * - uploadToCloudinary() — upload a Buffer/base64 string to Cloudinary
 * - deleteFromCloudinary() — delete an asset by public_id
 *
 * Credentials are read from environment variables at call time so the
 * module can be imported in both API routes and server components without
 * being bundled into the client.
 *
 * Required .env.local variables:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

/**
 * Build a Cloudinary delivery URL with auto format + quality optimisation.
 *
 * @param {string}  publicId   - Cloudinary asset public_id
 * @param {object}  [opts]
 * @param {number}  [opts.width]   - resize width (px)
 * @param {number}  [opts.height]  - resize height (px)
 * @param {string}  [opts.crop]    - Cloudinary crop mode (default: "fill")
 * @param {string}  [opts.gravity] - gravity for crop (default: "auto")
 * @param {number}  [opts.quality] - quality 1-100 or "auto" (default: "auto")
 * @param {string}  [opts.format]  - output format (default: "auto")
 * @returns {string} Full CDN URL
 */
export function getCloudinaryUrl(publicId, opts = {}) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloud || !publicId) return '';

  const {
    width,
    height,
    crop = 'fill',
    gravity = 'auto',
    quality = 'auto',
    format = 'auto',
  } = opts;

  const transforms = [`f_${format}`, `q_${quality}`];

  if (width || height) {
    transforms.unshift(
      [
        `c_${crop}`,
        gravity ? `g_${gravity}` : '',
        width ? `w_${width}` : '',
        height ? `h_${height}` : '',
      ]
        .filter(Boolean)
        .join(',')
    );
  }

  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms.join('/')}/${publicId}`;
}

/**
 * Upload a file to Cloudinary via the unsigned/signed upload API.
 *
 * @param {string} fileData  - base64 data URI (data:image/...) or remote URL
 * @param {object} [opts]
 * @param {string} [opts.folder]      - destination folder in Cloudinary
 * @param {string} [opts.publicId]    - override public_id
 * @param {string} [opts.resourceType] - "image" | "video" | "raw" (default: "image")
 * @returns {Promise<{ secure_url: string; public_id: string }>}
 */
export async function uploadToCloudinary(fileData, opts = {}) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not set in environment variables.');
  }

  const { folder = 'aims-ibs', publicId, resourceType = 'image' } = opts;

  const timestamp = Math.round(Date.now() / 1000);

  // Build signature params
  const paramsToSign = {
    timestamp,
    folder,
    ...(publicId ? { public_id: publicId } : {}),
  };

  // Compute HMAC-SHA1 signature using the Web Crypto API (Edge-safe)
  const signature = await _signCloudinary(paramsToSign, CLOUDINARY_API_SECRET);

  const formData = new FormData();
  formData.append('file', fileData);
  formData.append('timestamp', String(timestamp));
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append('signature', signature);
  formData.append('folder', folder);
  if (publicId) formData.append('public_id', publicId);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
  const res = await fetch(endpoint, { method: 'POST', body: formData });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Cloudinary upload failed (${res.status})`);
  }

  const data = await res.json();
  return { secure_url: data.secure_url, public_id: data.public_id };
}

/**
 * Delete a Cloudinary asset by public_id.
 *
 * @param {string} publicId
 * @param {string} [resourceType] - "image" | "video" | "raw" (default: "image")
 * @returns {Promise<void>}
 */
export async function deleteFromCloudinary(publicId, resourceType = 'image') {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!publicId || !CLOUDINARY_CLOUD_NAME) return;

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { public_id: publicId, timestamp };
  const signature = await _signCloudinary(paramsToSign, CLOUDINARY_API_SECRET);

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('timestamp', String(timestamp));
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append('signature', signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/destroy`;
  await fetch(endpoint, { method: 'POST', body: formData });
}

/* ── Internal: SHA-1 signature for Cloudinary (Edge-compatible) ── */
async function _signCloudinary(params, apiSecret) {
  // Sort params alphabetically, build "key=value&key=value" string
  const sortedString = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');

  // Cloudinary signature = SHA1(sortedParamsString + apiSecret)
  const message = sortedString + apiSecret;

  const msgData = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
