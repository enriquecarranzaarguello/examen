import { memo, useCallback, useEffect, useState } from 'react';
import FlightCard from './FlightCard';
import SortButtons from './SortButtons';
import InfoPopup from '../popups/InfoPopup';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch, sortFlightResults } from '@context';
import {
  FlightType,
  Itinerary,
  SortFlightType,
  setSelectedFlight,
} from '@context/slices/flightSlice/flightSlice';
import { Modal, Button, Progress } from 'rsuite';
import { Details, FlightCardSkeleton } from '@components';
import { StopsDetailsType } from '@typing/types';
import SearchLoader from '@components/SearchLoader';
import { FlightsService } from '@services/FlightsService';

const CardContainerSkeletons = () => {
  const flightType = useAppSelector(state => state.flights.flightType);
  const segments = useAppSelector(state => state.flights.segments);
  const [numberOfSegments, setNumberOfSegments] = useState(1);

  useEffect(() => {
    switch (flightType) {
      case FlightType.R:
        setNumberOfSegments(2);
        break;
      case FlightType.O:
        setNumberOfSegments(1);
        break;
      default:
        setNumberOfSegments(segments.length);
        break;
    }
  }, [segments, flightType]);

  return (
    <>
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <FlightCardSkeleton segments={numberOfSegments} key={i} />
        ))}
    </>
  );
};

const CardContainer = ({
  percentageItineraries,
}: {
  percentageItineraries: number;
}) => {
  const { t } = useTranslation();
  const [openPopup, setOpenPopup] = useState(false);
  const [titlePopup, setTitlePopup] = useState('');
  const [messagePopup, setMessagePopup] = useState('');
  const [contentPopup, setContentPopup] = useState(<></>);
  const [openStops, setOpenStops] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [stopsDetails, setStopsDetails] = useState<StopsDetailsType>({
    stops: [],
    originalArrivalcity: '',
    originalDepartCity: '',
    totalTimeFormated: {
      days: 0,
      hours: 0,
      minutes: 0,
    },
    itinerary: null,
  });
  const [showProgress, setShowProgress] = useState(false);

  const isLoadingSkeletons = useAppSelector(
    state => state.flights.isLoadingSkeletons
  );
  const isLoadingAllItineraries = useAppSelector(
    state => state.flights.isLoadingAllItineraries
  );
  const itineraries: Itinerary[] = useAppSelector(
    state => state.flights.filteredResults
  );
  const sort = useAppSelector(state => state.flights.filters.sortBy);
  const dispatch = useAppDispatch();

  const selectTrip = () => {
    const itinerary = stopsDetails.itinerary;
    if (!itinerary) return;

    setIsRevalidating(true);
    const isDuffel =
      itinerary.general_details?.provider_data?.provider === 'Duffel';

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
        handleError(err);
        console.error('Error with revalidate :', err);
      })
      .finally(() => {
        setOpenStops(false);
        setIsRevalidating(false);
      });
  };

  const cleanAndClosePopup = () => {
    setTitlePopup('');
    setMessagePopup('');
    setContentPopup(<></>);
    setOpenPopup(false);
  };

  const handleError = useCallback((ex: any) => {
    if (ex.response?.status === 404) {
      setTitlePopup('Hey!');
      setMessagePopup(t('flights.errorRevalidate') || '');
    } else {
      setTitlePopup('Oops!');
      setContentPopup(
        <p className="text-[#FFFFFF80] text-center text-base">
          {t('common.errorServer')}{' '}
          <a
            href="mailto:support@volindo.com"
            className="text-white cursor-pointer"
          >
            {process.env.WHITELABELEMAIL}
          </a>
        </p>
      );
    }
    setOpenPopup(true);
  }, []);

  const handleShowStops = useCallback((details: StopsDetailsType) => {
    setStopsDetails(details);
    setOpenStops(true);
  }, []);

  const handleCloseStops = () => {
    setOpenStops(false);
  };

  const handleOnChangeSort = (type: SortFlightType) => {
    dispatch(sortFlightResults(type));
  };

  useEffect(() => {
    const time = setTimeout(() => {
      setShowProgress(isLoadingAllItineraries);
    }, 500);

    return () => clearTimeout(time);
  }, [isLoadingAllItineraries]);

  return (
    <>
      <InfoPopup
        open={openPopup}
        onClose={cleanAndClosePopup}
        title={titlePopup}
        info={messagePopup}
        content={contentPopup}
        textButton={t('stays.got-it') || ''}
      />
      <Modal
        open={openStops}
        onClose={handleCloseStops}
        className="details-modal"
        size={'lg'}
      >
        <Modal.Header>
          <Modal.Title className="h-[29px] text-[24px] leading-[29px] text-white md:font-bold md:text-[40px] md:h-[48px] md:flex md:justify-center md:leading-[48px] md:tracking-[0.35px]">
            {t('flights.details')}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {stopsDetails.stops.map((flight: any, i: number) => (
            <Details
              single={flight}
              key={i}
              i={i}
              originalArrivalcity={stopsDetails.originalArrivalcity}
              originalDepartCity={stopsDetails.originalDepartCity}
              totalTime={stopsDetails.totalTimeFormated}
            />
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={selectTrip} appearance="subtle" className="">
            {isRevalidating ? <SearchLoader /> : t('common.select')}
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        data-testid="flights-results-continer"
        className="flight-results-container off"
      >
        <div className="flight-results-container-top">
          <span className="flight-results-container-top-title">
            <b>{t('flights.results')}</b> {itineraries.length}
          </span>
          <SortButtons sort={sort} onChangeSort={handleOnChangeSort} />
        </div>

        {/* TODO make component (hotels | flights) */}
        <div className="flightsProgressBar">
          {showProgress && (
            <Progress.Line percent={percentageItineraries} showInfo={false} />
          )}
        </div>

        {isLoadingSkeletons ? (
          <CardContainerSkeletons />
        ) : (
          <>
            {itineraries.map(itinerary => (
              <FlightCard
                key={
                  itinerary.general_details.provider_data?.data?.offer_id ||
                  itinerary.itinerary_id
                }
                itinerary={itinerary}
                onError={handleError}
                onShowStops={handleShowStops}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default memo(CardContainer);
