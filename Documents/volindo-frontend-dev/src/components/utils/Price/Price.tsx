import { useAppSelector } from '@context';
import { useCallback } from 'react';

interface Price {
  countryCode: string;
  countryRate: number;
  countrySymbol: string;
  rate: (price: number) => number;
  integerRate: (price: number) => number;
  integerWithOneDecimal: (price: number) => number;
  integerTotal: (price: number) => number;
  baseCurrency: (price: number) => number;
}

export const usePrice = (): Price => {
  const countryCode = useAppSelector(
    state => state.general.currency.selectedCurrency
  );
  const countryRate = useAppSelector(
    state => state.general.currency.currencyNumber
  );
  const countrySymbol = useAppSelector(
    state => state.general.currency.currencySymbol
  );

  const rate = useCallback(
    (price: number) => {
      return price * countryRate;
    },
    [countryRate]
  );

  const integerRate = (price: number) => {
    return Number(rate(price).toFixed(0));
  };

  const integerWithOneDecimal = (price: number) => {
    return Number(rate(price).toFixed(1));
  };

  const integerTotal = (price: number) => {
    return Math.round(rate(price));
  };

  const baseCurrency = (price: number) => {
    return price > 0 ? price / countryRate : 0;
  };

  return {
    countryCode,
    countryRate,
    countrySymbol,
    rate,
    integerRate,
    integerWithOneDecimal,
    integerTotal,
    baseCurrency,
  };
};
