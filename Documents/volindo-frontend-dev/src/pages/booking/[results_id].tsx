import React, { useEffect, useState } from 'react';
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config.js';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import type { GetServerSidePropsContext } from 'next';
import { NextPageWithLayout } from '@typing/types';

import { getLayout } from '@layouts/MainLayout';
import { setClearErrorsStatus, useAppDispatch, useAppSelector } from '@context';
import {
  Stays,
  LocationTabs,
  SEO,
  ModalError,
  ModalNotStays,
  SearchMobileForm,
  HotelSearch,
  HotelFilters,
} from '@components';

export async function getServerSideProps({
  locale,
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(req, res, authOptions);

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
        locale || 'en',
        ['common'],
        nextI18NextConfig
      )),
      session,
    },
  };
}

const Booking: NextPageWithLayout = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [windowSize, setWindowSize] = useState(0);

  const socketError = useAppSelector(state => state.hotels.socketError);
  const notAvailableResultsError = useAppSelector(
    state => state.hotels.notHotelAvailable
  );
  const hotelSearch = useAppSelector(state => state.hotels);
  const filters = useAppSelector(state => state.hotels.searchParams);
  const catalogues = useAppSelector(state => state.hotels.catalogues);
  const totalPeticions = useAppSelector<number>(
    state => state.hotels.loadingTotal
  );

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // TODO check variable
    if (
      router.query.results_id &&
      typeof router.query.results_id === 'string' &&
      filters
    ) {
    } else {
      router.push('/', '/', { locale: i18n.language });
    }
  }, []);

  const handleCloseModal = () => {
    dispatch(setClearErrorsStatus());
  };

  return (
    session && (
      <>
        {socketError && (
          <ModalError open={socketError} onClose={handleCloseModal} />
        )}

        {notAvailableResultsError && (
          <ModalNotStays
            open={notAvailableResultsError}
            onClose={handleCloseModal}
          />
        )}

        <SEO title={t('SEO.hotel_search')} />

        <div className="flex flex-col justify-between items-center xl:flex-row gap-[18px]">
          <LocationTabs activeTab="Stays" className="hidden lg:flex" />

          <SearchMobileForm
            toggleMenu={toggleMenu}
            catalogues={catalogues}
            filters={hotelSearch.searchParams}
          />

          {windowSize < 1024 && isOpen ? (
            <>
              {/* Mobile view */}
              <div className="w-full">
                {
                  <>
                    <HotelSearch
                      hotelData={''}
                      searchType=""
                      hotelId=""
                      source="_booking"
                    />

                    <HotelFilters
                      source="stays"
                      totalPeticions={totalPeticions}
                    />
                  </>
                }
              </div>
            </>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:flex w-full">
                {
                  <HotelSearch
                    hotelData={''}
                    searchType=""
                    hotelId=""
                    source="_booking"
                  />
                }
              </div>
            </>
          )}
        </div>

        <Stays />
      </>
    )
  );
};

Booking.getLayout = getLayout;

export default Booking;
