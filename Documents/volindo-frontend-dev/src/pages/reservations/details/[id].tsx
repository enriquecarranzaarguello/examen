/* eslint-disable @typescript-eslint/no-redeclare */
// TODO check translation and remove unsude code
import { useRouter } from 'next/router';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import config from '@config';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { useTranslation } from 'react-i18next';
import type { GetServerSidePropsContext } from 'next';
import { Checkbox } from 'rsuite';

import type { ProfileType } from '@typing/types';
import { getDaysDifference } from '@utils/timeFunctions';

import volindoLogo from '@icons/logo.svg';
import whitelabellogo from '@icons/whitelabellogo.png';
import clockIcon from '@icons/clock-gray.svg';
import starWhite from '@icons/star-white.svg';
import starGrayIcon from '@icons/star-gray.svg';
import calendarIcon from '@icons/calendar.svg';
// import categoryHotelIcon from '@icons/hotelIcons/whiteIcons/checkHotel.svg';

import { Lottie } from '@components/Lottie';

import { io } from 'socket.io-client';
import { useAppDispatch } from '@context';
import locationIcon from '@icons/pin-white.svg';
// import HotelLoader from '@components/HotelLoader';

import { usePrice } from 'src/components/utils/Price/Price';

import { translateDescription } from '@utils/axiosClients';

import {
  MapWrapper,
  BookingLayout,
  ModalCancelConfirmation,
  ModalConfirmCancellation,
  ModalCancellationPolicy,
  ModalSupport,
  SEO,
  ExpandableContent,
  ModalRateConditions,
  GuestSummary,
  ModalHotelImages,
} from '@components';

import styles from './styles.module.scss';

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

