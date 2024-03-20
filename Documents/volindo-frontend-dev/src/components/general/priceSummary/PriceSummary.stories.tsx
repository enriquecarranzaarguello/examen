import type { Meta, StoryObj } from '@storybook/react';

import PriceSummary from './PriceSummary';

const meta: Meta<typeof PriceSummary> = {
  component: PriceSummary,
  title: 'Components/general/PriceSummary',
  tags: ['autodocs'],
  args: {
    countrySymbol: '$',
  },
};

export default meta;
type Story = StoryObj<typeof PriceSummary>;

export const Hotel: Story = {
  args: {
    numberOfNights: 1,
    total: 200,
    commission: 450,
    transactionFee: 500,
    calculatedTotal: 1150,
  },
};

export const Supplier: Story = {
  args: {
    numberOfPeople: 1,
    total: 200,
    commission: 450,
    transactionFee: 500,
    calculatedTotal: 1150,
  },
};
