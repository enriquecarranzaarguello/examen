import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import arrowTop from '@icons/arrow-left-white.svg';
import pinIcon from '@icons/map-pingwhite.svg';

import HotelStarsRating from '@components/hotels/stars/Stars';
import { StaysType } from '@typing/types';
import { HotelCardLocation, HotelDateRange, MapWrapper } from '@components';

import styles from './sidebarDetails.module.scss';

interface SidebarDetailsProps {
  stay: StaysType;
  infoStay: {
    check_in: string;
    check_out: string;
    numberOfRooms: number;
    numberOfPeople: number;
    numberOfChildren: number;
  };
}

const SidebarDetails = ({ stay, infoStay }: SidebarDetailsProps) => {
  const { t, i18n } = useTranslation();
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(true);

  const handleShowMap = () => {
    setShowMap(!showMap);
  };

  const {
    check_in,
    check_out,
    numberOfRooms,
    numberOfPeople,
    numberOfChildren,
  } = infoStay;

  const hotelData = {
    address: stay?.address,
    hotel_name: stay?.hotel_name,
    hotel_pictures: stay?.Images,
    id: stay?.id,
    rooms: [{ TotalFare: stay?.rooms[0]?.TotalFare }],
    stars: stay?.stars,
    latitude: stay?.latitude,
    longitude: stay?.longitude,
  };

  return (
    <div className={styles.sidebarDetails}>
      <p
        className={styles.sidebarDetails_location_text}
        onClick={handleShowMap}
      >
        <Image src={pinIcon} width={18} alt="Icon" />
        <span>{t('suppliers.location')}</span>
        <Image
          className={
            showMap
              ? styles.sidebarDetails_location_arrow
              : styles.sidebarDetails_location_arrow_active
          }
          src={arrowTop}
          width={8}
          height={8}
          alt="Arrow top"
        />
      </p>

      {showMap && (
        <div className={styles.sidebarDetails_map}>
          <MapWrapper
            dataResult={[hotelData]}
            activeMarker={activeMarker}
            setActiveMarker={setActiveMarker}
            origin="details"
          />
        </div>
      )}

      <div className={styles.sidebarDetails_wrapper_location_rating}>
        <HotelCardLocation stay={stay} />

        <HotelStarsRating
          hotelRating={stay?.stars}
          origin="hotelProposal"
          styleProp={'hotelDetailsStars'}
        />
      </div>

      <div className={styles.sidebarDetails_summary}>
        <HotelDateRange data={infoStay} />

        <div className={styles.sidebarDetails_details}>
          <div className={styles.sidebarDetails_details_item}>
            <label
              className={styles.sidebarDetails_details_item_label}
              htmlFor=""
            >
              {t('stays.numberofnights')}
            </label>{' '}
            <p className={styles.sidebarDetails_details_item_value}>
              {stay?.number_of_nights} {t('stays.days')}
            </p>
          </div>

          <div className={styles.sidebarDetails_details_item}>
            <label
              className={styles.sidebarDetails_details_item_label}
              htmlFor=""
            >
              {t('stays.numberofroms')}
            </label>{' '}
            <p className={styles.sidebarDetails_details_item_value}>
              {numberOfRooms === 1
                ? `${numberOfRooms} ${t('stays.room')}`
                : `${numberOfRooms} ${t('stays.rooms')}`}
            </p>
          </div>
          <div className={styles.sidebarDetails_details_item}>
            <label className={styles.sidebarDetails_details_item_label}>
              {t('stays.numberofgest')}
            </label>{' '}
            <p className={styles.sidebarDetails_details_item_value}>
              {numberOfPeople} {t('stays.adults')}
            </p>
          </div>
          <div className={styles.sidebarDetails_details_item}>
            <label className={styles.sidebarDetails_details_item_label}>
              {t('stays.numberofchildren')}
            </label>{' '}
            <p className={styles.sidebarDetails_details_item_value}>
              {numberOfChildren} {t('stays.children')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarDetails;
