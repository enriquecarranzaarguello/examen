import type { Meta, StoryObj } from '@storybook/react';

import HotelNameFilter from './HotelNameFilter';

const meta: Meta<typeof HotelNameFilter> = {
  title: 'Components/booking/HotelNameFilter',
  component: HotelNameFilter,
};

export default meta;
type Story = StoryObj<typeof HotelNameFilter>;

export const Primary: Story = {
  args: {
    hotelFilters: {
      name: 'Default Hotel Name',
      price: { min: 0, max: 500, selectedMin: 0, selectedMax: 500 },
      rating: [3, 4, 5],
      mealType: ['Breakfast', 'Lunch', 'Dinner'],
      orderBy: 'min',
      cancelPolicy: ['Flexible', 'Strict'],
    },
    totalPeticions: 5,
  },
};
