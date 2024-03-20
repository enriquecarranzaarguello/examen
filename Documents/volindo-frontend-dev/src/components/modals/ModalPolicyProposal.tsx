import React from 'react';
import type { ModalPolicyArrayProps } from '@typing/proptypes';
import { useTranslation } from 'next-i18next';

import { Modal } from '@components';

export default function ModalPolicyProposal({
  open,
  onClose,
  policies,
}: ModalPolicyArrayProps) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center justify-center w-screen h-screen lg:w-[544px] lg:h-[232px] rounded-[16px]">
        <h2 className="text-2xl font-[760] capitalize text-white">
          {t('suppliers.cancel-policy-proposal')}
        </h2>
        <div>
          {policies ? (
            policies.map((policy: string, index: number) => (
              <>
                <p key={index} className="font-[13px] text-white">
                  {policy}
                </p>
              </>
            ))
          ) : (
            <p>No policies to cancel</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
