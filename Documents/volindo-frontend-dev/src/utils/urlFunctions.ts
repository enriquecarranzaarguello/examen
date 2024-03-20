import {
  FlightClass,
  FlightClassCode,
  FlightType,
  Passengers,
  Segment,
} from '@context/slices/flightSlice/flightSlice';
import { formatISO } from 'date-fns';
import { stringToDate } from './timeFunctions';

type Room = {
  number_of_adults: number;
  number_of_children: number;
  children_age: number[];
};

type SearchParams = {
  hotel_id: string;
  city: string;
  destination: string;
  check_in: string;
  check_out: string;
  rooms: Room[];
  nationality: string;
  [key: string]: string | Room[];
};

export const createQueryString = (obj: SearchParams) => {
  const keyValuePairs: string[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (Array.isArray(value) && value.length > 0 && key === 'rooms') {
        value.forEach((room: Room, index: number) => {
          keyValuePairs.push(
            `${encodeURIComponent(
              `${key}[${index}][number_of_adults]`
            )}=${encodeURIComponent(String(room.number_of_adults))}`
          );
          keyValuePairs.push(
            `${encodeURIComponent(
              `${key}[${index}][number_of_children]`
            )}=${encodeURIComponent(String(room.number_of_children))}`
          );

          if (
            Array.isArray(room.children_age) &&
            room.children_age.length > 0
          ) {
            room.children_age.forEach(
              (childAge: number, childIndex: number) => {
                keyValuePairs.push(
                  `${encodeURIComponent(
                    `${key}[${index}][children_age][${childIndex}]`
                  )}=${encodeURIComponent(String(childAge))}`
                );
              }
            );
          }
        });
      } else {
        keyValuePairs.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        );
      }
    }
  }

  return keyValuePairs.join('&');
};

export const decodeQueryString = (
  queryString: string | string[]
): SearchParams => {
  const searchParams: SearchParams = {
    hotel_id: '',
    city: '',
    destination: '',
    check_in: '',
    check_out: '',
    rooms: [],
    nationality: '',
  };

  if (typeof queryString === 'string') {
    const keyValuePairs = queryString.split('&');

    for (const pair of keyValuePairs) {
      const [key, value] = pair.split('=');
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);

      if (decodedKey.includes('[') && decodedKey.includes(']')) {
        // Handle arrays and nested objects
        const keys = decodedKey.match(/[^\[\]]+/g);
        let currentObj: any = searchParams;

        if (keys) {
          for (let i = 0; i < keys.length - 1; i++) {
            const keyPart = keys[i];
            const nextKeyPart = keys[i + 1];

            if (!currentObj[keyPart]) {
              if (nextKeyPart && !Number.isNaN(Number(nextKeyPart))) {
                currentObj[keyPart] = [];
              } else {
                currentObj[keyPart] = {};
              }
            }

            currentObj = currentObj[keyPart];
          }

          const lastKeyPart = keys[keys.length - 1];

          if (Number.isNaN(Number(lastKeyPart))) {
            currentObj[lastKeyPart] = decodedValue;
          } else {
            currentObj.push(Number(decodedValue));
          }
        }
      } else {
        // Handle simple key-value pairs
        searchParams[decodedKey] = decodedValue;
      }
    }
  }

  return searchParams;
};

export const insertHotelId = (queryString: any, hotelId: string): string => {
  const searchParams: SearchParams = {
    hotel_id: '',
    city: '',
    destination: '',
    check_in: '',
    check_out: '',
    rooms: [],
    nationality: '',
  };

  if (queryString) {
    const keyValuePairs = queryString.split('&');

    for (const pair of keyValuePairs) {
      const [key, value] = pair.split('=');
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);

      if (decodedKey.includes('[') && decodedKey.includes(']')) {
        // Handle arrays and nested objects
        const keys = decodedKey.match(/[^\[\]]+/g);
        let currentObj: any = searchParams;

        if (keys) {
          for (let i = 0; i < keys.length - 1; i++) {
            const keyPart = keys[i];
            const nextKeyPart = keys[i + 1];

            if (!currentObj[keyPart]) {
              if (nextKeyPart && !Number.isNaN(Number(nextKeyPart))) {
                currentObj[keyPart] = [];
              } else {
                currentObj[keyPart] = {};
              }
            }

            currentObj = currentObj[keyPart];
          }

          const lastKeyPart = keys[keys.length - 1];

          if (Number.isNaN(Number(lastKeyPart))) {
            currentObj[lastKeyPart] = decodedValue;
          } else {
            currentObj.push(Number(decodedValue));
          }
        }
      } else {
        // Handle simple key-value pairs
        searchParams[decodedKey] = decodedValue;
      }
    }
  }

  searchParams.hotel_id = hotelId;

  return createQueryString(searchParams);
};

