import { RoomDetails } from '@typing/types';
import styles from './bedsStatus.module.scss';

const BedsStatus = ({ name }: { name: RoomDetails['Name'] }) => {
  const bedTypes = [
    'Double Bed',
    'Twin Bed',
    'King',
    'Double',
    'Sofa Bed',
    'Twin Sofa Bed',
    'Queen',
    'Twin Bunk Bed',
    'Twin Bunk',
    'Twin',
    'Mixed Dorm',
    'Multiple Beds',
    'Standard Room',
  ];

  const bedCounts: { [key: string]: number } = {};

  bedTypes.forEach(type => {
    const regex = new RegExp(`\\b${type}\\b`, 'gi');
    const matches = name.match(regex);

    if (matches) {
      bedCounts[type] = matches.length;
    }
  });

  const totalBeds = Object.values(bedCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  if (totalBeds > 0) {
    return (
      <div className={styles.bedsStatus}>
        {Object.entries(bedCounts).map(([type, count], index) => {
          if (count > 0) {
            const additionalDivs = [
              'Twin Bed',
              'Twin',
              'Double Bed',
              'Double',
              'Twin Sofa Bed',
              'Twin Sofa',
              'Twin Bunk Bed',
              'Twin Bunk',
              'Two Queen',
            ].includes(type) ? (
              <>
                <div className={styles.bedsStatus_icon}>
                  <div className={styles.bedsStatus_dot}></div>
                  <div className={styles.bedsStatus_line}></div>
                </div>
              </>
            ) : null;

            return (
              <div className={styles.bedsStatus_item}>
                <p className={styles.bedsStatus_count}>
                  {count} {type}
                </p>
                <div className={styles.bedsStatus_dot_little}></div>
                <div className={styles.bedsStatus_icon}>
                  <div className={styles.bedsStatus_dot}></div>
                  <div className={styles.bedsStatus_line}></div>
                </div>
                {additionalDivs}
                <span className={index === 0 ? 'mx-2' : ''}></span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  return null;
};

export default BedsStatus;
