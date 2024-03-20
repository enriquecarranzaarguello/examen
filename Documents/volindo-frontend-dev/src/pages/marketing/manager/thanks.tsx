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

import { SEO } from '@components';
import config from '@config';

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

const ThanksPage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  const checkWL = config.WHITELABELNAME === 'Volindo';
  const checkIconWL = checkWL ? BigPin : whitelabellogoBigger;
  const checkThanksTitleWL = checkWL
    ? t('marketing.adManager.thankyou.title')
    : t('marketing.adManager.thankyou.title-flyway');
  const checkButtonsWL = checkWL
    ? styles.thankyou__content__buttons
    : styles.thankyou__content__buttonsWL;

  return (
    <section className={styles.thankyou}>
      <SEO title={t('marketing.adManager.thankyou.page')} />
      <div className={styles.thankyou__content}>
        <div className={styles.thankyou__image}>
          <Image src={checkIconWL} width={400} alt="Pin" />
        </div>
        <div className={styles.thankyou__content__info}>
          <h1>{checkThanksTitleWL}</h1>
          <p>{t('marketing.adManager.thankyou.subtitle')}</p>
          <div className={checkButtonsWL}>
            <Link href="/marketing/manager/new">
              <span>{t('marketing.adManager.thankyou.create')}</span>
            </Link>
            <Link href="/">
              <span>{t('marketing.adManager.thankyou.main')}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

ThanksPage.getLayout = getLayout;

export default ThanksPage;
