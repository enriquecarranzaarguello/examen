import { SEO, HeaderCRM } from '@components';
import React, { useState, useEffect, SyntheticEvent } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useRouter } from 'next/router';
import { useAppDispatch } from '@context';
import moment from 'moment';
import config from '@config';

import download from '@icons/download.svg';
import down from '@icons/downIconwhite.svg';
import resphoneIcon from '@icons/resphoneIcon.svg';
import resmessageIcon from '@icons/resmessageIcon.svg';
import restextIcon from '@icons/restextIcon.svg';
import userDefaultIMG from '@icons/userDefaultIMG.svg';
import resDoorIcon from '@icons/resDoorIcon.svg';
import resUserIcon from '@icons/resUserIcon.svg';
// import supplierIcon from '@icons/car.svg';
import calendarIcon from '@icons/calendar-white.svg';

//Icons for Travel Status
import canceldHotelIcon from '@icons/resSupplierIcon.svg';
import hotelVolindoIcon from '@icons/hotelIconColor.svg';
import hotelFlywayIcon from '@icons/hotelIconColor_flyway.svg';

import resFlightsIcon from '@icons/resFlightsIcon.svg';
import resFlightsVolindoIcon from '@icons/resFlightsIcon.svg';
import resFlightsFlywayIcon from '@icons/resFlightsIcon_flyway.svg';

import canceledAdventuraIcon from '@icons/resStayIcon.svg';
import adventureVolindoIcon from '@icons/resStayIconPurple.svg';
import adventureFlywayIcon from '@icons/resStayIconPink.svg';

import Image from 'next/image';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import nextI18nextConfig from 'next-i18next.config';
import { unstable_getServerSession } from 'next-auth';
import { useTranslation } from 'next-i18next';

import { getCrmData } from '@utils/axiosClients';

import {
  NewReservationType,
  NextPageWithLayout,
  ReservationStatus,
  ResevationsFilters,
} from '@typing/types';

// todo fix import
import ModalReservationDetails from 'src/components/modals/ModalReservationDetails';

import {
  CheckPicker,
  FlexboxGrid,
  Popover,
  Radio,
  RadioGroup,
  TagPicker,
  Whisper,
  CheckboxGroup,
  Checkbox,
} from 'rsuite';

import { ReservationProps } from '@typing/proptypes';
import saveAs from 'file-saver';
import { stringify } from 'csv-stringify';
import { useSession } from 'next-auth/react';
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

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
        ['common'],
        nextI18nextConfig
      )),
      countries: [],
    },
  };
};

interface Country {
  id: string;
  country_name: string;
}

