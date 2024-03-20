import Image from 'next/image';
import styles from './DateDetails.module.scss';
import { passStringToDate } from '@utils/timeFunctions';
import { useTranslation } from 'react-i18next';

//Icons - Images
import calendarWhiteIcon from '@icons/calendar-white.svg';

interface DateDetailsProps {
  checkIn: string;
  checkOut: string;
  hourCheckIn: string;
  hourCheckOut: string;
}

const DateDetails = ({
  checkIn, //2024-03-02
  checkOut,
  hourCheckIn, //12:00 PM
  hourCheckOut,
}: DateDetailsProps) => {
  const { t, i18n } = useTranslation();
  return (
    <div className={styles.dateAndHours}>
      <div className={styles.dateAndHours_dateContainer}>
        <span className={styles.dateAndHours_dateContainer_text}>
          {t('stays.check_in')}:{' '}
        </span>
        <div className={styles.dateAndHours_dateContainer_date}>
          <Image
            src={calendarWhiteIcon}
            alt="Calendar Icon"
            width={12}
            height={12}
            className={styles.dateAndHours_icon}
          />
          <span className={styles.dateAndHours_dates}>
            {passStringToDate(checkIn, i18n.language)}{' '}
            {hourCheckIn ? `(${hourCheckIn})` : ''}
          </span>
        </div>
      </div>
      <hr className={styles.dateAndHours_line} />
      <div className={styles.dateAndHours_dateContainer}>
        <span className={styles.dateAndHours_dateContainer_text}>
          {t('stays.check_out')}:
        </span>
        <div className={styles.dateAndHours_dateContainer_date}>
          <Image
            src={calendarWhiteIcon}
            alt="Calendar Icon"
            width={12}
            height={12}
            className={styles.dateAndHours_icon}
          />
          <span className={styles.dateAndHours_dates}>
            {' '}
            {passStringToDate(checkOut, i18n.language)}{' '}
            {hourCheckOut ? `(${hourCheckOut})` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DateDetails;
