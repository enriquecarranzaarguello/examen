import React, { useState } from 'react';
import moment from 'moment';

import ArrowIcon from '@icons/arrow-down.svg';
import logoV from '@icons/noAirline.svg';
import logoFT from '@icons/noAirlineFT.svg';
import takeoff from '@icons/takeoff.svg';
import landing from '@icons/landing.svg';

import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getFlightThankyou } from '@utils/axiosClients';
import { useRouter } from 'next/router';

import { changeCurrency } from 'src/helpers/exchangeCurrencyCalculation';
import { useAppSelector } from '@context';

import { FlexboxGrid, Modal } from 'rsuite';
import {
  BookingLayout,
  Details,
  ExtraServicesDropdown,
  ImageFallback,
  InfoPopup,
  ModalPolicy,
  SEO,
  Step,
} from '@components';
import { getFlightsAgentIdFromURL } from '@utils/userFunctions';
import config from '@config';
import formatDepartureTime from '@utils/formatDepartureTime';
import BookingReference from '@components/flights/BookingReference';
import { usePrice } from 'src/components/utils/Price/Price';

// SRR
export async function fetchData(id: string, isDuffel = false) {
  const [a, b] = id.split('--');

  const body = {
    booking_id: a,
    agent_id: b,
  };

  try {
    const response = await getFlightThankyou(body, isDuffel);

    return response.data;
  } catch (error) {
    console.error('Error fetching data Confirmation:', error);
    return null;
  }
}

export async function getServerSideProps({ params, locale }: any) {
  const isDuffel = params.id.startsWith('D--');

  const agentId = isDuffel ? params.id.replace('D--', '') : params.id;

  const data = await fetchData(agentId, isDuffel);

  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
      data,
      isDuffel,
    },
  };
}

