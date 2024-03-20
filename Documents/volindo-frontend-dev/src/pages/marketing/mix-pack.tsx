import { useEffect, useState } from 'react';

import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';

import {
  MixPackages,
  MixPackagesType,
  NextPageWithLayout,
} from '@typing/types';
import { getLayout } from '@layouts/MarketingLayout';
import config from '@config';

import styles from '@styles/marketing.module.scss';

import { SEO } from '@components';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Image from 'next/image';
import Check from '@icons/marketingIcons/green-check.svg';
import CheckBlue from '@icons/marketingIcons/blue-check.svg';
import ArrowRight from '@icons/marketingIcons/arrow-right-white.svg';
import { MarketModal } from '@components/marketing';
import ModalMixPackagePay from '@components/marketing/branding/ModalMixPackagePay';
import { useAppSelector } from '@context';

const GetPhoneAndAddress = dynamic(
  () => import('@components/marketing/branding/ModalPhone'),
  {
    ssr: false,
  }
);

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

const MixPackPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const agent = useAppSelector(state => state.agent.profile);

  // const isVolindo = config.WHITELABELNAME === 'Volindo';
  const isVolindo = false;
  const brandingStyle = isVolindo ? styles.branding : styles.brandingWL;
  const checkIcon = isVolindo ? Check : CheckBlue;

  const [packageToPay, setPackageToPay] = useState<MixPackagesType | null>(
    null
  );
  const [paymentTotal, setPaymentTotal] = useState<number>(0);
  const [openInfo, setOpenInfo] = useState<string | string[] | undefined>(
    router.query?.payment
  );

  const selectedOptions = (selectedPackage: MixPackagesType, total: number) => {
    setPackageToPay(selectedPackage);
    setPaymentTotal(total);
  };

  const handleOnSuccesfullUpdate = () => {
    setOpenInfo('success');
  };

  const handleError = () => {
    setOpenInfo('error');
  };

  const handleOkey = () => {
    router.replace('/marketing/mix-pack', undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    const {
      phone_number,
      phone_country_code,
      address,
      city,
      state_province,
      zip_code,
      country,
    } = agent;
    const somethingMissing =
      !phone_number ||
      !phone_country_code ||
      !address ||
      !city ||
      !state_province ||
      !zip_code ||
      !country;
    if (router.query?.payment === 'success' && somethingMissing) {
      setOpenInfo('moreDetails');
    } else setOpenInfo(router.query?.payment);
  }, [agent, router.query]);

  return (
    <>
      {packageToPay && (
        <ModalMixPackagePay
          packageName={packageToPay}
          total={paymentTotal}
          onClose={() => setPackageToPay(null)}
        />
      )}
      <MarketModal
        open={openInfo === 'success' || openInfo === 'error'}
        onClose={handleOkey}
      >
        <MarketModal.Title>
          {openInfo === 'success'
            ? t('marketing.branding.payment.successTitle')
            : t('marketing.branding.payment.errorTitle')}
        </MarketModal.Title>
        <MarketModal.Content>
          <MarketModal.Paragraph>
            {openInfo === 'success'
              ? t('marketing.mixPack.successPayment')
              : t('marketing.branding.payment.errorMessage')}
          </MarketModal.Paragraph>
        </MarketModal.Content>
        <MarketModal.Button onClick={handleOkey}>Okey</MarketModal.Button>
      </MarketModal>

      <GetPhoneAndAddress
        open={openInfo === 'moreDetails'}
        onClose={() => setOpenInfo(undefined)}
        onError={handleError}
        onSuccessfullUpdate={handleOnSuccesfullUpdate}
        withAddress={true}
      />
      <SEO title="Mix Pack" />
      <section className={brandingStyle}>
        <article className={`${styles.branding__packages} ${styles.mixPack}`}>
          <div className={styles.card}>
            <div className={styles.card__top}>
              <div className={styles.card__prices}>
                <span>Esencial</span>
                <span>50,000 MXN</span>
              </div>
              <hr />
              <button
                className={styles.card__button}
                onClick={() => selectedOptions(MixPackages.Esencial, 50000)}
              >
                <span>{t('marketing.branding.purchase')}</span>
                <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
              </button>
              <span className={styles.card__plan}>
                {t('marketing.mixPack.pack')}
              </span>
              <div className={styles.card__offers}>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>50 Leads</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    {`${t('marketing.mixPack.course')} "${t(
                      'marketing.course.courseFacebookAds.name'
                    )}"`}
                  </span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.branding.companyLogo')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.branding.designed-businessWL')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>20 {t('marketing.branding.posts')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>1 {t('marketing.mixPack.templateCanva')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>3 {t('marketing.branding.physical-kitWL')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.mixPack.letterhead')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    1 {t('marketing.mixPack.planMonth')}{' '}
                    {t('marketing.mixPack.contentPlan')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.active}`}>
            <div className={styles.card__top}>
              <div className={styles.card__prices}>
                <span>Élite</span>
                <span>100,000 MXN</span>
              </div>
              <hr />
              <button
                className={styles.card__button}
                onClick={() => selectedOptions(MixPackages.Elite, 100000)}
              >
                <span>{t('marketing.branding.purchase')}</span>
                <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
              </button>
              <span className={styles.card__plan}>
                {t('marketing.mixPack.pack')}
              </span>
              <div className={styles.card__offers}>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>120 Leads</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    {`${t('marketing.mixPack.course')} "${t(
                      'marketing.course.bussinessWithGoogleAds.name'
                    )}"`}
                  </span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    {`${t('marketing.mixPack.course')} "${t(
                      'marketing.course.courseFacebookAds.name'
                    )}"`}
                  </span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.branding.companyLogo')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.branding.designed-businessWL')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>30 {t('marketing.branding.posts')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>1 {t('marketing.mixPack.templateCanva')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>10 {t('marketing.branding.physical-kitWL')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.mixPack.letterhead')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    2 {t('marketing.mixPack.planMonths')}{' '}
                    {t('marketing.mixPack.contentPlan')}
                  </span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    1 {t('marketing.mixPack.session')}{' '}
                    {t('marketing.mixPack.photoSession')}
                  </span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>2 {t('marketing.mixPack.videocalls')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.mixPack.brandingManual')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.mixPack.freepik')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>5000 {t('marketing.mixPack.publicity')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>100 {t('marketing.mixPack.sms')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.card__top}>
              <div className={styles.card__prices}>
                <span>Prestigio</span>
                <span>200,000 MXN</span>
              </div>
              <hr />
              <button
                className={styles.card__button}
                onClick={() => selectedOptions(MixPackages.Prestigio, 200000)}
              >
                <span>{t('marketing.branding.purchase')}</span>
                <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
              </button>
              <span className={styles.card__plan}>
                {t('marketing.mixPack.pack')}
              </span>
              <div className={styles.card__offers}>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>250 Leads</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    {`${t('marketing.mixPack.course')} "${t(
                      'marketing.course.becomeFiveFiguresAgent.name'
                    )}"`}
                  </span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    {`${t('marketing.mixPack.course')} "${t(
                      'marketing.course.bussinessWithGoogleAds.name'
                    )}"`}
                  </span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    {`${t('marketing.mixPack.course')} "${t(
                      'marketing.course.courseFacebookAds.name'
                    )}"`}
                  </span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.branding.companyLogo')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.branding.designed-businessWL')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>40 {t('marketing.branding.posts')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>1 {t('marketing.mixPack.templateCanva')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>20 {t('marketing.branding.physical-kitWL')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.mixPack.letterhead')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    6 {t('marketing.mixPack.planMonths')}{' '}
                    {t('marketing.mixPack.contentPlan')}
                  </span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>
                    2 {t('marketing.mixPack.sessions')}{' '}
                    {t('marketing.mixPack.photoSession')}
                  </span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>4 {t('marketing.mixPack.videocalls')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.mixPack.brandingManual')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.mixPack.freepik')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>10,000 {t('marketing.mixPack.publicity')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>200 {t('marketing.mixPack.sms')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>10,000 {t('marketing.mixPack.influencers')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.mixPack.support')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.mixPack.email')}</span>
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  <span>{t('marketing.mixPack.stand')}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

MixPackPage.getLayout = getLayout;

export default MixPackPage;
