import React, { useState } from 'react';
import Image from 'next/image';
import styles from './AmenitiesList.module.scss';

import { Amenities } from '@components';
import { useTranslation } from 'react-i18next';

import ArrowIconWhite from '@icons/arrow-down.svg';

interface AmenitiesListProps {
  title: string;
  roomAmenities: string[];
  hotelAmenities: string[];
}

const AmenitiesList = ({
  title,
  roomAmenities,
  hotelAmenities,
}: AmenitiesListProps) => {
  const { t } = useTranslation();
  const [openContent, setOpenContent] = useState<boolean>(true);
  return (
    <div className={styles.amenities}>
      <div
        className={styles.amenities_container}
        onClick={() => setOpenContent(!openContent)}
      >
        <h2 className={styles.amenities_container_title}>{title}</h2>
        <Image
          src={ArrowIconWhite}
          width={10}
          height={10}
          alt="arrow"
          className={`transform transition-transform ${
            openContent ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </div>
      {openContent && (
        <>
          {hotelAmenities.length > 0 && (
            <Amenities
              title={t('stays.hotel-facilities') || ''}
              amenities={hotelAmenities}
              originText="hotel"
              origin="proposal"
              color="white"
              maxAmenitiesToShow={16}
            />
          )}
          {roomAmenities.length > 0 && (
            <Amenities
              title={t('stays.room-facilities') || ''}
              amenities={roomAmenities}
              originText="hotel"
              origin="proposal"
              color="white"
              maxAmenitiesToShow={16}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AmenitiesList;
