import type { Meta, StoryObj } from '@storybook/react';
import InfoCard from './InfoCard';

import TooltipIcon from '@icons/star-blank.svg';
import FlightPolicyIcon from 'src/assets/icons/flightPolicy.svg';

const meta: Meta<typeof InfoCard> = {
  component: InfoCard,
  title: 'Components/general/InfoCard',
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'black',
    },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof InfoCard>;

/**
 * The most basic use of the `InfoCard` component.
 */
export const Basic: Story = {
  args: {
    title: 'Title of InfoCard',
    information: 'This is a basic example of an InfoCard',
  },
};

/**
 * The use of an `InfoCard` with an Image.
 */
export const WithImage: Story = {
  args: {
    title: 'Enjoy your favorite trips!',
    information:
      'Check your favorite destinations, hotels and book a flight to get your next trip!',
    image: TooltipIcon,
  },
};

/**
 * The use of an `InfoCard` with a Link.
 */
export const WithLink: Story = {
  args: {
    title: 'Airline Conditions',
    information:
      'The conditions that the carrier Iberia has for the trip can be found on the next link.',
    link: {
      text: 'See the conditions...',
      href: 'https://www.iberia.com/gb/bills/conditions/',
      target: '_blank',
    },
    image: FlightPolicyIcon,
  },
};
