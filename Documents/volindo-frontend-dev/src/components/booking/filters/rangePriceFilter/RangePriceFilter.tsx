import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// TODO create component natively @abi
import { styled, alpha, Box } from '@mui/system';
import { Slider as BaseSlider, sliderClasses } from '@mui/base/Slider';

interface RangePriceFilterProps {
  disabled: boolean;
  minValue: number;
  maxValue: number;
  selectedMin: number;
  selectedMax: number;
  currencySymbol: string;
  handleChangePrice: (value: [number, number]) => void;
  handleChangeInputPrice: (value: number, switchMinMax: string) => void;
}
import styles from './range-price-filter.module.scss';

import { GeneralInput } from '@components';

const RangePriceFilter = ({
  disabled,
  minValue,
  maxValue,
  selectedMin,
  selectedMax,
  currencySymbol,
  handleChangePrice,
  handleChangeInputPrice,
}: RangePriceFilterProps) => {
  const { t } = useTranslation();
  const [hasChanged, setHasChanged] = useState(false);

  const handleChange = (event: Event, newValue: [number, number]) => {
    handleChangePrice(newValue);
  };

  const changeInputPrice = (value: number, switchMinMax: string) => {
    handleChangeInputPrice(value, switchMinMax);
    if (switchMinMax === 'min') {
      setHasChanged(true);
    }
  };

  const checkMin = () => {
    if (hasChanged && selectedMin === 0) return '';

    if (!!selectedMin) return selectedMin;

    return minValue;
  };

  useEffect(() => {
    if (minValue === 0) {
      setHasChanged(false);
    }
  }, [minValue]);

  return (
    <div className={styles.container}>
      <label className={styles.container_title}>
        {t('stays.price-per-night')}
      </label>

      <div className={styles.container_inputs}>
        <GeneralInput
          value={checkMin()}
          inputType="number"
          currencySymbol={currencySymbol}
          disabled={disabled}
          onChange={value => changeInputPrice(Number(value), 'min')}
        />
        <GeneralInput
          value={selectedMax === 0 ? '' : selectedMax}
          inputType="number"
          currencySymbol={currencySymbol}
          disabled={disabled}
          onChange={value => changeInputPrice(Number(value || 0), 'max')}
        />
      </div>

      <Box sx={{ width: '95%' }}>
        <Slider
          value={[selectedMin, selectedMax]}
          // @ts-ignore
          onChange={handleChange}
          min={minValue}
          max={maxValue}
        />
      </Box>
    </div>
  );
};

export default RangePriceFilter;

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  300: '#66B2FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B3',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Slider = styled(BaseSlider)(
  ({ theme }) => `
  color: #afafaf;
  height: 6px;
  width: 100%;
  padding: 16px 0;
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;

  &.${sliderClasses.disabled} {
    pointer-events: none;
    cursor: default;
    color: $#afafaf;
    opacity: 0.4;
  }

  & .${sliderClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 4px;
    border-radius: 6px;
    background-color: currentColor;
    opacity: 0.3;
  }

  & .${sliderClasses.track} {
    display: block;
    position: absolute;
    height: 5px;
    border-radius: 6px;
    background-color: currentColor;
  }

  & .${sliderClasses.thumb} {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    margin-left: -6px;
    width: 25px;
    height: 25px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    background-color: white;
    transition-property: box-shadow, transform;
    transition-timing-function: ease;
    transition-duration: 120ms;
    transform-origin: center;

    &:hover {
      box-shadow: 0 0 0 6px ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[300],
        0.3
      )};
    }

    &.${sliderClasses.focusVisible} {
      box-shadow: 0 0 0 8px ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[400],
        0.5
      )};
      outline: none;
    }

    &.${sliderClasses.active} {
      box-shadow: 0 0 0 8px ${alpha(
        theme.palette.mode === 'light' ? blue[200] : blue[400],
        0.5
      )};
      outline: none;
      transform: scale(1.2);
    }
  }

  }
`
);
