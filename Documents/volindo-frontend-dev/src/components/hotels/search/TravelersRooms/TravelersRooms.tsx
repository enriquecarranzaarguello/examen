import { Room } from '@context/slices/hotelSlice';
import { useTranslation } from 'react-i18next';
import styles from './travelersRooms.module.scss';

const TravelersRooms = ({
  origin,
  actualRooms,
  onAddRoom,
  onRemoveRoom,
  onAddTraveler,
  onRemoveTraveler,
}: {
  origin: string;
  actualRooms: Room[];
  onAddRoom: () => void;
  onRemoveRoom: () => void;
  onAddTraveler: (index: number, type: string) => void;
  onRemoveTraveler: (index: number, type: string) => void;
}) => {
  const { t } = useTranslation();

  const disabledAdult = (adults: number, children: number) => {
    if (children === 0) {
      return adults < 2;
    }

    return adults < 1;
  };

  const handleChangeTraveler = (index: number, value: string, type: string) => {
    let val = value ? parseInt(value) : type === 'adults' ? 1 : 0;
    if (val < 0) {
      val = type === 'adults' ? 1 : 0;
    } else if (type === 'adults' && val > 6) {
      val = 6;
    } else if (type === 'children' && val > 4) {
      val = 4;
    }

    const rooms = [...actualRooms];
    if (type === 'adults') {
      rooms[index] = { ...rooms[index], number_of_adults: val };
    } else {
      const children_age = new Array(val).fill(8);
      rooms[index] = { ...rooms[index], children_age };
    }
  };

  return (
    <div id="popover-travelers" className={styles.travelersRooms}>
      <div
        className={`${styles.travelersRooms_travelerContainer} ${styles['travelersRooms_travelerContainer' + origin]}`}
      >
        {actualRooms.map((item: any, index: number) => (
          <div
            key={index}
            className={styles.travelersRooms_travelerContainer_room}
          >
            <label
              className={styles.travelersRooms_travelerContainer_room_title}
            >{`${t('stays.room')} ${index + 1}`}</label>

            <div
              className={styles.travelersRooms_travelerContainer_room_options}
            >
              <label>{t('stays.adults')}</label>
              <div
                className={
                  styles.travelersRooms_travelerContainer_room_options_buttons
                }
              >
                <button
                  disabled={disabledAdult(
                    item.number_of_adults,
                    item.children_age.length
                  )}
                  onClick={e => {
                    e.preventDefault();
                    onRemoveTraveler(index, 'adults');
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  readOnly
                  value={item.number_of_adults}
                  onChange={e => {
                    e.preventDefault();
                    handleChangeTraveler(index, e.target.value, 'adults');
                  }}
                />
                <button
                  disabled={item.number_of_adults > 5}
                  onClick={e => {
                    e.preventDefault();
                    onAddTraveler(index, 'adults');
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div
              className={styles.travelersRooms_travelerContainer_room_options}
            >
              <label>{t('stays.children')}</label>
              <div
                className={
                  styles.travelersRooms_travelerContainer_room_options_buttons
                }
              >
                <button
                  disabled={item.children_age.length < 1}
                  onClick={e => {
                    e.preventDefault();
                    onRemoveTraveler(index, 'children');
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  readOnly
                  value={item.children_age.length}
                  onChange={e => {
                    e.preventDefault();
                    handleChangeTraveler(index, e.target.value, 'children');
                  }}
                />
                <button
                  disabled={item.children_age.length > 3}
                  onClick={e => {
                    e.preventDefault();
                    onAddTraveler(index, 'children');
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.travelersRooms_travelerContainer_roomOptions}>
        <button
          disabled={actualRooms.length < 2}
          onClick={e => {
            e.preventDefault();
            onRemoveRoom();
          }}
        >
          {t('stays.remove-room')}
        </button>

        <button
          disabled={actualRooms.length > 4}
          onClick={e => {
            e.preventDefault();
            onAddRoom();
          }}
        >
          {t('stays.add-room')}
        </button>
      </div>
    </div>
  );
};

export default TravelersRooms;
