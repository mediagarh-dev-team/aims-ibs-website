import Image from 'next/image';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import { ArrowRight, Download } from 'lucide-react';
import { getOptimizedImage, getOptimizedVideo } from '@/utils/image';

const VIDEO_SRC = 'images/home/home-banner-video.mp4';

const DEFAULT_LOGOS = Array.from({ length: 12 }, (_, i) => `images/home/company-logo-${i + 1}.webp`);

const DEFAULT_SUBTEXT =
  'At AIMS IBS, we offer class-apart <strong>UG &amp; PG management education</strong> pathways that have been consistently trusted by ranking organizations &amp; students from pan-India.';

function renderRichText(html) {
  if (!html) return null;
  // Allows a limited set of inline tags entered by the admin
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function LogoRow({ direction, logos }) {
  return (
    <Marquee direction={direction} speed={30} gradient={false} autoFill pauseOnHover>
      {logos.map((logo, i) => (
        <div
          key={i}
          className="mx-1 flex h-[38px] w-[88px] items-center justify-center rounded-[4px] overflow-hidden bg-white"
        >
          <Image
            src={getOptimizedImage(logo.url || logo, { width: 176, quality: 'auto:good' })}
            alt={logo.alt || `Hiring partner ${i + 1}`}
            width={88}
            height={38}
            quality={100}
            priority
            unoptimized={false}
            className="h-full w-full object-contain"
          />
        </div>
      ))}
    </Marquee>
  );
}

export default function HomeHero({ cmsData }) {
  // ── Merge CMS data over defaults ─────────────────────────────
  const headingLight = cmsData?.headingLight ?? 'Not Your Average';
  const headingBold = cmsData?.headingBold ?? 'Business School in Bangalore';
  const subtext = cmsData?.subtext ?? DEFAULT_SUBTEXT;
  const ctaLabel = cmsData?.ctaLabel ?? 'Join Today';
  const ctaHref = cmsData?.ctaHref ?? '/apply-now';
  const secondaryCtaLabel = cmsData?.secondaryCtaLabel ?? 'Download Handbook';
  const secondaryCtaHref = cmsData?.secondaryCtaHref ?? '/handbook.pdf';
  const videoUrl = cmsData?.videoUrl || VIDEO_SRC;
  const companiesTitle = cmsData?.companiesTitle ?? 'Companies hiring from us';

  const logos = cmsData?.companyLogos?.filter((l) => l?.url || l?.publicId)?.length
    ? cmsData.companyLogos.filter((l) => l?.url || l?.publicId)
    : DEFAULT_LOGOS.map((url) => ({ url, alt: '' }));

  return (
    <section className="relative flex min-h-[calc(100svh-90px)] w-full items-end overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={getOptimizedVideo(videoUrl)}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      <div className="custom-container relative z-10 pb-10 pt-32 lg:pb-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          {/* Left content */}
          <div className="max-w-105 sm:max-w-[558px]">
            <h1 className="text-3xl leading-tight sm:text-4xl lg:text-[40px]">
              <span className="block font-light">{headingLight}</span>
              <span className="block font-semibold">{headingBold}</span>
            </h1>
            <p className="mt-5 text-[16px] leading-relaxed text-white/90">{renderRichText(subtext)}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-3 border border-brand-orange bg-brand-orange px-5 py-3 font-general-sans text-xs font-medium uppercase tracking-wide transition-colors hover:bg-[#d63f14]"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={secondaryCtaHref}
                download
                className="inline-flex items-center gap-3 border border-white px-5 py-3 font-general-sans text-xs font-medium uppercase tracking-wide transition-colors hover:bg-white hover:text-black"
              >
                {secondaryCtaLabel}
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Companies */}
          <div className="w-full sm:max-w-[416px] shrink-0 lg:mb-0">
            <p className="mb-2 text-[14px] font-medium uppercase tracking-wide text-white/90">{companiesTitle}</p>
            <div className="flex flex-col gap-2 overflow-hidden rounded-md border border-white/10 bg-[#FFFFFF1A] p-2 backdrop-blur-sm">
              <LogoRow direction="left" logos={logos} />
              <LogoRow direction="right" logos={logos} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
