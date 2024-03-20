import { useTranslation } from 'next-i18next';

import Image from 'next/image';
import accesibilityHotelIcon from '@icons/hotelIcons/accesibilityHotel.svg';
import { RoomDetails } from '@typing/types';

const AccessibilityStatus = ({ name }: { name: RoomDetails['Name'] }) => {
  const { t } = useTranslation();

  const accessibleText = name.split(',');
  const hasAccessible = accessibleText.some(
    (part: string) => part.includes('Accessible') || part.includes('Mobility')
  );
  const hasAccessibleMobilityTub = accessibleText.some(
    (part: string) =>
      part.includes('Accessible Mobility Tub') || part.includes('Tub')
  );
  const hasAccessibleMobilityRollInShower = accessibleText.some(
    (part: string) =>
      part.includes('Accessible Mobility Roll-In Shower') ||
      part.includes('Roll-In Shower')
  );

  let messageKey = '';

  if (hasAccessible) {
    messageKey = 'Room Accesible';
  } else if (hasAccessibleMobilityTub) {
    messageKey = 'Room_Accesible Tub';
  } else if (hasAccessibleMobilityRollInShower) {
    messageKey = 'Room Accesible Roll';
  }

  return messageKey ? (
    <div className="flex row gap-1 items-center mb-[7px] md:mb-0">
      <Image
        className="mr-[7px]"
        src={accesibilityHotelIcon}
        alt="Room Accessible"
        width={16}
        height={16}
      />
      <p className="text-[400] text-[13px]">{t(messageKey)}</p>
    </div>
  ) : null;
};

export default AccessibilityStatus;
