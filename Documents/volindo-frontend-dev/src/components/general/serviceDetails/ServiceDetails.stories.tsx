import type { Meta, StoryObj } from '@storybook/react';

import ServiceDetails from './ServiceDetails';

const meta: Meta<typeof ServiceDetails> = {
  component: ServiceDetails,
  title: 'Components/general/ServiceDetails',
  tags: ['autodocs'],
  argTypes: {
    serviceName: {
      type: 'string',
      description: 'Name of the service or hotel',
    },
    address: {
      type: 'string',
      description: 'Address of the service',
    },
    email: {
      type: 'string',
      description: 'Email of the service',
    },
    phone: {
      type: 'string',
      description: 'Phone number of the service',
    },
    rating: {
      type: 'number',
      defaultValue: 1,
      description: 'Hotel rating stars',
      control: {
        type: 'range',
        min: 1,
        max: 5,
      },
    },
  },
  parameters: {
    backgrounds: {
      default: 'black',
    },
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ServiceDetails>;

export const Hotel: Story = {
  args: {
    serviceName: 'Hacienda de Castilla',
    address:
      'Calle 17 Norte Sm 64 Mza 23 Lotes 9 14 Lotes 9 al 14, Mza. 23 Lotes 9 al 14CancúnQuintana Roo 77524, Cancun, 77524, Mexico',
    rating: 3,
  },
};

export const Suppliers: Story = {
  args: {
    serviceName: 'Parco dei Principi Grand Hotel & SPA',
    address: 'Sadova 19, Warsav, 36001, CZ',
    phone: '5534650123',
    email: 'alex@gmail.com',
  },
};
