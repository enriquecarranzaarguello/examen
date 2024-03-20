import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@context';

const RefundableFilter = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const hotelFilters = useAppSelector(state => state.hotels.filter);
  const totalPeticions = useAppSelector<number>(
    state => state.hotels.loadingTotal
  );
  const handleRefundableFilter = (refundable: string) => {
    const updateRefundable =
      refundable === hotelFilters?.refundable ? '' : refundable;
    //TODO Add dispatch to filter
  };
  return (
    <div className="flex flex-col gap-y-3">
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleRefundableFilter('refundable')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          checked={hotelFilters.refundable === 'refundable'}
        />
        <p className="text-base text-white">{t('stays.fully-refundable')}</p>
      </button>
      <button
        type="button"
        className="flex gap-2 items-center !translate-y-0"
        onClick={() => handleRefundableFilter('noRefundable')}
      >
        <input
          className="w-5 h-5 inputradiohotelM"
          type="radio"
          checked={hotelFilters.refundable === 'noRefundable'}
        />
        <p className="text-base text-white">{t('stays.non-refundable')}</p>
      </button>
    </div>
  );
};

export default RefundableFilter;
