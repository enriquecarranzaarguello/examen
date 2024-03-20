import { useState, useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';

import { useAppSelector, useAppDispatch, setClearErrorsStatus } from '@context';

import { useVariableValue } from '@devcycle/react-client-sdk';

import { useRouter } from 'next/router';
import { NextPageWithLayout } from '@typing/types';

import style from '@styles/principal.module.scss';

import {
  Footer,
  Header,
  RegisterModal,
  SEO,
  VerticalSelector,
  ModalError,
  ModalNotStays,
  HotelSearch,
} from '@components';

const FlightsSearch = dynamic(
  () => import('../containers/flights/FlightsSearchContainer'),
  {
    ssr: false,
  }
);

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}

const Home: NextPageWithLayout = ({}: InferGetStaticPropsType<
  typeof getStaticProps
>) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const agentIsSubcribed = useAppSelector(
    state => state.agent.agent_is_subscribed
  );
  const notAvailableResultsError = useAppSelector(
    state => state.hotels.notHotelAvailable
  );
  const socketError = useAppSelector(state => state.hotels.socketError);

  const [tab, setTab] = useState('Stays');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const paywall = useVariableValue('paywall', false);

  // HOME
  const renderTab = () => {
    switch (tab) {
      case 'Stays':
        return <HotelSearch hotelData={''} searchType="" hotelId="" />;
        break;
      case 'Flights':
        return (
          <>
            <FlightsSearch redirect={true} />
          </>
        );
        break;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (router && router.pathname === '/signupnow') {
      redirectToSignUp();
    }
  }, [router.pathname]);

  const handleChangeTab = (tab: string) => {
    if (!session) {
      redirectToSignUp();
      return;
    } else if (!paywall) {
      setTab(tab);
      return;
    } else if (!agentIsSubcribed) {
      setRegisterModalOpen(true);
      return;
    }

    if (tab === 'Suppliers') {
      router.push('/suppliers');
      return;
    }
    setTab(tab);
  };

  const handleCloseRegModal = () => {
    setRegisterModalOpen(false);
  };

  const redirectToSignUp = () => {
    router.push('/signin');
  };

  const triggerHandleTab = (tab: string) => {
    handleChangeTab(tab);
  };

  const handleCloseModal = () => {
    dispatch(setClearErrorsStatus());
  };

  useEffect(() => {
    dispatch(setClearErrorsStatus());
  }, []);

  return (
    <>
      <RegisterModal open={registerModalOpen} onClose={handleCloseRegModal} />
      <SEO title={t('SEO.dashboard')} />
      <ModalError open={socketError} onClose={handleCloseModal} />
      <ModalNotStays
        open={notAvailableResultsError}
        onClose={handleCloseModal}
      />
      <div className={style.header}>
        <Header />
      </div>
      <div className={style.main}>
        <div className={style.main_principalContainer}>
          <h1 className={style.main_principalContainer_title}>
            <span className={`phrase-dot-${i18n.language}`}>
              {t('home.phrase-1')}
            </span>{' '}
            {t('home.home-phrase')}
          </h1>
          <VerticalSelector triggerHandle={triggerHandleTab} />
          {renderTab()}
        </div>
      </div>
      <Footer />
    </>
  );
};

// Home.getLayout = getLayout;

export default Home;
