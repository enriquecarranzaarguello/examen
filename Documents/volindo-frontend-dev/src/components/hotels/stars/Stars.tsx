import Image from 'next/image';

import starBlackIcon from '@icons/hotelIcons/starBlackIcon.svg';
import starRectGrayIcon from '@icons/hotelIcons/starGrayIcon.svg';
import starRectWhiteIcon from '@icons/hotelIcons/starWhiteIcon.svg';
import starRounededWhiteIcon from '@icons/star-white.svg';
import starRounededGrayIcon from '@icons/star-gray.svg';
import starPurple from '@icons/star-purple.svg';

import styles from './stars.module.scss';

const HotelStarsRating = ({
  hotelRating,
  origin,
  styleProp,
}: {
  hotelRating: number;
  origin: string;
  styleProp?: string;
}) => {
  const filledStars = hotelRating;
  const starWhiteIcon =
    origin !== 'hotelCard' ? starRounededWhiteIcon : starRectWhiteIcon;
  const starGrayIcon =
    origin !== 'hotelCard' ? starRounededGrayIcon : starRectGrayIcon;

  const emptyStars = hotelRating > 0 ? 5 - hotelRating : 5;

  return (
    <>
      <div className={styles.starsContainer}>
        <div
          className={`${styles.starsContainer_stars} ${styleProp ? styles[styleProp] : ''}`}
        >
          {new Array(filledStars).fill('').map((_, index) => (
            <Image
              key={index}
              alt="iconSta"
              src={
                origin === 'hotelCard'
                  ? starBlackIcon
                  : origin === 'purple'
                    ? starPurple
                    : starWhiteIcon
              }
            />
          ))}
          {origin !== 'proposal' && (
            <>
              {new Array(emptyStars).fill('').map((_, index) => (
                <Image key={index} alt="icon" src={starGrayIcon} />
              ))}
            </>
          )}
        </div>
        {origin !== 'hotelCard' && (
          <div className={styles.starsContainer_text}>{`${hotelRating}.0`}</div>
        )}
      </div>
    </>
  );
};

export default HotelStarsRating;
