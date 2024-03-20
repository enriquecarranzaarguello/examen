import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SortFlightType } from '@context/slices/flightSlice/flightSlice';

const SortButtons: FC<{
  sort: SortFlightType;
  onChangeSort: (_type: SortFlightType) => void;
}> = ({ sort, onChangeSort }) => {
  const { t } = useTranslation();

  const handleSortButtonClick = (type: SortFlightType) => {
    if (sort === type) return;
    onChangeSort(type);
  };

  return (
    <div className="flight-results-container-top-filters">
      <button
        data-testid="flight-filter-cheapest-button"
        onClick={() => handleSortButtonClick(SortFlightType.cheapest)}
        className={sort === SortFlightType.cheapest ? 'active' : ''}
      >
        {t('flights.sort.cheapest')}
      </button>
      <button
        data-testid="flight-filter-best-button"
        onClick={() => handleSortButtonClick(SortFlightType.best)}
        className={sort === SortFlightType.best ? 'active' : ''}
      >
        {t('flights.sort.best')}
      </button>
      <button
        data-testid="flight-filter-fastest-button"
        onClick={() => handleSortButtonClick(SortFlightType.fastest)}
        className={sort === SortFlightType.fastest ? 'active' : ''}
      >
        {t('flights.sort.fastest')}
      </button>
    </div>
  );
};

export default SortButtons;
