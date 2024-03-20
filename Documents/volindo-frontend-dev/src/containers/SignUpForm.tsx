import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import ReactCodeInput from 'react-verification-code-input-2';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Form } from 'rsuite';
import jwtDecode from 'jwt-decode';
import cn from 'classnames';
import { DEFAULT_SIGN_UP_VALUES, SignUpSchema } from '@schemas';
import { setLoading, useAppDispatch, useAppSelector } from '@context';
import SearchLoader from 'src/components/SearchLoader';

import type { RecordSignUpType, SigUpType } from '@typing/types';

import IconGoogle from '@icons/google.svg';
import IconInstagram from '@icons/instagram.svg';
import IconFacebook from '@icons/facebook.svg';
import googleIcon from '@icons/google-colors.svg';
import facebookIcon from '@icons/facebook-blue.svg';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';
import IconCloseBlack from '@icons/close-black.svg';
import { SignUpIC } from '@containers';
import { DecodedIdToken } from '@typing/analytics';
import { trackSignUp, trackUserIdentify } from '@utils/analytics';
import { useVariableValue } from '@devcycle/react-client-sdk';

import config from '@config';

const CustomField = ({ ...props }) => (
  <Form.Control name="fields" accepter={SignUpIC} {...props} />
);

export default function SignUpForm() {
  const { t } = useTranslation('common');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef = React.useRef<any>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { query } = useRouter();
  const [name, setName] = useState<string | string[]>();
  const [email, setEmail] = useState<string | string[]>();
  const [loader, setLoader] = useState(false);

  const [windowSize, setWindowSize] = React.useState(0);

  const loading = useAppSelector(state => state.general.loading);
  const checkWL = useVariableValue('login-with-special-providers', false);

  const is_subscription_24_hours = useVariableValue(
    'subscription_24_hours_on_sign_up',
    false
  );

  const redirectToQuestions = useVariableValue('registration', false);

  React.useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (query.name) {
      setName(query.name);
    }
    if (query.email) {
      setEmail(query.email);
    }
  }, []);

  const formTranslations = {
    required: t('valid.required'),
    email: t('valid.email'),
    password: t('valid.password'),
    password_2: t('valid.password2'),
  };

  const [code, setCode] = React.useState<string>('');
  const [error, setError] = React.useState(false);
  const [invalid, setInvalid] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [destination, setDestination] = React.useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formError, setFormError] = React.useState<any>({});
  const [formValue, setFormValue] = React.useState<
    Record<RecordSignUpType, SigUpType>
  >(DEFAULT_SIGN_UP_VALUES);
  const handleOpen = () => {
    router.push('/signin');
  };

  const handleChangeCode = (value: string) => {
    setCode(value);
    if (value.length === 6) setInvalid(false);
  };

  const handleSubmit = async () => {
    try {
      if (formRef.current?.check()) {
        setLoader(true);
        dispatch(setLoading(true));

        const subscription = 'Free';
        const date = new Date();

        if (is_subscription_24_hours) {
          date.setDate(date.getDate() + 1);
        }

        const dateISOString = date.toISOString();

        const { codeDeliveryDetails, user } = await Auth.signUp({
          username: formValue.fields.email,
          password: formValue.fields.password,
          attributes: {
            name: formValue.fields.name,
            'custom:first_name': formValue.fields.name,
            'custom:last_name': formValue.fields.lastName,
            'custom:phone_number': formValue.fields.phone,
            'custom:subscription': subscription,
            'custom:date': dateISOString,
          },
        });

        dispatch(setLoading(false));

        if (user) {
          // ? This commented code is deprecated and should be removed when we are sure that all the
          // ? platforms will not need to confirm the user's email address.
          // setShowConfirm(true);
          // setDestination(codeDeliveryDetails.Destination);
          await registerAndSingIn();
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(setLoading(false));
      setError(true);
    } finally {
      setLoader(false);
    }
  };

  const handleShowCode = () => {
    setShowConfirm(false);
    setShowCode(true);
  };

  const registerAndSingIn = async () => {
    dispatch(setLoading(true));

    await signIn('credentials', {
      redirect: false,
      email: formValue.fields.email,
      password: formValue.fields.password,
    });

    setShowCode(false);
    setShowSuccess(true);

    dispatch(setLoading(false));
  };

  const handleSend = async () => {
    try {
      //const Auth = (await import('@aws-amplify/auth')).default;
      dispatch(setLoading(true));
      const confResponse = await Auth.confirmSignUp(
        formValue.fields.email,
        code
      );

      await registerAndSingIn();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      switch (error.code) {
        case 'CodeMismatchException':
          dispatch(setLoading(false));
          console.error(error);
          setInvalid(true);
          break;
        case 'UserLambdaValidationException':
          await registerAndSingIn();
          break;
        default:
          dispatch(setLoading(false));
          console.error(error);
      }
    }
  };

  const handleSuccess = () => {
    setShowSuccess(false);

    if (redirectToQuestions) {
      router.replace('/description');
      return;
    }
    router.push('/payment');
  };

  const singUpWithGoogle = () => {
    dispatch(setLoading(true));
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Google,
    });
  };

  const singUpWithFacebook = () => {
    dispatch(setLoading(true));
    Auth.federatedSignIn({
      provider: CognitoHostedUIIdentityProvider.Facebook,
    });
  };

  return (
    <>
      <Form
        fluid
        ref={formRef}
        formValue={formValue}
        onCheck={setFormError}
        onChange={formValues => {
          if (formValues.fields.email) {
            formValues.fields.email = formValues.fields.email.toLowerCase();
          }
          setFormValue(formValues);
        }}
        checkTrigger={'none'}
        model={SignUpSchema(formTranslations)}
        className="form-auth flex flex-col text-white xl:w-[455px!important]"
      >
        {checkWL && (
          <div className="flex flex-col mb-[15px] xl:max-w-[455px]">
            <div className="flex gap-2 mb-[15px]">
              <div
                onClick={singUpWithGoogle}
                className="w-1/2 h-[50px] flex items-center justify-center bg-[#202020] transition duration-150 hover:bg-[#272727] rounded-[24px] cursor-pointer"
              >
                <Image alt="Google" src={googleIcon} />
              </div>

              <div
                onClick={singUpWithFacebook}
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

        <CustomField fieldError={formError.fields} />

        {error && (
          <span className="text-[#FF5252] text-center -mt-6">
            {t('auth.email-exist')}
          </span>
        )}
        <button
          type="submit"
          className={cn(
            `${
              (!formValue.fields.email ||
                !formValue.fields.name ||
                !formValue.fields.lastName ||
                !formValue.fields.phone ||
                formValue.fields.phone.length > 12 ||
                !formValue.fields.password) &&
              'bg-[#262626]'
            } bg-[var(--primary-background)] rounded-[90px] py-3 mb-[78px] text-white sm:font-[550] text-[16px] lg:font-[900] hover:bg-[var(--primary-background-light)]`
          )}
          onClick={handleSubmit}
          disabled={
            !formValue.fields.email ||
            !formValue.fields.name ||
            !formValue.fields.lastName ||
            !formValue.fields.phone ||
            !formValue.fields.password ||
            formValue.fields.phone.length > 12
          }
        >
          <span className="inline-block text-white font-[650] !text-[16px] !scale-x-[1.3] tracking-[0.5px]">
            {loader ? <SearchLoader /> : t('auth.sign-up')}
          </span>
        </button>
        <p className="text-center text-[12px]">
          <label>{t('auth.account')}</label>
          <label
            className="text-whiteLabelColor font-[600] pl-2 cursor-pointer"
            onClick={handleOpen}
          >
            {t('auth.login')}
          </label>
        </p>
      </Form>
      {showConfirm && (
        <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-[51]">
          <div
            className={` ${
              windowSize <= 768 && 'h-full w-full'
            }  rounded-[16px] bg-[#141416]`}
          >
            <div className="h-full flex flex-col justify-center items-center text-center px-[20px] md:pt-[40px] md:pb-[50px] md:px-[100px]">
              <label className="text-[40px] font-[760] text-white md:scale-x-[1.4]">
                {t('auth.register-confirm-title-1')}
              </label>
              <label className="text-[40px] font-[760] text-white md:scale-x-[1.4] leading-[48px]">
                {t('auth.register-confirm-title-2')}
              </label>

              <label className="mt-4 text-[16px] font-[400] text-[#777E90]">
                {t('auth.register-confirm-text-1')}
              </label>
              <label className="text-[16px] font-[400] text-[#777E90]">
                {t('auth.register-confirm-text-2')}
              </label>

              <label className="mt-6 text-[16px] font-[400] text-white">
                {t('auth.register-confirm-text-3')}
              </label>
              <label className="text-[16px] font-[400] text-white">
                {destination}
              </label>

              <button
                className="max-w-[340px] mt-12 bg-[var(--primary-background)] rounded-[90px] w-full text-black py-4 text-[16px] font-[900] hover:bg-[var(--primary-background-light)]"
                onClick={handleShowCode}
              >
                <span className="inline-block text-black font-[760] !text-[16px] !scale-x-[1.2] tracking-[0.5px]">
                  {t('auth.continue')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      {showCode && (
        <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-[51]">
          <div
            className={` ${
              windowSize <= 768 && 'h-full w-full'
            } relative rounded-[16px] bg-[#141416] flex flex-col justify-center items-center text-center px-[20px] pt-[40px] pb-[50px] md:px-[100px]`}
          >
            {' '}
            {windowSize <= 768 ? (
              <label className="text-[30px] md:text-[40px] font-[760] text-white md:scale-x-[1.4]">
                {t('auth.register-code-1')} {t('auth.register-code-2')}
              </label>
            ) : (
              <>
                <label className="text-[40px] font-[900] text-white scale-x-[1.4]">
                  {t('auth.register-code-1')}
                </label>
                <label className="text-[40px] font-[900] text-white scale-x-[1.4]">
                  {t('auth.register-code-2')}
                </label>
              </>
            )}
            <label className="mt-4 text-[16px] font-[400] text-[#777E90]">
              {t('auth.register-code-text')}
            </label>
            <label className="text-[16px] font-[400] text-[#777E90]">
              {destination}
            </label>
            {/* Input code */}
            <div className="flex gap-2 justify-center items-center mt-8 mb-4">
              <ReactCodeInput onChange={handleChangeCode} type="number" />
            </div>
            {invalid && (
              <div className="text-center text-[#FF5252] text-[12px]">
                {t('auth.register-code-invalid')}
              </div>
            )}
            <div className="flex gap-2 justify-center items-center mt-4 w-full">
              <button
                className="w-full max-w-[340px] bg-[var(--primary-background)] rounded-[90px] p-3 text-black text-[16px] font-[900] hover:bg-[var(--primary-background-light)]"
                onClick={handleSend}
                disabled={code.length !== 6}
              >
                <span className="inline-block font-[760] text-[16px] scale-x-[1.4]">
                  {loader ? <SearchLoader /> : t('common.send')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-[51]">
          <div
            className={` ${
              windowSize <= 768 && 'h-full w-full'
            } relative rounded-[16px] bg-[#141416] flex flex-col justify-center items-center text-center px-[20px] pt-[40px] pb-[50px] md:px-[100px]`}
          >
            {' '}
            <button
              className="absolute -top-5 -right-6"
              onClick={() => setShowSuccess(false)}
            >
              <Image alt="icon" src={IconCloseBlack} />
            </button>
            {windowSize <= 768 ? (
              <>
                <label className="text-[40px] font-[900] text-white md:scale-x-[1.3]"></label>
                <label className="text-[30px] md:text-[40px] font-[900] text-white md:scale-x-[1.3]">
                  {t('auth.register-confirm-success')}{' '}
                  {t('common.successfully')}
                </label>
              </>
            ) : (
              <>
                <label className="text-[30px] md:text-[40px] font-[760] text-white md:scale-x-[1.3]">
                  {t('auth.register-confirm-success')}
                </label>
                <label className="text-[30px] md:text-[40px] font-[760] text-white md:scale-x-[1.3]">
                  {t('common.successfully')}
                </label>
              </>
            )}
            <label className="mt-4 text-[16px] font-[400] text-[#777E90]">
              {t('auth.register-confirm-success-text')}
            </label>
            <div className="flex gap-2 justify-center items-center mt-12 w-full">
              <button
                className="w-full max-w-[340px] bg-[var(--primary-background)] rounded-[90px] md:w-full text-black p-3 text-[16px] font-[900] hover:bg-[var(--primary-background-light)]"
                onClick={handleSuccess}
              >
                <span className="inline-block font-[900] text-[16px] scale-x-[1.4]">
                  {t('common.accept')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
