import { useTranslation } from 'next-i18next';
import { CancellationType, RoomDetails } from '@typing/types';
import FreeCancellation from './FreeCancellation';

interface CancellationChargesProps {
  cancellationCharges: CancellationType[];
  refundable: RoomDetails['IsRefundable'];
}

const RefundableStatus = ({
  refundable,
  cancellationCharges,
}: CancellationChargesProps) => {
  const { t } = useTranslation();

  const translatedRefundableString = refundable ? (
    <FreeCancellation cancellationCharges={cancellationCharges} />
  ) : (
    t('stays.non-refundable')
  );

  const textColor = refundable ? 'text-[#099A3a]' : 'text-[#FF6E6E]';

  return (
    <p className={`${textColor} font-[500] text-[15px] mt-0 md:ml-0`}>
      {translatedRefundableString}
    </p>
  );
};

export default RefundableStatus;