const Reservations: NextPageWithLayout<ReservationProps> = ({
  countries,
}: ReservationProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const [reservationsData, setReservationsData] = useState<
    NewReservationType[]
  >([]);
  const [language, setLanguage] = useState('en');
  const [reservations, setReservations] = useState([]);
  const [reservationsResults, setReservationsResults] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [ShowDateRange, setShowDateRange] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(false);
  const [imgDirection, setImgDirection] = useState(false);
  const [reservationID, setreservationID] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [filterName, setFilterName] = useState(null);
  const { t, i18n } = useTranslation();
  const [prevLang, setPrevLang] = useState(i18n.language);
  const [hotelDetails, setHotelDetails] = useState({});
  const [filters, setFilters] = useState<ResevationsFilters>({
    name: [],
    countries: [],
    description: ['0'],
    range: '0',
    services: ['0'],
  });

  useEffect(() => {
    setPrevLang(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated')
      getCrmData(session?.user.id_token || '')
        .then(res => {
          setReservations(res.data);
          setReservationsResults(res.data);
        })
        .catch(error => console.error(error));
  }, [status]);

  const reservation_status: Array<ReservationStatus> = [
    { id: 0, description: 'All Status', slug: '', word: '' },
    { id: 1, description: 'Canceled', slug: 'Canceled', word: '' },
    { id: 2, description: 'Pending', slug: 'Prending', word: '' },
    { id: 3, description: 'Paid', slug: 'Paid', word: '' },
    { id: 4, description: 'Coming', slug: 'Coming', word: '' },
    {
      id: 5,
      description: 'Recently finished',
      slug: 'Recently finished',
      word: '',
    },
    { id: 6, description: 'Past trips', slug: 'Past trips', word: '' },
    { id: 7, description: 'Active', slug: 'Active', word: '' },
  ];

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

  const getIcon = (param: any, iconMap: Record<string, string>): string => {
    return iconMap[param] || '';
  };

  const hotelIconMap = {
    Flywaytoday: hotelFlywayIcon,
    Volindo: hotelVolindoIcon,
  };

  const adventureIconMap = {
    Flywaytoday: adventureFlywayIcon,
    Volindo: adventureVolindoIcon,
  };

  const flightIconMap = {
    Flywaytoday: resFlightsFlywayIcon,
    Volindo: resFlightsVolindoIcon,
  };

  const hotelIconColor = getIcon(config.WHITELABELNAME, hotelIconMap);
  const AdventureIcon = getIcon(config.WHITELABELNAME, adventureIconMap);
  const resFlightsIcon = getIcon(config.WHITELABELNAME, flightIconMap);

  const handleSetReservationsResults = (param: any) => {
    setReservationsResults(param);
  };

  const handleChangeFilterName = (values: string[]) => {
    setFilters({
      ...filters,
      name: values,
    });

    let tempContainer = [];

    if (values.length === 0) {
      tempContainer = reservations;
    } else {
      const filteredReservations = reservations.filter((reservation: any) => {
        const mainContact = reservation?.main_contact?.[0];
        const fullName = mainContact
          ? `${mainContact.first_name} ${mainContact.last_name}`
          : 'N/A';

        // Comprueba si el nombre completo coincide con alguno de los nombres seleccionados
        return values.some(value =>
          fullName.toLowerCase().includes(value.toLowerCase())
        );
      });
      tempContainer = filteredReservations;
    }
    handleSetReservationsResults(tempContainer);
  };

  const handleChangeFilterCountries = (
    value: string[],
    countries: Country[]
  ) => {
    // Divide 'value' en IDs de país y nombres de país
    const countryIds = value.filter(v => v.includes('-')); // Asume que los IDs de país contienen '-'
    const countryNames = value.filter(v => !v.includes('-'));

    // Obten los nombres de países basados en los IDs de país
    const selectedCountriesFromIds = countryIds
      .filter(countryId => countries.some(c => c.id === countryId))
      .map(
        countryId => countries.find(c => c.id === countryId)?.country_name || ''
      );

    // Combina los nombres de países obtenidos de los IDs y los nombres de países directamente proporcionados
    const selectedCountries = [...selectedCountriesFromIds, ...countryNames];

    // Map selected countries to their standardized names
    const standardizedCountries = selectedCountries.map(
      country => countryNameMapping[country] || country
    );

    let filteredReservations: any = [];
    if (reservations && reservations.length > 0) {
      if (standardizedCountries.length === 0) {
        // No countries selected, show all reservations
        filteredReservations = reservations;
      } else {
        filteredReservations = reservations.filter((reservation: any) => {
          const address = reservation?.service?.address;
          if (address) {
            const country = address.split(',').pop().trim();
            const standardizedCountry = countryNameMapping[country] || country;
            if (standardizedCountries.includes(standardizedCountry)) {
              return true;
            }
          }
          return false;
        });
      }
    }

    setReservationsResults(filteredReservations);

    setFilters({
      ...filters,
      countries: standardizedCountries,
    });
  };

  // TODO check the filtering when deselecting
  const handleChangeFilterStatus = (value: string | number) => {
    const selectedStatus =
      reservation_status.find(status => status.id === value)?.description ?? '';

    let updatedFilters = { ...filters };

    // Nuevo: revisar si 'All Status' está seleccionado
    const allStatusSelected = updatedFilters.description.includes('All Status');

    if (value === '0') {
      // Si se selecciona el índice 0, seleccionar todos los estados
      updatedFilters.description = ['All Status'].concat(
        reservation_status
          .filter(elem => elem.slug !== '')
          .map(item => item.description)
      );
    } else {
      // Si se selecciona otro estado, debemos verificar si 'All Status' está seleccionado
      if (allStatusSelected) {
        // Si 'All Status' está seleccionado, reseteamos la lista de filtros a solo el estado seleccionado
        updatedFilters.description = [selectedStatus];
      } else {
        // Si 'All Status' no está seleccionado, simplemente agregamos o eliminamos el estado seleccionado de la lista de filtros
        if (!updatedFilters.description.includes(selectedStatus)) {
          updatedFilters.description.push(selectedStatus);
        } else {
          const index = updatedFilters.description.indexOf(selectedStatus);
          updatedFilters.description.splice(index, 1);
        }
      }
    }

    setFilters(updatedFilters);

    if (updatedFilters.description.length > 0) {
      const filteredReservations = reservations.filter((reservation: any) => {
        const reservationStatus =
          reservation?.status_trip_reservation?.toLowerCase();
        return updatedFilters.description.some(
          status => reservationStatus?.includes(status.toLowerCase()) ?? false
        );
      });
      setReservationsResults(filteredReservations);
    } else {
      setReservationsResults(reservations);
    }
  };

  function isReservationWithinDateRange(
    reservation: NewReservationType,
    startDate: Date,
    endDate: Date = moment('9999-12-31', 'YYYY-MM-DD').toDate()
  ): boolean {
    const reservationStart = moment(
      reservation?.service?.check_in,
      'YYYY-MM-DD'
    )
      .endOf('day')
      .toDate();
    return moment(reservationStart).isBetween(startDate, endDate, null, '[]');
  }

  const handleChangeFilterRange = (dates: [Date | null, Date | null]) => {
    const startDate = dates[0];
    const endDate = dates[1];
    setStartDate(startDate);
    setEndDate(endDate);

    const filteredReservations = reservations.filter(reservation =>
      isReservationWithinDateRange(
        reservation,
        startDate ?? new Date(),
        endDate ?? new Date('9999-12-31')
      )
    );
    setReservationsResults(filteredReservations);
  };

  const serviceValueToNameMap: { [key: string]: string } = {
    '0': 'All Services',
    '1': 'Flights',
    '2': 'Suppliers',
    '3': 'Hotels',
  };

  const handleChangeFilterServices = (values: (string | number)[]) => {
    let updatedFilters = { ...filters };
    const stringValues = values.map(String); // Convertir los valores a string
    setSelectedServices(stringValues);

    if (stringValues.includes('0')) {
      // Si se selecciona 'All Status'
      updatedFilters.services = Object.values(serviceValueToNameMap);
    } else {
      updatedFilters.services = stringValues.map(
        value => serviceValueToNameMap[value]
      );
    }

    setFilters(updatedFilters);

    const filteredReservations = reservations.filter((reservation: any) => {
      const reservationService =
        reservation?.service?.service_type?.toLowerCase();
      return updatedFilters.services.some(
        service => reservationService?.includes(service.toLowerCase()) ?? false
      );
    });
    setReservationsResults(filteredReservations);
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

  const handleShowReservation = (res_id: any, reservstionDetails: any) => {
    const { service_type } = reservstionDetails.service;

    setReservationDetails(true);
    setreservationID(res_id);
    setHotelDetails(reservstionDetails);
  };

  const countryNameMapping: { [key: string]: string } = {
    USA: 'United States',
    'United States of America': 'United States',
    //please add more mappings as necessary if you find any other discrepancies BeVolindo
  };

  useEffect(() => {
    // let aux = reservations;
    // // apply filters
    // if (filters.name[0]) {
    //   aux = aux.filter(item => item.booking_id === filters.name);
    // }

    // if (filters.range) {
    //   const [checkInDate] = filters.range.split(' to ');
    //   const startDate = new Date(checkInDate);
    //   aux = aux.filter(item => isReservationWithinDateRange(item, startDate));
    // }

    // if (filters.description && filters.description.length > 0) {
    //   aux = aux.filter(item => item?.status === filters.description[0]);
    // }

    // apply services filter
    // if (filters.services && filters.services.length > 0) {
    //   aux = aux.filter(
    //     item => item?.service?.service_type === filters.services[0]
    //   );
    // }

    // Update the country filter to use the standardized name
    // if (filters.countries.length > 0) {
    //   aux = aux.filter(item => {
    //     const hotelAddress = item?.service?.address;
    //     if (hotelAddress) {
    //       const country = hotelAddress
    //         .substring(hotelAddress.lastIndexOf(',') + 1)
    //         .trim();
    //       const standardizedCountry = countryNameMapping[country] || country;
    //       return filters.countries.includes(standardizedCountry);
    //     }
    //     return false;
    //   });
    // }
    // remove pending reservations with expired check-in date
    // const today = new Date();
    // aux = aux.filter(item => {
    //   const checkInDate = new Date(
    //     item?.reservation?.search_parameters?.check_in
    //   );
    //   return (
    //     item.reservation?.reservation_status?.description !== 'Pending' ||
    //     checkInDate >= today
    //   );
    // });

    // get unique names for dropdown
    const uniqueNames = Array.from(
      new Set(
        reservations.map((item: any) => {
          if (item?.main_contact && item?.main_contact.length > 0) {
            const firstContact = item.main_contact[0];
            return `${firstContact?.first_name} ${firstContact?.last_name}`;
          }
          return '';
        })
      )
    );
    //setReservationsResults(aux);
    setNames(uniqueNames);
  }, [filters]);

  // add event listener to document
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dateRangeContainer = document.querySelector(
        '.date-range-container'
      );
      if (
        dateRangeContainer &&
        !dateRangeContainer.contains(event.target as Node)
      ) {
        setShowDateRange(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (reservationDetails) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [reservationDetails]);

  const handleClickOutside = (event: any) => {
    const dateRangeContainer = document.querySelector('.calendar-crm');

    if (dateRangeContainer && !dateRangeContainer.contains(event.target)) {
      setShowDateRange(false);
    }
  };

  const renderCountriesValue = (value: string[]) => {
    return (
      <span className="rs-picker-toggle-value items-center">
        <span className="rs-picker-value-list">
          {value.map(countryId => {
            const country = countries.find(c => c.id === countryId);
            return (
              <span
                key={countryId}
                className="rounded-[14px] bg-[#ffffff5c] px-3 mr-1 h-[22px] inline-flex"
              >
                {country?.country_name[0]}
              </span>
            );
          })}
        </span>
        {/*<span className="rs-picker-value-count">{value.length}</span>*/}
      </span>
    );
  };

  function handleDownloadCSV() {
    // Convert the reservationsResults array into a 2D array (rows and columns)
    const rows = reservationsResults.map((reservation: any) => {
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
          (total: any, room: any) =>
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

  const obtainDates = (reservation: any) => {
    const transformToDate = (dateString: string) => {
      const date = moment(dateString);
      let formattedDate = date.format('DD.MM.YY');

      return formattedDate;
    };

    switch (reservation?.service?.service_type) {
      case 'hotels':
        return (
          <div>
            {transformToDate(reservation?.service?.check_in)} -{' '}
            {transformToDate(reservation?.service?.check_out)}
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

      case 'Flights':
        return (
          <p>
            <span>
              {transformToDate(
                reservation?.service?.selected_flight?.flights[0]
                  ?.departure_details.departure_date
              )}
            </span>
            <span>
              {reservation?.service?.selected_flight?.flights.length > 1 &&
                ' - '}{' '}
            </span>
            <span>
              {reservation?.service?.selected_flight?.flights.length > 1 &&
                transformToDate(
                  reservation?.service?.selected_flight?.flights[
                    reservation?.service?.selected_flight.flights.length - 1
                  ]?.arrival_details.arrival_date
                )}
            </span>
          </p>
        );
      default:
        return <div>no date to show</div>;
    }
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
              {reservation?.main_contact.length}
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

  const findFlagByCountry = (country: string) => {
    const countryObj = iconArrayCountries.find(obj => obj.country === country);
    if (countryObj) {
      return `${countryObj.flag} ${country}`;
    }
    return country;
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

  const WebView: any = ({ reservationsResults }: any) => {
    if (reservationsResults.lenth === 0) {
      return (
        <div className="flex flex-col gap-y-3 items-center justify-center">
          <label className="text-[#ffffffb3] text-[14px] font-[600]">
            You dont have any reservations right now
          </label>
        </div>
      );
    }

    return reservationsResults.map((reservation: any) => {
      return (
        reservation.status !== 'expired' && (
          <FlexboxGrid
            key={reservation.booking_id}
            className="bg-[#fdfdfd14] border-[.6px] border-[#0000000a] rounded-[12px] h-[70px] px-[15px] text-white items-center text-[13px] font-[510] mb-[10px] cursor-pointer overflow-hidden grid grid-cols-8"
            onClick={() =>
              handleShowReservation(
                reservation?.service?.id_meilisearch,
                reservation
              )
            }
          >
            <FlexboxGrid.Item>
              <div className="mainContact  gap-2 flex flex-row items-center px-[15px] text-center">
                <Image
                  className="rounded-full bg-black"
                  src={userDefaultIMG}
                  width={32}
                  height={32}
                  alt="reservation"
                />

                <div>
                  <div>
                    {Array.isArray(reservation?.main_contact) ? (
                      <div>
                        {reservation?.main_contact[0]?.first_name}{' '}
                        {reservation?.main_contact[0]?.last_name}
                      </div>
                    ) : (
                      <div>
                        {reservation?.main_contact?.first_name}{' '}
                        {reservation?.main_contact?.last_name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item>
              <div className="country px-[15px] text-center">
                {handleShowCountry(reservation)}
              </div>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item className="status pl-10">
              {reservation?.status_trip_reservation || reservation?.status}
            </FlexboxGrid.Item>

            <FlexboxGrid.Item>
              <div className="someDate flex align-center justify-center">
                <Image src={calendarIcon} alt="calendar" className="mr-2" />
                {obtainDates(reservation)}
              </div>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item>
              <div className="activity flex pl-11 gap-3 ">
                {handleAssistansToActivity(reservation)}
              </div>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item>
              <div className="contact flex gap-[6px]">
                <div className="flex gap-5 relative">
                  <button
                    className="bg-[#D9D9D9] w-6 h-6 flex items-center justify-center rounded-full bg-opacity-[.1]"
                    onClick={() =>
                      handlePhone(reservation?.main_contact?.phone)
                    }
                  >
                    <Image
                      src={resphoneIcon}
                      width={13}
                      height={13}
                      alt="callIcon"
                    />
                  </button>

                  <button
                    className="bg-[#D9D9D9] w-6 h-6 flex items-center justify-center rounded-full bg-opacity-[.1]"
                    onClick={() =>
                      handleEmail(reservation?.main_contact?.email)
                    }
                  >
                    <Image
                      src={resmessageIcon}
                      width={13}
                      height={13}
                      alt="emailIcon"
                    />
                  </button>
                  <button
                    className="bg-[#D9D9D9] w-6 h-6 flex items-center justify-center rounded-full bg-opacity-[.1]"
                    onClick={() =>
                      handleWhatsApp(reservation?.main_contact?.phone)
                    }
                  >
                    <Image
                      src={restextIcon}
                      width={13}
                      height={13}
                      alt="WhatsappIcon"
                    />
                  </button>
                </div>
              </div>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item>
              <div className="rooms flex gap-2 px-[15px] justify-center">
                {handleTravelerAndRooms(reservation)}
              </div>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item className="total pl-10">
              ${' '}
              {Math.round(reservation?.payments?.total)
                ? Math.round(reservation?.payments?.total)
                : 0}
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )
      );
    });
  };

  return (
    <>
      <ModalReservationDetails
        open={reservationDetails}
        onClose={() => setReservationDetails(false)}
        reservationDets={hotelDetails}
        res_id={reservationID}
      />

      <SEO title={t('reservations.title')} />

      <div className="px-[15px] md:px-0">
        <h2 className="mb-[17px] text-white text-[32px] font-[650] mt-[10px] scale-y-[0.8] md:mt-[35px] md:font-[760]">
          {t('reservations.title')}
        </h2>

        <div className="flex flex-col-reverse justify-between items-center lg:flex-row">
          <HeaderCRM active={'Reservations'} />
          <div
            className="flex gap-3 items-center text-white text-base ml-auto lg:ml-0 lg:px-0"
            onClick={handleDownloadCSV}
          >
            <Image src={download} height={18} width={18} alt="download" />
            <button>{t('reservations.download')}</button>
          </div>
        </div>

        {/* TODO
         * MOBILE section can be refactored
         * Either a seperated component or
         * Best option: unify with component already created for web
         * Comp can be internal like now but should be external and just imported
         * check the seting of states after clicking stauts or any filter and no option selected
         *
         * */}

        {/* Mobile */}
        <div
          className={`${
            reservationsResults.length === 0 &&
            'bg-[#fdfdfd0d] border-[.6px] border-[#0000000a] rounded-[12px] flex items-center justify-center'
          } scroll mt-[15px] mb-[57px] min-h-[calc(100vh-233px)] lg:h-[calc(100vh-347px)] sm:hidden md:hidden lg:hidden xl:hidden`}
        >
          {reservationsResults.length === 0 ? (
            <div className="flex flex-col gap-y-3 items-center justify-center">
              <label className="text-[#ffffffb3] text-[14px] font-[600]">
                You dont have any reservations right now
              </label>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-y-4 mt-4 ">
              {reservationsResults.map(
                (reservation: any) =>
                  reservation.status !== 'expired' && (
                    <div
                      key={reservation.agent_id}
                      className="w-full bg-[#141414] rounded-[20px] p-4"
                      onClick={() =>
                        handleShowReservation(
                          reservation?.service?.id_meilisearch,
                          reservation
                        )
                      }
                    >
                      <div className="flex items-center gap-3 border-b border-b-white/[.1] pb-4 text-white">
                        <Image
                          className="rounded-full bg-black"
                          src={userDefaultIMG}
                          width={32}
                          height={32}
                          alt="reservation"
                        />
                        <div>
                          <label className="text-[16px] font-[510]">
                            {reservation?.main_contact[0]?.first_name +
                              ' ' +
                              reservation?.main_contact[0]?.last_name || 'N/A'}
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-[18px] mt-4">
                        <div className="flex justify-between">
                          <label className="text-[#808080] text-sm font-normal">
                            {t('reservations.triprang')}
                          </label>
                          <label className="text-white text-[13px] font-normal flex flex-row">
                            <Image
                              src={calendarIcon}
                              alt="calendar"
                              className="mr-2"
                            />
                            {obtainDates(reservation)}
                          </label>
                        </div>

                        <div className="flex justify-between">
                          <label className="text-[#808080] text-sm font-normal">
                            {t('reservations.tripstats')}
                          </label>
                          <label className="QUE ERES text-white text-[13px] font-normal">
                            {reservation?.status_trip_reservation}
                          </label>
                        </div>

                        <div className="flex justify-between">
                          <label className="text-[#808080] text-sm font-normal">
                            {t('reservations.travelers')}
                          </label>

                          <div className="flex pl-11 gap-3">
                            <span className="flex gap-2 text-white">
                              {reservation?.service?.search_parameters?.rooms.reduce(
                                (total: any, room: any) =>
                                  total +
                                  room.number_of_adults +
                                  (room.children_age?.length ?? 0),
                                0
                              )}{' '}
                              <Image
                                src={resUserIcon}
                                width={12}
                                height={12}
                                alt={'door'}
                              />
                            </span>
                            <span className="flex gap-2 text-white">
                              {
                                reservation?.service?.search_parameters?.rooms
                                  .length
                              }
                              <Image
                                src={resDoorIcon}
                                width={12}
                                height={12}
                                alt={'door'}
                              />
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-row justify-between gap-3">
                          <label className="text-[#808080] text-sm font-normal">
                            {t('reservations.contacts')}
                          </label>
                          <div className="flex gap-2.5 relative">
                            <button
                              className="bg-[#D9D9D9] w-[26px] h-[26px] flex items-center justify-center rounded-full bg-opacity-[.1]"
                              onClick={() =>
                                handlePhone(reservation?.main_contact?.phone)
                              }
                            >
                              <Image
                                src={resphoneIcon}
                                width={13}
                                height={13}
                                alt="callIcon"
                              />
                            </button>

                            <button
                              className="bg-[#D9D9D9] w-[26px] h-[26px] flex items-center justify-center rounded-full bg-opacity-[.1]"
                              onClick={() =>
                                handleEmail(reservation?.main_contact?.email)
                              }
                            >
                              <Image
                                src={resmessageIcon}
                                width={13}
                                height={13}
                                alt="emailIcon"
                              />
                            </button>
                            <button
                              className="bg-[#D9D9D9] w-[26px] h-[26px] flex items-center justify-center rounded-full bg-opacity-[.1]"
                              onClick={() =>
                                handleWhatsApp(reservation?.main_contact?.phone)
                              }
                            >
                              <Image
                                src={restextIcon}
                                width={13}
                                height={13}
                                alt="WhatsappIcon"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-row justify-between gap-3">
                          <label className="text-[#808080] text-sm font-normal">
                            {t('reservations.services')}
                          </label>
                          <div className="flex gap-5">
                            <button className="bg-[#D9D9D9] w-6 h-6 flex items-center justify-center rounded-full bg-opacity-[.1]">
                              <Image
                                src={hotelIconColor}
                                width={13}
                                height={13}
                                alt="reservation"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
        {/*End of  Mobile */}

        <div className="flex flex-col mt-5 xs:hidden xs:h-[150px]">
          <div className="HEADER filter h-[46px] rounded-xl bg-[#242424] pl-8  text-white text-base mb-[14px]">
            <FlexboxGrid className="grid grid-cols-8 ">
              <FlexboxGrid.Item>
                <TagPicker
                  size="lg"
                  placement="bottomStart"
                  onChange={handleChangeFilterName}
                  placeholder={t('reservations.name')}
                  className="select-picker-travelers w-full h-[46px!important]"
                  data={names.map(name => ({
                    label: name,
                    value: name,
                  }))}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                  }}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item>
                <CheckPicker
                  value={filters.countries}
                  onChange={value =>
                    handleChangeFilterCountries(value, countries)
                  }
                  placeholder={t('reservations.country')}
                  renderValue={renderCountriesValue}
                  className="check-picker-traveler w-full h-[46px!important]"
                  data={countries.map(country => ({
                    label: country.country_name,
                    value: country.id,
                  }))}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item>
                <Whisper
                  trigger="click"
                  placement="bottomStart"
                  speaker={
                    <Popover arrow={false} className="status-popover">
                      <RadioGroup
                        name="radios-status"
                        value={filters.description.join(',')}
                        onChange={handleChangeFilterStatus}
                      >
                        <Radio value="0">{t('travelers.all-status')}</Radio>
                        {reservation_status
                          .filter(elem => elem.slug !== '')
                          .map(item => (
                            <Radio key={item.id} value={item.id}>
                              {item.description}
                            </Radio>
                          ))}
                      </RadioGroup>
                    </Popover>
                  }
                >
                  <button
                    type="button"
                    id="button-travelers"
                    className="flex gap-2 justify-between items-center w-full text-[15px] text-white h-[46px] px-[15px]"
                    onClick={() => setImgDirection(!imgDirection)}
                  >
                    {t('reservations.tripstats')}

                    <Image
                      alt="icon"
                      src={down}
                      className={`${imgDirection && 'rotate-180'}`}
                    />
                  </button>
                </Whisper>
              </FlexboxGrid.Item>

              <FlexboxGrid.Item className="relative z-20">
                <button
                  className="flex gap-2 justify-between items-center w-full text-base text-white h-12 px-4"
                  onClick={() => setShowDateRange(!ShowDateRange)}
                >
                  {t('reservations.triprang')}
                  <Image
                    alt="icon"
                    src={down}
                    className={`${ShowDateRange && 'transform rotate-180'}`}
                  />
                </button>
                {!ShowDateRange ? null : (
                  <div className="calendar-crm w-full flex justify-center mt-4">
                    <DatePicker
                      selected={startDate}
                      onChange={(
                        dates: [Date | null, Date | null],
                        event: SyntheticEvent<any, Event> | undefined
                      ) => {
                        setStartDate(dates[0]);
                        setEndDate(dates[1]);
                        handleChangeFilterRange(dates);
                      }}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                      minDate={null}
                    />
                  </div>
                )}
              </FlexboxGrid.Item>

              <FlexboxGrid.Item>
                <label className="flex gap-2 justify-between items-center w-full text-[15px] text-white h-[46px] px-[15px]">
                  {t('reservations.travelers')}
                </label>
              </FlexboxGrid.Item>

              <FlexboxGrid.Item>
                <label className="text-white flex items-center h-[44px] px-[15px]">
                  {' '}
                  {t('reservations.contacts')}
                </label>
              </FlexboxGrid.Item>

              <FlexboxGrid.Item>
                <Whisper
                  trigger="click"
                  placement="bottomStart"
                  speaker={
                    <Popover arrow={false} className="status-popover">
                      <CheckboxGroup
                        name="checkbox-services"
                        value={selectedServices} // Debe ser un array para manejar múltiples selecciones
                        onChange={handleChangeFilterServices}
                      >
                        <Checkbox value="0">
                          {t('travelers.all-status')}
                        </Checkbox>
                        <Checkbox value="1">Flights</Checkbox>
                        <Checkbox value="2">Suppliers</Checkbox>
                        <Checkbox value="3">Hotels</Checkbox>
                      </CheckboxGroup>
                    </Popover>
                  }
                >
                  <button
                    type="button"
                    id="button-travelers"
                    className="flex gap-2 justify-between items-center w-full text-[15px] text-white h-[46px] px-[15px]"
                  >
                    {t('reservations.services')}
                    <Image alt="icon" src={down} className="" />
                  </button>
                </Whisper>
              </FlexboxGrid.Item>

              <label className="text-white flex justify-between items-center h-[44px] px-[15px]">
                {t('stays.price')}
              </label>
            </FlexboxGrid>
          </div>

          <div className="wholeList h-[calc(100vh-347px)] overflow-hidden overflow-y-auto scrollbar-hide">
            <div
              className={`${
                reservationsResults.length === 0 &&
                'bg-[#fdfdfd0d] border-[.6px] border-[#0000000a] rounded-[12px] flex items-center justify-center'
              } scroll overflow-y-auto mt-[15px] mb-[57px] h-[calc(100vh-347px)] pr-2 -mr-3`}
            >
              <WebView reservationsResults={reservationsResults} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Reservations.getLayout = getLayout;

export default Reservations;
