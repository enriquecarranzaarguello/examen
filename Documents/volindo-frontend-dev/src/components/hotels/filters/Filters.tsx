import { usePrice } from '@components/utils/Price/Price';

import {
  StarsFilter,
  MealtypeFilter,
  RangePriceFilter,
  HotelNameFilter,
  CancelPoliciesFilter,
} from '@components';

import {
  useAppDispatch,
  setFilterRating,
  setFilterCancelPolicy,
  setFilterMealType,
  setFilterName,
  useAppSelector,
  setFilterPriceUserMinLimit,
  setFilterPriceUserMaxLimit,
  setSwitchPriceMinMax,
} from '@context';

import styles from './filters.module.scss';

interface HotelFiltersProps {
  source: string;
  totalPeticions: number;
}

const HotelFilters = ({ source, totalPeticions }: HotelFiltersProps) => {
  const dispatch = useAppDispatch();

  const hotelFilters = useAppSelector(state => state.hotels.filter);

  const price = usePrice();
  const currencySymbol = price.countrySymbol;

  const onNameChange = (name: string | number) => {
    if (typeof name === 'string') {
      dispatch(setFilterName({ name }));
    }
  };

  const handleCancelPolicyFilter = (cancelPolicy: string | number) => {
    if (typeof cancelPolicy === 'string') {
      const updatedPolicy = hotelFilters.cancelPolicy.includes(cancelPolicy)
        ? hotelFilters.cancelPolicy.filter((item: any) => item !== cancelPolicy)
        : [...hotelFilters.cancelPolicy, cancelPolicy];

      dispatch(setFilterCancelPolicy({ policies: updatedPolicy }));
    }
  };

  const handleMealFilter = (meal: string | number) => {
    if (typeof meal === 'string') {
      const updatedMeals = hotelFilters.mealType.includes(meal)
        ? hotelFilters.mealType.filter((item: any) => item !== meal)
        : [...hotelFilters.mealType, meal];
      dispatch(setFilterMealType({ mealType: updatedMeals }));
    }
  };

  const handleStarFilter = (star: number | string) => {
    if (typeof star === 'number') {
      const updatedStars = hotelFilters.rating?.includes(star)
        ? hotelFilters.rating.filter((item: any) => item !== star)
        : [...hotelFilters.rating, star].sort((a: any, b: any) => b - a);

      dispatch(setFilterRating({ stars: updatedStars }));
    }
  };

  const handleChangePrice = (value: [number, number]) => {
    const [min, max] = value;
    dispatch(
      setFilterPriceUserMinLimit({ userMinLimit: price.baseCurrency(min) })
    );
    dispatch(
      setFilterPriceUserMaxLimit({ userMaxLimit: price.baseCurrency(max) })
    );
  };

  const handleChangeInputPrice = (value: number, switchMinMax: string) => {
    price.baseCurrency(Number(value));

    switch (switchMinMax) {
      case 'min':
        dispatch(
          setFilterPriceUserMinLimit({
            userMinLimit: price.baseCurrency(value),
          })
        );
        break;
      case 'max':
        dispatch(
          setFilterPriceUserMaxLimit({
            userMaxLimit: price.baseCurrency(value),
          })
        );
        break;
      default:
        dispatch(setSwitchPriceMinMax({ value, switchMinMax }));
        break;
    }
  };

  return (
    <>
      <aside
        data-testid="hotel-results-filters"
        className={`${styles.hotelFilteContainer} ${styles[source]}`}
      >
        <HotelNameFilter
          hotelFilters={hotelFilters}
          totalPeticions={totalPeticions}
          onChange={onNameChange}
        />

        <CancelPoliciesFilter
          hotelFilters={hotelFilters}
          totalPeticions={totalPeticions}
          onChange={handleCancelPolicyFilter}
        />

        <RangePriceFilter
          disabled={totalPeticions < 1}
          minValue={price.integerRate(hotelFilters.price.min)}
          maxValue={price.integerRate(hotelFilters.price.max)}
          selectedMin={price.integerRate(hotelFilters.price.selectedMin)}
          selectedMax={price.integerRate(hotelFilters.price.selectedMax)}
          currencySymbol={currencySymbol}
          handleChangePrice={handleChangePrice}
          handleChangeInputPrice={handleChangeInputPrice}
        />

        <StarsFilter
          hotelFilters={hotelFilters}
          totalPeticions={totalPeticions}
          onChange={handleStarFilter}
        />

        <MealtypeFilter
          hotelFilters={hotelFilters}
          totalPeticions={totalPeticions}
          onChange={handleMealFilter}
        />
      </aside>
    </>
  );
};

export default HotelFilters;
