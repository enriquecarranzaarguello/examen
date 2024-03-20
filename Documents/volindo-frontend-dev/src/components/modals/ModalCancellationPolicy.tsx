import React from 'react';
import { useTranslation } from 'next-i18next';

import type { ModalCancellationPolicyProps } from '@typing/proptypes';

import { Modal } from '@components';
import { usePrice } from '@components/utils/Price/Price';
import { CancellationType } from '@typing/types';
import { passStringToDayMonthYear } from '@utils/timeFunctions';

export default function ModalPolicies({
  open,
  onClose,
  policies,
  supplements,
  isRefundable,
  origin,
}: ModalCancellationPolicyProps) {
  const { t, i18n } = useTranslation('common');
  const price = usePrice();

  const priceWithElements = (Price: number) =>
    `${
      price.countrySymbol + price.integerRate(Price) + ' ' + price.countryCode
    }`;

  const handleNewCancellationCharges = (cancellationCharges: any[]) => {
    const reverseCharge = [...cancellationCharges].reverse();
    const handlePolicyCase = (
      currentPolicy: CancellationType,
      nextPolicy: CancellationType | null
    ) => {
      if (
        currentPolicy.CancellationCharge === 100 &&
        currentPolicy.ChargeType === 'Percentage'
      ) {
        return `${t('stays.full_cancellation')} ${passStringToDayMonthYear(
          currentPolicy.FromDate
        )}`;
      } else if (currentPolicy.ChargeType === 'Fixed') {
        if (currentPolicy.CancellationCharge === 0) {
          return `${t(
            'stays.free_cancellation_before'
          )} ${passStringToDayMonthYear(
            nextPolicy ? nextPolicy.FromDate : currentPolicy.FromDate
          )}`;
        } else {
          return `${t('stays.fixed_cancellation')} $${price
            .integerRate(currentPolicy.CancellationCharge)
            .toFixed(1)} ${
            !nextPolicy
              ? `${t('stays.from')} ${passStringToDayMonthYear(
                  currentPolicy.FromDate
                )}`
              : `${t('stays.before')} ${passStringToDayMonthYear(
                  nextPolicy ? nextPolicy.FromDate : currentPolicy.FromDate
                )}`
          }`;
        }
      }
    };

    const handlePolicies = (reverseCharge: CancellationType[]) => {
      return reverseCharge.map((policy: CancellationType, index: number) => {
        const nextPolicy =
          index < reverseCharge.length - 1 ? reverseCharge[index + 1] : null;
        return (
          <p className="text-white opacity-[.78]" key={index}>
            {handlePolicyCase(policy, nextPolicy)}
          </p>
        );
      });
    };

    return (
      <div className="w-[90%] mx-auto">{handlePolicies(reverseCharge)}</div>
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col justify-center gap-2 p-10 h-screen md:max-h-[250px]">
        <label className="text-white text-[40px] font-[760]">
          {t('stays.cancellation-policy')}
        </label>
        {origin === 'suppliers' ? (
          <>
            {policies?.map((policy: any, index: number) => (
              <div key={index} className="w-[90%] mx-auto flex justify-between">
                <label className="text-white opacity-[.78]">{policy}</label>
              </div>
            ))}
          </>
        ) : (
          <>
            {handleNewCancellationCharges(policies.slice().reverse())}

            {supplements?.[0]?.map((supplement: any, index: number) => (
              <div key={index} className="w-[90%] mx-auto flex justify-between">
                <label className="text-white opacity-[.78]">
                  {supplement.Description === 'mandatory_tax' &&
                    `${i18n.t('stays.mandatory_local_tax', {
                      AMOUNT: priceWithElements(supplement.Price),
                    })}`}
                </label>
              </div>
            ))}
          </>
        )}
      </div>
    </Modal>
  );
}
