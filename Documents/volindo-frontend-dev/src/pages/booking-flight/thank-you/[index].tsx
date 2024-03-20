import React, { useState } from 'react';

import { FlexboxGrid, Modal } from 'rsuite';
import logoV from '@icons/noAirline.svg';
import logoFT from '@icons/noAirlineFT.svg';

import whitelabellogo from '@icons/whitelabellogo.svg';
import takeoff from '@icons/takeoff.svg';
import landing from '@icons/landing.svg';

import 'moment/locale/es';
import moment from 'moment';

import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getFlightThankyou } from '@utils/axiosClients';
import { useRouter } from 'next/router';

import {
  BookingLayout,
  Details,
  ExtraServicesDropdown,
  ImageFallback,
  ModalPolicy,
  SEO,
} from '@components';
import { getFlightsAgentIdFromURL } from '@utils/userFunctions';

import { changeCurrency } from 'src/helpers/exchangeCurrencyCalculation';
import { useAppSelector } from '@context';
import formatDepartureTime from '@utils/formatDepartureTime';
import config from '@config';
import { usePrice } from 'src/components/utils/Price/Price';

// SRR petition
export async function fetchData(clientId: string, isDuffel = false) {
  const agentId = isDuffel ? clientId.replace('D--', '') : clientId;
  const [a, b] = agentId.split('--');

  const body = {
    booking_id: a,
    agent_id: b,
  };

  try {
    const response = await getFlightThankyou(body, isDuffel);
    return response.data;
  } catch (error) {
    console.error('Error fetching data Thank you:', error);
    return null;
  }
}

export async function getServerSideProps({ params, locale }: any) {
  const bookingIdentifier: string = params.index;

  const isDuffel = bookingIdentifier.startsWith('D--');

  const data = await fetchData(params.index, isDuffel);

  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
      data,
      isDuffel,
    },
  };
}

