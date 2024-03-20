import { useTranslation } from 'react-i18next';
import Image from 'next/image';

import TicketIcon from '@icons/ticket.svg';
import styles from './ExtraServicesDropdown/extraServicesDropdown.module.scss';

const BookingReference = ({ pnr }: { pnr: string }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.dropdown_title__booking_reference_container}>
        <div
          className={`${styles.dropdown_title} ${styles.dropdown_title__booking_reference}`}
        >
          <Image
            className={styles.icon}
            src={TicketIcon}
            width={21}
            height={21}
            alt="FlightInsurance"
          />
          <span>
            {t('flights.pnr')}: {pnr}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingReference;
