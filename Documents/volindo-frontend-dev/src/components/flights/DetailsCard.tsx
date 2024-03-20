import { useMemo } from 'react';

import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import 'moment/locale/es';
import moment from 'moment';

import logoV from '@icons/noAirline.svg';
import logoFT from '@icons/noAirlineFT.svg';

import OvernightIcon from '@icons/overnightMoonWhite.svg';
import TimeIcon from '@icons/timeSandWhite.svg';

import { timeOnRange } from '@utils/timeFunctions';
import { ImageFallback } from '@components';
import config from '@config';

const Details = ({
  single,
  i,
  originalArrivalcity,
  originalDepartCity,
  totalTime,
  origin,
}: any) => {
  const { days, hours, minutes } = totalTime;
  const { t, i18n } = useTranslation('common');
  const OVERNIGHT_DEPARTURE_INF = '21:00';
  const OVERNIGHT_DEPARTURE_SUP = '24:00';
  const OVERNIGHT_ARRIVAL_INF = '06:00';
  const OVERNIGHT_ARRIVAL_SUP = '09:00';

  const logo = config.WHITELABELNAME === 'Volindo' ? logoV : logoFT;

  const isOverNight = useMemo(() => {
    const isDepartureOvernight = timeOnRange(
      single.departure_details.departure_time,
      OVERNIGHT_DEPARTURE_INF,
      OVERNIGHT_DEPARTURE_SUP
    );
    const isArrivalOvernight = timeOnRange(
      single.arrival_details.arrival_time,
      OVERNIGHT_ARRIVAL_INF,
      OVERNIGHT_ARRIVAL_SUP
    );
    return isDepartureOvernight && isArrivalOvernight;
  }, [single]);

  const formatTime = (time: string) => {
    const hour = time?.split('-')[0];
    return hour.split(':').slice(0, 2).join().replace(/,/g, ':');
  };

  const formatDate = (param: any) => {
    const language = i18n.language;
    return (
      <>
        {language === 'en' ? (
          <span>{moment(param).locale('en').format('ddd, D MMM')}</span>
        ) : (
          <span>{moment(param).locale('es').format('ddd, D MMM')}</span>
        )}
      </>
    );
  };

  const timeInAirport = (timeObj: any) => {
    const { hours, minutes } = timeObj;

    if (timeObj === 0) return '';

    return `${t('flights.time-in')} ${(hours && hours) || ''}${hours && 'h'}
    ${(minutes && minutes) || ''} ${minutes && 'm'}
    `;
  };

  const totalTravelTime = (dateObj: any) => {
    if (!!dateObj) {
      const { hours, minutes, days } =
        dateObj.total_time_formatted || dateObj.total_flight_time_formatted;

      return (
        <span>
          {!!days && days} {!!days && 'd'} {!!hours && hours} {!!hours && 'h'}{' '}
          {!!minutes && minutes} {!!minutes && 'm'}
        </span>
      );
    }
  };

  return (
    <>
      <div className="detailsFlightCard">
        {origin != 'small' && i === 0 ? (
          <div className="detailsFlightCard-title">
            <div className="detailsFlightCard-title-city">
              {originalDepartCity} - {originalArrivalcity}
            </div>

            <div className="detailsFlightCard-title-time">
              {!!days && days} {!!days && 'days'} {!!hours && hours}{' '}
              {!!hours && 'hours'} {!!minutes && minutes}{' '}
              {!!minutes && 'minutes'}
            </div>
          </div>
        ) : (
          ''
        )}

        <div className="flight-card-container-trip mt-[10px]">
          <div className="flight-card-container-trip-depart">
            <div className="flight-card-container-trip-depart-logo-container">
              <ImageFallback
                src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${single?.airline.marketing.airline_code}.svg`}
                className="flight-card-container-trip-depart-logo"
                fallbackSrc={logo.src}
              />
              <span className="flight-card-container-trip-depart-logo-name black">
                {single?.airline.marketing.airline_name}
              </span>
            </div>

            <div className="flight-card-container-trip-depart-info">
              <div className="flight-card-container-trip-depart-info-hour">
                {formatTime(single?.departure_details?.departure_time)}
              </div>

              <div className="flight-card-container-trip-depart-info-date">
                <span className="md:hidden">
                  {formatDate(single.departure_details.departure_date)}
                </span>
                <span className="hidden md:flex">
                  {single.departure_details.city_name}
                </span>
              </div>

              <div className="flight-card-container-trip-depart-info-line">
                <span className="left"></span>
                <span className="center"></span>
                <span className="right"></span>
              </div>

              <div className="flight-card-container-trip-depart-info-city">
                <span className="md:hidden">
                  {single.departure_details.city}
                </span>
                <span className="hidden md:flex">
                  {formatDate(single.departure_details.departure_date)}
                </span>
              </div>
            </div>
          </div>

          {origin != 'small' ? (
            <div className="flight-card-container-trip-time-stops">
              <div className="flight-card-container-trip-time-stops-class">
                {t('flights.flight')} {single.flight_number} {t('common.and')}
                {single.class_code}
              </div>
              <div className="flight-card-container-trip-time-stops-hours">
                {totalTravelTime(single.total_time.total_time_per_stop)}
              </div>

              <div className="flight-card-container-trip-time-stops-line">
                <span className="left">
                  <span className="hidden md:flex">
                    {single.departure_details.airport}
                  </span>
                </span>
                <span className="center"></span>
                <span className="right">
                  <span className="hidden md:flex">
                    {single.arrival_details.airport}
                  </span>
                </span>
              </div>

              <div className="flight-card-container-trip-time-stops-num"></div>
            </div>
          ) : (
            ''
          )}

          <div className="flight-card-container-trip-arrival">
            <div className="flight-card-container-trip-arrival-states"></div>
            <div className="flight-card-container-trip-arrival-container">
              <div className="flight-card-container-trip-arrival-hour">
                {formatTime(single.arrival_details.arrival_time)}
              </div>
              <div className="flight-card-container-trip-arrival-date">
                <span className="md:hidden">
                  {formatDate(single.arrival_details.arrival_date)}
                </span>
                <span className="hidden md:flex">
                  {single.arrival_details.city_name}
                </span>
              </div>

              <div className="flight-card-container-trip-arrival-line">
                <span className="left"></span>
                <span className="center"></span>
                <span className="right"></span>
              </div>

              <div className="flight-card-container-trip-arrival-city">
                <span className="md:hidden">{single.arrival_details.city}</span>
                <span className="hidden md:flex">
                  {formatDate(single.arrival_details.arrival_date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isOverNight || single.total_time.time_in_airport ? (
          <div className="detailsFlightCard-lowerbar">
            {isOverNight ? (
              <div className="detailsFlightCard-lowerbar-item">
                <div>
                  <Image
                    src={OvernightIcon}
                    alt="Overnight"
                    width={17.5}
                    height={17.5}
                  />
                </div>
                <span>{t('flights.overnight')}</span>
              </div>
            ) : null}
            {single.total_time.time_in_airport ? (
              <div className="detailsFlightCard-lowerbar-item">
                <div>
                  <Image
                    src={TimeIcon}
                    alt="Time"
                    width={12.7}
                    height={17.17}
                  />
                </div>
                <span>{timeInAirport(single.total_time.time_in_airport)}</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Details;
