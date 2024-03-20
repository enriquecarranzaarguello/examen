import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import Image from 'next/image';

import { NextPageWithLayout, PackageType } from '@typing/types';
import { getLayout } from '@layouts/MarketingLayout';

import styles from '@styles/marketing.module.scss';

import Check from '@icons/marketingIcons/green-check.svg';
import CheckBlue from '@icons/marketingIcons/blue-check.svg';
import ArrowRight from '@icons/marketingIcons/arrow-right-white.svg';
import { SEO } from '@components';
import { useTranslation } from 'react-i18next';
import { MarketModal, ModalPackagePay } from '@components/marketing';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@context';
import config from '@config';

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

const BrandingPackagesPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const agent = useAppSelector(state => state.agent.profile);
  const [openInfo, setOpenInfo] = useState<string | string[] | undefined>(
    router.query?.payment
  );
  const [packageToPay, setPackageToPay] = useState<PackageType>('None');
  const [paymentTotal, setPaymentTotal] = useState<number>(0);

  const handleOkey = () => {
    router.replace('/marketing/branding', undefined, {
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

  const handleOnSuccesfullUpdate = () => {
    setOpenInfo('success');
  };

  const handleError = () => {
    setOpenInfo('error');
  };

  const checkWL = config.WHITELABELNAME === 'Volindo';
  const checkBranding = checkWL ? styles.branding : styles.brandingWL;
  const checkIcon = checkWL ? Check : CheckBlue;

  const selectedOptions = (selectedPackage: PackageType, total: number) => {
    setPackageToPay(selectedPackage);
    setPaymentTotal(total);
  };

  return (
    <section className={checkBranding}>
      {packageToPay && (
        <ModalPackagePay
          packageName={packageToPay}
          total={paymentTotal}
          onClose={() => setPackageToPay('None')}
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
              ? t('marketing.branding.payment.successMessage')
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

      <SEO
        title={t('marketing.pages.branding')}
        description={t('marketing.branding.description') || ''}
      />

      <article className={styles.branding__packages}>
        <div className={styles.card}>
          <div className={styles.card__top}>
            <div className={styles.card__prices}>
              <span>{checkWL ? 'Pro' : 'Starter'}</span>
              <span>{checkWL ? '1000 USD' : '15000 MXN'}</span>
            </div>
            <hr />
            {!checkWL && (
              <button
                className={styles.card__button}
                onClick={() =>
                  selectedOptions('Starter', checkWL ? 1000 : 15000)
                }
              >
                <span>{t('marketing.branding.purchase')}</span>
                <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
              </button>
            )}
            <span className={styles.card__plan}>
              {t('marketing.branding.plan')}
            </span>
            <div className={styles.card__offers}>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                <span>{t('marketing.branding.business')}</span>
              </div>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                <span>10 {t('marketing.branding.posts')}</span>
              </div>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                <span>{t('marketing.branding.companyLogo')}</span>
              </div>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                <span>{t('marketing.branding.coversSome')}</span>
              </div>
            </div>
          </div>

          {checkWL && (
            <button
              className={styles.card__button}
              onClick={() => selectedOptions('Pro', checkWL ? 1000 : 15000)}
            >
              <span>{t('marketing.branding.purchase')}</span>
              <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
            </button>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.card__top}>
            <div className={styles.card__prices}>
              <span>{checkWL ? 'Plus' : 'Pro'}</span>
              <span>{checkWL ? '2000 USD' : '25000 MXN'}</span>
            </div>
            <hr />
            {!checkWL && (
              <button
                className={styles.card__button}
                onClick={() => selectedOptions('Pro', checkWL ? 2000 : 25000)}
              >
                <span>{t('marketing.branding.purchase')}</span>
                <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
              </button>
            )}
            <span className={styles.card__plan}>
              {t('marketing.branding.plan')}
            </span>
            <div className={styles.card__offers}>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                {checkWL ? (
                  <span>
                    {t('marketing.branding.business')}{' '}
                    {t('marketing.branding.businessQR')}
                  </span>
                ) : (
                  <span>{t('marketing.branding.silver')}</span>
                )}
              </div>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                {checkWL ? (
                  <span>20 {t('marketing.branding.posts')}</span>
                ) : (
                  <span>{t('marketing.branding.designed-businessWL')}</span>
                )}
              </div>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                {checkWL ? (
                  <span>{t('marketing.branding.companyLogo')}</span>
                ) : (
                  <span>20 {t('marketing.branding.posts')}</span>
                )}
              </div>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                {checkWL ? (
                  <span>{t('marketing.branding.coversAll')}</span>
                ) : (
                  <span>{t('marketing.branding.coversAllWL')}</span>
                )}
              </div>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                {checkWL ? (
                  <span>30 {t('marketing.branding.videoIntro')}</span>
                ) : (
                  <span>{t('marketing.branding.physical-kitWL')}</span>
                )}
              </div>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                {checkWL ? (
                  <span>{t('marketing.branding.physicalKit')}</span>
                ) : (
                  <span>{t('marketing.branding.videoWL')}</span>
                )}
              </div>
            </div>
          </div>
          {checkWL && (
            <button
              className={styles.card__button}
              onClick={() => selectedOptions('Plus', checkWL ? 2000 : 25000)}
            >
              <span>{t('marketing.branding.purchase')}</span>
              <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
            </button>
          )}
        </div>

        <div className={`${styles.card} ${styles.active}`}>
          <div className={styles.card__top}>
            <div className={styles.card__prices}>
              <span>{checkWL ? 'Premium' : 'Platinum'}</span>
              <span>{checkWL ? '5000 USD' : '40000 MXN'}</span>
            </div>
            <hr />
            {!checkWL && (
              <button
                className={styles.card__button}
                onClick={() =>
                  selectedOptions('Platinum', checkWL ? 5000 : 40000)
                }
              >
                <span>{t('marketing.branding.purchase')}</span>
                <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
              </button>
            )}
            <span className={styles.card__plan}>
              {t('marketing.branding.plan')}
            </span>
            <div className={styles.card__offers}>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                {checkWL ? (
                  <span>
                    {t('marketing.branding.business')}{' '}
                    {t('marketing.branding.businessQR')}
                  </span>
                ) : (
                  <span>30 {t('marketing.branding.posts')}</span>
                )}
              </div>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                {checkWL ? (
                  <span>30 {t('marketing.branding.posts')}</span>
                ) : (
                  <span>
                    <span>{t('marketing.branding.videoWL')}</span> X3
                  </span>
                )}
              </div>
              <div className={styles.card__offers__option}>
                <Image src={checkIcon} width={24} height={24} alt="Check" />
                {checkWL ? (
                  <span>{t('marketing.branding.companyLogo')}</span>
                ) : (
                  <span>{t('marketing.branding.physical-kitWL10')}</span>
                )}
              </div>
              {checkWL && (
                <>
                  <div className={styles.card__offers__option}>
                    <Image src={checkIcon} width={24} height={24} alt="Check" />
                    <span>{t('marketing.branding.coversAll')}</span>
                  </div>
                  <div className={styles.card__offers__option}>
                    <Image src={checkIcon} width={24} height={24} alt="Check" />
                    <span>
                      30 {t('marketing.branding.videoIntro')}{' '}
                      {t('marketing.branding.videoIntroVar')}
                    </span>
                  </div>
                  <div className={styles.card__offers__option}>
                    <Image src={checkIcon} width={24} height={24} alt="Check" />
                    <span>{t('marketing.branding.physicalKit')}</span>
                  </div>
                  <div className={styles.card__offers__option}>
                    <Image src={checkIcon} width={24} height={24} alt="Check" />
                    <span>{t('marketing.branding.website')}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          {checkWL && (
            <button
              className={styles.card__button}
              onClick={() => selectedOptions('Premium', checkWL ? 5000 : 40000)}
            >
              <span>{t('marketing.branding.purchase')}</span>
              <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
            </button>
          )}
        </div>

        {!checkWL && (
          <div className={styles.card}>
            <div className={styles.card__top}>
              <div className={styles.card__prices}>
                <span>Diamante</span>
                <span>60000 MXN</span>
              </div>
              <hr />
              {!checkWL && (
                <button
                  className={styles.card__button}
                  onClick={() => selectedOptions('Diamante', 60000)}
                >
                  <span>{t('marketing.branding.purchase')}</span>
                  <Image src={ArrowRight} width={24} height={24} alt="Arrow" />
                </button>
              )}
              <span className={styles.card__plan}>
                {t('marketing.branding.plan')}
              </span>
              <div className={styles.card__offers}>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  {t('marketing.branding.platinum')}
                </div>
                <div className={styles.card__offers__option}>
                  <Image src={checkIcon} width={24} height={24} alt="Check" />
                  {t('marketing.branding.personalized')}
                </div>
              </div>
            </div>
          </div>
        )}
      </article>

      <article className={styles.branding__tilesContainer}>
        <div className={styles.tile}>
          <div>
            <span>{t('marketing.branding.tileBusiness.title')}</span>
            <p>{t('marketing.branding.tileBusiness.content')}</p>
          </div>
          <img
            className={checkWL ? '' : styles.tileImageFirst}
            src={
              checkWL
                ? '/marketing/businessCard.png'
                : '/marketing/businessCardWL.png'
            }
            alt={t('marketing.branding.tileBusiness.title')!}
          />
        </div>
        <div className={styles.tile}>
          <div>
            <span>{t('marketing.branding.tilePosts.title')}</span>
            <p>{t('marketing.branding.tilePosts.content')}</p>
          </div>
          <img
            src={checkWL ? '/marketing/posts.png' : '/marketing/postsWL.png'}
            alt={t('marketing.branding.tilePosts.title')!}
          />
        </div>
      </article>
      <article className={styles.branding__tilesContainer}>
        <div className={styles.tile}>
          <div>
            <span>{t('marketing.branding.tileLogo.title')}</span>
            <p>{t('marketing.branding.tileLogo.content')}</p>
          </div>
          <img
            className={checkWL ? '' : styles.tileImageThird}
            src={
              checkWL ? '/marketing/company.png' : '/marketing/companyWL.png'
            }
            alt={t('marketing.branding.tileLogo.title')!}
          />
        </div>
        <div className={styles.tile}>
          <div>
            <span>{t('marketing.branding.tileSocial.title')}</span>
            <p>{t('marketing.branding.tileSocial.content')}</p>
          </div>
          <img
            className={checkWL ? '' : styles.tileImageFourth}
            src={
              checkWL
                ? '/marketing/mediacover.png'
                : '/marketing/mediacoverWL.png'
            }
            alt={t('marketing.branding.tileSocial.title')!}
          />
        </div>
      </article>
      <article className={styles.branding__tilesContainer}>
        <div className={styles.tile}>
          <div className={styles.tileVideo}>
            <span>{t('marketing.branding.tileVideo.title')}</span>
            <p>
              {t('marketing.branding.tileVideo.p1')}
              <br />
              {t('marketing.branding.tileVideo.p2')}
            </p>
          </div>
          <img
            className={checkWL ? '' : styles.tileImageFifth}
            src={
              checkWL
                ? '/marketing/videoIntro.png'
                : '/marketing/videoIntroWL.png'
            }
            alt={t('marketing.branding.tileVideo.title')!}
          />
        </div>
        <div className={styles.tile}>
          <div className={checkWL ? '' : styles.tilePhysical}>
            <span>{t('marketing.branding.tileKit.title')}</span>
            <p>{t('marketing.branding.tileKit.content')}</p>
          </div>
          <img
            src={
              checkWL
                ? '/marketing/physicalKit.png'
                : '/marketing/physicalKitWL.png'
            }
            alt={t('marketing.branding.tileKit.title')!}
          />
        </div>
      </article>
      <article className={styles.branding__longTile}>
        <div>
          <span className={styles.tile__title}>
            {t('marketing.branding.tileWebsite.title')}
          </span>
          <div className={styles.tile__content}>
            <span>{t('marketing.branding.tileWebsite.p1')}</span>
            <ul>
              <li>{t('marketing.branding.tileWebsite.li1')}</li>
              <li>{t('marketing.branding.tileWebsite.li2')}</li>
              <li>{t('marketing.branding.tileWebsite.li3')}</li>
              <li>{t('marketing.branding.tileWebsite.li4')}</li>
              <li>{t('marketing.branding.tileWebsite.li5')}</li>
            </ul>
            <span>{t('marketing.branding.tileWebsite.p2')}</span>
          </div>
        </div>
        <img
          src={checkWL ? '/marketing/website.png' : '/marketing/websiteWL.png'}
          alt={t('marketing.branding.tileWebsite.title')!}
        />
      </article>
    </section>
  );
};

BrandingPackagesPage.getLayout = getLayout;

export default BrandingPackagesPage;
