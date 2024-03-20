import { useState } from 'react';
import Image from 'next/image';

import styles from '@styles/marketing.module.scss';

import CalendarIcon from '@icons/marketingIcons/calendar.svg';
import { MarketHourDropdown, MarketingDatePicker } from '@components/marketing';
import { useTranslation } from 'react-i18next';

import { useAdFormStore } from '@components/marketing/adManager/context/NewAdContext';

const CampaignDates = () => {
  const { t } = useTranslation();
  const [openPicker, setOpenPicker] = useState(false);
  const [startDate, setStore] = useAdFormStore(store => store.startDate);
  const [endDate] = useAdFormStore(store => store.endDate);

  const handleChangeDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diference = end - start;
    const days = diference / (1000 * 60 * 60 * 24) + 1;

    setStore({
      startDate: startDate,
      endDate: endDate,
      days: days || 0,
    });
  };

  return (
    <div className={styles.inputDates__wrapper}>
      <div className={styles.inputDates__container}>
        <label>
          <span className={styles.inputAd__label}>
            {t('marketing.adManager.new.datesStart')}
          </span>
          <div className={`${styles.inputAd} ${styles['inputAd--withCursor']}`}>
            <div
              className={styles['inputAd--withIcon']}
              onClick={() => setOpenPicker(true)}
            >
              <Image src={CalendarIcon} alt="Calendar" width={16} height={16} />
              <input
                type="text"
                value={startDate}
                className={styles.inputAd__textfield}
                min={50}
                max={1000}
                readOnly
              />
            </div>
          </div>
        </label>
        {/* <MarketHourDropdown
          labelName={t('marketing.adManager.new.timeStart')}
          onChange={v => setStore({ startTime: v || '' })}
        /> */}
        <label>
          <span className={styles.inputAd__label}>
            {t('marketing.adManager.new.datesEnd')}
          </span>
          <div className={`${styles.inputAd} ${styles['inputAd--withCursor']}`}>
            <div
              className={styles['inputAd--withIcon']}
              onClick={() => setOpenPicker(true)}
            >
              <Image src={CalendarIcon} alt="Calendar" width={16} height={16} />
              <input
                type="text"
                value={endDate}
                className={styles.inputAd__textfield}
                min={50}
                max={1000}
                readOnly
              />
            </div>
          </div>
        </label>
        {/* <MarketHourDropdown
          labelName={t('marketing.adManager.new.timeEnd')}
          onChange={v => setStore({ endTime: v || '' })}
        /> */}
      </div>
      <MarketingDatePicker
        className={styles.inputDates__datesPicker}
        open={openPicker}
        onClickOutside={() => setOpenPicker(false)}
        startDate={startDate}
        endDate={endDate}
        onChange={handleChangeDate}
      />
    </div>
  );
};

export default CampaignDates;
