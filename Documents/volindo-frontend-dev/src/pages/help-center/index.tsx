import React, { useEffect, useState } from 'react';

import { NextPageWithLayout } from '@typing/types';
import { getLayout } from '@layouts/MainLayout';
import { SEO } from '@components';

import { useTranslation } from 'next-i18next';
import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { getMarketingVideos } from '@utils/axiosClients';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '@components';

import {
  setSelectedCategory,
  setSelectedVideo,
  useAppDispatch,
} from '@context';

import styles from '@styles/marketing-academy.module.scss';

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

const MarketingAcademy: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getMarketingVideos();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleclick = (video: any, category: any) => {
    dispatch(setSelectedVideo(video));
    dispatch(setSelectedCategory(category));
    router.push({ pathname: 'help-center/course' });
  };

  const getLabel = (tags: any) => {
    return tags.map((item: any, index: number) => {
      if (item.name === 'free' || item.name === 'expert') {
        const color = item.name === 'free' ? '#aacd5f' : '#fcca3e';

        return (
          <span
            key={index}
            className={styles.container_category_holder_card_label}
            style={{ backgroundColor: color }}
          >
            {item.name === 'free' ? 'Free' : 'Expert plan only'}
          </span>
        );
      }
      return '';
    });
  };

  const buildCatTitle = (category: any) => {
    let title = category.replace(/ /g, '-').toLowerCase();
    return <span>{t(`marketing.helpCenter.${title}`)}</span>;
  };

  return (
    <div className={styles.helpCenter}>
      <SEO title={t('marketing.pages.helpCenter')} />
      <h1 className={styles.mainTitle}>{t('marketing.pages.helpCenter')}</h1>
      <div className={`${styles.container} container2`}>
        {data.length === 0 ? (
          <div className={styles.spinner}>
            <LoadingSpinner size="big" />
          </div>
        ) : (
          data.map((category: any, index: number) => (
            <div
              key={index}
              className={`${styles.container_category} container_category`}
            >
              <div
                data-testid="category-title"
                className={`${styles.container_category_title}`}
              >
                {buildCatTitle(category.category)}
              </div>

              <div className={styles.container_category_holder}>
                {category.videos.map((video: any, index: number) => {
                  const { pictures, tags, name } = video;
                  return (
                    <div
                      className={styles.container_category_holder_card}
                      onClick={() => handleclick(video, category)}
                      key={index}
                    >
                      {getLabel(tags)}
                      <img
                        className="rounded-[10px] md:my-[10px]"
                        src={pictures?.sizes[2]?.link_with_play_button}
                        alt="Videos thumbnail"
                        width={253}
                        height={170}
                      />
                      <p className="md:max-w-[200px] md:h-[40px]">{name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

MarketingAcademy.getLayout = getLayout;

export default MarketingAcademy;
