import { ErrorsProp } from '@typing/proptypes';
import React from 'react';
import Image from 'next/image';
import IconCloseBlack from '@icons/close-black.svg';

const ModelGeneralError = ({ open, onClose, title }: ErrorsProp) => {
  return (
    <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
      <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] rounded-[16px] p-10  h-auto max-h-[80%]">
        <button className="absolute -top-5 -right-5 " onClick={onClose}>
          <Image alt="icon" src={IconCloseBlack} />
        </button>
        {title}
      </div>
    </div>
  );
};

export default ModelGeneralError;