const ReservationDetailsPage = () => {
  const [openSupport, setOpenSupport] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation('common');

  // TODO seems that there is repeating states check this
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
  const [reservationDetails, setReservationDetails] =
    useState<ReservationDetails>();
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [stay, setStay] = useState<any>({
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
  });
  const [openPolicies, setOpenPolicies] = useState(false);
  const [showRateConditions, setShowRateConditions] = useState(false);

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
  const [modal, setModal] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [slider, setSlider] = useState(false);

  const [check, setCheck] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [tester, setTester] = useState<string>('');

  const daysOfService = getDaysDifference(
    stay?.service?.check_in,
    stay?.service?.check_out
  );

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(0);

    useEffect(() => {
      const handleResize = () => setWindowSize(window.innerWidth);

      handleResize(); // Set initial window size
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
  };

  const windowSize = useWindowSize();

  const [reservationId, setReservationId] = useState('');

  const priceCurrency = usePrice();

  useEffect(() => {
    const url = window.location.href;
    const urlParams = url.substring(url.lastIndexOf('/') + 1);
    const params = urlParams.split('--');
    setAgentId(params[1]);
    setReservationId(`${params[0]}||${params[1]}`);
  }, []);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      const roomsStatic = [
        {
          Name: [''],
          DayRates: [
            [
              {
                BasePrice: 0,
              },
            ],
          ],
          MealType: '',
          TotalTax: 0,
          Amenities: ['', ''],
          Inclusion: '',
          TotalFare: 0,
          BookingCode: '',
          IsRefundable: false,
          RoomPromotion: [''],
          WithTransfers: false,
          CancelPolicies: [
            {
              FromDate: '',
              ChargeType: '',
              CancellationCharge: 0,
            },
          ],
        },
      ];

      try {
        const response = await fetch(`${config.api}/bookings/${reservationId}`);
        const data = await response.json();
        setStay(data);

        const socket = io(`${config.socket_api}`);

        const message2 = {
          params: {
            rooms: data.service.search_parameters.rooms,
            check_in: data.service.search_parameters.check_in,
            check_out: data.service.search_parameters.check_out,
            currency: 'USD',
            city: null,
            hotel_id: data.service.id_meilisearch,
            nationality: data.service.search_parameters.nationality || 'US',
            room: {
              Name: data.service.name_room,
              MealType: data.service.meal_type,
              Inclusion: data.service.inclusion,
              WithTransfers: data.service.with_transfers,
              IsRefundable: data.service.is_refundable,
              CancelPolicies: data.service.cancel_policies,
              TotalFare: parseFloat(data.service.provider_price),
            },
          },
        };

        socket.emit('hotel:roomprice:update', JSON.stringify(message2));

        socket.on('hotel:roomprice:update', hotel => {
          const statuscode = hotel.statuscode;
          const hotels = hotel.result;
          if (data.status?.status === 'Failed') {
            setReservationDetails({ ...data, rooms: roomsStatic });
          } else {
            setHotelData({
              id: '',
              external_id: '',
              hotel_name: '',
              description:
                data?.service?.description || hotels?.[0]?.Description || '',
              amenities:
                data?.service?.roomAmenities ||
                hotels?.[0]?.HotelFacilities ||
                [],
              hotel_amenities: data?.service?.hotelAmenitites || [],
              hotel_pictures: hotels?.[0]?.Images,
              price: 0,
              number_of_nights: 0,
              rooms: hotels?.[0]?.Rooms,
              hotel: '',
              cheaper_room: '',
              Map: '',
              LowestTotalFare: 0,
              HotelRating: 0,
              Address: '',
              HotelName: '',
              Id: '',
              Rating: 0,
              HotelFacilities: [],
              check_in_time: hotels?.[0]?.CheckInTime || '',
              check_out_time: hotels?.[0]?.CheckOutTime || '',
              is_available: '',
              address: hotels?.[0]?.Address,
              stars: hotels?.[0]?.HotelRating,
              latitude: hotels?.[0]?.Map.split('|')[0],
              longitude: hotels?.[0]?.Map.split('|')[1],
              Images: hotels?.[0]?.Images,
              TotalFare: 0,
            });

            setReservationDetails(data);
          }
        });
        return data;
      } catch (error) {
        console.error('Error fetching reservation details:', error);
        return null;
      }
    };

    const waitForBookingConfirmation = async () => {
      const startTime = Date.now();
      const timeout = 15000;
      const updateDetailsAndCheck = async () => {
        const data: any = await fetchReservationDetails();
        if (!data) {
          if (Date.now() - startTime > timeout) {
            setLoading(false);
          } else {
            setTimeout(updateDetailsAndCheck, 3000);
          }
          return;
        }

        setReservationDetails(data);

        if (
          data.status === 'booked' ||
          (data.status === 'cancelled' &&
            data.service.response_book_tbo?.Status?.Code === 200)
        ) {
          setLoading(false);
        } else if (Date.now() - startTime > timeout) {
          setLoading(false);
        } else {
          setTimeout(updateDetailsAndCheck, 3000);
        }
      };

      updateDetailsAndCheck();
    };
    waitForBookingConfirmation();
  }, [reservationId]);

  const handleClick = async () => setModal(true);

  // TODO move to axios file
  const handleThrowConfirmation = async () => {
    setCancelLoading(true);
    const response = await fetch(
      `${config.api}/bookings/cancellation/tbo/${reservationId}`,
      {
        method: 'POST',
      }
    );
    if (response.status === 200) {
      setModal(false);
      setModalCancel(true);
      setCancelLoading(false);
      setTimeout(() => {
        location.reload();
      }, 10000);
    }
  };

  const handleCloseConfirmCancelation = () => setModalCancel(false);

  // TODO move to typ file
  interface ReservationDetails {
    payments: any;
    service: any;
    status: any;
    payment: string;
    main_contact: any;
    cancelled_at: any;
    confirmation_number?: string;
  }

  const handleCloseModal = () => setModal(false);

  const handleImage = (Images: any) => {
    let output;

    switch (Images.length) {
      case 1:
        output = (
          <Image
            src={Images[0]}
            alt="profile icon"
            width={500}
            height={500}
            className="w-full h-full object-center object-cover rounded-xl"
          />
        );
        break;

      case 2:
        output = (
          <>
            <div className="w-1/2 h-[220px]">
              <Image
                src={Images[0]}
                alt="profile icon"
                width={500}
                height={500}
                className="w-full h-full object-center object-cover rounded-xl mr-2"
              />
            </div>
            <div className="w-1/2 h-[220px]">
              <Image
                src={Images[1]}
                alt="profile icon"
                width={500}
                height={500}
                className="w-full h-full object-center object-cover rounded-xl ml-2"
              />
            </div>
          </>
        );
        break;

      default:
        const firstImage = Images[0];
        const remainingImages =
          windowSize < 768 ? Images.slice(1, 3) : Images.slice(1, 5);

        const handleImageClick = () => {
          if (Images.length >= 5) {
            setSlider(true);
          }
        };

        output = (
          <div
            className="flex flex-row w-full gap-[10px] mb-[15px] md:mb-[20px]"
            onClick={handleImageClick}
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
                          className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
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
        break;
    }

    return output;
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = moment(dateString);
    date.locale('en');
    return date.format('ddd D, MMM, YYYY');
  };

  const renderStars = (stars: number) => {
    return (
      <div className="flex gap-3 items-center mt-1">
        {new Array(stars).fill('').map((_, index) => (
          <Image key={index} alt="icon" src={starWhite} />
        ))}

        {new Array(5 - stars).fill('').map((_, index) => (
          <Image key={index} alt="icon" src={starGrayIcon} />
        ))}

        <label className="text-[13px] font-[650]">{stars}.0</label>
      </div>
    );
  };

  const handleBeds = (name: any) => {
    if (
      name === '1 King Bed' ||
      name === '2 King Bed' ||
      name === '1 King Bed with Sofa bed'
    ) {
      return (
        <div className="flex flex-row gap-2 items-center">
          {`${name}`}
          <>
            <div className="flex flex-col justify-center items-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full mb-0.5"></div>
              <div className="w-2 h-0.5 bg-white"></div>
            </div>
          </>
        </div>
      );
    } else {
      <div className="flex flex-row gap-2 items-center">
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

  const extractRoomAndCityView = (names: any) => {
    if (!Array.isArray(names)) {
      return '';
    }

    return names.map((name: any, index: any) => {
      const elements = name.split(',').map((element: any) => element.trim());
      const room = elements[0];
      const cityView = elements[2] === 'NonSmoking' ? '' : elements[2];
      const bedCount = handleBeds(elements[1]);

      return (
        <div key={index}>
          <p className="font-[590] text-white text-[18px] my-1">
            {cityView === ''
              ? room
              : `${`Room ${index + 1}: `} ${room}, ${cityView}`}
          </p>
          <p>{bedCount}</p>
        </div>
      );
    });
  };

  const logoWhiteLabel =
    window.location.host.includes('dashboard.volindo.com') ||
    window.location.host.includes('dashboard.dev.volindo.com')
      ? volindoLogo
      : whitelabellogo;

  const handleTranslateDescription = () => {
    let description = hotelData.description || stay?.service?.description || '';

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
    if (hotelData?.description) {
      handleTranslateDescription();
    }
  }, [i18n.language, hotelData?.description]);

  const stayDetails: any = {
    Images: hotelData?.Images,
    hotel_name: reservationDetails?.service?.hotel_name,
    stars: hotelData?.stars,
  };

  return (
    <>
      <SEO title={t('SEO.confirmation')} />
      {loading ? (
        <div className="wrapperCarLoader">
          <Lottie src={'/carLoader.json'} className="carLoader" />
        </div>
      ) : (
        <BookingLayout isPublic={true} agentId={agentId}>
          <ModalSupport
            open={openSupport}
            onClose={() => setOpenSupport(false)}
          />

          <ModalConfirmCancellation
            open={modal}
            onClose={handleCloseModal}
            loading={cancelLoading}
            deleteBooking={handleThrowConfirmation}
          />

          <ModalCancelConfirmation
            open={modalCancel}
            onClose={handleCloseConfirmCancelation}
          />

          {showRateConditions && (
            <ModalRateConditions
              open={showRateConditions}
              onClose={() => setShowRateConditions(false)}
              rateConditions={reservationDetails?.service?.rateConditions}
            />
          )}
          <div>
            {reservationDetails && (
              <div>
                <ModalCancellationPolicy
                  open={openPolicies}
                  onClose={() => setOpenPolicies(false)}
                  supplements={reservationDetails.service.supplements}
                  policies={reservationDetails.service.cancel_policies}
                  isRefundable={reservationDetails.service.is_refundable}
                />

                <div className="max-w-[1100px] m-[0_auto] pt-[50px] pb-[50px] px-[15px] md:px-[30px] lg:px-0 lg:w-full">
                  {/* Booking Confirmation */}
                  <div className="w-full">
                    {reservationDetails?.status === 'cancelled' ? (
                      <h2 className="flex pl-[42px] text-[20px] font-[650] text-red-500/70 mb-[27px] md:text-[32px] md:pl-[55px]">
                        <span className="block scale-x-[1.4]">
                          Booking Cancelled
                        </span>
                      </h2>
                    ) : reservationDetails?.status === 'booked' ||
                      reservationDetails?.status === 'finished' ? (
                      <h2 className="flex pl-[42px] text-[20px] font-[650px] text-[#FBFBFB] mb-[27px] md:text-[32px] md:pl-[65px]">
                        <span className="block scale-x-[1.4]">
                          {t('suppliers.booking-confirmation')}
                        </span>
                      </h2>
                    ) : (
                      <>
                        <h2
                          className={styles.bookingConfirmation_notConfirmed_h2}
                        >
                          {t('reservations.your-reservation-not-confirmed')}
                        </h2>
                        <p
                          className={styles.bookingConfirmation_notConfirmed_p}
                        >
                          {t('reservations.reservation-failure-details')}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="grid lg:grid-cols-5">
                    <div className="lg:col-span-3 lg:mr-[20px]">
                      <div>
                        {hotelData?.Images?.length > 0 ? (
                          <div>{handleImage(hotelData?.Images)}</div>
                        ) : (
                          <div className="w-full flex row items-center h-[160px] border-2 border-white rounded-xl">
                            <Image
                              src={logoWhiteLabel}
                              width={100}
                              height={50}
                              alt="Volindo Logo"
                              className="w-full h-[100px] my-2 p-2"
                            />
                          </div>
                        )}
                      </div>
                      <div className="">
                        <h1
                          className={`text-white font-[900] text-[18px] leading-normal mb-[10px] md:text-[20px]`}
                        >
                          {stay?.service?.hotel_name}
                        </h1>
                        <div className="flex flex-row gap-[6.5px] mb-[12px]">
                          <Image
                            src={locationIcon}
                            alt="Pin Icon"
                            width={12}
                            height={12}
                          />
                          <span className="text-[13px] text-white opacity-[0.65]">
                            {stay?.service?.address}
                          </span>
                        </div>
                        <div>{renderStars(hotelData?.stars || 0)}</div>
                        <p className="text-white">
                          {extractRoomAndCityView(stay?.service?.name_room)}
                        </p>
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
                        roomAmenities={stay?.service?.roomAmenities || []}
                        hotelAmenities={stay?.service?.hotelAmenities || []}
                      />

                      <div className="w-full h-[205px] rounded-[24px] overflow-hidden mb-[20px]">
                        {hotelData?.latitude && hotelData?.longitude ? (
                          <MapWrapper
                            dataResult={[
                              {
                                ...hotelData,
                                rooms: [
                                  {
                                    TotalFare: stay?.payments?.total,
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

                    <div className="lg:col-span-2 h-fit bg-[#F6F5F7] rounded-[24px] py-5 px-2.5 lg:w-full">
                      <h2 className="pl-[15px] mb-[15px] font-[600] text-[18px] text-[#0C0C0C] leading-normal md:text-[20px] lg:w-full">
                        <span className="capitalize">
                          {t('stays.reservation-details') + ' '}
                          {reservationDetails?.service?.confirmation_number
                            ? `(${reservationDetails.service?.confirmation_number})`
                            : ''}
                        </span>
                      </h2>
                      <div className="w-full bg-white rounded-[24px] p-4">
                        <div className="flex flex-row">
                          <div className="font-[400] text-[12px] w-1/2 text-[#272727]">
                            <span className="opacity-50">
                              {t('stays.placeholder-first-name')}
                            </span>
                            <p className="font-[400] text-[14px] leading-[23px] text-black">{`${stay?.main_contact[0]?.first_name}`}</p>
                          </div>
                          <div className="font-[400] text-[12px] w-1/2 text-[#272727]">
                            <span className="opacity-50">
                              {t('stays.placeholder-last-name')}
                            </span>
                            <p className="font-[400] text-[14px] leading-[23px] text-black">{`${stay?.main_contact[0]?.last_name}`}</p>
                          </div>
                        </div>
                        <div className="flex flex-row pt-2">
                          <div className="font-[400] text-[12px] w-1/2 text-[#272727]">
                            <span className="opacity-50">
                              {t('stays.placeholder-phone')}
                            </span>
                            <p className="font-[400] text-[14px] leading-[23px] text-black">
                              {stay?.main_contact[0]?.phone}
                            </p>
                          </div>
                          <div className="font-[400] text-[12px] w-1/2 text-[#272727] truncate">
                            <span className="opacity-50">
                              {t('stays.placeholder-email')}
                            </span>
                            <p className="font-[400] text-[14px] leading-[23px] text-black">
                              {stay?.main_contact[0]?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-white rounded-[24px] p-4 mt-5">
                        <div className="flex flex-row">
                          <div className="font-[400] text-[12px] w-1/2 text-[#272727] overflow-x-hidden">
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
                                  {formatDate(stay?.service?.check_in)}
                                </p>
                              </div>
                              <div className="flex flex-row gap-3 items-center">
                                <Image
                                  src={clockIcon}
                                  alt="Clock Icon"
                                  width={18}
                                  height={18}
                                />
                                {stay?.service?.rateConditions && (
                                  <p className="text-black text-[14px] font-[400]">
                                    {t('reservations.from')}{' '}
                                    {`${hotelData?.check_in_time}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="font-[400] text-[12px] w-1/2 text-[#272727] overflow-x-hidden">
                            <span className="opacity-50">Check-out</span>
                            <div className="mt-1.5">
                              <div className="flex flex-row gap-3 items-center mb-1.5">
                                <Image
                                  src={calendarIcon}
                                  alt="Calendar"
                                  className=""
                                  width={18}
                                  height={18}
                                />
                                <p className="text-black text-[14px] font-[400]">
                                  {formatDate(stay?.service?.check_out)}
                                </p>
                              </div>
                              <div className="flex flex-row gap-3 items-center">
                                <Image
                                  src={clockIcon}
                                  alt="Clock Icon"
                                  width={18}
                                  height={18}
                                />
                                {stay?.service?.rateConditions && (
                                  <p className="text-black text-[14px] font-[400]">
                                    {t('reservations.by')}{' '}
                                    {`${hotelData?.check_out_time}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Payment Details */}
                      <div className="w-full bg-white rounded-[24px] p-4 mt-5 text-[#272727] mb-[15px]">
                        <h3 className="mb-[10px] text-[rgba(39, 39, 39, 0.50)] leading-normal">
                          <span className="opacity-50">
                            {t('stays.summary')}
                          </span>
                        </h3>
                        {stay?.payments?.transaction_details
                          ?.number_of_rooms && (
                          <GuestSummary
                            rooms={
                              stay?.payments?.transaction_details
                                ?.number_of_rooms
                            }
                            adults={
                              stay?.payments?.transaction_details
                                ?.number_of_adults
                            }
                            childs={
                              stay?.payments?.transaction_details
                                ?.number_of_children
                            }
                          />
                        )}
                        <div className="flex w-full flex-row justify-between items-center">
                          <p className="text-[14px] text-black font-[400] m-0">
                            {priceCurrency.countrySymbol}
                            {`${(
                              priceCurrency.integerRate(
                                stay?.payments?.total -
                                  stay?.payments?.transaction_details
                                    ?.transactionFee
                              ) / daysOfService
                            ).toFixed(2)}`}{' '}
                            x {`${daysOfService}`}{' '}
                            {daysOfService === 1
                              ? t('stays.night')
                              : t('stays.nights')}
                          </p>
                          <p className="text-[14px] text-black font-[510]">
                            {priceCurrency.countrySymbol}
                            {`${priceCurrency.integerWithOneDecimal(
                              stay?.payments?.total -
                                stay?.payments?.transaction_details
                                  ?.transactionFee
                            )}`}
                          </p>
                        </div>
                        <div className="flex w-full flex-row justify-between items-center">
                          <p className="text-[14px] text-black font-[400] m-0">
                            {t('stays.comission')} 4%
                          </p>
                          <p className="text-[14px] text-black font-[510] m-0">
                            {priceCurrency.countrySymbol}
                            {priceCurrency.integerWithOneDecimal(
                              stay?.payments?.transaction_details
                                ?.transactionFee
                            )}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-[15px]">
                          <p className="text-whiteLabelColor font-[700] text-[16px]">
                            Total
                          </p>
                          <p className="text-whiteLabelColor font-[700] text-[16px] m-0">
                            {priceCurrency.countrySymbol}
                            {priceCurrency.integerTotal(stay?.payments?.total)}
                          </p>
                        </div>
                        <div className="flex flex-row justify-between mt-[15px]">
                          <p className="text-black font-[600] text-[14px]">
                            {t('stays.confirmation-number')}
                          </p>
                          <p className="text-black font-[400] text-[14px] m-0">
                            {reservationDetails?.service?.confirmation_number
                              ? reservationDetails.service?.confirmation_number
                              : ''}
                          </p>
                        </div>
                      </div>
                      {reservationDetails?.status === 'cancelled' ? (
                        <div className="w-full bg-white rounded-[24px] p-4 text-[#272727]">
                          <div className="flex justify-between">
                            <h3 className="text-[rgba(39, 39, 39, 0.50)] leading-normal">
                              <span className="opacity-50">
                                {t('travelers.status')}:
                              </span>
                            </h3>
                            <p className="text-[14px] font-[700] text-red-500">
                              {t('reservations.reservation-cancel')}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {reservationDetails?.status === 'booked' ? (
                            <div className="w-full bg-white rounded-[24px] p-4 text-[#272727]">
                              <div className="flex justify-between">
                                <h3 className="text-[rgba(39, 39, 39, 0.50)] leading-normal">
                                  <span className="opacity-50">
                                    {t('travelers.status')}:
                                  </span>
                                </h3>
                                <p className="text-[14px] font-[700] text-[#52BD63]">
                                  {t('reservations.reservation-confirmed')}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full bg-white rounded-[24px] p-4 text-[#272727]">
                              <div className="flex justify-between">
                                <h3 className="text-[rgba(39, 39, 39, 0.50)] leading-normal">
                                  <span className="opacity-50">
                                    {t('travelers.status')}:
                                  </span>
                                </h3>
                                <p className="text-[14px] font-[700] text-red-500">
                                  {t('reservations.reservation-not-confirmed')}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Cancel Button */}
                      <div className="flex flex-col text-[#272727] bg-opacity-50 mt-[15px]">
                        {reservationDetails?.status !== 'cancelled' && (
                          <div className="flex flex-row gap-2 items-center text-[#272727] mb-[15px]">
                            <Checkbox onChange={() => setCheck(!check)} />
                            <p className="text-[12px] text-[#767676]">
                              {t('reservations.agreement')}{' '}
                              <span
                                className="text-[12px] font-[600] underline cursor-pointer"
                                onClick={() => setOpenPolicies(true)}
                              >
                                {t('reservations.cancellation_text')}
                              </span>
                              {` ${t('stays.and')} `}
                              <span
                                className="text-[12px] font-[600] underline cursor-pointer"
                                onClick={() => setShowRateConditions(true)}
                              >
                                {t('stays.rate-conditions')}
                              </span>
                            </p>
                          </div>
                        )}
                        <button
                          disabled={
                            reservationDetails?.status === 'cancelled' ||
                            reservationDetails?.payment !== 'paid' ||
                            !check
                          }
                          className="text-[#FF6980] text-[16px] font-[650]  rounded-[24px] w-[225.76px] border border-solid border-1 border-red-500 md:w-full sm:w-full xs:w-full h-[48px] capitalize"
                          onClick={handleClick}
                        >
                          {reservationDetails?.status === 'cancelled'
                            ? t('reservations.button_cancelled')
                            : t('reservations.button_to_cancelled')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {slider && (
            <ModalHotelImages
              open={slider}
              onClose={() => setSlider(false)}
              stay={stayDetails}
            />
          )}
        </BookingLayout>
      )}
    </>
  );
};

export default ReservationDetailsPage;
