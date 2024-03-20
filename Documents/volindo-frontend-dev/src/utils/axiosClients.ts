import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError,
} from 'axios';
import * as Sentry from '@sentry/nextjs';
import config from '@config';
import axiosInstance from 'src/axiosInstance';
import { MixPackagesType } from '@typing/types';

/*
  Refactor
  - an instance with base  config that will be used by all requests
  - need an auth config instance and a non-auth instance as well
  - these should accept body and id
  - no responce or error should be handled here
  - petitions can be used in different places in app
*/

export const authedInstance: (authToken: string) => AxiosInstance = (
  authToken: string
) => {
  const instance = axios.create({
    baseURL: config.api,
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      return response;
    },
    (error: AxiosError): Promise<never> => {
      // Check if error response has a status in the 500 range
      if (error.response) {
        Sentry.captureException(error);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const unAuthedInstance = () => {
  const instance = axios.create({
    baseURL: config.api,
  });

  instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      return response;
    },
    (error: AxiosError): Promise<never> => {
      // Check if error response has a status in the 500 range
      if (error.response) {
        Sentry.captureException(error);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const agentClient = axios.create({
  baseURL: `${config.api}/agent`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const agentMultipartClient = axios.create({
  baseURL: `${config.api}/agent`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const agentRequest = (options: AxiosRequestConfig) =>
  agentClient(options)
    .then(response => response.data)
    .catch(error => {
      if (error.code === 'ERR_NETWORK') {
        console.error('AGENTS_API: Disconnected');
        return 'ERR_NETWORK';
      } else {
        return error.response;
      }
    });

export const agentMultipartRequest = (options: AxiosRequestConfig) =>
  agentClient(options)
    .then(response => response.data)
    .catch(error => {
      if (error.code === 'ERR_NETWORK') {
        console.error('AGENTS_API: Disconnected');
        return 'ERR_NETWORK';
      } else {
        return error.response;
      }
    });

export const getCrmData = (authToken: string) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.get('/bookings/crm/');
};

export const obtainFlights = (body: any, authToken: string) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post('/flights/search', body);
};

export const revalidateFlight = (
  body: any,
  authToken: any,
  duffel: boolean = false
) => {
  if (!duffel) {
    body.travelers = [body.travelers];
  }

  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post(
    `${duffel ? 'duffel' : ''}/flights/revalidate`,
    body
  );
};

export const createPnr = (
  body: any,
  authToken: string,
  duffel: boolean = false
) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post(`${duffel ? 'duffel' : ''}/flights/pnr`, body);
};

export const getProposal = (id: any, duffel: boolean = false) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.get(`${duffel ? 'duffel' : ''}/flights/proposal/${id}`);
};

export const createDuffelPayment = (id: string, payload: any) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.post(`duffel/flights/proposal/payment/${id}`, payload);
};

export const createFlightPayment = (body: any) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.post(`/flights/proposal/`, body);
};

export const getFlightThankyou = (body: any, isDuffel = false) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.post(
    `${isDuffel ? 'duffel' : ''}/flights/proposal/thank-you`,
    body
  );
};

export const getMarketingVideos = () => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.get('/marketing/videos');
};

export const getMarketingCampaing = (id: string) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.get(`marketing/campaigns_manager/campaign/${id}`);
};

export const getMarketingPaymentSecret = (
  campainId: string,
  agentId: string,
  authToken: string,
  body: any
) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post(
    `/marketing/campaigns_manager/campaign/generate_payment/${agentId}/${campainId}`,
    body
  );
};

export const marketingCampSkipPayment = (
  agentId: string,
  campainId: string
) => {
  const axiosInstance = unAuthedInstance();

  return axiosInstance.get(
    `/marketing/campaigns_manager/campaign/skip_payment/${agentId}/${campainId}`
  );
};

export const cancelCampaignFunc = (
  agentId: string,
  campainId: string,
  authToken: string
) => {
  const axiosInstance = authedInstance(authToken);

  return axiosInstance.get(
    `/marketing/campaigns_manager/campaign/cancel/${agentId}/${campainId}`
  );
};

export const getChangeCurrency = (selectedCurrency: string) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.get(`/currency?selectedCurrency=${selectedCurrency}`);
};

export const createTraveler = (body: any, authToken: string) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post(`/travelers`, body);
};

