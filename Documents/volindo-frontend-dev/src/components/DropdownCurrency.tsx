import React from 'react';
import { Dropdown } from 'rsuite';
import { findPathNameByAvailableFlow } from 'src/helpers/exchangeCurrencyCalculation';
import { useAppDispatch, useAppSelector, getCurrencyResponse } from '@context';
import { useRouter } from 'next/router';

const DropdownCurrency = (props: { pathName: string; currency: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const exchangeCurrencyCode = useAppSelector(
    state => state.general.currency.selectedCurrency
  );

  const handleChangeCurrency = async (selectedValue: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, selectedCurrency: selectedValue },
    });

    dispatch(getCurrencyResponse(selectedValue) as any);
  };

  if (props.pathName === findPathNameByAvailableFlow(props.pathName)) {
    return (
      <Dropdown
        title={
          <span className="dropdown-title-currency">
            {exchangeCurrencyCode}
          </span>
        }
        className="dropdown"
      >
        <Dropdown.Item
          onClick={() => handleChangeCurrency('USD')}
          className={`text-[white!important] hover:text-[black!important] px-[20px!important] ${'font-[700!important]'}`}
        >
          $ USD
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleChangeCurrency('MXN')}
          className={`text-[white!important] hover:text-[black!important] px-[20px!important] ${'font-[700!important]'}`}
        >
          $ MXN
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleChangeCurrency('EUR')}
          className={`text-[white!important] hover:text-[black!important] px-[20px!important] ${'font-[700!important]'}`}
        >
          € EUR
        </Dropdown.Item>
      </Dropdown>
    );
  }
  return null;
};

export default DropdownCurrency;
