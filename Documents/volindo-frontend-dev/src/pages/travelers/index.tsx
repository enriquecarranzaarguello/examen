import { useEffect, useState } from 'react';
import axios from 'axios';
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@context';
import userDefaultIMG from '@icons/userDefaultIMG.svg';
import config from '@config';

import style from '@styles/crm/travelers/travelers.module.scss';

import type { GetServerSideProps } from 'next';
import type { TravelersProps } from '@typing/proptypes';
import type { TravelerDataType } from '@typing/types';
import type { NextPageWithLayout, TravelersFilters } from '@typing/types';
import type { ItemDataType } from 'rsuite/esm/@types/common';

import addIcon from '@icons/add.svg';
import downloadIcon from '@icons/download.svg';
import filterIcon from '@icons/filterMobile.svg';
// import printIcon from '@icons/print.svg';

import {
  ModalError,
  ModalTraveler,
  ModalFilters,
  HeaderCRM,
  TravelersFilter,
  TravelerCard,
  SEO,
  LoadingSpinner,
} from '@components';
import { authOptions } from '../api/auth/[...nextauth]';
import { getLayout } from '@layouts/MainLayout';

import countryDataEN from '../../../public/data/countries/en/countriesData.json';
import countryDataES from '../../../public/data/countries/es/countriesData.json';

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
  // Todo: check refactor of api calls
  const countries = context.locale === 'en' ? countryDataEN : countryDataES;

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
        ['common'],
        nextI18nextConfig
      )),
      countries,
    },
  };
};

