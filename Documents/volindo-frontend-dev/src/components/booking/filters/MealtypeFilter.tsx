import { useTranslation } from 'react-i18next';
import { RadioList } from '@components';
import { FilterTypeProps } from '@typing/proptypes';

const MealtypeFilter = ({
  hotelFilters,
  totalPeticions,
  onChange,
}: FilterTypeProps) => {
  const { t } = useTranslation();

  const mealOptions = [
    {
      value: 'Room_Only',
      label: t('stays.room-only'),
      tooltip: false,
      description: '',
    },
    {
      value: 'All_Inclusive_All_Meal',
      label: t('stays.all-inclusive'),
      tooltip: false,
      description: '',
    },
    {
      value: 'BreakFast',
      label: t('stays.breakfast'),
      tooltip: false,
      description: '',
    },
    {
      value: 'Half_Board',
      label: t('stays.half-board'),
      tooltip: false,
      description: '',
    },
    {
      value: 'Dinner',
      label: t('stays.dinner'),
      tooltip: false,
      description: '',
    },
  ];
  return (
    <RadioList
      title={t('stays.meals-type')}
      state={hotelFilters.mealType}
      items={mealOptions}
      handleSelectItem={onChange}
      disabled={totalPeticions < 1}
    />
  );
};

export default MealtypeFilter;
