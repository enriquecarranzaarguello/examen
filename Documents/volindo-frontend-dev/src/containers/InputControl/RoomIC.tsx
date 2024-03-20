/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import type { RoomICProps } from '@typing/proptypes';
import type { GuestICType } from '@typing/types';

import logoIcon from '@icons/logo.svg';
import whitelabellogo from '@icons/whitelabellogo.png';
import pinIconLighten from '@icons/pinLighten.svg';
import starWhiteIcon from '@icons/star-white.svg';
import starGrayIcon from '@icons/star-gray.svg';
import calendarIcon from '@icons/calendar-white.svg';
import IconCloseBlack from '@icons/close-black.svg';
import { Carousel } from 'react-responsive-carousel';

import { GuestsIC } from '@containers';
import { MapWrapper } from '@components';
import { montserratFont } from 'src/components/Layout';

//Icons for hotel
import yogaHotelIcon from '@icons/hotelIcons/whiteIcons/yogaHotel.svg';
import wifiHotelIcon from '@icons/hotelIcons/whiteIcons/wifiHotel.svg';
import waterParkHotelIcon from '@icons/hotelIcons/whiteIcons/waterParkHotel.svg';
import V220HotelIcon from '@icons/hotelIcons/whiteIcons/V220Hotel.svg';
import TVHotelIcon from '@icons/hotelIcons/whiteIcons/TVHotel.svg';
import tenisHotelIcon from '@icons/hotelIcons/whiteIcons/tenisHotel.svg';
import surfingHotelIcon from '@icons/hotelIcons/whiteIcons/surfingHotel.svg';
import spaHotelIcon from '@icons/hotelIcons/whiteIcons/spaHotel.svg';
import smokingAreasHotelIcon from '@icons/hotelIcons/whiteIcons/smokingAreasHotel.svg';
import skiHotelIcon from '@icons/hotelIcons/whiteIcons/skiHotel.svg';
import safariHotelIcon from '@icons/hotelIcons/whiteIcons/safariHotel.svg';
import roomSizeHotelIcon from '@icons/hotelIcons/whiteIcons/roomSizeHotel.svg';
import restaurantsHotelIcon from '@icons/hotelIcons/whiteIcons/restaurantsHotel.svg';
import poolHotelIcon from '@icons/hotelIcons/whiteIcons/poolHotel.svg';
import petsHotelIcon from '@icons/hotelIcons/whiteIcons/petsHotel.svg';
import parkingHotelIcon from '@icons/hotelIcons/whiteIcons/parkingHotel.svg';
import nonSmokingRoomsHotelIcon from '@icons/hotelIcons/whiteIcons/nonSmokingRoomsHotel.svg';
import noAccesibleHotelIcon from '@icons/hotelIcons/whiteIcons/noAccesibleHotel.svg';
import motorcycleHotalIcon from '@icons/hotelIcons/whiteIcons/motorcycleHotal.svg';
import max18HotelIcon from '@icons/hotelIcons/whiteIcons/max18Hotel.svg';
import laundryHotelIcon from '@icons/hotelIcons/whiteIcons/laundryHotel.svg';
import kitchenHotelIcon from '@icons/hotelIcons/whiteIcons/kitchenHotel.svg';
import gymHotelIcon from '@icons/hotelIcons/whiteIcons/gymHotel.svg';
import grillBBQHotelIcon from '@icons/hotelIcons/whiteIcons/grillBBQHotel.svg';
import golfHotelIcon from '@icons/hotelIcons/whiteIcons/golfHotel.svg';
import gameHotelIcon from '@icons/hotelIcons/whiteIcons/gameHotel.svg';
import freeBreakfastHotelIcon from '@icons/hotelIcons/whiteIcons/freeBreakfastHotel.svg';
import fishingHotelIcon from '@icons/hotelIcons/whiteIcons/fishingHotel.svg';
import cooworkingSpacesHotelIcon from '@icons/hotelIcons/whiteIcons/cooworkingSpacesHotel.svg';
import clubHotelIcon from '@icons/hotelIcons/whiteIcons/clubHotel.svg';
import closeToBeachHotelIcon from '@icons/hotelIcons/whiteIcons/closeToBeachHotel.svg';
import categoryHotelIcon from '@icons/hotelIcons/whiteIcons/categoryHotel.svg';
import checkIcon from '@icons/hotelIcons/whiteIcons/checkHotel.svg';
import casinoHotelIcon from '@icons/hotelIcons/whiteIcons/casinoHotel.svg';
import carRentalHotelIcon from '@icons/hotelIcons/whiteIcons/carRentalHotel.svg';
import carHotelIcon from '@icons/hotelIcons/whiteIcons/carHotel.svg';
import bungalowsHotelIcon from '@icons/hotelIcons/whiteIcons/bungalowsHotel.svg';
import breakfastHotelIcon from '@icons/hotelIcons/whiteIcons/breakfastHotel.svg';
import bicycleHotelIcon from '@icons/hotelIcons/whiteIcons/bicycleHotel.svg';
import beachServicesHotelIcon from '@icons/hotelIcons/whiteIcons/beachServicesHotel.svg';
import bathHotelIcon from '@icons/hotelIcons/whiteIcons/bathHotel.svg';
import basketBallHotelIcon from '@icons/hotelIcons/whiteIcons/basketBallHotel.svg';
import barHotelIcon from '@icons/hotelIcons/whiteIcons/barHotel.svg';
import barberHotelIcon from '@icons/hotelIcons/whiteIcons/barbderHotel.svg';
import balconyHotelIcon from '@icons/hotelIcons/whiteIcons/balconyHotel.svg';
import babySittingHotelIcon from '@icons/hotelIcons/whiteIcons/babySittingHotel.svg';
import allInclusiveHotelIcon from '@icons/hotelIcons/whiteIcons/allInclusiveHotel.svg';
import allergyFriendlyHotelIcon from '@icons/hotelIcons/whiteIcons/allergyFriendlyHotel.svg';
import allDayChekinHotelIcon from '@icons/hotelIcons/whiteIcons/allDayChekinHotel.svg';
import airCondionHotelIcon from '@icons/hotelIcons/whiteIcons/airCondionHotel.svg';
import accesibilityHotelIcon from '@icons/hotelIcons/whiteIcons/accesibilityHotel.svg';
import hoursSecurityHotelIcon from '@icons/hotelIcons/whiteIcons/24hoursSecurityHotel.svg';

