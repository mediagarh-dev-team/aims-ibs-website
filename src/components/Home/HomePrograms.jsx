import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { getOptimizedImage } from '@/utils/image';

/* ── Static defaults (used when no CMS data is published) ─────── */
const DEFAULT_MASTERS = {
  image: { url: 'images/home/course-img-1.webp', alt: 'MBA + PGPM' },
  href: '/programs/pg/mba-pgpm',
  meta: [
    { label: 'Duration', value: '2 Years' },
    { label: 'Certification', value: '15 Additional Certifications' },
    { label: 'Domains', value: '6 Specialisations' },
  ],
  points: ['Dual MBA', 'Industry-Integrated Curriculum', 'Placement-Focused Training'],
  specialisations: [
    { label: 'Business Analytics', href: '/programs/pg/business-analytics' },
    { label: 'Marketing', href: '/programs/pg/marketing' },
    { label: 'Finance', href: '/programs/pg/finance' },
    { label: 'Human Resources', href: '/programs/pg/human-resources' },
    { label: 'Logistics & Supply Chain', href: '/programs/pg/logistics-supply-chain' },
    { label: 'Healthcare Management', href: '/programs/pg/healthcare-management' },
  ],
};

const DEFAULT_BACHELORS = [
  {
    prefix: 'Bachelor of',
    name: 'Business Administration (BBA)',
    image: { url: 'images/home/course-img-2.webp', alt: 'BBA' },
    href: '/programs/ug/bba',
    tags: ['3 Years', '6 Specialisations', '8 Certifications'],
    points: ['Personality & Career Readiness', 'UGC Recognised Degree', 'AI & Digital Marketing Enabled'],
    affiliatedTo: 'Bangalore University',
  },
  {
    prefix: 'Bachelor of',
    name: 'Computer Applications (BCA)',
    image: { url: 'images/home/course-img-3.webp', alt: 'BCA' },
    href: '/programs/ug/bca',
    tags: ['3 Years', '3 Specialisations', '9 Certifications'],
    points: [
      'UGC-Recognised BCA Degree',
      'Hands-On Coding & Project-Based Learning',
      'Technical Certifications Included',
    ],
    affiliatedTo: 'Bangalore University',
  },
  {
    prefix: 'Bachelor of',
    name: 'Commerce (B.Com)',
    image: { url: 'images/home/course-img-4.webp', alt: 'B.Com' },
    href: '/programs/ug/bcom',
    tags: ['3 Years', '5 Specialisations', '7 Certifications'],
    points: ['UGC-Recognized B.Com Degree', 'End-To-End Placement Support', 'Practical Exposure'],
    affiliatedTo: 'Bangalore University',
  },
];

/* ── Shared UI atoms ─────────────────────────────────────────── */
function SectionTag({ children }) {
  return (
    <span className="inline-block bg-brand-violet px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-white sm:text-[16px]">
      {children}
    </span>
  );
}

