import React from 'react';
import { getLayout } from '@layouts/MainLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import config from '@config';

import Image from 'next/image';
import styles from '@styles/404-500.module.scss';
import mechanismSvg from 'public/mechanism.svg';

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}

const Custom500 = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const checkWL = config.WHITELABELNAME === 'Volindo';

  return (
    <>
      {!checkWL ? (
        <section className={styles.error}>
          <div className={styles.error__image}>
            <span className={styles.error__firstNum}>5</span>{' '}
            <Image src={mechanismSvg} width={84} height={89} alt="Mechanism" />{' '}
            <Image
              src={mechanismSvg}
              width={84}
              height={89}
              alt="Mechanism"
              className={styles.error__icon_white}
            />{' '}
          </div>
          <h1 className={styles.error__title}>{t('server-error.internal')}</h1>
          <p className={styles.error__subTitle}>{t('server-error.server')}</p>
          <button
            className={styles.error__btn}
            onClick={() => router.push('/')}
          >
            {t('wrong-page.back')}
          </button>
        </section>
      ) : null}
    </>
  );
};

Custom500.getLayout = getLayout;

export default Custom500;
