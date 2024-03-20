import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import arrowLeftBlack from '@icons/arrow-left.svg';
import arrowRightBlack from '@icons/arrow-right.svg';
import { StaysType } from '@typing/types';

import styles from './imageSlider.module.scss';

const ImageSlider = ({
  setOpenHotelImages,
  stay,
}: {
  setOpenHotelImages: React.Dispatch<React.SetStateAction<boolean>>;
  stay: StaysType;
}) => {
  const [windowSize, setWindowSize] = useState(0);
  const [isBeginning, setIsBeginning] = useState<boolean>(true);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const swiperRef = useRef<{ swiper: SwiperClass } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current.swiper;

      const updateSwiperState = () => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
      };

      swiper.on('init', updateSwiperState);
      swiper.on('slideChange', updateSwiperState);

      updateSwiperState();

      return () => {
        swiper.off('init', updateSwiperState);
        swiper.off('slideChange', updateSwiperState);
      };
    }
  }, [swiperRef.current]);

  return (
    <>
      {stay.Images.length > 0 && (
        <div
          data-testid="chosen-hotel-details-images"
          className={styles.slider}
        >
          <Swiper
            ref={swiperRef}
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            onInit={swiper => {
              swiperRef.current = { swiper };
            }}
            onSlideChange={swiper => {
              setCurrentIndex(swiper.realIndex + 1);
            }}
            breakpoints={{
              768: {
                slidesPerView: 4,
              },
            }}
          >
            {stay?.Images?.map((image: string, index: number) => (
              <SwiperSlide
                key={index}
                className={styles.slider_slide}
                onClick={() => setOpenHotelImages(true)}
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              ></SwiperSlide>
            ))}

            <div className={styles.slider_shadow_left}></div>
            <div className={styles.slider_shadow_right}></div>

            <div
              className={`swiper-button-prev ${styles.slider_navigation_button} ${styles.slider_navigation_button_prev} ${isBeginning ? styles.slider_navigation_button_disabled : ''}`}
            >
              <Image
                src={arrowLeftBlack}
                width={24}
                height={24}
                alt="Arrow left"
              />
            </div>
            <div
              className={`swiper-button-next ${styles.slider_navigation_button} ${styles.slider_navigation_button_next} ${isEnd ? styles.slider_navigation_button_disabled : ''}`}
            >
              <Image
                src={arrowRightBlack}
                width={24}
                height={24}
                alt="Arrow right"
              />
            </div>
            <div className={styles.slider_counter}>
              {currentIndex} / {stay.Images.length}
            </div>
          </Swiper>
        </div>
      )}
    </>
  );
};

export default ImageSlider;
