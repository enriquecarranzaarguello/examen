import React from 'react';
import { useTranslation } from 'next-i18next';
import config from '@config';

import type { ModalGeneralProps } from '@typing/proptypes';

import supportIcon from '@icons/support.ico';
import whatsappIcon from '@icons/whatsappSquare.svg';
import facebookIcon from '@icons/facebook-square.svg';
import calendarVolindoIcon from '@icons/Calendar-purple.svg';
import calendarFlywayIcon from '@icons/Calendar-pink.svg';

import { Modal } from '@components';
import Image from 'next/image';
import Link from 'next/link';

export default function ModalSupport({ open, onClose }: ModalGeneralProps) {
  const { t } = useTranslation();

  const handleEmail = () => {
    window.location.href = `mailto:${process.env.WHITELABELEMAIL}`;
  };

  const getLinks = (param: any) => {
    const obj: any = {
      Flywaytoday: {
        facebook:
          'https://www.facebook.com/people/Flyway-Today/100086962560275/',
        whatsApp:
          'https://api.whatsapp.com/send/?phone=5215568900632&text&type=phone_number&app_absent=0',
        calendly: 'https://calendly.com/flywaytoday/demo_gratis',
        calendarIcon: calendarFlywayIcon,
      },
      Volindo: {
        facebook: 'https://www.facebook.com/volindo.travel/',
        whatsApp: 'https://chat.whatsapp.com/Kmmdz1Vbg6kCrfiLP5RsrS',
        calendly:
          'https://calendly.com/volindo/free-demostration?month=2023-08',
        calendarIcon: calendarVolindoIcon,
      },
    };

    return obj[param];
  };

  let links = getLinks(config.WHITELABELNAME);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col justify-center items-center text-white px-[20px] overflow-x-hidden md:pt-[40px] md:pb-[50px] md:px-[83px] h-full">
        <label className="mb-4 text-[40px] font-[760] -tracking-[0.4] text-center scale-x-[1.4] px-[40px]">
          {t('support.title')}
        </label>

        <p className="max-w-[340px] text-base mb-2.5 text-[#777E90] text-center">
          {t('support.social')}
        </p>

        <div className="flex gap-[25px] mb-[21px]">
          <Link href={links?.whatsApp} target="_blank">
            <Image src={whatsappIcon} width={32} height={32} alt="whatsapp" />
          </Link>
          <Link href={links?.facebook} target="_blank">
            <Image src={facebookIcon} width={32} height={32} alt="facebook" />
          </Link>
        </div>

        <p className="mb-3 text-base text-[#777E90] text-center">
          {t('support.set-meeting')}
        </p>

        <Link
          target="_blank"
          className="flex items-start gap-[10px] mb-[20px] md:items-center"
          href={links?.calendly}
        >
          <Image
            src={links?.calendarIcon}
            width={24}
            height={24}
            alt="calendarIcon"
          />
          <span className="text-base text-whiteLabelColor hover:text-[var(--primary-background-light)] underline">
            {t('support.meet-brand', { WLNAME: config.WHITELABELNAME || '' })}
          </span>
        </Link>

        <p className="mb-[33px] text-base text-center text-[#777E90]">
          {t('support.text-2')}{' '}
          <button
            onClick={handleEmail}
            className="underline text-whiteLabelColor hover:text-[var(--primary-background-light)]"
          >
            {process.env.WHITELABELEMAIL}
          </button>
        </p>

        <button
          className="w-full max-w-[340px] h-[48px] rounded-[24px] bg-[var(--primary-background)] hover:bg-[var(--primary-background-light)] overflow-x-hidden"
          onClick={onClose}
        >
          <span className="block scale-x-[1.4] text-base text-black font-[760]">
            OK
          </span>
        </button>
      </div>
    </Modal>
  );
}
