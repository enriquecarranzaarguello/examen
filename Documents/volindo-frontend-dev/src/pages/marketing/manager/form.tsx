import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';

import NewAdPage from './new';

import { NextPageWithLayout } from '@typing/types';
import { getLayout } from '@layouts/MarketingLayout';

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

const AdManagerPage: NextPageWithLayout = () => {
  return (
    // TEMPORAL (WIP)
    <div className="text-white font-medium text-lg">
      <br />
      <NewAdPage />
    </div>
  );
};

AdManagerPage.getLayout = getLayout;

export default AdManagerPage;
