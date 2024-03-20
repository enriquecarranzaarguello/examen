import type { Meta, StoryObj } from '@storybook/react';
import InputSearch, { InputSearchItem } from './InputSearch';

import PinIcon from '@icons/pin-gray-dot.svg';
import AirplaneIcon from '@icons/airplane.svg';
import PinHotelIcon from '@icons/pin.svg';
import StayHotelIcon from '@icons/hotelIcon.svg';

const EXAMPLE_FLIGHTS_BACK_PAYLOAD = [
  {
    type: 'area',
    code: 'NYC',
    city: 'New York',
    country: 'United States',
  },
  {
    type: 'sub',
    id: 3491,
    code: 'EWR',
    name: 'Newark Liberty International Airport',
    city: 'Newark',
    country: 'United States',
  },
  {
    type: 'sub',
    id: 3536,
    code: 'HPN',
    name: 'Westchester County Airport',
    city: 'White Plains',
    country: 'United States',
  },
  {
    type: 'sub',
    id: 3563,
    code: 'JFK',
    name: 'John F Kennedy International Airport',
    city: 'New York',
    country: 'United States',
  },
  {
    type: 'sub',
    id: 3581,
    code: 'LGA',
    name: 'La Guardia Airport',
    city: 'New York',
    country: 'United States',
  },
];

const EXAMPLE_HOTELS_BACK_PAYLOAD = {
  cities: [
    {
      city: 'Cancun',
      country: 'Mexico',
    },
  ],
  hotels: [
    {
      name: 'The Pyramid at Grand Oasis Cancun',
      id: '707307bd-6709-4b6d-a6ad-0835de86e8cb',
      city: 'Cancun',
      country: 'Mexico',
    },
    {
      name: 'Amara Cancun Beachfront',
      id: '0df2a9ab-4ac3-44f0-aa31-9722c3b7db1d',
      city: 'Cancun',
      country: 'Mexico',
    },
    {
      name: 'Aloft Cancun',
      id: '6c7d4b13-fe65-4171-a01a-36b9001cbd00',
      city: 'Cancun',
      country: 'Mexico',
    },
    {
      name: 'SANDOS CANCUN ALL INCLUSIVE (EX-SANDOS CANCUN LIFESTYLE RESORT)',
      id: '0d3b24e0-352f-4bf9-9773-38facd4f4c4e',
      city: 'Cancun',
      country: 'Mexico',
    },
    {
      name: 'Secrets The Vine Cancun All Inclusive',
      id: '71b52a86-4222-43e1-99e1-d50a3c88a1cf',
      city: 'Cancun',
      country: 'Mexico',
    },
    {
      name: 'Hard Rock Hotel Cancun',
      id: '7173a303-0e10-4e18-9e9b-a45f518fbd79',
      city: 'Cancun',
      country: 'Mexico',
    },
    {
      name: 'JW Marriott Cancun Resort & Spa',
      id: '72f3386b-cc49-440e-8f5d-89aee27ade50',
      city: 'Cancun',
      country: 'Mexico',
    },
    {
      name: 'Cancun .',
      id: 'b6a52f11-c8c6-4c1d-ba71-369b3e90731f',
      city: 'Salou',
      country: 'Spain',
    },
    {
      name: 'Royal Solaris Cancun-All Inclusive',
      id: '5ce8ca72-a50a-475b-ab5a-6c784e4852a2',
      city: 'Cancun',
      country: 'Mexico',
    },
    {
      name: 'Krystal Cancun',
      id: '86cadc77-882f-44a2-afa6-f8d2e17ddf43',
      city: 'Cancun',
      country: 'Mexico',
    },
  ],
};

