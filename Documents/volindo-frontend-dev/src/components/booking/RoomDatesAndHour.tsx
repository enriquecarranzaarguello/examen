import Image from 'next/image';

import style from '@styles/deals/hotel.module.scss';

import { passStringToDate } from '@utils/timeFunctions';
import { useTranslation } from 'react-i18next';

import calendarWhiteIcon from '@icons/calendar-white.svg';

const RoomDatesAndHour = ({
  checkIn,
  checkOut,
  hourCheckIn,
  hourCheckOut,
}: {
  checkIn: string;
  checkOut: string;
  hourCheckIn: string;
  hourCheckOut: string;
}) => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <div className={style.dateAndHours}>
        <div className={style.dateAndHours_dateContainer}>
          <p>{t('stays.check_in')}: </p>
          <Image
            src={calendarWhiteIcon}
            alt="Calendar Icon"
            width={12}
            height={12}
          />
          <span className={style.dateAndHours_dates}>
            {passStringToDate(checkIn, i18n.language)}{' '}
            {hourCheckIn ? `(${hourCheckIn})` : ''}
          </span>
        </div>
        <hr className={style.dateAndHours_line} />
        <div className={style.dateAndHours_dateContainer}>
          <p>{t('stays.check_out')}:</p>
          <Image
            src={calendarWhiteIcon}
            alt="Calendar Icon"
            width={12}
            height={12}
          />
          <span className={style.dateAndHours_dates}>
            {' '}
            {passStringToDate(checkOut, i18n.language)}{' '}
            {hourCheckOut ? `(${hourCheckOut})` : ''}
          </span>
        </div>
      </div>
    </>
  );
};

export default RoomDatesAndHour;
