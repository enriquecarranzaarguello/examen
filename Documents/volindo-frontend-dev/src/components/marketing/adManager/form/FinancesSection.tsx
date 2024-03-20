import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '@styles/marketing.module.scss';
import { useAdFormStore } from '@components/marketing/adManager/context/NewAdContext';
import { Slider } from '@components';

const FinancesSection = () => {
  const { t } = useTranslation();
  const [budget, setStore] = useAdFormStore(store => store.budget);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setStore({ budget: value });
  };

  const handleFocusOut = () => {
    if (budget < 50) setStore({ budget: 50 });
    else if (budget > 1000) setStore({ budget: 1000 });
  };

  return (
    <>
      <span>{t('marketing.adManager.new.financesD')}</span>
      <label>
        <span className={styles.inputAd__label}>
          {t('marketing.adManager.new.financesIns')}
        </span>
        <div className={styles.inputAd}>
          <div className={styles['inputAd--withIcon']}>
            <span className={styles.financesIcon}>$</span>
            <input
              type="number"
              className={styles.inputAd__textfield}
              min={50}
              max={1000}
              value={budget}
              onChange={handleInput}
              onBlur={handleFocusOut}
            />
          </div>
        </div>
      </label>
      <Slider
        className={styles.slider}
        classNameWrapper={styles.slider__wrapper}
        classNameTooltip={styles.slider__tooltip}
        labelTooltip="$"
        min={50}
        max={1000}
        colorProgress="#AFAFAF"
        colorTrack="rgba(255,255,255,0.2)"
        value={budget}
        onChange={val => setStore({ budget: val })}
      />
      <div className={styles.slider__labels}>
        <span>$50</span>
        <span>$1000</span>
      </div>
    </>
  );
};

export default FinancesSection;
