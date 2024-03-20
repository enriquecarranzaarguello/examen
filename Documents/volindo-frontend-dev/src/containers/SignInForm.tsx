import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import ReactCodeInput from 'react-verification-code-input-2';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Form, InputGroup } from 'rsuite';
import jwtDecode from 'jwt-decode';
import cn from 'classnames';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';
import Swal from 'sweetalert2';
import { DEFAULT_SIGN_IN_VALUES, SignInSchema } from '@schemas';
import { setLoading, useAppDispatch, useAppSelector } from '@context';
import SearchLoader from 'src/components/SearchLoader';
import { useVariableValue } from '@devcycle/react-client-sdk';

import type { RecordSignInType } from '@typing/types';

import IconEye from '@icons/eye-white.svg';
import IconEyeClose from '@icons/eye-close-white.svg';
import googleIcon from '@icons/google-colors.svg';
import facebookIcon from '@icons/facebook-blue.svg';
import IconError from '@icons/error.svg';

import { ModalForgotPassword } from '@components';

import EmailImg from '@icons/email-logo.svg';
import LockImg from '@icons/lockGray.svg';

export default function SignInForm() {
  const { t } = useTranslation('common');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = useRef<any>(null);
  const dispatch = useAppDispatch();

  const checkWL = useVariableValue('login-with-special-providers', false);

  const formTranslations = {
    required: t('valid.required'),
    email: t('valid.email'),
  };

  const [code, setCode] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [invalidText, setInvalidText] = useState('');
  const [openForgot, setOpenForgot] = useState(false);
  const [formValue, setFormValue] = useState<Record<RecordSignInType, string>>(
    DEFAULT_SIGN_IN_VALUES
  );
  const [loader, setLoader] = useState(false);

  const router = useRouter();

  const handleChangeCode = (value: string) => {
    setCode(value);
    if (value.length === 6) setInvalid(false);
  };

  const handleSignin = useCallback(
    async (user: { email: string; password: string; callback?: string }) => {
      setLoader(true);
      const result = await signIn('credentials', {
        redirect: false,
        email: user.email,
        password: user.password,
      });

      if (result?.ok) {
        if (user.callback) {
          router.replace(user.callback);
        } else {
          // Redirect to the homepage
          router.replace('/');
        }
      } else {
        console.error(result?.error);
        setError(true);
      }

      setLoader(false);
    },
    [router]
  );

  const handleSubmit = async () => {
    try {
      if (formRef.current?.check()) {
        handleSignin(formValue);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(setLoading(false));

      setError(true);
    }
  };

  const handleSend = async () => {
    try {
      if (code.length === 6) {
        dispatch(setLoading(true));
        dispatch(setLoading(false));
      } else {
        setInvalid(true);
        setInvalidText(t('valid.number-length') || '');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(setLoading(false));

      if (error.__type) {
        Swal.fire(
          error.__type,
          error.message || t('valid.error') || '',
          'error'
        );
      } else if (typeof error === 'string') {
        Swal.fire('!OH NO!', error || t('valid.error') || '', 'error');
      } else {
        Swal.fire('!OH NO!', t('valid.error') || '', 'error');
      }
    }
  };

  useEffect(() => {
    if (router.query?.access_token) {
      const userToken: { email: string; password: string; callback?: string } =
        jwtDecode(router.query.access_token as string);
      handleSignin(userToken).catch(() => {
        dispatch(setLoading(false));
        setLoader(false);
        setError(true);
      });
    }
  }, [router.query, handleSignin, dispatch]);

  const handleOpen = () => {
    router.push('/signup');
  };

  const singInWithGoogle = () => {
    dispatch(setLoading(true));
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
  };

  const singInWithFacebook = () => {
    dispatch(setLoading(true));
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Facebook,
    });
  };

  return (
    <>
      <ModalForgotPassword
        open={openForgot}
        onClose={() => setOpenForgot(false)}
      />

      <Form
        fluid
        ref={formRef}
        formValue={formValue}
        onChange={formValues => {
          if (formValues.email) {
            formValues.email = formValues.email.toLowerCase();
          }
          setFormValue(formValues);
        }}
        checkTrigger={'none'}
        model={SignInSchema(formTranslations)}
        className="form-auth flex flex-col text-white xl:w-[455px!important]"
      >
        {checkWL && (
          <div className="flex flex-col mb-[15px] xl:max-w-[455px]">
            <div className="flex gap-2 mb-[15px]">
              <div
                onClick={singInWithGoogle}
                className="w-1/2 h-[50px] flex items-center justify-center bg-[#202020] transition duration-150 hover:bg-[#272727] rounded-[24px] cursor-pointer"
              >
                <Image alt="Google" src={googleIcon} />
              </div>

              <div
                onClick={singInWithFacebook}
                className="w-1/2 h-[50px] flex items-center justify-center bg-[#202020] transition duration-150 hover:bg-[#272727] rounded-[24px] cursor-pointer"
              >
                <Image alt="Facebook" src={facebookIcon} />
              </div>
            </div>
            <div className="text-center text-[12px] font-[510]">
              {t('auth.or')}
            </div>
          </div>
        )}

        <div>
          <div className="relative">
            <Form.Control
              data-testid="email"
              size="lg"
              type="email"
              name="email"
              className="mb-4 rounded-[90px!important] placeholder:text-[12px] !pl-[49px]"
              placeholder={t('auth.placeholder-email')}
            />

            <Image
              alt="Email icon"
              src={EmailImg}
              className="absolute left-[15px] top-[50%] translate-y-[-50%] z-10"
            />
          </div>
          <InputGroup
            inside
            className="mb-4 rounded-[90px!important] border-none"
          >
            <Form.Control
              data-testid="password"
              size="lg"
              name="password"
              type={visible ? 'text' : 'password'}
              className="rounded-[90px!important] placeholder:text-[12px] !pl-[49px]"
              placeholder={t('auth.placeholder-password')}
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
          <div className="flex justify-start mt-3 mb-[20px]">
            <label
              className="cursor-pointer"
              onClick={() => setOpenForgot(true)}
            >
              {t('auth.forgot')}
            </label>
          </div>
        </div>

        {error && (
          <div className="flex gap-1 items-start mb-2">
            <Image alt="icon" src={IconError} className="mt-[3px]" />
            <label className="text-[#FF5252]">
              {t('valid.email-password')}
            </label>
          </div>
        )}

        <button
          data-testid="submit-login"
          type="submit"
          className={cn(
            `${
              (!formValue.email || !formValue.password) &&
              '[var(--primary-background)]'
            } bg-[var(--primary-background)] rounded-[90px] py-3 mb-[78px] text-white sm:font-[550] text-[16px] lg:font-[760] hover:bg-[var(--primary-background-light)]`
          )}
          onClick={handleSubmit}
          disabled={!formValue.email || !formValue.password}
        >
          <span className="inline-block text-white font-[700] !text-[16px] !scale-x-[1.2] tracking-[0.5px]">
            {loader ? <SearchLoader /> : t('auth.continue')}
          </span>
        </button>

        <p className="text-center text-[12px]">
          <label>{t('auth.not-account')}</label>
          <label
            className="text-whiteLabelColor font-[600] pl-2 cursor-pointer"
            onClick={handleOpen}
          >
            {t('auth.sign-up')}
          </label>
        </p>
      </Form>

      {showCode && (
        <div className="fixed inset-0 bg-[#00000066] flex justify-center items-center z-[1060] text-base">
          <div className="rounded-md bg-white grid grid-cols-1 p-4 justify-self-center self-center">
            <label className="text-2xl font-bold text-center">
              {t('auth.register-code')}
            </label>

            <div className="flex gap-2 justify-center items-center mt-8 mb-4">
              <ReactCodeInput onChange={handleChangeCode} type="number" />
            </div>

            {invalid && (
              <div className="invalid flex justify-center items-center">
                {invalidText}
              </div>
            )}

            <div className="flex gap-2 justify-center items-center mt-4">
              <button
                className="bg-[#3D6DEA] rounded-[90px] p-3 text-[#000000] text-[16px] font-[760] w-32"
                onClick={handleSend}
              >
                {t('common.send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
