import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '@styles/marketing.module.scss';

import {
  CampaignDates,
  DealsSection,
  FinancesSection,
  SocialNewtorkDropdown,
  TextSection,
  UploadPhotoSection,
} from '@components/marketing';
import config from '@config';

const NewAdFormSection = () => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [textIsSelected, setTextIsSelected] = useState(false);

  const handleIsSelected = () => {
    setIsChecked(!isChecked);
  };

  const handleTextIsSelected = () => {
    setTextIsSelected(!textIsSelected);
  };

  const checkTextWL =
    config.WHITELABELNAME === 'Volindo'
      ? t('marketing.adManager.new.letWLhandle')
      : t('marketing.adManager.new.letWLhandleFlyway');

  return (
    <div className={styles.layoutAd__form}>
      <article className={styles.tile}>
        <h2>{t('marketing.adManager.new.socialT')}</h2>
        <p>{t('marketing.adManager.new.socialD')}</p>
        <SocialNewtorkDropdown />
      </article>
      <article className={styles.tile}>
        <h2>{t('marketing.adManager.new.typeT')}</h2>
        <div className={styles.tile__content}>
          <DealsSection />
        </div>
      </article>
      <article className={styles.tile}>
        <h2>{t('marketing.adManager.new.uploadT')}</h2>
        <div className={styles.tile__content}>
          <UploadPhotoSection buttonDisable={isChecked} />
          <span
            className={styles.tile__content__handle}
            onClick={handleIsSelected}
          >
            {checkTextWL}
          </span>
        </div>
      </article>
      <article className={styles.tile}>
        <h2>{t('marketing.adManager.new.textT')}</h2>
        <div className={styles.tile__content}>
          <TextSection selected={textIsSelected} />
          <span
            className={styles.tile__content__handle}
            onClick={handleTextIsSelected}
          >
            {checkTextWL}
          </span>
        </div>
      </article>
      <article className={styles.tile}>
        <h2>{t('marketing.adManager.new.datesT')}</h2>
        <div className={styles.tile__content}>
          <CampaignDates />
        </div>
      </article>
      <article className={styles.tile}>
        <h2>{t('marketing.adManager.new.financesT')}</h2>
        <div className={styles.tile__content}>
          <FinancesSection />
        </div>
      </article>
    </div>
  );
};

export default NewAdFormSection;
