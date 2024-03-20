import { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import TooltipIcon from '@icons/tooltip.svg';

const Tooltip = ({
  text,
  description,
  disabled,
  icon,
  stylesProps,
}: {
  text: string;
  description: string | any;
  disabled?: boolean;
  icon?: string;
  stylesProps?: string;
}) => {
  const [showTooltip, setShowTootltip] = useState<boolean>(false);

  return (
    <p className={`${styles.tooltip} ${stylesProps && styles[stylesProps]}`}>
      <span className={styles.tooltip_text}>
        {text}
        <button
          onMouseEnter={() => setShowTootltip(true)}
          onMouseLeave={() => setShowTootltip(false)}
          className={styles.tooltip_text_icon}
          disabled={disabled}
        >
          <Image
            src={icon ? icon : TooltipIcon}
            alt="Tooltip Icon"
            width={10}
            height={10}
          />
        </button>
      </span>
      <div
        className={showTooltip ? styles.tooltip_visible : styles.tooltip_hidden}
      >
        {description}
      </div>
    </p>
  );
};

export default Tooltip;
