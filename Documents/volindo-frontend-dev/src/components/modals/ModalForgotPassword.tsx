import React from 'react';
import Image from 'next/image';

import type { ModalGeneralProps } from '@typing/proptypes';

import { ForgotPasswordForm } from '@containers';

import IconClose from '@icons/close-white.svg';
import { TravelerType } from '@typing/types';

export default function ModalForgotPassword({
  open,
  onClose,
}: ModalGeneralProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#23262F]/[.8] backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#141416] p-4 rounded-[16px] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] relative">
        {
          <button className="absolute -top-5 -right-6" onClick={onClose}>
            <Image alt="icon" src={IconClose} />
          </button>
        }

        <ForgotPasswordForm
          onClose={onClose}
          id_token={''}
          countries={[]}
          traveler_status={{
            slug: '',
            description: '',
            items: [],
          }}
          travelers={[]}
          setTravelers={function (value: TravelerType[]): void {
            throw new Error('Function not implemented.');
          }}
        />
      </div>
    </div>
  );
}
