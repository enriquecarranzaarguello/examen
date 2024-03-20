import { FC, useEffect, useState } from 'react';
import pin from '@icons/pin-gray-light.svg';
import filterIcon from '@icons/filterIcon.svg';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { getAirportByCode } from '@utils/axiosClients';
import { formatDate, passStringToDate } from '@utils/timeFunctions';

const ActualFlight: FC<{
  onClickFilter?: () => void;
  className?: string;
  index?: number;
  start_location: string;
  end_location: string;
  start_date: Date | string | null;
  end_date?: Date | string | null;
  number_of_travelers?: number;
}> = ({
  onClickFilter = () => {},
  className = '',
  index = 0,
  start_location,
  end_location,
  start_date,
  end_date,
  number_of_travelers,
}) => {
  const { t, i18n } = useTranslation();

  const [startLocal, setStartLocal] = useState('');
  const [endLocal, setEndLocal] = useState('');

  useEffect(() => {
    const setAirportLocalizations = async () => {
      Promise.all([
        getAirportByCode(start_location),
        getAirportByCode(end_location),
      ])
        .then(([startRes, endRes]) => {
          setStartLocal(startRes.data?.city);
          setEndLocal(endRes.data?.city);
        })
        .catch(err => {
          console.error('Error getting airport data', err);
        });
    };

    if (start_location && end_location) setAirportLocalizations();
  }, [start_location, end_location]);

  const handleDate = (date: Date | string | null) => {
    if (date !== null) {
      return typeof date === 'string'
        ? passStringToDate(date, i18n.language)
        : formatDate(date, i18n.language);
    } else return '';
  };

  return (
    <div
      className={`flex px-3 items-center bg-[#212020] rounded-full w-full ${className}`}
    >
      <div className="px-4">
        <Image src={pin} width={12} height={16} alt="Pin" />
      </div>
      <div className="flex-1 py-2.5 flex flex-col">
        <span className="text-base text-white">
          {startLocal} - {endLocal}
        </span>
        <span className="text-[12px] text-[#FFFFFF63]">
          {handleDate(start_date)}
          {end_date ? ` - ${handleDate(end_date)}` : ''}
          {number_of_travelers && index === 0
            ? `, ${number_of_travelers} ${t('stays.travelers')}`
            : ''}
        </span>
      </div>
      {index === 0 ? (
        <button className="p-3 invert" onClick={onClickFilter}>
          <Image src={filterIcon} width={20} height={14} alt="Filter" />
        </button>
      ) : null}
    </div>
  );
};

export default ActualFlight;
