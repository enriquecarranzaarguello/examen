import { useTranslation } from 'react-i18next';

import { RadioList } from '@components';
import { FilterTypeProps } from '@typing/proptypes';

const StarsFilter = ({
  hotelFilters,
  totalPeticions,
  onChange,
}: FilterTypeProps) => {
  const { t } = useTranslation();

  const initValues = [
    {
      label: `1 ${t('stays.num-star')}`,
      value: 1,
      tooltip: false,
      description: '',
    },
    {
      label: `2 ${t('stays.num-star')}s`,
      value: 2,
      tooltip: false,
      description: '',
    },
    {
      label: `3 ${t('stays.num-star')}s`,
      value: 3,
      tooltip: false,
      description: '',
    },
    {
      label: `4 ${t('stays.num-star')}s`,
      value: 4,
      tooltip: false,
      description: '',
    },
    {
      label: `5 ${t('stays.num-star')}s`,
      value: 5,
      tooltip: false,
      description: '',
    },
  ];

  return (
    <RadioList
      title={t('stays.star-rating')}
      state={hotelFilters.rating}
      items={initValues}
      handleSelectItem={onChange}
      disabled={totalPeticions < 1}
    />
  );
};

export default StarsFilter;
