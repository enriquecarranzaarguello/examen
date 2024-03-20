import type { Meta, StoryObj } from '@storybook/react';

import AmenitiesList from './AmenitiesList';

const meta: Meta<typeof AmenitiesList> = {
  component: AmenitiesList,
  parameters: {
    backgrounds: {
      default: 'black',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AmenitiesList>;

export const Primary: Story = {
  args: {
    title: 'Facilities',
    roomAmenities: [
      'Airport shuttle',
      '',
      '24-hour check-in',
      'Breakfast',
      'WIFI',
      'Bar',
      'Reception safe',
      'Coffee shop on site',
      'Newpaper',
    ],
    hotelAmenities: [
      'Conference rooms',
      'Balcony / Terrace / Patio',
      'Accessible Hotel',
      'Reception safe',
      'Laundry service',
      'Car parking',
      'Fitness',
      'Dry cleaning',
      'Car Parking',
      'Meeting room',
      'WIFI',
      'Pool',
      'Newpaper',
      'Business services',
      '24-hour check-in',
    ],
  },
};
