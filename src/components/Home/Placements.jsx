import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Download, Play } from 'lucide-react';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getOptimizedImage, getOptimizedVideo } from '@/utils/image';

/* ── Defaults ──────────────────────────────────────────────────── */
const DEFAULT_VIDEOS = [
  { name: 'Devaiah K U', videoUrl: 'images/home/placement-1.mp4', poster: { url: 'images/home/video-img-1.webp' } },
  { name: 'Anjali', videoUrl: 'images/home/placement-2.mp4', poster: { url: 'images/home/video-img-2.webp' } },
  { name: 'Devaiah K U', videoUrl: 'images/home/placement-1.mp4', poster: { url: 'images/home/video-img-1.webp' } },
  { name: 'Anjali', videoUrl: 'images/home/placement-2.mp4', poster: { url: 'images/home/video-img-2.webp' } },
  { name: 'Devaiah K U', videoUrl: 'images/home/placement-1.mp4', poster: { url: 'images/home/video-img-1.webp' } },
  { name: 'Anjali', videoUrl: 'images/home/placement-2.mp4', poster: { url: 'images/home/video-img-2.webp' } },
];

const DEFAULT_STATS = [
  { value: '94%', unit: '', label: 'Placement Rate', highlight: false },
  { value: '₹6.8', unit: 'LPA', label: 'Average Package', highlight: false },
  { value: '₹14.5', unit: 'LPA', label: 'Highest Package', highlight: true },
  { value: '200+', unit: '', label: 'Hiring Partners', highlight: false },
];

const DEFAULT_LOGOS_ROW1 = Array.from({ length: 6 }, (_, i) => ({
  image: { url: `images/home/company-logo-${i + 1}.webp`, alt: `Company logo ${i + 1}` },
}));
const DEFAULT_LOGOS_ROW2 = Array.from({ length: 6 }, (_, i) => ({
  image: { url: `images/home/company-logo-${i + 7}.webp`, alt: `Company logo ${i + 7}` },
}));

/* ── VideoCard ─────────────────────────────────────────────────── */
function VideoCard({ name, videoUrl, poster }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <div className="relative aspect-[3/5] overflow-hidden bg-black shadow-[0px_8px_10px_-6px_#0000001A,0px_20px_25px_-5px_#0000001A]">
      <video
        ref={videoRef}
        src={getOptimizedVideo(videoUrl)}
        poster={getOptimizedImage(poster?.url || poster || '')}
        preload="metadata"
        playsInline
        controls={playing}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="h-full w-full object-cover"
      />
      {!playing && (
        <button
          type="button"
          aria-label={`Play ${name}'s video`}
          onClick={handlePlay}
          className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#FF7A00] text-white transition-transform duration-300 hover:scale-110 lg:size-14"
        >
          <Play className="size-5 fill-white" />
        </button>
      )}
    </div>
  );
}

/* ── LogoRow ───────────────────────────────────────────────────── */
function LogoRow({ logos, direction }) {
  return (
    <Marquee direction={direction} speed={40} gradient={false} autoFill pauseOnHover>
      {logos.map((logo, i) => (
        <div
          key={i}
          className="relative mx-2 h-14 w-28 border border-[#D9DDEA] bg-white sm:mx-3 sm:h-16 sm:w-36 lg:mx-3.5 lg:h-[73px] lg:w-[167px]"
        >
          <Image
            src={getOptimizedImage(logo.image?.url || logo.url || logo.src || '', { width: 200 })}
            alt={logo.image?.alt || logo.alt || `Logo ${i + 1}`}
            fill
            sizes="170px"
            className="object-contain"
          />
        </div>
      ))}
    </Marquee>
  );
}

