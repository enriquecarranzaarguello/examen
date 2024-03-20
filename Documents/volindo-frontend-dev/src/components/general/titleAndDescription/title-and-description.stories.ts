import TitleAndDescription from './TitleAndDescription';

export default {
  title: 'Components/general/TitleAndDescription',
  component: TitleAndDescription,
};

export const GeneralInformation = {
  args: {
    title: 'General Information',
    description: [
      'Part of the information will be displayed on the proposal of this supplier. The fields that will be visible are colored in white.',
    ],
    originText: 'supplierTitle',
  },
};

export const OnlyTitle = {
  args: {
    title: 'Title without description',
    description: '',
    originText: 'generalTitle',
  },
};

export const OnlyDescription = {
  args: {
    title: '',
    description: ['Description without any title we want', 'here im'],
    originText: 'generalTitle',
  },
};
