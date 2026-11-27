import { useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Autoplay } from 'swiper/modules';
import { getOptimizedImage } from '@/utils/image';

const DEFAULT_STUDENTS = Array.from({ length: 15 }, (_, i) => ({
  name: 'Ramya Muragesh Kohalli',
  company: 'TTK Services',
  image: { url: `images/home/placement-img-${i + 1}.webp`, alt: `Placed student ${i + 1}` },
}));

const viewport = { once: true, amount: 0.25 };
const ease = 'easeOut';

export default function PlacedStudents({ cmsData }) {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const sync = (sw) => {
    setIsBeginning(sw.isBeginning);
    setIsEnd(sw.isEnd);
  };

  const headingLight = cmsData?.headingLight ?? 'Where Learning';
  const headingBold = cmsData?.headingBold ?? 'Gets You Hired';
  const subtext = cmsData?.subtext ?? 'Take a look at what happens when classroom knowledge meets industry relevance.';
  const students = cmsData?.students?.length ? cmsData.students : DEFAULT_STUDENTS;

  return (
    <section className="bg-white pt-[24px] lg:pb-[80px] pb-[64px] lg:pt-[40px] relative overflow-hidden">
      <div className="custom-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease } }}
          viewport={viewport}
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h2 className="text-[28px] leading-[36px] sm:text-[32px] lg:text-[48px] lg:leading-[52px]">
              <span className="font-light">{headingLight} </span>
              <span className="font-semibold italic">{headingBold}</span>
            </h2>
            <p className="mt-3 text-sm text-black/80 lg:text-base">{subtext}</p>
          </div>

          <div className="flex shrink-0 gap-0.5">
            <button
              type="button"
              aria-label="Previous"
              disabled={isBeginning}
              onClick={() => swiperRef.current?.slidePrev()}
              className="grid size-11 place-items-center border-2 border-brand-orange bg-[#FFF1EC] text-black transition-colors hover:bg-brand-orange hover:text-white disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={isEnd}
              onClick={() => swiperRef.current?.slideNext()}
              className="grid size-11 place-items-center border-2 border-brand-orange bg-brand-orange text-white transition-colors hover:border-[#d63f14] hover:bg-[#d63f14] disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0, transition: { duration: 0.7, ease } }}
          viewport={viewport}
          className="mt-8 lg:mt-[50px]"
        >
          <Swiper
            modules={[Autoplay]}
            loop
            loopAdditionalSlides={2}
            roundLengths
            slidesPerView="auto"
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            spaceBetween={0}
            speed={600}
            className="-my-4 py-4"
            onSwiper={(sw) => {
              swiperRef.current = sw;
              sync(sw);
            }}
            onSlideChange={sync}
            onResize={sync}
            onUpdate={sync}
          >
            {students.map((s, i) => (
              <SwiperSlide
                key={i}
                className="mr-4 w-[calc((100%_-_3.2px)/1.2)]! last:mr-0 sm:mr-5 sm:w-[calc((100%_-_20px)/2)]! md:w-[calc((100%_-_40px)/3)]! lg:mr-[26px] lg:w-[calc((100%_-_78px)/4)]! py-2"
              >
                <div className="relative aspect-square border border-[#FBF4D7] overflow-hidden rounded-[14px] shadow-[0px_4px_16px_0px_#0000000A] transition-transform duration-500 hover:-translate-y-1">
                  <Image
                    src={getOptimizedImage(s.image?.url || s.src || '', { width: 320 })}
                    alt={s.image?.alt || `${s.name}, placed at ${s.company}`}
                    fill
                    sizes="(min-width: 1024px) 301px, (min-width: 640px) 45vw, 80vw"
                    className="object-cover object-top"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-8 w-6 bg-[#4CC9E9] lg:h-12 lg:w-10" />
    </section>
  );
}
