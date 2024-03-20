import React from 'react';
import { useTranslation } from 'next-i18next';
import type { ModalDeleteBooking } from '@typing/proptypes';
import { Modal } from '@components';
import SearchLoader from '@components/SearchLoader';

export default function ModalConfirmCancellation({
  open,
  onClose,
  loading,
  deleteBooking,
}: ModalDeleteBooking) {
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
      <div className="w-full h-full relative flex flex-col justify-between items-center md:max-w-[800px] md:h-auto bg-[#141416] rounded-[16px] p-10">
        <div className="flex flex-col justify-center items-center gap-1 py-10 z-10">
          <p className="mb-[25px] text-white text-[40px] -tracking-[.01] font-[760] text-center">
            {t('suppliers.modal-question')}
          </p>
          <div className="flex justify-between w-3/4">
            <button
              disabled={loading}
              className="w-1/2 h-[100px] uppercase font-bold max-h-[48px] bg-[var(--primary-background)] rounded-[90px] text-black text-[16px] mr-[10px] flex items-center justify-center"
              onClick={deleteBooking}
            >
              {loading ? <SearchLoader /> : t('suppliers.modal-confirm-button')}
            </button>
            <button
              disabled={loading}
              className="w-1/2 h-[100px] uppercase font-bold max-h-[48px] border-solid border-2 border-white rounded-[90px] text-white text-[16px] ml-[10px]"
              onClick={onClose}
            >
              {t('suppliers.modal-cancel-button')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
