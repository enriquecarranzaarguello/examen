import React from 'react';
import { GuestSummaryProps } from '@typing/proptypes';
import { useTranslation } from 'react-i18next';

const GuestSummary = ({ rooms, adults, childs }: GuestSummaryProps) => {
  const { t } = useTranslation();
  let adultsText = '';
  if (adults > 0) {
    adultsText = adults === 1 ? t('stays.adult') : t('stays.adults');
  }
  let childrenText = '';
  if (childs > 0) {
    childrenText = childs === 1 ? t('stays.child') : t('stays.children');
  }

  return (
    <p className="text-[14px] text-black font-[400] mb-[0.25rem]">
      {rooms <= 1
        ? `${rooms} ${t('stays.room')}`
        : `${rooms} ${t('stays.rooms')}`}
      {adultsText && `, ${adults} ${adultsText}`}
      {childrenText && `, ${childs} ${childrenText}`}
    </p>
  );
};

export default GuestSummary;
