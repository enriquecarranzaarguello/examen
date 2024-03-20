import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';

import { NextPageWithLayout } from '@typing/types';
import { getLayout } from '@layouts/MarketingLayout';

import styles from '@styles/marketing.module.scss';

import { SEO } from '@components';
import { useTranslation } from 'react-i18next';
import {
  NewAdFormSection,
  NewAdPreviewSection,
  TitleEditable,
} from '@components/marketing';

import { NewAdFormContextProvider } from '@components/marketing/adManager/context/NewAdContext';

export const getServerSideProps = async ({
  locale,
  req,
  res,
}: GetServerSidePropsContext) => {
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
        nextI18nextConfig
      )),
      session,
    },
  };
};

const NewAdPage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  return (
    <section className={`${styles.adManagerAddNew}`}>
      <SEO title={t('marketing.adManager.new.title')} />
      <NewAdFormContextProvider>
        <TitleEditable />
        <div className={styles.layoutAd}>
          <NewAdFormSection />
          <NewAdPreviewSection />
        </div>
      </NewAdFormContextProvider>
      {/* hello world */}
    </section>
  );
};

NewAdPage.getLayout = getLayout;

export default NewAdPage;
