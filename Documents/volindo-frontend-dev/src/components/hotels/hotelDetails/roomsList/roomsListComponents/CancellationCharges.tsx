import { useTranslation } from 'next-i18next';
import { usePrice } from 'src/components/utils/Price/Price';
import { CancellationType } from '@typing/types';
import { passStringToDayMonthYear } from '@utils/timeFunctions';
import CancellationPolicyList from './CancellationPolicyList';
interface CancellationChargesProps {
  cancellationCharges: CancellationType[];
}

const CancellationCharges = ({
  cancellationCharges,
}: CancellationChargesProps) => {
  const { t } = useTranslation();
  const price = usePrice();

  const handlePolicyCase = (currentPolicy: any, nextPolicy: any) => {
    if (
      currentPolicy.CancellationCharge === 100 &&
      currentPolicy.ChargeType === 'Percentage'
    ) {
      return (
        <>
          <span className="font-[590] text-black">
            {t('stays.full_cancellation')}
          </span>{' '}
          {passStringToDayMonthYear(currentPolicy.FromDate)}
        </>
      );
    } else if (currentPolicy.ChargeType === 'Fixed') {
      if (currentPolicy.CancellationCharge === 0) {
        return (
          <>
            <span className="font-[590] text-black">
              {t('stays.free_cancellation_before')}
            </span>{' '}
            {passStringToDayMonthYear(
              nextPolicy ? nextPolicy.FromDate : currentPolicy.FromDate
            )}
          </>
        );
      } else {
        return (
          <>
            <span className="font-[590] text-black">
              {t('stays.fixed_cancellation')}
            </span>{' '}
            ${price.integerRate(currentPolicy.CancellationCharge).toFixed(1)}{' '}
            {!nextPolicy
              ? `${t('stays.from')} ${passStringToDayMonthYear(
                  currentPolicy.FromDate
                )}`
              : `${t('stays.before')} ${passStringToDayMonthYear(
                  nextPolicy ? nextPolicy.FromDate : currentPolicy.FromDate
                )}`}
          </>
        );
      }
    }
  };

  return (
    <>
      {
        <CancellationPolicyList
          policyCase={handlePolicyCase}
          cancellationCharges={cancellationCharges}
        />
      }
    </>
  );
};

export default CancellationCharges;
