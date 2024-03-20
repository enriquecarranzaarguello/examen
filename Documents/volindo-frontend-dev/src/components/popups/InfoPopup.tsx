import { FC, ReactNode } from 'react';
import IconCloseBlack from '@icons/close-black.svg';
import Image from 'next/image';
import { LoadingSpinner } from '../profile/atoms';
import { useTranslation } from 'react-i18next';
import config from '@config';

const InfoPopup: FC<{
  open: boolean;
  onClose: () => void;
  onClickButton?: () => void;
  title: string;
  info?: string;
  content?: ReactNode | string;
  textButton?: string;
  type?: 'info' | 'loading' | 'confirm';
}> = ({
  open,
  onClose,
  onClickButton = onClose,
  title,
  info = '',
  textButton = 'OK',
  type = 'info',
  content = '',
}) => {
  const { t } = useTranslation();

  if (!open) return null;

  const checkWL = config.WHITELABELNAME === 'Volindo';

  return (
    <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-[999]">
      <div className="relative bg-black shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-full h-full px-5 md:rounded-[16px] md:h-fit md:w-[34rem] md:min-w md:px-[4.625rem] md:pt-10 text-white">
        {type === 'loading' ? null : (
          <button
            className="absolute  top-0 right-0  md:-top-5 md:-right-6"
            onClick={onClose}
          >
            <Image className=" " alt="icon" src={IconCloseBlack} />
          </button>
        )}
        <div className="flex justify-center flex-col items-center h-full overflow-hidden overflow-y-scroll scrollbar-hide">
          <h1
            data-testid="info-popup-title"
            className="font-[760] text-center text-4xl text-white mb-4"
          >
            {title}
          </h1>
          {type === 'info' ? (
            <>
              {info ? (
                <p className="text-[#FFFFFF80] text-center text-base">{info}</p>
              ) : null}
              {content ? content : null}

              <button
                data-testid="info-popup-ok-button"
                onClick={onClickButton}
                className={`w-full max-w-[352px] h-[48px] mt-16 md:mb-[3.125rem] rounded-3xl text-black mx-auto text-base font-[760] xs:text-white disabled:cursor-not-allowed customTailwind ${
                  checkWL
                    ? 'bg-whiteLabelColor'
                    : 'bg-[var(--blue-color)] hover:bg-[var(--blue-color-darken)]'
                }`}
              >
                {textButton}
              </button>
            </>
          ) : type === 'confirm' ? (
            <>
              {info ? (
                <p className="text-[#FFFFFF80] text-center text-base">{info}</p>
              ) : null}
              <div className="grid grid-cols-2 w-full gap-4  mt-16">
                <button
                  onClick={onClickButton}
                  className="bg-whiteLabelColor w-full h-[48px] md:mb-[3.125rem] rounded-3xl text-black mx-auto text-base font-[760] xs:text-white disabled:cursor-not-allowed customTailwind"
                >
                  {textButton}
                </button>
                <button
                  onClick={onClose}
                  className="w-full h-[48px] md:mb-[3.125rem] rounded-3xl text-white mx-auto text-base font-[760] xs:text-white disabled:cursor-not-allowed customTailwind"
                >
                  {t('common.cancel-simple')}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col md:mb-[3.125rem] items-center">
              <LoadingSpinner size="big" />
              {info ? (
                <p className="text-[#FFFFFF80] text-center text-base mt-3">
                  {info}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoPopup;
