import { useState, useEffect } from 'react';
import Comission from './Comission';
import { usePrice } from '@components/utils/Price/Price';
import style from '@styles/hotels/priceDetails.module.scss';
import { useTranslation } from 'react-i18next';
import config from '@config';

const PriceSummary = ({
  total,
  totalCalc,
  commission,
  setComission,
  transactionFee,
  tax,
  numberOfNights,
}: {
  total: number;
  totalCalc: number;
  commission: string;
  setComission: any;
  transactionFee: number;
  tax: number;
  numberOfNights: number;
}) => {
  const { t } = useTranslation();
  const price = usePrice();

  return (
    <div className={style.priceDetails}>
      <div className={style.priceDetails_line}>
        <span>
          {price.countrySymbol}{' '}
          {(price.integerRate(total - tax) / numberOfNights).toFixed(1)} x{' '}
          {numberOfNights}{' '}
          {numberOfNights === 1 ? t('stays.night') : t('stays.nights')}
        </span>
        <span className={style.priceDetails_line_detail}>
          {price.countrySymbol} {price.integerWithOneDecimal(total - tax)}
        </span>
      </div>
      <div className={style.priceDetails_line}>
        <span>Tax</span>
        <span className={style.priceDetails_line_detail}>
          {price.countrySymbol} {price.integerWithOneDecimal(tax)}
        </span>
      </div>
      <div className={style.priceDetails_line}>
        <span>Subtotal</span>
        <span className={style.priceDetails_line_detail}>
          {price.countrySymbol} {price.integerWithOneDecimal(total)}
        </span>
      </div>

      <Comission
        total={totalCalc}
        commission={commission}
        setComission={setComission}
      />

      <div className={style.priceDetails_line}>
        <span>{`${t('stays.transfer_fee')} ${config.transactionfee}%`}</span>
        <span className={style.priceDetails_line_detail}>
          {price.countrySymbol} {transactionFee.toFixed(1)}
        </span>
      </div>
      <div className={style.priceDetails_line_last}>
        <span>TOTAL</span>
        <span className={style.priceDetails_line_last_detail}>
          {price.countrySymbol} {totalCalc.toFixed(1)}
        </span>
      </div>
      <div className={style.priceDetails_lastContent}>
        <label className={style.priceDetails_lastContent_text}>
          {t('stays.additional-taxes')}
        </label>
      </div>
    </div>
  );
};

export default PriceSummary;
