import Image from 'next/image';

//Icons
import starWhiteIcon from '@icons/star-white.svg';
import starGrayIcon from '@icons/star-gray.svg';
import pinPurple from '@icons/pinPurple.svg';
import pinWL from '@icons/pinBlue.svg';

import config from '@config';

import style from '@styles/deals/hotel.module.scss';

const HotelDetails = ({ hotelInfo }: { hotelInfo: any }) => {
  const { HotelName, HotelRating, Map, Address } = hotelInfo;
  const WLcheck = config.WHITELABELNAME === 'Volindo';

  const pinIcon = WLcheck ? pinPurple : pinWL;

  const renderStars = (stars: number) => {
    const filledStars = stars >= 0 ? stars : 0;
    const emptyStars = stars >= 0 ? 5 - stars : 5;

    return (
      <div className={style.hotelDetails_addressContainer_starsContainer}>
        {new Array(filledStars).fill('').map((_, index) => (
          <Image key={index} alt="icon" src={starWhiteIcon} />
        ))}

        {new Array(emptyStars).fill('').map((_, index) => (
          <Image key={index + filledStars} alt="icon" src={starGrayIcon} />
        ))}

        <p
          className={style.hotelDetails_addressContainer_starsContainer_number}
        >
          {stars}.0
        </p>
      </div>
    );
  };

  return (
    <div className={style.hotelDetails}>
      <h2 className={style.hotelDetails_title}>{HotelName}</h2>
      <div className={style.hotelDetails_addressContainer}>
        <Image
          src={pinIcon}
          alt={`Direction of ${HotelName}`}
          width={13}
          height={16}
        />
        <p className={style.hotelDetails_addressContainer_address}>{Address}</p>
      </div>
      <div>{renderStars(HotelRating)}</div>
    </div>
  );
};

export default HotelDetails;
