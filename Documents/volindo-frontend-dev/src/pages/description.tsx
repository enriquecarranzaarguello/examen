import React from 'react';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import arrowPrevious from '@icons/arrow-previous-left.svg';
import userBusiness from '@icons/signUpIcons/user-business.svg';
import userBusinessWhite from '@icons/signUpIcons/user-businessWhite.svg';
import building from '@icons/signUpIcons/tabler_building.svg';
import buildingWhite from '@icons/signUpIcons/tabler_buildingWhite.svg';
import woman from '@icons/signUpIcons/woman.svg';
import womanWhite from '@icons/signUpIcons/womanWhite.svg';
import consignment from '@icons/signUpIcons/consignment.svg';
import consignmentWhite from '@icons/signUpIcons/consignmentWhite.svg';
import running from '@icons/signUpIcons/set-off.svg';
import runningWhite from '@icons/signUpIcons/set-offWhite.svg';
import loadingIcon from '@icons/signUpIcons/loading.svg';
import loadingIconWhite from '@icons/signUpIcons/loadingWhite.svg';

import { useRouter } from 'next/router';
import DashboardSlider from 'src/components/DashboardSlider';

import { NextPageWithLayout } from '@typing/types';
import { getLayout } from '@layouts/MainLayout';
import { useAppSelector } from '@context';

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}

