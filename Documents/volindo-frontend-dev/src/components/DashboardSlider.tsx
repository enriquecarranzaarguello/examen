import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import device from 'public/DeviceLogin.png';
import deviceFlyway from 'public/device-flyway.png';
import device2 from 'public/device2.png';
import device2Flyway from 'public/device2-flyway.png';
import device3 from 'public/device3.png';
import device4 from 'public/device4.png';

import config from '@config';

export default function DashboardSlider() {
  const { t } = useTranslation();

  const checkWL = config.WHITELABELNAME === 'Volindo';
  const titleDashboardSliderWL = checkWL
    ? t('auth.Welcome-build-four')
    : t('auth.Welcome-build-four-flyway');
  const titleCrmSliderWL = checkWL ? t('auth.CRMS') : t('auth.CRMS-flyway');

  return (
    <Swiper
      loop={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      className="h-full"
      modules={[Pagination, Autoplay]}
      spaceBetween={10}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      // onSwiper={swiper => console.log(swiper)}
      // onSlideChange={() => console.log('slide change')}
    >
      {/* First slide */}
      <SwiperSlide>
        <div className="pt-16 h-full flex flex-col justify-between items-center">
          <div className="text-center">
            <div className="block">
              <span
                className={`text-primary-background leading-[40px] font-[600] lg:text-[30px] ${
                  checkWL ? 'text-whiteLabelColor' : 'text-[var(--blue-color)]'
                }`}
              >
                {t('auth.Welcome-build')}&nbsp;
              </span>

              <span className="text-white leading-[40px] font-[600] lg:text-[30px]">
                {t('auth.welcome-build-two')}&nbsp;
              </span>
            </div>

            <div className="block">
              <span className="text-white leading-[40px] font-[600] lg:text-[30px]">
                {t('auth.Welcome-build-three')}&nbsp;
              </span>
              <span
                className={`text-primary-background leading-[40px] font-[600] lg:text-[30px] ${
                  checkWL ? 'text-whiteLabelColor' : 'text-[var(--blue-color)]'
                }`}
              >
                {titleDashboardSliderWL}
                &nbsp;
              </span>
            </div>
          </div>

          <div className="lg:w-[26rem] md:w-[26rem]">
            <img
              src={checkWL ? 'DeviceLogin.png' : 'device-flyway.png'}
              alt="device"
            />
            {/* <Image
              src={checkWL ? device : deviceFlyway}
              alt="device"
              priority={true}
            /> */}
          </div>
        </div>
      </SwiperSlide>

      {/* Second slide */}
      <SwiperSlide>
        <div className="pt-16 h-full flex flex-col justify-between items-center">
          <div className="text-center">
            <div className="block px-[40px]">
              <span className="text-white leading-[40px] font-[600] lg:text-[30px]">
                {t('auth.client-information')}
              </span>
            </div>

            <div className="block">
              <span
                className={`text-primary-background leading-[40px] font-[600] lg:text-[30px] ${
                  checkWL ? 'text-[#AACD5F]' : 'text-[var(--blue-color)]'
                }`}
              >
                {titleCrmSliderWL}
              </span>
            </div>
          </div>

          <div className="">
            <img
              src={checkWL ? 'device2.png' : 'device2-flyway.png'}
              alt="device"
            />
            {/* <Image
              src={checkWL ? device2 : device2Flyway}
              alt="device"
              priority={true}
            /> */}
          </div>
        </div>
      </SwiperSlide>

      {/* Third slide */}
      {checkWL ? (
        <SwiperSlide>
          <div className="pt-16 h-full flex flex-col justify-between items-center">
            <div className="text-center">
              <div className="block">
                <span
                  className={`text-primary-background leading-[40px] font-[600] lg:text-[30px] ${
                    checkWL ? 'text-[#FECE70]' : 'text-[var(--blue-color)]'
                  }`}
                >
                  {t('auth.Welcome-build')}&nbsp;
                </span>

                <span className="text-white leading-[40px] font-[600] lg:text-[30px]">
                  {t('auth.welcome-build-two')}&nbsp;
                </span>
              </div>

              <div className="block">
                <span className="text-white leading-[40px] font-[600] lg:text-[30px]">
                  {t('auth.Welcome-build-three')}&nbsp;
                </span>
                <span
                  className={`text-primary-background leading-[40px] font-[600] lg:text-[30px] ${
                    checkWL ? 'text-[#FECE70]' : 'text-[var(--blue-color)]'
                  }`}
                >
                  {titleDashboardSliderWL}
                </span>
              </div>
            </div>

            <div className="lg:w-[26rem] md:w-[26rem]">
              <img src="device3.png" alt="device" />
              {/* <Image src={device3} alt="device" priority={true} /> */}
            </div>
          </div>
        </SwiperSlide>
      ) : null}

      {/* Fourth slide */}
      <SwiperSlide>
        <div className="pt-16 h-full flex flex-col justify-between items-center">
          <div className="text-center">
            <div className="block px-[40px]">
              <span className="text-white lg:text-[30px] leading-[40px] font-[600]">
                {t('auth.Enjoy')}{' '}
                <span
                  className={
                    checkWL ? 'text-[#FE7070] ' : 'text-[var(--blue-color)]'
                  }
                >
                  {t('auth.discounts')}
                </span>{' '}
                {t('auth.describe')}{' '}
                <span
                  className={
                    checkWL ? 'text-[#FE7070] ' : 'text-[var(--blue-color)]'
                  }
                >
                  {t('auth.prices')}
                </span>{' '}
                {t('auth.clients')}
              </span>
            </div>

            <div className="block">
              <span className="text-primary-background text-[#AACD5F] text-base sm:text-2xl lg:text-[30px]"></span>
            </div>
          </div>

          <div className="">
            <img src="device4.png" alt="device" />
            {/* <Image src={device4} alt="device" priority={true} /> */}
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
