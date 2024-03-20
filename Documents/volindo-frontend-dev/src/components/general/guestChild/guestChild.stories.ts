import type { Meta, StoryObj } from '@storybook/react';
import GuestChild from './GuestChild';

const meta: Meta<typeof GuestChild> = {
  component: GuestChild,
  title: 'Components/general/GuestChild',
  args: {
    testGuestSummary: (object: any) => console.log(object),
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'General child component',
      },
    },
  },
  argTypes: {
    roomNumber: {
      type: 'number',
      defaultValue: 0,
      description: 'Number of the room',
    },
    kidIndex: {
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
type Story = StoryObj<typeof GuestChild>;

export const BaseCase = {
  args: {
    roomNumber: 0,
    kidIndex: 0,
  },
};
