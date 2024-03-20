import type { Meta, StoryObj } from '@storybook/react';

import ComissionInput from './PriceInput';

const meta: Meta<typeof ComissionInput> = {
  title: 'Components/general/commissionInput',
  component: ComissionInput,
};

export default meta;
type Story = StoryObj<typeof ComissionInput>;

export const Primary: Story = {
  args: {
    setValue: () => {},
    value: 20,
    logState: () => {},
    currencySymbol: '$',
  },
};