export const createSearchFlightQueryString = (
  flightType: FlightType,
  flightClass: FlightClass,
  passengers: Passengers,
  segments: Segment[]
) => {
  const params = new URLSearchParams();
  params.set('type', flightType);
  params.set('class', flightClass);
  params.set('adults', passengers.adults.toString());
  if (passengers.children)
    params.set('children', passengers.children.toString());
  if (passengers.infants) params.set('infants', passengers.infants.toString());
  params.set('origin', segments.map(segment => segment.origin).join('|'));
  params.set(
    'destination',
    segments.map(segment => segment.destination).join('|')
  );
  params.set(
    'dates',
    segments
      .map(segment => {
        const date =
          typeof segment.startDate === 'string'
            ? new Date(segment.startDate)
            : segment.startDate;
        return date
          ? formatISO(date, {
              representation: 'date',
            })
          : '';
      })
      .join('|')
  );
  if (flightType === FlightType.R) {
    const date =
      typeof segments[0].endDate === 'string'
        ? new Date(segments[0].endDate)
        : segments[0].endDate;
    params.set(
      'returnDate',
      date
        ? formatISO(date, {
            representation: 'date',
          })
        : ''
    );
  }

  return params.toString();
};

export const decodeSearchFlightQueryString = (flightQuery: string) => {
  const params = new URLSearchParams(flightQuery);
  let flightClass: FlightClassCode =
    (params.get('class') as FlightClassCode) || FlightClassCode.Economy;
  let flightType: FlightType =
    (params.get('type') as FlightType) || FlightType.R;
  const passengers: Passengers = {
    adults: parseInt(params.get('adults') || '1'),
    children: parseInt(params.get('children') || '0'),
    infants: parseInt(params.get('infants') || '0'),
  };

  // Valid flightClass and flightType
  if (!Object.values(FlightClassCode).includes(flightClass))
    flightClass = FlightClassCode.Economy;
  if (!Object.values(FlightType).includes(flightType))
    flightType = FlightType.R;

  let segments: Segment[] = [];

  if (flightType === FlightType.M) {
    const origins = params.get('origin')?.split('|');
    const destinations = params.get('destination')?.split('|');
    const dates = params.get('dates')?.split('|');

    if (
      origins === undefined ||
      destinations === undefined ||
      dates === undefined
    ) {
      segments.push({
        index: 0,
        origin: '',
        destination: '',
        startDate: new Date(),
        endDate: null,
        roundtrip: false,
      });
    } else {
      segments = origins.map((origin, index) => {
        return {
          index: index,
          origin: origin,
          destination: destinations[index] || '',
          startDate: stringToDate(dates[index] || ''),
          endDate: null,
          roundtrip: false,
        };
      });
    }
  } else {
    const isRoundtrip = flightType === FlightType.R;
    segments.push({
      index: 0,
      origin: params.get('origin') || '',
      destination: params.get('destination') || '',
      startDate: stringToDate(params.get('dates') || ''),
      endDate: params.get('returnDate')
        ? stringToDate(params.get('returnDate') || '')
        : isRoundtrip
          ? stringToDate(params.get('dates') || '')
          : null,
      roundtrip: isRoundtrip,
    });
  }

  return {
    flightClass,
    flightType,
    passengers,
    segments,
  };
};
