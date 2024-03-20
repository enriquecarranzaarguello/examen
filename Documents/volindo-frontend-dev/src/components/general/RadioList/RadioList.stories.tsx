import type { Meta, StoryObj } from '@storybook/react';

import RadioList from './RadioList';

const meta: Meta<typeof RadioList> = {
  component: RadioList,
  parameters: {
    backgrounds: {
      default: 'black',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioList>;

export const FilterBaseCase: Story = {
  args: {
    title: 'Base Filter',
    items: [
      { label: 'Example', value: 'Value 1', tooltip: false, description: '' },
      { label: 'Example 2', value: 20, tooltip: false, description: '' },
      {
        label: 'Example with tooltip',
        value: 'Value extra',
        tooltip: true,
        description: 'Example description',
      },
    ],
    state: ['Value 1', 20],
    handleSelectItem: (value: any) => console.log(value),
  },
};

export const FilterStars: Story = {
  args: {
    title: 'Star Rating',
    items: [
      { label: '1 Star', value: 1, tooltip: false, description: '' },
      { label: '2 Stars', value: 2, tooltip: false, description: '' },
      { label: '3 Stars', value: 3, tooltip: false, description: '' },
      {
        label: '4 Stars',
        value: 4,
        tooltip: false,
        description: '',
      },
      {
        label: '5 Stars',
        value: 5,
        tooltip: false,
        description: '',
      },
    ],
    state: [1, 3],
    handleSelectItem: (value: any) => console.log(value),
  },
};

export const CancelPoliciesFilter: Story = {
  args: {
    title: 'Cancellation Policy',
    items: [
      {
        value: 'free_cancellation',
        label: `Free Cancellation`,
        tooltip: false,
        description: '',
      },
      {
        value: 'free_cancellation_plus_seven',
        label: 'Free Cancellation +7',
        tooltip: true,
        description:
          'This will filter only hotels that have a cancellation policy that allows you to cancel for a week or more',
      },
    ],
    state: ['free_cancellation'],
    handleSelectItem: (value: any) => console.log(value),
  },
};

export const MealTypeFilter: Story = {
  args: {
    title: 'Meals Type',
    items: [
      {
        value: 'Room_Only',
        label: 'Room Only',
        tooltip: false,
        description: '',
      },
      {
        value: 'All_Inclusive_All_Meal',
        label: 'All Inclusive All Meal',
        tooltip: false,
        description: '',
      },
      {
        value: 'BreakFast',
        label: 'BreakFast',
        tooltip: false,
        description: '',
      },
      {
        value: 'Half_Board',
        label: 'Half Board',
        tooltip: false,
        description: '',
      },
      {
        value: 'Dinner',
        label: 'Dinner',
        tooltip: false,
        description: '',
      },
    ],
    state: ['Dinner', 'Half_Board'],
    handleSelectItem: (value: any) => console.log(value),
  },
};
