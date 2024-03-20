import { useTranslation } from 'react-i18next';
import { Flight } from '@context/slices/flightSlice/flightSlice';
import config from '@config';
import { ImageFallback } from '@components';
import { timeOnRange, passStringToDate } from '@utils/timeFunctions';
import Image from 'next/image';
import OvernightIcon from '@icons/overnightMoon.svg';
import logoV from '@icons/noAirline.svg';
import logoFT from '@icons/noAirlineFT.svg';

const LOGO = config.WHITELABELNAME === 'Volindo' ? logoV : logoFT;
const OVERNIGHT_DEPARTURE_INF = '21:00';
const OVERNIGHT_DEPARTURE_SUP = '24:00';
const OVERNIGHT_ARRIVAL_INF = '06:00';
const OVERNIGHT_ARRIVAL_SUP = '09:00';

const formatTime = (time: string) => {
  const hour = time?.split('-')[0].slice(0, 5);
  return hour;
};

const formatTotalTravelTime = (
  time: Flight['total_time']['total_time_formatted']
) => {
  return (
    <span>
      {!!time.days && `${time.days}d`} {!!time.hours && `${time.hours}h`}{' '}
      {!!time.minutes && `${time.minutes}m`}
    </span>
  );
};

const checkIfIsOvernight = (flight: Flight) => {
  const isDepartureOvernight = timeOnRange(
    flight.departure_details.departure_time,
    OVERNIGHT_DEPARTURE_INF,
    OVERNIGHT_DEPARTURE_SUP
  );
  const isArrivalOvernight = timeOnRange(
    flight.arrival_details.arrival_time,
    OVERNIGHT_ARRIVAL_INF,
    OVERNIGHT_ARRIVAL_SUP
  );

  const isOnStopsOvernight = flight.stops.some((stop: any) => {
    const isStopDepOvernigt = timeOnRange(
      stop.departure_details.departure_time,
      OVERNIGHT_DEPARTURE_INF,
      OVERNIGHT_DEPARTURE_SUP
    );
    const isStopArrOvernigt = timeOnRange(
      stop.arrival_details.arrival_time,
      OVERNIGHT_ARRIVAL_INF,
      OVERNIGHT_ARRIVAL_SUP
    );
    return isStopDepOvernigt && isStopArrOvernigt;
  });

  return (isDepartureOvernight && isArrivalOvernight) || isOnStopsOvernight;
};

const FlightSegment = ({
  flight,
  showStops,
}: {
  flight: Flight;
  showStops: (flight: Flight) => void;
}) => {
  const { t, i18n } = useTranslation('common');
  const isOverNight = checkIfIsOvernight(flight);
  const airlineCode = flight.departure_details.airline.marketing.airline_code;

  const handleStops = () => {
    showStops(flight);
  };

  return (
    <div className="flight-card-container-trip returnFlight multi">
      <div className="flight-card-container-trip-depart">
        <div className="flight-card-container-trip-depart-logo-container">
          <ImageFallback
            src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${airlineCode}.svg`}
            className="flight-card-container-trip-depart-logo"
            fallbackSrc={LOGO.src}
          />
          <span className="flight-card-container-trip-depart-logo-name">
            {flight.departure_details.airline.marketing.airline_name}
          </span>
        </div>

        <div className="flight-card-container-trip-depart-info">
          <div className="flight-card-container-trip-depart-info-hour">
            {formatTime(flight.departure_details.departure_time)}
          </div>

          <div className="flight-card-container-trip-depart-info-date">
            <span className="md:hidden">
              {passStringToDate(
                flight.departure_details.departure_date,
                i18n.language
              )}
            </span>
            <span className="hidden md:flex">
              {flight.departure_details.city_name}
            </span>
          </div>

          <div className="flight-card-container-trip-depart-info-line">
            <span className="left"></span>
            <span className="center"></span>
            <span className="right"></span>
          </div>

          <div className="flight-card-container-trip-depart-info-city">
            <span className="md:hidden">
              {flight.departure_details.airport}
            </span>
            <span className="hidden md:flex">
              {passStringToDate(
                flight.departure_details.departure_date,
                i18n.language
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flight-card-container-trip-time-stops">
        <div className="flight-card-container-trip-time-stops-hours">
          {formatTotalTravelTime(flight.total_time.total_time_formatted)}
        </div>

        <div className="flight-card-container-trip-time-stops-line">
          <span className="left">
            <span className="hidden md:block depart-city">
              {flight.departure_details.airport}
            </span>
          </span>
          <span className="center"></span>
          <span className="right">
            <span className="hidden md:block arrival-city">
              {flight.arrival_details.airport}
            </span>
          </span>
        </div>

        <div className="flight-card-container-trip-time-stops-num">
          <div
            className={`${flight.stops.length === 0 ? 'hidden' : ''}`}
            onClick={handleStops}
          >
            {flight.stops.length - 1} stop
          </div>
        </div>
      </div>

      <div className="flight-card-container-trip-arrival">
        <div className="flight-card-container-trip-arrival-states">
          <div className={`state ${isOverNight ? '' : 'hidden'}`}>
            <Image
              src={OvernightIcon}
              alt="Overnight"
              width={17.5}
              height={17.5}
            />
            <span>{t('flights.overnight')}</span>
          </div>
        </div>
        <div className="flight-card-container-trip-arrival-container">
          <div className="flight-card-container-trip-arrival-hour">
            {formatTime(flight.arrival_details.arrival_time)}
          </div>

          <div className="flight-card-container-trip-arrival-date">
            <span className="md:hidden">
              {passStringToDate(
                flight.arrival_details.arrival_date,
                i18n.language
              )}
            </span>
            <span className="hidden md:flex">
              {flight.arrival_details.city_name}
            </span>
          </div>

          <div className="flight-card-container-trip-arrival-line">
            <span className="left"></span>
            <span className="center"></span>
            <span className="right"></span>
          </div>

          <div className="flight-card-container-trip-arrival-city">
            <span className="md:hidden">{flight.arrival_details.airport}</span>
            <span className="hidden md:flex">
              {passStringToDate(
                flight.arrival_details.arrival_date,
                i18n.language
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSegment;
