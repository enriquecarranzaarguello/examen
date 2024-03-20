import Image from 'next/image';
import pinIconLighten from '@icons/pinLighten.svg';
import { montserratFont } from 'src/components/Layout';
import { StaysType } from '@typing/types';

import styles from './hotel-location.module.scss';

const HotelCardLocation = ({ stay }: { stay: StaysType }) => {
  return (
    <div className={styles.hotelLocation}>
      <label
        className={`${montserratFont.className} ${styles.hotelLocation_hotelName}`}
      >
        {stay?.hotel_name}
      </label>
      <div className={styles.hotelLocation_icon}>
        <Image src={pinIconLighten} width={20} height={20} alt={'location'} />
        <label className={styles.hotelLocation_address}>{stay?.address}</label>
      </div>
    </div>
  );
};

export default HotelCardLocation;
