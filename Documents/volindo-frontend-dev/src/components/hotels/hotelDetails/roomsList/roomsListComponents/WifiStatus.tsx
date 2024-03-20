import { useTranslation } from 'next-i18next';

import Image from 'next/image';
import wifiHotelIconRoom from '@icons/hotelIcons/wifiIconBlack.svg';
import { RoomDetails } from '@typing/types';

const WifiStatus = ({ inclusion }: { inclusion: RoomDetails['Inclusion'] }) => {
  const { t } = useTranslation();

  return inclusion?.includes('Free WiFi' || 'FREE WIFI') ? (
    <div className="flex row gap-1 items-center gap-x-[7px] mb-[7px] md:mb-0">
      <Image
        src={wifiHotelIconRoom}
        alt="Free Wifi Icon"
        width={16}
        height={16}
      />
      <p className="text-[400] text-[13px]">{t('stays.free-wifi')}</p>
    </div>
  ) : null;
};

export default WifiStatus;
