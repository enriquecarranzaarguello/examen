/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Image from 'next/image';
import { format, parse, differenceInDays } from 'date-fns';
import config from '@config';
import moment from 'moment';
import { GuestSummary } from '@components';

import styles from '@styles/hotels/compontents/DetailCard.module.scss';

//Icons
import clockIcon from '@icons/clock_gray.svg';
import calendarIcon from '@icons/calendar.svg';

import { usePrice } from 'src/components/utils/Price/Price';
import { useTranslation } from 'react-i18next';

const DetailCard = ({
  data,
  dateInfo,
  paymentInfo,
  title,
  children,
}: {
  data: { title: string; content: string }[];
  dateInfo: { title: string; date: string; serviceTime: string }[];
  paymentInfo: {
    title: string;
    price: number;
    subtotal: number;
    recommendedPrice: number;
    agentCommission: number;
    transactionFee: number;
    rooms: number;
    adults: number;
    children: number;
  }[];
  title: string;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const formatDate = (dateString: string | number | Date) => {
    const date = moment(dateString);
    date.locale('en');
    return date.format('ddd D, MMM, YYYY');
  };

  const handleDaysDiference = (
    check_in: String | Date | any,
    check_out: String | Date | any
  ) => {
    const checkIn = moment(check_in, 'YYYY-MM-DD');
    const checkOut = moment(check_out, 'YYYY-MM-DD');
    return checkOut.diff(checkIn, 'days');
  };
  const TotalOfNights = Number(
    handleDaysDiference(dateInfo[0].date, dateInfo[1].date)
  );

  const price = usePrice();

  return (
    <div className={styles.card}>
      <h2 className={styles.card_title}>{title}</h2>
      <div className={styles.card_container}>
        <div className={styles.card_container_columns}>
          {data.map((item, index) => (
            <div className={styles.card_container_columns_layout} key={index}>
              <div className={styles.card_container_columns_layout_element}>
                <span
                  className={styles.card_container_columns_layout_element_title}
                >
                  {item.title}
                </span>
                <span
                  className={
                    styles.card_container_columns_layout_element_content
                  }
                >
                  {item.content}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.card_container}>
        <div className={styles.card_container_columns}>
          {dateInfo.map((item, index) => (
            <div className={styles.card_container_columns_layout} key={index}>
              <div className={styles.card_container_columns_layout_element}>
                <div
                  className={styles.card_container_columns_layout_element_title}
                >
                  {item.title}
                </div>
                <div>
                  <Image
                    src={calendarIcon}
                    alt="Calendar Icon"
                    width={12}
                    height={8}
                    loading="lazy"
                  />
                  <span
                    className={
                      styles.card_container_columns_layout_element_content
                    }
                  >
                    {formatDate(item.date)}
                  </span>
                </div>
                {!item.serviceTime.includes('null') && (
                  <div
                    className={
                      styles.card_container_columns_layout_element_content
                    }
                  >
                    <Image
                      src={clockIcon}
                      alt="Calendar Icon"
                      width={12}
                      height={8}
                      loading="lazy"
                    />
                    <span>{item.serviceTime}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.card_container}>
        {paymentInfo.map((item, index) => (
          <div key={index}>
            <h4 className={styles.card_container_titlePayment}>{item.title}</h4>
            <GuestSummary
              rooms={item.rooms}
              adults={item.adults}
              childs={item.children}
            />
            <div className={styles.card_container_separation}>
              <div className={styles.card_container_separation_info}>
                {price.countrySymbol}{' '}
                {(
                  price.integerRate(item.price - item.transactionFee) /
                  TotalOfNights
                ).toFixed(2)}{' '}
                {`x ${TotalOfNights} `}
                {TotalOfNights == 1 ? t('stays.night') : t('stays.nights')}
              </div>
              <div className={styles.card_container_separation_info}>
                {price.countrySymbol}{' '}
                {price.integerWithOneDecimal(
                  item.recommendedPrice || item.subtotal
                )}
              </div>
            </div>
            <div className={styles.card_container_separation}>
              <div className={styles.card_container_separation_info}>
                Comision de la transaccion {config.transactionfee}%
              </div>
              <div className={styles.card_container_separation_info}>
                {price.countrySymbol}{' '}
                {price.integerWithOneDecimal(item.transactionFee)}
              </div>
            </div>
            <div className={styles.card_container_separation}>
              <div className={styles.card_container_separation_remark}>
                Total
              </div>
              <div className={styles.card_container_separation_remark}>
                {price.countrySymbol} {price.integerTotal(item.price)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export default DetailCard;
