import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getMarketingTemplates } from '@utils/axiosClients';
import html2canvas from 'html2canvas';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import nextI18nextConfig from 'next-i18next.config';
import { getLayout } from '@layouts/MarketingLayout';
import { useTranslation } from 'react-i18next';
import SearchLoader from '@components/SearchLoader';
import {
  AgentAirtableType,
  DealTemplate,
  NextPageWithLayout,
} from '@typing/types';

import styles from '@styles/marketing-deal-templates.module.scss';
import userDef from '@icons/userDefaultIMG.svg';
import avatar from 'public/marketing/deal-templates/avatar.png';
import download from '@images/marketing/donwload.svg';
import logoFlyway from '@icons/logoFlyway.svg';
import logoBooking from '@icons/bookingLogo.svg';
import iconWhatsapp from '@icons/iconWhatsapp.svg';
import iconEarth from '@icons/iconEart.svg';
import iconInstagram from '@icons/iconInstagram.svg';
import { LoadingSpinner } from '@components';

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

const DealTemplates: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const blockRefs = useRef<(HTMLElement | null)[]>([]);
  const [loadingArray, setLoadingArray] = useState<boolean[]>([]);
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<DealTemplate[]>([]);
  const [agentData, setAgentData] = useState<AgentAirtableType | null>(null);
  const [combinedArray, setCombinedArray] = useState<DealTemplate[]>([]);

  useEffect(() => {
    const sessionToken = session?.user?.id_token || '';
    fetchTemplates(sessionToken);
  }, []);

  useEffect(() => {
    const newCombinedArray = [];

    for (let i = 0; i < templates.length; i++) {
      for (let j = 0; j < 4; j++) {
        if (templates[i]) {
          newCombinedArray.push(templates[i]);
        }
      }
    }
    setCombinedArray(newCombinedArray);
  }, [templates]);

  const fetchTemplates = async (sessionToken: string) => {
    try {
      const response = await getMarketingTemplates(sessionToken);

      if (response.status === 200) {
        setTemplates(response.data.airtable_data);
        setAgentData(response.data.agent_data);
      } else {
        console.log('Response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const truncateTextFunc = (text: string) => {
    const words = text.split(' ');
    if (words.length > 30) {
      return words.slice(0, 30).join(' ') + '...';
    }
    return text;
  };

  const onButtonClick = async (id: number) => {
    const newLoadingArray = [...loadingArray];
    newLoadingArray[id] = true;
    setLoadingArray(newLoadingArray);
    const node = blockRefs.current[id];

    if (node) {
      html2canvas(node, { scale: 3 }).then(canvas => {
        try {
          const imgData = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `myImage-${id}.png`;
          link.click();
        } catch (error) {
          console.log(error);
        } finally {
          const newLoadingArray = [...loadingArray];
          newLoadingArray[id] = false;
          setLoadingArray(newLoadingArray);
        }
      });
    }
  };

  const { email = '', phone = '', web_site = '' } = agentData ?? {};

  return (
    <div className={styles.wrapper}>
      {/* Instagram Stories */}
      <div className={styles.wrapper__stories}>
        <h2 className={styles.wrapper__title}>
          {t('marketing.templates.templatesDealInstStories')}:
        </h2>

        {templates.length > 0 ? (
          <>
            <ul className={styles.list}>
              {combinedArray?.map(({ id, fields }, index) => {
                const {
                  'Hotel location': hotelLocation = '',
                  'Hotel name': hotelName = '',
                  'Offer headline': offerHeadline = '',
                  'Offer’s dates': offersDate = '',
                  'Offer’s price': offersPrice = '',
                  'Booking.com Price': bookingPrice = '',
                  'Discount Percentage': discount = '',
                  'Free Text/Description': description = '',
                } = fields;

                return (
                  <li key={index} className={styles.item}>
                    <div
                      className={styles.item__inner}
                      ref={ref => (blockRefs.current[index] = ref)}
                    >
                      <div className={styles['item__top-content']}>
                        <h3 className={styles.item__title}>
                          {offerHeadline} 🔥
                        </h3>
                        <div className={styles.item__wrap}>
                          <div className={styles['item__wrap-image']}>
                            {avatar ? (
                              <Image
                                src={avatar}
                                alt={'agent photo'}
                                className={styles.item__img}
                              />
                            ) : (
                              <Image
                                src={userDef}
                                alt={'agent photo'}
                                className={styles.item__img}
                              />
                            )}
                            <div className={styles['item__about-hotel']}>
                              <div className={styles['item__hotel-name']}>
                                {hotelName}
                              </div>
                              <div className={styles.item__location}>
                                📍 {hotelLocation}
                              </div>
                              <div className={styles.item__calendar}>
                                🗓 {offersDate}
                              </div>
                            </div>
                          </div>

                          <div className={styles.item__about}>
                            <h4
                              className={
                                styles['item__about-hotel-description']
                              }
                            >
                              {t('marketing.templates.hotelDescr')}
                            </h4>
                            <p className={styles['item__about-hotel-text']}>
                              {truncateTextFunc(description)}
                            </p>
                            <p className={styles['item__about-discount']}>
                              {discount}%{' '}
                              {t('marketing.templates.discountDeal')}
                            </p>

                            <div className={styles['item__price-bg']}>
                              <div className={styles.item__price}>
                                <span>
                                  {t('marketing.templates.bestPrice')}
                                </span>
                                <div className={styles['item__price-best']}>
                                  <div className={styles.logo}>
                                    <Image src={logoFlyway} alt={''} />
                                  </div>
                                  <div className={styles['item__price-offers']}>
                                    ${offersPrice}
                                  </div>
                                </div>
                              </div>
                              <div className={styles.item__price}>
                                <div className={styles['item__price-booking']}>
                                  <div className={styles.logo}>
                                    <span>Booking.com</span>
                                  </div>
                                  <div className={styles.price}>
                                    ${bookingPrice}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={styles.item__contacts}>
                          <p>{t('marketing.templates.waiting')} 🤍</p>
                          <ul>
                            <li className={styles['item__contacts-item']}>
                              <Image src={iconWhatsapp} alt="Icon" />
                              <Link href={'/'}>{phone}</Link>
                            </li>
                            <li className={styles['item__contacts-item']}>
                              <Image src={iconInstagram} alt="Icon" />
                              <Link href={'/'}>{email}</Link>
                            </li>
                            <li className={styles['item__contacts-item']}>
                              <Image src={iconEarth} alt="Icon" />
                              <Link href={'/'}>
                                {web_site.replace('http://', '')}
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <button
                      className={styles['item__button-load']}
                      onClick={() => onButtonClick(index)}
                    >
                      {loadingArray[index] ? (
                        <SearchLoader />
                      ) : (
                        <Image src={download} alt="Donwload" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className={styles.templates__loader}>
            <LoadingSpinner size="big" />
          </div>
        )}
      </div>
      {/* End instagram Stories */}

      {/* Instagram post */}
      {/* <div className={styles.wrapper__post}>
        <h2 className={styles.wrapper__title}>
          {t('marketing.templates.templatesDealInst')}{' '}
          {t('marketing.templates.post')}:
        </h2>
        <ul className={styles.list}>
          {dealInstagramPostsArray.map(({ id, background, star }) => (
            <li key={id} className={styles.itemPost}>
              <div
                className={styles.itemInner}
                ref={ref => (blockRefs.current[id] = ref)}
              >
                <div className={styles.item__bg}>
                  <img src={background} alt="" />
                </div>

                <div className={styles.item__topContent}>
                  <h3 className={styles.item__title}>
                    {t('marketing.templates.bestDeal')} 🔥
                  </h3>
                  <div className={styles.item__imageWrap}>
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt={'agent photo'}
                        className={styles.item__img}
                      />
                    ) : (
                      <Image
                        src={userDef}
                        alt={'agent photo'}
                        className={styles.item__img}
                      />
                    )}
                    <div className={styles.item__aboutHotel}>
                      <div className={styles.item__hotelName}>
                        Pueblo Bonito Rose Resort & Spa
                      </div>
                      <div className={styles.item__location}>
                        📍 Cabo San Lucas, Mexico
                      </div>
                      <div className={styles.item__calendar}>🗓 Dec 1 - 7th</div>
                    </div>
                  </div>

                  <div className={styles.item__about}>
                    <h4 className={styles.item__aboutMe}>About me</h4>
                    <p className={styles.item__aboutMeText}>
                      Enjoy a pampered vacation to the golden beaches of Cabo
                      San Lucas, Mexico. Pueblo Bonito Rosé Resort & Spa is a
                      deluxe resort located on El Médano beach, one of the most
                      pristine stretches in Baja California.
                    </p>
                    <p className={styles.item__aboutDiscont}>
                      {t('marketing.templates.discount')}
                    </p>
                    <div className={styles.item__priceBg}>
                      {star && (
                        <Image src={star} width={13} height={21} alt="Stars" />
                      )}
                      <p className={styles.item__price}>Best price $731</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className={styles.item__buttonload}
                onClick={() => onButtonClick(id)}
              >
                {loadingArray[id] ? (
                  <SearchLoader />
                ) : (
                  <Image src={download} alt="Donwload" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div> */}
      {/* End instagram post */}
    </div>
  );
};

DealTemplates.getLayout = getLayout;

export default DealTemplates;
