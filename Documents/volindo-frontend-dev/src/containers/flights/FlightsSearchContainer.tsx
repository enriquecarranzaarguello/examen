import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import CustomSearch from './CustomSearch';
import { RadioGroup, Radio } from 'rsuite';
import { TravelersClass } from '@components';

import {
  setIsLoadingSkeletons,
  useAppDispatch,
  useAppSelector,
  setFlightType,
  addFlightSegment,
  removeFlightSegment,
  resetRoundTrip,
  setRoundTrip,
} from '@context';

import { useRouter } from 'next/router';
import SearchLoader from '@components/SearchLoader';
import { FlightType } from '@context/slices/flightSlice/flightSlice';
import { createSearchFlightQueryString } from '@utils/urlFunctions';

interface FlightsSearchContainerProps {
  redirect: boolean;
  className?: string;
  isPurple?: boolean;
  onSearch?: (searchParams: string) => void;
}

const FlightsSearchContainer = ({
  redirect,
  className = '',
  isPurple,
  onSearch,
}: FlightsSearchContainerProps) => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [windowSize, setWindowSize] = useState(0);
  const isLoadingSkeletons = useAppSelector(
    state => state.flights.isLoadingSkeletons
  );
  const isLoadingAllItineraries = useAppSelector(
    state => state.flights.isLoadingAllItineraries
  );

  const segments = useAppSelector(state => state.flights.segments);
  const passengers = useAppSelector(state => state.flights.passengers);
  const flightClass = useAppSelector(state => state.flights.class);
  const flightType = useAppSelector(state => state.flights.flightType);

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlerSetTrip = (value: any) => {
    dispatch(setFlightType(value));
    if (value === 'round trip') {
      dispatch(setRoundTrip());
    } else {
      dispatch(resetRoundTrip());
    }
    if (value === 'multi trips') {
      dispatch(addFlightSegment());
      return;
    }
  };

  const handleSubmit = () => {
    dispatch(setIsLoadingSkeletons(true));

    const params = createSearchFlightQueryString(
      flightType,
      flightClass,
      passengers,
      segments
    );

    router.push(`/booking-flight?${params}`, undefined, { shallow: true });

    if (onSearch) onSearch(params);
  };

  const addFlight = () => {
    dispatch(addFlightSegment());
  };

  const removeFlight = () => {
    dispatch(removeFlightSegment());
  };

  return (
    <div
      data-testid="flight-search-container"
      className={`flight-search-container mb-[30px] flex justify-center flex-col md:mb-0 ${
        !redirect
          ? 'items-end self-end lg:max-w-[1500px]'
          : 'items-center md:max-w-[855px] '
      } w-[100%] ${className}`}
    >
      <div
        className={`radio-container justify-center flex mb-[19px] md:mb-[13px] w-[100%] md:justify-between md:px-[14px] md:items-end`}
      >
        <RadioGroup
          inline
          name="radio-name"
          value={flightType}
          onChange={handlerSetTrip}
          className="radio-container-cont text-white"
        >
          <Radio
            className="radio-container-cont-item h-[22px] text-[13px]"
            value="round trip"
          >
            {t('flights.roundtrip')}
          </Radio>

          <Radio
            className="radio-container-cont-item h-[22px] text-[13px]"
            value="one way"
          >
            {t('flights.one-way')}
          </Radio>
          <Radio
            className="radio-container-cont-item h-[22px] text-[13px]"
            value="multi trips"
          >
            {t('flights.multi-city')}
          </Radio>
        </RadioGroup>

        {redirect ? (
          <div className="topButton webButton hidden lg:flex">
            <TravelersClass windowSize={windowSize} />
          </div>
        ) : null}
      </div>

      {/* form */}
      {flightType === 'round trip' || flightType === 'one way' ? (
        <CustomSearch
          isPurple={isPurple}
          index={0}
          onSubmit={handleSubmit}
          windowSize={windowSize}
          isResultsView={!redirect}
          isLoading={isLoadingSkeletons || isLoadingAllItineraries}
        />
      ) : (
        <>
          {segments.map((item: any, i: number) => (
            <CustomSearch
              isPurple={isPurple}
              windowSize={windowSize}
              index={i}
              key={i}
              onSubmit={handleSubmit}
              isResultsView={!redirect}
              isLoading={isLoadingSkeletons || isLoadingAllItineraries}
            />
          ))}

          <div className="flex justify-between items-center w-[inherit] p-[5px] flex-wrap px-[20px]  md:flex-nowrap md:pr-[0px] ">
            <div className="flex w-[inherit] items-center justify-between h-[72px] md:justify-center md:w-[50%] md:flex-col  md:items-baseline">
              <button
                disabled={segments.length > 5}
                onClick={addFlight}
                className="text-white"
              >
                <span className="mx-[10px]"> + </span> {t('flights.add')}
              </button>

              <button
                disabled={segments.length < 3}
                onClick={removeFlight}
                className="text-white"
              >
                <span className="mx-[10px]"> - </span> {t('flights.remove')}
              </button>
            </div>

            <button
              className={`multiCitiesSubmit mr-[2px] text-white w-full h-[48px] disabled:cursor-not-allowed customTailwind flex justify-center items-center ${
                !redirect ? 'bg-whiteLabelColor' : 'bg-black'
              } rounded-[25px] md:w-[116px] md:rounded-[32px] ${
                flightType === FlightType.M ? 'change' : ''
              }`}
              disabled={isLoadingSkeletons || isLoadingAllItineraries}
              onClick={handleSubmit}
            >
              {isLoadingSkeletons || isLoadingAllItineraries ? (
                <SearchLoader />
              ) : (
                t('common.search')
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FlightsSearchContainer;
