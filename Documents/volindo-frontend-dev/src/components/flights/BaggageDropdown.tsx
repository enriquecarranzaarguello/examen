import { useState, useEffect } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import ArrowIcon from '@icons/arrow-down.svg';
import Suitcase from '@icons/suitcase-outline.svg';

import { changeCurrency } from 'src/helpers/exchangeCurrencyCalculation';
import { useAppSelector } from '@context';

const BaggageDropdown = ({ flightPolicies }: any) => {
  const { t } = useTranslation('common');

  const IndivudualComponent = ({ policy, index }: any) => {
    const [isMinHeight, setIsMinHeight] = useState(false);
    const [smallestCarry, setSmallestCarry] = useState({});
    const [smallestChecked, setSmallestChecked] = useState({});

    let style = {
      isMinHeight: isMinHeight ? '0px' : '80px',
      overFlow: isMinHeight ? 'hidden' : 'visible',
      rotation: isMinHeight ? '0deg' : '180deg',
    };

    // eslint-disable-next-line
    const { flight_policies_per_segment } = policy;
    // eslint-disable-next-line
    const { baggage_policies } = flight_policies_per_segment[0];

    const handleHieghtChange = () => {
      setIsMinHeight(!isMinHeight);
    };

    const handleCarryOn = (param: any) => {
      return `${param.count} ${t('flights.luggage.carry-on')}`;
    };

    const handleCheckedBaggage = (param: any) => {
      return `${param.count} ${t('flights.luggage.documented')}`;
    };

    const unifyAllbaggage = () => {
      let arrCarryon: any = [];
      let arrCheckedBaggage: any = [];

      flight_policies_per_segment.forEach((segment: any) => {
        segment.baggage_policies.forEach((x: any) => {
          if (x.count > 0 && x.provision_type === 'B') {
            arrCarryon.push(x);
          } else if (x.count > 0 && x.provision_type === 'A') {
            arrCheckedBaggage.push(x);
          }
        });
      });

      const smallestCountObject =
        Object.keys(arrCarryon).length &&
        arrCarryon.reduce((smallest: any, current: any) => {
          if (current.count < smallest.count) {
            return current;
          }
          return smallest;
        });

      const smallestCheckedObject =
        Object.keys(arrCheckedBaggage).length &&
        arrCheckedBaggage?.reduce((smallest: any, current: any) => {
          if (current.count < smallest.count) {
            return current;
          }
          return smallest;
        });

      setSmallestCarry(smallestCountObject);
      setSmallestChecked(smallestCheckedObject);
    };

    const travelerType = (param: any) => {
      const types: any = {
        ADT: t('flights.adult'),
        CHD: t('stays.child'),
        INF: t('flights.infant'),
      };
      return types[param];
    };

    const checkUrl = () => {
      const url = window.location.pathname;
      const urlParams = url.split('/');

      return (
        urlParams.includes('express-pay') ||
        urlParams.includes('thank-you') ||
        urlParams.includes('confirmation')
        // urlParams.includes('payment')
      );
    };

    const exchangeCurrencyNumber = useAppSelector(
      state => state.general.currency.currencyNumber
    );
    const exchangeCurrencySymbol = useAppSelector(
      state => state.general.currency.currencySymbol
    );

    useEffect(() => {
      unifyAllbaggage();
    }, []);

    return (
      <>
        {checkUrl() ? (
          <>
            {Object.keys(smallestCarry).length > 0 && (
              <p
                key={index}
                className="flex justify-between w-full items-center mb-[5px]"
              >
                <span className="flex items-center">
                  <span
                    className={`${
                      window.location.pathname
                        .split('/')
                        .includes('confirmation')
                        ? 'text-black'
                        : 'text-white/[0.7] md:mt-[5px]'
                    } text-[14px] font-[510] tracking-[0.14px]`}
                  >
                    {handleCarryOn(smallestCarry)}
                  </span>
                </span>

                <span
                  className={`text-[14px] font-[400] tracking-[0.14px] ${
                    window.location.pathname.split('/').includes('confirmation')
                      ? 'text-black'
                      : 'text-white'
                  }`}
                >
                  {exchangeCurrencySymbol}
                  {changeCurrency(0, exchangeCurrencyNumber)}
                </span>
              </p>
            )}
            {Object.keys(smallestChecked).length > 0 && (
              <p key={index} className="flex justify-between w-full m-0">
                <span className="flex items-center">
                  <span
                    className={`${
                      window.location.pathname
                        .split('/')
                        .includes('confirmation')
                        ? 'text-black'
                        : 'text-white/[0.7] md:mt-[5px]'
                    } text-[14px] font-[510] tracking-[0.14px]`}
                  >
                    {handleCheckedBaggage(smallestChecked)}
                  </span>
                </span>

                <span
                  className={`text-[14px] font-[400] tracking-[0.14px] ${
                    window.location.pathname.split('/').includes('confirmation')
                      ? 'text-black'
                      : 'text-white'
                  }`}
                >
                  {exchangeCurrencySymbol}
                  {changeCurrency(0, exchangeCurrencyNumber)}
                </span>
              </p>
            )}
          </>
        ) : (
          <>
            <div
              key={index}
              className="baggage-header flex justify-between w-full mb-[20px]"
            >
              <p className="flex">
                <Image
                  src={Suitcase}
                  width={24}
                  height={24}
                  alt="Luggage icon"
                />
                <span className="ml-[10px]">
                  {t('common.bags')}{' '}
                  {`( ${travelerType(
                    policy.volindo_passenger_type || policy.passenger_type
                  )} )`}
                </span>
              </p>
              <Image
                src={ArrowIcon}
                width={10}
                height={10}
                alt="arrow"
                style={{ rotate: `${style.rotation}` }}
                onClick={handleHieghtChange}
                className="cursor-pointer"
              />
            </div>

            <div
              className="flex w-full baggage-container items-baseline flex-wrap "
              style={{
                // minHeight: `${style.isMinHeight}`,
                maxHeight: `${style.isMinHeight}`,
                overflow: `${style.overFlow}`,
              }}
            >
              {Object.keys(smallestCarry).length > 0 && (
                <p
                  key={index}
                  className="flex justify-between w-full mb-[16px]"
                >
                  <span className="flex items-center">
                    <input
                      className="h-[18px] w-[18px]"
                      type="radio"
                      name="baggage"
                      id="html"
                      value="HTML"
                      checked={true}
                      style={{ accentColor: process.env.BASICCOLOR }}
                    />
                    <span className="ml-[10px] text-[14px] font-[510] tracking-[0.14px]">
                      {handleCarryOn(smallestCarry)}
                    </span>
                  </span>

                  <span className="text-[14px] font-[400] traking-[0.14px] opacity-[0.47999998927116394]">
                    {exchangeCurrencySymbol}
                    {changeCurrency(0, exchangeCurrencyNumber)}
                  </span>
                </p>
              )}
              {Object.keys(smallestChecked).length > 0 && (
                <p
                  key={index}
                  className="flex justify-between w-full mb-[16px]"
                >
                  <span className="flex items-center">
                    <input
                      className="h-[18px] w-[18px]"
                      type="radio"
                      name="baggage"
                      id="html"
                      value="HTML"
                      checked={true}
                      style={{ accentColor: process.env.BASICCOLOR }}
                    />
                    <span className="ml-[10px] text-[14px] font-[510] tracking-[0.14px]">
                      {handleCheckedBaggage(smallestChecked)}
                    </span>
                  </span>

                  <span className="text-[14px] font-[400] traking-[0.14px] opacity-[0.47999998927116394]">
                    {exchangeCurrencySymbol}
                    {changeCurrency(0, exchangeCurrencyNumber)}
                  </span>
                </p>
              )}
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="w-full">
      {/* section per traveler */}
      {flightPolicies?.map((policy: any, index: number) => (
        <IndivudualComponent policy={policy} index={index} key={index} />
      ))}
    </div>
  );
};

export default BaggageDropdown;
