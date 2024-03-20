import { useState } from 'react';
import { Modal } from '@components';
import { useTranslation } from 'react-i18next';

const ModalFlightCash = ({
  open,
  onClose,
  onPayInCash,
}: {
  open: boolean;
  onClose: () => void;
  onPayInCash: () => void;
}) => {
  const { t } = useTranslation();
  const [willPayInCash, setWillPayInCash] = useState(false);

  return (
    <Modal open={open} onClose={willPayInCash ? onPayInCash : onClose}>
      <div className="flex w-full h-full flex-col justify-center items-center p-8 md:max-w-[700px]">
        <p className="text-white text-[48px] scale-y-[0.7] leading-[normal] -tracking-[.01] font-[760] text-center">
          {willPayInCash
            ? t('flights.cashModal.title-2')
            : t('flights.cashModal.title-1')}
        </p>
        {willPayInCash ? (
          <p className="m-0 mb-[60px] text-[16px] text-[#ffffff] text-center">
            {t('flights.cashModal.change-mind')}
          </p>
        ) : (
          <p className="m-0 mb-[60px] text-[16px] text-[#ffffff] text-center leading-8">
            {t('flights.cashModal.choose-pay')}
            <br />
            {t('flights.cashModal.are-u-sure')}
          </p>
        )}
        <div className="w-full flex flex-col md:flex-row gap-3">
          {willPayInCash ? (
            <button
              className="w-full min-h-[48px] bg-[var(--primary-background)] rounded-[90px] text-white text-[22px] font-[760]"
              onClick={onPayInCash}
            >
              <span className="block scale-y-[0.7]">Okey</span>
            </button>
          ) : (
            <>
              <button
                className="w-full min-h-[48px] bg-[var(--primary-background)] rounded-[90px] text-white text-[22px] font-[760]"
                onClick={() => {
                  setWillPayInCash(true);
                }}
              >
                <span className="block scale-y-[0.7]">
                  {t('flights.cashModal.pay-cash')}
                </span>
              </button>
              <button
                className="w-full min-h-[48px] bg-[transparent] border-2 border-[var(--primary-background)] rounded-[90px] text-[var(--primary-background)] text-[22px] font-[760]"
                onClick={onClose}
              >
                <span className="block scale-y-[0.7]">
                  {t('common.cancel-simple')}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalFlightCash;
