import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import type { ModalNotStaysProps } from '@typing/proptypes';

import BGSuccess from '@images/bg-success.svg';

import { Modal } from '@components';
import { useRouter } from 'next/router';

export default function ModalSuccess({ open, onClose }: ModalNotStaysProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative flex flex-col justify-between items-center w-[613px] h-[492px] bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] rounded-[16px] py-10">
        <Image alt="" src={BGSuccess} className="absolute" />

        <div className="flex flex-col justify-center items-center gap-1 mt-[100px] z-10">
          <label className="text-[48px] text-[#FCFCFD] font-[760] -tracking-[.02]">
            Congratulation!
          </label>
          <label className="text-[#777E91] text-[16px]">
            {t('auth.payment-success')}
          </label>
        </div>

        <button
          type="button"
          className="bg-whiteLabelColor rounded-[90px] text-[16px] text-black font-[760] h-[48px] w-[352px] z-10"
          onClick={() => router.push('/')}
        >
          {t('common.enter')}
        </button>

        <div className="flex gap-2 justify-center z-10">
          <label className="text-[white] text-[12px]">
            {t('auth.payment-success-text-1')}
          </label>
          <label className="text-[#7A7A7A] text-[12px]">
            {t('auth.payment-success-text-2')}
          </label>
        </div>
      </div>
    </Modal>
  );
}
