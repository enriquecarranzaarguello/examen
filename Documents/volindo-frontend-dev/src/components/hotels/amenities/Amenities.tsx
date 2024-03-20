import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { obtainServiceTranslation } from '@utils/userFunctions';

import styles from './amenities.module.scss';

//Icons for hotel
import yogaHotelIcon from '@icons/hotelIcons/yogaHotel.svg';
import wifiHotelIcon from '@icons/hotelIcons/wifiHotel.svg';
import waterParkHotelIcon from '@icons/hotelIcons/waterParkHotel.svg';
import V220HotelIcon from '@icons/hotelIcons/V220Hotel.svg';
import TVHotelIcon from '@icons/hotelIcons/TVHotel.svg';
import tenisHotelIcon from '@icons/hotelIcons/tenisHotel.svg';
import surfingHotelIcon from '@icons/hotelIcons/surfingHotel.svg';
import spaHotelIcon from '@icons/hotelIcons/spaHotel.svg';
import smokingAreasHotelIcon from '@icons/hotelIcons/smokingAreasHotel.svg';
import skiHotelIcon from '@icons/hotelIcons/skiHotel.svg';
import safariHotelIcon from '@icons/hotelIcons/safariHotel.svg';
import roomSizeHotelIcon from '@icons/hotelIcons/roomSizeHotel.svg';
import restaurantsHotelIcon from '@icons/hotelIcons/restaurantsHotel.svg';
import poolHotelIcon from '@icons/hotelIcons/poolHotel.svg';
import petsHotelIcon from '@icons/hotelIcons/petsHotel.svg';
import parkingHotelIcon from '@icons/hotelIcons/parkingHotel.svg';
import noSmokingRoomsHotelIcon from '@icons/hotelIcons/noSmokingIcon.svg';
import noAccesibleHotelIcon from '@icons/hotelIcons/noAccesibleHotel.svg';
import motorcycleHotalIcon from '@icons/hotelIcons/motorcycleHotal.svg';
import max18HotelIcon from '@icons/hotelIcons/max18Hotel.svg';
import laundryHotelIcon from '@icons/hotelIcons/laundryHotel.svg';
import kitchenHotelIcon from '@icons/hotelIcons/kitchenHotel.svg';
import gymHotelIcon from '@icons/hotelIcons/gymHotel.svg';
import grillBBQHotelIcon from '@icons/hotelIcons/grillBBQHotel.svg';
import golfHotelIcon from '@icons/hotelIcons/golfHotel.svg';
import gameHotelIcon from '@icons/hotelIcons/gameHotel.svg';
import freeBreakfastHotelIcon from '@icons/hotelIcons/freeBreakfastHotelGreen.svg';
import fishingHotelIcon from '@icons/hotelIcons/fishingHotel.svg';
import cooworkingSpacesHotelIcon from '@icons/hotelIcons/cooworkingSpacesHotel.svg';
import clubHotelIcon from '@icons/hotelIcons/clubHotel.svg';
import closeToBeachHotelIcon from '@icons/hotelIcons/closeToBeachHotel.svg';
import categoryHotelIcon from '@icons/hotelIcons/categoryHotel.svg';
import casinoHotelIcon from '@icons/hotelIcons/casinoHotel.svg';
import carRentalHotelIcon from '@icons/hotelIcons/carRentalHotel.svg';
import carHotelIcon from '@icons/hotelIcons/carHotel.svg';
import bungalowsHotelIcon from '@icons/hotelIcons/bungalowsHotel.svg';
import breakfastHotelIcon from '@icons/hotelIcons/breakfastHotel.svg';
import bicycleHotelIcon from '@icons/hotelIcons/bicycleHotel.svg';
import beachServicesHotelIcon from '@icons/hotelIcons/beachServicesHotel.svg';
import bathHotelIcon from '@icons/hotelIcons/bathHotel.svg';
import basketBallHotelIcon from '@icons/hotelIcons/basketBallHotel.svg';
import barHotelIcon from '@icons/hotelIcons/barHotel.svg';
import barberHotelIcon from '@icons/hotelIcons/barbderHotel.svg';
import balconyHotelIcon from '@icons/hotelIcons/balconyHotel.svg';
import babySittingHotelIcon from '@icons/hotelIcons/babySittingHotel.svg';
import allInclusiveHotelIcon from '@icons/hotelIcons/allInclusiveHotel.svg';
import allergyFriendlyHotelIcon from '@icons/hotelIcons/allergyFriendlyHotel.svg';
import allDayChekinHotelIcon from '@icons/hotelIcons/allDayChekinHotel.svg';
import airCondionHotelIcon from '@icons/hotelIcons/airCondionHotel.svg';
import accesibilityHotelIcon from '@icons/hotelIcons/accesibilityHotel.svg';
import hoursSecurityHotelIcon from '@icons/hotelIcons/24hoursSecurityHotel.svg';
import arrowBottomWhite from '@icons/hotelIcons/arrow-whiteDown.svg';
import checkIcon from '@icons/check-black.svg';
import { Modal } from '@components';

