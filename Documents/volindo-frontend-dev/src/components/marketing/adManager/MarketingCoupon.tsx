import React, { useEffect, useState } from 'react';

import { useAdFormStore } from './context/NewAdContext';
import { useTranslation } from 'react-i18next';
import {
  setCouponCode,
  useAppDispatch,
  useAppSelector,
  setMarketingTotalRedo,
  setCouponTotal,
} from '@context';
import { Loader } from 'rsuite';
import { getMarketingCoupons } from '@utils/axiosClients';

import style from '@styles/marketing-coupons.module.scss';

const MarketingCoupon = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const [budget] = useAdFormStore(store => store.budget);
  const marketingState = useAppSelector(state => state.marketing);
  const newMarketingState = useAppSelector(
    state => state.marketing.helpCenter.marketingTotal
  );

  const [coupon, setCoupon] = useState('');
  const [textColor, setTextColor] = useState('');
  const [couponText, setCouponText] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(setCouponTotal(0));
  }, []);

  const handleValueChange = (value = '') => {
    setCoupon(value);
  };

  const setBody = (param: any) => {
    dispatch(
      setCouponCode({
        code: coupon,
        budget: total,
        percent: Number(param.fields.Percentage),
      })
    );

    setPercentage(Number(param.fields.Percentage));
  };

  const checkCoupon = () => {
    const body = { coupon_name: coupon };
    setLoading(true);

    getMarketingCoupons(body)
      .then(res => {
        if (res.data.exists === true) {
          setBody(res.data.data[0]);
          setTextColor('#aacd5f');
          setCouponText(t('marketing.coupon.valid') || '');
          setTotal(newMarketingState);
          setLoading(false);
        }

        if (res.data.exists === false) {
          setTextColor('red');
          setCouponText(t('marketing.coupon.not-valid') || '');
          setPercentage(0);
          setTotal(0);
          setLoading(false);
          dispatch(setMarketingTotalRedo(0));
          dispatch(setCouponTotal(0));
        }
      })

      .catch(err => {
        console.error('error marketing coupon', err);
      });
  };

  const calculateBudget = () => {
    const total = newMarketingState;
    const result = total && total * (percentage / 100);
    dispatch(setCouponTotal(result));

    return (
      <span>
        {result > 0 && ' $ '}
        {result > 0 && Math.floor(result)}
      </span>
    );
  };

  return (
    <>
      <div className={style.container}>
        <p className={style.container_title}>{t('marketing.coupon.title')}</p>

        <input
          className={style.container_input}
          type="text"
          value={coupon}
          onChange={event => handleValueChange(event.target.value)}
          placeholder={`${t('marketing.coupon.placeholder')}`}
        />

        <span
          style={{
            color: `${textColor}`,
          }}
        >
          {couponText && calculateBudget()} {couponText}
        </span>

        <button className={style.container_button} onClick={checkCoupon}>
          {loading && <Loader />}

          {!loading && t('marketing.coupon.button')}
        </button>
      </div>
    </>
  );
};

export default MarketingCoupon;
