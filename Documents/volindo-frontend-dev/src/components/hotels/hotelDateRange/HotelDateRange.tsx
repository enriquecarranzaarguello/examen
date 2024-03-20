import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { passStringToDate } from '@utils/timeFunctions';
import calendarIcon from '@icons/calendarWhite.svg';
import styles from './HotelDateRange.module.scss';

const HotelDateRange = ({ data, style }: { data: any; style?: string }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={`${styles.hotelDateRange} ${style && styles[style]}`}>
      <div className={styles.hotelDateRange_range}>
        <Image src={calendarIcon} width={18} height={18} alt="Calendar" />
        <label>{passStringToDate(data.check_in, i18n.language)}</label>
      </div>

      <div className={styles.hotelDateRange_line} />

      <div className={styles.hotelDateRange_range}>
        <Image src={calendarIcon} width={18} height={18} alt="Calendar" />
        <label>{passStringToDate(data.check_out, i18n.language)}</label>
      </div>
    </div>
  );
};

export default HotelDateRange;
