import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import styles from '@styles/payment.module.scss';

import { Slider } from 'rsuite';
import PackageCard from './PackageCard';

import infoIcon from '@icons/Info-circle.svg';
import { useVariableValue } from '@devcycle/react-client-sdk';
import { useSession } from 'next-auth/react';
import { getAgentWallet } from '@utils/axiosClients';

const WLPackages = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    if (session) {
      getAgentWallet(session.user.id_token)
        .then(res => {
          setTotalSales(res.data.sales.total);
        })
        .catch(err => console.error(err));
    }
  }, [session]);

  // TODO could move this into a separate file, like data ?
  const flywayPackages = [
    {
      month: 1,
      price: 2100,
      points: [
        { text: t('paymentreg.WL.starter.profile'), bold: false },
        { text: t('paymentreg.WL.starter.provider'), bold: false },
        { text: t('paymentreg.WL.starter.crm'), bold: false },
        { text: t('paymentreg.WL.starter.flights'), bold: false },
        { text: t('paymentreg.WL.starter.support'), bold: false },
        { text: t('paymentreg.WL.starter.service'), bold: false },
        { text: t('paymentreg.WL.starter.vipGroup'), bold: false },
        { text: t('paymentreg.WL.starter.additional'), bold: false },
      ],
    },
    {
      month: 3,
      price: 6000,
      points: [
        { text: t('paymentreg.WL.starter.ahorra') + ' 300 MXN', bold: true },
        { text: t('paymentreg.WL.starter.course'), bold: true },
        { text: t('paymentreg.WL.starter.logo'), bold: true },
        { text: t('paymentreg.WL.starter.accountManager'), bold: true },
        { text: t('paymentreg.WL.starter.profile'), bold: false },
        { text: t('paymentreg.WL.starter.provider'), bold: false },
        { text: t('paymentreg.WL.starter.crm'), bold: false },
        { text: t('paymentreg.WL.starter.flights'), bold: false },
        { text: t('paymentreg.WL.starter.support'), bold: false },
        { text: t('paymentreg.WL.starter.service'), bold: false },
        { text: t('paymentreg.WL.starter.vipGroup'), bold: false },
        { text: t('paymentreg.WL.starter.additional'), bold: false },
      ],
    },
    {
      month: 6,
      price: 10800,
      points: [
        { text: t('paymentreg.WL.starter.ahorra') + ' 1800 MXN', bold: true },
        { text: t('paymentreg.WL.starter.cashback'), bold: true },
        { text: t('paymentreg.WL.starter.course'), bold: true },
        { text: t('paymentreg.WL.starter.logo'), bold: true },
        { text: t('paymentreg.WL.starter.seniorAccountManager'), bold: true },
        { text: t('paymentreg.WL.starter.profile'), bold: false },
        { text: t('paymentreg.WL.starter.provider'), bold: false },
        { text: t('paymentreg.WL.starter.crm'), bold: false },
        { text: t('paymentreg.WL.starter.flights'), bold: false },
        { text: t('paymentreg.WL.starter.support'), bold: false },
        { text: t('paymentreg.WL.starter.service'), bold: false },
        { text: t('paymentreg.WL.starter.vipGroup'), bold: false },
        { text: t('paymentreg.WL.starter.additional'), bold: false },
      ],
      best: t('paymentreg.WL.starter.best-seller'),
    },
    {
      month: 12,
      price: 19200,
      points: [
        { text: t('paymentreg.WL.starter.ahorra') + ' 4200 MXN', bold: true },
        { text: t('paymentreg.WL.starter.leads'), bold: true },
        { text: t('paymentreg.WL.starter.cashback'), bold: true },
        { text: t('paymentreg.WL.starter.course'), bold: true },
        { text: t('paymentreg.WL.starter.logo'), bold: true },
        { text: t('paymentreg.WL.starter.seniorAccountManager'), bold: true },
        { text: t('paymentreg.WL.starter.profile'), bold: false },
        { text: t('paymentreg.WL.starter.provider'), bold: false },
        { text: t('paymentreg.WL.starter.crm'), bold: false },
        { text: t('paymentreg.WL.starter.flights'), bold: false },
        { text: t('paymentreg.WL.starter.support'), bold: false },
        { text: t('paymentreg.WL.starter.service'), bold: false },
        { text: t('paymentreg.WL.starter.vipGroup'), bold: false },
        { text: t('paymentreg.WL.starter.additional'), bold: false },
      ],
      best: t('paymentreg.WL.starter.best-value'),
    },
  ];

  const goals = {
    min: 0,
    max: 25000,
    actual: 18756,
  };

  const cashbackIsActive = useVariableValue('frontend_cashback', false);

  return (
    <div className="m-auto max-w-[600px] md:max-w-[1110px]">
      {/* Progress bar */}
      {cashbackIsActive ? (
        <div className="relative mt-[10px] p-[20px] pt-[15px] pb-[39px] bg-white/10 rounded-2xl mb-[20px]">
          <div className="flex items-center justify-between gap-[5px] mb-[6px] text-[16px] font-[590] text-white">
            <div className="flex gap-[5px] mb-[10px]">
              {t('paymentreg.WL.reach-money-back')}
              <Image src={infoIcon} width={16} height={16} alt="Info" />
            </div>
          </div>
          <div className="relative pointer-events-none">
            <div className="absolute -top-[5px] w-[15px] h-[15px] bg-whiteLabelColor rounded-full"></div>
            <Slider
              className="progress-slider"
              progress
              readOnly
              min={goals.min}
              max={goals.max}
              value={totalSales}
              renderTooltip={(value: number | undefined) => (
                <div>{`$${value}`}</div>
              )}
            />
            <div className="absolute top-[16px] text-[12px] font-[590] text-white">
              {totalSales >= 1000 && '0$'}
            </div>
            <div className="absolute -top-[5px] right-0 w-[15px] h-[15px] bg-[#3C3C3C] rounded-full"></div>
            <div className="absolute right-0 top-[16px] text-[12px] font-[590] text-white">
              {goals.max}$
            </div>
          </div>
        </div>
      ) : null}

      {/* End progress bar */}

      <article className={styles.branding__packages}>
        <>
          {flywayPackages.map((flywayPackage, index) => (
            <PackageCard
              key={flywayPackage.month}
              month={flywayPackage.month}
              packageName={'flyway'}
              includes={flywayPackage.points}
              price={flywayPackage.price}
              best={flywayPackage.best}
              index={index}
            />
          ))}
        </>
      </article>
    </div>
  );
};

export default WLPackages;
