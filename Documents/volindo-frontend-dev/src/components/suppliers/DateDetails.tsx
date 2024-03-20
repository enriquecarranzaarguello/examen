import React from 'react';
import styles from '@styles/suppliers/proposa.module.scss';

interface ServiceDetails {
  checkInDate: string;
  checkOutDate: string;
  checkInHour: string;
  checkOutHour: string;
}

interface DateDetailsProps {
  check_in: boolean;
  check_out: boolean;
  serviceDetails: ServiceDetails;
  handleUpdateServiceDetails: (name: string, value: string) => void;
}

const DateDetails = ({
  check_in,
  check_out,
  serviceDetails,
  handleUpdateServiceDetails,
}: DateDetailsProps) => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const handleChange = (name: string, info: string) => {
    handleUpdateServiceDetails(name, info);
  };

  return (
    <form className={styles.form}>
      <h2 className={styles.form_title}>Detalles del servicio</h2>
      {check_in && (
        <>
          <h5 className={styles.form_subtitle}>Inicio del servicio</h5>
          <div className={styles.form_twoField}>
            <input
              type="date"
              name="checkInDate"
              min={todayString}
              max={serviceDetails.checkOutDate}
              className={styles.form_twoField_field}
              onChange={e => handleChange(e.target.name, e.target.value)}
              required
            />
            <input
              type="time"
              name="checkInHour"
              min="03:00"
              className={styles.form_twoField_field}
              onChange={e => handleChange(e.target.name, e.target.value)}
              required
            />
          </div>
        </>
      )}
      {check_out && (
        <>
          <h5 className={styles.form_subtitle}>Fin del servicio</h5>
          <div className={styles.form_twoField}>
            <input
              type="date"
              name="checkOutDate"
              disabled={serviceDetails.checkInDate === ''}
              min={serviceDetails.checkInDate}
              className={styles.form_twoField_field}
              onChange={e => handleChange(e.target.name, e.target.value)}
              required
            />
            <input
              type="time"
              name="checkOutHour"
              min="12:00"
              className={styles.form_twoField_field}
              onChange={e => handleChange(e.target.name, e.target.value)}
              required
            />
          </div>
        </>
      )}
    </form>
  );
};

export default DateDetails;
