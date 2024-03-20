import React, { ReactNode, useEffect, useState } from 'react';
import styles from '@styles/deals/hotel.module.scss';

import { GuestAdult, GuestChild } from '@components';
import { useTranslation } from 'react-i18next';

interface Room {
  children_age: number[];
  number_of_adults: number;
  number_of_children: number;
}

interface SummaryProps {
  handleGuest: (guest: any) => void;
  rooms: Room[];
  children: ReactNode;
  origin?: string;
}

const SummaryContainer = ({
  handleGuest,
  rooms,
  children,
  origin,
}: SummaryProps) => {
  const { t } = useTranslation();
  const [guests, setGuests] = useState<any[]>([]);

  const testGuestSummary = (object: any) => {
    const { roomIndex, kidIndex, adultIndex } = object;

    if (object.email) {
      setGuests(prevGuests => {
        const updatedGuests = [...prevGuests];
        if (!updatedGuests[roomIndex]) {
          updatedGuests[roomIndex] = { adults: [], children: [] };
        }
        const existingAdultIndex = updatedGuests[roomIndex].adults.findIndex(
          (adult: any) => adult.adultIndex === object.adultIndex
        );

        if (existingAdultIndex !== -1) {
          updatedGuests[roomIndex].adults[adultIndex] = object;
        } else {
          updatedGuests[roomIndex].adults.push(object);
        }
        return updatedGuests;
      });
    } else {
      setGuests(prevGuests => {
        const updatedGuests = [...prevGuests];
        if (!updatedGuests[roomIndex]) {
          updatedGuests[roomIndex] = { adults: [], children: [] };
        }
        const existingChildIndex = updatedGuests[roomIndex].children.findIndex(
          (child: any) => child.kidIndex === object.kidIndex
        );

        if (existingChildIndex !== -1) {
          updatedGuests[roomIndex].children[kidIndex] = object;
        } else {
          updatedGuests[roomIndex].children.push(object);
        }
        return updatedGuests;
      });
    }
  };

  useEffect(() => {
    if (guests.length === rooms.length) {
      guests.every((guestRoom, index) => {
        const searchRoom = rooms[index];

        if (
          guestRoom.adults.length === searchRoom.number_of_adults &&
          guestRoom.children.length === searchRoom.number_of_children
        )
          handleGuest(guests);
      });
    }
  }, [guests]);

  return (
    <div className={styles.summary}>
      {rooms.map((room: any, roomIndex: number) => (
        <div key={roomIndex}>
          {rooms.length > 1 && (
            <h2 className={styles.summary_title}>
              {t('reservations.room')} {roomIndex + 1}
            </h2>
          )}
          {[...Array(room.number_of_adults)].map((item: number, adultIndex) => (
            <GuestAdult
              key={`${roomIndex}-${adultIndex}`}
              roomNumber={roomIndex}
              adultIndex={adultIndex}
              testGuestSummary={testGuestSummary}
              origin={origin}
            />
          ))}
          {room.children_age.length > 0 &&
            room.children_age.map((item: number, kidIndex: number) => (
              <GuestChild
                key={kidIndex}
                kidIndex={kidIndex}
                roomNumber={roomIndex}
                testGuestSummary={testGuestSummary}
              />
            ))}
        </div>
      ))}
      <div>{children}</div>
    </div>
  );
};

export default SummaryContainer;
