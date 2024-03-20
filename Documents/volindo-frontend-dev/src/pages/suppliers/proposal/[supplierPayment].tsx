/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
import config from '@config';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import { setLoading, useAppDispatch } from '@context';

//Next imports
import { useRouter } from 'next/router';
import Image from 'next/image';
import { passStringToDate, getDaysDifference } from '@utils/timeFunctions';

//Modals and compontent
import type { GetServerSideProps } from 'next';
import {
  ModalError,
  BookingLayout,
  DisplayAddressMap,
  ModalImagesCarrousel,
  ModalConfirmCancellation,
  ModalCancelConfirmation,
  StripePayment,
  ModalPaymentError,
  SEO,
  Step,
} from '@components';

import { Checkbox, Rate } from 'rsuite';

//Translation
import nextI18nextConfig from 'next-i18next.config';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

//Icons
import ping from '@icons/pin-white.svg';
import phone from '@icons/phoneIcon.svg';
import email from '@icons/email.svg';
import clock from '@icons/clock.svg';
import Calendar from '@icons/calendar-white.svg';
import IconCloseBlack from '@icons/close-black.svg';
import calendarIcon from '@icons/calendar.svg';
import clockIcon from '@icons/clock-gray.svg';
import homeIcon from '@icons/homeIcon.svg';
import phoneIcon from '@icons/phone.svg';
import volindoLogo from '@icons/logo.svg';
import whitelabellogo from '@icons/whitelabellogo.png';
import securityIcons from '@icons/securityIcons.svg';
import starWhite from '@icons/star-white.svg';
import starGrayIcon from '@icons/star-gray.svg';

//Amenities Icons
import coffieIcon from '@icons/amenityIcons/white/coffieIcon.svg';
import barIcon from '@icons/amenityIcons/white/barIcon.svg';
import wifiIcon from '@icons/amenityIcons/white/wifiIcon.svg';
import plus18 from '@icons/amenityIcons/white/plus18.svg';
import accessIcon from '@icons/amenityIcons/white/accessIcon.svg';
import balconyIcon from '@icons/amenityIcons/white/balconyIcon.svg';
import poolIcon from '@icons/amenityIcons/white/poolIcon.svg';
import shuttleIcon from '@icons/amenityIcons/white/shuttleIcon.svg';
import tvIcon from '@icons/amenityIcons/white/tvIcon.svg';
import gymIcon from '@icons/amenityIcons/white/gymIcon.svg';
import kitchenIcon from '@icons/amenityIcons/white/kitchenIcon.svg';
import spaIcon from '@icons/amenityIcons/white/spaIcon.svg';
import sofaIcon from '@icons/amenityIcons/white/sofaIcon.svg';

import { SuppliersServerProps } from '@typing/proptypes';
import { usePrice } from '@components/utils/Price/Price';

export const getServerSideProps: GetServerSideProps = async context => {
  const { locale } = context;

  const translation = await serverSideTranslations(
    locale || 'en',
    ['common'],
    nextI18nextConfig
  );

  return {
    props: {
      ...translation,
    },
  };
};

