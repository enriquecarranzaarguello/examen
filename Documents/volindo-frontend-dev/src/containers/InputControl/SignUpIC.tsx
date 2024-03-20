import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Checkbox, Form, Input, InputGroup } from 'rsuite';

import type { InputControlSignUpProps } from '@typing/proptypes';

import IconEye from '@icons/eye-white.svg';
import IconEyeClose from '@icons/eye-close-white.svg';
import EmailImg from '@icons/email-logo.svg';
import PhoneImg from '@icons/phoneProfileIcon.svg';
import UserImg from '@icons/userIcon.svg';
import LockImg from '@icons/lockGray.svg';

import { ErrorMessage } from '@components';
import { useRouter } from 'next/router';

export default function SignUpIC({
  value = { name: '', lastName: '', email: '', phone: '', password: '' },
  onChange,
  fieldError,
}: InputControlSignUpProps) {
  const { t } = useTranslation('common');
  const error = fieldError ? fieldError.object : null;
  const [visible, setVisible] = React.useState(false);

  const { email } = useRouter().query;

  if (email) {
    value.email = email.toString();
  }

  const handleChange = (key: string, val: string) => {
    if (key === 'phone') {
      if (/^\d*$/.test(val)) {
        onChange({ ...value, [key]: val });
      }
    } else {
      onChange({ ...value, [key]: val });
    }
  };

  return (
    <>
      <div>
        <div className="mb-[10px]">
          {error && error.name.hasError && (
            <ErrorMessage title={error.name.errorMessage} />
          )}
        </div>
        <div className="relative flex flex-row items-center justify-center">
          <Input
            size="lg"
            name="name"
            className="rounded-l-[90px!important] placeholder:text-[12px] !pl-[49px]"
            type="text"
            value={value.name}
            onChange={val => handleChange('name', val)}
            placeholder={t('auth.placeholder-firstName') || ''}
          />
          <Input
            size="lg"
            name="lastName"
            className="rounded-r-[90px!important] placeholder:text-[12px]"
            type="text"
            value={value.lastName}
            onChange={val => handleChange('lastName', val)}
            placeholder={t('auth.placeholder-lastName') || ''}
          />
          <Image
            alt="Email icon"
            src={UserImg}
            className="absolute left-[15px] top-[50%] translate-y-[-50%] z-10"
          />
        </div>
      </div>

      <div className="relative">
        <Input
          size="lg"
          name="email"
          className="mt-4 rounded-[90px!important] placeholder:text-[12px] !pl-[49px]"
          type="email"
          value={value.email}
          onChange={val => handleChange('email', val)}
          placeholder={t('auth.placeholder-email') || ''}
        />
        <Image
          alt="Email icon"
          src={EmailImg}
          className="absolute left-[15px] top-[50%] translate-y-[-50%] z-10"
        />
      </div>
      {error && error.email.hasError && (
        <ErrorMessage title={error.email.errorMessage} />
      )}
      <div className="relative">
        <Input
          size="lg"
          name="phone"
          max={12}
          className="mt-4 rounded-[90px!important] placeholder:text-[12px] !pl-[49px]"
          type="phone"
          value={value.phone}
          onChange={val => handleChange('phone', val)}
          placeholder={t('auth.placeholder-phone') || ''}
        />
        <Image
          alt="Phone icon"
          src={PhoneImg}
          className="absolute left-[15px] top-[50%] translate-y-[-50%] z-10"
        />
      </div>
      {value?.phone && value?.phone?.length > 12 && (
        <ErrorMessage title={t('auth.phone_error')} />
      )}
      <InputGroup inside className="my-4 rounded-[90px!important] border-none">
        <Input
          size="lg"
          name="password"
          type={visible ? 'text' : 'password'}
          className="rounded-[90px!important] placeholder:text-[12px] !pl-[49px]"
          value={value.password}
          onChange={val => handleChange('password', val)}
          placeholder={t('auth.placeholder-password') || ''}
        />
        <Image
          alt="Email icon"
          src={LockImg}
          className="absolute left-[15px] top-[50%] translate-y-[-50%] z-10"
        />
        <InputGroup.Button
          size="lg"
          onClick={() => setVisible(!visible)}
          className="h-[48px!important] bg-[transparent!important]"
        >
          <Image alt="icon" src={visible ? IconEye : IconEyeClose} />
        </InputGroup.Button>
      </InputGroup>
      {error && error.password.hasError && (
        <ErrorMessage title={error.password.errorMessage} />
      )}
      <div className="flex justify-start mb-[20px]">
        <Form.Control name="remember" accepter={Checkbox}>
          <label className="text-[12px] text-[#B5B5B5]">
            {t('auth.remember')}
          </label>
        </Form.Control>
      </div>
    </>
  );
}
