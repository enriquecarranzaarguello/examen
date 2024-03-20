/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Calendar from './Calendar';
interface DateRangeProps {
  onChange: (value: string | number) => void;
  prevLang: string;
}
const DateRange = ({ onChange, prevLang }: DateRangeProps) => {
  const [endDate, setEndDate] = useState(new Date());

  const handleEndDateChange = (date: any) => {
    setEndDate(date);
  };
  const handleApply = () => {
    onChange(`${endDate.toISOString().substring(0, 10)}`);
  };
  return (
    <div className="flex flex-col text-center w-[312px] bg-[#222222] rounded-xl z-50">
      <Calendar
        value={endDate}
        onChange={handleEndDateChange}
        handleApply={handleApply}
        prevLang={prevLang}
      />

      <div className="relative -top-5"></div>
    </div>
  );
};
export default DateRange;
