import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import type { ModalNotStaysProps } from '@typing/proptypes';

import IconCloseBlack from '@icons/close-black.svg';

export default function ModalNotStays({ open, onClose }: ModalNotStaysProps) {
  if (!open) return null;

  const { t } = useTranslation('common');

  return (
    <div className="fixed inset-0 bg-[#23262F]/[.9] flex justify-center items-center z-50">
      <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-[544px] h-[373px] rounded-[16px] px-[96px]">
        <button
          className="absolute right-7 top-[60px] lg:-top-5 lg:-right-6"
          onClick={onClose}
        >
          <Image alt="icon" src={IconCloseBlack} />
        </button>

        <div className="flex flex-col justify-between items-center h-full pt-[77px] pb-[54px]">
          <div>
            <label className="text-white text-[32px] font-[760] -tracking-[.01em]">
              Oops
            </label>
            <p className="mt-[21px] text-white text-[16px] opacity-[.78]">
              {t('stays.not-found')}
            </p>
          </div>

          <button
            className="w-full h-full max-h-[48px] bg-[var(--primary-background)] rounded-[90px] text-black text-[16px] font-[760]"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
