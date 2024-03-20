import { useEffect, useRef, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { NextPageWithLayout } from '@typing/types';
import { getLayout } from '@layouts/MarketingLayout';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@context';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import {
  instagramPosts,
  instagramStories,
} from 'src/common/data/marketing/templates-images';
import styles from '@styles/marketing-templates.module.scss';

import userDef from '@icons/userDefaultIMG.svg';
import download from '@images/marketing/donwload.svg';
import axios from 'axios';
import SearchLoader from '@components/SearchLoader';
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

const Templates: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const agent = useAppSelector(state => state.agent.profile);
  const blockRefs = useRef<any>([]);
  const [loadingArray, setLoadingArray] = useState([].map(() => false));
  const [agentPhoto, setAgentPhoto] = useState<string>();

  const checkWL = config.WHITELABELNAME === 'Volindo';

  useEffect(() => {
    if (!agentPhoto) {
      (async function () {
        if (agent.photo) setAgentPhoto(await imageToBase64(agent.photo));
      })();
    }
  }, [agentPhoto]);

  async function imageToBase64(imagePath: any) {
    try {
      const image = await axios.get(imagePath, {
        headers: {
          'Cache-Control': 'no-cache',
        },
        responseType: 'arraybuffer',
      });
      const base64Img = Buffer.from(image.data, 'binary').toString('base64');

      return 'data:image/png;base64, ' + base64Img;
    } catch (error) {
      console.log(error);
    }
  }

  const onButtonClick = async (id: any) => {
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

  return (
    <div className={styles.wrapper}>
      {/* Stories */}
      <h2 className={styles.title}>
        {t('marketing.templates.templatesInstagram')}{' '}
        {t('marketing.templates.stories')}:
      </h2>

      <ul className={styles.templatesListStories}>
        {instagramStories.map(({ id, background, backgroundWL }) => {
          return (
            <>
              <li key={id} className={styles.item}>
                <div
                  className={styles.itemInner}
                  ref={ref => (blockRefs.current[id] = ref)}
                >
                  <div className={styles.bgTemplate}>
                    <img src={checkWL ? background : backgroundWL} alt="" />
                  </div>

                  <div className={styles.topContent}>
                    {agentPhoto ? (
                      <img src={agentPhoto} className={styles.avatar} />
                    ) : (
                      <Image
                        src={userDef}
                        alt={'agent photo'}
                        className={styles.avatar}
                      />
                    )}
                    <h3 className={checkWL ? styles.hiAgent : styles.hiAgentWL}>
                      {t('marketing.templates.hi')}👋🏻
                      <br />
                      {t('marketing.templates.iAm')} {agent?.full_name}{' '}
                      {checkWL
                        ? t('marketing.templates.volindoAgent')
                        : t('marketing.templates.flywayAgent')}
                    </h3>
                  </div>

                  <div className={styles.content}>
                    <h3 className={styles.aboutAgent}>{t('agent.about')}</h3>
                    {agent?.description ? (
                      <p>{agent?.description}</p>
                    ) : (
                      <p>{t('marketing.templates.infoAbout')}</p>
                    )}
                  </div>
                </div>
                <button
                  className={styles.buttonload}
                  onClick={() => onButtonClick(id)}
                >
                  {loadingArray[id] ? (
                    <SearchLoader />
                  ) : (
                    <Image src={download} alt="Donwload" />
                  )}
                </button>
              </li>
            </>
          );
        })}
      </ul>
      {/* End stories */}

      {/* Posts */}
      <h2 className={styles.title}>
        {t('marketing.templates.templatesInstagram')}{' '}
        {t('marketing.templates.post')}:
      </h2>

      <ul className={styles.templatesListPost}>
        {instagramPosts.map(({ id, background, backgroundWL }) => {
          return (
            <>
              <li key={id} className={styles.item}>
                <div
                  className={styles.itemInner}
                  ref={ref => (blockRefs.current[id] = ref)}
                >
                  <div className={styles.bgTemplate}>
                    <img src={checkWL ? background : backgroundWL} alt="" />
                  </div>

                  <div className={styles.topContent}>
                    {agentPhoto ? (
                      <img src={agentPhoto} className={styles.avatar} />
                    ) : (
                      <Image
                        src={userDef}
                        alt={'agent photo'}
                        className={styles.avatar}
                      />
                    )}
                    <h3 className={checkWL ? styles.hiAgent : styles.hiAgentWL}>
                      {t('marketing.templates.hi')}👋🏻
                      <br />
                      {t('marketing.templates.iAm')} {agent?.full_name}{' '}
                      {checkWL
                        ? t('marketing.templates.volindoAgent')
                        : t('marketing.templates.flywayAgent')}
                    </h3>
                  </div>

                  <div className={styles.content}>
                    <h3>{t('agent.about')}</h3>
                    {agent?.description ? (
                      <p>{agent?.description}</p>
                    ) : (
                      <p>{t('marketing.templates.infoAbout')}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onButtonClick(id)}
                  className={styles.buttonload}
                >
                  {loadingArray[id] ? (
                    <SearchLoader />
                  ) : (
                    <Image src={download} alt="Donwload" />
                  )}
                </button>
              </li>
            </>
          );
        })}
      </ul>
      {/* End posts */}
    </div>
  );
};

Templates.getLayout = getLayout;

export default Templates;
