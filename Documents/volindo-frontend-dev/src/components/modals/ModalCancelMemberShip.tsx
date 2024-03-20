import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { ModalGeneralProps } from '@typing/proptypes';
import Airtable from 'airtable';
import IconCloseBlack from '@icons/close-black.svg';
import config from '@config';
import { DecodedIdToken } from '@typing/analytics';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

export default function ModalCancelMemberShip({
  open,
  onClose,
}: ModalGeneralProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [mostValuableService, setMostValuableService] = useState<string>('');
  const [cancelAgreement, setCancelAgreement] = useState(false);
  const { data: session, update } = useSession();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleReturn = () => {
    router.push({
      pathname: '/',
    });
  };
  const handleCancelSubscription = () => {};

  const handleClick = () => {
    const recipientEmail = 'support@volindo.com';
    const subject = 'Hello, Cancel Membership!';
    const body = 'Hello, there Volindo I need help cancelling my Membership?';
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  };

  const handleCancelReasonSelection = (reason: string) => {
    setCancelReason(reason);
  };

  const handleMostValuableServiceSelection = (service: string) => {
    setMostValuableService(service);
  };

  const handleFormSubmit = () => {
    const decodedToken: DecodedIdToken = jwtDecode(session!.user.id_token);
    const token = session!.user.id_token;

    const QuestionOne = cancelReason;

    const QuestionTwo = mostValuableService;

    const base = new Airtable({ apiKey: config.airtable_api_key }).base(
      'appKonNLxX3BNemDO'
    );

    const createRecord = () =>
      new Promise((resolve, reject) => {
        base('SubscriptionCancel').create(
          [
            {
              fields: {
                Email: decodedToken.email,
                QuestionOne: QuestionOne,
                QuestionTwo: QuestionTwo,
              },
            },
          ],
          (err: Error | null, record: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(record);
            }
          }
        );
      });

    createRecord();

    const auth = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${config.api}/payments/cancelSubscription`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          questionOne: QuestionOne,
          questionTwo: QuestionTwo,
        },
      })
      .then(response => {
        update();
        router.push({
          pathname: '/',
        });
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  };

  if (!open) return null;

  const cancelReasonButtons = [
    {
      answer: 'I have a better platform that I’m using.',
      text: 'cancel.questiona-one',
    },
    {
      answer: 'The prices are not good enough.',
      text: 'cancel.questiona-two',
    },
    {
      answer: 'I can not use the platform.',
      text: 'cancel.questiona-three',
    },
    {
      answer: 'Other',
      text: 'cancel.questiona-four',
    },
  ];

  const mostValuableServiceButtons = [
    {
      answer: 'Hotel',
      text: 'Hotel',
    },
    {
      answer: 'Supplier',
      text: 'cancel.questionb-one',
    },
    {
      answer: 'Flights',
      text: 'cancel.questionb-two',
    },
    {
      answer: 'CRM',
      text: 'CRM',
    },
    {
      answer: 'Agent profile',
      text: 'cancel.questionb-three',
    },
    {
      answer: 'None',
      text: 'cancel.questionb-four',
    },
  ];

  const createButtons = (
    onClick: (select: string) => void,
    answer: string,
    text: string,
    selectedAnswer: string
  ) => (
    <button
      onClick={() => onClick(answer)}
      className={`${
        selectedAnswer === answer
          ? 'bg-whiteLabelColor text-white'
          : 'bg-[#141416] text-[#777E90]'
      } flex items-center gap-[18px] text-[14px] text-left tracking-[0.35px] font-[510] w-full max-w-[441px] px-[11px] py-[12px] border-[1.5px] border-[#777E90] rounded-[32px] md:text-[16px]`}
      style={{ flexShrink: 0 }}
    >
      <span
        className={`${
          selectedAnswer === answer ? 'opacity-1 text-black' : 'opacity-[0.6]'
        } flex items-center justify-center min-w-[24px] h-[24px] bg-white rounded-[10px]`}
      >
        {selectedAnswer === answer && (
          <svg
            viewBox="0 0 24 24"
            className="w-[70%] h-[70%] fill-whiteLabelColor"
          >
            <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
          </svg>
        )}
      </span>
      {t(text)}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
      <div className="relative flex items-center px-[20px] bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] rounded-[16px] pt-[21px] pb-[50px] h-full w-full min-w-[250px] md:w-auto md:min-w-[544px] md:max-w-[689px] md:px-[67px] md:h-auto">
        <button
          className="absolute top-[10px] right-[5px] md:-top-5 md:-right-5"
          onClick={onClose}
        >
          <Image alt="icon" src={IconCloseBlack} />
        </button>
        {step === 0 && (
          <div className="text-white text-xl text-center mx-auto flex flex-col">
            <h1 className="mb-[22px] text-[47px] font-[760] leading-[normal] scale-y-[0.7] tracking-[0.4px]">
              {t('cancel.fewQuestions')}
            </h1>
            <h2 className="max-w-[288px] m-[0_auto] text-[16px] leading-normal opacity-[0.5]">
              {t('cancel.leave')}
            </h2>
            <div className="flex flex-col mt-[35px] md:flex-row md:flex-wrap md:justify-center">
              <div className="flex justify-center w-full">
                <button
                  onClick={handleNextStep}
                  className="h-[48px] w-full bg-whiteLabelColor hover:bg-[var(--primary-background-light)] rounded-full text-[22px] font-[760]"
                >
                  <span className="block scale-y-[0.7]">Okey</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="text-white text-center mx-auto flex flex-col">
            <h2 className="mb-[30px] text-[38px] font-[760] leading-[normal] scale-y-75 tracking-[-2px] md:text-[43px]">
              {t('cancel.why')}
            </h2>
            <div className="flex flex-col items-center gap-[10px] md:flex-row md:flex-wrap md:justify-center">
              {cancelReasonButtons.map(({ answer, text }) =>
                createButtons(
                  handleCancelReasonSelection,
                  answer,
                  text,
                  cancelReason
                )
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="h-[48px] w-full max-w-[352px] m-[40px_auto_0] bg-whiteLabelColor hover:bg-[var(--primary-background-light)] rounded-full text-[24px] font-[760]"
              disabled={!cancelReason}
            >
              <span className="block scale-y-[0.7]">{t('cancel.next')}</span>
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="text-white text-xl text-center mx-auto flex flex-col">
            <h2 className="mb-[30px] text-[38px] font-[760] leading-[normal] scale-y-75 tracking-[-2px] md:mb-0 md:text-[43px]">
              {t('cancel.which')}
            </h2>
            <div className="flex flex-col items-center gap-[10px] md:flex-row md:flex-wrap md:justify-center">
              {mostValuableServiceButtons.map(({ answer, text }) =>
                createButtons(
                  handleMostValuableServiceSelection,
                  answer,
                  text,
                  mostValuableService
                )
              )}
            </div>
            <button
              onClick={handleNextStep}
              className="h-[48px] w-full max-w-[352px] m-[40px_auto_0] bg-whiteLabelColor hover:bg-[var(--primary-background-light)] rounded-full text-[24px] font-[760]"
              disabled={!mostValuableService}
            >
              <span className="block scale-y-[0.7]">{t('cancel.next')}</span>
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="text-white mx-auto flex flex-col">
            <h2 className="text-center text-[30px] font-[760] leading-[normal] scale-y-75 tracking-[-2px] md:text-[38px]">
              {t('cancel.remain')}{' '}
              <span className="block underline cursor-pointer">
                {t('cancel.luck')}
              </span>
            </h2>
            <div className="mt-[30px] flex flex-col md:flex-row md:flex-wrap md:justify-center">
              <div className="flex flex-col items-center gap-[10px] w-full">
                <button
                  onClick={handleReturn}
                  className="h-[48px] w-full max-w-[352px] text-green-500 bg-[#202020] hover:bg-[#373737] rounded-full text-[24px] font-[760]"
                >
                  <span className="block scale-y-75">{t('cancel.return')}</span>
                </button>
                <button
                  onClick={handleFormSubmit}
                  className="h-[48px] w-full max-w-[352px] text-red-500 bg-[#202020] hover:bg-[#373737] rounded-full text-[24px] font-[760]"
                >
                  <span className="block scale-y-75">
                    {t('cancel.subscription')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