const Payment = () => {
  const { t, i18n } = useTranslation('common');
  const price = usePrice();
  const router = useRouter();
  const [paymentButtonText, setPaymentButtonText] = useState(
    t('suppliers.pay')
  );
  const [clientSecret, setClientSecret] = useState('');
  const [openErrorPayment, setOpenErrorPayment] = useState<boolean>(false);
  const [buttonBlocker, setButtonBlocker] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [resTabs, setResTabs] = useState('ResDetails');
  const [currency, setCurrency] = useState('USD');
  const [paymentDetails, setPaymentDetails] = useState<any | null>(null);
  const [openError, setOpenError] = useState(false);
  const [check, setCheck] = React.useState('0');
  const [isChecked, setIsChecked] = useState(false);
  const [windowSize, setWindowSize] = useState(0);
  const handleResize = () => setWindowSize(window.innerWidth);
  const [activeMarker, setActiveMarker] = React.useState<string | null>(null);
  const { data: session, status } = useSession();
  const [showCancelPolicy, setShowCancelPolicy] = useState<boolean>(false);
  const [thankyouPage, setThankYouPage] = useState(true);
  const [amenities, setAmenities] = useState('');
  const [loader, setLoader] = useState(false);
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [agentId, setAgentId] = useState('');
  const [bookingDetails, setBookingDetailsConfirmation] = useState({
    agent_id: '',
    payments: [
      {
        total: 0,
        provider_price: 0,
        agent_commission: 0,
        extra_data: {
          agent_discount: 0,
        },
        subtotal: 0,
        transaction_details: {
          transaction_id: '',
          processor_name: '',
          payment_type: '',
          payment_id: '',
        },
      },
    ],
    service: {
      service_time: '',
      service_type: '',
      rooms: [
        {
          traveler_email: '',
          accommodation_date_checkout: '',
          traveler_name: '',
          accommodation_checkin: '',
          traveler_title: '',
          accommodation_number_of_people_permitted: 0,
          traveler_number: '',
          traveler_age: '',
        },
      ],
      agent_id: '',
      number_of_people_permitted: 0,
      supplier_type: '',
      supplier_id: '',
      date_checkin: '',
      withdraw: false,
    },
    booking_id: 0,
    approved_at: 0,
    main_contact: [
      {
        last_name: '',
        phone_number: '',
        title: '',
        first_name: '',
        email: '',
        age: '',
      },
    ],
    status: '',
    agent: {
      total_pending_commission_agent: 0,
      account_number: '',
      total_sales_agent: 0,
      amount: 0,
      bank_account_adresss: '',
      agent_id: '',
      swift_number: 0,
      total_commission_agent: 0,
      created_at: '',
      total_balance_agent: 0,
      total_rest_commmission: 0,
      account_email: '',
      total_agent_commission_currency: 0,
      name_on_account: '',
      full_name_account: '',
      bank_name: '',
      payment_method: '',
      total_pending_balance_agent: 0,
    },
    payment: '',
  });
  const [slider, setSlider] = React.useState(false);

  const iconArrayServices = [
    { service: 'Breakfast', icon: coffieIcon },
    { service: 'Bar', icon: barIcon },
    { service: 'WIFI', icon: wifiIcon },
    { service: '18+', icon: plus18 },
    { service: 'Accessible', icon: accessIcon },
    { service: 'Balcony', icon: balconyIcon },
    { service: 'Pool', icon: poolIcon },
    { service: 'TV', icon: tvIcon },
    { service: 'Gym', icon: gymIcon },
    { service: 'Kitchen', icon: kitchenIcon },
    { service: 'Spa', icon: spaIcon },
    { service: 'Sofa', icon: sofaIcon },
    { service: 'Shuttle', icon: shuttleIcon },
  ];

  const today = new Date();

  const hanldeInclusion = (Inclusion: string) => {
    const getServiceIcon = (service: string) => {
      const foundService = iconArrayServices.find(
        item => item.service === service
      );
      return foundService ? foundService.icon : null;
    };

    const amenities = Inclusion.split(',');

    const chunkedAmenities = [];
    for (let i = 0; i < amenities.length; i += 6) {
      chunkedAmenities.push(amenities.slice(i, i + 6));
    }

    const renderedAmenities = chunkedAmenities.map((chunk, index) => (
      <div key={index} className="flex col gap-3 w-full">
        {chunk.map((amenity: string, innerIndex: number) => {
          const service = amenity.trim();
          const icon = getServiceIcon(service);
          return (
            <div key={innerIndex} className="flex row gap-3 items-center">
              {icon && (
                <Image src={icon} alt={service} width={16} height={16} />
              )}
              <p className="text-[400] text-[14px] mr-5 md:mr-1">{service}</p>
            </div>
          );
        })}
      </div>
    ));

    return renderedAmenities;
  };

  const getSupplierDetails = async (supplierId: String, agentId: String) => {
    const res = await fetch(
      `${config.api}/suppliers/data/${agentId}||${supplierId}`
    );
    const result = await res.json();

    const amenitiesArray: (string | undefined)[] = [];

    for (const key in result.Item) {
      if (
        Object.prototype.hasOwnProperty.call(result.Item, key) &&
        key.startsWith('amenities[')
      ) {
        const match = key.match(/\[(\d+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          amenitiesArray[index] = result.Item[key];
        }
      }
    }

    const amenitiesString = amenitiesArray.join(', ');
    setAmenities(amenitiesString);

    if (result) {
      const temp = {
        supplierProfile: [result.Item],
      };
      setPaymentDetails(temp);
    }
  };

  const getbookingDetails = async () => {
    const res = await fetch(`${config.api}/bookings/${bookingId}||${agentId}`);
    const result = await res.json();
    setBookingDetailsConfirmation(result);
    getSupplierDetails(result.service.supplier_id, result.agent_id);
  };

  useEffect(() => {
    const url = window.location.href;
    const urlParams = url.substring(url.lastIndexOf('/') + 1);
    const params = urlParams.split('--');

    setBookingId(params[0]);
    setAgentId(params[1]);
  }, []);

  useEffect(() => {
    bookingId && agentId !== '' ? getbookingDetails() : null;
  }, [bookingId, agentId]);

  useEffect(() => {
    setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePayment = async () => {
    setButtonBlocker(true);
    setPaymentButtonText(t('suppliers.loading'));
    setPaymentConfirmed(true);

    setTimeout(() => {
      setButtonBlocker(false);
      setPaymentButtonText(t('suppliers.confirm_and_pay'));
      setPaymentConfirmed(false);
    }, 3000);
  };

  const handleRedirect = () => {
    const proposalId = router.query.supplierPayment;
    router.push(`/suppliers/payment/${proposalId}`);
  };

  const handleSubmit = async () => {
    try {
      if (confirmPayment === false) {
        setButtonBlocker(true);
        setPaymentButtonText(t('suppliers.loading'));
        const total_price = Number(bookingDetails?.payments[0].total);

        const data = {
          currency,
          supplier_name: bookingDetails?.agent?.full_name_account,
          amount: Math.round(total_price),
          service_cost: bookingDetails?.payments[0]?.subtotal,
          agent_service_fee: bookingDetails?.payments[0]?.agent_commission,
          agent_commission: bookingDetails?.payments[0]?.agent_commission,
          supplier_id: bookingDetails?.service?.supplier_id,
          agent_id: bookingDetails?.agent_id,
        };

        const res = await fetch(`${config.api}/suppliers/stripe/${bookingId}`, {
          method: 'POST',
          body: JSON.stringify({ ...data }),
          headers: {
            Authorization: 'Bearer ' + session?.user.id_token || '',
            'Content-Type': 'application/json',
          },
        });
        if (res.status === 303) {
          const result = await res.json();
          setClientSecret(result.data.client_secret);
          setButtonBlocker(false);
          setPaymentButtonText(t('suppliers.confirm_and_pay'));
          setConfirmPayment(true);
          setResTabs('Payment');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setOpenErrorPayment(true);
          setButtonBlocker(true);
          setPaymentButtonText(t('suppliers.pay'));
        }
      } else {
        handlePayment();
      }
    } catch (error) {
      setOpenError(true);
    }
  };
  const renderStars = (stars: string) => {
    const rating = parseFloat(stars);
    return <Rate defaultValue={rating} max={5} readOnly size="xs" allowHalf />;
  };

  const getQueryParameter = (name: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
  };
  useEffect(() => {
    const success = getQueryParameter('success');
    if (success === 'true') {
      setResTabs('Confirmation');
    }
  }, []);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);

    if (hour > 12) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${formattedHour}:${minutes} pm`;
    } else if (hour >= 22) {
      return '10 pm';
    } else {
      return `${hour}:${minutes} am`;
    }
  };

  const handleImage = (Images: any) => {
    let output;

    switch (Images.length) {
      case 1:
        output = (
          <Image
            src={paymentDetails?.supplierProfile[0]?.add_image_text[0]}
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
                src={paymentDetails?.supplierProfile[0]?.add_image_text[0]}
                alt="profile icon"
                width={500}
                height={500}
                className="w-full h-full object-center object-cover rounded-xl mr-2"
              />
            </div>
            <div className="w-1/2 h-[220px]">
              <Image
                src={paymentDetails?.supplierProfile[0]?.add_image_text[1]}
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
        const remainingImages = Images.slice(1, Math.min(Images.length, 5));

        const handleImageClick = () => {
          if (Images.length >= 5) {
            setSlider(true);
          }
        };

        output = (
          <div className="flex flex-row h-full" onClick={handleImageClick}>
            <div className="w-1/2 m-1">
              <img
                src={firstImage}
                alt="First Image"
                className="w-full h-full object-center object-cover rounded-sm"
              />
            </div>
            <div className="w-1/2 grid grid-cols-2 gap-1 items-center justify-center">
              {remainingImages?.map((image: string, index: number) => (
                <div
                  className={`w-full h-full flex items-center justify-center max-h-[120px] ${
                    index === remainingImages.length - 1 ? 'relative' : ''
                  }`}
                  key={index}
                >
                  {index === remainingImages.length - 1 && Images.length > 5 ? (
                    <div className="relative">
                      <img
                        src={image}
                        alt={`Image ${index + 2}`}
                        className="w-full h-full object-center object-cover rounded-sm max-h-[120px]"
                      />
                      <div
                        className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center sm:pl-2 xs:pl-2"
                        style={{ zIndex: 1 }}
                      >
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-75 flex items-center justify-center sm:pl-2 xs:pl-2 max-h-[120px]">
                          <span className="text-white text-lg font-bold">
                            + {`${Images.length - 5}`} Photos
                          </span>
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

  const Stars = (stars: number) => {
    const roundedStars = Math.round(stars);
    return (
      <div className="flex gap-3 items-center mt-1">
        {new Array(roundedStars).fill('').map((_, index) => (
          <Image key={index} alt="icon" src={starWhite} />
        ))}

        {new Array(5 - roundedStars).fill('').map((_, index) => (
          <Image key={index} alt="icon" src={starGrayIcon} />
        ))}
      </div>
    );
  };

  const handlePriceAccomodation = (
    total: number,
    rooms: Array<any> | number
  ) => {
    let totalGuest = 0;
    if (typeof rooms === 'number') {
      return total / rooms;
    } else {
      for (let i = 0; i < rooms.length; i++) {
        totalGuest += rooms[i].accommodation_number_of_people_permitted;
      }
    }
    return price.integerWithOneDecimal(total / totalGuest);
  };

  const handleGeneralPrice = (total: number, numberOfPeople: number) => {
    return price.integerWithOneDecimal(total / numberOfPeople);
  };

  const handleNumberOfPeople = (rooms: Array<any>) => {
    let totalGuest = 0;
    for (let i = 0; i < rooms.length; i++) {
      totalGuest += rooms[i].accommodation_number_of_people_permitted;
    }
    return totalGuest;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderSelectedSupplierInfo = (selectedSupplier: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const supplierProfile =
      paymentDetails?.supplierProfile?.[0] || paymentDetails?.supplierProfile;

    const logoWhiteLabel =
      window.location.host.includes('dashboard.volindo.com') ||
      window.location.host.includes('dashboard.dev.volindo.com')
        ? volindoLogo
        : whitelabellogo;
    return (
      <>
        {showCancelPolicy && (
          <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
            <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-screen h-screen lg:w-[544px] lg:h-[232px] rounded-[16px] px-[96px]">
              <button
                className="absolute right-7 top-[60px] lg:-top-5 lg:-right-6"
                onClick={() => setShowCancelPolicy(false)}
              >
                <Image alt="icon" src={IconCloseBlack} />
              </button>
              <div className="w-full h-full text-white flex justify-center items-center flex-col gap-3">
                <h2 className="text-2xl font-[760]">Cancellation Policy</h2>
                <p>
                  {paymentDetails?.supplierProfile?.[0].cancel_policies &&
                    paymentDetails?.supplierProfile?.[0].cancel_policies.replace(
                      /[^a-zA-Z0-9 ]/g,
                      ' '
                    )}
                </p>
                <p>{paymentDetails?.supplierProfile?.[0].cancel_policies_2}</p>
              </div>
            </div>
          </div>
        )}
        <div className="md:w-[70%] sm:w-[90%] xs:w-[90%] mx-auto flex md:flex-row sm:flex-col xs:flex-col gap-6 mb-5">
          {confirmPayment ? (
            <div className="md:w-3/5 sm:w-full h-fit bg-[#242424] mb-5 p-10 rounded-3xl flex flex-col items-start justify-start">
              <h2 className="font-[700] text-white text-[24px] mb-5">
                {t('suppliers.payment_details')}
              </h2>
              <StripePayment
                className=""
                clientSecret={clientSecret}
                type="payment"
                redirectUrl={`${window.location.protocol}//${window.location.host}/suppliers/proposal/confirmation/${bookingId}--${agentId}`}
                confirmationOutside={true}
                paymentConfirmed={paymentConfirmed}
              />
              {confirmPayment && (
                <div className="w-full items-start mt-5">
                  <Image src={securityIcons} alt="security logos" />
                </div>
              )}
            </div>
          ) : (
            <div className="md:w-3/5 sm:w-full">
              {paymentDetails?.supplierProfile[0]?.add_image_text.length > 0 ? (
                <div className="h-[250px] mb-2">
                  <div className="w-full h-full flex flex-row items-center">
                    {handleImage(
                      paymentDetails?.supplierProfile[0]?.add_image_text
                    )}
                  </div>
                </div>
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
              <div className="py-2">
                <h2 className="font-[650] text-[20px] text-white">
                  {paymentDetails?.supplierProfile?.[0]?.company_name}
                </h2>
                <p className="font-[400] text-[16px] line-height-6 text-white pb-1">
                  {
                    paymentDetails?.supplierProfile?.[0]
                      ?.supplier_additional_info
                  }
                </p>
                {bookingDetails?.service?.supplier_type === 'accommodation' && (
                  <div className="flex flex-row text-md gap-3 text-white my-2 items-center font-[450] leading-[23px]">
                    {Stars(paymentDetails?.supplierProfile?.[0]?.stars)}{' '}
                    {paymentDetails?.supplierProfile?.[0]?.stars}
                  </div>
                )}
                {paymentDetails?.supplierProfile?.[0]?.supplier_address && (
                  <div>
                    <span className="flex flex-row gap-3 font-[510] text-[14px] text-[#FCFCFD] opacity-70 pb-1">
                      <Image
                        src={homeIcon}
                        alt="home icon"
                        width={18}
                        height={18}
                      />{' '}
                      {paymentDetails?.supplierProfile?.[0]?.supplier_address}
                    </span>
                  </div>
                )}
                <div>
                  <span className="flex flex-row gap-3 font-[510] text-[14px] text-[#FCFCFD] opacity-70 pb-1">
                    <Image
                      src={phoneIcon}
                      alt="phone icon"
                      width={18}
                      height={18}
                    />{' '}
                    {paymentDetails?.supplierProfile?.[0]?.phone_number}
                  </span>
                </div>
                <div>
                  <span className="flex flex-row gap-3 font-[510] text-[14px] text-[#FCFCFD] opacity-70 pb-1">
                    <Image
                      src={email}
                      alt="email icon"
                      width={18}
                      height={18}
                    />{' '}
                    {paymentDetails?.supplierProfile?.[0]?.email}
                  </span>
                </div>
              </div>
              {bookingDetails?.service?.supplier_type === 'accommodation' && (
                <>
                  {amenities && (
                    <div className="w-full rounded-3xl xs:rounded-3xl bg-white/[.14] p-4 my-5 mb-[13px] shadow-lg xs:w-full xs:p-4 xs:shadow-none">
                      <p className="text-white font-[500] text-[16px]">
                        {t('suppliers.amenities')}
                      </p>
                      <ul className="">
                        <li className="my-3 mb-2 overflow-y-auto scrollbar-hide text-white">
                          {hanldeInclusion(
                            paymentDetails?.supplierProfile?.[0]?.amenities ||
                              amenities
                          )}
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              )}
              {paymentDetails?.supplierProfile?.[0]?.supplier_lat &&
              paymentDetails?.supplierProfile?.[0]?.supplier_long ? (
                <div className="w-full rounded-xl overflow-hidden">
                  <DisplayAddressMap
                    lat={
                      paymentDetails?.supplierProfile?.[0]?.supplier_lat || 0
                    }
                    lng={
                      paymentDetails?.supplierProfile?.[0]?.supplier_long || 0
                    }
                  />
                </div>
              ) : null}
            </div>
          )}
          <div className="md:w-2/5 sm:w-full bg-[#F6F5F7] p-5 rounded-[40px] h-fit">
            <h2 className="font-[590] text-[20px] text-[#0C0C0C]">
              {t('suppliers.supplier-traveler')}
            </h2>
            {/* Name Details */}
            <div className="w-full bg-white rounded-2xl p-5">
              <div className="flex flex-row">
                <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                  {t('stays.placeholder-first-name')}
                  <p className="font-[400] text-[14px] text-black">
                    {bookingDetails?.main_contact?.[0].first_name ||
                      'No name available'}
                  </p>
                </div>
              </div>
              <div className="flex flex-row pt-2">
                <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                  {t('stays.placeholder-phone')}
                  <p className="font-[400] text-[14px] text-black">
                    {bookingDetails?.main_contact?.[0].phone_number || ''}
                  </p>
                </div>
                <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                  {t('stays.placeholder-email')}
                  <p className="font-[400] text-[14px] min-w-[10px] text-black wrap truncate max-w-[100%]">
                    {bookingDetails?.main_contact?.[0].email || ''}
                  </p>
                </div>
              </div>
            </div>
            {/* Date Details */}
            {bookingDetails?.service?.rooms[0].accommodation_checkin ||
            bookingDetails.service.date_checkin ||
            bookingDetails?.service?.service_time ? (
              <>
                <div className="w-full bg-white rounded-2xl p-5 mt-5">
                  <div className="flex flex-row">
                    {bookingDetails?.service?.rooms[0].accommodation_checkin ||
                    bookingDetails.service.date_checkin ? (
                      <>
                        <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                          {t('suppliers.check-in')}
                          <div className="flex flex-row gap-3 items-center">
                            <Image
                              src={calendarIcon}
                              alt="Calendar"
                              width={18}
                              height={18}
                            />

                            <p className="text-black text-[14px] font-[400] capitalize">
                              {passStringToDate(
                                bookingDetails?.service?.rooms[0]
                                  .accommodation_checkin ||
                                  bookingDetails.service.date_checkin ||
                                  '',
                                i18n.language
                              )}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : null}

                    {bookingDetails?.service?.supplier_type ===
                    'accommodation' ? (
                      <>
                        {bookingDetails?.service?.rooms[0]
                          .accommodation_date_checkout && (
                          <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                            {t('suppliers.check-out')}
                            <div className="flex flex-row gap-3 items-center">
                              <Image
                                src={calendarIcon}
                                alt="Calendar"
                                className=""
                              />
                              <p className="text-black text-[14px] font-[400] capitalize">
                                {passStringToDate(
                                  bookingDetails?.service?.rooms[0]
                                    .accommodation_date_checkout || '',
                                  i18n.language
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {bookingDetails?.service?.service_time && (
                          <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                            Time
                            <div className="flex flex-row gap-3 items-center">
                              <Image
                                src={clockIcon}
                                alt="Clock Icon"
                                width={18}
                                height={18}
                              />
                              <p className="text-black text-[14px] font-[400]">
                                By{' '}
                                {formatTime(
                                  bookingDetails?.service?.service_time
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : null}

            <div className="w-full bg-white rounded-2xl p-5 mt-5 text-[#272727]">
              <h3>{t('stays.summary')}</h3>
              <div className="flex flex-row w-full justify-between items-center">
                {bookingDetails?.service?.supplier_type === 'accommodation' ? (
                  <p>
                    {price.countrySymbol}{' '}
                    {handlePriceAccomodation(
                      bookingDetails?.payments[0]?.total,
                      bookingDetails?.service?.rooms
                    )}{' '}
                    x{' '}
                    {getDaysDifference(
                      bookingDetails?.service?.rooms[0].accommodation_checkin,
                      bookingDetails?.service?.rooms[0]
                        .accommodation_date_checkout
                    )}{' '}
                    {getDaysDifference(
                      bookingDetails?.service?.rooms[0].accommodation_checkin,
                      bookingDetails?.service?.rooms[0]
                        .accommodation_date_checkout
                    ) === 1
                      ? `${t('stays.day')}`
                      : `${t('stays.days')}`}
                  </p>
                ) : (
                  <p>
                    {price.countrySymbol}{' '}
                    {handleGeneralPrice(
                      bookingDetails?.payments[0]?.total,
                      bookingDetails?.service?.number_of_people_permitted
                    )}{' '}
                    x {bookingDetails?.service?.number_of_people_permitted}{' '}
                    {bookingDetails?.service?.number_of_people_permitted === 1
                      ? `${t('common.person')}`
                      : `${t('common.people')}`}
                  </p>
                )}
                <p>
                  {price.countrySymbol}{' '}
                  {price.integerTotal(bookingDetails?.payments[0]?.total || 0)}
                </p>
              </div>
              <div className="flex flex-row w-full justify-between items-center">
                <p className="text-whiteLabelColor font-[700] text-[16px]">
                  Total
                </p>
                <p className="text-whiteLabelColor font-[700] text-[16px]">
                  {price.countrySymbol}{' '}
                  {price.integerTotal(bookingDetails?.payments[0]?.total || 0)}
                </p>
              </div>
            </div>
            {/* Button and Checkbox */}
            <div className="flex flex-row gap-3 items-center text-[#272727] bg-opacity-50 py-2">
              <Checkbox
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <p className="">
                {t('suppliers.cancellation-policy-text-1')}{' '}
                <span
                  onClick={() => setShowCancelPolicy(true)}
                  className="underline"
                >
                  {t('suppliers.cancellation-policy-text-2')}
                </span>
              </p>
            </div>
            <button
              disabled={!isChecked || buttonBlocker}
              className="text-black text-[16px] font-[650] bg-whiteLabelColor rounded-[24px] w-[225.76px] md:w-full sm:w-full xs:w-full h-[48px]"
              onClick={handleRedirect}
            >
              {paymentButtonText}
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderBookingPage = () => {
    const handleWatchThankYouPage = () => {
      dispatch(setLoading(true));
      setThankYouPage(false);
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 10000);
    };

    const handleCancelBooking = async () => setModal(true);

    const handleCloseSuccess = () => setModal(false);

    const handleCloseConfirmCancelation = () => setModalCancel(false);

    const handleConfirm = async () => {
      //Axios peticion to Delete Booking
      if (status === 'authenticated') {
        const res = await axios.post(
          `${config.api}/suppliers/cancel/${bookingDetails?.booking_id}||${bookingDetails?.agent_id}`,
          {
            headers: {
              Authorization: 'Bearer ' + session?.user.id_token || '',
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.status === 200) {
          setModal(false);
          setModalCancel(true);
        }
      }
    };

    if (thankyouPage) {
      return (
        <>
          {showCancelPolicy && (
            <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
              <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-screen h-screen lg:w-[544px] lg:h-[232px] rounded-[16px] px-[96px]">
                <button
                  className="absolute right-7 top-[60px] lg:-top-5 lg:-right-6"
                  onClick={() => setShowCancelPolicy(false)}
                >
                  <Image alt="icon" src={IconCloseBlack} />
                </button>
                <div className="text-white flex justify-center flex-col gap-y-3 items-center w-full h-full">
                  <h2 className="text-2xl font-[760] capitalize">
                    {t('suppliers.cancel-politic')}
                  </h2>
                  <span>
                    {paymentDetails?.supplierProfile?.[0].cancel_policies &&
                      paymentDetails?.supplierProfile?.[0].cancel_policies.replace(
                        /[^a-zA-Z0-9 ]/g,
                        ' '
                      )}
                  </span>
                  <span>
                    {paymentDetails?.supplierProfile?.[0].cancel_policies_2}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-6 justify-center items-center relative w-full flex-col-reverse md:flex-row md:items-start ">
            <div className="flex flex-col gap-y-[34px] xxs:w-full xxs:items-center xs:w-[300px]">
              <h2 className="text-2xl font-[760] text-white">
                Booking Confirmation
              </h2>
              <div className="max-w-[373px] flex flex-col h-auto   rounded-[25px] gap-y-6 bg-white w-full p-[34px] text-black">
                <h2 className="text-center text-[32px] font-[650] leading-9">
                  Thank you for booking with us!
                </h2>
                <p className="text-sm">
                  Your booking is being confirmed, it can take few minutes and
                  we will let you know by email when it&lsquo;s done.
                </p>
                <p className="text-sm">
                  For any question you can always advise your agent or contact
                  one of our excellent support team at{' '}
                  <button
                    onClick={() =>
                      (window.location.href = `mailto:${process.env.WHITELABELEMAIL}`)
                    }
                    className="underline"
                  >
                    {process.env.WHITELABELEMAIL}
                  </button>
                </p>
              </div>

              <>
                <div className="flex gap-1 items-center text-sm w-full justify-center text-white">
                  <button
                    onClick={handleWatchThankYouPage}
                    className="border-solid border-2 border-[var(--primary-background)] text-[var(--primary-background)] w-[361px] h-[48px] rounded-3xl font-[760] tracking-widest mb-9"
                  >
                    {t('suppliers.reservation-button')}
                  </button>
                </div>
              </>
            </div>
            <div className="md:mt-[4.5rem] xxs:w-full xs:max-w-[300px]">
              <div className="flex flex-col gap-y-4 text-white">
                <div className="flex flex-col gap-y-5 lg:mt-[6.5prem]">
                  <span className="text-white text-lg font-[650] tracking-widest">
                    {paymentDetails?.supplierProfile?.[0]?.company_name}
                  </span>
                  {paymentDetails?.supplierProfile?.[0]?.selectedSupplier ===
                    'accommodation' && (
                    <span>
                      {Stars(
                        Math.round(paymentDetails?.supplierProfile?.[0]?.stars)
                      )}
                    </span>
                  )}
                </div>
                <div className="flex items-start justify-between gap-3 w-full gap-y-3">
                  <div className="flex flex-col text-white/[.64] gap-y-1 text-sm">
                    <div className="flex gap-4">
                      <Image src={ping} alt="pin" />
                      <span>
                        {paymentDetails?.supplierProfile?.[0]?.address}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <Image className="opacity-40 w-3" src={phone} alt="pin" />
                      <span>
                        {paymentDetails?.supplierProfile?.[0]?.phone_number}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <Image className="opacity-40 w-3" src={email} alt="pin" />
                      <span>{paymentDetails?.supplierProfile?.[0]?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-around items-center w-full max-w-[458px] h-[54px]  my-6 rounded-lg bg-[rgba(177,177,177,0.08)] ">
                <div className="flex flex-col">
                  <span className="text-xs text-white/[.85]">
                    {t('suppliers.check-in')}
                  </span>
                  <span className="flex gap-2 text-base items-center text-white/[.85]">
                    <Image src={Calendar} alt="calander" />
                    {paymentDetails &&
                      passStringToDate(
                        bookingDetails?.service?.rooms[0]
                          ?.accommodation_checkin ||
                          bookingDetails.service.date_checkin ||
                          '',
                        i18n.language
                      )}
                  </span>
                </div>
                <div className="w-[35px] border border-[#222222]" />
                {bookingDetails?.service?.supplier_type === 'accommodation' ? (
                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-white/[.85]">
                      {t('suppliers.check-out')}
                    </span>
                    <span className="flex gap-2 text-base items-center text-white/[.85]">
                      <Image src={Calendar} alt="calendar" />
                      {paymentDetails &&
                        passStringToDate(
                          bookingDetails?.service?.rooms[0]
                            .accommodation_date_checkout || '',
                          i18n.language
                        )}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-white/[.85]">Time</span>
                    <span className="flex gap-2 text-base items-center text-white/[.85]">
                      <Image src={clock} alt="clock" />
                      {paymentDetails &&
                        formatTime(bookingDetails?.service?.service_time || '')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <div className="w-[125px] h-[98px] rounded-[10px] border flex-1 flex justify-between items-center">
                  {paymentDetails?.supplierProfile?.[0]?.add_image_text &&
                  (
                    paymentDetails?.supplierProfile?.[0]
                      ?.add_image_text as string[]
                  ).length > 0 ? (
                    <Image
                      src={
                        (
                          paymentDetails?.supplierProfile?.[0]
                            ?.add_image_text as string[]
                        )[0] || ''
                      }
                      width={125}
                      height={98}
                      className="object-cover w-full h-full"
                      alt="pin"
                    />
                  ) : (
                    <span className="text-gray-500 ">No images available</span>
                  )}
                </div>

                <span className="flex-1 text-white">
                  {
                    paymentDetails?.supplierProfile?.[0]
                      ?.supplier_additional_info
                  }
                </span>
              </div>
              <div>
                <div className="w-full mt-[35px] py-2 bg-white/[.15] rounded-lg flex justify-between items-center px-3 text-white">
                  <span>Total</span>
                  <span>$ {bookingDetails?.payments[0]?.total}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          {openErrorPayment && (
            <ModalPaymentError
              open={openErrorPayment}
              onClose={() => setOpenErrorPayment(false)}
            />
          )}
          {modal && (
            <ModalConfirmCancellation
              open={modal}
              onClose={handleCloseSuccess}
              deleteBooking={handleConfirm}
            />
          )}
          {modalCancel && (
            <ModalCancelConfirmation
              open={modalCancel}
              onClose={handleCloseConfirmCancelation}
            />
          )}
          {showCancelPolicy && (
            <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
              <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-screen h-screen lg:w-[544px] lg:h-[232px] rounded-[16px] px-[96px]">
                <button
                  className="absolute right-7 top-[60px] lg:-top-5 lg:-right-6"
                  onClick={() => setShowCancelPolicy(false)}
                >
                  <Image alt="icon" src={IconCloseBlack} />
                </button>
                <div className="text-white flex justify-center flex-col gap-y-3 items-center w-full h-full">
                  <h2 className="text-2xl font-[760]">Cancellation Policy</h2>
                  <span>
                    {paymentDetails?.supplierProfile?.[0].cancel_policies &&
                      paymentDetails?.supplierProfile?.[0].cancel_policies.replace(
                        /[^a-zA-Z0-9 ]/g,
                        ' '
                      )}
                  </span>
                  <span>
                    {paymentDetails?.supplierProfile?.[0].cancel_policies_2}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-6 justify-center items-center relative w-full flex-col-reverse md:flex-row md:items-start ">
            <div className="flex flex-col gap-y-[34px] xxs:w-full xxs:items-center xs:w-[300px]">
              <h2 className="text-2xl font-[760] text-white">
                {t('suppliers.booking-confirmation')}
              </h2>
              <div className="max-w-[373px] flex flex-col h-[387px] rounded-[25px] gap-y-6 bg-white w-full p-[34px] ">
                <span className="text-[#010101] text-[22px] font-[510]">
                  {t('suppliers.guest-1')}
                </span>
                <span className="rounded-full h-[48px] border py-3 px-4">
                  {bookingDetails?.main_contact?.[0].first_name || 'Juan'}
                </span>
                <span className="rounded-full h-[48px] border py-3 px-4">
                  {bookingDetails?.main_contact?.[0].phone_number || ''}
                </span>

                <span className="rounded-full h-[48px] border py-3 px-4">
                  {bookingDetails?.main_contact?.[0].email || ''}
                </span>
                <div className="flex gap-3 w-full">
                  <span className="rounded-full h-[48px] border py-3 px-4 w-[100px]">
                    {bookingDetails?.main_contact?.[0].title || ''}
                  </span>
                  <span className="rounded-full h-[48px] border py-3 px-4 w-[100px]">
                    {bookingDetails?.main_contact?.[0].age || ''}
                  </span>
                </div>
              </div>

              <>
                <div className="flex gap-1 items-start text-sm w-full justify-start text-white">
                  <span className="flex gap-2">
                    <button
                      onClick={() => setShowCancelPolicy(true)}
                      className="underline"
                    >
                      {t('suppliers.cancel-politic')}
                    </button>
                  </span>
                </div>
                <div className="flex gap-1 items-center text-sm w-full justify-center text-white">
                  <button
                    onClick={handleCancelBooking}
                    className="border-solid border-2 border-[var(--primary-background)] text-[var(--primary-background)] w-[361px] h-[48px] rounded-3xl font-[760] tracking-widest mb-9"
                  >
                    {t('suppliers.cancel-button')}
                  </button>
                </div>
              </>
            </div>
            <div className="md:mt-[4.5rem] xxs:w-full xs:max-w-[300px]">
              <div className="flex flex-col gap-y-4 text-white">
                <div className="flex flex-col gap-y-5 lg:mt-[6.5prem]">
                  <span className="text-white text-lg font-[650] tracking-widest">
                    {paymentDetails?.supplierProfile?.[0]?.company_name}
                  </span>
                  {paymentDetails?.supplierProfile?.[0]?.selectedSupplier ===
                    'accommodation' && (
                    <span>
                      {renderStars(paymentDetails?.supplierProfile?.[0]?.stars)}
                    </span>
                  )}
                </div>
                <div className="flex items-start justify-between gap-3 w-full gap-y-3">
                  <div className="flex flex-col text-white/[.64] gap-y-1 text-sm">
                    <div className="flex gap-4">
                      <Image src={ping} alt="pin" />
                      <span>
                        {paymentDetails?.supplierProfile?.[0]?.address}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <Image className="opacity-40 w-3" src={phone} alt="pin" />
                      <span>
                        {paymentDetails?.supplierProfile?.[0]?.phone_number}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <Image className="opacity-40 w-3" src={email} alt="pin" />
                      <span>{paymentDetails?.supplierProfile?.[0]?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-around items-center w-full max-w-[458px] h-[54px] my-6 rounded-lg bg-[rgba(177,177,177,0.08)] ">
                <div className="flex flex-col">
                  <span className="text-xs text-white/[.85]">Check-in</span>
                  <span className="flex gap-2 text-base items-center text-white/[.85]">
                    <Image src={Calendar} alt="calander" />
                    {paymentDetails &&
                      passStringToDate(
                        bookingDetails.service.rooms[0].accommodation_checkin ||
                          bookingDetails.service.date_checkin ||
                          '',
                        i18n.language
                      )}
                  </span>
                </div>
                <div className="w-[35px] border border-[#222222]" />
                {bookingDetails?.service?.supplier_type === 'accommodation' ? (
                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-white/[.85]">Check-out</span>
                    <span className="flex gap-2 text-base items-center text-white/[.85]">
                      <Image src={Calendar} alt="Calendar" />
                      {paymentDetails &&
                        passStringToDate(
                          bookingDetails?.service?.rooms[0]
                            .accommodation_date_checkout || '',
                          i18n.language
                        )}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-white/[.85]">
                      {t('suppliers.time')}
                    </span>
                    <span className="flex gap-2 text-base items-center text-white/[.85]">
                      <Image src={clock} alt="clock" />
                      {paymentDetails &&
                        formatTime(bookingDetails?.service?.service_time || '')}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <div className="w-[125px] h-[98px] rounded-[10px] border flex-1 flex justify-between items-center">
                  {paymentDetails?.supplierProfile?.[0]?.add_image_text &&
                  (
                    paymentDetails?.supplierProfile?.[0]
                      ?.add_image_text as string[]
                  ).length > 0 ? (
                    <Image
                      src={
                        (
                          paymentDetails?.supplierProfile?.[0]
                            ?.add_image_text as string[]
                        )[0] || ''
                      }
                      width={125}
                      height={98}
                      className="object-cover w-full h-full"
                      alt="pin"
                    />
                  ) : (
                    <span className="text-gray-500 ">No images available</span>
                  )}
                </div>

                <span className="flex-1 text-white">
                  {
                    paymentDetails?.supplierProfile?.[0]
                      ?.supplier_additional_info
                  }
                </span>
              </div>
              <div>
                <div className="w-full mt-[35px] py-2 bg-white/[.15] rounded-lg flex justify-between items-center px-3 text-white">
                  <span>Total</span>
                  <span>$ {bookingDetails?.payments[0]?.total}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  const renderContent = () => {
    switch (resTabs) {
      case 'ResDetails':
        return (
          <div className="flex flex-col">
            <div className="">
              {paymentDetails &&
                renderSelectedSupplierInfo(
                  paymentDetails?.supplierProfile?.[0]?.selectedSupplier
                )}
            </div>
          </div>
        );
      case 'Payment':
        return (
          <div className="flex flex-col">
            <div className="">
              {paymentDetails &&
                renderSelectedSupplierInfo(
                  paymentDetails?.supplierProfile?.[0]?.selectedSupplier
                )}
            </div>
          </div>
        );
      case 'Confirmation':
        return (
          <div className="flex flex-col">
            <div>{renderBookingPage()}</div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <SEO title={t('SEO.proposal_thanyou')} />
      <ModalError open={openError} onClose={() => setOpenError(false)} />
      <BookingLayout isPublic={true} agentId={agentId}>
        <div className="p-4 w-full">
          <div className="flex justify-center w-full">
            <Step actualStep="ResDetails" />
          </div>
          <div className="mt-8 w-full overflow-hidden">
            <div className="content-container">{renderContent()}</div>
          </div>
        </div>
      </BookingLayout>
      {slider && (
        <ModalImagesCarrousel
          open={slider}
          onClose={() => setSlider(false)}
          title={paymentDetails?.supplierProfile[0]?.company_name}
          ImageArray={paymentDetails?.supplierProfile[0]?.add_image_text}
        />
      )}
    </>
  );
};

export default Payment;
