import React from 'react';

//Translation
import { useTranslation } from 'react-i18next';

//Modal Params
import { ModalGeneralProps } from '@typing/proptypes';
import { Modal } from '@components';

export default function ModalCancelConfirmation({
  open,
  onClose,
}: ModalGeneralProps) {
  const { t } = useTranslation();

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

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full h-full md:max-w-[800px] md:h-fit p-10 flex flex-col items-center justify-center rounded-[16px]">
        <p className="text-white text-[40px] -tracking-[.01] font-[760] text-center">
          {t('suppliers.modal-confirm-title')}
        </p>
        <p className="text-[16px] text-[#ffffff] text-center my-[20px]">
          {t('suppliers.modal-confirm-text')}
        </p>
      </div>
    </Modal>
  );
}
