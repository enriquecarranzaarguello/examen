import { useTranslation } from 'react-i18next';
import { useAdFormStore } from '../context/NewAdContext';

import styles from '@styles/marketing.module.scss';
import PrevisualizeSwiper from '../PrevisualizeSwiper';

const PreviewSection = () => {
  const { t } = useTranslation();
  const [adText] = useAdFormStore(store => store.adText);

  return (
    <div className={styles.preview}>
      <PrevisualizeSwiper />
      <span className={styles.preview__text}>
        {adText ? adText : t('marketing.adManager.new.textD')}
      </span>
    </div>
  );
};

export default PreviewSection;