const Travelers: NextPageWithLayout<TravelersProps> = ({}: TravelersProps) => {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [travelers, setTravelers] = useState<any[]>([]);
  const [prevLang, setPrevLang] = useState(i18n.language);
  const [travelersResult, setTravelersResult] = useState<TravelerDataType[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>({
    name: '',
    countries: '',
    status: '',
    typecast: '',
    referral: '',
    group: '',
  });

  useEffect(() => {
    setLoading(true);
    const getTravelers = async () => {
      try {
        const response = await axios.get(`${config.api}/travelers`, {
          headers: {
            Authorization: 'Bearer ' + session?.user.id_token || '',
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          setTravelersResult(response.data);
          setTravelers(response.data);
          setLoading(false);
        }
      } catch (error) {
        setOpenError(true);
      }
    };

    if (session?.user.id_token) {
      getTravelers();
    }
  }, [session]);

  const handleChangeFilterName = (value: string) => {
    setFilters({ ...filters, name: value });
  };

  const handleChangeFilterCountries = (value: string) => {
    setFilters({ ...filters, countries: value });
  };
  const handleChangeFilterGroup = (value: string) => {
    setFilters({ ...filters, group: value });
  };

  const handleChangeFilterReferral = (value: string | number) => {
    let sourceValue;
    if (value !== '') {
      switch (value) {
        case 'family/friend':
          sourceValue = 'family/friend';
          break;
        case 'online_campaigns':
          sourceValue = 'online_campaigns';
          break;
        case 'off-line_campaigns':
          sourceValue = 'off-line_campaigns';
          break;
        case 'referral':
          sourceValue = 'referral';
        default:
          sourceValue = 'All';
      }
      setFilters({ ...filters, referral: sourceValue });
    }
  };

  const handleChangeFilterTypecast = (value: string | number) => {
    let sourceValue;
    if (value !== '') {
      switch (value) {
        case 'Honeymoon':
          sourceValue = 'Honeymoon';
          break;
        case 'Just_Traveler':
          sourceValue = 'Just Traveler';
          break;
        case 'Low_cost':
          sourceValue = 'Low cost';
          break;
        case 'Family':
          sourceValue = 'Family';
          break;
        case 'Bachelor_party':
          sourceValue = 'Bachelor Party';
          break;
        case 'Company_trip':
          sourceValue = 'Company trip';
          break;
        case 'Inactive':
          sourceValue = 'Inactive';
          break;
        case 'New':
          sourceValue = 'New';
          break;
        case 'Business_Trip':
          sourceValue = 'Business Trip';
          break;
        default:
          sourceValue = 'All';
      }
      setFilters({ ...filters, typecast: sourceValue });
    }
  };

  useEffect(() => {
    let aux = travelersResult;

    if (filters.name && filters.name !== null) {
      aux = aux.filter(item => item?.data_traveler?.fullName === filters?.name);
    }

    if (filters.countries && filters.countries !== null) {
      aux = aux.filter(
        item => item.data_traveler.country === filters.countries
      );
    }

    if (filters.typecast && filters.typecast !== 'All') {
      aux = aux.filter(
        item => item.data_traveler.travelerTypecast === filters.typecast
      );
    }

    if (filters.referral && filters.referral !== 'All') {
      aux = aux.filter(
        item => item.data_traveler.referral === filters.referral
      );
    }

    if (filters.group && filters.group !== null) {
      aux = aux.filter(item => item.data_traveler.addToGroup === filters.group);
    }

    if (
      filters.name === '' &&
      filters.name === null &&
      filters.countries === '' &&
      filters.countries === null &&
      filters.typecast === 'All' &&
      filters.referral === 'All'
    ) {
      return setTravelers(travelersResult);
    }

    return setTravelers(aux);
  }, [filters]);

  const downloadCSV = () => {
    // Convert array of objects to CSV string
    const csvData = [
      ['Name', 'Country', 'Status', 'Phone Number', 'Email', 'Services'],
      ...travelersResult.map(traveler => [
        `${traveler?.data_traveler?.fullName}`,
        traveler?.data_traveler?.country,
        '',
        traveler?.data_traveler?.phoneNumber,
        traveler?.data_traveler?.email,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    // Create an <a> element to trigger the download
    const link = document.createElement('a');
    link.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`
    );
    link.setAttribute('download', 'travelers.csv');

    // Trigger the download
    link.click();
  };

  useEffect(() => {
    setPrevLang(i18n.language);
  }, [i18n.language]);

  const renderFilters = () => {
    return (
      <>
        <div className={style.filter_mobile}>
          <button
            onClick={() => setOpen(true)}
            className={style.filter_mobile_addTraveler}
          >
            <Image src={addIcon} alt="Filter" width={30} height={30} />
            <span>{t('travelers.add_traveler')}</span>
          </button>
          <div className={style.filter_mobile_actions}>
            <button onClick={downloadCSV}>
              <Image
                src={downloadIcon}
                alt="Download CSV"
                width={25}
                height={25}
              />
            </button>

            {/* <button disabled={true}>
              <Image
                src={printIcon}
                alt="Print Travelers"
                width={25}
                height={25}
              />
            </button> */}

            <button>
              <Image
                src={filterIcon}
                alt="Filter"
                width={25}
                height={25}
                onClick={() => setOpenFilters(true)}
              />
            </button>
          </div>
        </div>
        <div className={style.filter_desktop}>
          <button
            className={style.filter_desktop_button}
            onClick={() => setOpen(true)}
          >
            <Image src={addIcon} alt="Filter" width={30} height={30} />
            <span className={style.filter_desktop_button_text}>
              {t('travelers.add_traveler')}
            </span>
          </button>
          <button className={style.filter_desktop_button} onClick={downloadCSV}>
            <Image
              src={downloadIcon}
              alt="Download CSV"
              width={18}
              height={18}
            />
            <span className={style.filter_desktop_button_text}>
              {t('travelers.download')}
            </span>
          </button>

          {/* <button className={style.filter_desktop_button} disabled={true}>
            <Image src={printIcon} alt="Download CSV" width={18} height={18} />
            <span className={style.filter_desktop_button_text}>
              {t('travelers.print')}
            </span>
          </button> */}
        </div>
      </>
    );
  };

  return (
    <>
      <ModalError open={openError} onClose={() => setOpenError(false)} />
      {open && (
        <ModalTraveler
          open={open}
          onClose={() => setOpen(false)}
          traveler={{}}
        />
      )}
      {openFilters && (
        <ModalFilters
          open={openFilters}
          onClose={() => setOpenFilters(false)}
          travelers={travelers}
          handleChangeFilterName={handleChangeFilterName}
          handleChangeFilterCountries={handleChangeFilterCountries}
          handleChangeFilterTypecast={handleChangeFilterTypecast}
          handleChangeFilterReferral={handleChangeFilterReferral}
        />
      )}

      <div className={style.travelers_container}>
        <SEO title={t('travelers.title')} />

        <h2 className={style.travelers_container_title}>
          {t('travelers.title')}
        </h2>

        <div className={style.travelers_container_header}>
          <HeaderCRM active={'Travelers'} />
          {renderFilters()}
        </div>

        {/************** FILTERS **************/}
        <TravelersFilter
          travelers={travelers}
          handleChangeFilterName={handleChangeFilterName}
          handleChangeFilterCountries={handleChangeFilterCountries}
          handleChangeFilterTypecast={handleChangeFilterTypecast}
          handleChangeFilterReferral={handleChangeFilterReferral}
          handleChangeFilterGroup={handleChangeFilterGroup}
        />
        {/* */}
        {/************ END FILTERS ************/}
        {loading && (
          <div className={style.travelers_container_noData}>
            <LoadingSpinner size="big" />
          </div>
        )}

        {travelers.length === 0 && !loading && (
          <div className={style.travelers_container_noData}>
            <h2 className={style.travelers_container_noData_title}>
              {t('travelers.not-data')}
            </h2>
          </div>
        )}
        {travelers.length > 0 && (
          <div className={style.travelers_container_table}>
            {travelers.map((traveler: any) => (
              <TravelerCard
                id={traveler.traveler_id}
                photo={traveler.photo}
                traveler={traveler.data_traveler}
                key={traveler.traveler_id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

Travelers.getLayout = getLayout;

export default Travelers;
