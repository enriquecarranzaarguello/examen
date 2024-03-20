import React, { useState } from 'react';
import down from '@icons/downIconwhite.svg';
import Image from 'next/image';

// eslint-disable-next-line react/prop-types
const Calendar = ({
  value = new Date(),
  onChange,
  handleApply,
  prevLang,
}: any) => {
  const [date, setDate] = useState(value);
  const [month, setMonth] = useState(value.getMonth());
  const [year, setYear] = useState(value.getFullYear());

  const handleDateSelect = (event: any) => {
    setDate(new Date(year, month, event.target.innerHTML));
    onChange(new Date(year, month, event.target.innerHTML));
    handleApply();
  };

  const renderDays = () => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();

    // creating 7 empty divs for the first row
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day" />);
    }

    // Creating divs for rest of the days
    for (let i = 1; i <= daysInMonth; i++) {
      const current = new Date(year, month, i);
      const isWeekend = current.getDay() === 6 || current.getDay() === 0;
      days.push(
        <div className="relative flex items-center justify-center">
          <div
            className={`my-2 cursor-pointer ${
              i === date.getDate() &&
              month === date.getMonth() &&
              year === date.getFullYear()
                ? 'selected flex justify-center items-center cursor-pointer absolute bg-white text-[black!important] rounded-full object-contain w-7 h-7 font-bold pt-[6.25px]'
                : ''
            }${isWeekend ? 'text-whiteLabelColor' : ''} ${
              current < new Date() ? 'text-white' : ''
            } ${current < new Date() && isWeekend ? 'text-white' : ''}`}
            onClick={handleDateSelect}
          >
            {i}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 w-full">{days.map(day => day)}</div>
    );
  };

  const months: any = {
    en: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    es: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Augosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
  };

  const weekdays: any = {
    en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
  };

  const previousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="bg-#222222 w-full h-full rounded-xl pt-3 pb-6 px-3">
      <div className="flex justify-between items-center">
        <span className="px-5 text-24.19px font-normal mb-4 flex justify-between w-full items-center">
          <button
            className=" flex items-center justify-center bg-white/20 w-8 h-8 rounded-full"
            onClick={previousMonth}
          >
            <Image alt="icon" src={down} className="rotate-90" />
          </button>
          <span className="text-[24.195px] text-white">
            {months[prevLang][month]} {year}
          </span>
          <button
            className=" flex items-center justify-center bg-white/20 w-8 h-8 rounded-full"
            onClick={nextMonth}
          >
            <Image alt="icon" src={down} className="-rotate-90" />
          </button>
        </span>
      </div>
      <div className="grid grid-cols-7 mt-3 text-xs font-bold text-white">
        {weekdays[prevLang].map((day: string, index: number) => (
          <div
            key={index}
            className={`${
              index === 0 || index === 6 ? 'text-whiteLabelColor' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="w-full grid-cols-7 grid-rows-6 justify-around text-xs my-3">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
