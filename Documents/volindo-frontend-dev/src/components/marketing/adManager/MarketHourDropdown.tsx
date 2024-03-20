import { useMemo, useState, useEffect, useRef } from 'react';
import styles from '@styles/marketing.module.scss';
import Image from 'next/image';

import ClockIcon from '@icons/marketingIcons/clock.svg';

const MarketHourDropdown = ({
  labelName,
  value,
  onChange,
}: {
  labelName: string;
  value?: string;
  onChange?: (value: string | null) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || '');
  const refDropdown = useRef<HTMLDivElement>(null);

  const hours = useMemo(() => {
    const timesAM = [];
    const timesPM = [];

    for (let hour = 1; hour <= 12; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourString =
          hour === 12 ? '12' : hour.toString().padStart(2, '0');
        const minuteString = minute.toString().padStart(2, '0');
        timesAM.push(`${hourString}:${minuteString} AM`);
        timesPM.push(`${hourString}:${minuteString} PM`);
      }
    }
    return timesAM.concat(timesPM);
  }, []);

  const handleSelection = (option: string) => {
    setSelectedOption(option);
    if (onChange) onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (event: any, value: string) => {
    if (event.key === 'Enter') {
      handleSelection(value);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (refDropdown.current && !refDropdown.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener('click', handleClickOutside, true);
    else document.removeEventListener('click', handleClickOutside, true);
  }, [open]);

  return (
    <div>
      <span className={styles.inputAd__label}>{labelName}</span>
      <div className={styles.inputAd}>
        <div
          className={`${styles['inputAd--withIcon']} ${styles['inputAd--withCursor']}`}
          onClick={() => setOpen(true)}
        >
          <Image src={ClockIcon} alt="Clock" width={24} height={24} />
          <input
            type="text"
            className={styles.inputAd__textfield}
            value={selectedOption}
            readOnly
          />
        </div>
      </div>
      <div
        ref={refDropdown}
        className={`${styles.inputAd__dropdown} ${
          styles['inputAd__dropdown--hour']
        } ${open ? styles.active : ''}`}
      >
        <div className={`${styles['inputAd__dropdown--hour--wrapper']}`}>
          {hours.map(hour => (
            <span
              key={hour}
              role="button"
              tabIndex={0}
              onKeyDown={e => handleKeyDown(e, hour)}
              onClick={() => handleSelection(hour)}
            >
              {hour}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketHourDropdown;
