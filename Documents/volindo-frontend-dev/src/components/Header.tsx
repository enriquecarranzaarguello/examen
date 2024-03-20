import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Dropdown } from 'rsuite';
import config from '@config';

import { useAppSelector } from '@context';
import IconLogo from '@icons/logo.svg';
import whitelabellogoHeader from '@icons/whitelabelLogoHeader.svg';
import userDefault from '@icons/userDefaultIMG.svg';
import userIcon from '@icons/userIcon.svg';
import marketingIcon from '@icons/marketingIcon.svg';
import membershipIcon from '@icons/membership-icon.svg';
import helpCenterIcon from '@icons/Headset.svg';
import crmIcon from '@icons/crm-icon.svg';
import logoutIcon from '@icons/logoutIcon.svg';
import burgerMenu from '@icons/burgerMenu.svg';
import { useVariableValue } from '@devcycle/react-client-sdk';
import DropdownCurrency from './DropdownCurrency';

import { ModalCancelMemberShip, ModalSupport } from '@components';
import { Lottie } from './Lottie';

const HeaderV = ({ noLogin = false }: { noLogin?: boolean }) => {
  const { t, i18n } = useTranslation('common');
  const { data: session } = useSession();
  const router = useRouter();
  const currency = useAppSelector(state => state.general.currency);
  const dataAgent = useAppSelector(state => state.agent);
  const [openCancel, setOpenCancel] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const [windowSize, setWindowSize] = useState(0);

  const [isVolindo, setisVolindo] = useState(
    config.WHITELABELNAME === 'Volindo'
  );

  const isMarketingInProd = useVariableValue('marketing-feature', true);
  const paywall = useVariableValue('paywall', false);

  const isValidSubscription = useAppSelector(
    state => state.agent.agent_is_subscribed
  );

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleChangeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale }
    );
  };

  const handleSignOut = async () => {
    signOut({ redirect: false });
  };

  // TODO move to feature flag
  const logoWhiteLabel =
    window.location.host.includes('dashboard.volindo.com') ||
    window.location.host.includes('dashboard.dev.volindo.com')
      ? IconLogo
      : whitelabellogoHeader;

  const getFilenameWithoutExtension = (path: string) => {
    const filenameWithExtension = path.split('/').pop();

    if (filenameWithExtension) {
      return filenameWithExtension.split('.')[0];
    }
  };

  const filename = getFilenameWithoutExtension(logoWhiteLabel.src);

  const headerNavLinksArray = [
    { path: '/', label: t('common.search') },
    {
      path:
        isVolindo || !paywall
          ? '/profile'
          : isValidSubscription
            ? '/profile'
            : '',
      label: t('agent.profile'),
      testid: 'profile-header-link',
    },
    {
      path:
        isVolindo || !paywall
          ? '/reservations'
          : isValidSubscription
            ? '/reservations'
            : '',
      label: 'CRM',
      testid: 'crm-header-link',
    },
    {
      path:
        isVolindo || !paywall
          ? '/marketing/branding'
          : isValidSubscription
            ? '/marketing/branding'
            : '',
      label: t('home.marketing-studio'),
      text: t('home.new'),
      testid: 'marketing-header-link',
    },
  ];

  const handleDisableClick = (e: any) => {
    e.preventDefault();
  };

  const testCheck = () => {
    // if (!session) {
    //   return true;
    // } else if (isVolindo) {
    //   return false;
    // } else if (paywall) {
    //   return true;
    // } else if (!paywall) {
    //   return true;
    // } else if (!isValidSubscription) {
    //   return true;
    // }
    return false;
  };

  const headerNavLinks = headerNavLinksArray.map(
    ({ path, label, text, testid }, index) => (
      <li key={index}>
        <Link
          data-testid={`${testid}`}
          className={`${
            router.route === path &&
            session &&
            '!text-[var(--primary-background)]'
          } headerNavLinks text-white text-[16px] font-[500] hover:text-[var(--primary-background-light)] scale-x-[1.1] block relative ${
            testCheck() &&
            'cursor-[not-allowed!important] opacity-[.8] focus:text-white hover:text-white'
          }`}
          onClick={e => !session && handleDisableClick(e)}
          href={path}
        >
          <span className="absolute -top-[11px] left-[50%] translate-x-[-50%] text-[9px] text-[var(--pink-color)]">
            {text}
          </span>
          {label}
        </Link>
      </li>
    )
  );

  return (
    <>
      <ModalCancelMemberShip
        open={openCancel}
        onClose={() => setOpenCancel(false)}
      />

      <ModalSupport open={openSupport} onClose={() => setOpenSupport(false)} />

      <header className="flex justify-between items-center h-[72px] px-[17px] py-[20px] lg:px-0 lg:py-5 z-30">
        <Link className="z-10" href={'/'}>
          {filename !== 'whitelabelLogoHeader' ? (
            <Lottie
              src={'/logo-animation.json'}
              className="-ml-[20px] min-w-[140px] max-w-[140px] md:-ml-[40px] md:min-w-[160px] lg:-ml-[20px]"
            />
          ) : (
            <Image
              src={logoWhiteLabel}
              alt="Logo"
              width={windowSize > 768 ? 150 : 120}
              height={windowSize > 768 ? 20 : 25}
              className="object-contain max-w-[51px] md:max-w-[68px]"
            />
          )}
        </Link>

        <ul className="MNEU gap-[40px] hidden md:flex">{headerNavLinks}</ul>

        <div className="flex items-center gap-[20px]">
          <DropdownCurrency pathName={router.pathname} currency={currency} />

          <Dropdown title={i18n.language} className="dropdown lang">
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

          {session ? (
            <>
              <button
                className="relative rounded-full w-[34px] h-[34px] border-[.6px] flex justify-center items-center border-[#ffffffa3] text-white text-[24px] font-[700]"
                onClick={() => setOpenSupport(true)}
              >
                ?
              </button>

              {/*TODO  refactor dropdown to use only one set 
              of selectors mobile/ web */}

              {windowSize > 768 ? (
                <Dropdown
                  title={
                    dataAgent?.profile?.photo ? (
                      <div className="relative">
                        <div
                          className={`${
                            isValidSubscription
                              ? 'border-whiteLabelColor'
                              : 'border-red-600'
                          } border-[2px] rounded-full w-[40px] h-[40px]`}
                        >
                          <img
                            src={dataAgent.profile.photo}
                            className="w-full h-full rounded-full"
                            alt="user"
                          />
                        </div>
                        <span
                          className={`${
                            isValidSubscription
                              ? 'bg-whiteLabelColor'
                              : 'bg-red-600'
                          } absolute flex items-center justify-center min-w-[14px] h-[14px] rounded-full z-10 -right-[4px] -bottom-[2px] text-[8px] text-white font-[590]`}
                        >
                          {isValidSubscription &&
                            dataAgent.profile.full_name[0]}
                        </span>
                      </div>
                    ) : (
                      <div className="relative">
                        <div
                          className={`${
                            isValidSubscription
                              ? 'border-whiteLabelColor'
                              : 'border-red-600'
                          } border-[2px] rounded-full w-[40px] h-[40px]`}
                        >
                          <Image
                            alt="icon"
                            src={userDefault.src}
                            className="rounded-full"
                            width={40}
                            height={40}
                          />
                        </div>
                        <span
                          className={`${
                            isValidSubscription
                              ? 'bg-whiteLabelColor'
                              : 'bg-red-600'
                          } absolute flex items-center justify-center min-w-[14px] h-[14px] rounded-full z-10 -right-[4px] -bottom-[2px] text-[8px] text-white font-[590]`}
                        >
                          {isValidSubscription &&
                            dataAgent.profile.full_name[0]}
                        </span>
                      </div>
                    )
                  }
                  placement="bottomEnd"
                  className="dropdown-avatar"
                  data-testid="dropdown-avatar"
                >
                  <Dropdown.Item
                    as={Link}
                    href={
                      isVolindo || !paywall
                        ? '/profile'
                        : isValidSubscription
                          ? '/profile'
                          : ''
                    }
                    data-testid="dropdown-profile"
                    className="hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[18px!important] flex gap-4 text-[white!important]"
                  >
                    <Image src={userIcon} width={16} height={16} alt="icon" />
                    {t('agent.profile')}
                  </Dropdown.Item>

                  <Dropdown.Item
                    as={Link}
                    href={
                      isVolindo || !paywall
                        ? '/reservations'
                        : isValidSubscription
                          ? '/reservations'
                          : ''
                    }
                    // href="/reservations"
                    data-testid="dropdown-reservations"
                    className="hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[18px!important] pl-[17px!important] flex gap-4 text-[white!important]"
                  >
                    <Image src={crmIcon} width={18} height={18} alt="icon" />
                    CRM
                  </Dropdown.Item>

                  <Dropdown.Item
                    as={Link}
                    href="/payment"
                    data-testid="dropdown-payment"
                    className="hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[18px!important] pl-[16px!important] flex gap-[15px] items-center text-[white!important]"
                  >
                    <Image
                      src={membershipIcon}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                    {t('agent.plans')}
                  </Dropdown.Item>

                  {isMarketingInProd ? null : (
                    <Dropdown.Item
                      as={Link}
                      href={
                        isVolindo || !paywall
                          ? '/marketing/branding'
                          : isValidSubscription
                            ? '/marketing/branding'
                            : ''
                      }
                      data-testid="dropdown-branding"
                      className="hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[18px!important] flex gap-4 items-center text-[white!important]"
                    >
                      <Image
                        src={marketingIcon}
                        width={17}
                        height={17}
                        alt="Marketing icon"
                      />
                      <p className="relative">
                        {t('home.marketing')}
                        <span className="absolute -top-[5px] -right-[10px] text-[6px] text-[#58C27D] uppercase">
                          {t('home.new')}
                        </span>
                      </p>
                    </Dropdown.Item>
                  )}

                  {isMarketingInProd ? null : (
                    <Dropdown.Item
                      as={Link}
                      href={
                        isVolindo || !paywall
                          ? '/help-center'
                          : isValidSubscription
                            ? '/help-center'
                            : ''
                      }
                      className="hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[18px!important] flex gap-4 items-center text-[white!important]"
                    >
                      <Image
                        src={helpCenterIcon}
                        width={17}
                        height={17}
                        alt="Marketing icon"
                      />
                      {t('marketing.pages.helpCenter')}
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item
                    data-testid="dropdown-logout"
                    className="flex gap-4 text-[white!important] hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important]  py-[12px!important] px-[18px!important]"
                    onClick={handleSignOut}
                  >
                    <Image
                      src={logoutIcon}
                      width={15.5}
                      height={15.5}
                      alt={'user'}
                      className=""
                    />
                    {t('agent.logout')}
                  </Dropdown.Item>

                  {router.pathname === '/profile' && (
                    <Dropdown.Item
                      data-testid="dropdown-cancel"
                      className="flex gap-4 text-[red!important] hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] justify-center"
                      onClick={() => setOpenCancel(true)}
                    >
                      {t('common.cancel')}
                    </Dropdown.Item>
                  )}
                </Dropdown>
              ) : (
                <Dropdown
                  title={
                    <Image
                      alt="icon"
                      src={burgerMenu.src}
                      className=""
                      width={30}
                      height={20}
                    />
                  }
                  placement="bottomEnd"
                  className="dropdown-avatar rounded-[0px!important]"
                >
                  <Dropdown.Item
                    as={Link}
                    href={
                      isVolindo || !paywall
                        ? '/profile'
                        : isValidSubscription
                          ? '/profile'
                          : ''
                    }
                    className="hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[20px!important] flex gap-4 text-[white!important]"
                  >
                    <Image src={userIcon} width={16} height={16} alt="icon" />
                    {t('agent.profile')}
                  </Dropdown.Item>

                  <Dropdown.Item
                    as={Link}
                    href={
                      isVolindo || !paywall
                        ? '/reservations'
                        : isValidSubscription
                          ? '/reservations'
                          : ''
                    }
                    className="hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[20px!important] flex gap-4 text-[white!important]"
                  >
                    <Image src={crmIcon} width={16} height={16} alt="icon" />
                    CRM
                  </Dropdown.Item>

                  <Dropdown.Item
                    as={Link}
                    href="/payment"
                    className="hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[20px!important] pl-[18px!important] flex gap-[15px] text-[white!important] items-center"
                  >
                    <Image
                      src={membershipIcon}
                      width={20}
                      height={20}
                      alt="icon"
                    />
                    {t('agent.plans')}
                  </Dropdown.Item>

                  {isMarketingInProd ? null : (
                    <Dropdown.Item
                      as={Link}
                      href={
                        isVolindo || !paywall
                          ? '/marketing/branding'
                          : isValidSubscription
                            ? '/marketing/branding'
                            : ''
                      }
                      className="hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[20px!important] flex gap-4 text-[white!important] items-center"
                    >
                      <Image
                        src={marketingIcon}
                        width={17}
                        height={17}
                        alt="Marketing icon"
                      />
                      <p className="relative">
                        {t('home.marketing')}
                        <span className="absolute -top-[5px] -right-[10px] text-[6px] text-[#58C27D] uppercase">
                          {t('home.new')}
                        </span>
                      </p>
                    </Dropdown.Item>
                  )}

                  {isMarketingInProd ? null : (
                    <Dropdown.Item
                      as={Link}
                      href={
                        isVolindo || !paywall
                          ? '/help-center'
                          : isValidSubscription
                            ? '/help-center'
                            : ''
                      }
                      className="hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[20px!important] flex gap-4 text-[white!important] items-center"
                    >
                      <Image
                        src={helpCenterIcon}
                        width={17}
                        height={17}
                        alt="Marketing icon"
                      />
                      {t('marketing.pages.helpCenter')}
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item
                    className="flex gap-4 text-[white!important] hover:bg-[rgba(255,255,255,0.05)!important] bg-[transparent!important] py-[12px!important] px-[20px!important]"
                    onClick={handleSignOut}
                  >
                    <Image
                      src={logoutIcon}
                      width={15.5}
                      height={15.5}
                      alt={'user'}
                      className=""
                    />
                    {t('agent.logout')}
                  </Dropdown.Item>

                  {router.pathname === '/profile' && (
                    <Dropdown.Item
                      className="flex gap-4 text-[red!important] bg-[transparent!important] py-[12px!important] justify-center"
                      onClick={() => setOpenCancel(true)}
                    >
                      {t('common.cancel')}
                    </Dropdown.Item>
                  )}
                </Dropdown>
              )}
            </>
          ) : noLogin ? null : (
            <Link
              data-testid="login"
              className=" h-[34px] px-6 rounded-full bg-white hover:bg-[white!important] font-[500] flex items-center"
              style={{ textDecoration: 'none', color: 'black' }}
              href="/signin"
            >
              {t('auth.login')}
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default HeaderV;
