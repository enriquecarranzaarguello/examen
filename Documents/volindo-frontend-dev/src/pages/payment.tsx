import React, { useState, useEffect } from 'react';
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config.js';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import type { NextPageWithLayout } from '@typing/types';

import config from '@config';

import { DecodedIdToken } from '@typing/analytics';

import type { GetServerSidePropsContext } from 'next';

import {
  ModalError,
  ModalSuccess,
  SEO,
  WLPackages,
  Modal,
  GeneralButton,
} from '@components';
import { authOptions } from './api/auth/[...nextauth]';
import ModalPayment from 'src/components/modals/ModalPayment';

//Iconns
import checkBlack from '@icons/check-black.svg';
import checkGreen from '@icons/signUpIcons/check-green.svg';
import arrowBlack from '@icons/signUpIcons/arrow-right-black.svg';
import arrowWhite from '@icons/signUpIcons/arrow-right-white.svg';
import bird from '@icons/signUpIcons/bird.svg';
import jwtDecode from 'jwt-decode';

import { getLayout } from '@layouts/MainLayout';

export const getServerSideProps = async ({
  locale,
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        ['common'],
        nextI18nextConfig
      )),
      session,
    },
  };
};

const Payment: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [openError, setOpenError] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'trial' | 'complete'>('trial');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [price, setPrice] = useState(0);
  const [openPolicy, setOpenPolicy] = useState(false);

  const policies = [
    {
      title: t('paymentreg.policies.one.title'),
      description: t('paymentreg.policies.one.text'),
    },
    {
      title: t('paymentreg.policies.two.title'),
      description: t('paymentreg.policies.two.text'),
    },
    {
      title: t('paymentreg.policies.three.title'),
      description: t('paymentreg.policies.three.text'),
    },
    {
      title: t('paymentreg.policies.four.title'),
      description: t('paymentreg.policies.four.text'),
    },
    {
      title: t('paymentreg.policies.five.title'),
      description: t('paymentreg.policies.five.text'),
    },
    {
      title: t('paymentreg.policies.six.title'),
      description: t('paymentreg.policies.six.text'),
    },
    {
      title: t('paymentreg.policies.seven.title'),
      description: t('paymentreg.policies.seven.text'),
    },
    {
      title: t('paymentreg.policies.eight.title'),
      description: t('paymentreg.policies.eight.text'),
    },
    {
      title: t('paymentreg.policies.nine.title'),
      description: t('paymentreg.policies.nine.text'),
    },
    {
      title: t('paymentreg.policies.ten.title'),
      description: t('paymentreg.policies.ten.text'),
    },
  ];

  const closePolicyModal = () => {
    setOpenPolicy(false);
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCloseError = () => {
    router.push('/', '/', { locale: i18n.language });
    setOpenError(false);
  };

  const handleCloseSuccess = () => {
    router.push('/', '/', { locale: i18n.language });
    setOpenSuccess(false);
  };

  const handlePayment = (type: 'trial' | 'complete') => {
    setPaymentType(type);
    setOpenPayment(true);
  };

  useEffect(() => {
    if (router.query.success === 'true') {
      setOpenSuccess(true);
    }
  }, []);

  useEffect(() => {
    const decodedToken: DecodedIdToken = jwtDecode(session!.user.id_token);
    if (
      decodedToken['custom:subscription'] === 'Pro' ||
      decodedToken['custom:subscription'] === 'CardNotValidTrial' ||
      decodedToken['custom:subscription'] === 'Freemium'
    ) {
      setSubscriptionType('Pro');
      setDisableButton(true);
    }
  }, []);

  return (
    <>
      <SEO title={t('paymentreg.SEO_title')} />
      <ModalError open={openError} onClose={handleCloseError} />
      <ModalSuccess open={false} onClose={handleCloseSuccess} />
      {openPayment && (
        <ModalPayment
          open={openPayment}
          onClose={() => setOpenPayment(false)}
          key={paymentType}
          type={paymentType}
          time={1}
          price={price}
        />
      )}

      <Modal open={openPolicy} onClose={closePolicyModal}>
        <div className="w-full p-[20px] flex justify-center flex-col md:max-w-[600px] md:px-[40px] items-center">
          <h1 className="capitalize text-[22px] font-[650] tracking-[0.24] text-white">
            {t('paymentreg.title_subtitle_policy')}{' '}
          </h1>

          <div
            style={{ scrollbarWidth: 'none' }}
            className="relative md:max-h-[360px] md:mb-[20px] overflow-y-scroll"
          >
            {policies.map((item, index) => {
              return (
                <p key={index} className="flex flex-col gap-[10px] my-[10px]">
                  <span className="text-[22px] font-[400] leading-[24px]">
                    {index + 1} {'.  '}
                    {item.title}
                  </span>

                  <span className="text-[16px] font-[400] leading-[24px] text-white">
                    {item.description}
                  </span>
                </p>
              );
            })}
          </div>

          <GeneralButton
            text={`${t('common.close')}`}
            cb={closePolicyModal}
            originText="policyModal"
          />
        </div>
      </Modal>

      <div className="max-w-[1400px] mx-auto md:pb-[51px]">
        <div className="bg-black rounded-[48px] pt-[20px] gap-8 flex flex-col text-center justify-between">
          <div className="space-y-[2rem] ">
            <div className="flex flex-col items-center px-[35px] m-[0_auto] max-w-[500px] lg:max-w-[none] lg:mb-[46px] lg:w-[880px]">
              <h1
                data-testid="payment-title"
                className="text-[24px] lg:text-[32px] leading-[116%] font-[760] text-white scale-x-[1.2]"
              >
                {t('paymentreg.title_new')}
              </h1>
              <h2 className="leading-[normal] mt-[26px] lg:mt-[18px] font-[510] text-white">
                {t('paymentreg.title_subtitle')}
                <span
                  style={{ color: '#1070FF' }}
                  className="text[20px] mx-[5px] font-[510] cursor-pointer underline"
                  onClick={() => setOpenPolicy(true)}
                >
                  {t('paymentreg.title_subtitle_policy')}
                </span>
              </h2>
            </div>

            {config.WHITELABELPACKAGES === 'WLPAYMENT' ? (
              <WLPackages />
            ) : (
              <div className="flex flex-col items-center justify-center lg:flex-row lg:gap-[40px]">
                <div
                  className={`flex flex-col gap-4 w-full max-w-[500px] mb-[20px] bg-white text-black rounded-[24px] py-[16px] px-6 hover:scale-105 duration-500 ease-in-out lg:justify-between lg:h-[460px] lg:w-[335px] ${
                    isHovered ? 'hover:bg-white hover:text-black' : ''
                  } ${subscriptionType === 'Pro' ? 'blur-md' : ''}`}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* 1 block */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start flex-col gap-4">
                      <div className="flex items-center justify-center leading-[normal] h-[25px] w-[65px] border border-black border-1 rounded-[29px]">
                        <span className="text-black font-[590] text-[10px]">
                          FREE
                        </span>
                      </div>
                      <div className="pl-[11px]">
                        <span className="inline-block text-[24px] font-[760] scale-x-[1.3]">
                          Starter
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 text-left">
                      <div className="flex items-start gap-3">
                        <Image src={checkGreen} width={24} height={24} alt="" />{' '}
                        <span className="text-[0.775rem] leading-6">
                          {/* {t('paymentreg.license')} */}
                          Possibility to try for free with cancellation at any
                          time
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <Image src={checkGreen} width={24} height={24} alt="" />{' '}
                        <span className="text-[0.775rem] leading-6">
                          {/* {t('paymentreg.profit')} */}
                          All functionality is free for 14 days
                        </span>
                      </div>
                    </div>

                    <div className="text-left">
                      <p className="text-[14px] leading-[30px] text-[#555]">
                        {`*After the trial, it's just $15 a month.`}
                      </p>
                      <p className="m-0 text-[14px] leading-[30px] text-[#555]">
                        *We offer flexible cancellation anytime.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <p className="text-left text-[#141414] text-[16px] font-[590] shrink-0">
                      Free / 14d
                    </p>

                    <div className="flex flex-col justify-center items-center lg:w-[181px]">
                      <button
                        onClick={() => handlePayment('trial')}
                        className="flex justify-center items-center w-full h-[55px] bg-[var(--green-color)] text-black rounded-[24px] font-[590] text-base hover:bg-[#91AE52]"
                        disabled={disableButton}
                      >
                        Start Trial
                        <Image
                          className="ml-2"
                          src={arrowBlack}
                          width={24}
                          height={24}
                          alt="Arrow"
                        />
                      </button>
                      <Link
                        className="text-blue text-base font-medium underline-offset-2 underline "
                        href={''}
                      ></Link>
                    </div>
                  </div>
                </div>

                {/* 2 block */}
                <div
                  className={`flex flex-col gap-4 w-full max-w-[500px] mb-[20px] text-black bg-[var(--green-color)] rounded-[24px] py-[16px] px-6 hover:scale-105 duration-500 ease-in-out lg:justify-between lg:h-[460px] lg:w-[550px] ${
                    isHovered ? 'hover:bg-white hover:text-black' : ''
                  }`}
                  // onMouseEnter={handleHover}
                  // onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-start flex-col gap-4">
                    <div className="flex justify-between w-full">
                      <div className="flex items-center justify-center leading-[normal] h-[25px] w-[65px] border border-black border-1 rounded-[29px]">
                        <span className="text-black font-[590] text-[10px]">
                          PRO
                        </span>
                      </div>
                      <Image src={bird} width={28} height={30} alt="Bird" />
                    </div>

                    <div className="pl-[22px]">
                      <span className="inline-block text-[24px] font-[760] scale-x-[1.3]">
                        Volindo Plan
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-left">
                    <div className="flex items-start gap-3">
                      <Image src={checkBlack} width={24} height={24} alt="" />
                      <span className=" text-[0.775rem]">
                        {t('paymentreg.dashboard')}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Image src={checkBlack} width={24} height={24} alt="" />{' '}
                      <span className=" text-[0.775rem]">
                        {t('paymentreg.pricing')}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Image src={checkBlack} width={24} height={24} alt="" />{' '}
                      <span className=" text-[0.775rem] text-left">
                        {t('paymentreg.booking')}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Image src={checkBlack} width={24} height={24} alt="" />{' '}
                      <span className=" text-[0.775rem]">
                        {t('paymentreg.crm')}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Image src={checkBlack} width={24} height={24} alt="" />{' '}
                      <span className=" text-[0.775rem]">
                        {t('paymentreg.social')}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Image src={checkBlack} width={24} height={24} alt="" />{' '}
                      <span className=" text-[0.775rem]">
                        {t('paymentreg.license')}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Image src={checkBlack} width={24} height={24} alt="" />{' '}
                      <span className=" text-[0.775rem]">
                        {t('paymentreg.profit')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                    <p className="text-left text-[#141414] text-[16px] font-[590] lg:shrink-0">
                      $15 / month
                    </p>

                    <div className="flex flex-col justify-center items-center lg:w-[181px]">
                      <button
                        onClick={() => {
                          handlePayment('complete');
                          setPrice(15);
                        }}
                        className="flex justify-center items-center w-full h-[55px] bg-black text-white rounded-[24px] font-[590] text-base hover:bg-[#272727]"
                      >
                        Start now
                        <Image
                          className="ml-2"
                          src={arrowWhite}
                          width={24}
                          height={24}
                          alt="Arrow"
                        />
                      </button>
                      <Link
                        className="text-blue text-base font-medium underline-offset-2 underline "
                        href={''}
                      ></Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Payment.getLayout = getLayout;

export default Payment;
