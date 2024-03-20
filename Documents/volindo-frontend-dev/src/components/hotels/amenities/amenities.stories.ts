import type { Meta, StoryObj } from '@storybook/react';
import Amenities from './Amenities';
import { StaysType } from '@typing/types';

const meta: Meta<typeof Amenities> = {
  component: Amenities,
  parameters: {
    backgrounds: {
      default: 'black',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Amenities>;

export const Primary: Story = {
  args: {
    title: 'Most commons',
    amenities: [
      'Airport shuttle',
      '24-hour check-in',
      'Breakfast',
      'WIFI',
      'Bar',
      'Reception safe',
      'Coffee shop on site',
      'Newpaper',
    ],
    originText: 'amenities',
    color: 'black',
    maxAmenitiesToShow: 16,
  },
};

export const Secondary: Story = {
  args: {
    title: 'Hotel Amenities',
    amenities: [
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
    originText: 'hotel',
    color: 'white',
    maxAmenitiesToShow: 16,
  },
};
