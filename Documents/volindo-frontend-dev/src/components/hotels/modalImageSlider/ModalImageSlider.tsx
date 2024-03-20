import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImageSliderProps } from '@typing/proptypes';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass, FreeMode, Navigation, Thumbs } from 'swiper';
import { Modal, HotelStarsRating } from '@components';
import 'swiper/css';
import 'swiper/css/thumbs';
import styles from './ModalImageSlider.module.scss';

import arrowRightBlack from '@icons/arrow-right.svg';
import arrowLeftBlack from '@icons/arrow-left.svg';

const ModalImageSlider = ({
  open,
  onClose,
  title,
  stars,
  ImageArray,
  selectedIndex,
}: ImageSliderProps) => {
  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperClass | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);

  useEffect(() => {
    if (!open) {
      setThumbsSwiper(null);
    }
  }, [open]);

  return (
    <Modal onClose={onClose} open={open}>
      <div className={styles.slider}>
        <label className={styles.slider_title}>{title}</label>
        {stars > 0 && (
          <div className={styles.slider_rating}>
            <HotelStarsRating hotelRating={stars} origin="slider" />
          </div>
        )}

        <span className={styles.slider_count}>
          {currentIndex + 1} / {ImageArray.length}
        </span>
        <Swiper
          modules={[FreeMode, Navigation, Thumbs]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          thumbs={{ swiper: thumbsSwiper }}
          className={styles.slider_list}
          initialSlide={selectedIndex}
          onSlideChange={swiper => setCurrentIndex(swiper.realIndex)}
        >
          {ImageArray?.map((image: string, index: number) => {
            return (
              <SwiperSlide key={index} className={styles.slider_item}>
                <Image
                  width={500}
                  height={500}
                  src={image}
                  alt={`Image ${index + 1}`}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div
          className={`${styles.slider_button} ${styles.slider_button_next} swiper-button-next`}
        >
          <Image
            src={arrowRightBlack}
            width={24}
            height={24}
            alt="Arrow right"
          />
        </div>
        <div
          className={`${styles.slider_button} ${styles.slider_button_prev} swiper-button-prev`}
        >
          <Image src={arrowLeftBlack} width={24} height={24} alt="Arrow left" />
        </div>

        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={11}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className={styles.slider_bottom}
        >
          {ImageArray?.map((image, index) => (
            <SwiperSlide key={index} className={styles.slider_bottom_item}>
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  filter: index === currentIndex ? 'none' : 'brightness(40%)',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Modal>
  );
};

export default ModalImageSlider;
