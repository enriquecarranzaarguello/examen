import { GeneralInput } from '@components';
import { useTranslation } from 'react-i18next';
import { FilterTypeProps } from '@typing/proptypes';

const HotelNameFilter = ({
  hotelFilters,
  totalPeticions,
  onChange,
}: FilterTypeProps) => {
  const { t } = useTranslation();

  return (
    <GeneralInput
      title={`${t('stays.name')}`}
      inputType="text"
      value={hotelFilters.name}
      placeholder=""
      disabled={totalPeticions < 1}
      onChange={onChange}
    />
  );
};

export default HotelNameFilter;
