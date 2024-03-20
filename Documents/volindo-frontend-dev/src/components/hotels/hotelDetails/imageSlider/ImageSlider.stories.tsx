import type { Meta, StoryObj } from '@storybook/react';

import ImageSlider from './ImageSlider';
import { StaysType } from '@typing/types';

const meta: Meta<typeof ImageSlider> = {
  component: ImageSlider,
};

export default meta;
type Story = StoryObj<typeof ImageSlider>;

export const Primary: Story = {
  args: {
    stay: {
      Images: [
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4duEGyGUdCiEuVC+qzRxZinAvANHbQp1Ew0=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dup1Qc9ZUCYylQjxxIbRyK4Hhe/N3IOs78=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4ds2Mmk2X22SyZCVTwWZQuY2KbteM50pfWc=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dstOd+A6Kz6xSkeFEZlcWpdiK44mKBTZe0=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dszVu6NqKisTd5VKeZckfHumWCfsenS8XU=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dsPBlLE7sQjMUEZOqE969P7HGfI2FWAWlM=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dv4cXzDDvlRnaW+ZeVrjSDy2wfeC1FqnKg=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4duxrBxrg12eHQPVv86a/2iM56ezN018Oc4=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dtKwScKimU5WAzHNaF4rPldEJbU5p/OCeA=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dvONyU7OSOS4ZPuzgstTLagTK0Sow69JRA=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dsjBvfvyVu4tzsCpc6DCGPr7kxTZihXf+U=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4duW4Ozj3JIEG3j3ihNXfySx1WDTCWWngW8=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4duEGyGUdCiEuVC+qzRxZinAvANHbQp1Ew0=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4duxgCJto2INUud0YUOdykzKkV3WyCt2nTI=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4duOydEiDSk5Y/HPK7BW2AjaF+FjD8AvLA4=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dvSBOxgpr69vRNpjWycQPqtLLL+zKKkUe0=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dvGap6DyWCGs/ZqUgX8K5pIgmnU0NLyanQ=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dsGDoE205ppimFxhVWA56HLgSja75fZ6JE=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dsbDgfJgi+e7CBjbb/jfdsEjU1JSVKBALA=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4du7NxIgXWad3usKHyx+/wgzJ8W2p3M2hoc=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dsigX2mx1Ebx3CpENo7ABW3YdLzpKHARqg=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4duYtS9WgdNFsP71G3zziw10WuxOAhO+MgA=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dtu+AS45UuznUBoih9/YDlCIbKDu71i08g=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dtQoA5qcsryxYUria55ZlIQFm1WBqOzyWc=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dsKXIRYhxNgQxcsJ3GRq0hnkYy00aoD9Bc=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dule/QTqvl24wVsqle0+AnRtGNZijP8fRc=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4duoghvF4YWgSakAJ2WfyokCpkfoIOV2qIE=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dtUMKnsYdq4lNQhvWj6ikL4Xtul9waszMQ=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dsSOjBvPkL0KULS3Xpx/V8rEAovMOgZHVE=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dswxedBFMNEr11ve1XQBHGfbTAsLl9tOxQ=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dvqSE/IEvpOQIEGP8Pp5mQIcOLGfZyC0m0=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dvLEDgn8vuVFwmplFnhTk3IAQmqZq7YQYo=',
        'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVfK6FJ9621GsPPWw22ux4dsSpEF9Rz6iYrLpguf7adLpSTkPKvV+4Lk=',
      ],
    } as StaysType,
    setOpenHotelImages: () => console.log('click images'),
  },
};
