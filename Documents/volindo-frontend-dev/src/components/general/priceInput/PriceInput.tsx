import React from 'react';

import styles from '@styles/deals/hotel.module.scss';

import { ToggleButton } from '@components';

interface CommisionTypes {
  setValue: (value: number) => void;
  value: number;
  logState: (state: any) => void;
  commissionType?: number;
  currencySymbol: string;
  typeOfInput?: string;
  origin?: string;
}

const ComissionInput = ({
  setValue,
  value,
  commissionType,
  logState,
  currencySymbol = '$',
  typeOfInput,
  origin,
}: CommisionTypes) => {
  return (
    <div className={styles.priceDetails_field}>
      <input
        placeholder="0"
        type="number"
        className={styles.priceDetails_field_input}
        onChange={e => {
          const value = parseFloat(e.target.value);
          if (!isNaN(value) && value >= 1) {
            setValue(value);
          } else {
            setValue(0);
          }
        }}
        value={value === 0 ? '' : value}
      />
      {typeOfInput === 'commission' && (
        <div className={styles.priceDetails_field_options}>
          <span
            className={`${styles.priceDetails_field_options_option} ${
              commissionType ? styles.active : ''
            }`}
          >
            %
          </span>
          <ToggleButton toggled={false} onClick={logState} />
          <span
            className={`${styles.priceDetails_field_options_option} ${
              !commissionType ? styles.active : ''
            }`}
          >
            {currencySymbol}
          </span>
        </div>
      )}
    </div>
  );
};

export default ComissionInput;
