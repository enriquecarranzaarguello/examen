import Image from 'next/image';
import styles from './ServiceDetails.module.scss';
import { HotelStarsRating } from '@components';
import config from '@config';

//Icons
import pinPurple from '@icons/pinPurple.svg';
import pinWL from '@icons/pinBlue.svg';
import phonePurple from '@icons/phonePurple.svg';
import phoneWL from '@icons/phoneBlue.svg';
import emailPurple from '@icons/emailPurple.svg';
import emailWL from '@icons/emailBlue.svg';

interface ServiceDetailsProps {
  serviceName: string;
  address: string;
  email?: string;
  phone?: string;
  rating?: number;
}
const ServiceDetails = ({
  serviceName = '',
  address = '',
  email = '',
  phone = '',
  rating = 0,
}: ServiceDetailsProps) => {
  const WLcheck = config.WHITELABELNAME === 'Volindo';
  const pinIcon = WLcheck ? pinPurple : pinWL;
  const phoneIcon = WLcheck ? phonePurple : phoneWL;
  const emailIcon = WLcheck ? emailPurple : emailWL;

  return (
    <div className={styles.details}>
      <h2 className={styles.details_title}>{serviceName}</h2>
      <div className={styles.details_container}>
        <Image
          src={pinIcon}
          alt={`Direction of ${serviceName}`}
          width={13}
          height={16}
        />
        <p className={styles.details_container_detail}>{address}</p>
      </div>
      {phone && (
        <div className={styles.details_container}>
          <Image
            src={phoneIcon}
            alt={`Phone for ${serviceName}`}
            width={19}
            height={20}
          />
          <p className={styles.details_container_detail}>{phone}</p>
        </div>
      )}
      {email && (
        <div className={styles.details_container}>
          <Image
            src={emailIcon}
            alt={`Email for ${serviceName}`}
            width={20}
            height={20}
          />
          <p className={styles.details_container_detail}>{email}</p>
        </div>
      )}
      {rating > 0 && (
        <HotelStarsRating hotelRating={rating} origin={'proposal'} />
      )}
    </div>
  );
};

export default ServiceDetails;