const Amenities = ({
  title,
  amenities,
  originText,
  origin,
  color,
  maxAmenitiesToShow,
}: {
  title?: string;
  amenities: string[];
  originText: string;
  origin?: string;
  color: 'black' | 'white';
  maxAmenitiesToShow?: number;
}) => {
  const { t, i18n } = useTranslation();
  const [showAmenities, setShowAmenities] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const blackIconArrayServices = [
    { service: 'Free WiFi', icon: wifiHotelIcon },
    { service: 'FREE WIFI', icon: wifiHotelIcon },
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
    { service: 'Smoking allow', icon: smokingAreasHotelIcon },
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
    { service: 'Non-smoking rooms', icon: noSmokingRoomsHotelIcon },
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
  ];

  const getServiceIcon = (service: any) => {
    const foundService = blackIconArrayServices.find(
      (item: any) => item?.service === service
    );
    return foundService ? foundService.icon : checkIcon;
  };

  const hanldeInclusion = (amenity: any) => {
    const services = amenity.split(',');

    const renderedServices = services.map((service: any, index: number) => {
      const icon = getServiceIcon(service.trim());
      return (
        <div key={index} className={styles.amenities_service}>
          {icon && (
            <Image
              src={icon}
              alt={service}
              width={16}
              height={16}
              className={
                color === 'white' &&
                !service.toLowerCase().includes('coffe') &&
                !service.toLowerCase().includes('breakfast')
                  ? styles.amenities_service_icon
                  : ''
              }
            />
          )}
          <p className={styles.amenities_service_text}>
            {i18n.language === 'en'
              ? service
              : obtainServiceTranslation(service)}
          </p>
        </div>
      );
    });

    return renderedServices;
  };

  const modalContent = amenities
    ?.filter(amenity => amenity.trim() !== '')
    .join(', ');

  return (
    <>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.amenities_modal}>
          <div className={styles.amenities_modal_title}>{title || ''}</div>
          <div className={styles.amenities_modal_content}>
            {hanldeInclusion(modalContent)}
          </div>
        </div>
      </Modal>

      {amenities?.length > 0 && (
        <div className={styles[originText]}>
          {title && <h3>{title}</h3>}
          <ul>
            {amenities
              .slice(
                0,
                showAmenities
                  ? amenities.length
                  : Number(maxAmenitiesToShow) + 1
              )
              .map((amenity: any, index: number) => (
                <>
                  {amenity !== '' && (
                    <li key={index} className={`${styles[originText]}_item`}>
                      {hanldeInclusion(amenity)}
                    </li>
                  )}
                </>
              ))}
          </ul>

          {maxAmenitiesToShow &&
            amenities?.length > maxAmenitiesToShow &&
            origin === 'proposal' && (
              <div
                className={styles.amenities_proposal}
                onClick={() => setShowAmenities(!showAmenities)}
              >
                <button className={styles.amenities_proposal_button}>
                  {showAmenities ? t('common.less') : t('common.more')}
                </button>
                <Image
                  src={arrowBottomWhite}
                  width={20}
                  height={20}
                  alt="Arrow"
                  className={showAmenities ? styles.rotate : ''}
                />
              </div>
            )}

          {maxAmenitiesToShow &&
            amenities?.length > maxAmenitiesToShow &&
            origin === 'details' && (
              <>
                <button
                  className={styles.amenities_button_mobile}
                  onClick={() => setShowAmenities(!showAmenities)}
                >
                  {showAmenities
                    ? t('stays.hide-facilities')
                    : t('stays.show-facilities')}
                </button>

                <button
                  className={styles.amenities_button_desktop}
                  onClick={() => setIsModalOpen(true)}
                >
                  {showAmenities
                    ? t('stays.hide-facilities')
                    : t('stays.show-facilities')}
                </button>
              </>
            )}
        </div>
      )}
    </>
  );
};

export default Amenities;
