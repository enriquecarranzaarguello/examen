import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useAppSelector } from '@context';
import { DisplayAddressMap, Details } from '@components';

import { Carousel } from 'react-responsive-carousel';

import { useTranslation } from 'next-i18next';
import calendarWhite from '@icons/calendar-white.svg';
import userDefaultIMG from '@icons/userDefaultIMG.svg';
import IconCloseBlack from '@icons/close-black.svg';
import phone from '@icons/phone.svg';
import email from '@icons/email.svg';
import computerIcon from '@icons/computerIcon.svg';
import volindo from '@images/volindo.png';
import whatsappIcon from '@icons/whatsappIcon.svg';
import pingray from '@icons/pin-gray.svg';
import starWhite from '@icons/star-white.svg';
import starGrayIcon from '@icons/star-gray.svg';
import copyVolindoIcon from '@icons/copy.svg';
import copyFlywayIcon from '@icons/copy_flyway.svg';
import clockIcon from '@icons/clock.svg';

import Image from 'next/image';
import { ResevationDetailsProps, DetailCAncelProps } from '@typing/proptypes';
import { RervationCRMprops } from '@typing/types';

import axios from 'axios';

import { useSession } from 'next-auth/react';
import config from '@config';

import ImageFallback from 'src/components/utils/ImageFallback';

import logoV from '@icons/noAirline.svg';
import logoFT from '@icons/noAirlineFT.svg';

import takeoff from '@icons/takeoff.svg';
import landing from '@icons/landing.svg';

import { FlexboxGrid, Modal } from 'rsuite';
import formatDepartureTime from '@utils/formatDepartureTime';

