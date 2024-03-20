import React from 'react';
import { useTranslation } from 'next-i18next';
import { SignUpForm } from '@containers';
import config from '@config';

export default function SignUpStati() {
  const { t } = useTranslation('common');

  const checkTitleWelcomeWL =
    config.WHITELABELNAME === 'Volindo'
      ? t('auth.Welcome')
      : t('auth.Welcome-flyway');

  return (
    <div className="flex flex-col text-white w-full md:w-[60%] xl:w-full">
      <div className="flex justify-start">
        <label className="text-[30px] scale-x-[1.2] pl-[25px] tracking-[-0.3px] font-[700] mb-[10px] md:mb-[14px]">
          {checkTitleWelcomeWL}
        </label>
      </div>
      <label className="mb-[24px] text-[16px] md:mb-40px">
        {t('auth.Welcome-start')}
      </label>
      <SignUpForm />
    </div>
  );
}
