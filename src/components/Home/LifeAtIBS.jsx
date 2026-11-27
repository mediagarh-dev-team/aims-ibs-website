import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import { motion } from 'framer-motion';
import { getOptimizedImage } from '@/utils/image';

const viewport = { once: true, amount: 0.25 };
const ease = 'easeOut';

const DEFAULT_PHOTOS = Array.from({ length: 30 }, (_, i) => ({
  url: `images/home/life-at-ibs-img-${i + 1}.webp`,
  alt: `Life at AIMS IBS, photo ${i + 1}`,
}));

export default function LifeAtIBS({ cmsData }) {
  const headingLight = cmsData?.headingLight ?? 'Life at';
  const headingBold = cmsData?.headingBold ?? 'AIMS IBS';
  const subtext =
    cmsData?.subtext ??
    "Students don't call us the top B school in Bangalore for academics. They say that because of the overall experience.";
  const photos = cmsData?.photos?.filter((p) => p?.url)?.length ? cmsData.photos : DEFAULT_PHOTOS;

  return (
    <motion.section
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="overflow-hidden bg-white pb-12 pt-12 lg:pb-20 lg:pt-20"
    >
      <div className="custom-container">
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
          }}
          className="text-[28px] sm:text-[32px] lg:text-[48px]"
        >
          <span className="font-light">{headingLight} </span>
          <span className="font-semibold italic">{headingBold}</span>
        </motion.h2>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
          }}
          className="mt-2 max-w-160 text-sm text-black/80 lg:text-base"
        >
          {subtext}
        </motion.p>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.94 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
        }}
        className="mt-6 bg-[url('/images/home/life-aims-bg.webp')] bg-cover bg-center py-4 lg:mt-9 lg:py-7.5"
      >
        <Marquee direction="left" speed={50} gradient={false} pauseOnHover autoFill>
          {photos.map((photo, i) => (
            <div
              key={i}
              className="group relative mx-1.5 aspect-561/402 w-65 cursor-pointer overflow-hidden shadow-[0_8px_24px_rgba(63,46,143,0.15)] transition-shadow duration-500 hover:shadow-[0_16px_36px_rgba(63,46,143,0.3)] sm:mx-2 sm:w-85 lg:mx-2.25 lg:w-105 2xl:w-140.25"
            >
              <Image
                src={getOptimizedImage(photo.url || photo, { width: 420 })}
                alt={photo.alt || `Life at AIMS IBS, photo ${i + 1}`}
                fill
                sizes="(min-width: 1536px) 561px, (min-width: 1024px) 420px, 340px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[#3F2E8F]/0 transition-colors duration-500 group-hover:bg-[#3F2E8F]/15"
              />
            </div>
          ))}
        </Marquee>
      </motion.div>
    </motion.section>
  );
}