const ReservationPolicies = ({
  open,
  onClose,
  reservationDets,
  isRefundable,
}: DetailCAncelProps) => {
  if (!open) return null;
  const { t } = useTranslation('common');

  //  TODO check if this format is correct
  const formatDate = (param: any, refundable: any) => {
    if (!refundable) return '';
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const testDate = param.split(' ');
    const date = testDate[0];
    const [day, month, year] = date.split('-');
    const newToday = new Date(Date.UTC(year, month - 1, day));

    // return  <span>{ newToday.toLocaleDateString("es-ES", options) }</span>
    return <span>{newToday.toLocaleDateString('es-ES')}</span>;
  };

  const formatCharge = (
    { CancellationCharge, ChargeType, a }: any,
    refund: any
  ) => {
    if (!refund)
      return (
        <span>
          {t('stays.room')} {t('stays.non-refundable')}{' '}
        </span>
      );
    const expr = ChargeType;
    let type = '';
    let quote: any = '';

    switch (expr) {
      case 'Fixed':
        type = '$';
        quote = `${t('common.cancel-policy')} ${type}${CancellationCharge} ${t(
          'common.before'
        )} `;
        break;
      case 'Percentage':
        type = '%';
        quote = testee(CancellationCharge, ChargeType, type);
        break;
      default:
        type = '';
        quote = '';
    }

    return <span>{quote}</span>;
  };

  const testee = (charge: any, charge_type: any, type: any) => {
    if (charge === 100) {
      return t('common.full-charge');
    }

    const test = (
      <span>
        {`${charge} ${type}`} {t('common.partial-charge')}
      </span>
    );
    return test;
  };

  const reservations = reservationDets;

  const supplement = reservations?.service?.supplements;

  const cancelPolicies = reservations?.service?.cancel_policies;

  return (
    <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-[60]">
      <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] rounded-[16px] py-10 px-5 h-auto max-h-[80%] min-w-[250px] max-w-[500px]">
        <button className="absolute -top-5 -right-5" onClick={onClose}>
          <Image alt="icon" src={IconCloseBlack} />
        </button>
        <div className="">
          <label className="text-white text-[40px] font-[760]">
            {t('stays.cancellation-policy')}
          </label>
          {cancelPolicies && cancelPolicies.length > 0 ? (
            <ul className="text-white">
              <span>
                {cancelPolicies.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between px-4 mb-1 mt-1"
                  >
                    <label className="text-white opacity-[.78]">
                      {formatCharge(item, isRefundable)}
                    </label>
                    <label className="text-white opacity-[.78]">
                      {formatDate(item.FromDate, isRefundable)}
                    </label>
                  </div>
                ))}
              </span>
              <span>
                {supplement?.[0]?.map((supplement: any, index: number) => (
                  <ul key={index} className="text-white">
                    <li className="flex justify-between px-4 mb-2">
                      <label className="text-white opacity-[.78]">
                        {supplement.Description.substring(0, 1).toUpperCase() +
                          supplement.Description.replace(/_/g, ' ').slice(
                            1
                          )}{' '}
                        : {supplement.Type}
                      </label>
                      <label className="text-white opacity-[.78]">
                        {supplement.Currency}
                        {'$'}
                        {supplement.Price}
                      </label>
                    </li>
                  </ul>
                ))}
              </span>
            </ul>
          ) : (
            <p className="text-white">{t('stays.no-cancellation-policy')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ModalReservationDetails = ({
  open,
  onClose,
  res_id,
  reservationDets,
}: ResevationDetailsProps) => {
  const exchangeCurrencyCode = useAppSelector(
    state => state.general.currency.selectedCurrency
  );

  const agent = useAppSelector(state => state.agent);
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const [showReservationPolicies, setShowReservationPolicies] = useState(false);
  const [hotelSlider, setHotelSlider] = useState(false);
  const [reservation, setReservation] = useState<RervationCRMprops>({
    Address: '',
    Attractions: {},
    CheckInTime: '',
    CheckOutTime: '',
    CityId: '',
    CityName: '',
    CountryCode: '',
    CountryName: '',
    Description: '',
    FaxNumber: '',
    HotelFacilities: [''],
    HotelName: '',
    HotelRating: 0,
    Id: '',
    Images: [''],
    Map: '',
    PhoneNumber: '',
    PinCode: '',
    _Document__doc: {
      Map: '',
    },
  });

  const [openStops, setOpenStops] = useState(false);
  const [detailsArr, setDetailsArr] = useState([]);

  const { service, payment } = reservationDets;

  const getIcons = (param: any) => {
    const obj: any = {
      Flywaytoday: copyFlywayIcon,
      Volindo: copyVolindoIcon,
    };

    return obj[param];
  };

  let copyIcon = getIcons(config.WHITELABELNAME);

  const Stars = ({ stars }: { stars?: number }) => {
    const rating = stars || 0;

    return (
      <div className="flex gap-3 items-center mt-1">
        {new Array(rating).fill('').map((_, index) => (
          <Image key={index} alt="icon" src={starWhite} />
        ))}

        {new Array(5 - rating).fill('').map((_, index) => (
          <Image key={index + rating} alt="icon" src={starGrayIcon} />
        ))}
      </div>
    );
  };

  const getFormatDate = (date_checkin: any | String) => {
    const fecha = moment(date_checkin);
    fecha.locale(i18n.language);
    const fechaFormateada = fecha.format('ddd, D MMM');

    return fechaFormateada;
  };

  const nightsBetween = (checkIn: string, checkOut: string) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffDays = Math.round(
      Math.abs((checkInDate.getTime() - checkOutDate.getTime()) / oneDay)
    );
    return diffDays;
  };

  const handleReservationDetails = () => {
    localStorage.setItem('reservation', JSON.stringify(reservationDets));
    if (reservationDets?.service?.service_type === 'hotels') {
      window.open(
        `${window.location.protocol}//${window.location.hostname}/reservations/details/${reservationDets?.booking_id}--${reservationDets?.agent_id}`,
        '_blank'
      );
    } else if (service.service_type === 'Flights') {
      const isDuffel = service.provider === 'Duffel';
      let pageToOpen = '';
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      if (payment === 'paid')
        pageToOpen = `${window.location.protocol}//${
          window.location.host
        }/booking-flight/confirmation/${isDuffel ? 'D--' : ''}${
          reservationDets.booking_id
        }--${
          reservationDets.agent_id
        }?success=true&selectedCurrency=${exchangeCurrencyCode}`;
      else
        pageToOpen = `${window.location.protocol}//${
          window.location.host
        }/booking-flight/express-pay/${isDuffel ? 'D--' : ''}${
          reservationDets.booking_id
        }--${
          reservationDets.agent_id
        }?success=true&selectedCurrency=${exchangeCurrencyCode}`;
      window.open(pageToOpen);
    } else {
      window.open(
        `${window.location.protocol}//${window.location.hostname}/suppliers/proposal/confirmation/${reservationDets?.booking_id}--${reservationDets?.agent_id}`,
        '_blank'
      );
    }
  };

  const handlePhone = () => {
    window.location.href = `tel:${reservation?.PhoneNumber}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${reservationDets?.main_contact[0]?.email}`;
  };

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?l=${i18n.language}&phone=${reservationDets?.main_contact[0]?.phone}`,
      '_blank'
    );
  };

  useEffect(() => {
    // todo check this use effect this component may just be a presentational component
    if (res_id) {
      axios
        .get(`${config?.api}/bookings/crm/${res_id}`, {
          headers: {
            Authorization: 'Bearer ' + session?.user.id_token || '',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        .then(res => {
          setReservation(res.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [res_id]);

  const defineTitle = (i: number) => {
    const multiFlightTest = !!multiFlights && multiFlights.length > 2;
    let variable = '';
    if (multiFlightTest) return `${t('flights.flight')} ${i + 1}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    i === 0
      ? (variable = t('flights.departure'))
      : (variable = t('flights.return'));
    return variable;
  };

  const totalTravelTime = (dateObj: any) => {
    if (!!dateObj) {
      const { days, hours, minutes } = dateObj.total_time_formatted;

      return (
        <span>
          {!!hours && hours} {!!hours && 'h'} {!!minutes && minutes}
          {!!minutes && 'm'}
        </span>
      );
    }
  };

  const formatDate = (param: any) => {
    const language = i18n.language;
    return (
      <>
        {language === 'en' ? (
          <span>{moment(param).locale('en').format('ddd, D MMMM')}</span>
        ) : (
          <span>{moment(param).locale('es').format('ddd D MMMM')}</span>
        )}
      </>
    );
  };

  const handleOpen = () => setOpenStops(true);
  const handleClose = () => setOpenStops(false);

  const showStops = (stops: any) => {
    handleOpen();
    setDetailsArr(stops);
  };

  const oneway: any = service?.selected_flight?.flights[0] || null;
  const roundTrip: any = service?.selected_flight?.flights[1] || null;
  const multiFlights = service?.selected_flight?.flights || null;

  const originalDepartCity =
    oneway?.departure_details.city_name?.split(' - ')[0] ||
    roundTrip?.departure_details.city_name?.split(' - ')[0];

  const originalArrivalcity =
    oneway?.arrival_details.city_name?.split(' - ')[0] ||
    roundTrip?.arrival_details.city_name?.split(' - ')[0];

  const logo = config.WHITELABELNAME === 'Volindo' ? logoV : logoFT;

  const handleCopyLink = () => {
    let variable = '';
    if (reservationDets?.service?.service_type === 'hotels') {
      variable = `${window.location.protocol}//${window.location.hostname}/reservations/details/${reservationDets?.booking_id}--${reservationDets?.agent_id}`;
    } else if (service.service_type === 'Flights') {
      const isDuffel = service.provider === 'Duffel';
      let pageToCopy = '';
      if (payment === 'paid')
        pageToCopy = `${window.location.protocol}//${
          window.location.host
        }/booking-flight/confirmation/${isDuffel ? 'D--' : ''}${
          reservationDets.booking_id
        }--${reservationDets.agent_id}?success=true`;
      else
        pageToCopy = `${window.location.protocol}//${
          window.location.host
        }/booking-flight/express-pay/${isDuffel ? 'D--' : ''}${
          reservationDets.booking_id
        }--${reservationDets.agent_id}?success=true`;

      variable = pageToCopy;
    } else {
      variable = `${window.location.protocol}//${window.location.hostname}/suppliers/proposal/confirmation/${reservationDets?.booking_id}--${reservationDets?.agent_id}`;
    }
    navigator.clipboard.writeText(variable);
  };
  if (!open) return null;
  return (
    <>
      {showReservationPolicies && (
        <ReservationPolicies
          open={true}
          onClose={() => setShowReservationPolicies(false)}
          reservationDets={reservationDets}
          isRefundable={reservationDets.service.is_refundable}
          res_id={''}
        />
      )}

      {hotelSlider && reservation?.Images && (
        <div className="fixed inset-0  flex justify-center items-center z-50 w-screen h-screen backdrop-blur-md">
          <div className="relative  shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] h-[57%] w-[77%] flex justify-center rounded-xl  md:w-[77%]  lg:rounded-[16px] lg:p-4 lg:max-w-[77%]  2xl:w-auto">
            <button
              onClick={() => setHotelSlider(false)}
              className="absolute -top-5 -right-6 z-[50]"
            >
              <Image alt="icon" src={IconCloseBlack} />
            </button>
            <div className="flex flex-col  justify-center items-center py-6 px-20 scale-[.3] sm:scale-[.45] md:scale-75  xl:scale-100 lg:mt-0  xl:mt-28 2xl:scale-100">
              <div className="flex justify-center flex-col items-center px-[150px] pb-24">
                <div className="flex flex-col justify-center items-center">
                  <h2 className="text-[32px] font-[760] text-white">
                    {reservation?.HotelName}
                  </h2>
                  <div className="flex space-x-5 mb-[22px]">
                    <Stars stars={reservation?.HotelRating || 0} />
                  </div>
                </div>

                <Carousel
                  centerMode
                  showThumbs
                  stopOnHover
                  className="w-[735px] h-[498px] hotelcarousel"
                  autoPlay
                  showStatus={false}
                  showIndicators={false}
                  renderArrowPrev={(clickHandler: any, hasPrev: any) => {
                    return (
                      <div
                        className={`${
                          hasPrev ? 'absolute' : 'hidden'
                        } top-0 bottom-0 left-0 flex justify-center items-center p-3  hover:opacity-100 cursor-pointer z-20`}
                        onClick={clickHandler}
                      >
                        <svg
                          width={50}
                          height={50}
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="15"
                            cy="15"
                            r="15"
                            transform="rotate(180 15 15)"
                            fill="white"
                          />
                          <path
                            d="M13.3452 15L16.2071 17.8619C16.4674 18.1223 16.4674 18.5444 16.2071 18.8047C15.9467 19.0651 15.5246 19.0651 15.2643 18.8047L11.9309 15.4714C11.6706 15.2111 11.6706 14.7889 11.9309 14.5286L15.2643 11.1953C15.5246 10.9349 15.9467 10.9349 16.2071 11.1953C16.4674 11.4556 16.4674 11.8777 16.2071 12.1381L13.3452 15Z"
                            fill="#383838"
                          />
                        </svg>
                      </div>
                    );
                  }}
                  renderArrowNext={(clickHandler: any, hasNext: any) => {
                    return (
                      <div
                        className={`${
                          hasNext ? 'absolute' : 'hidden'
                        } top-0 bottom-0 right-0 flex justify-center items-center p-3  hover:opacity-100 cursor-pointer z-20`}
                        onClick={clickHandler}
                      >
                        <svg
                          className="rotate-180"
                          width={50}
                          height={50}
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="15"
                            cy="15"
                            r="15"
                            transform="rotate(180 15 15)"
                            fill="white"
                          />
                          <path
                            d="M13.3452 15L16.2071 17.8619C16.4674 18.1223 16.4674 18.5444 16.2071 18.8047C15.9467 19.0651 15.5246 19.0651 15.2643 18.8047L11.9309 15.4714C11.6706 15.2111 11.6706 14.7889 11.9309 14.5286L15.2643 11.1953C15.5246 10.9349 15.9467 10.9349 16.2071 11.1953C16.4674 11.4556 16.4674 11.8777 16.2071 12.1381L13.3452 15Z"
                            fill="#383838"
                          />
                        </svg>
                      </div>
                    );
                  }}
                >
                  {reservation?.Images?.map((image: any, index: number) => (
                    <div
                      key={index}
                      className="w-[735px] h-[498px] object-fill "
                    >
                      <img
                        width={100}
                        height={100}
                        src={image}
                        alt={'images'}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={openStops}
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

      <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-40">
        <div className="w-full h-full pt-[14px] max-w-[500px] relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] md:max-w-[773px] px-[20px] rounded-2xl md:px-10 md:w-auto">
          <button
            onClick={onClose}
            className="absolute right-7 top-[15px] z-[50] xs:-right-1"
          >
            <Image alt="icon" src={IconCloseBlack} />
          </button>

          <div className="flex flex-col gap-y-[30px] lg:mt-0 pb-[80px] px-[5px] overflow-y-auto h-[800px] scrollbar-hide md:mt-0 md:px-20">
            <h2 className="text-[32px] font-[650] text-white scale-y-75 md:font-[760]">
              {t('suppliers.reservation')}
            </h2>

            <div className="flex flex-col justify-center items-center">
              <div className="status flex flex-row items-center w-full h-9 justify-between bg-white/[0.08] rounded-md px-2">
                <p className="text-base font-normal text-white/50 m-0">
                  {t('reservations.tripstats')}
                </p>
                {/* TODO refactor styles */}
                <p
                  className={`${
                    reservationDets?.status_trip_reservation ===
                      'Just finished' ||
                    (reservationDets?.status === 'Just finished' &&
                      'text-green-500')
                  } 

                  ${
                    reservationDets?.status_trip_reservation === 'On going' ||
                    (reservationDets?.status === 'On going' && 'text-green-500')
                  }
                  ${
                    reservationDets?.status_trip_reservation === 'Paid' ||
                    (reservationDets?.status === 'paid' && 'text-green-500')
                  }
                  ${
                    reservationDets?.status_trip_reservation ===
                      'Coming soon' ||
                    (reservationDets?.status === 'Coming soon' &&
                      'text-orange-500')
                  } 
                  ${
                    reservationDets?.status_trip_reservation === 'Pending' ||
                    (reservationDets?.status === 'prebook' && 'text-orange-500')
                  }
                  ${
                    reservationDets?.status_trip_reservation === 'Cancelled' ||
                    (reservationDets?.status === 'Canceled' && 'text-red-500')
                  }  text-base font-normal  m-0`}
                >
                  {reservationDets?.status_trip_reservation ||
                    reservationDets?.status}
                </p>
              </div>

              {reservationDets.service.service_type != 'Flights' && (
                <div className="stars mt-[13px] flex gap-8 justify-between w-full">
                  <div className="flex flex-col xs:w-[70%]">
                    {reservationDets?.service?.supplier_type && (
                      <h2 className="font-[650] text-[20px] text-white capitalize">
                        {reservationDets?.service?.supplier_type}
                      </h2>
                    )}
                    <span className="text-white/[0.64] text-base flex w-[283px] gap-2 xs:w-[100%] xs:text-[12px]">
                      <Image
                        src={pingray}
                        width={16}
                        height={16}
                        alt={'graypin'}
                      />
                      {reservation?.Address}
                    </span>
                    <span className="text-white text-base flex gap-2  items-center">
                      <Stars stars={reservation?.HotelRating || 0} />
                      <span className="mt-2">{reservation?.HotelRating}.0</span>
                    </span>
                  </div>
                  <div className="w-auto h-[94px] rounded-xl border overflow-hidden border-white/50 flex items-center justify-center">
                    <DisplayAddressMap
                      lat={reservationDets?.service?.latitude || 0}
                      lng={reservationDets?.service?.longitude || 0}
                    />
                  </div>
                </div>
              )}

              <h2 className="text-[24px] text-white font-[760] scale-y-75 float-left w-full mt-[15px] mb-[10px] md:my-[35px]">
                Agent
              </h2>

              <div className="agentBlock grid w-full mb-[15px] md:grid-rows-2 md:space-y-[21px] md:mb-0">
                <div className="grid grid-cols-1 text-white w-full mb-[5px] md:mb-0 md:grid-cols-2">
                  <div className="flex gap-2 items-center text-[15px]">
                    <Image
                      className="rounded-full bg-black"
                      src={userDefaultIMG}
                      width={32}
                      height={32}
                      alt="reservation"
                    />
                    <label> {agent?.profile?.full_name}</label>
                  </div>
                  <div className="hidden md:flex gap-2 items-center">
                    <Image
                      className="mr-[5px]"
                      src={email}
                      width={24}
                      height={24}
                      alt="download"
                    />
                    <label> {agent.email}</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-[5px] text-white w-full md:grid-cols-2">
                  <div className="flex gap-2 items-center">
                    <Image
                      className="mr-[5px]"
                      src={phone}
                      width={24}
                      height={24}
                      alt="download"
                    />
                    <label>
                      {' '}
                      {reservationDets.agent.phone_number || 'no number'}
                    </label>
                  </div>
                  <div className="flex gap-2 items-center md:hidden">
                    <Image
                      className="mr-[5px]"
                      src={email}
                      width={24}
                      height={24}
                      alt="download"
                    />
                    <label> {agent.email}</label>
                  </div>
                  <div className="flex justify-start gap-2 items-center">
                    <Image
                      className="mr-[5px]"
                      src={computerIcon}
                      width={24}
                      height={24}
                      alt="download"
                    />
                    <label className="flex  w-full">
                      {' '}
                      {agent?.profile?.web_site || 'no website'}
                    </label>
                  </div>
                </div>
              </div>

              {reservationDets.service.service_type != 'Flights' && (
                <div className="checkinCheckout w-full h-[54px] bg-white/[0.08] rounded-lg px-[15px] flex items-center justify-between mt-7 md:px-[54px]">
                  <div className="flex flex-col gap-y-[2.74px]">
                    <p className="text-xs text-white/50">Check-in</p>
                    <div className="flex gap-2">
                      <Image
                        src={calendarWhite}
                        width={13.65}
                        height={13.65}
                        alt="calendar"
                      />
                      <p className="text-base text-white">
                        {getFormatDate(reservationDets?.service?.check_in) ||
                          getFormatDate(reservationDets?.service?.date_checkin)}
                      </p>
                    </div>
                  </div>
                  <div className="w-[50px] bg-black border border-black" />

                  {/* {reservationDets?.service?.service_type === 'suppliers' &&
                    reservationDets?.service?.supplier_type !==
                      'accommodation' && (
                      <div className="flex flex-col gap-y-[2.74px]">
                        <p className="text-xs text-white/50">Check-in</p>
                        <div className="flex gap-2">
                          <Image
                            src={calendarWhite}
                            width={13.65}
                            height={13.65}
                            alt="calendar"
                          />
                          <p className="text-base text-white">
                            {reservationDets?.service?.supplier_type ===
                            'accommodation'
                              ? getFormatDate(
                                  reservationDets?.service?.rooms[0]
                                    ?.accommodation_date_checkout
                                )
                              : getFormatDate(
                                  reservationDets?.service?.check_out
                                )}
                          </p>
                        </div>
                      </div>
                  <div className="w-[50px] bg-black border border-black" />
                    )} */}

                  {reservationDets?.service?.service_type === 'suppliers' &&
                  reservationDets?.service?.supplier_type !==
                    'accommodation' ? (
                    <div className="flex flex-col gap-y-[2.74px]">
                      <p className="text-xs text-white/50">Time</p>
                      <div className="flex gap-2">
                        <Image
                          src={clockIcon}
                          width={13.65}
                          height={13.65}
                          alt="calendar"
                        />
                        <p className="text-base text-white">
                          {reservationDets?.service?.service_time}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-y-[2.74px]">
                      <p className="text-xs text-white/50">Check-out</p>
                      <div className="flex gap-2">
                        <Image
                          src={calendarWhite}
                          width={13.65}
                          height={13.65}
                          alt="calendar"
                        />
                        <p className="text-base text-white">
                          {reservationDets?.service?.supplier_type ===
                          'accommodation'
                            ? getFormatDate(
                                reservationDets?.service?.rooms[0]
                                  ?.accommodation_date_checkout
                              )
                            : getFormatDate(
                                reservationDets?.service?.check_out
                              )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {reservationDets?.service?.service_type === 'hotels' ? (
                reservationDets?.service?.name_room.map(
                  (room: any, index: any) => (
                    <div key={index} className="flex flex-col w-full">
                      <div className=" w-full flex flex-col py-6 mb-5">
                        <h2 className="text-white text-2xl font-medium mb-3">
                          {t('stays.guest')}
                        </h2>
                        <div className="flex justify-between items-center gap-3">
                          <label className="text-[#777e91] text-sm font-normal">
                            {t('stays.name')}
                          </label>
                          <label className="text-base text-white font-normal">
                            {`${reservationDets?.main_contact[0]?.first_name} ${reservationDets?.main_contact[0]?.last_name}`}
                          </label>
                        </div>
                        <div className="flex justify-between items-center  gap-3">
                          <label className="text-[#777e91] text-sm font-normal">
                            {t('stays.placeholder-phone')}
                          </label>
                          <label className="text-base text-white font-normal">
                            {reservationDets?.main_contact[0]?.phone ||
                              reservationDets?.main_contact[0]?.phone_number}
                          </label>
                        </div>
                        <div className="flex justify-between items-center  gap-3">
                          <label className="text-[#777e91] text-sm font-normal">
                            {t('stays.placeholder-email')}
                          </label>
                          <label className="text-base text-white font-normal">
                            {reservationDets?.main_contact[0]?.email}
                          </label>
                        </div>
                      </div>

                      <div className="">
                        <div
                          key={index}
                          className="w-full flex gap-3 mt-12 border-b border-b-[var(--primary-background)] pb-5"
                        >
                          <div className="w-[193px] h-[94px] rounded-xl border overflow-hidden border-white/50 flex items-center justify-center">
                            {reservation?.Images?.length > 0 ? (
                              <div
                                onClick={() => setHotelSlider(true)}
                                className="min-w-[200px] min-h-[160px] rounded-[12px]"
                                style={{
                                  backgroundImage: `url(${
                                    reservation?.Images[
                                      Math.floor(
                                        Math.random() *
                                          reservation?.Images?.length
                                      )
                                    ]
                                  })`,
                                  backgroundSize: 'cover',
                                  backgroundRepeat: 'no-repeat',
                                  backgroundPosition: 'center',
                                }}
                              />
                            ) : (
                              <div className="w-[200px] h-[160px] bg-black rounded-[12px] flex justify-center items-center">
                                <Image
                                  alt="logo"
                                  src={volindo.src}
                                  width={105}
                                  height={32}
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <label>Room {index + 1}</label>
                            <span className="text-white text-base">
                              {reservationDets?.service?.name_room[index]}
                            </span>

                            <span className="text-white text-base h-7 overflow-hidden">
                              {room.supplements &&
                                room.supplements.flat().map(
                                  (supplement: any) =>
                                    supplement && (
                                      <p key={supplement}>
                                        {supplement.Description &&
                                          supplement.Description.replace(
                                            /_/g,
                                            ' '
                                          )
                                            .split(' ')
                                            .map(
                                              (word: string | any[]) =>
                                                word[0].toUpperCase() +
                                                word.slice(1)
                                            )
                                            .join(' ')}{' '}
                                        {supplement.Price &&
                                          `$${supplement.Price}`}{' '}
                                        {supplement.Currency}{' '}
                                        {supplement.Type &&
                                          supplement.Type.slice(0, 2)}{' '}
                                        {supplement.Type &&
                                          supplement.Type.slice(2)}
                                      </p>
                                    )
                                )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="flex flex-col w-full">
                  <h2 className="text-[24px] font-[650] scale-y-75 text-white leading-normal">
                    {t('stays.traveler')} 1
                  </h2>
                  <div className="flex flex-row justify-between items-center">
                    <p className="font-[400] text-[14px]">{t('stays.name')}</p>
                    <p className="font-[400] text-[15px] text-[#FFFFFF]">
                      {reservationDets?.main_contact[0]?.first_name}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <p className="font-[400] text-[14px]">
                      {t('stays.placeholder-phone')}
                    </p>
                    <p className="font-[400] text-[15px] text-[#FFFFFF]">
                      {reservationDets?.main_contact[0]?.phone_number ||
                        reservationDets?.main_contact[0]?.phone}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <p className="font-[400] text-[14px]">
                      {t('stays.placeholder-email')}
                    </p>
                    <p className="font-[400] text-[15px] text-[#FFFFFF]">
                      {reservationDets?.main_contact[0]?.email}
                    </p>
                  </div>

                  {service.service_type != 'Flights' && (
                    <div className="flex flex-row justify-between items-center">
                      <p className="font-[400] text-[14px]">
                        {t('stays.age')}, {t('stays.gender')} j
                      </p>
                      <p className="font-[400] text-[15px] text-[#FFFFFF]">
                        {reservationDets?.main_contact[0]?.age}
                        {', '}
                        {reservationDets?.main_contact[0]?.title}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {/* HERE WE ARE */}
              {service?.selected_flight?.flights.map(
                (item: any, index: number) => {
                  const {
                    departure_details,
                    arrival_details,
                    total_time,
                    stops,
                  } = item;
                  return (
                    <>
                      <FlexboxGrid className="items-start w-[100%]" key={index}>
                        <FlexboxGrid.Item>
                          <div className="flex width-full">
                            <span className="text-[24px] font-[650] scale-y-75 md:inline-block my-[15px] md:text-[23px] md:leading[23px] text-white">
                              {defineTitle(index)}
                            </span>
                          </div>
                        </FlexboxGrid.Item>
                      </FlexboxGrid>

                      <div className="container">
                        <div className="flex justify-between items-end">
                          <div className="mb-[13px] md:hidden">
                            <div className="text-[18px] font-[510] text-white">
                              {departure_details.city_name} -{' '}
                              {arrival_details.city_name}
                            </div>
                            <div className="text-[13px] text-white/75">
                              {totalTravelTime(total_time)} on the way
                            </div>
                          </div>

                          <div className="flight-card-container-trip-depart-logo-container w-fit">
                            <ImageFallback
                              src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-lockup/${departure_details?.airline.marketing.airline_code}.svg`}
                              className="flight-card-container-trip-depart-logo"
                              style={{ marginBottom: '7px' }}
                              fallbackSrc={logo.src}
                            />
                            <span className="flight-card-container-trip-depart-logo-name black">
                              {
                                departure_details?.airline.marketing
                                  .airline_name
                              }
                            </span>
                          </div>
                        </div>
                        <FlexboxGrid
                          justify="space-between"
                          className="IMHERE text-white/[.5] text-base w-full"
                          align="middle"
                        >
                          <FlexboxGrid.Item colspan={7}>
                            <div className="flex flex-col gap-[6px] text-left">
                              <span className="departureDate">
                                <div className="text-[12px] font-[590] leading-[normal]">
                                  {formatDepartureTime(
                                    departure_details?.departure_time
                                  )}
                                </div>
                                <span className="hidden md:block">
                                  {departure_details.city_name}
                                </span>
                                <span className="text-[12px] font-[590] leading-[normal]">
                                  {getFormatDate(
                                    departure_details.departure_date
                                  )}
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
                                    {departure_details.airport}
                                  </span>

                                  {stops?.length > 0 ? (
                                    <span
                                      className="mt-[50px] text-[16px] font-[590] md:-mt-2 underline hover:cursor-pointer md:text-[12px]"
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
                                  {formatDepartureTime(
                                    arrival_details?.arrival_time
                                  )}
                                </div>
                                <span className="hidden md:block">
                                  {arrival_details.city_name}
                                </span>
                                <span className="text-[12px] font-[590] leading-[normal]">
                                  {getFormatDate(arrival_details.arrival_date)}
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
                    </>
                  );
                }
              )}
              {/*  end of details  */}
              <div className="w-full flex flex-col gap-[5px] mt-6 mb-[10px]">
                <div>
                  {reservationDets?.service?.service_type === 'hotels' ? (
                    <div className="flex justify-between">
                      <span className="text-sm text-white/50">
                        {`$${Math.round(
                          parseFloat(
                            reservationDets?.payments?.provider_price
                          ) /
                            nightsBetween(
                              reservationDets?.service?.check_in,
                              reservationDets?.service?.check_out
                            )
                        )}${' '}`}
                        x{' '}
                        {nightsBetween(
                          reservationDets?.service?.check_in,
                          reservationDets?.service?.check_out
                        )}{' '}
                        <span className="lowercase">{t('stays.nights')}</span>
                      </span>

                      <div className="flex justify-between">
                        <span className="text-sm text-white">
                          ${Math.round(reservationDets?.payments?.subtotal)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-sm text-white/50">Subtotal</span>
                      <span className="text-sm text-white">
                        ${Math.round(reservationDets?.payments?.provider_price)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/50">Commision</span>
                  <span className="text-sm text-white">
                    ${reservationDets?.payments?.agent_commission}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/50">Volindo fee 4%</span>
                  <span className="text-sm text-white">
                    ${Math.round(reservationDets?.payments?.total * 0.04)}
                  </span>
                </div>
              </div>
              <div className="w-full h-10 rounded-lg bg-white/[0.08] mt-2 mb-5 p-3 flex justify-between items-center">
                <span className="text-base text-white">Total</span>
                <span className="text-base text-white">
                  ${Math.round(reservationDets?.payments?.total)}
                </span>
              </div>
              {service?.service_type != 'Flights' && (
                <div className="w-full float-left">
                  <button
                    className="text-base text-white underline"
                    onClick={() => setShowReservationPolicies(true)}
                  >
                    Cancellation policy
                  </button>
                </div>
              )}
              <div className="w-full flex flex-col justify-center items-center gap-y-[18px] mt-[51px] mb-[50px]">
                <button
                  className="bg-whiteLabelColor w-full h-12 rounded-3xl text-white text-[22px] font-bold md:w-[352px]"
                  onClick={handleReservationDetails}
                >
                  <span className="block scale-y-75">
                    {t('suppliers.reservation-button')}
                  </span>
                </button>

                <button
                  className="border-whiteLabelColor border w-full h-12 rounded-3xl text-whiteLabelColor  text-[22px] font-bold flex justify-center items-center md:w-[352px]"
                  onClick={handleCopyLink}
                >
                  <span className="block scale-y-75">
                    {t('reservations.copy-link')}
                  </span>
                </button>
              </div>
              <div className="w-[148px] flex justify-around">
                <button onClick={handleWhatsApp}>
                  <Image
                    className="mr-[5px]"
                    src={whatsappIcon}
                    width={16}
                    height={16}
                    alt="download"
                  />
                </button>
                <button onClick={handleEmail}>
                  <Image
                    className="mr-[5px]"
                    src={email}
                    width={18}
                    height={18}
                    alt="download"
                  />
                </button>
                <button onClick={handlePhone}>
                  {' '}
                  <Image
                    className="mr-[5px]"
                    src={phone}
                    width={18}
                    height={18}
                    alt="download"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalReservationDetails;
