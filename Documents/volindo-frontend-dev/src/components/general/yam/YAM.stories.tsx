import type { Meta, StoryObj } from '@storybook/react';

import YAM from './YAM';

const meta: Meta<typeof YAM> = {
  title: 'Components/general/YAM',
  component: YAM,
};

export default meta;
type Story = StoryObj<typeof YAM>;

export const HotelMenu: Story = {
  args: {
    markers: [
      {
        address:
          '2301 Pasadena Avenue, Los Angeles, CA 90031, United States, Los Angeles, 90031, USA',
        id: 'd366f2a9-8e59-4979-ad11-e0233745d8e8',
        name: 'Pads on Pasadena Ave',
        picture:
          'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLXbViA+KP2ZJycFjg1rL4RqS3kGMvDEyzgxTl4wiKG4vSq/9Rhy8gzhFKNM/1jlgyKLkUQKUlFNxosONgvYVMic6WvxaSiLPZo=',
        position: { lat: 34.07601, lng: -118.2177 },
        price: 1703,
        stars: 2,
      },
      {
        address:
          '123 tester LA, CA 90031, United States, Los Angeles, 90031, USA',
        id: 'd366f2a9-8e59-4979-ad11-e0233745d8e9',
        name: 'Pads on Pasadena Ave',
        picture:
          'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLXbViA+KP2ZJycFjg1rL4RqS3kGMvDEyzgxTl4wiKG4vSq/9Rhy8gzhFKNM/1jlgyKLkUQKUlFNxosONgvYVMic6WvxaSiLPZo=',
        position: { lat: 34.07612, lng: -118.2167 },
        price: 1703,
        stars: 2,
      },
    ],
    //👇 The args you need here will depend on your component
  },
};
