//Configuration and building
import React from 'react';
import config from '@config';
import moment from 'moment';
import axios from 'axios';

//Server
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';

import { useAppDispatch } from '@context';

//Translation
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { useTranslation } from 'next-i18next';

//Icons
import download from '@icons/download.svg';
import resphoneIcon from '@icons/resphoneIcon.svg';
import resmessageIcon from '@icons/resmessageIcon.svg';
import restextIcon from '@icons/restextIcon.svg';
import instagramColor from '@icons/instagramColor.svg';
import fbMessneger from '@icons/fbMessenger.svg';
import whatsAppcolor from '@icons/whatsAppcolor.svg';
import userDefaultIMG from '@icons/userDefaultIMG.svg';
import resDoorIcon from '@icons/resDoorIcon.svg';
import resUserIcon from '@icons/resUserIcon.svg';
import calendarIcon from '@icons/calendar-white.svg';
import arrowDownIcon from '@icons/arrow-down.svg';

//Icons for Travel Status
import canceldHotelIcon from '@icons/resSupplierIcon.svg';
import hotelIconColor from '@icons/hotelIconColor.svg';

import resFlightsIcon from '@icons/resFlightsIcon.svg';

import canceledAdventuraIcon from '@icons/resStayIcon.svg';
import AdventureIcon from '@icons/resStayIconPurple.svg';

import countryDataEN from '../../../../public/data/countries/en/countriesData.json';
import countryDataES from '../../../../public/data/countries/es/countriesData.json';

//Componetns
import { SEO, ModalGeneralReservation } from '@components';
import {
  CheckPicker,
  FlexboxGrid,
  Popover,
  Radio,
  RadioGroup,
  SelectPicker,
  Whisper,
} from 'rsuite';
import type { ItemDataType } from 'rsuite/esm/@types/common';
import Image from 'next/image';
import saveAs from 'file-saver';
import { stringify } from 'csv-stringify';

//Typing
import {
  NewReservationType,
  NextPageWithLayout,
  ReservationStatus,
  ResevationsFiltersCRM,
} from '@typing/types';
import { ReservationProps } from '@typing/proptypes';
import { getLayout } from '@layouts/MainLayout';

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const [reservationsResponse] = await Promise.all([
      axios.get(`${config.api}/bookings/crm/`, {
        headers: {
          Authorization: 'Bearer ' + session.user.id_token,
          'Content-Type': 'application/json',
        },
      }),
    ]);

    const reservations = reservationsResponse.data;

    const countries = context.locale === 'en' ? countryDataEN : countryDataES;

    return {
      props: {
        ...(await serverSideTranslations(
          context.locale || 'en',
          ['common'],
          nextI18nextConfig
        )),
        id_token: session.user.id_token,
        countries,
        reservations,
      },
    };
  } catch (error) {
    return {
      props: {
        ...(await serverSideTranslations(
          context.locale || 'en',
          ['common'],
          nextI18nextConfig
        )),
        id_token: session.user.id_token,
        countries: [],
        reservations: [],
      },
    };
  }
};

/**
 * Interface
 */

const renderCountriesValue = (value: string[], items: ItemDataType[]) => {
  return (
    <span className="rs-picker-toggle-value items-center">
      <span className="rs-picker-value-list">
        {items.map(item => (
          <span
            key={item.value}
            className="rounded-[14px] bg-[#ffffff5c] px-3 mr-1 h-[22px] inline-flex"
          >
            {item.label}
          </span>
        ))}
      </span>
      <span className="rs-picker-value-count">{items.length}</span>
    </span>
  );
};