/* ── Component ─────────────────────────────────────────────────── */
export default function Placements({ cmsData }) {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const sync = (sw) => {
    setIsBeginning(sw.isBeginning);
    setIsEnd(sw.isEnd);
  };

  const headingLight = cmsData?.headingLight ?? 'Placements That';
  const headingBold = cmsData?.headingBold ?? 'Careers';
  const bodyText =
    cmsData?.bodyText ??
    "AIMS IBS's dedicated placement cell works year-round to ensure students walk into outstanding careers — from aptitude training and mock interviews to live industry exposure.";
  const ctaLabel = cmsData?.ctaLabel ?? 'Download Placement Report';
  const ctaHref = cmsData?.ctaHref ?? '/placement-report.pdf';
  const stats = cmsData?.stats?.length ? cmsData.stats : DEFAULT_STATS;
  const videos = cmsData?.videos?.length ? cmsData.videos : DEFAULT_VIDEOS;
  const logosRow1 = cmsData?.companyLogosRow1?.length ? cmsData.companyLogosRow1 : DEFAULT_LOGOS_ROW1;
  const logosRow2 = cmsData?.companyLogosRow2?.length ? cmsData.companyLogosRow2 : DEFAULT_LOGOS_ROW2;

  return (
    <section className="bg-white pt-12 lg:pt-[100px] pb-[20px] lg:pb-[40px]">
      <div className="custom-container">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-[50px] mb-[44px] lg:mb-[64px]">
          {/* Left: video slider */}
          <div className="order-2 min-w-0 lg:order-1">
            <Swiper
              modules={[Autoplay]}
              loop
              loopedslides={2}
              roundLengths
              slidesPerView="auto"
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              spaceBetween={0}
              speed={600}
              className="!pb-6"
              onSwiper={(sw) => {
                swiperRef.current = sw;
                sync(sw);
              }}
              onSlideChange={sync}
              onResize={sync}
              onUpdate={sync}
            >
              {videos.map((v, i) => (
                <SwiperSlide
                  key={i}
                  className="mr-4 w-[calc((100%-16px)/1.25)]! last:mr-0 sm:mr-6 sm:w-[calc((100%-24px)/2)]!"
                >
                  <VideoCard {...v} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="flex gap-0.5">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => swiperRef.current?.slidePrev()}
                className="grid size-11 place-items-center border-2 border-brand-orange bg-[#FFF5E4] text-black transition-colors hover:bg-brand-orange hover:text-white disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => swiperRef.current?.slideNext()}
                className="grid size-11 place-items-center border-2 border-brand-orange bg-brand-orange text-white transition-colors hover:border-[#d63f14] hover:bg-[#d63f14] disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          {/* Right: content */}
          <div className="order-1 min-w-0 lg:order-2">
            <h2 className="text-[28px] sm:text-[32px] lg:text-[48px] lg:leading-[52px]">
              <span className="block font-light">{headingLight}</span>
              <span className="block">
                <span className="font-light">Define </span>
                <span className="font-semibold italic">{headingBold}</span>
              </span>
            </h2>

            <div className="mt-6 bg-[url('/images/home/placement-stats-bg-img.webp')] bg-cover bg-center p-3 sm:p-4 lg:p-5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className={`flex aspect-square flex-col items-center justify-center border border-[#8D78F0] p-2 text-center ${s.highlight ? "bg-[url('/images/home/placement-box-bg.webp')] bg-cover bg-center text-white" : 'bg-white text-[#3F2E8F]'}`}
                  >
                    <p className="text-[26px] font-bold leading-none lg:text-[28px] xl:text-[33px]">
                      {s.value}
                      {s.unit && <span className="ml-0.5 text-xs font-medium">{s.unit}</span>}
                    </p>
                    <p
                      className={`mt-2 text-[11px] font-medium uppercase leading-tight xl:text-[13px] ${s.highlight ? 'text-white' : 'text-black/80'}`}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-black/80 lg:text-[16px]">{bodyText}</p>

            <a
              href={ctaHref}
              download
              className="mt-8 inline-flex items-center gap-2.5 bg-brand-orange rounded-[4px] px-6 py-3.5 text-[13px] font-medium uppercase tracking-wide text-white transition-colors hover:bg-[#d63f14]"
            >
              {ctaLabel}
              <Download className="size-3.5" />
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.25 }}
          className="space-y-4 overflow-hidden rounded-md bg-[url('/images/home/company-logo-bg.webp')] bg-cover bg-center px-2 py-4 lg:space-y-[27px] lg:px-4 lg:py-5"
        >
          <LogoRow logos={logosRow1} direction="left" />
          <LogoRow logos={logosRow2} direction="right" />
        </motion.div>
      </div>
    </section>
  );
}
