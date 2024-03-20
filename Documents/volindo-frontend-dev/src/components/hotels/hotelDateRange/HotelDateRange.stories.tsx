import type { Meta, StoryObj } from '@storybook/react';

import HotelDateRange from './HotelDateRange';

const meta: Meta<typeof HotelDateRange> = {
  component: HotelDateRange,
};

export default meta;
type Story = StoryObj<typeof HotelDateRange>;

export const Primary: Story = {
  args: {
    data: {
      check_in: '2024-03-07',
      check_out: '2024-03-31',
    },
  },
};
