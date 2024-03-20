import React from 'react';
import styles from '@styles/suppliers/proposa.module.scss';
import { useTranslation } from 'react-i18next';

interface TravelersButtonProps {
  addTraveler: () => void;
  deleteTraveler: () => void;
  guestRooms: any;
}

const TravelersButton = ({
  addTraveler,
  deleteTraveler,
  guestRooms,
}: TravelersButtonProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles.buttons}>
      <>
        {guestRooms[0].number_of_adults < 5 && (
          <h2 className={styles.buttons_text} onClick={addTraveler}>
            + {t('suppliers.add_contact')}
          </h2>
        )}
      </>
      {guestRooms[0].number_of_adults > 1 && (
        <h2 className={styles.buttons_text} onClick={deleteTraveler}>
          - {t('suppliers.delete_contact')}
        </h2>
      )}
    </div>
  );
};

export default TravelersButton;
