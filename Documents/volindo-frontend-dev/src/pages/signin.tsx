import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import nextI18NextConfig from 'next-i18next.config.js';
import { useTranslation } from 'next-i18next';

import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { SignInStati, SEO } from '@components';
import { useRouter } from 'next/router';
import DashboardSlider from 'src/components/DashboardSlider';

import { NextPageWithLayout } from '@typing/types';
import { getLayout } from '@layouts/MainLayout';

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
  const { t } = useTranslation();
  const [tab, setTab] = React.useState('Stays');

  const [windowSize, setWindowSize] = React.useState(0);
  React.useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const router = typeof window !== 'undefined' && useRouter();

  return (
    <>
      <SEO title={'Sign in'} />
      <div className="max-w-[1400px] mx-auto overflow-x-hidden h-[calc(100vh-72px)]">
        <div className="h-full">
          <div className="h-full flex flex-col items-center justify-center md:flex-row">
            <div className="bg-black rounded-t-[25px] h-full w-full px-[20px] md:w-2/5 md:px-0 xl:mr-[96px] flex-1 flex items-center justify-center">
              {windowSize > 768 && tab === 'Suppliers' && router && (
                <button
                  hidden
                  className="text-white flex justify-center md:mr-[784px] w-full"
                  onClick={() => router.push('/suppliers/add_suppliers')}
                >
                  + Add suppliers
                </button>
              )}
              <SignInStati />
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
              }}
              className="hidden xl:block overflow-hidden h-full w-full xl:h-[650px] rounded-[48px] max-w-[759px]"
            >
              <DashboardSlider />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Home.getLayout = getLayout;

export default Home;
