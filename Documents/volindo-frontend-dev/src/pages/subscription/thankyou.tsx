import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { NextPageWithLayout } from '@typing/types';
import { getLayout } from '@layouts/MainLayout';

import BigPin from '@icons/marketingIcons/big-pin.svg';
import whitelabellogoBigger from '@icons/whitelabellogoBigger.svg';

import styles from '@styles/marketing.module.scss';

import { SEO, ThankYouContainer } from '@components';
import config from '@config';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

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

const ThanksSubscriptionPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const { update } = useSession();

  const checkWL = config.WHITELABELNAME === 'Volindo';
  const checkIconWL = checkWL ? BigPin : whitelabellogoBigger;
  const checkButtonsWL = checkWL
    ? styles.thankyou__content__buttons
    : styles.thankyou__content__buttonsWL;

  useEffect(() => {
    update();

    return () => {
      update();
    };
  }, []);

  return (
    <section className={styles.thankyou}>
      <SEO title={t('subscription.thankyou.page')} />
      <ThankYouContainer
        title={t('subscription.thankyou.title')}
        description={t('subscription.thankyou.subtitle')}
        buttonText={t('subscription.thankyou.main')}
        redirectPath={'/'}
      />
    </section>
  );
};

ThanksSubscriptionPage.getLayout = getLayout;

export default ThanksSubscriptionPage;
