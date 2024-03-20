import styles from './FlightCardSkeleton.module.scss';

const FlightSegmentSkeleton = () => {
  return (
    <div className={styles.flightCard_trip}>
      <div className={styles.flightCard_trip_origin}>
        <span className={`${styles.skeleton} ${styles.skeleton_airline}`} />
        <div className={styles.flightCard_trip_details}>
          <span className={`${styles.skeleton} ${styles.skeleton_text}`} />
          <span className={`${styles.skeleton} ${styles.skeleton_text}`} />
          <div className={styles.flightCard_trip_details_line}>
            <span className={styles.outer} />
            <span className={styles.center} />
            <span className={styles.inner} />
          </div>
          <span className={`${styles.skeleton} ${styles.skeleton_text}`} />
        </div>
      </div>
      <div className={styles.flightCard_trip_flight}>
        <span
          className={`${styles.skeleton} ${styles.skeleton_text} ${styles.flightCard_trip_flight_duration}`}
        />
        <div className={styles.flightCard_trip_flight_destinations}>
          <div
            className={`${styles.flightCard_trip_flight_destinations_line} ${styles.left}`}
          >
            <span
              className={`${styles.skeleton} ${styles.skeleton_text} ${styles.flightCard_trip_flight_destinations_name}`}
            />
          </div>
          <div
            className={styles.flightCard_trip_flight_destinations_line}
          ></div>
          <div
            className={`${styles.flightCard_trip_flight_destinations_line} ${styles.right}`}
          >
            <span
              className={`${styles.skeleton} ${styles.skeleton_text} ${styles.flightCard_trip_flight_destinations_name}`}
            />
          </div>
        </div>
        <span
          className={`${styles.skeleton} ${styles.skeleton_text} ${styles.flightCard_trip_flight_stops}`}
        />
      </div>
      <div className={styles.flightCard_trip_destination}>
        <div
          className={`${styles.flightCard_trip_details} ${styles.destination}`}
        >
          <span className={`${styles.skeleton} ${styles.skeleton_text}`} />
          <span className={`${styles.skeleton} ${styles.skeleton_text}`} />
          <div className={styles.flightCard_trip_details_line}>
            <span className={styles.inner} />
            <span className={styles.center} />
            <span className={styles.outer} />
          </div>
          <span className={`${styles.skeleton} ${styles.skeleton_text}`} />
        </div>
      </div>
    </div>
  );
};

/**
 * A *skeleton* component for emulating the visualization of the `FlightCard` component.
 */
const FlightCardSkeleton = ({ segments = 1 }: { segments?: number }) => {
  return (
    <div className={styles.flightCard}>
      <div className={styles.flightCard_container}>
        {Array(segments)
          .fill(0)
          .map((_, i) => (
            <FlightSegmentSkeleton key={i} />
          ))}
      </div>
      <div className={styles.flightCard_submit}>
        <div className={styles.flightCard_submit_details}>
          <span className={`${styles.skeleton} ${styles.skeleton_text}`} />
          <span className={`${styles.skeleton} ${styles.skeleton_text}`} />
          <span className={`${styles.skeleton} ${styles.skeleton_text}`} />
          <span className={`${styles.skeleton} ${styles.skeleton_text}`} />
        </div>
        <div className={styles.flightCard_submit_price}>
          <span className={`${styles.skeleton} ${styles.skeleton_price}`} />
          <span className={`${styles.skeleton} ${styles.skeleton_button}`} />
        </div>
      </div>
    </div>
  );
};

export default FlightCardSkeleton;
