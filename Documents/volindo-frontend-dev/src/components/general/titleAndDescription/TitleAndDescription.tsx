import React from 'react';
import styles from './styles.module.scss';

const TitleAndDescription = ({
  title,
  description,
  originText,
}: {
  title: string;
  description: string[];
  originText: string;
}) => {
  return (
    <div className={`${styles[originText]}`}>
      {title && <h2 className={`${styles[originText]}_title`}>{title}</h2>}
      {description.length > 0 &&
        description.map((text: string, index: number) => (
          <h4 key={index} className={`${styles[originText]}_description`}>
            {text}
          </h4>
        ))}
    </div>
  );
};

export default TitleAndDescription;
