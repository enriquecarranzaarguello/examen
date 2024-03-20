/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Checkbox } from 'rsuite';
import config from '@config';
import moment from 'moment';
import SearchLoader from 'src/components/SearchLoader';
// import { HotelService } from '@services/HotelsService';
import type { GetServerSidePropsContext } from 'next';

import Logo from '@icons/logo.svg';
import whitelabellogo from '@icons/whitelabellogo.png';
import clockIcon from '@icons/clock_gray.svg';
import starWhiteIcon from '@icons/star-white.svg';
import starGrayIcon from '@icons/star-gray.svg';
import calendarIcon from '@icons/calendar.svg';
import locationIcon from '@icons/pin-white.svg';
import paymentLogo from '@icons/paymentLogo.svg';

import { io } from 'socket.io-client';
import { getHotelData, translateDescription } from '@utils/axiosClients';
import { usePrice } from 'src/components/utils/Price/Price';
import AgentService from '@services/AgentService';
import { montserratFont } from '@components/Layout';
import { Lottie } from '@components/Lottie';
import {
  ReservationHotelType,
  ProfileType,
  type PaymentStayReservationTravelerTravelerType,
} from '@typing/types';

import {
  BookingLayout,
  ModalError,
  ModalPaymentError,
  ModalSupport,
  MapWrapper,
  ModalCancellationPolicy,
  ModalRateConditions,
  StripePayment,
  ModalImagesCarrousel,
  SEO,
  ExpandableContent,
  Step,
  GuestSummary,
  ModalGeneralText,
  ModalHotelImages,
} from '@components';

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        ['common'],
        nextI18nextConfig
      )),
    },
  };
}
// preaty sure this component exists
const renderStars = (stars: number) => {
  return (
    <div className="flex gap-3 items-center mb-[12px]">
      {new Array(stars).fill('').map((_, index) => (
        <Image
          key={index}
          width={15}
          height={15}
          alt="icon"
          src={starWhiteIcon}
        />
      ))}

      {new Array(5 - stars).fill('').map((_, index) => (
        <Image
          key={index}
          width={15}
          height={15}
          alt="icon"
          src={starGrayIcon}
        />
      ))}

      <label className="text-white text-[13px] font-[650] scale-x-[1.4]">
        {stars}.0
      </label>
    </div>
  );
};

