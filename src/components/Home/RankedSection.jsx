import Image from 'next/image';
import { getOptimizedImage } from '@/utils/image';

const DEFAULT_RANKS = [
  {
    label: ['Times B-School', 'Ranking 2025'],
    rank: '50th',
    logos: [{ image: { url: 'images/home/rank-logo-1.webp', alt: 'The Times of India' }, w: 140, h: 50 }],
  },
  {
    label: ['IIRF Best', 'B-School 2025'],
    rank: '46th',
    logos: [{ image: { url: 'images/home/rank-logo-2.webp', alt: 'IIRF' }, w: 52, h: 50 }],
  },
  {
    label: ['Times of India & Silicon', 'India B-School Ranking'],
    rank: '20th',
    logos: [
      { image: { url: 'images/home/rank-logo-3.webp', alt: 'Times B-School' }, w: 88, h: 50 },
      { image: { url: 'images/home/rank-logo-4.webp', alt: 'Silicon India' }, w: 88, h: 50 },
    ],
  },
  {
    label: ['Best ROI in', 'India'],
    rank: '17th',
    logos: [{ image: { url: 'images/home/rank-logo-5.webp', alt: 'Best ROI in India' }, w: 130, h: 50 }],
  },
];

export default function RankedSection({ cmsData }) {
  const headingLight = cmsData?.headingLight ?? 'Ranked Among';
  const headingBold = cmsData?.headingBold ?? 'The Best';
  const bgImage = cmsData?.bgImage?.url ?? 'images/home/ranked-bg-img.webp';
  const ranks = cmsData?.ranks?.length ? cmsData.ranks : DEFAULT_RANKS;

  return (
    <section className="relative overflow-hidden bg-white bg-[url('/images/home/gird-bg-img.webp')] bg-cover bg-center py-12 lg:py-16">
      <span aria-hidden="true" className="absolute bottom-0 left-0 h-8 w-6 bg-[#F0C300] lg:h-12 lg:w-10" />

      <div className="custom-container">
        <div
          className="relative mb-6 lg:mb-10
            after:pointer-events-none after:absolute after:right-0 after:top-9 after:h-6 after:w-12 after:bg-[url('/images/home/bg-shap-1.webp')] after:bg-contain after:bg-right after:bg-no-repeat
            sm:after:h-8 sm:after:w-16 lg:after:top-4 lg:after:h-9 lg:after:w-20"
        >
          <h2 className="text-[28px] font-light sm:text-[42px] lg:text-[48px]">
            {headingLight} <span className="font-semibold italic">{headingBold}</span>
          </h2>
        </div>

        <div className="relative min-h-[480px] lg:min-h-[540px] overflow-hidden sm:min-h-[440px] lg:aspect-[769/357] lg:min-h-0">
          <Image
            src={getOptimizedImage(bgImage, { width: 1536 })}
            alt="AIMS IBS students"
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover object-bottom"
          />

          <div className="relative z-10 grid grid-cols-1 gap-x-6 gap-y-8 p-6 text-white sm:p-8 lg:grid-cols-[176fr_185fr_228fr_180fr] lg:gap-0">
            {ranks.map((item, i) => (
              <div key={i} className="relative lg:pl-8 lg:first:pl-0 xl:pl-14 xl:first:pl-0">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 hidden h-[84px] w-px bg-white/60 lg:block"
                  />
                )}
                <p className="text-[14px] font-bold leading-snug sm:text-[19px]">
                  {(item.label || []).map((line, li) => (
                    <span key={li} className="lg:block">
                      {line}
                    </span>
                  ))}
                </p>
                <div className="lg:block flex gap-[24px]">
                  <p className="mt-1 text-[32px] font-bold text-[#F8B683] sm:text-[38px]">{item.rank}</p>
                  <div className="mt-3 flex items-center gap-1">
                    {item.logos?.map((logo, li) => (
                      <Image
                        key={li}
                        src={getOptimizedImage(logo.image?.url || logo.src || '')}
                        alt={logo.image?.alt || logo.alt || ''}
                        width={logo.w || 100}
                        height={logo.h || 50}
                        className="h-10 w-auto sm:h-12"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
