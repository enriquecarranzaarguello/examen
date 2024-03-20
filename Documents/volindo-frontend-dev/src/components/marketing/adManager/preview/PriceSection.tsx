import { useState, useEffect } from 'react';

import { useAdFormStore } from '../context/NewAdContext';

import { useAppDispatch, setMarketingTotalRedo } from '@context';

import styles from '@styles/marketing.module.scss';
import { useTranslation } from 'react-i18next';
import config from '@config';

const PriceSection = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [budget] = useAdFormStore(store => store.budget);
  const [days] = useAdFormStore(store => store.days);

  const [subtotal, setSubtotal] = useState(budget * days);
  const [fee, setFee] = useState(Math.round(subtotal * 0.04));
  const [total, setTotal] = useState(subtotal + fee);

  useEffect(() => {
    const subtotal = budget * days;
    const fee = Math.round(subtotal * 0.04);
    setSubtotal(subtotal);
    setFee(fee);
    setTotal(subtotal + fee);
    // new total
    dispatch(setMarketingTotalRedo(subtotal));
  }, [budget, days]);

  const checkTotalStyleWL =
    config.WHITELABELNAME === 'Volindo'
      ? styles.price__total
      : styles.price__totalWL;

  return (
    <div className={styles.price__wrapper}>
      <div className={styles.price}>
        <span>
          ${budget} x {days} {t('marketing.adManager.new.day')}
        </span>
        <span className={styles.price__number}>${subtotal}</span>
      </div>
      <div className={styles.price}>
        <span>{t('marketing.adManager.new.fee')} 4%</span>
        <span className={styles.price__number}>${fee}</span>
      </div>
      <div className={`${styles.price} ${checkTotalStyleWL}`}>
        <span>Total</span>
        <span>${total}</span>
      </div>
    </div>
  );
};

export default PriceSection;
