import React from 'react';
import { useTranslation } from 'next-i18next';
import type { ModalDeleteSupplierProps } from '@typing/proptypes';
import { Modal } from '@components';

export default function ModalCancelSupplier({
  open,
  onClose,
  deleteSupplier,
}: ModalDeleteSupplierProps) {
  const { t } = useTranslation();
  const handleClick = () => {
    const recipientEmail = process.env.WHITELABELEMAIL;
    const subject = 'Hello, Delete Supplier!';
    const body =
      'Hello, there Volindo I need help deleting a supplier from my CRM?';
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative h-full flex flex-col justify-center items-center gap-[30px] md:w-[613px] bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] rounded-[16px] py-10 md:h-[492px] md:justify-between">
        <div className="flex flex-col justify-center items-center gap-1 z-10 md:mt-[100px]">
          <label className="text-2xl text-[#FCFCFD] font-[760] -tracking-[.02] text-center w-3/4 md:w-full">
            {t('suppliers.delSupplier')}
          </label>
          <label className="text-[#777E91] text-[16px] w-1/2 text-center">
            {t('suppliers.delFromAccount')}
          </label>
        </div>

        <div className="flex justify-center items-center gap-3  gap-y-3">
          <button
            onClick={onClose}
            type="button"
            className="border-whiteLabelColor border text-white bg-transparent rounded-[90px] text-[16px] font-[760] h-[48px] w-full min-w-[112px] max-w-[352px] z-10"
          >
            No
          </button>
          <button
            onClick={deleteSupplier}
            type="button"
            className="bg-whiteLabelColor rounded-[90px] text-[16px] text-black font-[760] h-[48px] w-full min-w-[112px] max-w-[352px] z-10"
          >
            Delete
          </button>
        </div>

        <div className="flex gap-2 justify-center z-10">
          <label className="text-[white] text-[12px]">
            {t('auth.payment-success-text-1')}
          </label>
          <button className="text-[#7A7A7A] text-[12px]" onClick={handleClick}>
            {t('auth.payment-success-text-2')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
