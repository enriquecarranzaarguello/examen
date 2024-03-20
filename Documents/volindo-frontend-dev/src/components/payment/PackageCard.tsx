import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from '@styles/payment.module.scss';

import { ModalPayment } from '@components';

//Iconns
import CheckBlue from '@icons/marketingIcons/blue-check.svg';
import ArrowRight from '@icons/marketingIcons/arrow-right-white.svg';
import CashBackIcon from '@icons/payments/cash-back.svg';
import { useTranslation } from 'react-i18next';

const PackageCard = ({
  month,
  packageName,
  includes,
  price,
  best,
  index,
}: {
  month: number;
  packageName: 'starter' | 'pro' | 'max' | 'flyway';
  includes: Object;
  price: number;
  best?: string;
  index: number;
}) => {
  const { t } = useTranslation();
  const [openPayment, setOpenPayment] = useState(false);
  const [modalData, setModalData] = useState<{
    time: number;
    type: 'starter' | 'pro' | 'max' | 'flyway';
  }>({ time: 1, type: 'flyway' });

  const handleSubmitPayment = (
    time: number,
    type: 'starter' | 'pro' | 'max' | 'flyway'
  ) => {
    setModalData({
      time,
      type,
    });
    setOpenPayment(true);
  };

  return (
    <>
      {openPayment && (
        <ModalPayment
          open={openPayment}
          onClose={() => setOpenPayment(false)}
          key={packageName}
          type={modalData.type}
          time={modalData.time}
          price={price}
        />
      )}

      <div data-testid={`flyway-plan-card-${index}`} className={styles.card}>
        {best && <span className={styles.card__best}>{best}</span>}
        <div className={styles.card__top}>
          <div className={styles.card__prices}>
            <span data-testid={`flyway-plan-card-title-${index}`}>
              {packageName}/{month != 12 ? month : 1}{' '}
              {month === 1
                ? t('paymentreg.WL.starter.month')
                : month === 12
                  ? t('paymentreg.WL.starter.year')
                  : t('paymentreg.WL.starter.months')}
            </span>
            <span data-testid={`flyway-plan-card-price-${index}`}>{price}</span>
            <span>MXN</span>
          </div>
          <hr />
          <button
            data-testid={`flyway-plan-card-button-${index}`}
            className={styles.card__button}
            onClick={() => handleSubmitPayment(month, packageName)}
          >
            <span>{t('paymentreg.WL.starter.start-now')}</span>
            <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
          </button>
          <span className={styles.card__plan}>
            {t('marketing.branding.plan')}:
          </span>
        </div>

        <div
          data-testid={`flyway-plan-card-perks-${index}`}
          className={styles.card__offers}
        >
          {Object.values(includes).map(
            (include: { text: string; bold: boolean }, index: number) => (
              <div className={styles.card__offers__option} key={index}>
                <Image src={CheckBlue} width={24} height={24} alt="Check" />
                <span>
                  {include.bold ? <b>{include.text}</b> : <>{include.text}</>}
                </span>
              </div>
            )
          )}
        </div>
        {best && (
          <Image
            className={styles.card__cashBackImg}
            src={CashBackIcon}
            width={68}
            height={43}
            alt="Cash back"
          />
        )}
      </div>
    </>
  );
};

export default PackageCard;
