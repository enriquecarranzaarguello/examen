// YourComponent.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react';

import Quak from './Conekta';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Quak> = {
  component: Quak,
};

export default meta;
type Story = StoryObj<typeof Quak>;

export const Pago: Story = {
  args: {
    checkoutRequestId: 'e6788c69-aea9-4035-82b0-6dbca7e7a844',
    publicKey: 'key_LY4pm2UYfdu2TMXupiHb72m',
    //👇 The args you need here will depend on your component
  },
};