const ThankYouPage = ({ data, isDuffel }: any) => {
  const { t, i18n } = useTranslation('common');
  const priceService = usePrice();
  const router = useRouter();
  const id = router.query.index;

  const [detailsArr, setDetailsArr] = useState([]);
  const [open, setOpen] = useState(false);
  const { service, payments, main_contact } = data;

  const agentId = getFlightsAgentIdFromURL(id, isDuffel);

  const oneway: any = data?.service?.selected_flight.flights[0] || null;
  const roundTrip: any = data?.service?.selected_flight.flights[1] || null;
  const multiFlights = data?.service?.selected_flight.flights || null;

  const originalDepartCity =
    oneway?.departure_details.city_name.split(' - ')[0] ||
    roundTrip?.departure_details.city_name.split(' - ')[0];

  const originalArrivalcity =
    oneway?.arrival_details.city_name.split(' - ')[0] ||
    roundTrip?.arrival_details.city_name.split(' - ')[0];

  const { flight_policies, extra_services, flights, general_details } =
    data?.service?.selected_flight || {};

  const formatDate = (param: any, hour = false) => {
    const language = i18n.language;
    return (
      <>
        {language === 'en' ? (
          <span>
            {moment(param).locale('en').format('ddd, D MMMM')}{' '}
            {hour && moment(param).locale('en').format('HH:mm')}
          </span>
        ) : (
          <span>
            {moment(param).locale('es').format('ddd D MMMM')}{' '}
            {hour && moment(param).locale('en').format('HH:mm')}
          </span>
        )}
      </>
    );
  };

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

  const logo = config.WHITELABELNAME === 'Volindo' ? logoV : logoFT;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showStops = (stops: any) => {
    handleOpen();
    setDetailsArr(stops);
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

  const exchangeCurrencyNumber = useAppSelector(
    state => state.general.currency.currencyNumber
  );
  const exchangeCurrencySymbol = useAppSelector(
    state => state.general.currency.currencySymbol
  );

  return (
    <>
      <SEO title={t('SEO.confirmation')} />
      <BookingLayout isPublic={true} agentId={agentId}>
        <>
          <FlexboxGrid
            justify="center"
            className="thanks-page flex justify-center flex-wrap-[inherit] w-full flex-col md:flex-row md:gap-12 md:items-center"
          >
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

            <FlexboxGrid.Item className="TEXT flex-col gap-y-5 mb-auto px-[0] md:px-0">
              <h2 className="text-white text-[28px] font-[650] leading-[29px] mb-[23px] h-[29px] px-[15px] md:px-0 md:text-[32px] md:last:eading-[38px]">
                <span className="block scale-y-[0.8]">
                  {t('suppliers.booking-confirmation')}
                </span>
              </h2>

              <FlexboxGrid.Item className="flex pt-[40px] pb-[66px] pl-[21px] pr-[32px] min-h-[340px] bg-white rounded-[35px] text-black max-w-[466px] mx-[9px] mb-[20px] md:mx-0">
                <FlexboxGrid.Item className="w-full flex flex-wrap">
                  <h2 className="text-center text-[36px] font-[650] leading-[normal] mb-[20px] mr-auto ml-auto md:w-[300px]">
                    <span className="block scale-y-[0.8]">
                      {t('flights.confirmation.title')}
                    </span>
                  </h2>
                  <p className="text-[16px] font-[400] leading-[20px] mb-[19px]">
                    {t('flights.confirmation.p-1')}
                  </p>
                  <p className="text-[16px] font-[400] leading-[20px]">
                    {t('flights.confirmation.p-2')}
                    <button
                      onClick={() =>
                        (window.location.href = `mailto:${process.env.WHITELABELEMAIL}`)
                      }
                      className="underline"
                    >
                      {process.env.WHITELABELEMAIL}
                    </button>
                  </p>
                </FlexboxGrid.Item>
              </FlexboxGrid.Item>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item className="FLIGHT text-white w-full h-auto px-[20px] xxs:max-w-[373px] md:w-[471px]">
              <div className="hidden md:block">
                {main_contact &&
                  main_contact.map((contact: any, index: number) => {
                    const { first_name: name, email, phone } = contact;
                    return (
                      <FlexboxGrid.Item
                        className="flex flex-col gap-[8px] md:my-[20px] md:mt-[50px]"
                        key={index}
                      >
                        <p className="flex text-[24px] leading-[19px] font-[760] m-0 mb-[5px] md:text-[28px] md:leading-[24px] md:font-[510]">
                          <span className="block scale-y-[0.8]">
                            {t('travelers.traveler')} {index + 1}
                          </span>
                        </p>
                        <p className="w-full flex justify-between m-0">
                          <span className="flex text-[14px] leading-[24px] font-[400] text-white/[0.7]">
                            {t('flights.name')}
                          </span>
                          <span className="flex text-[15px] leading-[24px] font-[400]">
                            {name}
                          </span>
                        </p>
                        <p className="w-full flex justify-between m-0">
                          <span className="flex text-[14px] leading-[24px] font-[400] text-white/[0.7]">
                            {t('flights.phone')}
                          </span>
                          <span className="flex text-[15px] leading-[24px] font-[400]">
                            {phone}
                          </span>
                        </p>
                        <p className="w-full flex justify-between m-0">
                          <span className="flex text-[14px] leading-[24px] font-[400] text-white/[0.7]">
                            {t('flights.email')}
                          </span>
                          <span className="flex text-[15px] leading-[24px] font-[400]">
                            {email}
                          </span>
                        </p>
                      </FlexboxGrid.Item>
                    );
                  })}
              </div>
              <FlexboxGrid className="flex flex-col gap-y-[34px]">
                {service?.selected_flight.flights.map(
                  (flight: any, index: number) => {
                    const {
                      arrival_details: arrival,
                      departure_details: departure,
                      stops,
                      total_time,
                    } = flight;

                    return (
                      <FlexboxGrid.Item
                        className="wholeCard w-full"
                        key={index}
                      >
                        <FlexboxGrid justify="space-between" className="hello">
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

                              {/* <FlexboxGrid.Item className="ITEMS2">
                            <Image
                              className=" h-[25px]"
                              src={logo}
                              alt="arline"
                            />
                          </FlexboxGrid.Item> */}
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

                          <FlexboxGrid className="flight-card-container-trip-depart-logo-container">
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
                            className="text-white/[.5] text-base w-full"
                            align="middle"
                          >
                            <FlexboxGrid.Item colspan={7}>
                              <div className="flex flex-col gap-[6px] text-left">
                                <span className="departureDate">
                                  <div className="text-[12px] font-[590] leading-[normal]">
                                    {formatDepartureTime(
                                      departure?.departure_time
                                    )}
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
                                  <Image
                                    className=""
                                    src={landing}
                                    alt="landing"
                                  />
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
                <div className="w-full md:hidden">
                  {main_contact &&
                    main_contact.map((contact: any, index: number) => {
                      const { first_name: name, email, phone } = contact;
                      return (
                        <FlexboxGrid.Item
                          className="flex flex-col gap-[8px] md:my-[20px] md:mt-[50px]"
                          key={index}
                        >
                          <p className="flex text-[24px] leading-[19px] font-[760] m-0 mb-[5px] md:text-[20px] md:leading-[24px] md:font-[510]">
                            <span className="block scale-y-[0.8]">
                              {t('travelers.traveler')} {index + 1}
                            </span>
                          </p>
                          <p className="w-full flex justify-between m-0">
                            <span className="flex text-[14px] leading-[24px] font-[400] text-white/[0.7]">
                              {t('flights.name')}
                            </span>
                            <span className="flex text-[15px] leading-[24px] font-[400]">
                              {name}
                            </span>
                          </p>
                          <p className="w-full flex justify-between m-0">
                            <span className="flex text-[14px] leading-[24px] font-[400] text-white/[0.7]">
                              {t('flights.phone')}
                            </span>
                            <span className="flex text-[15px] leading-[24px] font-[400]">
                              {phone}
                            </span>
                          </p>
                          <p className="w-full flex justify-between m-0">
                            <span className="flex text-[14px] leading-[24px] font-[400] text-white/[0.7]">
                              {t('flights.email')}
                            </span>
                            <span className="flex text-[15px] leading-[24px] font-[400]">
                              {email}
                            </span>
                          </p>
                        </FlexboxGrid.Item>
                      );
                    })}
                </div>

                <FlexboxGrid.Item className="w-full">
                  <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item>
                      <span className="text-white/[0.7]">
                        {t('flights.flight-cost')}:
                      </span>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                      <span className="flex text-sm justify-center flex-col items-center">
                        <span>
                          {priceService.countrySymbol}{' '}
                          {priceService.integerWithOneDecimal(
                            payments.subtotal
                          )}
                        </span>
                      </span>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                  <div className="flex w-full mt-[5px]">
                    <ExtraServicesDropdown
                      flights={flights}
                      flightPolicies={flight_policies}
                      extraServices={extra_services}
                      isWhite
                    />
                  </div>
                  <FlexboxGrid justify="space-between">
                    <FlexboxGrid.Item>
                      <span className="text-white/[0.7]">
                        {t('stays.transfer_fee')}:
                      </span>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                      <span className="flex text-sm justify-center flex-col items-center">
                        <span>
                          {priceService.countrySymbol}{' '}
                          {priceService.integerWithOneDecimal(
                            payments.extra_data.transaction_fee
                          )}
                        </span>
                      </span>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item className="w-full h-[40px] bg-white/[.15] text-sm rounded-lg flex justify-between items-center px-3 mb-5">
                  <FlexboxGrid.Item>Total:</FlexboxGrid.Item>
                  <FlexboxGrid.Item>
                    {priceService.countrySymbol}{' '}
                    {priceService.integerTotal(payments.total)}
                  </FlexboxGrid.Item>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </>
      </BookingLayout>
    </>
  );
};

export default ThankYouPage;
