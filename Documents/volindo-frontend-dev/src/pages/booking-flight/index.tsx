import { useCallback, useEffect, useMemo, useState } from 'react';

import CardContainer from 'src/components/flights/CardContainer';
import { FlightsSearchContainer } from '@containers';
import { LocationTabs, SEO, InfoPopup } from '@components';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import nextI18NextConfig from 'next-i18next.config.js';
import { useTranslation } from 'react-i18next';

import type { GetServerSidePropsContext } from 'next';
import ActualFlight from 'src/components/flights/ActualFlight';
import FlightsFilter from 'src/components/filters/FlightsFilter';
import { AvailableFilters, FilterFlights } from 'src/common/schemas/filters';

import { timeOnRange } from '@utils/timeFunctions';
import { useAppSelector, useAppDispatch, filterFlightResults } from '@context';
import { MetadataFlightRequest, NextPageWithLayout } from '@typing/types';
import { getLayout } from '@layouts/MainLayout';
import { useSearchParams } from 'next/navigation';
import { decodeSearchFlightQueryString } from '@utils/urlFunctions';
import { FlightsService } from '@services/FlightsService';
import {
  FlightClassCode,
  GeneralDetails,
  Itinerary,
  addFlighsOnResults,
  setFlightClass,
  setFlightResults,
  setFlightType,
  setIsLoadingAllItineraries,
  setIsLoadingSkeletons,
  setPassengers,
  setSegments,
} from '@context/slices/flightSlice/flightSlice';

