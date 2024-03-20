import React, { useState, useEffect } from 'react';

import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import staysIcon from '@icons/stays.svg';
import flightsIcon from '@icons/flights.svg';
import carIcon from '@icons/car.svg';
import { useVariableValue } from '@devcycle/react-client-sdk';

import style from './vertical-selector.module.scss';

const VerticalSelector = ({ triggerHandle, origin, serviceType }: any) => {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const showSelector = useVariableValue('vertical-selector', true);

  const [tab, setTab] = useState('Stays');

  useEffect(() => {
    const tester = serviceType === 'flights' ? 'Flights' : 'Stays';
    setTab(tester);
  }, []);

  const redirectToSignUp = () => {
    router.push('/signin');
  };

  const handleChangeTab = (tab: string) => {
    if (!session) {
      redirectToSignUp();
      return;
    }
    triggerHandle(tab);

    setTab(tab);
  };

  return (
    <>
      {' '}
      {showSelector ? (
        <div
          data-testid="vertical-selector"
          className={`${style.container} ${
            origin === 'modal' ? style.container_change : ''
          }`}
        >
          <button
            disabled={serviceType !== 'Stays' && origin === 'modal'}
            data-testid="vertical-stays"
            onClick={() => handleChangeTab('Stays')}
            className={`${style.container_button} ${
              tab === 'Stays' || serviceType === 'Stays'
                ? style.container_button__selected
                : ''
            }`}
          >
            <Image
              alt="icon"
              src={staysIcon}
              className={`${
                tab !== 'Stays' && 'invert'
              }  xs:w-[13px] xxs:w-[10px]`}
            />{' '}
            {t('home.stays')}
          </button>

          <button
            disabled={serviceType !== 'Flights' && origin === 'modal'}
            data-testid="vertical-flights"
            onClick={() => handleChangeTab('Flights')}
            className={`${style.container_button} ${
              tab === 'Flights' || serviceType === 'Flights'
                ? style.container_button__selected
                : ''
            }`}
          >
            <Image
              alt="icon"
              src={flightsIcon}
              className={`${
                tab === 'Flights' && 'invert'
              } xs:w-[13px] xxs:w-[10px]`}
            />{' '}
            {t('home.flights')}
          </button>

          <button
            disabled={origin === 'modal'}
            data-testid="vertical-suppliers"
            onClick={() => handleChangeTab('Suppliers')}
            className={`${style.container_button} ${
              tab === 'Suppliers' ? style.container_button__selected : ''
            }`}
          >
            <Image
              alt="icon"
              src={carIcon}
              className={`${
                tab === 'Suppliers' ? '' : 'invert'
              }  xs:w-[13px] xxs:w-[10px]`}
            />{' '}
            {t('home.suppliers')}
          </button>
        </div>
      ) : null}
    </>
  );
};

export default VerticalSelector;
