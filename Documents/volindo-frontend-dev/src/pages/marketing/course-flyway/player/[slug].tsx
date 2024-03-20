import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

import { getVideoURLs } from '@utils/axiosClients';
import {
  setSelectedAcademyVideo,
  useAppSelector,
  useAppDispatch,
  setAvailableCourses,
} from '@context';

import config from '@config';

import { getAgentCourses } from '@utils/axiosClients';

import { GetServerSidePropsContext } from 'next';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { unstable_getServerSession } from 'next-auth';
import nextI18nextConfig from 'next-i18next.config';

import styles from '@styles/video-player.module.scss';

import {
  getCourseDataById,
  getAssociatedCourseIds,
} from 'src/common/data/courses/courses';

//Icons
import arrowPreviousWhite from '@icons/arrow-left-white.svg';
import { getLayout } from '@layouts/MarketingLayout';
import { SEO, LoadingSpinner, PersonalizedModal } from '@components';

import down from '@icons/downIconwhite.svg';

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

const Videos = () => {
  const selectedVideo = useAppSelector(
    state => state.marketing.academy.selectedVideo
  );
  const agent_id = useAppSelector(state => state.agent.agent_id);
  const coursesAvailable = useAppSelector(
    state => state.marketing.academy.courses
  );

  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [openVideoIndices, setOpenVideoIndices] = useState<number[]>([0]);
  const [showResponsabilityModal, setShowResponsabilityModal] = useState(false);
  const companyName = config.WHITELABELNAME;

  const [videosData, setVideosData] = useState<any>([]);
  const elements = getCourseDataById(router.query.slug || '');
  const courseIds = getAssociatedCourseIds(router.query.slug || '');

  const checkCourseAvailability = (courseIds: any, courseAvailable: any) => {
    return courseIds.every((courseId: any) => {
      return courseAvailable.find(
        (course: any) => course.id_course === courseId
      );
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO why a try and catch this is already an axios request
        const coursesResponse = await getAgentCourses(agent_id);

        const availableCourses = coursesResponse?.data?.courses || [];

        dispatch(setAvailableCourses(availableCourses));

        const isAvailable = checkCourseAvailability(
          courseIds,
          availableCourses
        );

        if (isAvailable) {
          setLoading(true);
          setMessage('');
          const tempObj = {
            course_id: [...courseIds],
          };
          const res = await getVideoURLs(
            session?.user?.id_token || '',
            tempObj
          );

          if (res.status === 204) {
            setMessage(`${t('marketing.course.notAvailableAtThisTime')}`);
          } else {
            setVideosData(res.data.courses);
            const { player_embed_url, description, name } =
              res.data.courses[0].course[0].info;

            const defaultVideo = {
              player_embed_url,
              description,
              name,
            };
            dispatch(setSelectedAcademyVideo(defaultVideo));
          }
        } else {
          setLoading(false);
          setMessage(`${t('marketing.course.permission')}`);
        }
      } catch (err) {
        setMessage(`${t('marketing.course.permission')}`);
      } finally {
        setLoading(false);
      }
    };

    if (agent_id) fetchData();
  }, [courseIds, agent_id]);

  const { player_embed_url, description, name } = selectedVideo || {};

  const handleClick = (video: any) => {
    const { player_embed_url, description, name } = video.info;
    const selectedVideo = {
      player_embed_url,
      description,
      name,
    };
    dispatch(setSelectedAcademyVideo(selectedVideo));
  };

  const handleClickBack = () => {
    router.push('/marketing/course-flyway');
  };

  const secondsToMinutes = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const restSeconds = seconds % 60;

    return `${minutes}:${restSeconds}`;
  };

  const toggleContent = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? -1 : index));
  };
  const toggleVideoContent = (index: number) => {
    setOpenVideoIndices(prevIndices => {
      if (prevIndices.includes(index)) {
        return prevIndices.filter(i => i !== index);
      } else {
        return [...prevIndices, index];
      }
    });
  };

  return (
    <div className="h-full">
      {showResponsabilityModal && (
        <PersonalizedModal
          open={showResponsabilityModal}
          onClose={() => setShowResponsabilityModal(false)}
          title={t(`marketing.course.termsAndConditions`)}
          text={t(`marketing.course.${elements[0]?.responsability}`)}
        />
      )}
      <SEO title={`${t('marketing.course.section')}`} />

      {loading && (
        <div className={styles.loader}>
          <LoadingSpinner size="big" />
        </div>
      )}

      {/* Main Video Section */}
      {videosData && videosData.length > 0 ? (
        <div className={styles.video_player}>
          <div className={styles.video_player_title} onClick={handleClickBack}>
            <Image
              src={arrowPreviousWhite}
              width={20}
              height={20}
              alt="Go back"
            />
            {name || ''}
          </div>

          <div className="md:flex">
            <div className={styles.video_player_container}>
              <div className={styles.video_player_container_screen}>
                <iframe
                  src={player_embed_url}
                  width="100%"
                  height="100%"
                  allowFullScreen
                ></iframe>
              </div>

              <div className={styles.video_player_container_title}>
                {' '}
                {name || ''}{' '}
              </div>

              <div className={styles.video_player_description}>
                {description}
              </div>
              {elements.map((element: any, index: number) => (
                <div
                  key={index}
                  className={styles.video_player_container_syllabus}
                >
                  <div
                    className={styles.video_player_container_syllabus_titleCard}
                    onClick={() => toggleContent(index)}
                  >
                    <h4>{t(`marketing.course.${element.title}`)}</h4>
                    <Image
                      alt="icon"
                      src={down}
                      className={`${!openIndex && 'rotate-180'}`}
                    />
                  </div>
                  {openIndex === index && (
                    <>
                      {element.data.info.map(
                        (information: any, cardIndex: number) => (
                          <div
                            key={cardIndex}
                            className={
                              styles.video_player_container_syllabus_course
                            }
                          >
                            {information.card.map(
                              (cardInfo: string, cardInfoIndex: number) => (
                                <div key={cardInfoIndex}>
                                  {i18n.t(`marketing.course.${cardInfo}`, {
                                    COMPANYNAME: companyName,
                                  })}
                                </div>
                              )
                            )}
                          </div>
                        )
                      )}
                      <p>
                        <span
                          className={
                            styles.video_player_container_syllabus_conditions
                          }
                          onClick={() => setShowResponsabilityModal(true)}
                        >
                          {t(`marketing.course.termsAndConditions`)}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Side Video section */}
            <div className={styles.video_player_cat_holder}>
              {videosData?.map((element: any, index: number) => (
                <>
                  <div
                    className={styles.video_player_cat_holder_toggler}
                    onClick={() => toggleVideoContent(index)}
                  >
                    {`${t('marketing.course.section_player')} ${index + 1}`}
                  </div>
                  {openVideoIndices.includes(index) && (
                    <>
                      {element.course.map((video: any, index: number) => (
                        <div
                          className={styles.video_player_cat_holder_academy}
                          onClick={() => handleClick(video)}
                          key={index}
                        >
                          <img
                            className={
                              styles.video_player_cat_holder_academy_img
                            }
                            src={
                              video?.info?.pictures?.sizes[2]
                                ?.link_with_play_button
                            }
                            alt="Videos thumbnail"
                            width={253}
                            height={170}
                          />
                          <div
                            className={
                              styles.video_player_cat_holder_academy_info
                            }
                          >
                            <p
                              className={
                                styles.video_player_cat_holder_academy_info_name
                              }
                            >
                              {video?.info?.name}
                            </p>
                            <p
                              className={
                                styles.video_player_cat_holder_academy_info_time
                              }
                            >{`${secondsToMinutes(
                              video?.info?.duration
                            )} minutes`}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <h2 className={styles.video_error}>{message}</h2>
      )}
    </div>
  );
};

Videos.getLayout = getLayout;

export default Videos;
