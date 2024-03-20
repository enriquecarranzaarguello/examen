import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import type { ModalHotelImageProps } from '@typing/proptypes';

import {
  Modal,
  ModalImageSlider,
  HotelStarsRating,
  GeneralButton,
} from '@components';

import styles from './ModalHotelImages.module.scss';

export default function ModalHotelImages({
  open,
  onClose,
  stay,
}: ModalHotelImageProps) {
  const [openSlider, setOpenSlider] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { t } = useTranslation();

  return (
    <>
      <ModalImageSlider
        open={openSlider}
        onClose={() => setOpenSlider(false)}
        title={stay.hotel_name}
        ImageArray={stay.Images}
        stars={stay.stars}
        selectedIndex={selectedIndex}
      />
      {openSlider === true ? (
        ''
      ) : (
        <Modal open={open} onClose={onClose}>
          <div className={styles.modal}>
            <div className={styles.modal_content}>
              <label className={styles.modal_title}>{stay.hotel_name}</label>
              <div className={styles.modal_rating}>
                <HotelStarsRating
                  hotelRating={stay.stars}
                  origin="hotelDetails"
                />
              </div>
              <ul className={styles.modal_list}>
                {stay.Images?.map((image: string, index: number) => (
                  <li
                    key={index}
                    className={styles.modal_item}
                    onClick={() => {
                      setSelectedIndex(index);
                      setOpenSlider(true);
                    }}
                  >
                    <img src={image} alt="Image" />
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.modal_button}>
              <GeneralButton
                text={`${t('stays.chooseroom')}`}
                cb={onClose}
                originText="modalHotelImagesButton"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
