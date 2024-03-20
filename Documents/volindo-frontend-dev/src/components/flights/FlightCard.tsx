import { useState, FC, useCallback, memo } from 'react';

import { useTranslation } from 'next-i18next';
import { FlightSegment } from '@components';

import SearchLoader from '@components/SearchLoader';

import { setSelectedFlight, useAppDispatch } from '@context';
import { FlightsService } from '@services/FlightsService';
import { StopsDetailsType } from '@typing/types';

import { Itinerary, Flight } from '@context/slices/flightSlice/flightSlice';
import { usePrice } from '@components/utils/Price/Price';

const FlightCard: FC<{
  itinerary: Itinerary;
  onError: (_ex: any) => void;
  onShowStops: (stopsData: StopsDetailsType) => void;
}> = ({ itinerary, onError, onShowStops }) => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const [isRevalidating, setIsRevalidating] = useState(false);

  const price = usePrice();

  const { total_price: priceObj, general_details } = itinerary;

  const selectTrip = () => {
    setIsRevalidating(true);
    const isDuffel = general_details?.provider_data?.provider === 'Duffel';

    const service = new FlightsService(null, isDuffel);

    service
      .revalidate(itinerary.general_details.type_of_passengers, itinerary)
      .then(data => {
        dispatch(setSelectedFlight(data));
        window.open(
          `${window.location.protocol}//${window.location.host}/booking-flight/proposal`
        );
      })
      .catch(err => {
        onError(err);
        console.error('Error with revalidate :', err);
      })
      .finally(() => {
        setIsRevalidating(false);
      });
  };

  const { general_details: general } = itinerary;

  const obtainFlightType = () => {
    const obj: any = {
      O: t('flights.one-way'),
      R: t('flights.roundtrip'),
      M: t('flights.multi-city'),
    };

    return obj[general.type_of_trip];
  };

  const handleObtainCarryon = (policies: any) => {
    return (
      <div>
        {policies.carry_on_available && <p>{t('flights.luggage.carry-on')}</p>}
      </div>
    );
  };

  const handleObtainChecked = (policies: any) => {
    return (
      <div>
        {policies.checked_baggage_available && (
          <p>{t('flights.luggage.documented')}</p>
        )}
      </div>
    );
  };

  const handleLoader = (isLoading: boolean) => {
    if (isLoading) return <SearchLoader />;
    else return t('common.select');
  };

  const showStops = useCallback((flight: Flight) => {
    onShowStops({
      stops: flight.stops,
      totalTimeFormated: flight.total_time.total_time_formatted,
      originalDepartCity: flight.departure_details.city_name,
      originalArrivalcity: flight.arrival_details.city_name,
      itinerary: itinerary,
    });
  }, []);

  return (
    <>
      <div className="flight-card">
        <div className="flight-card-container">
          {itinerary.flights.map(flight => {
            return (
              <FlightSegment
                key={flight.flight_number}
                flight={flight}
                showStops={showStops}
              />
            );
          })}
        </div>

        <div className="flight-card-submit">
          <div className="flight-card-submit-details hidden md:flex text-end">
            <span>
              {general.total_travelers}{' '}
              {t(`common.${general.total_travelers > 1 ? 'people' : 'person'}`)}
            </span>
            <span>{obtainFlightType()}</span>
            <span>{handleObtainCarryon(general)}</span>
            <span>{handleObtainChecked(general)}</span>
            <span> {t(`flights.classes.${general.class_of_service}`)} </span>
          </div>

          <div className="flight-card-submit-container">
            <p className="flight-card-submit-container-text">
              <span className="amount mt-[5px]">
                {price.countrySymbol}
                {price.integerTotal(priceObj.total_price)}
              </span>
              <span className="text">{t('flights.total')}</span>
            </p>

            <button
              className="flight-card-submit-container-button customTailwind"
              onClick={selectTrip}
              disabled={isRevalidating}
            >
              {handleLoader(isRevalidating)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(FlightCard);
