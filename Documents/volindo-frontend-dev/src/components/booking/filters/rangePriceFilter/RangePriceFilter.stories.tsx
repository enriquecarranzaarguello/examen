import type { Meta, StoryObj } from '@storybook/react';
import RangePriceFilter from './RangePriceFilter';

const meta: Meta<typeof RangePriceFilter> = {
  title: 'Components/booking/RangePriceFilter',
  component: RangePriceFilter,
};

export default meta;
type Story = StoryObj<typeof RangePriceFilter>;

export const Primary: Story = {
  args: {
    disabled: false,
    minValue: 100,
    maxValue: 1000,
    selectedMin: 100,
    selectedMax: 1000,
    currencySymbol: '$',
    handleChangePrice: (value: [number, number]) => {
      console.log(value);
    },
    handleChangeInputPrice: (value: number, switchMinMax: string) => {
      console.log(value, switchMinMax);
    },
  },
};