const Reservations: NextPageWithLayout<ReservationProps> = ({
  countries,
  reservations,
}: ReservationProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  //Transalations states
  const { t, i18n } = useTranslation();
  const [language, setLenguage] = React.useState('en');
  const [prevLang, setPrevLang] = React.useState(i18n.language);

  console.log('xim reservations here', reservations);

  //Define data states
  const [windowSize, setWindowSize] = React.useState(0);

  //Reservations Flow
  const [reservationID, setReservationID] = React.useState('');
  const [reservationsData, setReservationsData] = React.useState<
    NewReservationType[]
  >([]);
  const [reservationsResults, setReservationsResults] = React.useState<
    NewReservationType[]
  >([]);
  const [reservationsDetails, setReservationDetails] = React.useState<any>({});

  //Index for media icons
  const [activeIndex, setActiveIndex] = React.useState(-1);

  //Modal states
  const [modalReservationDetails, setModalReservationDetails] =
    React.useState(false);

  //Hotels Flow
  const [hotelDetails, setHotelDetails] = React.useState({});

  //States to show data
  const [showDateRange, setShowDateRange] = React.useState(false);
  const [imageDirection, serImageDirection] = React.useState(false);

  //Flags
  const iconArrayCountries = [
    { country: 'Afganistán', flag: '🇦🇫' },
    { country: 'Albania', flag: '🇦🇱' },
    { country: 'Alemania', flag: '🇩🇪' },
    { country: 'Andorra', flag: '🇦🇩' },
    { country: 'Angola', flag: '🇦🇴' },
    { country: 'Antigua y Barbuda', flag: '🇦🇬' },
    { country: 'Arabia Saudita', flag: '🇸🇦' },
    { country: 'Argentina', flag: '🇦🇷' },
    { country: 'Armenia', flag: '🇦🇲' },
    { country: 'Australia', flag: '🇦🇺' },
    { country: 'Austria', flag: '🇦🇹' },
    { country: 'Azerbaiyán', flag: '🇦🇿' },
    { country: 'Bahamas', flag: '🇧🇸' },
    { country: 'Bahréin', flag: '🇧🇭' },
    { country: 'Bangladés', flag: '🇧🇩' },
    { country: 'Barbados', flag: '🇧🇧' },
    { country: 'Bélgica', flag: '🇧🇪' },
    { country: 'Belice', flag: '🇧🇿' },
    { country: 'Benín', flag: '🇧🇯' },
    { country: 'Bielorrusia', flag: '🇧🇾' },
    { country: 'Bolivia', flag: '🇧🇴' },
    { country: 'Bosnia y Herzegovina', flag: '🇧🇦' },
    { country: 'Botsuana', flag: '🇧🇼' },
    { country: 'Brasil', flag: '🇧🇷' },
    { country: 'Brunéi', flag: '🇧🇳' },
    { country: 'Bulgaria', flag: '🇧🇬' },
    { country: 'Burkina Faso', flag: '🇧🇫' },
    { country: 'Burundi', flag: '🇧🇮' },
    { country: 'Bután', flag: '🇧🇹' },
    { country: 'Cabo Verde', flag: '🇨🇻' },
    { country: 'Camboya', flag: '🇰🇭' },
    { country: 'Camerún', flag: '🇨🇲' },
    { country: 'Canadá', flag: '🇨🇦' },
    { country: 'Catar', flag: '🇶🇦' },
    { country: 'Chad', flag: '🇹🇩' },
    { country: 'Chile', flag: '🇨🇱' },
    { country: 'China', flag: '🇨🇳' },
    { country: 'Chipre', flag: '🇨🇾' },
    { country: 'Colombia', flag: '🇨🇴' },
    { country: 'Comoras', flag: '🇰🇲' },
    { country: 'Congo', flag: '🇨🇬' },
    { country: 'Corea del Norte', flag: '🇰🇵' },
    { country: 'Corea del Sur', flag: '🇰🇷' },
    { country: 'Costa de Marfil', flag: '🇨🇮' },
    { country: 'Costa Rica', flag: '🇨🇷' },
    { country: 'Croacia', flag: '🇭🇷' },
    { country: 'Cuba', flag: '🇨🇺' },
    { country: 'Dinamarca', flag: '🇩🇰' },
    { country: 'Emiratos Árabes Unidos', flag: '🇦🇪' },
    { country: 'Estados Unidos', flag: '🇺🇸' },
    { country: 'Israel', flag: '🇮🇱' },
    { country: 'Jordania', flag: '🇯🇴' },
    { country: 'Kuwait', flag: '🇰🇼' },
    { country: 'Líbano', flag: '🇱🇧' },
    { country: 'Marruecos', flag: '🇲🇦' },
    { country: 'Palestina', flag: '🇵🇸' },
    { country: 'Qatar', flag: '🇶🇦' },
    { country: 'Siria', flag: '🇸🇾' },
    { country: 'Sudán', flag: '🇸🇩' },
    { country: 'Túnez', flag: '🇹🇳' },
    { country: 'Yemen', flag: '🇾🇪' },
    { country: 'Nueva Zelanda', flag: '🇳🇿' },
    { country: 'Mexico', flag: '🇲🇽' },
    { country: 'Mónaco', flag: '🇲🇲' },
    { country: 'Nicaragua', flag: '🇳🇱' },
    { country: 'Panamá', flag: '🇵🇸' },
    { country: 'Paraguay', flag: '🇵🇾' },
    { country: 'USA', flag: '🇺🇸' },
  ];

  //Filters
  const [unfilteredReservations, setUnfilteredReservations] = React.useState<
    any[]
  >([]);
  const [reservation, setReservation] = React.useState<any[]>([]);
  const [showFilter, setShowFilter] = React.useState(false);

  const [filters, setFilters] = React.useState<ResevationsFiltersCRM>({
    name: '',
    countries: [],
    tripStatus: '',
    range: '0',
    services: '0',
  });
  const servicesMapping: Record<string, string> = {
    '1': 'hotel',
    '2': 'supplier',
    '3': 'flight',
  };

  /*      UseEffects      */

  React.useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  React.useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (activeIndex >= 0) {
        const socialsDiv = document.getElementById(
          `socials-div-${activeIndex}`
        );
        if (socialsDiv && !socialsDiv.contains(event.target as Node)) {
          setActiveIndex(-1);
        }
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [activeIndex]);

  //Setting lenguage
  React.useEffect(() => {
    setPrevLang(i18n.language);
  }, [i18n.language]);

  const RESERVATIONS_STATUS: Array<ReservationStatus> = [
    { id: 0, description: 'All Status', slug: '', word: '' },
    { id: 1, description: 'Canceled', slug: 'Canceled', word: '' },
    { id: 2, description: 'Pending', slug: 'Pending', word: '' },
    { id: 3, description: 'Paid', slug: 'Paid', word: '' },
    { id: 4, description: 'Coming In', slug: 'Coming in', word: '' },
    {
      id: 5,
      description: 'Recently finised',
      slug: 'Recently finished',
      word: '',
    },
    { id: 6, description: 'Past Trips', slug: 'Past trips', word: '' },
    { id: 7, description: 'Active', slug: 'Active', word: '' },
  ];

  const countryNameMapping: { [key: string]: string } = {
    USA: 'United States',
    'United States of America': 'United States',
    //If is necessary add more mappings
  };

  React.useEffect(() => {
    setReservationsData(reservations);
  }, [reservations]);

  React.useEffect(() => {
    setReservationsResults(reservationsData);
  }, [reservationsData]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dateRangeContainer = document.querySelector(
        '.date-range-container'
      );
      if (
        dateRangeContainer &&
        !dateRangeContainer.contains(event.target as Node)
      ) {
        setShowDateRange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  function isReservationsWithinDateRange(
    reservations: NewReservationType,
    startDate: Date,
    endDate: Date = moment('9999-12-31', 'YYYY-MM-DD').toDate()
  ): boolean {
    const reservationStart = moment(
      reservations?.service?.check_in,
      'YYYY-MM-DD'
    )
      .endOf('day')
      .toDate();
    return moment(reservationStart).isBetween(startDate, endDate, null, '[]');
  }

  function handleDownloadCSV() {
    // Convert the reservationsResults array into a 2D array (rows and columns)
    const rows = reservationsResults.map(reservation => {
      const row = [
        reservation?.main_contact?.first_name || '',
        reservation?.main_contact?.last_name || '',
        (reservation?.service?.address &&
          reservation?.service?.address
            .substring(reservation?.service?.address?.lastIndexOf(',') + 1)
            ?.trim()) ||
          '',
        reservation?.status || '',
        `${reservation?.service?.search_parameters.check_in} - ${reservation?.service?.search_parameters.check_out}`,
        `${reservation?.service?.search_parameters?.rooms.reduce(
          (total, room) =>
            total + room.number_of_adults + room.children_age.length,
          0
        )} adults, ${
          reservation?.service?.search_parameters?.rooms.length
        } rooms`,
        `$${reservation?.service?.payments.total}`,
      ];
      return row;
    });
    // Add column headers to the top of the 2D array
    const csvData = [
      [
        'First Name',
        'Last Name',
        'Country',
        'Reservation Status',
        'Date Range',
        'Guests',
        'Total Price',
      ],
      ...rows,
    ];
    stringify(csvData, (err, output) => {
      if (err) {
        console.error(err);
        return;
      }

      // Save the CSV string as a file using FileSaver.js
      const blob = new Blob([output], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'Volindo_Reservations.csv');
    });
  }

  /** Handlers */

  const formatDate = (reservation: any) => {
    const transformToDate = (dateString: string) => {
      const date = new Date(dateString);
      const options = { month: 'short', day: 'numeric', year: '2-digit' };
      return date.toLocaleDateString('en-US');
    };

    switch (reservation?.service.service_type) {
      case 'hotels':
        return (
          <div>
            {transformToDate(reservation?.service.search_parameters?.check_in)}{' '}
            -{' '}
            {transformToDate(reservation?.service.search_parameters?.check_out)}
          </div>
        );
      case 'suppliers':
        if (reservation?.service?.supplier_type === 'accommodation') {
          return (
            <div>
              {transformToDate(
                reservation?.service.rooms[0]?.accommodation_checkin
              )}{' '}
              -{' '}
              {transformToDate(
                reservation?.service.rooms[0]?.accommodation_date_checkout
              )}
            </div>
          );
        } else {
          return (
            <div>{transformToDate(reservation?.service.date_checkin)}</div>
          );
        }
      default:
        return (
          <div>
            {transformToDate(
              reservation?.service?.selected_flight?.flights[0]
                ?.departure_details.datetime
            )}
          </div>
        );
    }
  };

  const handlePhone = (phone_number: string) => {
    window.location.href = `tel:${phone_number}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleWhatsApp = (phone_number: string) => {
    window.open(
      `https://api.whatsapp.com/send?l=${i18n.language}&phone=${phone_number}`,
      '_blank'
    );
  };

  const handleFacebook = (page: string) => {
    let pageUrl;
    // Check if input is a page URL or username
    if (page.includes('facebook.com')) {
      pageUrl = page;
    } else if (page !== '') {
      pageUrl = `https://www.facebook.com/${page}`;
    } else {
      pageUrl = 'https://www.facebook.com';
    }
    window.open(pageUrl, '_blank');
  };

  const handleInstagram = (page: string) => {
    let pageUrl;
    // Check if input is a page URL or username
    if (page.includes('instagram.com')) {
      pageUrl = page;
    } else if (page !== '') {
      pageUrl = `https://www.instagram.com/${page}`;
    } else {
      pageUrl = `https://www.instagram.com/`;
    }
    window.open(pageUrl, '_blank');
  };

  const findFlagByCountry = (country: string) => {
    const countryObj = iconArrayCountries.find(obj => obj.country === country);
    if (countryObj) {
      return `${countryObj.flag} ${country}`;
    }
    return country;
  };

  const handleTravelerAndRooms = (reservation: any) => {
    switch (reservation?.service?.service_type) {
      case 'hotels':
        return (
          <div className="bg-[#D9D9D9] w-6 h-6 flex items-center justify-center rounded-full bg-opacity-[.1]">
            <Image
              src={
                reservation?.status === 'cancelled'
                  ? canceldHotelIcon
                  : hotelIconColor
              }
              alt="Hotel Color Icon"
            />
          </div>
        );
      case 'suppliers':
        return (
          <div className="bg-[#D9D9D9] w-6 h-6 flex items-center justify-center rounded-full bg-opacity-[.1]">
            <Image
              src={
                reservation?.status === 'cancelled'
                  ? canceledAdventuraIcon
                  : AdventureIcon
              }
              alt="Suppliers Color Icon"
            />
          </div>
        );
      default:
        return (
          <div className="bg-[#D9D9D9] w-6 h-6 flex items-center justify-center rounded-full bg-opacity-[.1]">
            <Image src={resFlightsIcon} alt="Suppllier Color Icon" />
          </div>
        );
    }
    return null;
  };

  const handleAssistansToActivity = (reservation: any) => {
    switch (reservation?.service?.service_type) {
      case 'hotels':
        return (
          <div className="flex flex-row">
            <div className="flex flex-row p-1">
              {1}
              <Image
                src={resUserIcon}
                alt="Number of Users Icon"
                className="ml-2"
              />
            </div>
            <span className="p-1">/</span>
            <div className="flex flex-row p-1">
              {reservation?.service?.name_room.length}
              <Image src={resDoorIcon} alt="Door Icon" className="ml-2" />
            </div>
          </div>
        );
      case 'suppliers':
        return (
          <div className="flex justify-center align-center">
            <div className="flex flex-row p-1">
              {reservation?.main_contact.length}
              <Image
                src={resUserIcon}
                alt="Number of Users Icon"
                className="ml-2"
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex justify-center align-center">
            <div className="flex flex-row p-1">
              {
                reservation?.service?.selected_flight?.travelers[0]
                  .number_of_adults
              }
              <Image
                src={resUserIcon}
                alt="Number of Users Icon"
                className="ml-2"
              />
            </div>
          </div>
        );
    }
  };

  const handleName = (reservation: any) => {
    return (
      reservation?.main_contact[0]?.first_name +
        ' ' +
        reservation?.main_contact[0]?.last_name || ''
    );
  };

  const handleShowModalReservationDetails = (reservation: any) => {
    setModalReservationDetails(true);
    setReservationDetails(reservation);
  };

  const handleShowModal = () => {
    //TODO Show modal
  };

  const handleShowCountry = (reservation: any) => {
    switch (reservation?.service?.service_type) {
      case 'hotels':
        const hotelAdress = reservation.service.address;
        if (hotelAdress) {
          const country = hotelAdress
            .substring(hotelAdress.lastIndexOf(',') + 1)
            .trim();
          return findFlagByCountry(country);
        }
      case 'suppliers':
        return findFlagByCountry(reservation?.agent?.country?.country_name);
      default:
        return findFlagByCountry(reservation?.agent?.country?.country_name);
    }
  };

  React.useEffect(() => {
    setUnfilteredReservations(reservations);
  }, [reservations]);

  React.useEffect(() => {
    let aux = reservations;

    if (filters.name) {
      aux = aux.filter(item => item.name === filters.name);
    }
    if (filters.countries && filters.countries.length > 0) {
      aux = aux.filter(item => filters.countries.includes(item.country));
    }
    if (filters.tripStatus) {
      aux = aux.filter(item => item.trip_status === filters.tripStatus);
    }
    if (filters.services && filters.services !== '0') {
      const mapedService = servicesMapping[filters.services];
      aux = aux.filter(item => {
        return item.selectedSupplier === mapedService;
      });
    }
    setReservation(aux);
  }, [reservations, filters]);

  const handleChangeFilterName = (value: string | null) => {
    setFilters({ ...filters, name: value || '' });
  };

  const handlerChangeFilterCuntries = (value: string[]) => {
    setFilters({ ...filters, countries: value });
  };

  const handleChangeFilterTripStatus = (value: string | number) => {
    setFilters({ ...filters, tripStatus: value as string });
  };

  const handleChangeFilterServices = (value: string | number) => {
    setFilters({ ...filters, services: value as string });
  };

  return (
    <>
      <SEO title={'Titulo SEO para Suppliers'} />

      <h2 className="text-white text-[32px] font-bold mt-[32px]">
        {t('reservations.title')}
      </h2>

      <div className="flex flex-col justify-between items-center lg:flex-row">
        <div className="flex gap-3 justify-between items-center px-3 mt-5 border border-[#323232] rounded-[7px] text-white h-[42px] bg-[#191919] ">
          <button
            onClick={() =>
              router.push('/reservations', '/reservations', {
                locale: i18n.language,
              })
            }
            className="h-[30px] w-[102px] bg-[#323232] px-2 rounded-[7px]"
          >
            {t('reservations.title')}
          </button>
          <button
            onClick={() =>
              router.push('/travelers', '/travelers', {
                locale: i18n.language,
              })
            }
            className="h-[30px] w-[102px]"
          >
            {t('travelers.title')}
          </button>
          <button
            onClick={() =>
              router.push('/suppliers', '/suppliers', {
                locale: i18n.language,
              })
            }
            className="h-[30px] w-[102px]"
          >
            {t('suppliers.title')}
          </button>
        </div>
        <div
          className="flex gap-3 items-center text-white text-base ml-auto px-10 lg:ml-0 lg:px-0 mt-5"
          onClick={handleDownloadCSV}
        >
          <Image src={download} height={18} width={18} alt="download" />
          <button>{t('reservations.download')}</button>
        </div>
      </div>

      {reservations.length <= 0 && (
        <div className="flex flex-col justify-center items-center w-full h-[502ox] bg-[#141414] rounded-t-[20px] lg:rounded-[20px] mx-auto mt-4 lg:h-[calc(100vh-347px)]">
          <h2 className="text-white text-sm">
            You don&apos;t have any reservations right now
          </h2>
        </div>
      )}

      {/* Seteando los modales */}

      {/* Setteando cuadro con travelers */}
      {windowSize < 768 ? (
        <h1>Mobile</h1>
      ) : (
        <>
          <FlexboxGrid className="justify-center text-white mt-6 grid grid-cols-7 items-center justify-items-center bg-white/[.14] rounded-xl text-md h-[46px]">
            <FlexboxGrid.Item colspan={4} className="w-full">
              <SelectPicker
                size="lg"
                value={filters.name}
                onChange={handleChangeFilterName}
                placement="bottomStart"
                placeholder={t('reservations.name')}
                className="select-picker-travelers w-full h-[46px!important]"
                data={reservations.map(item => ({
                  label: `${item.main_contact[0]?.first_name} ${item.main_contact[0]?.last_name} `,
                  value: item.id,
                }))}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4} className="w-auto">
              <CheckPicker
                value={filters.countries}
                onChange={handlerChangeFilterCuntries}
                placeholder={t('reservations.country')}
                renderValue={renderCountriesValue}
                className="check-picker-traveler w-full h-[46px!important]"
                data={countries.map(country => ({
                  label: country.country_name,
                  value: country.id,
                }))}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4} className="w-auto">
              <Whisper
                trigger="click"
                placement="bottomStart"
                speaker={
                  <Popover arrow={false} className="status-popover">
                    <RadioGroup
                      name="radios-status"
                      value={filters.tripStatus}
                      onChange={handleChangeFilterTripStatus}
                    >
                      <Radio value="0">{t('travelers.all-status')}</Radio>
                      <Radio value="1">Coming In</Radio>
                      <Radio value="2">Canceled</Radio>
                      <Radio value="3">Panding</Radio>
                      <Radio value="3">Paid</Radio>
                    </RadioGroup>
                  </Popover>
                }
              >
                <button
                  type="button"
                  id="button-travelers"
                  className="flex gap-2 justify-between items-center w-full text-[15px] text-white h-[46px] px-[15px]"
                >
                  {t('reservations.tripstats')}
                  <Image alt="icon" src={arrowDownIcon} className="invert" />
                </button>
              </Whisper>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <p>{t('reservations.triprang')}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <p>{t('reservations.travelers')}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <p>{t('reservations.contacts')}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={4} className="w-auto">
              <Whisper
                trigger="click"
                placement="bottomStart"
                speaker={
                  <Popover arrow={false} className="status-popover">
                    <RadioGroup
                      name="radios-status"
                      value={filters.tripStatus}
                      onChange={handleChangeFilterServices}
                    >
                      <Radio value="0">All</Radio>
                      <Radio value="1">Hotels</Radio>
                      <Radio value="2">Adventures</Radio>
                      <Radio value="3">Filghts</Radio>
                    </RadioGroup>
                  </Popover>
                }
              >
                <button
                  type="button"
                  id="button-travelers"
                  className="flex gap-2 justify-between items-center w-full text-[15px] text-white h-[46px] px-[15px]"
                >
                  {t('reservations.services')}
                  <Image alt="icon" src={arrowDownIcon} className="invert" />
                </button>
              </Whisper>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <div className="h-[calc(100vh-347px)] overflow-y-scroll scrollbar-hide  lg:h-[calc(100vh-347)]">
            {reservations?.map((reservation, index) => (
              <>
                {modalReservationDetails && (
                  <ModalGeneralReservation
                    open={modalReservationDetails}
                    onClose={() => setModalReservationDetails(false)}
                    reservation={reservationsDetails}
                  />
                )}
                <div key={index}>
                  {/*
                   * Mapeando los datos de la reservación
                   * 1. Nombre
                   * 2. Pais
                   * 3. Estado del viaje
                   * 4. Fechas
                   * 5. Contacto del viaje
                   * 6. Servicio
                   * 7. Precio
                   */}
                  <FlexboxGrid className="justify-center text-white mt-6 gap-y-3 rounded-xl px-2 py-6 grid grid-cols-7 items-center justify-items-center bg-white/[.04]">
                    <FlexboxGrid.Item
                      className="flex justufy-start w-full cursor-pointer"
                      onClick={() =>
                        handleShowModalReservationDetails(reservation)
                      }
                    >
                      <div className="flex gap-3 items-center justify-center text-white">
                        <Image
                          src={userDefaultIMG}
                          height={36}
                          width={36}
                          alt="User image"
                        />
                        <span>{handleName(reservation)}</span>
                      </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                      {handleShowCountry(reservation)}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="capitalize">
                      {reservation?.status_trip_reservation}
                    </FlexboxGrid.Item>

                    <FlexboxGrid.Item className="flex flex-row">
                      <Image
                        src={calendarIcon}
                        alt="calendar"
                        className="mr-2"
                      />
                      {formatDate(reservation)}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="capitalize">
                      {handleAssistansToActivity(reservation)}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            handlePhone(reservation.main_contact.phone_number)
                          }
                          className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center"
                        >
                          <Image src={resphoneIcon} alt="phone" />
                        </button>
                        <button
                          onClick={() =>
                            handleEmail(reservation.main_contact.email)
                          }
                          className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center"
                        >
                          <Image src={resmessageIcon} alt="text" />
                        </button>
                        <div className="flex flex-col relative">
                          <button
                            onClick={() => setActiveIndex(index)}
                            className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center"
                          >
                            <Image src={restextIcon} alt="message" />
                          </button>
                          {activeIndex === index && (
                            <div
                              id={`socials-div-${index}`}
                              className="w-[132px] h-auto bg-[#222222] absolute top-9 -right-12 rounded-[10px] z-10 px-3 py-4"
                            >
                              <button
                                onClick={() =>
                                  handleInstagram(
                                    reservation[index].instagram_username
                                  )
                                }
                              >
                                <div className="flex gap-3 justify-center items-center">
                                  <Image src={instagramColor} alt="instagram" />{' '}
                                  <label className="text-white/[0.48]">
                                    Instagram
                                  </label>
                                </div>
                              </button>
                              <button
                                onClick={() =>
                                  handleInstagram(
                                    reservation[index].facebook_username
                                  )
                                }
                              >
                                <div className="flex gap-3 justify-center items-center my-3">
                                  <Image src={fbMessneger} alt="facebook" />{' '}
                                  <label className="text-white/[0.48]">
                                    Facebook
                                  </label>
                                </div>
                              </button>
                              <button
                                onClick={() =>
                                  handleWhatsApp(
                                    reservation[index].whatsapp_number
                                  )
                                }
                              >
                                <div className="flex gap-3 justify-center items-center">
                                  <Image
                                    width={24}
                                    height={24}
                                    src={whatsAppcolor}
                                    alt="whatsapp"
                                  />{' '}
                                  <label className="text-white/[0.48]">
                                    Whatsapp
                                  </label>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                      {handleTravelerAndRooms(reservation)}
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </div>
              </>
            ))}
          </div>
        </>
      )}
    </>
  );
};

Reservations.getLayout = getLayout;

export default Reservations;
