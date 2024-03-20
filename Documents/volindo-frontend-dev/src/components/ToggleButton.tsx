import React, { useState } from 'react';
import styles from '../styles/toggle.module.scss';

const Toggle = ({
  toggled,
  onClick,
}: {
  toggled: boolean;
  onClick: (state: boolean) => void;
}) => {
  const [isToggled, toggle] = useState(true);

  const callback = () => {
    toggle(!isToggled);
    onClick(!isToggled);
  };

  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        defaultChecked={isToggled}
        onClick={callback}
        className={styles.label_input}
      />
      <span className={styles.label_span} />
    </label>
  );
};

export default Toggle;
