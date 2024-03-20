import React, { useState } from 'react';
import Image from 'next/image';
import styles from './RoomDetails.module.scss';
import { ModalHotelImages } from '@components';
import config from '@config';

//Icons - Images
import volindoLogo from '@icons/volindoLogoNew.svg';
import flywayLogo from '@icons/logoFlyway.svg';
import { useTranslation } from 'react-i18next';

interface RoomDetailsProps {
  images: string[];
  hotelName: string;
  stars?: number;
  roomNames: string[];
  origin?: string;
}

const RoomDetails = ({
  images = [],
  hotelName = '',
  stars = 0,
  roomNames = [],
  origin,
}: RoomDetailsProps) => {
  const { t } = useTranslation();
  const [showImageSlider, setShowImageSlider] = useState(false);
  const checkWL = config.WHITELABELNAME === 'Volindo';

  const companyIcon = checkWL ? volindoLogo : flywayLogo;

  const stayDetails: any = {
    Images: images,
    hotel_name: hotelName,
    stars,
  };

  return (
    <>
      <ModalHotelImages
        open={showImageSlider}
        onClose={() => setShowImageSlider(false)}
        stay={stayDetails}
      />

      <div className={styles.roomdetails}>
        {images?.length > 0 ? (
          <Image
            src={images[0]}
            alt={`Image from ${hotelName}`}
            width={250}
            height={200}
            className={styles.roomdetails_image}
            onClick={() => setShowImageSlider(true)}
          />
        ) : (
          <Image
            src={companyIcon}
            alt="Imagenes"
            className={styles.roomdetails_image}
          />
        )}
        <div>
          {roomNames.map((name: string, index: number) => (
            <div key={index} className={styles.roomdetails_text}>
              {origin === 'hotels' && (
                <p className={styles.roomdetails_text_room}>
                  {t('reservations.room')} {index + 1}
                </p>
              )}
              <p className={styles.roomdetails_text_details}>{name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RoomDetails;
