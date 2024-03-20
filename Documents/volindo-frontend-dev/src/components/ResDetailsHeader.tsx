import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Dropdown } from 'rsuite';
import { useTranslation } from 'next-i18next';
import { signOut } from 'next-auth/react';
import logoIcon from '@icons/logo.svg';
import whitelabellogoHeader from '@icons/whitelabelLogoHeader.svg';
import phoneIcon from '@icons/phone.svg';
import emailIcon from '@icons/email.svg';
import webSiteIcon from '@icons/web-site.svg';
import userIcon from '@icons/userIcon.svg';
import travelerIcon from '@icons/travelerIcon.svg';
import searchIcons from '@icons/searchIcon.svg';
import logoutIcon from '@icons/logoutIcon.svg';
import { ModalSupport } from '@components';
import { setCurrency, useAppDispatch, useAppSelector } from '@context';
import DropdownCurrency from './DropdownCurrency';
import config from '@config';

const ResDetailsHeader = ({ agent, redirectHome, isPublic = false }: any) => {
  const [openSupport, setOpenSupport] = React.useState(false);
  const { i18n } = useTranslation('common');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currency = useAppSelector(state => state.general.currency);

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = React.useState(0);

    React.useEffect(() => {
      const handleResize = () => setWindowSize(window.innerWidth);

      handleResize(); // Set initial window size
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
  };

  const windowSize = useWindowSize();

  const handleSignOut = async () => {
    const Auth = (await import('@aws-amplify/auth')).default;
    await Auth.signOut();
    signOut({ redirect: false });
  };

  const handleChangeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
    router.push(
      { pathname: router.pathname, query: router.query },
      router.pathname,
      { locale }
    );
  };

  const logoWhiteLabel =
    window.location.host.includes('dashboard.volindo.com') ||
    window.location.host.includes('dashboard.dev.volindo.com')
      ? logoIcon
      : whitelabellogoHeader;

  const getDomainFromURL = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
    } catch (error) {
      return url;
    }
  };

  const WLcheck = config.WHITELABELNAME === 'Volindo';

  return (
    <div className="flex justify-between items-center p-[12px]">
      <ModalSupport open={openSupport} onClose={() => setOpenSupport(false)} />
      <Image
        src={logoWhiteLabel}
        alt="Logo"
        className={`${
          !WLcheck && 'h-[44px]'
        } lg:h-auto lg:w-auto w-[74px] h-[22.6px] cursor-pointer`}
        onClick={redirectHome}
      />

      <div className="flex items-center gap-3 text-[15px] md:gap-6 text-white">
        {agent?.profile?.web_site && (
          <div className="flex gap-2 items-center t:hidden xs:hidden">
            <Image alt="icon" src={webSiteIcon} />
            <a
              href={agent.profile.web_site}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="truncate max-w-[200px]">
                {getDomainFromURL(agent.profile.web_site)}
              </p>
            </a>
          </div>
        )}
        {windowSize > 768 && agent?.email && (
          <div className="flex gap-2 items-center">
            <Image alt="icon" src={emailIcon} />
            <a href={`mailto:${agent.email}`}>
              <label>{agent.email}</label>
            </a>
          </div>
        )}
        {windowSize > 768 && agent?.profile?.phone_number && (
          <div className="flex gap-2 items-center">
            <Image alt="icon" src={phoneIcon} />
            {agent?.profile?.phone_country_code ? (
              <a
                href={`https://wa.me/${agent?.profile?.phone_country_code}${agent?.profile?.phone_number}`}
              >
                <label>{`${agent?.profile?.phone_country_code} ${agent?.profile?.phone_number}`}</label>
              </a>
            ) : (
              <a href={`https://wa.me/${agent?.profile?.phone_number}`}>
                <label>{agent?.profile?.phone_number}</label>
              </a>
            )}
          </div>
        )}
        {windowSize > 768 && <label>{agent?.profile?.full_name}</label>}
        <DropdownCurrency pathName={router.pathname} currency={currency} />
        <Dropdown title={i18n.language} className="dropdown">
          <Dropdown.Item
            className={`text-[white!important] hover:text-[black!important] px-[20px!important] ${
              i18n.language === 'en' && 'font-[700!important]'
            }`}
            onClick={() => handleChangeLanguage('en')}
          >
            English
          </Dropdown.Item>

          <Dropdown.Item
            className={`text-[white!important] hover:text-[black!important] px-[20px!important] ${
              i18n.language === 'es' && 'font-[700!important]'
            }`}
            onClick={() => handleChangeLanguage('es')}
          >
            Español
          </Dropdown.Item>
        </Dropdown>
        <button
          className="relative rounded-full w-[34px] h-[34px] border-[.6px] border-[#ffffffa3] text-white text-[12px] font-[500]"
          onClick={() => setOpenSupport(true)}
        >
          ?
        </button>
        {!isPublic ? (
          <Dropdown
            title={
              agent?.profile?.photo ? (
                <img
                  src={agent.profile.photo}
                  className="rounded-full w-[40px] h-[40px]"
                  alt="user"
                />
              ) : (
                <Image
                  alt="icon"
                  src={userIcon.src}
                  className="rounded-full"
                  width={40}
                  height={40}
                />
              )
            }
            placement="bottomEnd"
            className="dropdown-avatar-secondary"
            data-testid="dropdown-avatar-secondary"
          >
            <Dropdown.Item
              className="flex gap-4 text-[white!important] hover:bg-opacity-[.05] py-[12px!important] px-[26px!important]"
              onClick={() => router.push('/profile')}
            >
              <Image src={userIcon} width={16} height={16} alt="icon" />
              Profile
            </Dropdown.Item>

            <Dropdown.Item
              className="flex gap-4 text-[white!important] hover:bg-opacity-[.05] py-[12px!important] px-[26px!important]"
              onClick={() => router.push('/travelers')}
            >
              <Image src={travelerIcon} width={16} height={16} alt="icon" />
              CRM
            </Dropdown.Item>

            <Dropdown.Item className="flex gap-4 text-[white!important] hover:bg-opacity-[.05] py-[12px!important] px-[26px!important]">
              <Image src={searchIcons} width={16} height={16} alt="icon" />
              Search
            </Dropdown.Item>

            <Dropdown.Item
              className="flex gap-4 text-[white!important] hover:bg-opacity-[.05] py-[12px!important] px-[26px!important]"
              onClick={handleSignOut}
            >
              <Image
                src={logoutIcon}
                width={15.5}
                height={15.5}
                alt={'user'}
                className=""
              />
              Log out
            </Dropdown.Item>
          </Dropdown>
        ) : agent?.profile?.photo ? (
          <img
            src={agent.profile.photo}
            className="rounded-full w-[40px] h-[40px]"
            alt="user"
          />
        ) : (
          <Image
            alt="icon"
            src={userIcon.src}
            className="rounded-full"
            width={40}
            height={40}
          />
        )}
      </div>
    </div>
  );
};

export default ResDetailsHeader;
