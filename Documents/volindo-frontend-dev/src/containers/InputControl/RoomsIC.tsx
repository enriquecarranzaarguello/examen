import React from 'react';

import type { RoomsICProps } from '@typing/proptypes';
import type { RoomsICType } from '@typing/types';

import { RoomIC } from '@containers';

export default function RoomsIC({
  data,
  value = [],
  fieldError,
  onChange,
}: RoomsICProps) {
  const errors = fieldError ? fieldError.array : [];

  const [rooms, setRooms] = React.useState<RoomsICType[]>(value);

  React.useEffect(() => {
    setRooms(value);
  }, [value]);

  const handleChangeRooms = (nextRooms: RoomsICType[]) => {
    setRooms(nextRooms);
    onChange(nextRooms);
  };

  const handleInputChange = (rowIndex: number, val: RoomsICType) => {
    const nextRooms = [...rooms];
    nextRooms[rowIndex] = val;
    handleChangeRooms(nextRooms);
  };

  return (
    <div className="flex flex-col gap-[80px] pb-[50px] xs:pb-5 sm:pb-5">
      {/* TODO check about naming here rowValue ? */}
      {rooms.map((rowValue, index) => (
        <RoomIC
          key={index}
          data={data}
          rowIndex={index}
          rowValue={rowValue}
          rowError={errors && errors[index] ? errors[index].object : null}
          onChange={handleInputChange}
        />
      ))}
    </div>
  );
}
