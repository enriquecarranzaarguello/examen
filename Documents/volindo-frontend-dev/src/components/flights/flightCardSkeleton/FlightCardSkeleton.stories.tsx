import type { Meta, StoryObj } from '@storybook/react';

import FlightCardSkeleton from './FlightCardSkeleton';

const meta: Meta<typeof FlightCardSkeleton> = {
  component: FlightCardSkeleton,
  title: 'Components/flights/FlightCardSkeleton',
  argTypes: {
    segments: {
      type: 'number',
      defaultValue: 1,
      description: 'The number of flights segments to render',
      control: {
        type: 'range',
        min: 1,
        max: 10,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FlightCardSkeleton>;

/**
 * Example of use for making a skeleton for a *Oneway* flight.
 */
export const Oneway: Story = {
  args: {
    segments: 1,
  },
  render: ({ segments }) => (
    <div style={{ backgroundColor: '#f6f5f7', width: '100%', height: '100%' }}>
      <div style={{ maxWidth: '1150px', padding: '1.25rem 1.625rem' }}>
        <FlightCardSkeleton segments={segments} />
      </div>
    </div>
  ),
};

/**
 * Example of use for making a skeleton for a *Roundtrip* flight.
 */
export const Roundtrip: Story = {
  args: {
    segments: 2,
  },
  render: ({ segments }) => (
    <div style={{ backgroundColor: '#f6f5f7', width: '100%', height: '100%' }}>
      <div style={{ maxWidth: '1150px', padding: '1.25rem 1.625rem' }}>
        <FlightCardSkeleton segments={segments} />
      </div>
    </div>
  ),
};

/**
 * Example of use for making a skeleton for a *Multitrip* flight.
 */
export const Multitrip: Story = {
  args: {
    segments: 3,
  },
  render: ({ segments }) => (
    <div style={{ backgroundColor: '#f6f5f7', width: '100%', height: '100%' }}>
      <div style={{ maxWidth: '1150px', padding: '1.25rem 1.625rem' }}>
        <FlightCardSkeleton segments={segments} />
      </div>
    </div>
  ),
};
