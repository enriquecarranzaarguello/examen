import React from 'react';
import Image from 'next/image';
import copyIcon from '@icons/copy.svg';
import copyIconWL from '@icons/copy-blue.svg';
import IconCloseBlack from '@icons/close-black.svg';
import { useTranslation } from 'next-i18next';
import { ProposalModalProps } from '@typing/types';
import config from '@config';

const ProposalModal = ({
  openProposal,
  setOpenProposal,
  openProposalNext,
  setOpenProposalNext,
  openAlreadyProposal = false,
  paymentId,
  handleLinkProposal,
  proposalType,
  internalLink,
}: ProposalModalProps) => {
  const { t } = useTranslation('common');

  const checkWL = config.WHITELABELNAME === 'Volindo';

  const handleOpenNewTab = () => {
    window.open(`${internalLink}`);
  };

  return (
    <>
      {openProposal && (
        <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
          <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] md:px-[96px] w-screen h-screen lg:w-[544px] lg:h-[432px] lg:rounded-[16px]">
            <button
              className="absolute right-7 top-[60px] lg:-top-5 lg:-right-6"
              onClick={() => setOpenProposal(false)}
            >
              <Image alt="icon" src={IconCloseBlack} />
            </button>

            <div className="flex flex-col justify-center items-center h-full px-[20px] max-w-[500px] m-[0_auto] md:px-0">
              <div>
                <p className="text-white text-[48px] scale-y-[0.7] leading-[normal] -tracking-[.01] font-[760] text-center">
                  {t(
                    openProposalNext
                      ? openAlreadyProposal
                        ? 'stays.send-proposal-title-already'
                        : 'stays.send-proposal-title-2'
                      : 'stays.send-proposal'
                  )}
                </p>
                <p className="m-0 mb-[60px] text-[16px] text-[#ffffff] text-center">
                  {openProposalNext
                    ? openAlreadyProposal
                      ? t('stays.send-proposal-text-already')
                      : t('stays.send-proposal-text-2')
                    : `${t('stays.send-proposal-text-firstPart')} ${
                        config.WHITELABELNAME
                      } ${t('stays.send-proposal-text-secondPart')}`}
                </p>
              </div>
              {/* second step of modal  */}
              {!openProposalNext ? (
                <button
                  className="w-full min-h-[48px] bg-[var(--primary-background)] rounded-[90px] text-white text-[22px] font-[760]"
                  onClick={() => setOpenProposalNext(true)}
                >
                  <span className="block scale-y-[0.7]">
                    {t('stays.got-it')}
                  </span>
                </button>
              ) : (
                <div className="flex justify-between w-full max-w-[353px] min-h-[48px] items-center rounded-[90px] border border-whiteLabelColor px-4 overflow-hidden">
                  <label className="w-full xs:overflow-hidden text-white whitespace-nowrap truncate">
                    {`${internalLink}`}
                  </label>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(`${internalLink}`)
                    }
                    className="mr-[10px]"
                  >
                    {checkWL ? (
                      <Image
                        alt="icon"
                        width={25}
                        height={25}
                        src={copyIcon}
                        className="cursor-pointer max-w-none h-[25px!important] w-[25px!important]"
                      />
                    ) : (
                      <Image
                        alt="icon"
                        width={25}
                        height={25}
                        src={copyIconWL}
                        className="cursor-pointer max-w-none h-[25px!important] w-[25px!important]"
                      />
                    )}
                  </button>
                  <button
                    onClick={handleOpenNewTab}
                    className="bg-whiteLabelColor w-[30%]  ml-1 rounded-r-3xl h-full -mr-5 text-white font-bold px-3 pl-1 xs:ml-0"
                  >
                    <span className="block scale-y-[0.8] text-[20px]">Go</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProposalModal;
