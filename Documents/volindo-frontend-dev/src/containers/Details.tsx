import { useState } from 'react';
import Image from 'next/image';
import style from '@styles/deals/hotel.module.scss';

//Icons
import flightIcon from '@icons/flights.svg';
import hotelIcon from '@icons/traveler-stay.svg';
import arrowIcon from '@icons/hotelIcons/arrow-whiteDown.svg';

const Details = ({ open, setOpen, name, children }: any) => {
  return (
    <details open={true} className={style.detailsContainer}>
      <summary
        className={style.detailsContainer_summary}
        onClick={() => setOpen(!open)}
      >
        <Image
          src={name === 'hotel' ? hotelIcon : flightIcon}
          alt="Icon"
          width={15}
          height={15}
        />
        <p className={style.detailsContainer_summary_text}>{name}</p>
        <Image
          className={
            open
              ? `${style.detailsContainer_summary_image}`
              : `${style.detailsContainer_summary_image_rotate}`
          }
          src={arrowIcon}
          alt="Arrow top"
        />
      </summary>
      {children}
    </details>
  );
};

export default Details;
