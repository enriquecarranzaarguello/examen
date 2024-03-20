import type { Meta, StoryObj } from '@storybook/react';

import DateDetails from './DateDetails';

const meta: Meta<typeof DateDetails> = {
  component: DateDetails,
  parameters: {
    backgrounds: {
      default: 'black',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateDetails>;

export const Primary: Story = {
  args: {
    checkIn: '2024-03-02',
    checkOut: '2024-04-03',
    hourCheckIn: '3:00 PM',
    hourCheckOut: '12:00 PM',
  },
};
