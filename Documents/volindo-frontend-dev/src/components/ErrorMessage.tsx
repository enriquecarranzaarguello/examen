import React from 'react';
import Image from 'next/image';

import type { ErrorMessageProps } from '@typing/proptypes';

import IconError from '@icons/error.svg';

export default function ErrorMessage({ title }: ErrorMessageProps) {
  return (
    <div className="flex items-start gap-1 text-[#FF5252] text-[12px] lg:w-[352px] mt-2">
      <Image alt="icon" src={IconError} />
      {title}
    </div>
  );
}
