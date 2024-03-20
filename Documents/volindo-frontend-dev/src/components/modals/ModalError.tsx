import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import type { ModalNotStaysProps } from '@typing/proptypes';

import IconCloseBlack from '@icons/close-black.svg';

export default function ModalError({ open, onClose }: ModalNotStaysProps) {
  if (!open) return null;

  const { t } = useTranslation('common');

  return (
    <div className="fixed inset-0 bg-[#23262F]/[.9] flex justify-center items-center z-50">
      <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-[544px] h-[432px] rounded-[16px] px-[96px] z-40">
        <button
          className="absolute right-7 top-[60px] lg:-top-5 lg:-right-6"
          onClick={onClose}
        >
          <Image alt="icon" src={IconCloseBlack} />
        </button>

        <div className="flex flex-col justify-between items-center h-full pt-[86px] pb-[68px]">
          <div>
            <p className="mb-[25px] text-white text-[24px] -tracking-[.01] font-[760]">
              {t('stays.error-title')}
            </p>
            <p className="text-[16px] text-[#ffffff]">
              <label className="opacity-[.5]">{t('stays.error-text-1')}</label>
              <label>{t('stays.error-text-2')}</label>
            </p>
          </div>

          <button
            className="w-full h-full max-h-[48px] bg-[var(--primary-background)] rounded-[90px] text-black text-[16px] font-[760]"
            onClick={onClose}
          >
            {t('common.enter')}
          </button>
        </div>
      </div>
    </div>
  );
}
