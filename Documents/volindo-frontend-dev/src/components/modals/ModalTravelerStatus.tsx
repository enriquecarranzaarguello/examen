import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import type { ModalGenericProps } from '@typing/proptypes';

import IconCloseBlack from '@icons/close-black.svg';

export default function ModalTravelerStatus({
  open,
  onClose,
  onCloseAll,
  text,
  error = '',
}: ModalGenericProps) {
  const router = useRouter();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] rounded-[16px] p-10">
        <button className="absolute -top-5 -right-6" onClick={onClose}>
          <Image alt="icon" src={IconCloseBlack} />
        </button>

        <div className="flex flex-col gap-5 items-center h-full">
          {error && (
            <label className="text-white text-[32px] font-[760] -tracking-[.01em]">
              {error}
            </label>
          )}

          <p className="text-white text-[16px] opacity-[.78]">{text}</p>
          <button
            className="w-full h-[48px] bg-[var(--primary-background)] rounded-[90px] text-black text-[16px] font-[760]"
            onClick={onCloseAll}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
