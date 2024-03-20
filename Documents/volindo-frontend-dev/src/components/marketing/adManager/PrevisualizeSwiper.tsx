import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@styles/marketing.module.scss';
import PinIcon from '@icons/map-pingwhite.svg';
import whitelabellogoMarketing from '@icons/whitelabellogoMarketing.svg';
import { useAdFormStore } from './context/NewAdContext';
import { Navigation } from 'swiper';

// Import Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import config from '@config';

const PrevisualizeSwiper = () => {
  const { t } = useTranslation();
  const [socialNetwork] = useAdFormStore(store => store.socialNetwork);
  const [files] = useAdFormStore(store => store.uploadFiles);
  const [proportion, setProportion] = useState('');

  useEffect(() => {
    switch (socialNetwork) {
      case 'Instagram':
        setProportion(styles.square);
        break;
      case 'TikTok':
        setProportion(styles.vertical);
        break;
      default:
        setProportion('');
        break;
    }
  }, [socialNetwork]);

  const checkIconWL =
    config.WHITELABELNAME === 'Volindo' ? PinIcon : whitelabellogoMarketing;

  return (
    <div className={`${styles.preview__object} ${proportion}`}>
      <Swiper
        slidesPerView={1}
        loop={true}
        navigation={true}
        modules={[Navigation]}
        className={styles.preview__object__swiper}
      >
        {files.length != 0 ? (
          files.map((file, index) => {
            if (file.type.startsWith('image')) {
              return (
                <SwiperSlide key={index}>
                  <Image src={URL.createObjectURL(file)} alt="Image" fill />
                </SwiperSlide>
              );
            } else {
              return (
                <SwiperSlide key={index}>
                  <video autoPlay muted loop controls>
                    <source src={URL.createObjectURL(file)} type={file.type} />
                  </video>
                </SwiperSlide>
              );
            }
          })
        ) : (
          <SwiperSlide className={styles.preview__placeholder}>
            <span>{t('marketing.adManager.new.previewP')}</span>
          </SwiperSlide>
        )}
      </Swiper>
      <Image
        className={styles.pin}
        src={checkIconWL}
        alt="Pin"
        width={44}
        height={37}
      />
    </div>
  );
};

export default PrevisualizeSwiper;
