import { Schema } from 'rsuite';

import type { BootType, SearchStaysFiltersType } from '@typing/types';

export const DEFAULT_FILTERS_STAYS_VALUES: SearchStaysFiltersType = {
  hotel_id: '',
  destination: '',
  check_in: '',
  check_out: '',
  rooms: [],
  nationality: '',
  city: '',
  NoOfRooms: 1,
};

export const FiltersStaysSchema = (boot: BootType) => {
  return Schema.Model({
    destination: Schema.Types.StringType().isRequired(boot.required),
    check_in: Schema.Types.StringType().isRequired(boot.required),
    check_out: Schema.Types.StringType().isRequired(boot.required),
    rooms: Schema.Types.ArrayType().of(
      Schema.Types.ObjectType().shape({
        number_of_adults: Schema.Types.NumberType().isRequired(boot.required),
        children_age: Schema.Types.ArrayType().of(
          Schema.Types.NumberType().isRequired(boot.required)
        ),
      })
    ),
    nationality: Schema.Types.StringType().isRequired(boot.required),
  });
};

// * FLIGHTS FILTERS * //

export enum GroupFilterFlights {
  PRICE = 'price',
  AIRLINE = 'airline',
  STOPS = 'stops',
  DEPARTURE_TIME = 'departure_time',
  ARRIVAL_TIME = 'arrival_time',
  BAGGAGE = 'baggage',
}

export type FilterFlights = {
  name: string | number;
  group: GroupFilterFlights;
  fnc: Function;
};

export type AvailableFilters = {
  areNonstops: boolean;
  are1Stop: boolean;
  areMore2Stops: boolean;
  departureEarly: boolean;
  departureMorning: boolean;
  departureAfternoon: boolean;
  departureEvening: boolean;
  arrivalEarly: boolean;
  arrivalMorning: boolean;
  arrivalAfternoon: boolean;
  arrivalEvening: boolean;
  areCarryOnBaggage: boolean;
  areCheckedBaggage: boolean;
  arePersonalItemOnly: boolean;
};
