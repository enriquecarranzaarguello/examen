import { useTranslation } from 'react-i18next';
import styles from '@styles/marketing.module.scss';
import { useAdFormStore } from '@components/marketing/adManager/context/NewAdContext';

const DealsSection = () => {
  const { t } = useTranslation();
  const [type, setStore] = useAdFormStore(store => store.type);

  return (
    <>
      <label htmlFor="profile" className={styles.radioAd}>
        <input
          className={styles.radioAd__input}
          checked={type === 'profile'}
          type="radio"
          id="profile"
          onChange={() => setStore({ type: 'profile' })}
        />
        <div className={styles.radioAd__text}>
          <span>{t('marketing.adManager.new.typeProfileL')}</span>
          <span>{t('marketing.adManager.new.typeProfileD')}</span>
        </div>
      </label>
      <label htmlFor="deals" className={styles.radioAd}>
        <input
          className={styles.radioAd__input}
          checked={type === 'deals'}
          type="radio"
          id="deals"
          onChange={() => setStore({ type: 'deals' })}
        />
        <div className={styles.radioAd__text}>
          <span>{t('marketing.adManager.new.typeDealsL')}</span>
          <span>{t('marketing.adManager.new.typeDealsD')}</span>
        </div>
      </label>
    </>
  );
};

export default DealsSection;