const Home: NextPageWithLayout = ({}: InferGetStaticPropsType<
  typeof getStaticProps
>) => {
  const { t } = useTranslation();
  const route = useRouter();
  const [selectedButtons, setSelectedButtons] = React.useState<number[]>([]);
  const isMobile = window.innerWidth <= 768; // Verificar si es un dispositivo móvil

  const handleButtonSelect = (buttonIndex: number) => {
    if (selectedButtons.includes(buttonIndex)) {
      setSelectedButtons(selectedButtons.filter(btn => btn !== buttonIndex));
    } else {
      setSelectedButtons([...selectedButtons, buttonIndex]);
    }
  };

  const handleContinue = () => {
    const selectedData = selectedButtons.map(buttonIndex =>
      t(`registration.answer-${buttonIndex + 1}`)
    );

    route.push({
      pathname: '/travelersq',
      query: { selectedData: JSON.stringify(selectedData) },
    });
  };

  const iconsGrey = [
    userBusiness,
    building,
    woman,
    consignment,
    running,
    loadingIcon,
  ];

  const iconsWhite = [
    userBusinessWhite,
    buildingWhite,
    womanWhite,
    consignmentWhite,
    runningWhite,
    loadingIconWhite,
  ];

  return (
    <>
      <div className="max-w-[1400px] mx-auto md:pb-[51px] h-[calc(100vh-72px)]">
        <div className="h-full flex flex-col md:flex-row xl:justify-between xl:items-center">
          <div
            className="md:pt-[80px] xl:pt-0 w-full bg-black rounded-t-[25px] flex flex-col justify-between items-center xl:w-auto xl:items-start xl:mr-[120px] xl:justify-normal
            "
          >
            <div className="flex flex-row mb-[16px] w-full md:hidden">
              <div className="bg-whiteLabelColor rounded-[16px] flex flex-col justify-start h-[5px] w-16 grow mr-[6px]"></div>
              <div className="bg-[#D9D9D9] opacity-25 rounded-[16px] flex flex-col justify-start h-[5px] w-16 grow mr-[6px]"></div>
              <div className="bg-[#D9D9D9] opacity-25 rounded-[16px] flex flex-col justify-start h-[5px] w-16 grow"></div>
            </div>

            <div className="flex w-full mb-[7px] md:hidden">
              <button
                className="flex items-center border-none text-[#777E90] !opacity-1"
                onClick={() => window.history.back()}
                disabled
              >
                {/* {t('registration.back')} */}
                <Image
                  src={arrowPrevious}
                  alt="arrow left"
                  className="mr-[4px]"
                />
                <span className="text-[16px] font-[600]">
                  {t('registration.back')}
                </span>
              </button>
            </div>

            <div className="text-[16px] tracking-[-0.16px] scale-x-[1.4] font-[760] text-[var(--primary-background)] leading-[48px] md:hidden">
              {t('registration.question-translate')} 1/3
            </div>

            <div className="mb-[40px] w-full md:mb-0 xl:pt-[60px] xl:w-[450px]">
              <div className="w-full flex justify-center text-center mb-[24px] md:pl-[65px] md:justify-start md:mb-[65px]">
                <div className="w-[220px] text-[#FCFCFD] text-[20px] tracking-[-0.2px] scale-x-[1.4] font-[650] md:text-[30px] items-left md:w-[315px] md:text-left md:leading-[normal]">
                  {t('registration.question')}
                  {t('registration.question-second')}
                </div>
                {/* <div className="text-white text-[20px] font-[900] md:text-xl lg:text-4xl]">
                {t('registration.question-second')}
              </div> */}
              </div>

              <div className="grid md:grid-cols-3 gap-[10px] md:gap-[15px] xl:mb-[155px]">
                {[...Array(6)].map((_, index) => (
                  <button
                    key={index}
                    className={`relative h-[59px] font-[590] rounded-2xl flex justify-start items-center text-[16px] text-[var(--gray-color-text)] bg-[#202020] md:h-[112px] xl:w-[132px] xl:justify-center xl:px-[18px] ${
                      selectedButtons.includes(index)
                        ? 'bg-whiteLabelColor text-white'
                        : ''
                    }`}
                    onClick={() => handleButtonSelect(index)}
                  >
                    <Image
                      className="ml-[32px] mr-[22px] xl:hidden"
                      src={
                        selectedButtons.includes(index)
                          ? iconsWhite[index].src
                          : iconsGrey[index].src
                      }
                      width={24}
                      height={24}
                      alt="icon"
                    />
                    {t(`registration.answer-${index + 1}`)}
                    {selectedButtons.includes(index) && (
                      <span
                        className="absolute top-[50%] right-[22px] translate-y-[-50%] bg-white rounded-[10px] w-[24px] h-[24px] flex items-center justify-center text-whiteLabelColor text-sm font-bold md:w-[16px] md:h-[16px] md:top-[14px] md:right-[14px] md:translate-y-[0] md:rounded-[6px]"
                        style={{ zIndex: 1 }}
                      >
                        &#10003;
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full xl:w-[450px]">
              <div className="w-full flex gap-[15px] md:mb-[40px] xl:gap-[6px]">
                <button
                  className="hidden w-28 md:block md:grow md:w-56 h-10 md:h-[60px] xl:h-[48px] bg-black text-white rounded-3xl border border-[#5C5C5C] mr-1 md:text-[16px] md:font-[650]"
                  onClick={() => window.history.back()}
                  disabled
                >
                  <span className="inline-block text-white font-[650] text-[16px] scale-x-[1.4]">
                    {t('registration.back')}
                  </span>
                </button>
                <button
                  className="w-full h-[48px] md:w-56 md:grow md:h-[60px] xl:h-[48px] rounded-3xl bg-whiteLabelColor hover:bg-[var(--primary-background-light)]"
                  onClick={handleContinue}
                >
                  <span className="inline-block text-white font-[650] text-[16px] scale-x-[1.4]">
                    {t('registration.continue')}
                  </span>
                </button>
              </div>

              <div className="hidden md:flex flex-row mb-[16px] w-full md:mb-0 md:gap-[21px] xl:w-[100%] xl:gap-[15px]">
                <div className="bg-whiteLabelColor rounded-[16px] flex flex-col justify-start h-[5px] w-16 grow mr-[6px] md:h-[8px]"></div>
                <div className="bg-[#D9D9D9] opacity-25 rounded-[16px] flex flex-col justify-start h-[5px] w-16 grow mr-[6px] md:h-[8px]"></div>
                <div className="bg-[#D9D9D9] opacity-25 rounded-[16px] flex flex-col justify-start h-[5px] w-16 grow md:h-[8px]"></div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.10)',
            }}
            className="hidden xl:block overflow-hidden h-full max-w-[734px] xl:max-h-[700px] rounded-[48px]"
          >
            <DashboardSlider />
          </div>
        </div>
      </div>
    </>
  );
};

Home.getLayout = getLayout;

export default Home;