import { obtainServiceTranslation } from '@utils/userFunctions';

import { usePrice } from 'src/components/utils/Price/Price';

import { useRouter } from 'next/router';
import url from 'url';

const renderStars = (stars: number) => {
  return (
    <div className="flex gap-3 items-center">
      {new Array(stars).fill('').map((_, index) => (
        <Image
          key={index}
          width={15}
          height={15}
          alt="icon"
          src={starWhiteIcon}
        />
      ))}

      {new Array(5 - stars).fill('').map((_, index) => (
        <Image
          key={index}
          width={15}
          height={15}
          alt="icon"
          src={starGrayIcon}
        />
      ))}

      <label className="ml-[8px] text-[13px] font-[650] scale-x-[1.4]">
        {stars}.0
      </label>
    </div>
  );
};

export default function RoomIC({
  data,
  rowIndex,
  rowValue,
  rowError,
  onChange,
}: RoomICProps) {
  const { t, i18n } = useTranslation('common');
  const [hotelSlider, setHotelSlider] = React.useState(false);
  const [activeMarker, setActiveMarker] = React.useState<string | null>(null);

  const fecha1 = new Date(data.filters.check_in);
  const fecha2 = new Date(data.filters.check_out);

  const diferenciaEnMilisegundos = fecha2.getTime() - fecha1.getTime();

  const number_of_nights = Math.round(diferenciaEnMilisegundos / 86400000);
  const [subTotalPrice, setSubTotalPrice] = useState<number>(0);

  const [priceByNight, setPriceByNight] = useState<number>(0);

  const router = useRouter();

  const price = usePrice();

  const handleChange = (value: GuestICType[]) => {
    onChange(rowIndex, { ...rowValue, guests: value });
  };

  const logoWhiteLabel =
    window.location.host.includes('dashboard.volindo.com') ||
    window.location.host.includes('dashboard.dev.volindo.com')
      ? logoIcon
      : whitelabellogo;

  const maxRowIndex = data.rooms.rooms_details[0].name.length - 1;

  // TODO may be able to extract into utils
  const iconArrayServices = [
    { service: 'Free WiFi', icon: wifiHotelIcon },
    { service: 'Restaurants', icon: restaurantsHotelIcon },
    { service: 'All-inclusive', icon: allInclusiveHotelIcon },
    { service: 'AllInclusive', icon: allInclusiveHotelIcon },
    { service: 'All Inclusive', icon: allInclusiveHotelIcon },
    { service: 'ALL INCLUSIVE', icon: allInclusiveHotelIcon },
    { service: 'All meals', icon: restaurantsHotelIcon },
    { service: 'Room Only', icon: categoryHotelIcon },
    { service: 'Fitness', icon: gymHotelIcon },
    { service: 'Dry cleaning', icon: laundryHotelIcon },
    { service: 'Conference rooms', icon: cooworkingSpacesHotelIcon },
    { service: 'Meeting room', icon: cooworkingSpacesHotelIcon },
    { service: 'Coffee shop on site', icon: breakfastHotelIcon },
    //Amentieis
    { service: 'Category', icon: categoryHotelIcon },
    { service: 'Bicycle services', icon: bicycleHotelIcon },
    { service: 'Bikes available', icon: bicycleHotelIcon },
    { service: 'Pool', icon: poolHotelIcon },
    { service: 'Billiards / Pool', icon: poolHotelIcon },
    { service: 'Game room', icon: gameHotelIcon },
    { service: 'VIP gaming room', icon: gameHotelIcon },
    { service: 'Casino', icon: casinoHotelIcon },
    { service: 'Safari', icon: safariHotelIcon },
    { service: 'Breakfast', icon: freeBreakfastHotelIcon },
    { service: 'Breakfast buffet', icon: freeBreakfastHotelIcon },
    { service: 'Accessible Hotel', icon: accesibilityHotelIcon },
    { service: 'Accessible rooms', icon: accesibilityHotelIcon },
    { service: 'Accessible bathroom', icon: accesibilityHotelIcon },
    { service: 'Airport shuttle', icon: carHotelIcon },
    { service: 'Genaral Shuttle service', icon: carHotelIcon },
    { service: 'TV', icon: TVHotelIcon },
    { service: 'Pets allowed with restrictions', icon: petsHotelIcon },
    { service: 'Pets friendly', icon: petsHotelIcon },
    { service: 'Bathtub / Jacuzzi', icon: bathHotelIcon },
    { service: 'Surfing activities', icon: surfingHotelIcon },
    { service: 'Bungalows', icon: bungalowsHotelIcon },
    { service: 'Balcony / Terrace / Patio', icon: balconyHotelIcon },
    { service: 'Air conditioning', icon: airCondionHotelIcon },
    { service: 'Laundry service', icon: laundryHotelIcon },
    { service: 'Barber shop', icon: barberHotelIcon },
    { service: 'Car rental', icon: carRentalHotelIcon },
    { service: 'Gym', icon: gymHotelIcon },
    { service: 'Spa', icon: spaHotelIcon },
    { service: 'Smoking rooms', icon: smokingAreasHotelIcon },
    { service: 'Smoking areas', icon: smokingAreasHotelIcon },
    { service: 'Golf', icon: golfHotelIcon },
    { service: 'WIFI', icon: wifiHotelIcon },
    { service: 'Restaurants', icon: restaurantsHotelIcon },
    { service: '24-hour check-in', icon: allDayChekinHotelIcon },
    { service: 'Free breakfast', icon: freeBreakfastHotelIcon },
    { service: 'Non-smoking rooms', icon: nonSmokingRoomsHotelIcon },
    { service: 'Close to beach', icon: closeToBeachHotelIcon },
    { service: 'Babysitting', icon: babySittingHotelIcon },
    { service: 'Children frendly', icon: babySittingHotelIcon },
    { service: 'Tennis courts', icon: tenisHotelIcon },
    { service: 'Car parking', icon: parkingHotelIcon },
    { service: 'Car Parking', icon: parkingHotelIcon },
    { service: 'Bar', icon: barHotelIcon },
    { service: 'Minibar', icon: barHotelIcon },
    { service: 'All inclusive', icon: allInclusiveHotelIcon },
    { service: 'Room size', icon: roomSizeHotelIcon },
    { service: 'Grill/BBQ', icon: grillBBQHotelIcon },
    { service: 'V220', icon: V220HotelIcon },
    { service: '18', icon: max18HotelIcon },
    { service: 'No accessible', icon: noAccesibleHotelIcon },
    { service: 'Basketball', icon: basketBallHotelIcon },
    { service: 'Club', icon: clubHotelIcon },
    { service: 'Kitchen', icon: kitchenHotelIcon },
    { service: 'Beach services', icon: beachServicesHotelIcon },
    { service: 'Allergy-friendly', icon: allergyFriendlyHotelIcon },
    { service: 'Ski shuttle', icon: skiHotelIcon },
    { service: 'Yoga classes', icon: yogaHotelIcon },
    { service: 'Waterpark', icon: waterParkHotelIcon },
    { service: 'Fishing', icon: fishingHotelIcon },
    { service: 'Motorcycle parking', icon: motorcycleHotalIcon },
    { service: 'Coworking spaces', icon: cooworkingSpacesHotelIcon },
    { service: '24-hours security', icon: hoursSecurityHotelIcon },
    { service: 'Paddle tennis', icon: gymHotelIcon },
    { service: 'Bowling', icon: gymHotelIcon },
    { service: 'Bocce', icon: golfHotelIcon },
    { service: 'Ironing service', icon: laundryHotelIcon },
    { service: 'Reception safe', icon: carRentalHotelIcon },
    { service: 'Theatre / auditorium', icon: balconyHotelIcon },
    { service: 'Coffee in room', icon: breakfastHotelIcon },
    { service: 'Coffee shop on site', icon: breakfastHotelIcon },
    { service: 'Meals', icon: freeBreakfastHotelIcon },
    { service: 'Water activities', icon: poolHotelIcon },
    { service: 'Private pool', icon: poolHotelIcon },
    { service: 'Room Service', icon: restaurantsHotelIcon },
    { service: 'Fitness', icon: gymHotelIcon },
    { service: 'Elevator', icon: cooworkingSpacesHotelIcon },
    { service: 'Fire Place', icon: V220HotelIcon },
    { service: 'Private bathroom', icon: bathHotelIcon },
    { service: 'In room safe', icon: hoursSecurityHotelIcon },
    { service: 'Aqua fit', icon: poolHotelIcon },
    { service: 'ATM', icon: roomSizeHotelIcon },
    { service: 'Beauty salon', icon: clubHotelIcon },
    { service: 'No pets allowed', icon: petsHotelIcon },
    { service: 'Newpaper', icon: categoryHotelIcon },
    { service: 'Newpaper', icon: categoryHotelIcon },
    { service: 'No parking', icon: parkingHotelIcon },
    { service: '24-hour health club', icon: gymHotelIcon },
    { service: 'Hair dryer', icon: bathHotelIcon },
    { service: 'Dry cleaning', icon: airCondionHotelIcon },
    { service: 'Firewood', icon: V220HotelIcon },
    { service: 'Default', icon: checkIcon },
  ];

  const hanldeInclusion = (amenity: any) => {
    const getServiceIcon = (service: any) => {
      const foundService = iconArrayServices.find(
        item => item.service === service
      );
      return foundService ? foundService.icon : checkIcon;
    };

    const services = amenity.split(',');
    const renderedServices = services.map((service: any, index: number) => {
      const icon = getServiceIcon(service.trim());
      return (
        <div key={index} className="flex row gap-1 items-center">
          {icon && <Image src={icon} alt={service} width={16} height={16} />}
          <p className="text-[400] text-[13px]">
            {/* {service} */}
            {i18n.language === 'en'
              ? service
              : obtainServiceTranslation(service)}
          </p>
        </div>
      );
    });

    return renderedServices;
  };

  useEffect(() => {
    const fullUrl = router.asPath;

    const parsedUrl = url.parse(fullUrl, true);
    const sellingRate = parseFloat(
      parsedUrl.query?.selling_rate?.toString() ?? ''
    );
    const recPrice = !isNaN(sellingRate) ? sellingRate : data?.rooms?.price;
    setSubTotalPrice(recPrice);
    const night = parseFloat(
      ((subTotalPrice - data?.rooms?.tax) / number_of_nights - 1).toFixed(0)
    );
    setPriceByNight(night);
  }, [
    data?.rooms?.price,
    price,
    router.asPath,
    data?.rooms?.tax,
    number_of_nights,
    subTotalPrice,
  ]);

  return (
    <>
      <div className="grid lg:grid-cols-2 xs:flex xs:flex-col-reverse lg:gap-[55px]">
        <div className="flex flex-col sm:mb-[15px] lg:max-w-[471px]">
          {/* gest input container ? */}
          <GuestsIC
            value={rowValue.guests}
            fieldError={rowError ? rowError.guests : null}
            onChange={handleChange}
          />
        </div>
        {/* TODO create a component for the details */}
        <div
          data-testid="hotel-proposal-info"
          className="hotel-proposal-info flex flex-col"
        >
          <div className="flex gap-[10px] mb-[26px] sm:justify-between">
            <div className="flex flex-col gap-1 lg:w-1/2">
              <label
                className={`${montserratFont.className} text-[18px] font-[760] mb-[7px] xl:text-[20px]`}
              >
                {data.hotel.hotel_name}
              </label>
              <p className="flex gap-2 items-start mb-[12px]">
                <Image alt="icon" src={pinIconLighten} />
                <label className="text-white opacity-[.64] text-[13px]">
                  <span className="sm:hidden">
                    {data.hotel.address.length > 50
                      ? data.hotel.address?.substring(0, 50) + '...'
                      : data.hotel.address}
                  </span>
                  <span className="hidden sm:block">{data.hotel.address}</span>
                </label>
              </p>
              {renderStars(data.hotel.stars)}
            </div>

            <div className="shrink-0 w-[112px] h-[87px] bg-[#444444] rounded-[24px] overflow-hidden mb-[24px] sm:w-[350px] sm:h-[200px] lg:h-[92px] lg:max-w-[166px]">
              <MapWrapper
                dataResult={[data.hotel]}
                activeMarker={activeMarker}
                setActiveMarker={setActiveMarker}
              />
            </div>
          </div>

          <div className="flex justify-between items-center rounded-[8px] py-[7px] px-[32px] bg-[#ffffff14] mb-[16px] lg:mb-[25px]">
            <div className="flex flex-col">
              <label className="text-[rgba(255, 255, 255, 0.85)] text-[12px] leading-[20px]">
                Check-in
              </label>
              <div className="flex gap-2">
                <Image alt="icon" src={calendarIcon} />
                <label className="xs:text-[14px] text-[16px] leading-[23px]">
                  {data.filters.check_in}
                </label>
              </div>
            </div>

            <div className="border border-[#222] w-[35px] h-0 lg:w-[50px]" />

            <div className="flex flex-col">
              <label className="text-[rgba(255, 255, 255, 0.85)] text-[12px] leading-[20px]">
                Check-out
              </label>
              <div className="flex gap-2">
                <Image alt="icon" src={calendarIcon} />
                <label className="xs:text-[14px] text-[16px] leading-[23px]">
                  {data.filters.check_out}
                </label>
              </div>
            </div>
          </div>

          <div className="w-full flex gap-3 flex-row rounded-3xl bg-[#ffffff14] p-4 mb-[12px] shadow-lg xs:w-full xs:p-4 xs:rounded-xl lg:mb-[25px]">
            {data?.rooms?.roomAmenities.length > 0 && (
              <div className="w-2/3 xs:w-full">
                <p className="font-[600] text-base text-white mb-[10px]">
                  {t('stays.room-facilities')}
                </p>
                <div>
                  <ul className="flex flex-wrap h-[200px] sm:h-[80px] xs:h-[80px] overflow-y-auto scrollbar-hide xs:list-none xs:gap-3 sm:list-none xs:w-full sm:gap-[5px]">
                    {data?.rooms?.roomAmenities?.map(
                      (amenity: any, index_a: number) => (
                        <>
                          {amenity !== '' && amenity !== 'none' && (
                            <li className="overflow-y-auto scrollbar-hide xs:overflow-y-visible w-full">
                              {hanldeInclusion(amenity)}
                            </li>
                          )}
                        </>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
            <div
              className={`${
                data?.rooms?.roomAmenities > 0 ? 'w-auto' : 'w-full'
              }`}
            >
              <p className="font-[600] text-base text-white mb-[10px]">
                {t('stays.hotel-facilities')}
              </p>
              <div>
                <ul className="flex flex-wrap h-[200px] sm:h-[80px] xs:h-[80px] overflow-y-auto scrollbar-hide xs:list-none xs:overflow-x-visible xs:gap-3 sm:list-none sm:gap-[5px] lg:gap-[10px]">
                  {data?.hotel?.amenities?.map(
                    (amenity: any, index_a: number) => (
                      <>
                        {amenity !== '' && amenity !== 'none' && (
                          <li className="overflow-y-auto scrollbar-hide xs:overflow-y-visible">
                            {hanldeInclusion(amenity)}
                          </li>
                        )}
                      </>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 mb-[40px]">
            <div className="flex gap-[10px] items-center sm:justify-between sm:gap-[50px] lg:gap-[13px]">
              <div
                onClick={() => setHotelSlider(true)}
                className="flex items-center w-[205px] h-[98px] bg-[#ffffff14] rounded-[10px] px-4 cursor-pointer sm:w-1/2 sm:h-[200px] lg:h-[98px]"
                style={{
                  backgroundImage: `url(${
                    data.hotel.Images.length > 0
                      ? data.hotel.Images[0]
                      : logoWhiteLabel.src
                  })`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              ></div>
              <div className="flex flex-col sm:w-1/2">
                <label className="text-[12px] font-[510] text-[#ffffff80]">
                  {`${t('stays.room')} ${rowIndex + 1} Adults: ${
                    data?.filters?.rooms[rowIndex]?.number_of_adults
                  } ${
                    data?.filters?.rooms[rowIndex]?.children_age.length > 0
                      ? `Childrens: ${data?.filters?.rooms[rowIndex]?.children_age.length}`
                      : ''
                  }`}
                </label>
                <p className="text-[16px] font-[510]">
                  {data.rooms.rooms_details[0].name[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {rowIndex < data?.rooms?.rooms_details?.length - 1 && (
        <div className="border border-[rgba(128,113,241,0.5)] mt-[33px]" />
      )}

      {hotelSlider && (
        <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-40 w-screen h-screen ">
          <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] h-[57%] w-[77%] flex justify-center rounded-xl  md:w-[77%]  lg:rounded-[16px] lg:p-4 lg:max-w-[77%]  2xl:w-auto">
            <button
              onClick={() => setHotelSlider(false)}
              className="absolute -top-5 -right-6 z-[50]"
            >
              <Image alt="icon" src={IconCloseBlack} />
            </button>
            <div className="flex flex-col  justify-center items-center py-6 px-20 scale-[.3] sm:scale-[.45] md:scale-75  xl:scale-100 lg:mt-0  xl:mt-28 2xl:scale-100">
              <div className="flex justify-center flex-col items-center px-[150px] pb-24">
                <div className="flex flex-col justify-center items-center">
                  <h2 className="text-[32px] font-[760] text-white">
                    {data?.hotel?.hotel_name}
                  </h2>
                  <div className="flex space-x-5 mb-[22px]">
                    {renderStars(data?.hotel?.stars)}
                  </div>
                </div>
                <Carousel
                  centerMode
                  showThumbs
                  stopOnHover
                  className="w-[735px] h-[498px] hotelcarousel"
                  autoPlay
                  showStatus={false}
                  showIndicators={false}
                  renderArrowPrev={(clickHandler, hasPrev) => {
                    return (
                      <div
                        className={`${
                          hasPrev ? 'absolute' : 'hidden'
                        } top-0 bottom-0 left-0 flex justify-center items-center p-3  hover:opacity-100 cursor-pointer z-20`}
                        onClick={clickHandler}
                      >
                        <svg
                          width={50}
                          height={50}
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="15"
                            cy="15"
                            r="15"
                            transform="rotate(180 15 15)"
                            fill="white"
                          />
                          <path
                            d="M13.3452 15L16.2071 17.8619C16.4674 18.1223 16.4674 18.5444 16.2071 18.8047C15.9467 19.0651 15.5246 19.0651 15.2643 18.8047L11.9309 15.4714C11.6706 15.2111 11.6706 14.7889 11.9309 14.5286L15.2643 11.1953C15.5246 10.9349 15.9467 10.9349 16.2071 11.1953C16.4674 11.4556 16.4674 11.8777 16.2071 12.1381L13.3452 15Z"
                            fill="#383838"
                          />
                        </svg>
                      </div>
                    );
                  }}
                  renderArrowNext={(clickHandler, hasNext) => {
                    return (
                      <div
                        className={`${
                          hasNext ? 'absolute' : 'hidden'
                        } top-0 bottom-0 right-0 flex justify-center items-center p-3  hover:opacity-100 cursor-pointer z-20`}
                        onClick={clickHandler}
                      >
                        <svg
                          className="rotate-180"
                          width={50}
                          height={50}
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="15"
                            cy="15"
                            r="15"
                            transform="rotate(180 15 15)"
                            fill="white"
                          />
                          <path
                            d="M13.3452 15L16.2071 17.8619C16.4674 18.1223 16.4674 18.5444 16.2071 18.8047C15.9467 19.0651 15.5246 19.0651 15.2643 18.8047L11.9309 15.4714C11.6706 15.2111 11.6706 14.7889 11.9309 14.5286L15.2643 11.1953C15.5246 10.9349 15.9467 10.9349 16.2071 11.1953C16.4674 11.4556 16.4674 11.8777 16.2071 12.1381L13.3452 15Z"
                            fill="#383838"
                          />
                        </svg>
                      </div>
                    );
                  }}
                >
                  {data?.hotel?.hotel_pictures?.map(
                    (image: any, index: number) => (
                      <div
                        key={index}
                        className="w-[735px] h-[498px] object-fill "
                      >
                        <img
                          width={100}
                          height={100}
                          src={image}
                          alt={'images'}
                        />
                      </div>
                    )
                  )}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
