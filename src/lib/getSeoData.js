/**
 * getSeoData.js
 *
 * Server-side helper that fetches SEO metadata for any page by its slug.
 * Returns a fully-formed Next.js `metadata` object.
 *
 * Usage in page.js (server component):
 *   export async function generateMetadata() {
 *     return getSeoData('home');
 *   }
 *
 * Falls back to sensible defaults when:
 *   - The database has no document for the slug, or
 *   - The title/description/image fields are empty.
 *
 * Uses fetch() with { next: { revalidate: 3600 } } so it benefits from
 * Next.js ISR caching and does NOT block every request.
 */

import { generateSEO } from '@/_helper/seo';

/** Default fallbacks keyed by page slug */
const DEFAULTS = {
  home: {
    title: 'MBA & PGDM in Bangalore | AIMS IBS Business School',
    description:
      'AIMS IBS is a top-ranked business school in Bangalore offering MBA, PGDM and executive management programs with global collaborations and 100% placement support.',
    keywords: 'MBA Bangalore, PGDM Bangalore, business school Bangalore, AIMS IBS, management college',
    image: '/images/home/life-at-ibs-img-21.webp',
    path: '/',
  },
  'accreditations-affiliations': {
    title: 'Accreditations & Affiliations | AIMS IBS',
    description: 'AIMS IBS is accredited by leading national and international bodies ensuring quality education.',
    path: '/accreditations-affiliations',
  },
  'admission-process': {
    title: 'Admission Process | AIMS IBS',
    description: 'Simple and transparent admission process at AIMS IBS. Apply today for MBA, PGDM or UG programs.',
    path: '/admission-process',
  },
  'aims-ibs-family': {
    title: 'AIMS IBS Family | Our Community',
    description: 'Join the thriving AIMS IBS family of students, alumni and faculty.',
    path: '/aims-ibs-family',
  },
  'downloads-resources': {
    title: 'Downloads & Resources | AIMS IBS',
    description: 'Download brochures, handbooks and other resources from AIMS IBS.',
    path: '/downloads-resources',
  },
  'education-loan-support': {
    title: 'Education Loan Support | AIMS IBS',
    description: 'AIMS IBS helps students secure education loans through its banking partners.',
    path: '/education-loan-support',
  },
  'experience-aims-ibs': {
    title: 'Experience AIMS IBS | Campus Life',
    description: 'Discover the AIMS IBS campus experience — events, activities, and student life.',
    path: '/experience-aims-ibs',
  },
  faq: {
    title: 'FAQ | AIMS IBS Business School',
    description: 'Find answers to frequently asked questions about AIMS IBS programs and admissions.',
    path: '/faq',
  },
  'industry-knowledge-partners': {
    title: 'Industry Knowledge Partners | AIMS IBS',
    description: 'AIMS IBS collaborates with leading industry partners to deliver relevant business education.',
    path: '/industry-knowledge-partners',
  },
  'industry-relevant-certifications': {
    title: 'Industry Relevant Certifications | AIMS IBS',
    description: 'Students at AIMS IBS earn 15+ industry certifications alongside their degree.',
    path: '/industry-relevant-certifications',
  },
  'loa-eoa': {
    title: 'LOA & EOA | AIMS IBS',
    description: 'Letter of Approval and Extension of Approval details for AIMS IBS programs.',
    path: '/loa-eoa',
  },
  'mba-induction-program': {
    title: 'MBA Induction Program | AIMS IBS',
    description: 'The AIMS IBS MBA induction program prepares students for a transformative learning journey.',
    path: '/mba-induction-program',
  },
  'our-360-degree-training-approach': {
    title: '360 Degree Training | AIMS IBS',
    description: 'The AIMS IBS SPARK model delivers a holistic 360-degree training approach.',
    path: '/our-360-degree-training-approach',
  },
  'placement-statistics': {
    title: 'Placement Statistics | AIMS IBS',
    description: 'AIMS IBS delivers consistent placements with top companies. View our placement statistics.',
    path: '/placement-statistics',
  },
  'privacy-policy': {
    title: 'Privacy Policy | AIMS IBS',
    description: 'Read the AIMS IBS privacy policy.',
    path: '/privacy-policy',
    index: false,
  },
  'proud-batches': {
    title: 'Proud Batches | AIMS IBS Alumni',
    description: 'Celebrating AIMS IBS batches and their outstanding achievements.',
    path: '/proud-batches',
  },
  'rankings-credentials-our-strenghts': {
    title: 'Rankings & Credentials | AIMS IBS',
    description: 'AIMS IBS is ranked among the best business schools in India. See our credentials.',
    path: '/rankings-credentials-our-strenghts',
  },
  'refund-policy': {
    title: 'Refund Policy | AIMS IBS',
    description: 'Read the AIMS IBS refund policy.',
    path: '/refund-policy',
    index: false,
  },
  'share-your-feedback': {
    title: 'Share Your Feedback | AIMS IBS',
    description: 'Share your feedback about your experience at AIMS IBS.',
    path: '/share-your-feedback',
  },
  'value-added-programs-pedagogy': {
    title: 'Value-Added Programs & Pedagogy | AIMS IBS',
    description: 'AIMS IBS offers innovative pedagogy and value-added programs for holistic development.',
    path: '/value-added-programs-pedagogy',
  },
  'vision-mission': {
    title: 'Vision & Mission | AIMS IBS',
    description: 'The vision and mission of AIMS IBS Business School in Bangalore.',
    path: '/vision-mission',
  },
};

const DEFAULT_IMAGE = '/images/home/life-at-ibs-img-21.webp';
const SITE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  return raw.startsWith('http') ? raw.replace(/\/$/, '') : 'https://www.aimsibs.com';
})();

/**
 * Fetch SEO data for a page from the DB, with fallback to static defaults.
 *
 * @param {string} slug - page slug, e.g. "home"
 * @returns {Promise<import('next').Metadata>}
 */
export async function getSeoData(slug) {
  const def = DEFAULTS[slug] ?? { title: 'AIMS IBS', description: '', path: `/${slug}` };

  try {
    // Use absolute URL — required for fetch inside server components / generateMetadata
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.startsWith('http')
        ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
        : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/seo/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 }, // ISR — revalidate every hour
      headers: { 'x-internal': '1' },
    });

    if (res.ok) {
      const json = await res.json();
      const d = json?.data ?? {};

      return generateSEO({
        title: d.title || def.title,
        description: d.description || def.description,
        keywords: d.keywords || def.keywords || '',
        image: d.ogImage?.url || def.image || DEFAULT_IMAGE,
        path: d.canonicalPath || def.path || `/${slug}`,
        index: typeof d.index === 'boolean' ? d.index : def.index ?? true,
      });
    }
  } catch {
    // DB or network error — fall through to default
  }

  // Static fallback — no DB hit required
  return generateSEO({
    title: def.title,
    description: def.description,
    keywords: def.keywords || '',
    image: def.image || DEFAULT_IMAGE,
    path: def.path || `/${slug}`,
    index: def.index ?? true,
  });
}
