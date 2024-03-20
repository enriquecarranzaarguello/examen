import { useState } from 'react';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { NextPageWithLayout } from '@typing/types';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import nextI18nextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getLayout } from '@layouts/MarketingLayout';

import styles from '@styles/marketing-course.module.scss';

import { useRouter } from 'next/router';
import Image from 'next/image';
import arrowPrevious from '@icons/arrow-left-white.svg';
import { useTranslation } from 'react-i18next';
import { PaymentMarketing, PersonalizedModal } from '@components';

import {
  getCourseData,
  getAssociatedCourseIds,
  getCoursesFromIds,
} from 'src/common/data/courses/courses';

import MarketingCard from '@components/marketing/course/CourseCard';

//TODO Fix Alt texts for images

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

const Info: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [openPayment, setOpenPayment] = useState(false);
  const [responsability, setResponsability] = useState(false);
  const [showResponsabilityModal, setShowResponsabilityModal] = useState(false);
  const [total, setTotal] = useState<number | string>(0);
  const [courseId, setCourseId] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('');

  const translateCourseNames = (courses: string[]) => {
    const translatedNames = courses.map(name => t(`marketing.course.${name}`));
    return translatedNames;
  };
  const elements = getCourseData(router.query.slug || '');
  const coursesIdsToUnlock = getAssociatedCourseIds(router.query.slug || '');
  const courseNamesToUnlock = translateCourseNames(
    getCoursesFromIds(coursesIdsToUnlock || [])
  );

  const handleClick = (el: any) => {
    setOpenPayment(true);
    setTotal(el.price);
    setCourseId(el.id);
    setCourseName(el.title || '');
  };

  return (
    <>
      {showResponsabilityModal && (
        <PersonalizedModal
          open={showResponsabilityModal}
          onClose={() => setShowResponsabilityModal(false)}
          title={t(`marketing.course.termsAndConditions`)}
          text={t(`marketing.course.${elements[0]?.responsability}`)}
        />
      )}
      {openPayment && (
        <PaymentMarketing
          open={openPayment}
          onClose={() => setOpenPayment(!openPayment)}
          total={typeof total === 'string' ? parseFloat(total) : total}
          courseId={courseId}
          coursesIdsToUnlock={coursesIdsToUnlock}
          courseNamesToUnlock={courseNamesToUnlock}
          name={courseName}
        />
      )}
      <section className={styles.info}>
        <button
          className={styles.info__back}
          onClick={() => router.push('/marketing/course-flyway')}
        >
          <Image src={arrowPrevious} width={20} height={20} alt="Go back" />
          <span>{t('marketing.course.flywayAcademy')}</span>
        </button>
        {elements.map(el => (
          <div key={el.id} className={styles.info__top}>
            <img src={el.image} alt="Course image" />
            <div className={styles.info__content}>
              <h1 className={styles.title}>
                {el.title
                  ? t(`marketing.course.${el.title}`)
                  : t('marketing.course.marketing')}
              </h1>
              {el.subTitleFirst && (
                <p className={styles.text}>
                  {t(`marketing.course.${el.subTitleFirst}`)}
                </p>
              )}
              {el.subTitleSecond && (
                <p className={styles.text}>
                  {t(`marketing.course.${el.subTitleSecond}`)}
                </p>
              )}
            </div>
          </div>
        ))}

        <div className={styles.info__description}>
          <h2 className={styles.title}>
            {t('marketing.course.courseDescription')}
          </h2>
          <p className={styles.text}>
            {t(`marketing.course.${elements[0].description}`)}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans mb-[40px]">
            {elements[0]?.data?.info?.map((dato: any, index: number) => (
              <MarketingCard
                key={index}
                data={dato}
                cardNumber={dato.cardType}
                imagePosition={dato.imagePosition}
              />
            ))}
          </div>
        </div>

        <div className={`${styles.info__content}`}>
          <div className={styles.info__content_bottom_price}>
            <div className={styles.price}>{`${elements[0]?.price} MXN`}</div>
            <button
              className={styles.button}
              onClick={() => handleClick(elements[0])}
              disabled={!responsability}
            >
              {t('marketing.course.buy')}
            </button>
          </div>

          <form className={styles.validate}>
            <input
              type="checkbox"
              name="cancel"
              className={styles.validate_checkbox}
              onClick={() => setResponsability(!responsability)}
            />
            <p>
              {t(`marketing.course.confirmation`)}{' '}
              <span
                className="underline cursor-pointer"
                onClick={() => setShowResponsabilityModal(true)}
              >
                {t(`marketing.course.termsAndConditions`)}
              </span>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

Info.getLayout = getLayout;

export default Info;