const ComfirmationPage = ({ data, isDuffel }: any) => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const priceService = usePrice();

  const { id } = router.query;

  const [detailsArr, setDetailsArr] = useState([]);
  const [open, setOpen] = useState(false);
  const [showPolicies, setShowPolicies] = useState<boolean>(false);
  const [showCancelPolicy, setShowCancelPolicy] = useState<boolean>(false);

  const { flight_policies, extra_services, conditions } =
    data?.service?.selected_flight || {};

  const { service, main_contact, payments } = data;

  const { selected_flight } = service;

  const { flights, general_details } = selected_flight;

  const { type_of_trip } = general_details;

  const oneway: any = selected_flight.flights[0] || null;
  const roundTrip: any = selected_flight.flights[1] || null;
  const originalDepartCity =
    oneway?.departure_details.city_name.split(' - ')[0] ||
    roundTrip?.departure_details.city_name.split(' - ')[0];

  const originalArrivalcity =
    oneway?.arrival_details.city_name.split(' - ')[0] ||
    roundTrip?.arrival_details.city_name.split(' - ')[0];

  const agentId = getFlightsAgentIdFromURL(id, isDuffel);

  const logo = config.WHITELABELNAME === 'Volindo' ? logoV : logoFT;

  const formatDate = (param: any) => {
    const language = i18n.language;
    return (
      <>
        {language === 'en' ? (
          <span>{moment(param).locale('en').format('ddd, D MMM')}</span>
        ) : (
          <span>{moment(param).locale('es').format('ddd D MMM')}</span>
        )}
      </>
    );
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const showStops = (stops: any) => {
    handleOpen();
    setDetailsArr(stops);
  };

  const handlePolicies = () => {
    if (extra_services?.cancel_full_refund) setShowCancelPolicy(true);
    else setShowPolicies(true);
  };

  const getSectionTitle = (i: number) => {
    if (i === 0) return <span> Departing flight </span>;
    if (i === 1 && type_of_trip === 'R') return <span> Returning flight </span>;
    return <span> Departure </span>;
  };

  // component
  const Container = ({ index, flight }: any) => {
    const [isMinHeight, setIsMinHeight] = useState(true);

    const handleHieghtChange = () => {
      setIsMinHeight(!isMinHeight);
    };

    let style = {
      isMinHeight: isMinHeight ? '230px' : 'auto',
      overFlow: isMinHeight ? 'hidden' : 'visible',
      rotation: isMinHeight ? '0deg' : '180deg',
      maxHeight: isMinHeight ? '230px' : '5000px',
    };

    const { arrival_details, departure_details, stops, total_time } = flight;
    const { flight_number, class_code } = departure_details;
    const { days, hours, minutes } = total_time.total_time_formatted;

    return (
      <>
        <ModalPolicy
          open={showPolicies}
          onClose={() => setShowPolicies(false)}
          conditions={conditions}
        />
        <InfoPopup
          open={showCancelPolicy}
          onClose={() => setShowCancelPolicy(false)}
          title={t('flights.cancel-policy')}
          content={
            <>
              <p className="text-center">
                {t('flights.cancel-policy-text')}{' '}
                <a href={`mailto:${config.WHITELABELEMAIL}`}>
                  {config.WHITELABELEMAIL}
                </a>
              </p>
            </>
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
            {detailsArr.map((flight: any, i: number) => (
              <Details
                single={flight}
                key={i}
                i={i}
                originalArrivalcity={originalArrivalcity}
                originalDepartCity={originalDepartCity}
                totalTime={oneway.total_time.total_time_formatted}
              />
            ))}
          </Modal.Body>
        </Modal>

        <div className="w-full bg-[#1D1D1D] shadow-[0px 4px 20px 0px rgba(0, 0, 0, 0.02)] mb-[15px] rounded-[24px] md:mt-[0px] md:pt-[0px] md:px-[0px]">
          <ImageFallback
            src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${departure_details?.airline.marketing.airline_code}.svg`}
            className="flight-card-container-trip-depart-logo confirmation"
            style={{ marginBottom: '15px' }}
            fallbackSrc={logo.src}
          />
          <div
            className="flightsContainer flex flex-col gap-[10px] justify-between  w-full px-[19px]"
            style={{
              minHeight: `${style.isMinHeight}`,
              maxHeight: `${style.maxHeight}`,
              overflow: `${style.overFlow}`,
            }}
          >
            <div>
              <div className="flight-card-container-trip-depart-logo-container w-[100%]">
                <div className="flex flex-col gap-y-4">
                  <span className="flex text-[18px] mb-[7px] text-white md:mb-3">
                    {getSectionTitle(index)}&nbsp;
                    {flight_number} ({t(`flights.classes.${class_code}`)})
                  </span>
                </div>

                <div className="detailsFlightCard-title">
                  <div className="detailsFlightCard-title-city h-auto confirmation">
                    {originalDepartCity} - {originalArrivalcity}
                  </div>

                  <div className="detailsFlightCard-title-time">
                    {!!days && days} {!!days && 'days'} {!!hours && hours}{' '}
                    {!!hours && 'hours'} {minutes && minutes}{' '}
                    {!!minutes && 'minutes'}
                  </div>
                </div>

                <span className="flight-card-container-trip-depart-logo-name black">
                  {departure_details?.airline.marketing.airline_name}
                </span>
              </div>

              <FlexboxGrid
                justify="space-between"
                className="text-white/[.5] text-base my-[10px]"
                key={index}
              >
                <FlexboxGrid.Item colspan={7}>
                  <div className="flex flex-col gap-[6px] text-left">
                    <span className="departureDate">
                      <div className="text-[12px] font-[590] leading-[normal]">
                        {formatDepartureTime(departure_details?.departure_time)}
                      </div>
                      <span className="hidden md:block">
                        {departure_details.city_name}
                      </span>
                      {/* <br /> */}
                      <span className="text-[12px] font-[590] leading-[normal]">
                        {formatDate(departure_details.departure_date)}
                      </span>
                    </span>
                    <div className="md:hidden inline mr-auto w-[93px] border-[#2c2c2c] border relative">
                      <span className="absolute w-[24.09px] border border-white left-0" />
                      <span className="absolute w-[9.63px] border border-white right-0" />
                    </div>
                    <span className="md:hidden inline text-white/[.7] font-[590]">
                      {departure_details.airport}
                    </span>
                  </div>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={8}>
                  <div className="flex flex-col gap-y-2 text-center">
                    <span className="hidden md:block">
                      {totalTravelTime(total_time)}
                    </span>
                    <div className="hidden justify-between md:flex">
                      <Image className="" src={takeoff} alt="departure" />
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
                          {departure_details.airport}
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
                          {arrival_details.airport}
                        </span>
                      </div>
                    </div>
                  </div>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={7}>
                  <div className="flex flex-col gap-[6px] text-right">
                    <span className="arrivalDate">
                      <div className="text-[12px] font-[590] leading-[normal]">
                        {formatDepartureTime(arrival_details?.arrival_time)}
                      </div>
                      <span className="hidden md:block">
                        {arrival_details.city_name}
                      </span>
                      {/* <br /> */}
                      <span className="text-[12px] font-[590] leading-[normal]">
                        {formatDate(arrival_details.arrival_date)}
                      </span>
                    </span>
                    <div className="md:hidden inline ml-auto w-[93px] border-[#2c2c2c] border relative">
                      <span className="absolute w-[9.63px] border border-white left-0" />
                      <span className="absolute w-[24.09px] border border-white right-0" />
                    </div>
                    <span className="md:hidden inline text-white/[.7] font-[590]">
                      {arrival_details.airport}
                    </span>
                  </div>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </div>

            {stops.map((flight: any, i: number) => (
              <div>
                <Details
                  single={flight}
                  key={i}
                  i={i}
                  originalArrivalcity={''}
                  originalDepartCity={''}
                  totalTime={oneway.total_time.total_time_formatted}
                  origin={'small'}
                />
              </div>
            ))}
          </div>

          <div className="showButton mx-1 flex justify-center align-middle h-[35px] rounded-[24px] text-[#9F9F9F] text-[12px] font-[400] leading-[20px]">
            <div className="flex justify-center items-center">
              {!!stops && stops?.length > 0 ? (
                <p className="flex cursor-pointer" onClick={handleHieghtChange}>
                  <span className="text-[#9F9F9F] mx-[10px] flex justify-center align-middle">
                    {isMinHeight
                      ? `${t('common.show')}`
                      : `${t('common.hide')}`}
                  </span>
                  <Image
                    src={ArrowIcon}
                    width={10}
                    height={10}
                    alt="arrow"
                    style={{ rotate: `${style.rotation}` }}
                  />
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <SEO
        title={`${t('flights.confirmation.page')} (${
          service?.booking_info?.generated_pnr
        })`}
      />
      <BookingLayout isPublic={true} agentId={agentId}>
        <FlexboxGrid justify="center" className="w-full mt-10 px-3">
          <Step actualStep="Confirmation" />
        </FlexboxGrid>

        <div className="ConfirmationContainer flex flex-wrap justify-center items-center w-full m-auto pl-[17px] pr-[16px] gap-[10px] md:gap-[25px] md:flex-nowrap md:items-start">
          <div className="w-full md:max-w-[650px]">
            {flights.map((flight: any, i: number) => {
              return <Container key={i} index={i} flight={flight} />;
            })}
          </div>

          <div className="detailsContainer border-4 h-[50%] w-full rounded-[24px] bg-[#F6F5F7] px-[15px] pt-[25px] md:max-w-[407px]">
            <p className="text-black font-[590] text-[18px] mb-[12px] md:text-[20px]">
              {t('flights.details')} ({service?.booking_info?.generated_pnr})
            </p>

            {main_contact &&
              main_contact.map((contact: any, index: number) => {
                const {
                  first_name,
                  last_name,
                  email,
                  phone,
                  dob,
                  traveler_type,
                  age,
                } = contact;
                return (
                  <div
                    className="card flex min-h-[200px] py-[15px] pl-[19px] pr-[15px] flex-wrap bg-white rounded-[24px] mb-[15px]"
                    key={index}
                  >
                    <div className="w-[50%]">
                      <div className="mb-[4px]">
                        <span className="text-[12px] font-[400] leading-[20px] text-[#27272780] opacity-60">
                          {t('agent.fullname')}
                        </span>
                        <p className="text-[14px] font-[400] leading-[23px]">
                          {first_name} {last_name}
                        </p>
                      </div>
                      <div className="mb-[4px]">
                        <span className="text-[12px] font-[400] leading-[20px] text-[#27272780] opacity-60">
                          {t('agent.phone_number')}
                        </span>
                        <p className="text-[14px] font-[400] leading-[23px]">
                          {phone}
                        </p>
                      </div>
                    </div>
                    <div className="w-[50%]">
                      <div className="mb-[4px]">
                        <span className="text-[12px] font-[400] leading-[20px] text-[#27272780] opacity-60">
                          {t('stays.age')}
                        </span>
                        <p className="text-[14px] font-[400] leading-[23px]">
                          {moment().diff(dob, 'years') || 'N/A'}
                        </p>
                      </div>
                      <div className="mb-[4px]">
                        <span className="text-[12px] font-[400] leading-[20px] text-[#27272780] opacity-60">
                          {t('common.dob')}
                        </span>
                        <p> {dob} </p>
                      </div>
                      <div className="mb-[4px] overflow-hidden">
                        <span className="text-[12px] font-[400] leading-[20px] text-[#27272780] opacity-60">
                          {t('agent.email')}
                        </span>
                        <p className="text-[14px] font-[400] leading-[23px]">
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

            <div className="card flex min-h-[150px] p-[15px] bg-white rounded-[24px] text-[#27272780]  mb-[15px] flex-col">
              <span className="text-[14px] font-[400] leading-[20px]">
                {t('common.cost')}
              </span>
              <div className="flex justify-between text-[#3E3E3E] text-[14px] font-[510] leading-[24px] mb-[10px]">
                <span>Ticket </span>
                <span>
                  {priceService.countrySymbol}{' '}
                  {priceService.integerWithOneDecimal(payments.subtotal)}
                </span>
              </div>
              <div className="w-full">
                <BookingReference pnr={service?.booking_info?.generated_pnr} />
                <ExtraServicesDropdown
                  flights={flights}
                  flightPolicies={flight_policies}
                  extraServices={extra_services}
                />
              </div>
              <div className="flex justify-between text-[#3E3E3E] text-[14px] font-[510] leading-[24px] mb-[10px]">
                <span>{t('stays.transfer_fee')} </span>
                <span>
                  {priceService.countrySymbol}{' '}
                  {priceService.integerWithOneDecimal(
                    payments.extra_data.transaction_fee
                  )}{' '}
                </span>
              </div>
              <div className="flex justify-between  text-[14px] font-[700] leading-[24px] mb-[10px] text-whiteLabelColor">
                <span>Total</span>{' '}
                <span>
                  {priceService.countrySymbol}{' '}
                  {priceService.integerTotal(payments.total)}{' '}
                </span>
              </div>
            </div>

            {/* <p> Flight policies div </p> */}
            <div className="flex gap-1 items-center mb-5 text-black">
              <label htmlFor="policyCheck-1" className="cursor-pointer">
                <button onClick={handlePolicies} className="underline">
                  {extra_services?.cancel_full_refund
                    ? t('flights.flight-cancellation')
                    : t('flights.flight-policy-text-2')}
                </button>
              </label>
            </div>
          </div>
        </div>
      </BookingLayout>
    </>
  );
};

export default ComfirmationPage;
