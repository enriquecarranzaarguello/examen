import { useTranslation } from 'next-i18next';
import { CancellationType } from '@typing/types';
import CancellationPolicyList from './CancellationPolicyList';

interface CancellationChargesProps {
  cancellationCharges: CancellationType[];
}

const FreeCancellation = ({
  cancellationCharges,
}: CancellationChargesProps) => {
  const { t } = useTranslation();

  const handlePolicyCase = ({ CancellationCharge }: any) => {
    if (CancellationCharge === 0) {
      return `${t('stays.free_cancellation')}`;
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

export default FreeCancellation;