const FlightSearchResults: NextPageWithLayout = () => {
  const TOTAL_ITINERARY_BATCHES = 4;
  // Hooks
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  // Query params
  const queryParams = useSearchParams();
  // Data of flights
  const passengers = useAppSelector(state => state.flights.passengers);
  const segments = useAppSelector(state => state.flights.segments);
  const searchResults = useAppSelector(state => state.flights.results);
  // State for window size
  const [windowSize, setWindowSize] = useState(0);
  // State for toggle searchBar and filters on mobile
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);
  // State for popup
  const [openPopup, setOpenPopup] = useState(false);
  const [titlePopup, setTitlePopup] = useState('');
  const [messagePopup, setMessagePopup] = useState('');
  const [contentPopup, setContentPopup] = useState(<></>);
  // Percentage
  const [percentageItineraries, setPercentageItineraries] = useState(0);

  // * MEMOIZED VALUES *
  // Creation of airline list
  const listAirlines = useMemo(() => {
    const airlinesSet = new Set<string>();
    searchResults.forEach((itinerary: any) => {
      itinerary.flights.forEach((flight: any) => {
        airlinesSet.add(flight.arrival_details.airline.marketing.airline_name);
        airlinesSet.add(
          flight.departure_details.airline.marketing.airline_name
        );
      });
    });
    return Array.from(airlinesSet).sort((a, b) => a.localeCompare(b));
  }, [searchResults]);

  const availableFilters: AvailableFilters = useMemo(() => {
    // Variables for stop counts
    let areNonstops = false;
    let are1Stop = false;
    let areMore2Stops = false;

    // Variables for departure times
    let departureEarly = false;
    let departureMorning = false;
    let departureAfternoon = false;
    let departureEvening = false;

    // Variables for arrival times
    let arrivalEarly = false;
    let arrivalMorning = false;
    let arrivalAfternoon = false;
    let arrivalEvening = false;

    // Variables for baggage availability
    let areCarryOnBaggage = false;
    let areCheckedBaggage = false;
    let arePersonalItemOnly = false;

    const checkStops = (stops: any[]) => {
      const length = stops.length;
      if (length === 0) areNonstops = true;
      else if (length === 2) are1Stop = true;
      else if (length > 2) areMore2Stops = true;
    };

    const checkTime = (
      time: string,
      early: string,
      late: string,
      setter: (value: boolean) => void
    ) => {
      if (timeOnRange(time, early, late)) setter(true);
    };

    searchResults.forEach((itinerary: any) => {
      itinerary.flights.forEach((flight: any) => {
        checkStops(flight.stops);
        checkTime(
          flight.departure_details.departure_time,
          '00:00',
          '04:59',
          value => (departureEarly = value)
        );
        checkTime(
          flight.departure_details.departure_time,
          '05:00',
          '11:59',
          value => (departureMorning = value)
        );
        checkTime(
          flight.departure_details.departure_time,
          '12:00',
          '17:59',
          value => (departureAfternoon = value)
        );
        checkTime(
          flight.departure_details.departure_time,
          '18:00',
          '23:59',
          value => (departureEvening = value)
        );
        checkTime(
          flight.arrival_details.arrival_time,
          '00:00',
          '04:59',
          value => (arrivalEarly = value)
        );
        checkTime(
          flight.arrival_details.arrival_time,
          '05:00',
          '11:59',
          value => (arrivalMorning = value)
        );
        checkTime(
          flight.arrival_details.arrival_time,
          '12:00',
          '17:59',
          value => (arrivalAfternoon = value)
        );
        checkTime(
          flight.arrival_details.arrival_time,
          '18:00',
          '23:59',
          value => (arrivalEvening = value)
        );
      });

      if (
        itinerary.general_details.carry_on_available &&
        !itinerary.general_details.checked_baggage_available
      )
        areCarryOnBaggage = true;
      if (itinerary.general_details.checked_baggage_available)
        areCheckedBaggage = true;
      if (
        !itinerary.general_details.carry_on_available &&
        !itinerary.general_details.checked_baggage_available
      )
        arePersonalItemOnly = true;
    });

    return {
      areNonstops,
      are1Stop,
      areMore2Stops,
      departureEarly,
      departureMorning,
      departureAfternoon,
      departureEvening,
      arrivalEarly,
      arrivalMorning,
      arrivalAfternoon,
      arrivalEvening,
      areCarryOnBaggage,
      areCheckedBaggage,
      arePersonalItemOnly,
    };
  }, [searchResults]);

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    startSearchingItineraries(queryParams.toString());
  }, []);

  // * HANDLER FUNCTIONS * //

  const handleFilters = useCallback((filters: FilterFlights[]) => {
    dispatch(filterFlightResults(filters));
  }, []);

  const handleSearchResponse = (data: {
    itineraries: Itinerary[];
    meta: MetadataFlightRequest;
  }) => {
    const sortedItineraries = data.itineraries.sort(
      (a: any, b: any) => a.total_price.total_price - b.total_price.total_price
    );

    dispatch(setFlightResults(sortedItineraries));
    dispatch(setIsLoadingSkeletons(false));
    setPercentageItineraries(100 / TOTAL_ITINERARY_BATCHES);
    getNextItinerariesBatches(data.meta, sortedItineraries[0].general_details);
  };

  const handleErr = (err: any) => {
    if (err?.status === 410) return;

    dispatch(setIsLoadingSkeletons(false));
    dispatch(setIsLoadingAllItineraries(false));

    if (err?.status === 404) {
      setTitlePopup(t('flights.errorNoFlightsTitle') || '');
      setMessagePopup(t('flights.errorNoFlights') || '');
    } else if (err?.status === 422) {
      let errorPopup = '';

      const errors: { [key: string]: string } = {
        'There should be one adult per infant without seat (infant age < 2).':
          'flights.errorFinderInvalid.infant_per_adult',
        'The returning date is before the departure date on roundtrip.':
          'flights.errorFinderInvalid.return_date_before',
        'Invalid IATA code for the origin/destination of a trip.':
          'flights.errorFinderInvalid.iata',
        'The origin is equal to the destination.':
          'flights.errorFinderInvalid.origin_destination',
      };

      if (errors[err.message.detail]) {
        errorPopup = t(errors[err.message.detail]);
      } else {
        if (
          err.message.detail.includes(
            'The departure date must be after or equal to'
          )
        )
          errorPopup = t('flights.errorFinderInvalid.departure_after', {
            date: err.message.detail.match(/\d{4}-\d{2}-\d{2}/)[0],
          });
        if (err.message.detail.includes('The returning date must be after to'))
          errorPopup = t('flights.errorFinderInvalid.return_after', {
            date: err.message.detail.match(/\d{4}-\d{2}-\d{2}/)[0],
          });
      }

      setTitlePopup('Hey!');
      setMessagePopup(errorPopup || t('flights.errorNoFlights') || '');
    } else {
      setTitlePopup('Oops!');
      setContentPopup(
        <p className="text-[#FFFFFF80] text-center text-base">
          {t('flights.errorServer')}{' '}
          <a
            href={`mailto:${process.env.WHITELABELEMAIL}`}
            className="text-white cursor-pointer"
          >
            {process.env.WHITELABELEMAIL}
          </a>
        </p>
      );
    }

    setOpenPopup(true);
  };

  // * UTIL FUNCTIONS * //

  const startSearchingItineraries = useCallback(
    (searchParams: string) => {
      setPercentageItineraries(0);
      dispatch(setIsLoadingAllItineraries(true));
      dispatch(setIsLoadingSkeletons(true));

      const { segments, passengers, flightClass, flightType } =
        decodeSearchFlightQueryString(searchParams);

      dispatch(setFlightResults([]));
      dispatch(setFlightClass(flightClass));
      dispatch(setFlightType(flightType));
      dispatch(setPassengers(passengers));
      dispatch(setSegments(segments));

      const service = new FlightsService();
      service
        .search(segments, passengers, flightClass as FlightClassCode)
        .then(res => {
          handleSearchResponse(res);
        })
        .catch(err => {
          handleErr(err);
        });
    },
    [handleErr]
  );

  const getNextItinerariesBatches = async (
    meta: MetadataFlightRequest,
    generalDetails: GeneralDetails
  ) => {
    let actualBatches = meta.next_page !== null ? 1 : TOTAL_ITINERARY_BATCHES;
    let actualMeta = meta;

    try {
      while (actualBatches < TOTAL_ITINERARY_BATCHES) {
        const service = new FlightsService();
        const response = await service.searchNextBatch(
          actualMeta,
          generalDetails
        );
        actualBatches =
          response.meta.next_page !== null
            ? actualBatches + 1
            : TOTAL_ITINERARY_BATCHES;

        setPercentageItineraries(
          (actualBatches * 100) / TOTAL_ITINERARY_BATCHES
        );

        const sortedItineraries = response.itineraries.sort(
          (a: any, b: any) =>
            a.total_price.total_price - b.total_price.total_price
        );
        dispatch(addFlighsOnResults(sortedItineraries));

        actualMeta = response.meta;
      }

      dispatch(setIsLoadingAllItineraries(false));
    } catch (err) {
      handleErr(err);
    }
  };

  const cleanAndClosePopup = () => {
    setTitlePopup('');
    setMessagePopup('');
    setContentPopup(<></>);
    setOpenPopup(false);
  };

  const toggleMobileSearchBar = () =>
    setShowMobileSearchBar(!showMobileSearchBar);

  return (
    <div className="w-full">
      <SEO title={t('SEO.flights')} />
      <InfoPopup
        open={openPopup}
        onClose={cleanAndClosePopup}
        title={titlePopup}
        info={messagePopup}
        content={contentPopup}
        textButton={t('stays.got-it') || ''}
      />
      <div className="flights-container">
        <section className="flights-container-top flex items-center flex-col px-4 lg:mb-0 h-fit">
          {windowSize < 1024 ? (
            <>
              <LocationTabs activeTab="Flights" className="w-fit" />
              {segments.map((segment: any, index: number) => {
                const { origin, destination, startDate, endDate, roundtrip } =
                  segment;
                return (
                  <ActualFlight
                    key={index}
                    index={index}
                    start_location={origin}
                    end_location={destination}
                    start_date={startDate}
                    end_date={roundtrip ? endDate : null}
                    number_of_travelers={
                      passengers.adults +
                      passengers.children +
                      passengers.infants
                    }
                    className="mb-3"
                    onClickFilter={toggleMobileSearchBar}
                  />
                );
              })}
            </>
          ) : null}
          <FlightsSearchContainer
            redirect={false}
            className={
              windowSize < 1024 && !showMobileSearchBar ? 'hidden' : ''
            }
            onSearch={startSearchingItineraries}
          />
        </section>
        <section
          className={`flights-container-aside h-fit ${
            windowSize < 1024 && !showMobileSearchBar ? 'hidden' : ''
          }`}
        >
          {windowSize >= 1024 ? <LocationTabs activeTab="Flights" /> : null}
          <FlightsFilter
            minPrice={searchResults[0]?.total_price.total_price || 0}
            maxPrice={searchResults.at(-1)?.total_price.total_price || 0}
            airlines={listAirlines}
            onFilterChange={handleFilters}
            availableFilters={availableFilters}
          />
        </section>
        <CardContainer percentageItineraries={percentageItineraries} />
      </div>
    </div>
  );
};

FlightSearchResults.getLayout = getLayout;

export default FlightSearchResults;

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        ['common'],
        nextI18NextConfig
      )),
    },
  };
}