// TODO check naming of this component
const Prebook = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  // const hotelService = new HotelService();

  const { payment_id } = router.query || '';
  const [bookingId, setBookingId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [buttonText, setButtonText] = useState('Pay');
  const [buttonBlocker, setButtonBlocker] = useState(true);
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [reservationHotel, setReservationHotel] =
    useState<ReservationHotelType | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState(0);
  const [showRateConditions, setShowRateConditions] = useState(false);
  const [data, setData] = useState<Partial<any>>({});
  // const [currency, setCurrency] = useState('USD');
  const [check, setCheck] = useState('0');
  const [openPolicies, setOpenPolicies] = useState(false);
  const [resTabs, setResTabs] = useState('ResDetails');
  const [successPage, setSuccessPage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openErrorPayment, setOpenErrorPayment] = useState<boolean>(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [hotelSlider, setHotelSlider] = useState(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  const [tester, setTester] = useState<string>('');

  const [agent, setAgent] = useState<ProfileType>({
    full_name: '',
    photo: '',
    phone_country_code: '',
    phone_number: '',
    birthday: '',
    address: '',
    city: '',
    country: '',
    state_province: '',
    zip_code: '',
    web_site: '',
    type_specialize: [],
    area_specialize: [],
    languages: [],
    url_facebook: '',
    url_instagram: '',
    url_whatsapp: '',
    description: '',
  });

  const [hotelData, setHotelData] = useState({
    id: '',
    external_id: '',
    hotel_name: '',
    address: '',
    stars: 0,
    description: '',
    latitude: '',
    longitude: '',
    amenities: [],
    hotel_amenities: [],
    hotel_pictures: [],
    price: 0,
    number_of_nights: 0,
    rooms: [],
    hotel: '',
    Images: [],
    cheaper_room: '',
    Map: '',
    LowestTotalFare: 0,
    HotelRating: 0,
    Address: '',
    HotelName: '',
    Id: '',
    Rating: 0,
    HotelFacilities: [],
    check_in_time: '',
    check_out_time: '',
    is_available: '',
    TotalFare: 0,
  });

  const [agentEmail, setAgentEmail] = useState('');

  const [recommendedPrice, setRecommendedPrice] = useState(0);

  const handlePayment = async () => {
    setButtonBlocker(false);
    setButtonText('Loading...');
    setPaymentConfirmed(true);

    setTimeout(() => {
      setButtonBlocker(true);
      setButtonText('Confirm and pay');
      setPaymentConfirmed(false);
    }, 3000);
  };

  useEffect(() => {
    if (typeof payment_id === 'string') {
      setBookingId(payment_id.split('--')[0]);
      setAgentId(payment_id.split('--')[1]);
    }
  }, []);

  const getReservationDetails = async () => {
    getHotelData(bookingId, agentId)
      .then(res => {
        //TODO Check if this do something
        const result = res.data;

        const reservation = result;
        setReservationHotel(reservation);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (bookingId && agentId) {
      getReservationDetails();
    }
  }, [agentId, bookingId]);

  const formatDate = (dateString: string | number | Date) => {
    const date = moment(dateString);
    date.locale('en');
    return date.format('ddd D, MMM, YYYY');
  };

  const handleDaysDiference = (
    check_in: String | Date | any,
    check_out: String | Date | any
  ) => {
    const checkIn = moment(check_in, 'YYYY-MM-DD');
    const checkOut = moment(check_out, 'YYYY-MM-DD');
    return checkOut.diff(checkIn, 'days');
  };

  const extractRoomAndCityView = (names: any) => {
    if (!Array.isArray(names)) {
      return ''; // Si no es un array, retorna una cadena vacía
    }

    return names.map((name: any, index: any) => {
      const elements = name.split(',').map((element: any) => element.trim());
      const room = elements[0];
      const cityView = elements[2] === 'NonSmoking' ? '' : elements[2];
      const bedCount = handleBeds(elements[1]);

      return (
        <div>
          <p className="font-[590] text-white text-[16px] leading-[24px] mb-[6px] md:text-[18px] md:mb-[10px]">
            {cityView === ''
              ? room
              : `${`Room ${index + 1}: `} ${room}, ${cityView}`}
          </p>
          <p>{bedCount}</p>
        </div>
      );
    });
  };

  const handleBeds = (name: any) => {
    if (
      name === '1 King Bed' ||
      name === '2 King Bed' ||
      name === '1 King Bed with Sofa bed'
    ) {
      return (
        <div className="flex flex-row gap-2 items-center mb-[15px]">
          <span className="text-[15px] text-white">{`${name}`}</span>
          <>
            <div className="flex flex-col justify-center items-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full mb-0.5"></div>
              <div className="w-2 h-0.5 bg-white"></div>
            </div>
          </>
        </div>
      );
    } else {
      <div className="flex flex-row gap-2 items-center mb-[15px]">
        {`${name}`}
        <>
          <div className="flex flex-col justify-center items-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full mb-0.5"></div>
            <div className="w-2 h-0.5 bg-white"></div>
          </div>
        </>
        <>
          <div className="flex flex-col justify-center items-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full mb-0.5"></div>
            <div className="w-2 h-0.5 bg-white"></div>
          </div>
        </>
      </div>;
    }
  };

  useEffect(() => {
    if (payment_id && typeof payment_id === 'string') {
      AgentService.getAgentProfile(agentId).then(res => {
        if (!res.status) {
          const newProfile: ProfileType = {
            full_name: res.full_name_account || '',
            photo: res.photo || '',
            address: res.address_full || '',
            city: res.address_city || '',
            state_province: res.address_state_province || '',
            country: res.address_country || '',
            zip_code: res.address_zip_code || '',
            phone_country_code: res.phone_country_code || '',
            phone_number: res.phone_number || '',
            birthday: res.birthday || '',
            web_site: res.web_site || '',
            url_facebook: res.url_facebook || '',
            url_instagram: res.url_instagram || '',
            url_whatsapp: res.url_whatsapp || '',
            languages: res.languages || [],
            area_specialize: res.area_specialize || [],
            type_specialize: res.type_specialize || [],
            description: res.description || '',
          };
          setAgent(newProfile);
        }
      });

      AgentService.getEmailByAgent_id(agentId).then(res => {
        if (!res.status) {
          setAgentEmail(res.email || '');
        }
      });
    }
  }, []);

  useEffect(() => {
    if (payment_id && typeof payment_id === 'string') {
      const paymentIdSplit = payment_id.split('--');
      const agentId = paymentIdSplit[1];
      AgentService.getAgentProfile(agentId).then(res => {
        if (!res.status) {
          const newProfile: ProfileType = {
            full_name: res.full_name_account,
            photo: res.photo || '',
            address: res.address_full,
            city: res.address_city,
            state_province: res.address_state_province,
            country: res.address_country,
            zip_code: res.address_zip_code,
            phone_country_code: res.phone_country_code,
            phone_number: res.phone_number,
            birthday: res.birthday,
            web_site: res.web_site,
            url_facebook: res.url_facebook,
            url_instagram: res.url_instagram,
            url_whatsapp: res.url_whatsapp,
            languages: res.languages,
            area_specialize: res.area_specialize,
            type_specialize: res.type_specialize,
            description: res.description,
          };
          setAgent(newProfile);
        }
      });
    }
  }, []);

  const price = usePrice();

  const handleSubmit = async () => {
    if (confirmPayment === false) {
      setButtonBlocker(false);
      setButtonText('Loading...');
      router.push(
        `/booking/payment/${bookingId}--${agentId}?selectedCurrency=${price.countryCode}`
      );
    } else {
      handlePayment();
    }
  };

  const PaymentComponent = () => {
    if (data.rooms) {
      return data.rooms.map((item: any, index: any) => (
        <div className="bg-[#242424] mb-5 p-[30px] rounded-[24px] flex items-center justify-center lg:pb-[40px]">
          <div className="w-full">
            <h2 className="font-[700] text-white text-[24px] leading-normal mb-[25px]">
              Pay details
            </h2>
            <StripePayment
              className=""
              clientSecret={clientSecret}
              type="payment"
              redirectUrl={
                `${window.location.href}?success=confirmation` || '/'
              }
              confirmationOutside={true}
              paymentConfirmed={paymentConfirmed}
            />
            {confirmPayment && (
              <div className="w-full items-start mt-5">
                <Image src={paymentLogo} alt="security logos" />
              </div>
            )}
          </div>
        </div>
      ));
    }
  };

  // TODO create or check for seperation
  const renderGuests = (
    guests: PaymentStayReservationTravelerTravelerType[] | any
  ) => {
    let adult = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      title: '',
    };

    const child = {
      istrue: false,
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      title: '',
    };

    return (
      <>
        <div className="">
          <h2 className="pl-[15px] pt-5 mb-[15px] font-[600] text-[18px] text-[#0C0C0C] leading-normal md:text-[20px] lg:w-full">
            {data.contact.lenght > 1 && (
              <span>{t('stays.reservation-details')}</span>
            )}
          </h2>
          {/* Name Details */}
          <div className="w-full bg-white rounded-[24px] p-4">
            <div className="flex flex-row">
              <div className="font-[400] text-[12px] w-1/2 text-[#272727]">
                <span className="opacity-50">
                  {t('stays.placeholder-first-name')}
                </span>
                <p className="font-[400] text-[14px] leading-[23px] text-black">{`${data.contact[0]?.first_name}`}</p>
              </div>
              <div className="font-[400] text-[12px] w-1/2 text-[#272727] leading-[20px] overflow-x-hidden">
                <span className="opacity-50">
                  {t('stays.placeholder-last-name')}
                </span>
                <p className="font-[400] text-[14px] leading-[23px] text-black">{`${data.contact[0]?.last_name}`}</p>
              </div>
            </div>
            <div className="flex flex-row pt-2">
              <div className="font-[400] text-[12px] w-1/2 text-[#272727] leading-[20px] overflow-x-hidden">
                <span className="opacity-50">
                  {t('stays.placeholder-phone')}
                </span>
                <p className="font-[400] text-[14px] leading-[23px] text-black">
                  {data.contact[0]?.phone}
                </p>
              </div>
              <div className="font-[400] text-[12px] w-1/2 text-[#272727] leading-[20px] overflow-x-hidden">
                <span className="opacity-50">
                  {t('stays.placeholder-email')}
                </span>
                <p className="font-[400] text-[14px] leading-[23px] text-black truncate max-w-full">
                  {data.contact[0]?.email}
                </p>
              </div>
            </div>
          </div>
          {/* Date Details */}
          <div className="w-full bg-white rounded-[24px] p-4 mt-5">
            <div className="flex flex-row">
              <div className="font-[400] text-[12px] w-1/2 text-[#272727] leading-[20px] overflow-x-hidden">
                <span className="opacity-50">Check-in</span>
                <div className="mt-1.5">
                  <div className="flex flex-row gap-3 items-center mb-1.5">
                    <Image
                      src={calendarIcon}
                      alt="Calendar"
                      width={18}
                      height={18}
                    />
                    <p className="text-black text-[14px] font-[400]">
                      {`${formatDate(data?.package?.check_in)}`}
                    </p>
                  </div>
                  {data?.check_in_time !== null && (
                    <div className="flex flex-row gap-3 items-center">
                      <Image
                        src={clockIcon}
                        alt="Clock Icon"
                        width={18}
                        height={18}
                      />
                      <p className="text-black text-[14px] font-[400]">
                        From {`${data?.check_in_time}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="font-[400] text-[12px] w-1/2 text-[#272727] leading-[20px] overflow-x-hidden">
                <span className="opacity-50">Check-out</span>
                <div className="mt-1.5">
                  <div className="flex flex-row gap-3 items-center mb-1.5">
                    <Image
                      src={calendarIcon}
                      width={18}
                      height={18}
                      alt="Calendar"
                      className=""
                    />
                    <p className="text-black text-[14px] font-[400]">
                      {`${formatDate(data?.package?.check_out)}`}
                    </p>
                  </div>
                  {data?.check_out_time !== null && (
                    <div className="flex flex-row gap-3 items-center">
                      <Image
                        src={clockIcon}
                        alt="Clock Icon"
                        width={18}
                        height={18}
                      />
                      <p className="text-black text-[14px] font-[400]">
                        By {`${data?.check_out_time}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const ImageComponent = (Images: any) => {
    const firstImage = Images[0]; // Obtener la primera imagen
    const remainingImages =
      windowSize < 768 ? Images.slice(1, 3) : Images.slice(1, 5); // Obtener las imágenes restantes

    return (
      <div
        className="flex flex-row w-full gap-[10px] mb-[15px] md:mb-[20px]"
        onClick={() => setHotelSlider(true)}
      >
        <div className="min-w-[160px] md:w-1/2">
          <img
            src={firstImage}
            alt="First Image"
            className="w-full h-full object-center object-cover rounded-sm"
          />
        </div>
        <div className="min-w-[140px] w-1/2 grid grid-cols-1 gap-2 items-center md:grid-cols-2 lg:gap-x-[10px] lg:gap-y-[8px]">
          {remainingImages.map((image: string, index: number) => (
            <div
              className="w-full h-full flex items-center justify-center max-h-[140px]"
              key={index}
            >
              {index === remainingImages.length - 1 ? (
                <div className="relative h-full w-full">
                  <img
                    src={image}
                    alt={`Image ${index + 2}`}
                    className="w-full h-full object-center object-cover rounded-sm"
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <div
                      className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex items-center justify-center h-full"
                      style={{ zIndex: 1 }}
                    >
                      <p className="text-white text-[20px] font-[500] text-center">
                        +{`${Images.length}`}{' '}
                        <span className="text-[14px]">Photos</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={image}
                  alt={`Image ${index + 2}`}
                  className="w-full h-full object-center object-cover rounded-sm"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const daysOfService = handleDaysDiference(
    data?.package?.check_in,
    data?.package?.check_out
  );

  const renderContent = () => {
    const handleClick = () => {
      const recipientEmail = process.env.WHITELABELEMAIL;
      const subject = 'Hello, Support!';
      const body = 'I need help?';
      window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    };

    const logoWhiteLabel =
      window.location.host.includes('dashboard.volindo.com') ||
      window.location.host.includes('dashboard.dev.volindo.com')
        ? Logo
        : whitelabellogo;

    {
      if (data.rooms) {
        return data.rooms.map(
          (
            item: {
              Name: any;
              guests: any;
              Inclusion: any;
              name:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | React.ReactFragment
                | React.ReactPortal
                | Iterable<React.ReactNode>
                | null
                | undefined;
            },
            index: any
          ) => (
            <React.Fragment key={index}>
              <div
                className={`${
                  !confirmPayment
                    ? `${
                        resTabs !== 'Confirmation'
                          ? 'grid lg:grid-cols-5 px-[20px]'
                          : 'flex'
                      }`
                    : 'px-[20px] lg:flex lg:flex-row lg:justify-between xl:px-[40px]'
                }`}
              >
                {!confirmPayment ? (
                  <>
                    {resTabs !== 'Confirmation' && (
                      <div className="lg:col-span-3 lg:mr-[20px]">
                        {successPage === 'true' &&
                          (reservationHotel &&
                          (reservationHotel.status === 'booked' ||
                            reservationHotel.status === 'cancelled') &&
                          reservationHotel.service &&
                          reservationHotel.service.response_book_tbo &&
                          reservationHotel.service.response_book_tbo.Status &&
                          reservationHotel.service.response_book_tbo.Status
                            .Code === 200 ? (
                            <div>
                              <h1 className="text-white text-[36px] font-[760] mb-4">
                                Booking Confirmation
                              </h1>
                            </div>
                          ) : (
                            <div>
                              <h1 className="text-red-500/70 text-[36px] font-[760] mb-4">
                                Booking was not confirmed
                              </h1>
                            </div>
                          ))}
                        {data.package?.Images ? (
                          <div>{ImageComponent(data.package?.Images)}</div>
                        ) : (
                          <div className="w-full flex row items-center h-[160px] border-2 border-white rounded-xl">
                            <Image
                              src={logoWhiteLabel}
                              width={100}
                              height={50}
                              alt="Volindo Logo"
                              className="w-full h-[100px] my-2 p-2 mb-5"
                            />
                          </div>
                        )}
                        {/* Hotel Names */}
                        <div className="">
                          <h1
                            className={`${montserratFont.className} text-white font-[900] text-[18px] leading-normal mb-[10px] md:text-[20px]`}
                          >
                            {data.package?.hotel_name}
                          </h1>
                          <div className="flex flex-row gap-[6.5px] mb-[12px]">
                            <Image
                              src={locationIcon}
                              alt="Pin Icon"
                              width={12}
                              height={12}
                            />
                            <span className="text-[13px] text-white opacity-[0.65]">
                              {windowSize < 600
                                ? shortenText(data.package?.address, 45)
                                : data.package?.address}
                            </span>
                          </div>
                          <div>{renderStars(data.package?.stars || 0)}</div>
                          {item && <p>{extractRoomAndCityView(item.Name)}</p>}
                        </div>

                        {/* Hotel Description */}
                        <ExpandableContent
                          description={tester.replace(/HeadLine\s*:\s*/g, '')}
                          roomAmenities={''}
                          hotelAmenities={''}
                        />
                        {/* Hotel Icons */}
                        <ExpandableContent
                          description={''}
                          roomAmenities={data?.roomAmenities}
                          hotelAmenities={data?.hotelAmenities}
                        />

                        <div className="w-full h-[205px] rounded-[24px] overflow-hidden mb-[20px]">
                          {hotelData?.latitude && hotelData?.longitude ? (
                            <MapWrapper
                              dataResult={[
                                {
                                  ...hotelData,
                                  rooms: [
                                    {
                                      TotalFare: data?.total_price,
                                    },
                                  ],
                                },
                              ]}
                              activeMarker={activeMarker}
                              setActiveMarker={setActiveMarker}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="lg:w-[48%] lg:mr-[15px] xl:w-[55%] xl:mr-[35px]">
                      {PaymentComponent()}
                    </div>
                  </>
                )}

                <div className="lg:col-span-2 h-fit bg-[#F6F5F7] rounded-[24px] pb-5 px-2.5">
                  {renderGuests(item.guests)}
                  {/* Price Details */}
                  <div className="w-full bg-white rounded-[24px] p-4 mt-5 text-[#272727] mb-[15px]">
                    <h3 className="mb-[10px] text-[rgba(39, 39, 39, 0.50)] leading-normal">
                      <span className="opacity-50">{t('stays.summary')}</span>
                    </h3>
                    {data?.transaction_details?.number_of_rooms && (
                      <GuestSummary
                        rooms={data?.transaction_details?.number_of_rooms}
                        adults={data?.transaction_details?.number_of_adults}
                        childs={data?.transaction_details?.number_of_children}
                      />
                    )}
                    <div className="flex flex-row w-full justify-between items-center mb-[5px]">
                      <p className="text-[14px] text-black font-[400] m-0">
                        {price.countrySymbol}
                        {`${(
                          price.integerRate(
                            data.total_price -
                              data.transaction_details.transactionFee
                          ) / daysOfService
                        ).toFixed(2)}`}{' '}
                        x {`${daysOfService}`} {t('stays.nights')}
                      </p>
                      <p className="text-[14px] text-black font-[510] m-0">
                        {price.countrySymbol}
                        {price.integerWithOneDecimal(
                          data.total_price -
                            data.transaction_details.transactionFee
                        )}
                      </p>
                    </div>
                    {!recommendedPrice && (
                      <div className="flex w-full flex-row justify-between items-center">
                        <p className="text-[14px] text-black font-[400] m-0">
                          {t('stays.comission')} 4%
                        </p>
                        <p className="text-[14px] text-black font-[510] m-0">
                          {price.countrySymbol}
                          {price.integerWithOneDecimal(
                            data.transaction_details.transactionFee
                          )}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-row justify-between mt-[15px]">
                      <p className="text-whiteLabelColor font-[700] text-[16px]">
                        Total
                      </p>
                      <p className="text-whiteLabelColor font-[700] text-[16px] m-0">
                        {price.countrySymbol}
                        {price.integerTotal(data?.total_price)}
                      </p>
                    </div>
                  </div>
                  {/* Button and Checkbox */}
                  <div className="flex flex-row gap-2 items-center text-[#272727] mb-[15px]">
                    <Checkbox
                      value={check}
                      onChange={(value, checked) =>
                        setCheck(checked ? '1' : '0')
                      }
                    />
                    <p className="text-[12px] text-[#767676]">
                      {t('reservations.agreement')}{' '}
                      <span
                        className="text-[12px] font-[600] underline cursor-pointer"
                        onClick={() => setOpenPolicies(true)}
                      >
                        {t('reservations.cancellation_text')}
                      </span>
                      <span>{` ${t('stays.and')} `}</span>
                      <span
                        className="
                          underline py-2 cursor-pointer font-[600]"
                        onClick={() => setShowRateConditions(true)}
                      >
                        {t('stays.rate-conditions')}
                      </span>
                    </p>
                  </div>
                  <button
                    disabled={check === '0' || !buttonBlocker}
                    className="text-black text-[16px] font-[650] bg-whiteLabelColor rounded-[24px] w-[225.76px] overflow-x-hidden md:w-full sm:w-full xs:w-full h-[48px] capitalize"
                    onClick={handleSubmit}
                  >
                    {!buttonBlocker ? (
                      <div className="flex items-center justify-center">
                        <SearchLoader />
                      </div>
                    ) : (
                      <span className="block scale-x-[1.4]">
                        {t('common.pay')}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </React.Fragment>
          )
        );
      }
      // Render the modal window if the conditions are not met
      return null;
    }
  };

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getData = async () => {
    getHotelData(bookingId, agentId)
      .then(res => {
        if (res.status === 200) {
          const result = res.data;
          const { rooms, check_in, check_out, nationality } =
            result.service.search_parameters;
          const {
            id_meilisearch,
            name_room,
            meal_type,
            inclusion,
            with_transfers,
            is_refundable,
            cancel_policies,
            roomAmenities,
            hotelAmenities,
            rateConditions,
            supplements,
            description,
          } = result.service;

          const { provider_price } = result.payments;

          const reservation = result;
          //TODO Delete recomended price from here
          setRecommendedPrice(
            reservation.payments.transaction_details.recommendedPrice
          );

          const socket = io(`${config.socket_api}`);

          const message2 = {
            params: {
              rooms,
              check_in,
              check_out,
              currency: 'USD',
              city: null,
              hotel_id: id_meilisearch,
              nationality: nationality || 'US',
              room: {
                Name: name_room,
                MealType: meal_type,
                Inclusion: inclusion,
                WithTransfers: with_transfers,
                IsRefundable: is_refundable,
                CancelPolicies: cancel_policies,
                TotalFare: parseFloat(provider_price),
              },
            },
          };

          socket.emit('hotel:roomprice:update', JSON.stringify(message2));

          socket.on('hotel:roomprice:update', hotel => {
            const hotels = hotel.result;
            // TODO check for values in redux
            if (hotel.statuscode === 200) {
              setData({
                roomAmenities,
                hotelAmenities,
                rateConditions,
                cancel_policies,
                supplements,
                is_refundable,
                agentId: agentId,
                agent: reservation.agent,
                id: reservation.booking_id,
                subtotal: hotels[0].Rooms[0].TotalFare,
                display_price: hotels[0].Rooms[0].TotalFare,
                display_total_price: hotels[0].Rooms[0].TotalFare,
                check_in_time: hotels[0].CheckInTime,
                check_out_time: hotels[0].CheckOutTime,
                approved_at: 'null | string',
                provider_price: hotels[0].ProviderPrice,
                total_price: reservation.payments.total,
                agent_commission: reservation.payments.agent_commission,
                transaction_details: reservation.payments.transaction_details,
                reservation: {
                  rooms: [hotels[0].Rooms],
                },
                rooms: hotels[0].Rooms,
                //rooms:[],
                contact: reservation.main_contact,
                package: {
                  hotel_name: hotels[0].HotelName,
                  check_in,
                  check_out,
                  stars: hotels[0].HotelRating,
                  Images: hotels[0].Images,
                  id: hotels[0].Id,
                  address: hotels[0].Address,
                  external_id: '',
                  latitude: parseFloat(hotels[0].Map.split('|')[0]),
                  longitude: parseFloat(hotels[0].Map.split('|')[1]),
                  hotel_amenities: hotels[0].HotelFacilities,
                  hotel_pictures: hotels[0].Images,
                  description,
                  price: hotels[0].LowestTotalFare,
                  number_of_nights: 3,
                  hotel: '',
                  cheaper_room: '',
                },
              });
              setHotelData({
                id: '',
                external_id: '',
                hotel_name: hotels[0].HotelName || '',
                description: '',
                amenities: hotels[0].CategoriesFound || '',
                hotel_amenities: [],
                hotel_pictures: [],
                price: 0,
                number_of_nights: 0,
                rooms: [],
                hotel: '',
                cheaper_room: '',
                Map: '',
                LowestTotalFare: 0,
                HotelRating: hotels[0].HotelRating || 0,
                Address: '',
                HotelName: '',
                Id: '',
                Rating: 0,
                HotelFacilities: [],
                check_in_time: '',
                check_out_time: '',
                is_available: '',
                address: hotels[0].Address,
                stars: hotels[0].HotelRating,
                latitude: hotels[0].Map.split('|')[0],
                longitude: hotels[0].Map.split('|')[1],
                Images: hotels[0].Images,
                TotalFare: 0,
              });
              setLoader(false);
            } else {
              setErrorMessage(`${t('common.errors.session_expired_traveler')}`);
              setLoader(false);
              setShowErrorModal(true);
              return;
            }
          });
        }
      })
      .catch(error => {
        console.error(error);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (bookingId && agentId) {
      getData();
    }
  }, [bookingId, agentId]);

  const shortenText = (text: string, howManyWords: number) => {
    if (text.length > howManyWords) {
      return text.slice(0, howManyWords) + '...';
    }
    return text;
  };

  const redirectHome = () => {
    router.push('/', '/', { locale: i18n.language });
  };

  const handleTranslateDescription = () => {
    let description = data?.package?.description || '';

    const message = {
      text: description,
      original_lg: 'EN',
      translate_lg: 'ES',
    };

    if (i18n.language === 'es') {
      translateDescription(message)
        .then(res => {
          setTester(res.data);
        })
        .catch(error => {
          console.error(error);
        });
      return;
    }
    setTester(description);
  };

  useEffect(() => {
    if (data?.package?.description) {
      handleTranslateDescription();
    }
  }, [i18n.language, data?.package?.description]);

  const stayDetails: any = {
    Images: data.package?.Images,
    hotel_name: data?.package?.hotel_name,
    stars: data?.package?.stars,
  };

  return (
    <>
      <SEO title={t('SEO.proposal_thanyou')} />
      <BookingLayout isPublic={true} agentId={agentId}>
        <ModalGeneralText
          open={showErrorModal}
          onClose={redirectHome}
          title={`${t('common.errors.sessionExpired')}`}
          text={errorMessage}
          cb={redirectHome}
        />

        <ModalError open={openError} onClose={() => setOpenError(false)} />

        <ModalPaymentError
          open={openErrorPayment}
          onClose={() => setOpenErrorPayment(false)}
        />

        <ModalSupport
          open={openSupport}
          onClose={() => setOpenSupport(false)}
        />

        {showRateConditions && data?.rateConditions && (
          <ModalRateConditions
            open={showRateConditions}
            onClose={() => setShowRateConditions(false)}
            rateConditions={data?.rateConditions}
          />
        )}

        {data.cancel_policies && (
          <div>
            <ModalCancellationPolicy
              open={openPolicies}
              onClose={() => setOpenPolicies(false)}
              policies={data.cancel_policies}
              supplements={data.supplements}
              isRefundable={data.is_refundable}
            />
          </div>
        )}

        {loader && (
          <div className="wrapperCarLoader">
            <Lottie src={'/carLoader.json'} className="carLoader" />
          </div>
        )}

        {windowSize < 768 ? (
          <div className="">
            {resTabs !== 'Confirmation' ? (
              <Step actualStep="ResDetails" />
            ) : (
              <Step actualStep="Confirmation" />
            )}
            <div>{renderContent()}</div>
          </div>
        ) : (
          <div>
            {data.id ? (
              <div className="h-auto pt-4 px-12 bg-black text-white flex flex-col w-full">
                <div>
                  {/* Actual Page */}
                  {resTabs !== 'Confirmation' ? (
                    <Step actualStep="ResDetails" />
                  ) : (
                    <Step actualStep="Confirmation" />
                  )}
                </div>

                {/* RESERVATION DETAILS */}
                <div className="max-w-[1100px] m-[0_auto] lg:w-full">
                  <div>
                    <div className="pb-[50px]">{renderContent()}</div>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        )}
      </BookingLayout>
      {hotelSlider && (
        <ModalHotelImages
          open={hotelSlider}
          onClose={() => setHotelSlider(false)}
          stay={stayDetails}
        />
      )}
    </>
  );
};

export default Prebook;
