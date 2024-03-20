import Image from 'next/image';
import styles from './general-button.module.scss';
import { GeneralButtonType } from '@typing/types';

const SharedButton = ({
  text,
  cb,
  originText,
  index = 0,
  image,
  id = '',
  disabled = false,
  type,
  dataTestId,
  parentType,
}: GeneralButtonType) => {
  return (
    <>
      <button
        data-testid={dataTestId && `hotel-result-card-button-${index}`}
        id={id}
        className={`${styles[originText]} ${styles[`${originText}__${parentType}`]}`}
        type={type}
        onClick={() => cb()}
        disabled={disabled}
      >
        {image && <Image alt="icon" src={image} />}
        <span className="text">{text}</span>
      </button>
    </>
  );
};

export default SharedButton;
