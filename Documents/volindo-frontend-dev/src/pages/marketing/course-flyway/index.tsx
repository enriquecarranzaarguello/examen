import { useEffect } from 'react';

import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { NextPageWithLayout } from '@typing/types';

import { getLayout } from '@layouts/MarketingLayout';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { getAgentCourses } from '@utils/axiosClients';

import { SEO } from '@components';

import styles from '@styles/marketing-course.module.scss';

import { useAppSelector, setAvailableCourses, useAppDispatch } from '@context';

const CourseItem = ({
  courseId,
  imageSrc,
  courseNameKey,
  courseDescriptionKey,
  coursePrice,
}: {
  courseId: string;
  imageSrc: string;
  courseNameKey: string;
  courseDescriptionKey: string;
  coursePrice: string;
  className?: string;
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const coursesAvailable = useAppSelector(
    state => state.marketing.academy.courses
  );
  const checkCoursesOfAgent = (id: string) => {
    return coursesAvailable?.find((course: any) => course.id_course === id);
  };

  const redirectToCourse = (id: string) => {
    const isCourseAvailable = checkCoursesOfAgent(id);
    const pathname = isCourseAvailable
      ? `course-flyway/player/${id}`
      : `course-flyway/${id}`;

    router.push({ pathname });
  };

  return (
    <li className={styles.item}>
      <div className={styles.imageBlock}>
        <img src={imageSrc} alt="" />
      </div>
      <div className={styles.content}>
        <h2>{t(courseNameKey)}</h2>
        <p>{t(courseDescriptionKey).substring(0, 120) + '...'}</p>
        <div className={styles.price}>
          <button onClick={() => redirectToCourse(courseId)}>
            {checkCoursesOfAgent(courseId)
              ? t('marketing.course.seeCourse')
              : t('marketing.course.moreInfo')}
          </button>
        </div>
      </div>
    </li>
  );
};

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

const CourseFlyway: NextPageWithLayout = () => {
  const agent_id = useAppSelector(state => state.agent.agent_id);

  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (agent_id) {
      getAgentCourses(agent_id)
        .then(res => dispatch(setAvailableCourses(res?.data?.courses || [])))
        .catch(err => console.error(err));
    }
  }, [agent_id]);

  return (
    <>
      <SEO title={`Flyway ${t('marketing.pages.academy')}`} />

      <div className={styles.wrapper}>
        <div className={styles.topBlock}>
          <CourseItem
            courseId="18614542"
            imageSrc="/marketing/meetingImg.png"
            courseNameKey="marketing.course.becomeFiveFiguresAgent.name"
            courseDescriptionKey="marketing.course.becomeFiveFiguresAgent.description"
            coursePrice="5000 MXN"
          />
        </div>
        <ul className={styles.list}>
          <CourseItem
            courseId="18612028"
            imageSrc="/marketing/courseImg2.png"
            courseNameKey="marketing.course.bussinessWithGoogleAds.name"
            courseDescriptionKey="marketing.course.bussinessWithGoogleAds.description"
            coursePrice="12 000 MXN"
          />
          <CourseItem
            courseId="4"
            imageSrc="/marketing/courseImg4.png"
            courseNameKey="marketing.course.packageDigitalPublicity.name"
            courseDescriptionKey="marketing.course.packageDigitalPublicity.description"
            coursePrice="18 000 MXN"
          />
          <CourseItem
            courseId="5"
            imageSrc="/marketing/courseImg5.png"
            courseNameKey="marketing.course.contentKing.name"
            courseDescriptionKey="marketing.course.contentKing.description"
            coursePrice="14 000 MXN"
          />
          <CourseItem
            courseId="7"
            imageSrc="/marketing/courseImg2.png"
            courseNameKey="marketing.course.outreachAgent.name"
            courseDescriptionKey="marketing.course.outreachAgent.description"
            coursePrice="14 000 MXN"
          />
          <CourseItem
            courseId="6"
            imageSrc="/marketing/courseImg3.png"
            courseNameKey="marketing.course.threeSixtyAgent.name"
            courseDescriptionKey="marketing.course.threeSixtyAgent.description"
            coursePrice="22 000 MXN"
          />
          <div className={`${styles.empty} ${styles.item}`}></div>
        </ul>
      </div>
    </>
  );
};

CourseFlyway.getLayout = getLayout;

export default CourseFlyway;
