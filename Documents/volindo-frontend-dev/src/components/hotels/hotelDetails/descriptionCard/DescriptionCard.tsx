import React, { useState } from 'react';
import Image from 'next/image';

import arrowBottomOpacity from '@icons/hotelIcons/arrow-opacityDown.svg';
import { useTranslation } from 'react-i18next';

import styles from './descriptionCard.module.scss';
import { Modal } from '@components';

const DescriptionCard = ({ description }: { description: string }) => {
  const { t } = useTranslation();
  const [moreAbout, setmoreAbout] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      data-testid="chosen-hotel-details-about"
      className={styles.descriptionCard}
    >
      <div>
        <h2 className={styles.descriptionCard_title}>{t('stays.about')}</h2>
        {/* Mobile */}
        <div
          dangerouslySetInnerHTML={{
            __html:
              description.replace(/HeadLine\s*:\s*/g, '').substring(0, 350) +
              '...',
          }}
          className={`${styles.descriptionCard_description}`}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: description.replace(/HeadLine\s*:\s*/g, ''),
          }}
          className={`${moreAbout ? styles.descriptionCard_mobile_description : styles.descriptionCard_mobile_description_hidden}`}
        />
      </div>
      {/* Mobile button */}
      <button
        className={styles.descriptionCard_button_mobile}
        onClick={() => setmoreAbout(!moreAbout)}
      >
        <span>{moreAbout ? t(`common.less`) : t(`common.more`)}</span>
        <Image
          src={arrowBottomOpacity}
          className={
            moreAbout
              ? styles.descriptionCard_icon_rotated
              : styles.descriptionCard_icon
          }
          width={24}
          height={24}
          alt="Arrow bottom"
        />
      </button>

      {/* Desktop button */}
      <button
        className={styles.descriptionCard_button_desktop}
        onClick={() => setIsModalOpen(true)}
      >
        {t(`common.more`)}
      </button>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.wrapper}>
          <div className={styles.descriptionCard_modal}>
            <div className={styles.descriptionCard_modal_title}>
              {t('stays.about')}
            </div>
            <div
              className={styles.descriptionCard_modal_text}
              dangerouslySetInnerHTML={{
                __html: description.replace(/HeadLine\s*:\s*/g, ''),
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DescriptionCard;
