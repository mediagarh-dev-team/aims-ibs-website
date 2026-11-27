import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getOptimizedImage } from '@/utils/image';

export default function JoinCta({ cmsData }) {
  const headingLine1 = cmsData?.headingLine1 ?? 'Ready to join the';
  const headingBold = cmsData?.headingBold ?? 'Top Business School';
  const headingLine2 = cmsData?.headingLine2 ?? 'in Bangalore?';
  const ctaLabel = cmsData?.ctaLabel ?? 'Apply Now';
  const ctaHref = cmsData?.ctaHref ?? '/apply-now';
  const bgImage = cmsData?.bgImage?.url ?? null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="relative bg-white overflow-hidden"
    >
      <div className="relative h-[260px] overflow-hidden sm:h-[340px] md:h-[420px] lg:h-auto lg:aspect-[943/333]">
        <motion.div
          variants={{ hidden: { scale: 1.12 }, visible: { scale: 1, transition: { duration: 1.6, ease: 'easeOut' } } }}
          aria-hidden="true"
          className={`absolute inset-0 ${bgImage ? '' : "bg-[url('/images/home/cta-bg-img-aiims.webp')]"} bg-cover bg-center`}
          style={bgImage ? { backgroundImage: `url(${getOptimizedImage(bgImage, { width: 1920 })})` } : undefined}
        />
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0, x: 80 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: 'easeOut', delay: 0.3, when: 'beforeChildren', staggerChildren: 0.15 },
          },
        }}
        className="bg-[#F7FCFA] p-6 sm:p-8 md:absolute md:right-0 md:top-0 md:w-[420px] lg:w-[clamp(400px,30.4vw,584px)] lg:p-[clamp(1.5rem,2.65vw,3.2rem)]"
      >
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
          }}
          className="text-xl leading-snug sm:text-2xl lg:text-[clamp(1.375rem,1.46vw,1.75rem)]"
        >
          <span className="block font-light">{headingLine1}</span>
          <span className="block">
            <span className="font-semibold italic">{headingBold}</span>
            <span className="font-light"> {headingLine2}</span>
          </span>
        </motion.h2>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
          }}
          className="mt-5"
        >
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 rounded-[3px] bg-brand-orange px-6 py-3.5 text-xs font-medium uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d63f14] hover:shadow-[0_10px_20px_rgba(240,75,29,0.3)] lg:text-[13px]"
          >
            {ctaLabel}
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