export const updateTraveler = (
  body: any,
  authToken: string,
  travelerId: string
) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.put(`/travelers/${travelerId}`, body);
};

export const deleteTraveler = (authToken: string, travelerId: string) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.delete(`/travelers/${travelerId}`);
};

export const updateTravelerImage = (
  body: any,
  authToken: string,
  travelerId: string
) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.delete(`/travelers/image/${travelerId}`, body);
};

export const getGroups = (agentId: string) => {
  return axiosInstance.get(`/agent/traveler/group/${agentId}`);
};

export const getMarketingCoupons = (body: any) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.post(`/marketing/coupons`, body);
};

export const getCountryCode = (latitude: number, longitude: number) => {
  const apiUrl = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
  return axios.get(`${apiUrl}?latitude=${latitude}&longitude=${longitude}`);
};

export const getHotelData = (bookingId: string, agentId: string) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.get(`/bookings/${bookingId}||${agentId}`);
};

export const getTravelers = (authToken: string) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.get('/travelers');
};

export const createSuscription = (body: any, authToken: string) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post('/payments/paymentIntent', body);
};

//Marketing Service
export const purchasePackage = (
  authToken: any,
  packageName:
    | 'Pro'
    | 'Plus'
    | 'Premium'
    | 'Starter'
    | 'Platinum'
    | 'Diamante'
    | 'None',
  whitelabel: 'volindo' | 'flyway',
  body: any
) => {
  const axiosInstance = authedInstance(authToken);
  const param = `?whitelabel=${whitelabel}`;
  return axiosInstance.post(
    `/marketing/branding/purchase/${packageName}${param}`,
    body
  );
};

export const purchaseMixPackage = (
  authToken: any,
  packageName: MixPackagesType,
  body: any
) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post(
    `/marketing/mix_pack/purchase/${packageName}`,
    body
  );
};

// Proposal Info
export const getProposalDetails = (supplierId: string, agentId: string) => {
  return axiosInstance.post(`/bookings/${agentId}||${supplierId}`);
};

//Supplier Payment
export const payTravelerProposal = (
  authToken: string,
  bookingId: string,
  body: any
) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post(`/suppliers/stripe/${bookingId}`, body);
};

// Hotel Payment
export const payHotelProposal = (body: any) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.post('/bookings/stripe/', body);
};

// Wallet
export const getAgentWallet = (authToken: any) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.get('/wallet/balance');
};

export const requestWalletWithdrawl = (
  authToken: any,
  body: any,
  isPaypal: boolean = true
) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post(
    `/wallet/utils/email/withdrawl/${isPaypal ? 'paypal' : 'bank'}`,
    body
  );
};

// Marketing Payment
export const payMarketing = (authToken: string, body: any) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post(`/marketing/courses`, body);
};

// Marketing get courses ids
export const getAgentCourses = (agentId: string) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.get(`/agent/${agentId}`);
};

// GET URL Videos for and agent
export const getVideoURLs = (authToken: any, body: any) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post(`/marketing/courses/get_courses`, body);
};

export const getMarketingTemplates = (authToken: string) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.get(`/marketing/templates`);
};

export const agentHasSubscription = (agentId: string) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.get(`/agent/subscription/subscriptionId/${agentId}`);
};

// Airports Searcher
export const getAirports = (search: string) => {
  return axios.get(
    `/api/flights/airports?search=${encodeURIComponent(search)}`
  );
};

export const getAirportByCode = (code: string) => {
  return axios.get(`/api/flights/airports?code=${encodeURIComponent(code)}`);
};

export const translateDescription = (message: any) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance.post(`/translate/`, message);
};

// Hotel Searcher
export const searchHotelsAndCities = (search: string, authToken: string) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.get(
    `/hotels/destinations/search?term=${encodeURIComponent(search)}`
  );
};

export const searchHotelById = (hotel_id: string, authToken: string) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.get(
    `/hotels/destinations/search?hotel_id=${encodeURIComponent(hotel_id)}`
  );
};

export const createProposal = (authToken: any, body: any) => {
  const axiosInstance = authedInstance(authToken);
  return axiosInstance.post('/bookings/', body);
};

export const getSupplierDetails = (bookingId: string, agentId: string) => {
  const axiosInstance = unAuthedInstance();
  return axiosInstance(`/suppliers/profile/${bookingId}--${agentId}`);
};
