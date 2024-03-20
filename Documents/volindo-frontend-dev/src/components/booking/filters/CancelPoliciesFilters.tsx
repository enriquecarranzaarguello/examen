import { useTranslation } from 'react-i18next';
import { RadioList } from '@components';
import { FilterTypeProps } from '@typing/proptypes';

const CancelPoliciesFilters = ({
  hotelFilters,
  totalPeticions,
  onChange,
}: FilterTypeProps) => {
  const { t } = useTranslation();

  const cancellOptions = [
    {
      value: 'free_cancellation',
      label: t('stays.free_cancellation_filter'),
      tooltip: false,
      description: '',
    },
    {
      value: 'free_cancellation_plus_seven',
      label: t('stays.free_cancellation_plus'),
      tooltip: true,
      description: t('stays.free_cancellation_description'),
    },
  ];

  return (
    <RadioList
      title={t('stays.cancellation_policies')}
      state={hotelFilters.cancelPolicy}
      items={cancellOptions}
      handleSelectItem={onChange}
      disabled={totalPeticions < 1}
    />
  );
};

export default CancelPoliciesFilters;
