import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/general/Input',
  component: Input,
  parameters: {
    backgrounds: {
      default: 'black',
    },
  },
  argTypes: {
    value: {
      control: false,
    },
    onChange: {
      control: false,
    },
  },
  decorators: [
    Story => {
      const [value, setValue] = useState('');
      const handleChange = (newValue: string) => setValue(newValue);

      return <Story value={value} onChange={handleChange} />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const FilterString: Story = {
  args: {
    title: 'Name',
    inputType: 'text',
    placeholder: 'Hotel Name',
    currencySymbol: '',
  },
};

export const FilterNumber: Story = {
  args: {
    title: 'Price',
    inputType: 'number',
    placeholder: 'Min Price',
    currencySymbol: '$',
  },
};

export const FilterEmail: Story = {
  args: {
    title: '',
    inputType: 'email',
    placeholder: 'Write your email',
    currencySymbol: '',
  },
};
