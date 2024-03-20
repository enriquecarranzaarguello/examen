import Image from 'next/image';
import config from '@config';
import Link from 'next/link';

import styles from '@styles/marketing.module.scss';

import BigPin from '@icons/marketingIcons/big-pin.svg';
import whitelabellogoBigger from '@icons/whitelabellogoBigger.svg';

const ThankYou = ({
  title,
  description,
  buttonText,
  redirectPath,
}: {
  title: string;
  description: string;
  buttonText: string;
  redirectPath: string;
}) => {
  const checkWL = config.WHITELABELNAME === 'Volindo';
  const checkIconWL = checkWL ? BigPin : whitelabellogoBigger;
  const checkButtonsWL = checkWL
    ? styles.thankyou__content__buttons
    : styles.thankyou__content__buttonsWL;

  return (
    <div className={styles.thankyou__content}>
      <div className={styles.thankyou__image}>
        <Image src={checkIconWL} width={400} alt="Pin" />
      </div>
      <div className={styles.thankyou__content__info}>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className={checkButtonsWL}>
          <Link href={redirectPath}>
            <span>{buttonText}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
