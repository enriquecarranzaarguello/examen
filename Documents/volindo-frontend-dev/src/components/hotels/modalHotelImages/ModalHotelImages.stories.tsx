import type { Meta, StoryObj } from '@storybook/react';

import ModalHotelImages from './ModalHotelImages';
import { StaysType } from '@typing/types';

const meta: Meta<typeof ModalHotelImages> = {
  component: ModalHotelImages,
};

const arrayTest = {
  hotel_name: 'Radisson Blu Champs Elysées Paris',
  stars: 5,
  Images: [
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb7bGd+mH2+l+G5imVL8fQeIxolQljr/vGc=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb7bGd+mH2+l+G5imVL8fQeIxolQljr/vGc=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb7peOLWmJ1NFux5AJhIJld7xUnJPYXglTw=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb79gWp6YWWw/gNqarLny1cfLvX2YclTEUE=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb5f907WMuOS//SfZJXjjWSyr6RXrn69gvY=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb5a6s0K/wgwVG3HNEn+HQlgc4hI8CqubGs=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb6G+Wt0FlVEJ0QL35a27a99HPKB2y4DMec=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb5wP1VBycZSPB/U2VzbgRDAGpDZy7LHF1E=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb6dcbRXDcxYtakZ/ub7KY0XP/9t71D4PVw=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb484O7Ibgicg04MYJ4iB/JhrRSiFBQW/BE=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb7L6Chv58czJ3K42tYY2+jUQI/3VIAk0Y4=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb6VVoMcikxeU0QY8lrrW21LgjsSqGw26n8=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb6W505kiMX1yz21vIkRDNE4uaSA7VdxEns=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb4G42Jj3OBmVvae4m+t0JNeF5ZCHYDTFxA=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb4aP48Cg8pMsAfcF0HUM6MCklCwOic+BWY=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb4WmePi/ZA+0CeUf0h+5OfHzPQycjSwPJM=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb7Be9GTsn7XP1k9v4kCM8g6Ng6f8Eltqww=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb6e6BKGDdAGpacfoZlegFO4RZVHKIodx9A=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb4RTbuHeV3ViS9TElhgpAtdkOGC8NhKovY=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb79u9Ne3N9vzdPWwQx1mQFdHBtXWKyyPbc=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb41KF8Utl+j8BOpdgTujuRHVh69gXeqVc4=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb4vfCbuTV7A/doWyks1iCQ2dwpjVFWg/0A=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb5ltpcLAEejh65q1mQkntHDc3aaaQYnqmY=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb4xbPpmFdPBnFKFCdaYyr8xPy+hV+1gL5U=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb5cDZAj+SgOknLDt3k/NOCtKxvABxBfdC0=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb5kMm1kI0ZnNja8qFXLSadPkNMN0PuYyTU=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb4keY7JBug97RQ7SOMT/RAOy/uP1tWTkow=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb58EzqLGCfDnRkIDyMFJvGwfFBIhiLAyoA=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb6qXeto42ONr4sKK+YREz/Ij0VAifCBZOg=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb6oBpODgIbLTQ191OMzTZYzvGjQThpL6Yc=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb4pYHQwTtNI25ngxMp1LWJCXCTjVillJ4I=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb7OaY7OxjzIGvOIHVQeggb/TFCUKQ43+8k=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb5zIK8pMCg0Yo2SohVn3y1qpIOyKYyM+oo=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb7GYChK4/0mYmZKyDH2/qw3wr2V9HXKLEU=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb4salCuSGBFZ2Te4Zkw1fof5Z6EIWOF7Rw=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb5QLZpktQtU1+6GdZQ6nuS91iWPRpIGXsA=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb7GYChK4/0mYtwF+PAc3AO1rJ/lbYmBPwY=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb6N0yX18TQXJlmN8KQJPPXaGFkuUHgLNXI=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb7g2+2ULmSR6lb+Yz2ersLXwCETH+m7RiY=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb6S/M7FH26nZcxPBA30kzPhxbqaWdUj/K8=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb5J4DI0Z5bULrEJbdxUGIiLMRMxzyRrySc=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb5FqPJY8ZGAE9cKwnV2caOrEX0uYI5CQhI=',
    'https://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVm2rNwwerpVWH5viv2L2dC1TZDZT0Srb7Fa+BjXuU1IphmwvQV7mTkuT9YjpGH5Mk=',
  ],
};

export default meta;
type Story = StoryObj<typeof ModalHotelImages>;

export const Primary: Story = {
  args: {
    stay: arrayTest as StaysType,
    open: true,
  },
};
