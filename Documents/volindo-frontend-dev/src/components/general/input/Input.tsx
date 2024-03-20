import React from 'react';
import styles from './Input.module.scss';

interface InputProps {
  title?: string;
  value: string | number;
  inputType: 'text' | 'number' | 'email';
  placeholder?: string;
  currencySymbol?: string;
  disabled: boolean;
  onChange: (name: string) => void;
}

const Input = ({
  title,
  value,
  inputType,
  placeholder,
  currencySymbol,
  disabled = false,
  onChange,
}: InputProps) => {
  return (
    <div className={styles.wrapper}>
      {title && <label className={styles.title}>{title}</label>}
      <div className={styles.container}>
        {currencySymbol && (
          <span className={styles.symbol}>{currencySymbol}</span>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          className={styles.input}
          onChange={event => onChange(event.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default Input;
