import React from 'react';
import styles from './RadioList.module.scss';
import { Tooltip } from '@components';

interface Item {
  label: string;
  value: string | number;
  tooltip: boolean;
  description: string;
}

interface RadioListProps {
  title: string;
  state: (string | number)[];
  items: Item[];
  handleSelectItem: (item: string | number) => void;
  disabled?: boolean;
}

const RadioList = ({
  title,
  state,
  items,
  handleSelectItem,
  disabled = false,
}: RadioListProps) => {
  return (
    <div className={styles.radiolist}>
      {title && <label className={styles.title}>{title}</label>}
      <ul>
        {items.map((item: Item, index: number) => (
          <li
            className={styles.option}
            key={index}
            onClick={() => handleSelectItem(item.value)}
          >
            <input
              className={`${styles.radio} inputradiohotelM`}
              checked={state.includes(item.value)}
              disabled={disabled}
              type="radio"
              id={`${item.value}`}
            />
            {item.tooltip ? (
              <Tooltip
                text={item.label}
                description={item.description}
                disabled={false}
              />
            ) : (
              <p className={styles.text}>{item.label}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RadioList;
