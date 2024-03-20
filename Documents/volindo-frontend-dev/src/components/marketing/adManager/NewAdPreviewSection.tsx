import { useTranslation } from 'react-i18next';

import styles from '@styles/marketing.module.scss';
import config from '@config';

import {
  PreviewSection,
  PriceSection,
  CreateAdAction,
  ExpectationsSection,
  MarketingCoupon,
} from '@components/marketing';

const NewAdPreviewSection = () => {
  const { t } = useTranslation();

  const checkCreateButtonWL =
    config.WHITELABELNAME === 'Volindo' ? styles.buttons : styles.buttonsWL;

  return (
    <div className={styles.layoutAd__preview}>
      <article className={styles.tile}>
        <h2>{t('marketing.adManager.new.previewT')}</h2>
        <PreviewSection />
      </article>

      <article className={styles.tile}>
        <h2>{t('marketing.adManager.new.expect')}</h2>
        <ExpectationsSection />
      </article>

      <article className={styles.tile}>
        <MarketingCoupon />
      </article>

      <article className={styles.tile}>
        <h2>{t('marketing.adManager.new.priceSummary')}</h2>
        <PriceSection />
      </article>

      <article className={checkCreateButtonWL}>
        <CreateAdAction />
      </article>
    </div>
  );
};

export default NewAdPreviewSection;