function BulletList({ items, className = '' }) {
  return (
    <ul className={`2xl:space-y-2 space-y-1 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start 2xl:gap-2.5 gap-2">
          <span className="mt-[0.5em] size-1 shrink-0 rounded-full bg-brand-orange" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export default function HomePrograms({ cmsData }) {
  const sectionRef = useRef(null);
  const bachelorRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [startY, setStartY] = useState(null);

  // Merge CMS data with defaults
  const masters = cmsData?.masters ? { ...DEFAULT_MASTERS, ...cmsData.masters } : DEFAULT_MASTERS;
  const bachelors = cmsData?.bachelors?.length ? cmsData.bachelors : DEFAULT_BACHELORS;
  const sectionTitle = cmsData?.sectionTitle ?? 'Explore Programs';

  // Helper to get image src from either CMS image object or legacy string path
  const imgSrc = (imgField, fallback) => {
    if (!imgField) return getOptimizedImage(fallback);
    if (typeof imgField === 'string') return getOptimizedImage(imgField);
    return getOptimizedImage(imgField.url || fallback);
  };

  // Animate background blue panel
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -30% 0px', threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const block = bachelorRef.current;
    if (!section || !block) return;
    const measure = () => {
      const top = block.getBoundingClientRect().top - section.getBoundingClientRect().top;
      setStartY(Math.max(0, Math.round(top - 32)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    return () => ro.disconnect();
  }, []);

  const clipPath = inView
    ? 'inset(0px 0px 0px 0px)'
    : startY === null
      ? 'inset(58% 0px 0px 0px)'
      : `inset(${startY}px 0px 0px 0px)`;

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-white pb-16 pt-12 lg:pb-20 lg:pt-20">
      {/* Blue background */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 bg-[#3F2E8F] bg-[url('/images/home/course-bg-image.webp')] bg-cover bg-top will-change-[clip-path] ${
          inView ? 'transition-[clip-path] duration-[1400ms] ease-out motion-reduce:transition-none' : ''
        }`}
        style={{ clipPath }}
      />

      <div className="custom-container">
        <h2 className="text-3xl font-light text-white sm:text-4xl lg:text-[48px]">
          Explore <span className="font-semibold italic">Programs</span>
        </h2>

        {/* Master's */}
        <div className="mt-8 lg:mt-12">
          <SectionTag>Master&apos;s</SectionTag>

          <div className="group relative mt-[24px] flex flex-col overflow-hidden bg-white p-1.5 shadow-xl shadow-black/10 lg:min-h-[420px] lg:flex-row">
            {/* Image */}
            <div className="relative aspect-[4/3] w-full shrink-0 lg:aspect-auto 2xl:w-[538px] lg:w-[400px]">
              <Image
                src={imgSrc(masters.image, 'images/home/course-img-1.webp')}
                alt={masters.image?.alt || 'MBA + PGPM'}
                fill
                sizes="(min-width: 1024px) 530px, 100vw"
                className="object-cover"
                quality={90}
              />
              <Link
                href={masters.href || '/programs/pg/mba-pgpm'}
                className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 bg-brand-orange px-5 py-2.5 font-general-sans text-xs font-medium text-white transition-colors hover:bg-[#d63f14]"
              >
                Know More <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Content */}
            <div className="relative flex-1 overflow-hidden">
              <div className="pointer-events-none absolute bottom-0 right-0 z-0 w-[150px] sm:w-[220px] lg:w-[300px]">
                <Image
                  src={getOptimizedImage('images/home/cube-shap-2.webp')}
                  alt=""
                  aria-hidden="true"
                  width={300}
                  height={280}
                  className="h-auto w-full"
                />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-center p-5 sm:p-8 lg:px-10 lg:py-8">
                <div className="lg:transition-transform lg:duration-500 lg:ease-out lg:group-focus-within:-translate-y-[24px] lg:group-hover:-translate-y-[74px]">
                  <h3 className="text-xl leading-snug sm:text-2xl lg:text-[22px] 2xl:text-[24px]">
                    <span className="font-semibold">Master of Business Administration</span> (MBA) + Postgraduate
                    Program in Management (PGPM)
                  </h3>

                  <div className="2xl:mt-6 lg:mt-4 mt-6 flex flex-wrap gap-y-4">
                    {masters.meta?.map((item, i) => (
                      <div
                        key={i}
                        className={`2xl:pr-5 lg:pr-3 pr-2 ${i > 0 ? 'border-l border-black/15 2xl:pl-5 lg:pl-2 pl-4' : ''}`}
                      >
                        <p className="text-xs text-black/60 sm:text-[12px]">{item.label}</p>
                        <p className="mt-1 text-xs font-semibold uppercase sm:text-[14px]">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <BulletList items={masters.points || []} className="mt-6 text-sm 2xl:text-[14px]" />
                </div>

                {/* Specialisations */}
                <div className="mt-6 lg:invisible lg:absolute lg:bottom-6 lg:left-10 lg:right-10 lg:mt-0 lg:translate-y-8 lg:opacity-0 lg:transition-all lg:duration-500 lg:ease-out lg:group-focus-within:visible lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                  <p className="mb-2 text-xs text-black/60 sm:text-sm">Specialization</p>
                  <div className="flex flex-wrap gap-2">
                    {masters.specialisations?.map((s, i) => (
                      <Link
                        key={i}
                        href={s.href || '#'}
                        className="inline-flex items-center gap-1.5 rounded-[3px] bg-[#3F2E8F] font-general-sans 2xl:px-3.5 px-2 lg:px-3 2xl:py-2 py-1.5 lg:py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-orange 2xl:text-sm lg:text-[12px]"
                      >
                        {s.label}
                        <ChevronRight className="size-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bachelor's */}
        <div ref={bachelorRef} className="mt-12 lg:mt-16">
          <SectionTag>Bachelor&apos;s</SectionTag>

          <div className="mt-[30px] grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bachelors.map((item, idx) => (
              <article key={idx} className="flex flex-col bg-white p-[12px]">
                <div className="relative aspect-[2.3/1.1] w-full">
                  <Image
                    src={imgSrc(item.image, `images/home/course-img-${idx + 2}.webp`)}
                    alt={item.image?.alt || `${item.prefix} ${item.name}`}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                  <h3 className="text-xl leading-snug sm:text-[24px]">
                    {item.prefix} <span className="font-semibold italic">{item.name}</span>
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.tags?.map((tag, ti) => (
                      <span key={ti} className="bg-[#3F2E8F] px-2 py-1 text-[11px] font-medium text-white">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <BulletList items={item.points || []} className="mt-4 flex-1 text-sm" />

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-brand-purple pt-3">
                    <div>
                      <p className="text-[11px] text-black/60">Affiliated to:</p>
                      <p className="lg:text-[19px] text-[18px] font-semibold sm:text-base">
                        {item.affiliatedTo || 'Bangalore University'}
                      </p>
                    </div>
                    <Link
                      href={item.href || '#'}
                      className="inline-flex shrink-0 items-center gap-2 bg-brand-orange px-4 py-3 font-general-sans text-[11px] font-medium uppercase rounded-sm tracking-wide text-white transition-colors hover:bg-[#d63f14]"
                    >
                      Learn More <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
