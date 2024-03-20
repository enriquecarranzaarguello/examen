import { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import staysIcon from '@icons/stays.svg';
import flightsIcon from '@icons/flights.svg';
import carIcon from '@icons/car.svg';
import { useTranslation } from 'react-i18next';

const LocationTabs: FC<{
  activeTab: 'Stays' | 'Flights' | 'Suppliers';
  className?: string;
}> = ({ activeTab, className = '' }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div
      className={`hidden md:flex justify-between shrink-0 h-[48px] bg-[#141414] rounded-[24px] mb-5 lg:mb-0 w-[270px] ${className}`}
    >
      <button
        onClick={activeTab === 'Stays' ? () => {} : () => router.push('/')}
        className={`font-[600] px-6 flex gap-2 items-center ${
          activeTab === 'Stays'
            ? 'bg-white text-[#2F3447] rounded-[24px]'
            : 'text-white opacity-[.48]'
        }`}
      >
        <Image
          alt="icon"
          src={staysIcon}
          className={`${activeTab !== 'Stays' && 'invert'}`}
        />
        {activeTab === 'Stays' ? t('home.stays') : ''}
      </button>

      <button
        onClick={activeTab === 'Flights' ? () => {} : () => router.push('/')}
        className={`font-[600] px-6 flex gap-2 items-center ${
          activeTab === 'Flights'
            ? 'bg-white text-[#2F3447] rounded-[24px]'
            : 'text-white opacity-[.48]'
        }`}
      >
        <Image
          alt="icon"
          src={flightsIcon}
          className={`${activeTab === 'Flights' && 'invert'}`}
        />
        {activeTab === 'Flights' ? t('home.flights') : ''}
      </button>
      <button
        onClick={() => router.push('/suppliers')}
        className={`font-[600] px-6 flex gap-2 items-center invert ${
          activeTab === 'Suppliers'
            ? 'bg-white text-[#2F3447] rounded-[24px]'
            : 'text-white opacity-[.48]'
        }`}
      >
        <Image
          alt="icon"
          src={carIcon}
          className={`${activeTab === 'Suppliers' && 'invert'}`}
        />
      </button>
    </div>
  );
};

export default LocationTabs;
