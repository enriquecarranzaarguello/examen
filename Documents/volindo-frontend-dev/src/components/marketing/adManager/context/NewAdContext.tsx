import createFastContext from 'src/context/service/createFastContext';
import { NewMarketingAdForm } from '@typing/types';

export const { Provider: NewAdFormContextProvider, useStore: useAdFormStore } =
  createFastContext<NewMarketingAdForm>({
    title: '',
    socialNetwork: '',
    type: 'profile',
    uploadFiles: [],
    filesThumbnails: [],
    adText: '',
    startDate: '',
    endDate: '',
    days: 0,
    startTime: '0',
    endTime: '0',
    budget: 50,
    coupon_budget: 0,
    coupon_name: '',
    percentage: 0,
  });
