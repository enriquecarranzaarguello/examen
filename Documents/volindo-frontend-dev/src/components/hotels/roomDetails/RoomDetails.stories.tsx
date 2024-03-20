import type { Meta, StoryObj } from '@storybook/react';

import RoomDetails from './RoomDetails';

const meta: Meta<typeof RoomDetails> = {
  component: RoomDetails,
  title: 'Components/hotels/RoomDetails',
  parameters: {
    backgrounds: {
      default: 'black',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    images: {
      type: 'string',
      control: 'object',
      defaultValue: 0,
      description: 'Object with all image urls',
    },
    hotelName: {
      type: 'string',
      defaultValue: 0,
      description: 'Name of the hotel',
    },
    stars: {
      type: 'number',
      description: 'Stars of the hotel',
    },
    roomNames: {
      type: 'string',
      control: 'object',
      defaultValue: 0,
      description: 'Object with the names of the rooms',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RoomDetails>;

export const OneRoomNoImage: Story = {
  args: {
    images: [],
    hotelName: 'Name of hotel',
    stars: 0,
    roomNames: ['Default name one'],
  },
};

export const SimpleRoom: Story = {
  args: {
    images: [
      'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5lPqBj/Ape0+Cv2ekI3o8o043hZIN0ntuXNcfkasJ98173zDGgoS99y/zWRSPrZKCeQ7nUnoiGHM=',
      'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5lPqBj/Ape0+Cv2ekI3o8o043hZIN0ntuXNcfkasJ98173zDGgoS99y/zWRSPrZKCeQ7nUnoiGHM=',
      'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5lPqBj/Ape0+Cv2ekI3o8o043hZIN0ntuXNcfkasJ980HDIg+TpQd4CVoLmrEVf3uIU8afL1rvVs=',
      'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5lPqBj/Ape0+Cv2ekI3o8o043hZIN0ntuXNcfkasJ9818Zw9UBLLxe8/mJl22yyeaFZTH75TV5fk=',
      'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5lPqBj/Ape0+Cv2ekI3o8o043hZIN0ntuXNcfkasJ983Hr1ppNfbJc0PN+BgdzORKjX1D8FT0+OM=',
    ],
    hotelName: 'Occidental Cuernavaca Barcelo Hotel Group',
    stars: 4,
    roomNames: ['Superior Room - Non-refundable'],
  },
};
export const DoubleRoom: Story = {
  args: {
    images: [
      'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5lPqBj/Ape0+Cv2ekI3o8o043hZIN0ntuXNcfkasJ98173zDGgoS99y/zWRSPrZKCeQ7nUnoiGHM=',
      'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5lPqBj/Ape0+Cv2ekI3o8o043hZIN0ntuXNcfkasJ98173zDGgoS99y/zWRSPrZKCeQ7nUnoiGHM=',
      'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5lPqBj/Ape0+Cv2ekI3o8o043hZIN0ntuXNcfkasJ980HDIg+TpQd4CVoLmrEVf3uIU8afL1rvVs=',
      'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5lPqBj/Ape0+Cv2ekI3o8o043hZIN0ntuXNcfkasJ9818Zw9UBLLxe8/mJl22yyeaFZTH75TV5fk=',
      'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5lPqBj/Ape0+Cv2ekI3o8o043hZIN0ntuXNcfkasJ983Hr1ppNfbJc0PN+BgdzORKjX1D8FT0+OM=',
    ],
    hotelName: 'Occidental Cuernavaca Barcelo Hotel Group',
    stars: 4,
    roomNames: [
      'Superior Room - Non-refundable',
      'Superior Room - Non-refundable',
    ],
  },
};
