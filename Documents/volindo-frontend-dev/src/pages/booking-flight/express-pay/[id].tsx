import React, { useState, useEffect } from 'react';

import { SupplierHeaderType } from '@typing/types';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import 'moment/locale/es';
import moment from 'moment';

import takeoff from '@icons/takeoff.svg';
import landing from '@icons/landing.svg';
import logoV from '@icons/noAirline.svg';
import logoFT from '@icons/noAirlineFT.svg';

import { useRouter } from 'next/router';

import { Container, FlexboxGrid, Modal, Checkbox } from 'rsuite';
import { GeneralInfoCard } from '@containers';
import { getProposal } from '@utils/axiosClients';

import {
  BookingLayout,
  ModalError,
  ModalPolicy,
  Details,
  ExtraServicesDropdown,
  ImageFallback,
  InfoPopup,
  SEO,
  Step,
} from '@components';
import { getFlightsAgentIdFromURL } from '@utils/userFunctions';

import { useAppDispatch, useAppSelector } from '@context';

import { hasDatePassed } from '@utils/timeFunctions';
import { usePrice } from 'src/components/utils/Price/Price';
import config from '@config';

// SRR
export async function fetchData(id: any, duffel: boolean = false) {
  try {
    const response = await getProposal(id, duffel);

    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 500) {
      throw new Error('Internal Server Error');
    }
    if (error?.response?.status === 403) {
      return error.response.data;
    }

    return {};
  }
}

export async function getServerSideProps({ locale, params }: any) {
  const bookingIdentifier: string = params.id;

  const isDuffel = bookingIdentifier.startsWith('D--');

  const bookingData = await fetchData(params.id, isDuffel);

  if (Object.keys(bookingData).length === 0) {
    return {
      notFound: true,
    };
  }

  let data = bookingData;
  let extraInfo: string = '';

  if (isDuffel) {
    if ('detail' in bookingData) {
      extraInfo = bookingData?.detail?.includes('similar')
        ? 'SIMILAR'
        : bookingData?.detail?.includes('price')
          ? 'PRICE_CHANGED'
          : 'EXPIRED';
      data = bookingData?.booking;
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
      data,
      extraInfo,
      isDuffel,
    },
  };
}

