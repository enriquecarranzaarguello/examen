import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { ModalCustomProps } from '@typing/proptypes';
import { useTranslation } from 'next-i18next';

import IconCloseBlack from '@icons/close-black.svg';

export default function ModalPayments({
  open,
  onClose,
  text,
}: ModalCustomProps) {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
      <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] rounded-[16px] p-10">
        <button
          className="absolute -top-5 -right-6"
          onClick={() => router.push('/payment')}
        >
          <Image alt="icon" src={IconCloseBlack} />
        </button>

        <div className="flex flex-col gap-5 items-center h-full">
          <label className="text-white text-[32px] font-[760] -tracking-[.01em]">
            Hey!
          </label>

          <p className="text-white text-[16px] opacity-[.78]">{text}</p>

          <button
            className="w-full h-[48px] bg-[var(--primary-background)] rounded-[90px] text-black text-[16px] font-[760]"
            onClick={() => router.push('/payment')}
          >
            {t('subscription.ok')}
          </button>
        </div>
      </div>
    </div>
  );
}
