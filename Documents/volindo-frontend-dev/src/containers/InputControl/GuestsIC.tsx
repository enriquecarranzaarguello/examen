import React from 'react';

import type { GuestsICProps } from '@typing/proptypes';
import type { GuestICType } from '@typing/types';

import { GuestIC } from '@containers';

export default function RoomsIC({
  value = [],
  fieldError,
  onChange,
}: GuestsICProps) {
  const errors = fieldError ? fieldError.array : [];

  const [guests, setGuests] = React.useState<GuestICType[]>(value);

  const handleChangeGuests = (nextGuests: GuestICType[]) => {
    setGuests(nextGuests);
    onChange(nextGuests);
  };

  const handleInputChange = (rowIndex: number, val: GuestICType) => {
    const nextGuests = [...guests];
    nextGuests[rowIndex] = val;
    handleChangeGuests(nextGuests);
  };

  React.useEffect(() => {
    setGuests(value);
  }, [value]);

  return (
    <>
      {guests.map((rowValue, index) => (
        <GuestIC
          key={index}
          rowIndex={index}
          rowValue={rowValue}
          rowError={errors && errors[index] ? errors[index].object : null}
          onChange={handleInputChange}
        />
      ))}
    </>
  );
}
