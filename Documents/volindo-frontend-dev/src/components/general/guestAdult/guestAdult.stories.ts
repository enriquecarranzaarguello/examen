import type { Meta, StoryObj } from '@storybook/react';
import GuestAdult from './GuestAdult';

const meta: Meta<typeof GuestAdult> = {
  component: GuestAdult,
  title: 'Components/general/GuestAdult',
  args: {
    testGuestSummary: (object: any) => console.log(object),
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'General guest form that allow to write adult guest fields and pass to pather once all validation are true',
      },
    },
  },
  argTypes: {
    roomNumber: {
      type: 'number',
      defaultValue: 0,
      description: 'Number of the room',
    },
    adultIndex: {
      type: 'number',
      defaultValue: 0,
      description: 'Number of the index in the array',
    },
    testGuestSummary: {
      type: 'function',
      description: 'Function pass thru props to communicate the object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GuestAdult>;

export const BaseCase = {
  args: {
    roomNumber: 0,
    adultIndex: 0,
  },
};
