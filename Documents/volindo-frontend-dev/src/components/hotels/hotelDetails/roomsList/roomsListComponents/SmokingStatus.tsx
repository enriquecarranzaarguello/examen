import { useTranslation } from 'next-i18next';

import Image from 'next/image';
import noSmokingRoomsHotelIcon from '@icons/hotelIcons/noSmokingIcon.svg';
import smokingAreasHotelIcon from '@icons/hotelIcons/smokingAreasHotel.svg';
import { RoomDetails } from '@typing/types';

const SmokingStatus = ({ name }: { name: RoomDetails['Name'] }) => {
  const { t } = useTranslation();

  if (
    !name.includes('Smoking') &&
    !name.includes('NonSmoking') &&
    !name.includes('Non Smoking')
  ) {
    return null;
  }

  const smokingText = name.split(',');
  const noSmoking = smokingText.some(
    (part: string) =>
      part.includes('NonSmoking') || part.includes('Non Smoking')
  );

  return (
    <div className="flex row gap-x-[7px] items-center mb-[7px] md:mb-0">
      <Image
        src={noSmoking ? noSmokingRoomsHotelIcon : smokingAreasHotelIcon}
        alt={noSmoking ? 'Non Smoking allowed ' : 'Smoking allowed'}
        width={16}
        height={16}
      />
      <p className="text-[400] text-[13px]">
        {noSmoking ? t('stays.noSmoking') : t('stays.smokingAllow')}
      </p>
    </div>
  );
};

export default SmokingStatus;