const TravelerProposal = ({ data, extraInfo, isDuffel }: any) => {
  const { t, i18n } = useTranslation('common');
  const priceService = usePrice();
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;

  const [resTabs, setResTabs] = useState('ResDetails');
  const [openError, setOpenError] = useState(false);
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [policies, setPolicies] = useState<any>(['No Policy']);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [showCancelPolicy, setShowCancelPolicy] = useState<boolean>(false);
  const [detailsArr, setDetailsArr] = useState([]);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [titlePopup, setTitlePopup] = useState('');
  const [messagePopup, setMessagePopup] = useState('');
  const [contentPopup, setContentPopup] = useState(<></>);
  const [validPnr, setValidPnr] = useState<boolean>(false);
  const [flightExtraInfo, setFlightExtraInfo] = useState<string>(extraInfo);

  const agentId = getFlightsAgentIdFromURL(id, isDuffel);

  if (!!data) {
    localStorage.setItem('travelerFlight', JSON.stringify(data));
  }

  const logo = config.WHITELABELNAME === 'Volindo' ? logoV : logoFT;

  const storageVar: any = localStorage.getItem('travelerFlight');
  const { main_contact, service, payments } = data || JSON.parse(storageVar);
  const { selected_flight } = service;
  const { general_details, flight_policies, flights, conditions } =
    selected_flight;
  const { ticketing_deadline_datetime_mx } = general_details;

  const oneway: any = selected_flight?.flights[0] || null;
  const roundTrip: any = selected_flight?.flights[1] || null;
  const multiFlights = selected_flight.flights || null;
  const originalDepartCity =
    oneway?.departure_details.city_name.split(' - ')[0] ||
    roundTrip?.departure_details.city_name.split(' - ')[0];
  const originalArrivalcity =
    oneway?.arrival_details.city_name.split(' - ')[0] ||
    roundTrip?.arrival_details.city_name.split(' - ')[0];

  const getTest = (i: number) => {
    const multiFlightTest = !!multiFlights && multiFlights.length > 2;
    let variable = '';
    const classFlight = t(
      `flights.classes.${general_details.class_of_service}`
    );
    if (multiFlightTest)
      return `${t('flights.flight')} ${i + 1} (${classFlight})`;
    variable = i === 0 ? t('flights.departure') : t('flights.return');

    return `${variable} (${classFlight})`;
  };

  const formatDate = (param: any, hour = false) => {
    const language = i18n.language;
    return (
      <>
        {language === 'en' ? (
          <span>
            {moment(param).locale('en').format('ddd, D MMM')}{' '}
            {hour && moment(param).locale('en').format('HH:mm')}
          </span>
        ) : (
          <span>
            {moment(param).locale('es').format('ddd D MMM')}{' '}
            {hour && moment(param).locale('en').format('HH:mm')}
          </span>
        )}
      </>
    );
  };

  const redirectToStripe = () => {
    const id = window.location.href.split('/')[5];
    const url = `${window.location.protocol}//${window.location.host}/booking-flight/payment/${id}`;
    window.open(`${url}`);
  };

  const totalTravelTime = (dateObj: any) => {
    if (!!dateObj) {
      const { hours, minutes, days } =
        dateObj.total_time_formatted || dateObj.total_flight_time_formatted;

      return (
        <span>
          {!!days && days}
          {!!days && 'd'} {!!hours && hours}
          {!!hours && 'h'} {!!minutes && minutes}
          {!!minutes && 'm'}
        </span>
      );
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showStops = (stops: any) => {
    handleOpen();
    setDetailsArr(stops);
  };

  const cleanAndClosePopup = () => {
    setTitlePopup('');
    setMessagePopup('');
    setContentPopup(<></>);
    setOpenPopup(false);
  };

  const handleIsValidDate = (boolean: boolean) => {
    if (!boolean) {
      const title = t('flights.validity.phrase-three');
      const text = t('flights.expired');

      setTitlePopup(title);
      setMessagePopup(text);
      setOpenPopup(true);
      return false;
    }
  };

  const dispatch = useAppDispatch();

  const isValidPnr = (param: string) => {
    const validity = hasDatePassed(param, isDuffel);
    if (!validity || extraInfo === 'EXPIRED') {
      handleIsValidDate(false);
      setValidPnr(true);
      return;
    }
  };

  const exchangeCurrencyNumber = useAppSelector(
    state => state.general.currency.currencyNumber
  );
  const exchangeCurrencySymbol = useAppSelector(
    state => state.general.currency.currencySymbol
  );

  useEffect(() => {
    if (!!ticketing_deadline_datetime_mx) {
      isValidPnr(ticketing_deadline_datetime_mx);
    }
  }, [ticketing_deadline_datetime_mx]);

  const formatDepartureTime = (timeString: string) => {
    return timeString.substring(
      0,
      timeString.indexOf(':', timeString.indexOf(':') + 1)
    );
  };

  const FlightDetails = () => {
    return (
      <FlexboxGrid
        justify="center"
        className="flex justify-center h-full items-center w-full flex-col md:flex-row-reverse md:gap-12 md:items-start"
      >
        <InfoPopup
          open={flightExtraInfo !== '' && flightExtraInfo !== 'EXPIRED'}
          onClose={() => setFlightExtraInfo('')}
          title={t('flights.similar-flight-title') || ''}
          info={
            (flightExtraInfo === 'SIMILAR'
              ? t('flights.similar-flight-content')
              : t('flights.similar-flight-content-price')) || ''
          }
        />
        <Modal
          open={open}
          onClose={handleClose}
          className="details-modal"
          size={'lg'}
        >
          <Modal.Header>
            <Modal.Title className="h-[29px] text-[24px] leading-[29px] text-white md:font-bold md:text-[40px] md:h-[48px] md:flex md:justify-center md:leading-[48px] md:tracking-[0.35px]">
              {t('flights.details')}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {detailsArr.map((flight: any, i: number) => {
              return (
                <Details
                  single={flight}
                  key={i}
                  i={i}
                  originalArrivalcity={originalArrivalcity}
                  originalDepartCity={originalDepartCity}
                  totalTime={flight.total_time.total_time_per_stop}
                />
              );
            })}
          </Modal.Body>
        </Modal>

        <FlexboxGrid.Item className="text-white w-full h-auto px-4 xxs:max-w-[373px] mb-[40px] md:w-[471px] md:mb-0">
          <FlexboxGrid.Item>
            <h2 className="title text-white text-[32px] font-[650] mb-[15px] md:mb-0 md:hidden">
              <span className="block scale-y-[0.7]">
                {t('flights.details')}
              </span>
            </h2>
          </FlexboxGrid.Item>

          <FlexboxGrid className="flex flex-col gap-y-[25px] align-baseline">
            {service?.selected_flight.flights.map(
              (flight: any, index: number) => {
                const {
                  arrival_details: arrival,
                  departure_details: departure,
                  stops,
                  total_time,
                } = flight;

                return (
                  <FlexboxGrid.Item className="wholeCard w-full" key={index}>
                    <FlexboxGrid justify="space-between">
                      <FlexboxGrid.Item className="hereIs w-full">
                        <FlexboxGrid className="im flex justify-between items-start">
                          <FlexboxGrid className="items-center" key={index}>
                            <FlexboxGrid.Item>
                              <div className="flex flex-col gap-y-4">
                                <span className="hidden md:inline-block text-xl mb-3">
                                  {getTest(index)}
                                </span>
                              </div>
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </FlexboxGrid>
                      </FlexboxGrid.Item>

                      <div className="mb-[13px] md:hidden">
                        <div className="text-[18px] font-[510]">
                          {departure.city_name} - {arrival.city_name}
                        </div>
                        <div className="text-[13px] text-white/75">
                          {totalTravelTime(total_time)} on the way
                        </div>
                      </div>

                      <FlexboxGrid className="flight-card-container-trip-depart-logo-container ml-auto">
                        <ImageFallback
                          src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${departure?.airline.marketing.airline_code}.svg`}
                          className="flight-card-container-trip-depart-logo"
                          style={{ marginBottom: '0px' }}
                          fallbackSrc={logo.src}
                        />
                        <span className="flight-card-container-trip-depart-logo-name black">
                          {departure?.airline.marketing.airline_name}
                        </span>
                      </FlexboxGrid>

                      <FlexboxGrid
                        justify="space-between"
                        className="IMHERE text-white/[.5] text-base w-full"
                        align="middle"
                      >
                        <FlexboxGrid.Item colspan={7}>
                          <div className="flex flex-col gap-[6px] text-left">
                            <span className="departureDate">
                              <div className="text-[12px] font-[590] leading-[normal]">
                                {formatDepartureTime(departure?.departure_time)}
                              </div>
                              <span className="hidden md:block">
                                {departure.city_name}
                              </span>
                              {/* <br /> */}
                              <span className="text-[12px] font-[590] leading-[normal]">
                                {formatDate(departure.departure_date)}
                              </span>
                            </span>
                            <div className="md:hidden inline mr-auto w-[93px] border-[#2c2c2c] border relative">
                              <span className="absolute w-[24.09px] border border-white left-0" />
                              <span className="absolute w-[9.63px] border border-white right-0" />
                            </div>
                            <span className="md:hidden inline text-white/[.7] font-[590]">
                              {departure.airport}
                            </span>
                          </div>
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={8}>
                          <div className="flex flex-col gap-y-2 text-center">
                            <span className="hidden md:block">
                              {totalTravelTime(total_time)}
                            </span>
                            <div className="hidden justify-between md:flex">
                              <Image
                                className=""
                                src={takeoff}
                                alt="departure"
                              />
                              <Image className="" src={landing} alt="landing" />
                            </div>
                            <div className="flex flex-col ">
                              <div className="hidden md:inline mr-auto w-full border-[#2c2c2c] border relative mb-4">
                                <span className="absolute w-[11.63px] border border-white] left-0" />
                                <span className="absolute w-[11.63px] border border-white] right-1/2 left-1/2" />
                                <span className="absolute w-[11.63px] border border-white] right-0" />
                              </div>
                              <div className="flex justify-center md:justify-between">
                                <span className="originCity md:inline hidden">
                                  {departure.airport}
                                </span>

                                {stops?.length > 0 ? (
                                  <span
                                    className="mt-[50px] text-[16px] font-[590] md:-mt-2 underline hover:cursor-pointer"
                                    onClick={() => showStops(stops)}
                                  >
                                    {stops?.length - 1}
                                    &nbsp; {t('flights.stops')}
                                  </span>
                                ) : null}
                                <span className="arrivalCity md:inline hidden">
                                  {arrival.airport}
                                </span>
                              </div>
                            </div>
                          </div>
                        </FlexboxGrid.Item>

                        <FlexboxGrid.Item colspan={7}>
                          <div className="flex flex-col gap-[6px] text-right">
                            <span className="arrivalDate">
                              <div className="text-[12px] font-[590] leading-[normal]">
                                {formatDepartureTime(arrival?.arrival_time)}
                              </div>
                              <span className="hidden md:block">
                                {arrival.city_name}
                              </span>
                              {/* <br /> */}
                              <span className="text-[12px] font-[590] leading-[normal]">
                                {formatDate(arrival.arrival_date)}
                              </span>
                            </span>
                            <div className="md:hidden inline ml-auto w-[93px] border-[#2c2c2c] border relative">
                              <span className="absolute w-[9.63px] border border-white left-0" />
                              <span className="absolute w-[24.09px] border border-white right-0" />
                            </div>
                            <span className="md:hidden inline text-white/[.7] font-[590]">
                              {arrival.airport}
                            </span>
                            {/* <span className="md:hidden inline">
                              {flight.destination_location_airport}
                            </span> */}
                          </div>
                        </FlexboxGrid.Item>
                      </FlexboxGrid>
                    </FlexboxGrid>
                  </FlexboxGrid.Item>
                );
              }
            )}

            <FlexboxGrid.Item className="fees w-full px-[12px] flex flex-col gap-[5px]">
              <FlexboxGrid.Item className="w-full text-sm">
                <div className="flex justify-between items-center relative">
                  <span className="text-white/[0.7] whitespace-nowrap">
                    {t('flights.flight-cost')}
                  </span>

                  <FlexboxGrid.Item className="flex justify-end h-6  text-white border-none">
                    {priceService.countrySymbol}
                    {priceService.integerWithOneDecimal(payments?.subtotal)}
                  </FlexboxGrid.Item>
                </div>
              </FlexboxGrid.Item>
              <div className="flex w-full">
                <ExtraServicesDropdown
                  flights={flights}
                  flightPolicies={flight_policies}
                  isWhite
                />
              </div>
              <FlexboxGrid justify="space-between" className="md:mb-3">
                <FlexboxGrid.Item>
                  <span className="text-white/[0.7]">
                    {t('stays.transfer_fee')} 4%:
                  </span>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <span className="flex text-sm justify-center flex-col items-center">
                    <span>
                      {priceService.countrySymbol}{' '}
                      {priceService.integerWithOneDecimal(
                        payments?.extra_data.transaction_fee
                      )}
                    </span>
                  </span>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item>
                  {/* <span className="text-white/[0.4]">Volindo fee 3%:</span> */}
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <span className="flex text-sm justify-center flex-col items-center">
                    {/* <span>$ {payments?.extra_data.volindo_fee}</span> */}
                  </span>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item className="total w-full h-[40px] bg-white/[.15] text-sm rounded-lg flex justify-between items-center px-[12px]">
              <FlexboxGrid.Item>{t('flights.total')}</FlexboxGrid.Item>
              <FlexboxGrid.Item>
                {priceService.countrySymbol}{' '}
                {priceService.integerTotal(payments?.total)}
              </FlexboxGrid.Item>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FlexboxGrid.Item>

        <FlexboxGrid.Item>
          <div className="items-center gap-[18px] mb-[10px] hidden md:flex">
            <h2 className="text-white text-2xl font-[650]">
              {t('flights.reservation')}
            </h2>
          </div>
          <FlexboxGrid className="flex flex-col gap-y-4 w-full">
            <FlexboxGrid.Item className="contact-form grid gap-y-3 w-full">
              {main_contact?.map((contact: any, index: number) => {
                if (isDuffel && !contact?.phone.includes(contact?.phone_code)) {
                  contact.phone = `${contact?.phone_code}${contact?.phone}`;
                }
                return (
                  <div key={index} className="my-[5px]">
                    <GeneralInfoCard
                      travelerInfo={contact}
                      // setTravelerInfo={setFlightData}
                      origin={'pay'}
                      index={index}
                      typeTraveler={
                        contact?.traveler_type === 'ADT' ? 'adult' : 'child'
                      }
                    />
                  </div>
                );
              })}
            </FlexboxGrid.Item>

            <FlexboxGrid.Item className="w-full px-4 md:px-0">
              <FlexboxGrid
                justify="center"
                className=" flex flex-col items-center md:items-start"
              >
                <FlexboxGrid.Item className="mr-auto">
                  <div className="flex gap-1 items-center justify-center mb-5 text-white md:mt-[40px]">
                    <Checkbox
                      className="transparentCheckbox"
                      id="checkPolicy"
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    <label htmlFor="checkPolicy" className="cursor-pointer">
                      {t('flights.flight-policy-text-1')}
                      <button
                        onClick={() => setShowCancelPolicy(true)}
                        className="underline"
                      >
                        {t('flights.flight-policy-text-2')}
                      </button>
                    </label>
                  </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item className="flex justify-center w-full">
                  <button
                    disabled={validPnr || !isChecked}
                    className="text-white text-[20px] bg-[var(--primary-background)] w-full md:w-[361px] h-[48px] mx-auto rounded-3xl font-[760] tracking-widest mb-9 lg:ml-0"
                    onClick={redirectToStripe}
                  >
                    <span className="block scale-y-[.7]">
                      {t('payment.pay-now')}
                    </span>
                  </button>
                </FlexboxGrid.Item>
                <p className="max-w-[450px]">
                  {t('flights.validity.phrase-one')}{' '}
                  <span className="font-[500] text-white">
                    {formatDate(ticketing_deadline_datetime_mx, true)}
                    {isDuffel ? ' (UTC) ' : ' (CST) '}
                  </span>
                  {t('flights.validity.phrase-two')}
                </p>
              </FlexboxGrid>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    );
  };

  return (
    <>
      <SEO title={t('SEO.proposal_thanyou_flight')} />
      <ModalPolicy
        open={showCancelPolicy}
        onClose={() => setShowCancelPolicy(false)}
        conditions={conditions}
      />

      <ModalError open={openError} onClose={() => setOpenError(false)} />

      <InfoPopup
        open={openPopup}
        onClose={cleanAndClosePopup}
        title={titlePopup}
        content={contentPopup}
        info={messagePopup}
        textButton={t('stays.got-it') || ''}
      />

      <BookingLayout isPublic={true} agentId={agentId}>
        <Container className="w-full">
          <FlexboxGrid justify="center" className="w-full md:mt-10 px-3">
            <Step actualStep="ResDetails" />
          </FlexboxGrid>
          <FlexboxGrid className="md:mt-8 w-full overflow-hidden ">
            {FlightDetails()}
          </FlexboxGrid>
        </Container>
      </BookingLayout>
    </>
  );
};

export default TravelerProposal;
