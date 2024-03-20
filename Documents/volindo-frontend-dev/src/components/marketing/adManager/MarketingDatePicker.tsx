import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { DayPickerRangeController } from 'react-dates';
import CaretLeft from '@icons/marketingIcons/caret-left.svg';
import CaretRight from '@icons/marketingIcons/caret-right.svg';

import moment from 'moment';
import config from '@config';

const WEEKDAYS: { [key: string]: string[] } = {
  es: ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá'],
  en: ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'],
};

type PropsType = {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  className?: string;
  open: boolean;
  onClickOutside: () => void;
};

const MarketingDatePicker = ({
  startDate,
  endDate,
  onChange,
  className,
  open,
  onClickOutside,
}: PropsType) => {
  const { i18n } = useTranslation();
  const [focusInput, setFocusInput] = useState<null | 'startDate' | 'endDate'>(
    'startDate'
  );
  const [windowSize, setWindowSize] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const renderMonthName = useCallback(
    ({ month }: { month: any }) =>
      moment(month).locale(i18n.language).format('MMMM YYYY'),
    [i18n.language]
  );

  const renderWeekDays = useCallback(
    (day: string) => {
      const localMoment = moment().locale();
      if (i18n.language && localMoment) {
        const weekday = WEEKDAYS[localMoment].indexOf(day.toLowerCase());
        return WEEKDAYS[i18n.language][weekday];
      }
    },
    [i18n.language]
  );

  const onFocusChange = (focus: any) => {
    setFocusInput(!focus ? 'startDate' : focus);
  };

  const handleChangeDates = ({
    startDate,
    endDate,
  }: {
    startDate: any;
    endDate: any;
  }) => {
    onChange(
      startDate?.format('YYYY-MM-DD') || '',
      endDate?.format('YYYY-MM-DD') || ''
    );
  };

  useEffect(() => {
    // Sorry, this is the only way :'v
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };

    if (open) document.addEventListener('click', handleClickOutside, true);
    else document.removeEventListener('click', handleClickOutside, true);
  }, [onClickOutside, open]);

  if (!open) return null;

  const checkDatepickerStyleWL =
    config.WHITELABELNAME === 'Volindo'
      ? 'datesPicker--marketing'
      : 'datesPicker--marketingWL';

  return (
    <div className={`${checkDatepickerStyleWL} ${className}`} ref={ref}>
      <DayPickerRangeController
        startDate={startDate ? moment(startDate) : null}
        endDate={endDate ? moment(endDate) : null}
        onDatesChange={handleChangeDates}
        focusedInput={focusInput}
        onFocusChange={onFocusChange}
        initialVisibleMonth={() => moment()}
        numberOfMonths={windowSize < 768 ? 1 : 2}
        hideKeyboardShortcutsPanel
        noBorder
        renderMonthElement={renderMonthName}
        renderWeekHeaderElement={renderWeekDays}
        firstDayOfWeek={1}
        isDayBlocked={day => moment().add(1, 'day').isAfter(day, 'day')}
        navPrev={<Image alt="icon" src={CaretLeft} width={24} height={24} />}
        navNext={<Image alt="icon" src={CaretRight} width={24} height={24} />}
      />
    </div>
  );
};

export default MarketingDatePicker;
