import { useState, useEffect } from 'react';
import Image from 'next/image';
import config from '@config';

import masterCardIcon from '@icons/payments/mastercard.svg';
import visaCardIcon from '@icons/payments/visa.svg';

const ConektaPayment = () => {
  return (
    <>
      <div className="w-full bg-[#202020] border border-[#414141] text-[#C0C0C0] flex flex-row justify-between items-center">
        <span>1233 1234 1234 1234</span>
        <div className="flex flex-row gap-2">
          <Image
            src={masterCardIcon}
            width={20}
            height={10}
            alt="Mastercard payment"
          />
          <Image
            src={visaCardIcon}
            width={20}
            height={10}
            alt="Mastercard payment"
          />
        </div>
      </div>
    </>
  );
};

export default ConektaPayment;
