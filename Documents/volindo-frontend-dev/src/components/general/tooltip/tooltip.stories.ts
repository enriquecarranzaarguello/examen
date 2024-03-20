import Tooltip from './Tooltip';

export default {
  component: Tooltip,
  title: 'Components/general/Tooltip',
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'black',
    },
    layout: 'centered',
  },
  argTypes: {
    text: {
      type: 'string',
      description: 'Content text',
    },
    description: {
      type: 'string',
      description: 'Description on the tooltip',
    },
    disabled: {
      type: 'boolean',
      description: 'Disabled on the tooltip',
    },
    icon: {
      type: 'string',
      description: 'Icon to change on tooltip',
    },
  },
};

export const BaseCase = {
  args: {
    text: 'Example Text',
    description: 'Description on tooltip',
    disabled: false,
  },
};
