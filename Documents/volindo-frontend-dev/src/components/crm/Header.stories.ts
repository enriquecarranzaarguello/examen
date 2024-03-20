import type { Meta, StoryObj } from '@storybook/react';

import Header from './HeaderCRM';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Header> = {
  component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Reservations: Story = {
  args: {
    active: 'Reservations',
  },
};

export const Travelers: Story = {
  args: {
    active: 'Travelers',
  },
};

export const Suppliers: Story = {
  args: {
    active: 'Suppliers',
  },
};