const itemsForHotels = () => {
  const { cities, hotels } = EXAMPLE_HOTELS_BACK_PAYLOAD;
  const cityItems: InputSearchItem[] = cities.map(city => {
    return {
      value: `${city.city}-${city.country}`,
      label: `${city.city}, ${city.country}`,
      imageType: 'city',
    };
  });

  const hotelItems: InputSearchItem[] = hotels.map(hotel => {
    return {
      value: hotel.id,
      label: `${hotel.name}, ${hotel.city}, ${hotel.country}`,
    };
  });

  return [...cityItems, ...hotelItems];
};

const meta: Meta<typeof InputSearch> = {
  component: InputSearch,
  title: 'Components/General/InputSearch',
  tags: ['autodocs'],
  argTypes: {
    delayOnSearchTime: {
      control: {
        type: 'number',
        min: 0,
      },
    },
    delayOnSearchType: {
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputSearch>;

/**
 * Example of basic usage of the `InputSearch` component.
 */
export const General: Story = {
  args: {
    items: Array(10)
      .fill(0)
      .map((_, i) => {
        return {
          label: `Option ${i + 1}`,
          value: i + 1,
        };
      }),
  },
};

/**
 * Example of use of the `InputSearch` component with a visualization like in the Flights Search.
 *
 * **Note:** This is an example of the use of *sublevel*, different labels on selection, labels rendered as `ReactNodes` and images of different kind.
 */
export const Flights: Story = {
  args: {
    items: EXAMPLE_FLIGHTS_BACK_PAYLOAD.map(airport => {
      return {
        value: airport.code,
        label:
          airport.type === 'area' ? (
            <>
              <b>{airport.code}</b> {airport.city}, {airport.country}
              <br />
              All airports
            </>
          ) : (
            <>
              <b>{airport.code}</b> {airport.name}, {airport.city},{' '}
              {airport.country}
            </>
          ),
        labelOnSelection: `${airport.city} (${airport.code})`,
        sublevel: airport.type === 'sub',
        imageType: airport.type,
      };
    }),
    placeholder: 'Select an Airport...',
    placeholderOnSearch: 'Search Airport...',
    imageItem: AirplaneIcon,
    imagesItemByType: {
      area: PinIcon,
    },
  },
};

/**
 * Example of use of the `InputSearch` component with a visualization like in the Hotels Search.
 *
 * **Note:** This is an example of images of different kind.
 */
export const Hotels: Story = {
  args: {
    items: itemsForHotels(),
    placeholder: 'Select a Location or Hotel...',
    placeholderOnSearch: 'Search Location or Hotel...',
    imageItem: StayHotelIcon,
    imagesItemByType: {
      city: PinHotelIcon,
    },
  },
};

/**
 * Example of how the `onSearch` is triggered with the **default** `"debounce"` delay.
 */
export const WithDebounce: Story = {
  args: {
    items: Array(10)
      .fill(0)
      .map((_, i) => {
        return {
          label: `Option ${i + 1}`,
          value: i + 1,
        };
      }),
    placeholder: 'Click to search or select an option...',
    placeholderOnSearch: 'Search with debounce (default values)...',
    delayOnSearchType: 'debounce',
    delayOnSearchTime: 300,
  },
};

/**
 * Example of how the `onSearch` is triggered with `"throttle"` delay of 1 second.
 */
export const WithThrottling: Story = {
  args: {
    items: Array(10)
      .fill(0)
      .map((_, i) => {
        return {
          label: `Option ${i + 1}`,
          value: i + 1,
        };
      }),
    placeholder: 'Click to search or select an option...',
    placeholderOnSearch: 'Search with throttling...',
    delayOnSearchType: 'throttle',
    delayOnSearchTime: 1000,
  },
};

/**
 * Example of how the `onSearch` is triggered without any delay.
 */
export const WithNoneDelay: Story = {
  args: {
    items: Array(10)
      .fill(0)
      .map((_, i) => {
        return {
          label: `Option ${i + 1}`,
          value: i + 1,
        };
      }),
    placeholder: 'Click to search or select an option...',
    placeholderOnSearch: 'Search without any delay...',
    delayOnSearchType: 'none',
  },
};
