import React from 'react';
import Image from 'next/image';
import IconCloseBlack from '@icons/close-black.svg';
import { ModalSupplierServiceProps } from '@typing/proptypes';

const SupplierServiceModal = ({
  open,
  onClose,
  text,
}: ModalSupplierServiceProps) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-screen h-screen lg:w-[544px] lg:h-[232px] rounded-[16px] md:px-[96px]">
        <button
          className="absolute right-7 top-[60px] lg:-top-5 lg:-right-6"
          onClick={onClose}
        >
          <Image alt="icon" src={IconCloseBlack} />
        </button>
        <div className="text-white text-center flex justify-center flex-col gap-y-3 items-center w-full h-full">
          <h2 className="text-2xl font-[760]">
            {text === 'agentService' ? 'Agent Service Fee' : 'Agent Discount'}
          </h2>
          <span className="text-base">
            {text === 'agentService'
              ? ' The agent service fee is a charge for any extra services you provide to your traveler. "exp.VIP Services" It will be included in the final proposal that the traveler receives, unlike the commission fee, which is not visible to the traveler.'
              : 'The agent discount enables you to offer the traveler any discount you wish to give them, and the corresponding amount will be deducted from the agent service fee.'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SupplierServiceModal;
