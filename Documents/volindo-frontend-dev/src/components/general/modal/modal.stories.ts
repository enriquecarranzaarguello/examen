import GeneralTextModal from './GeneralModal';

export default {
  component: GeneralTextModal,
};

export const Error201 = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Something went wrong',
    text: 'Sorry, we couldn’t find your hotel, please change parameters and search again',
    action: () => {},
  },
};

export const Error207 = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Oops',
    text: 'Your session time is over, there might be changes in the hotel price',
    action: () => {},
  },
};
