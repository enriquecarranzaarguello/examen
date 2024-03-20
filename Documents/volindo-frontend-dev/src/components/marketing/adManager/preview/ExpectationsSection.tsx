import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from '@styles/marketing.module.scss';
import { useAdFormStore } from '../context/NewAdContext';
import { useAppSelector } from '@context';

const EQUIVALENCES = {
  USD: 10,
  LEADS: 1,
  VIEWS: 500,
  CLICKS: 25,
};

const ExpectationsSection = () => {
  const couponTotal = useAppSelector(
    state => state.marketing.helpCenter.couponTotal || 0
  );

  const { t } = useTranslation();
  const [budget] = useAdFormStore(store => store.budget);
  const [days] = useAdFormStore(store => store.days);

  const [usdTen, setUsdTen] = useState(10);
  const [leads, setLeads] = useState(1);
  const [views, setViews] = useState(500);
  const [clicks, setClicks] = useState(25);

  useEffect(() => {
    let usdTen = ((budget * days + couponTotal) / 10) * 10;
    usdTen = Math.floor(usdTen);

    setUsdTen(usdTen);
    setLeads((usdTen * EQUIVALENCES.LEADS) / EQUIVALENCES.USD);
    setViews((usdTen * EQUIVALENCES.VIEWS) / EQUIVALENCES.USD);
    setClicks((usdTen * EQUIVALENCES.CLICKS) / EQUIVALENCES.USD);
  }, [budget, couponTotal, days]);

  return (
    <div className={styles.expectation__wrapper}>
      <div className={styles.expectation}>
        <span>{t('marketing.adManager.new.nLeads')}</span>
        <span>
          {usdTen} usd = {t('marketing.adManager.new.to')} {Math.floor(leads)}{' '}
          lead
        </span>
      </div>
      <div className={styles.expectation}>
        <span>{t('marketing.adManager.new.nViews')}</span>
        <span>
          {usdTen} usd = {t('marketing.adManager.new.to')} {Math.floor(views)}{' '}
          {t('marketing.adManager.new.views')}
        </span>
      </div>
      <div className={styles.expectation}>
        <span>{t('marketing.adManager.new.nClicks')}</span>
        <span>
          {usdTen} usd = {t('marketing.adManager.new.to')} {Math.floor(clicks)}{' '}
          clicks
        </span>
      </div>
    </div>
  );
};

export default ExpectationsSection;
