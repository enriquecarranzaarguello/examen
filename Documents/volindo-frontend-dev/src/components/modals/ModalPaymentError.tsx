import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import { Modal } from '@components';
import type { ModalPaymentProps } from '@typing/proptypes';

import IconCloseBlack from '@icons/close-black.svg';

export default function ModalPaymentError({
  open,
  onClose,
}: ModalPaymentProps) {
  if (!open) return null;

  const { t } = useTranslation('common');

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col justify-between items-center h-full pt-[86px] pb-[68px] p-10">
        <div>
          <p className="mb-[25px] text-white text-[26px] -tracking-[.01] font-[760] capitalize">
            {t('suppliers.stripe_error')}
          </p>
          <p className="text-[16px] text-[#ffffff] mb-5">
            <label className="opacity-[.5]">{t('stays.error-text-1')}</label>
            <label>{t('stays.error-text-2')}</label>
          </p>
        </div>

        <button
          className="w-full h-full min-h-[48px] bg-[var(--primary-background)] rounded-[90px] text-black text-[16px] font-[760]"
          onClick={onClose}
        >
          {t('common.enter')}
        </button>
      </div>
    </Modal>
  );
}
