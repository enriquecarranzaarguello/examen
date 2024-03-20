import React from 'react';
import styles from './PriceSummary.module.scss';
import { useTranslation } from 'react-i18next';
import config from '@config';

interface PriceSummaryProps {
  numberOfNights?: number;
  numberOfPeople?: number;
  total: number;
  commission: number;
  transactionFee: number;
  calculatedTotal: number;
  countrySymbol: string;
}

const PriceSummary = ({
  numberOfNights,
  numberOfPeople,
  total,
  commission,
  transactionFee,
  calculatedTotal,
  countrySymbol,
}: PriceSummaryProps) => {
  const { t } = useTranslation();
  const companyComission = config.transactionfee;

  return (
    <div className={styles.pricesummary_total}>
      <h5 className={styles.pricesummary_total_title}>
        {' '}
        {t('stays.priceSummary')}
      </h5>
      {!!numberOfNights && numberOfNights > 0 && (
        <div className={styles.pricesummary_total_data}>
          {numberOfNights === 1 ? (
            <span>
              {countrySymbol}
              {total} {t('stays.night')}
            </span>
          ) : (
            <span>
              {countrySymbol} {(total / numberOfNights).toFixed(1)} x{' '}
              {numberOfNights} {t('stays.nights')}
            </span>
          )}
          <span>
            {countrySymbol} {total}
          </span>
        </div>
      )}
      {!!numberOfPeople && numberOfPeople > 0 && (
        <div className={styles.pricesummary_total_data}>
          <span>
            {countrySymbol} {(total / numberOfPeople).toFixed(1)} x{' '}
            {numberOfPeople} {numberOfPeople === 1 ? 'persona' : 'personas'}
          </span>
          <span>
            {countrySymbol} {total}
          </span>
        </div>
      )}
      <div className={styles.pricesummary_total_data}>
        <span>{t('stays.agent-commission')}</span>
        <span>
          {countrySymbol}
          {commission.toFixed(1)}
        </span>
      </div>
      <div className={styles.pricesummary_total_data}>
        <span>
          {' '}
          {t('stays.transfer_fee')} {companyComission}%
        </span>
        <span>
          {countrySymbol}
          {transactionFee.toFixed(1)}
        </span>
      </div>
      <div className={styles.pricesummary_total_data}>
        <span className={styles.pricesummary_total_data_total}>Total</span>
        <span className={styles.pricesummary_total_data_total}>
          {countrySymbol}
          {calculatedTotal.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

export default PriceSummary;
