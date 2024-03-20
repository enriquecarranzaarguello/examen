import SharedButton from './GeneralButton';
import arrowRightTwoIcon from '@icons/arrow-right-two.svg';
import mapIcon from '@icons/map.svg';

export default {
  title: 'Components/general/GeneralButton',
  component: SharedButton,
};

export const Primary = {
  args: {
    disabled: false,
    text: 'click',
    cb: () => console.log('here is primary cb'),
    originText: 'primary',
  },
};

export const OnlyIcon = {
  args: {
    disabled: false,
    text: '',
    cb: () => console.log('here is primary cb'),
    originText: 'only_icon',
    image: arrowRightTwoIcon,
  },
};

export const IconAndImage = {
  args: {
    text: 'show map',
    originText: 'icon_and_text',
    image: mapIcon,
  },
};
