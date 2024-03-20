import React from 'react';
import { useTranslation } from 'next-i18next';
import ReactCodeInput from 'react-verification-code-input-2';
import Image from 'next/image';
import { Form, InputGroup } from 'rsuite';
import { setLoading, useAppDispatch } from '@context';
import {
  DEFAULT_FORGOT_PASSWORD_VALUES,
  DEFAULT_CONFIRM_FORGOT_PASSWORD_VALUES,
  ForgotPasswordSchema,
  ConfirmForgotPasswordSchema,
} from '@schemas';

import type { ForgotPasswordFormProps } from '@typing/proptypes';
import type {
  RecordConfirmForgotPasswordType,
  RecordForgotPasswordType,
} from '@typing/types';

import IconEye from '@icons/eye-white.svg';
import IconEyeClose from '@icons/eye-close-white.svg';
import IconCloseBlack from '@icons/close-black.svg';

export default function ForgotPasswordForm({
  onClose,
}: ForgotPasswordFormProps) {
  const { t } = useTranslation('common');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = React.useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formCRef = React.useRef<any>(null);
  const dispatch = useAppDispatch();

  const formTranslations = {
    required: t('valid.required'),
    email: t('valid.email'),
  };

  const formTranslationsC = {
    required: t('valid.required'),
    password_1: t('valid.password'),
    password_2: t('valid.password2'),
  };

  const [code, setCode] = React.useState<string>('');
  const [invalid, setInvalid] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [destination, setDestination] = React.useState('');
  const [formValue, setFormValue] = React.useState<
    Record<RecordForgotPasswordType, string>
  >(DEFAULT_FORGOT_PASSWORD_VALUES);
  const [formValueC, setFormValueC] = React.useState<
    Record<RecordConfirmForgotPasswordType, string>
  >(DEFAULT_CONFIRM_FORGOT_PASSWORD_VALUES);

  const handleSubmit = async () => {
    try {
      const Auth = (await import('@aws-amplify/auth')).default;

      if (formRef.current?.check()) {
        dispatch(setLoading(true));

        Auth.forgotPassword(formValue.email)
          .then(
            (data: {
              CodeDeliveryDetails: {
                Destination: React.SetStateAction<string>;
              };
            }) => {
              setShowConfirm(true);
              setDestination(data.CodeDeliveryDetails.Destination);
            }
          )
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((err: any) => console.log(err));

        dispatch(setLoading(false));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(setLoading(false));
    }
  };

  const handleShowCode = () => {
    setShowConfirm(false);
    setShowCode(true);
  };

  const handleSend = async () => {
    try {
      const Auth = (await import('@aws-amplify/auth')).default;

      if (formCRef.current?.check()) {
        dispatch(setLoading(true));

        Auth.forgotPasswordSubmit(formValue.email, code, formValueC.password_1)
          .then(() => {
            setShowCode(false);
            setShowSuccess(true);
          })
          .catch(() => setInvalid(true));

        dispatch(setLoading(false));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(setLoading(false));
      setInvalid(true);
    }
  };

  return (
    <>
      <Form
        ref={formRef}
        formValue={formValue}
        onChange={formValues => {
          if (formValues.email) {
            formValues.email = formValues.email.toLowerCase();
          }
          setFormValue(formValues);
        }}
        model={ForgotPasswordSchema(formTranslations)}
        className="form-auth flex flex-col gap-4 mt-4"
      >
        <Form.Control
          size="lg"
          name="email"
          type="email"
          placeholder={t('auth.placeholder-email')}
          className="text-base"
        />

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="bg-[#3D6DEA] rounded-[90px] py-2 px-4 text-[#000000] text-[16px] font-[760]"
            onClick={handleSubmit}
          >
            {t('common.send')}
          </button>

          <button
            type="button"
            className="bg-white rounded-[90px] py-2 px-4 text-[#000000] text-[16px] font-[760]"
            onClick={onClose}
          >
            {t('common.close')}
          </button>
        </div>
      </Form>

      {showConfirm && (
        <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-[51]">
          <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] rounded-[16px] pt-[38px] pb-[52px] px-[96px]">
            {/*<button className="absolute -top-5 -right-6" onClick={() => setShowConfirm(false)}>
              <Image alt="icon" src={IconCloseBlack} />
            </button>*/}

            <div className="flex flex-col items-center">
              <label className="text-[40px] font-[760] text-white leading-5">
                {t('auth.register-confirm-title-1')}
              </label>

              <label className="text-[40px] font-[760] text-white">
                {t('auth.register-confirm-title-2')}
              </label>

              <label className="mt-3 text-[16px] font-[400] text-white">
                {t('auth.register-confirm-text-1')}
              </label>

              <label className="text-[16px] font-[400] text-white">
                {t('auth.register-confirm-text-2')}
              </label>

              <label className="mt-10 text-[16px] font-[400] text-white">
                {t('auth.register-confirm-text-3')}
              </label>

              <label className="text-[16px] font-[400] text-white">
                {destination}
              </label>

              <button
                className="mt-10 bg-[#3D6DEA] rounded-[90px] w-full text-black py-4 text-[16px] font-[760]"
                onClick={handleShowCode}
              >
                {t('auth.continue')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCode && (
        <Form
          fluid
          ref={formCRef}
          formValue={formValueC}
          onChange={setFormValueC}
          model={ConfirmForgotPasswordSchema(formTranslationsC)}
          className="form-auth"
        >
          <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-[51] text-base">
            <div className="relative rounded-md bg-[#141416] grid grid-cols-1 p-4 justify-self-center self-center gap-6">
              {/*<button className="absolute -top-5 -right-6" onClick={() => setShowCode(false)}>
                <Image alt="icon" src={IconCloseBlack} />
              </button>*/}

              <InputGroup
                inside
                className="rounded-[90px!important] border-none"
              >
                <Form.Control
                  size="lg"
                  name="password_1"
                  type={visible1 ? 'text' : 'password'}
                  placeholder={t('auth.placeholder-password-new')}
                  className="text-base"
                />

                <InputGroup.Button
                  size="lg"
                  onClick={() => setVisible1(!visible1)}
                  className="h-[48px!important] bg-[transparent!important]"
                >
                  <Image alt="icon" src={visible1 ? IconEye : IconEyeClose} />
                </InputGroup.Button>
              </InputGroup>

              <InputGroup
                inside
                className="rounded-[90px!important] border-none"
              >
                <Form.Control
                  size="lg"
                  name="password_2"
                  type={visible2 ? 'text' : 'password'}
                  placeholder={t('auth.placeholder-password-confirm')}
                  className="text-base"
                />

                <InputGroup.Button
                  size="lg"
                  onClick={() => setVisible2(!visible2)}
                  className="h-[48px!important] bg-[transparent!important]"
                >
                  <Image alt="icon" src={visible2 ? IconEye : IconEyeClose} />
                </InputGroup.Button>
              </InputGroup>

              <div className="flex flex-col gap-6">
                <label className="text-[40px] font-[760] text-center text-white">
                  {t('auth.register-code-1')}
                </label>
                <label className="text-[40px] font-[760] text-center text-white">
                  {t('auth.register-code-2')}
                </label>
              </div>

              <div className="flex gap-2 justify-center items-center mb-4">
                <ReactCodeInput
                  onChange={value => setCode(value)}
                  type="number"
                />
              </div>

              {invalid && (
                <span className="text-[#FF5252] text-center -mt-6">
                  {t('auth.code-invalid')}
                </span>
              )}

              <div className="flex gap-2 justify-center items-center">
                <button
                  type="submit"
                  className="bg-[#3D6DEA] rounded-[90px] p-3 text-[#000000] text-[16px] font-[760] w-32"
                  onClick={handleSend}
                  disabled={code.length !== 6}
                >
                  {t('common.send')}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-[51]">
          <div className="relative rounded-[16px] bg-[#141416] grid grid-cols-1 p-4 justify-self-center self-center">
            <button
              className="absolute -top-5 -right-6"
              onClick={() => setShowSuccess(false)}
            >
              <Image alt="icon" src={IconCloseBlack} />
            </button>

            <label className="text-[40px] font-[760] text-center text-white">
              {t('auth.register-confirm-success')}
            </label>
            <label className="text-[40px] font-[760] text-center text-white">
              {t('common.successfully')}
            </label>

            <label className="mt-3 text-[16px] font-[400] text-center text-white">
              {t('auth.register-confirm-success-text')}
            </label>

            <div className="flex gap-2 justify-center items-center mt-4">
              <button
                className="bg-[#3D6DEA] rounded-[90px] p-3 text-[#000000] text-[16px] font-[760] w-32"
                onClick={() => setShowSuccess(false)}
              >
                {t('common.accept')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
