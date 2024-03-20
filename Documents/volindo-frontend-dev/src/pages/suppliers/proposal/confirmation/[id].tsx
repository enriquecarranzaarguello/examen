import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '@config';
import moment from 'moment';
import Swal from 'sweetalert2';

//Import from next
import Image from 'next/image';

//Translation
import nextI18nextConfig from 'next-i18next.config';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

//Layout
import { SupplierHeaderType } from '@typing/types';

//Icons
import email from '@icons/email.svg';
import phoneIcon from '@icons/phoneProfileIcon.svg';
import calendarIcon from '@icons/calendar.svg';
import clockIcon from '@icons/clock-gray.svg';
import homeIcon from '@icons/homeIcon.svg';
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

//Image Default
import volindo from '@images/volindo.png';

//Next
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import {
  BookingLayout,
  ModalPolicyProposal,
  DisplayAddressMap,
  ModalConfirmCancellation,
  ModalCancelConfirmation,
  ModalImagesCarrousel,
  SEO,
  Step,
} from '@components';

import { passStringToDate } from '@utils/timeFunctions';
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
  const { id } = router.query;
  const [resTabs, setResTabs] = useState('Confirmation');
  const [checked, setChecked] = useState(false);
  const [bookingId, setAgentId] = useState('');
  const [agentId, setBookingId] = useState('');
  const [policies, setPolicies] = useState<string[]>([]);
  const [modalPolicy, setModalPolicy] = useState(false);
  const [supplierId, setSupplierId] = useState('');
  const [agentData, setAgentData] = useState<any>({});
  const [data, setData] = useState({
    agent_id: '',
    payments: [
      {
        provider_price: 0,
        subtotal: 0,
        agent_commission: 0,
        total: 0,
        transaction_details: {
          transaction_id: 0,
          payment_id: 0,
          payment_type: 0,
          processor_name: 0,
        },
        extra_data: {
          agent_discount: 0,
        },
      },
    ],
    service: {
      number_of_people_permitted: 0,
      service_time: '',
      date_checkin: '',
      agent_id: '',
      cancelled_at: 0,
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
      service_type: '',
      supplier_id: '',
      supplier_type: '',
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
      country: {
        iso_code: '',
        country_name: '',
        id: '',
      },
      phone_number: '',
      full_name_account: '',
      email: '',
    },
    payment: '',
  });
  const [amenities, setAmenities] = useState('');

  const [slider, setSlider] = React.useState(false);

  //Modal Handle
  const [modal, setModal] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);

  const getBookingConfirmation = async () => {
    try {
      const response = await axios.get(
        `${config.api}/bookings/${bookingId}||${agentId}`
      );

      if (response.status === 200) {
        const result = response.data;
        setData(result);
        setSupplierId(result.service.supplier_id);
      } else {
        // TODO: Manejar el error
        console.error(response.status);
      }
    } catch (error) {
      // TODO: Manejar el error
      console.error(error);
    }
  };

  const getPolicies = async () => {
    try {
      const response = await axios.get(
        `${config.api}/suppliers/data/${agentId}||${supplierId}`
      );

      const result = response.data;

      const amenitiesArray: string[] = [];
      const policiesArray: string[] = [];

      for (const key in result.Item) {
        if (Object.prototype.hasOwnProperty.call(result.Item, key)) {
          if (key.startsWith('amenities[')) {
            const match = key.match(/\[(\d+)\]/);
            if (match) {
              const index = parseInt(match[1]);
              amenitiesArray[index] = result.Item[key];
            }
          } else if (key.startsWith('cancel_policies')) {
            policiesArray.push(result.Item[key]);
          }
        }
      }

      const amenitiesString = amenitiesArray.join(', ');
      setAmenities(amenitiesString);

      if (result) {
        setAgentData(result.Item);
      }

      setPolicies(policiesArray);
    } catch (error) {
      // TODO: Handle Error
      console.error(error);
    }
  };

  useEffect(() => {
    if (typeof id === 'string') {
      if (id.includes('--')) {
        setBookingId(id.split('--')[1]);
        setAgentId(id.split('--')[0]);
      } else if (id.includes('?')) {
        setAgentId(id.split('?')[0]);
      }
    }
  }, [id]);

  useEffect(() => {
    bookingId && agentId ? getBookingConfirmation() : null;
  }, [bookingId, agentId]);

  useEffect(() => {
    getPolicies();
  }, [supplierId]);

  const formatDate = (dateString: string | number | Date) => {
    const date = moment(dateString);
    date.locale('en');
    return date.format('ddd D, MMM, YYYY');
  };

  function handleHours(time: String | any) {
    const [hour, minutes] = time.split(':');

    if (hour >= 0 && hour <= 12) {
      return `${hour}:${minutes} AM`;
    }

    if (hour >= 12 && hour <= 24) {
      return `${hour - 12}:${minutes} PM`;
    }
    return '';
  }

  const handleClick = async () => setModal(true);

  const handleThrowConfirmation = async () => {
    const response = await axios.post(
      `${config.api}/suppliers/cancel/${bookingId}||${agentId}`
    );
    if (response.status === 200) {
      setModal(false);
      setModalCancel(true);
      setTimeout(() => {
        location.reload();
      }, 8000);
    } else {
      Swal.fire(
        'oops Error cancelling reservation',
        `${response.data.status}`,
        'error'
      );
    }
  };

  const handleCloseConfirmCancelation = () => setModalCancel(false);
  const handleCloseModal = () => setModal(false);

  const handleNumberOfPeople = (rooms: Array<any>) => {
    let totalGuest = 0;
    for (let i = 0; i < rooms.length; i++) {
      totalGuest += rooms[i].accommodation_number_of_people_permitted;
    }
    return totalGuest;
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
                  className={`w-full h-full flex items-center justify-center max-h-[150px] ${
                    index === remainingImages.length - 1 ? 'relative' : ''
                  }`}
                  key={index}
                >
                  {index === remainingImages.length - 1 && Images.length > 5 ? (
                    <div className="relative">
                      <img
                        src={image}
                        alt={`Image ${index + 2}`}
                        className="w-full h-full object-center object-cover rounded-sm max-h-[100px]"
                      />
                      <div
                        className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center sm:pl-2 xs:pl-2"
                        style={{ zIndex: 1 }}
                      >
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-75 flex items-center justify-center sm:pl-2 xs:pl-2 max-h-[100px]">
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

  const handleInclusion = (Inclusion: string) => {
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
      <div key={index} className="flex col gap-3 w-auto">
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

  return (
    <>
      <SEO title={t('SEO.confirmation')} />
      <BookingLayout isPublic={true} agentId={agentId}>
        {modalPolicy && (
          <ModalPolicyProposal
            open={modalPolicy}
            onClose={() => setModalPolicy(false)}
            policies={policies}
          />
        )}
        {modal && (
          <ModalConfirmCancellation
            open={modal}
            onClose={handleCloseModal}
            deleteBooking={handleThrowConfirmation}
          />
        )}
        {modalCancel && (
          <ModalCancelConfirmation
            open={modalCancel}
            onClose={handleCloseConfirmCancelation}
          />
        )}
        <div className="flex justify-center w-full">
          <Step actualStep="Confirmation" />
        </div>
        <div className="w-full flex row justify-center mb-10">
          <div className="w-[90%] h-full flex justify-center">
            <div className="flex flex-col md:flex-row gap-5 w-[90%] items-start justify-center">
              <div className="md:w-3/5 w-full">
                {data?.status === 'cancelled' ? (
                  <h2 className="text-2xl font-[760] text-red-500 mb-5">
                    {t('suppliers.service_cancel')}
                  </h2>
                ) : (
                  <h2 className="text-2xl font-[760] text-white mb-5">
                    {t('suppliers.service_confirm')}
                  </h2>
                )}
                {agentData?.add_image_text ? (
                  <div className="h-[250px] mb-2">
                    <div className="w-full h-full flex flex-row items-center">
                      {handleImage(agentData?.add_image_text)}
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex row items-center h-[160px] border-2 border-white rounded-xl">
                    <Image
                      src={volindo}
                      width={100}
                      height={50}
                      alt="Volindo Logo"
                      className="w-full h-[100px] my-2 p-2"
                    />
                  </div>
                )}
                <div className="py-2">
                  <h2 className="font-[650] text-[20px] text-white">
                    {agentData?.company_name}
                  </h2>
                  {agentData?.supplier_additional_info && (
                    <p className="font-[400] text-[16px] line-height-6 text-white">
                      {agentData?.supplier_additional_info}
                    </p>
                  )}
                  {agentData?.stars && (
                    <div className="flex flex-row text-md gap-3 text-white my-2 items-center font-[450] leading-[23px]">
                      {Stars(agentData?.stars)} {agentData?.stars}
                    </div>
                  )}
                  {agentData?.supplier_address && (
                    <div>
                      <span className="flex flex-row gap-3 font-[510] text-[14px] text-[#FCFCFD] opacity-70 pb-1">
                        <Image
                          src={homeIcon}
                          alt="home icon"
                          width={18}
                          height={18}
                        />{' '}
                        {agentData?.supplier_address}
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
                      {agentData?.phone_number}
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
                      {agentData?.email}
                    </span>
                  </div>
                </div>
                {data?.service?.supplier_type === 'accommodation' && (
                  <>
                    {amenities && (
                      <div className="w-full rounded-3xl xs:rounded-3xl bg-white/[.14] p-4 my-2 mb-[13px] shadow-lg xs:w-full xs:p-4 xs:shadow-none">
                        <p className="text-white font-[500] text-[16px]">
                          {t('suppliers.amenities')}
                        </p>
                        <ul className="">
                          <li className="my-3 mb-2 overflow-y-auto scrollbar-hide text-white">
                            {handleInclusion(amenities)}
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
                {agentData?.supplier_lat && agentData?.supplier_long ? (
                  <div className="w-full rounded-xl overflow-hidden">
                    <DisplayAddressMap
                      lat={agentData?.supplier_lat || 0}
                      lng={agentData?.supplier_long || 0}
                    />
                  </div>
                ) : null}
              </div>
              {/* Data Info CARD */}
              <div className="md:w-2/5 w-full bg-[#F6F5F7] p-5 rounded-[40px] h-fit">
                <h2 className="font-[590] text-[20px] text-[#0C0C0C]">
                  {t('suppliers.supplier-traveler')}
                </h2>
                {/* Name Details */}
                <div className="w-full bg-white rounded-2xl p-5">
                  <div className="flex flex-row">
                    <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                      {t('stays.placeholder-first-name')}
                      <p className="font-[400] text-[14px] text-black">
                        {data?.main_contact?.[0].first_name ||
                          'No name available'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row pt-2">
                    <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                      {t('stays.placeholder-phone')}
                      <p className="font-[400] text-[14px] text-black">
                        {data?.main_contact?.[0].phone_number || ''}
                      </p>
                    </div>
                    <div className="font-[400] text-[12px] w-1/2 text-[#272727] bg-opacity-50">
                      {t('stays.placeholder-email')}
                      <p className="font-[400] text-[14px] min-w-[10px] text-black wrap truncate max-w-[100%]">
                        {data?.main_contact?.[0].email || ''}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Date Details */}
                {data?.service?.rooms[0].accommodation_checkin ||
                data.service.date_checkin ||
                data?.service?.service_time ? (
                  <>
                    <div className="w-full bg-white rounded-2xl p-5 mt-5">
                      <div className="flex flex-row">
                        {data?.service?.rooms[0].accommodation_checkin ||
                        data.service.date_checkin ? (
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
                                    data?.service?.rooms[0]
                                      .accommodation_checkin ||
                                      data.service.date_checkin ||
                                      '',
                                    i18n.language
                                  )}
                                </p>
                              </div>
                            </div>
                          </>
                        ) : null}

                        {data?.service?.supplier_type === 'accommodation' ? (
                          <>
                            {data?.service?.rooms[0]
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
                                      data?.service?.rooms[0]
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
                            {data?.service?.service_time && (
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
                                    By {formatTime(data?.service?.service_time)}
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
                    <p className="text-[14px] text-black font-[510]">
                      {data?.service?.supplier_type === 'accommodation' &&
                      data?.payments[0]?.total ? (
                        <span>
                          {price.countrySymbol}
                          {handlePriceAccomodation(
                            data?.payments[0]?.total,
                            data?.service?.rooms
                          )}
                        </span>
                      ) : (
                        <span>
                          {price.countrySymbol}
                          {data?.payments[0]?.total &&
                          data?.service?.number_of_people_permitted
                            ? handleGeneralPrice(
                                data?.payments[0]?.total,
                                data?.service?.number_of_people_permitted
                              )
                            : data?.payments[0]?.total ||
                              data?.payments[0]?.subtotal}{' '}
                        </span>
                      )}{' '}
                      x{' '}
                      {data?.service?.supplier_type === 'accommodation' ? (
                        <span>
                          {handleNumberOfPeople(data?.service?.rooms)}{' '}
                          {data?.service?.rooms.length > 1
                            ? 'people'
                            : 'per person'}
                        </span>
                      ) : (
                        <>
                          {data?.service?.number_of_people_permitted ? (
                            <span>
                              {data?.service?.number_of_people_permitted < 1
                                ? `${data?.service?.number_of_people_permitted} per person`
                                : `${data?.service?.number_of_people_permitted} people`}
                            </span>
                          ) : (
                            <span>per person</span>
                          )}
                        </>
                      )}
                    </p>
                    <p className="text-[14px] text-black text-[510]">
                      {price.countrySymbol}
                      {price.integerTotal(data?.payments[0]?.total)}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between mt-2">
                    <p className="text-whiteLabelColor font-[700] text-[16px]">
                      Total
                    </p>
                    <p className="text-whiteLabelColor font-[700] text-[16px]">
                      {price.countrySymbol}
                      {price.integerTotal(data?.payments[0]?.total)}
                    </p>
                  </div>
                </div>
                {/* Button of Cancel and Checkbox */}
                <div className="w-full flex flex-row gap-1 items-center my-2">
                  {data?.status !== 'cancelled' && (
                    <p className="font-[510] text-[16px]">
                      <input
                        type="checkbox"
                        name="cancel"
                        className="rounded-xl mr-2"
                        onClick={() => setChecked(!checked)}
                      />
                      {t('suppliers.cancellation-policy-text-1')}{' '}
                      <span
                        className="underline lowercase"
                        onClick={() => setModalPolicy(true)}
                      >
                        {t('suppliers.cancellation-policy-text-2')}
                      </span>
                    </p>
                  )}
                </div>
                {data?.status === 'cancelled' ? (
                  <button
                    disabled={true}
                    className="text-red-500 border-red-500 border-2 h-[48px] w-full rounded-full text-[700] min-h-[48px]"
                  >
                    {t('suppliers.cancel-button')}
                  </button>
                ) : (
                  <button
                    onClick={handleClick}
                    disabled={!checked}
                    className="h-auto w-full text-black text-md font-[650] bg-whiteLabelColor rounded-[24px] md:w-full sm:w-full xs:w-full min-h-[48px]"
                  >
                    {t('suppliers.cancel-button')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {slider && (
          <ModalImagesCarrousel
            open={slider}
            onClose={() => setSlider(false)}
            title={agentData?.company_name}
            ImageArray={agentData?.add_image_text}
          />
        )}
      </BookingLayout>
    </>
  );
};

export default Payment;
