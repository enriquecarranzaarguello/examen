import { FlightsPort } from 'src/ports';
import {
  Itinerary,
  Segment,
  Passengers,
  FlightClassCode,
  GeneralDetails,
} from '@context/slices/flightSlice/flightSlice';
import { unAuthedInstance, authedInstance } from '@utils/axiosClients';
import { formatISO } from 'date-fns';
import { MetadataFlightRequest } from '@typing/types';
import { AxiosInstance, isCancel } from 'axios';

export default class FlightsRestAdapter implements FlightsPort {
  private static instance: FlightsRestAdapter | null = null;

  private isDuffel: boolean | null;

  private apiClient: AxiosInstance;

  private apiAuthClient: AxiosInstance | null;

  private searchAbort: AbortController | null;

  private constructor(isDuffel: boolean = false) {
    this.isDuffel = isDuffel;
    this.apiClient = unAuthedInstance();
    this.apiAuthClient = null;
    this.searchAbort = null;
  }

  public static getInstance(
    token: string | null = null,
    isDuffel: boolean = false
  ): FlightsRestAdapter {
    if (!FlightsRestAdapter.instance)
      FlightsRestAdapter.instance = new FlightsRestAdapter(isDuffel);
    else {
      if (token)
        FlightsRestAdapter.instance.apiAuthClient = authedInstance(token);
      FlightsRestAdapter.instance.isDuffel = isDuffel;
    }

    return FlightsRestAdapter.instance;
  }

  search = (
    segments: Segment[],
    passengers: Passengers,
    flightClass: FlightClassCode
  ): Promise<{
    itineraries: Itinerary[];
    meta: MetadataFlightRequest;
  }> => {
    if (this.searchAbort) {
      this.searchAbort.abort();
    }

    this.searchAbort = new AbortController();

    return new Promise(async (resolve, reject) => {
      const trips = segments.map(segment => {
        const { origin, index, destination, startDate, endDate, roundtrip } =
          segment;
        let mutatedStartDate: any =
          typeof startDate === 'string' ? new Date(startDate) : startDate;

        let mutatedEndDate: any =
          typeof endDate === 'string' ? new Date(endDate) : endDate;

        return {
          id: index,
          origin,
          destination,
          departing: startDate
            ? formatISO(mutatedStartDate, {
                representation: 'date',
              })
            : '',
          returning: endDate
            ? formatISO(mutatedEndDate, {
                representation: 'date',
              })
            : '',
          roundtrip,
        };
      });

      const body = {
        trips: trips,
        travelers: {
          number_of_adults: passengers.adults,
          number_of_children: passengers.children + passengers.infants,
          age_of_children: Array(passengers.infants)
            .fill(Number(2))
            .concat(Array(passengers.children).fill(Number(17))),
        },
        class_of_service: flightClass,
      };

      try {
        const response = await this.apiClient.post(
          '/duffel/flights/finder',
          body,
          {
            signal: this.searchAbort?.signal,
          }
        );
        resolve({
          itineraries: response.data.itineraries,
          meta: response.data.meta,
        });
      } catch (error: any) {
        if (isCancel(error)) {
          reject({
            status: 410,
            message: 'Search request aborted',
          });
        } else {
          if (error.response)
            reject({
              status: error.response.status,
              message: error.response.data,
            });
          else
            reject({
              status: 500,
              message: error.message,
            });
        }
      } finally {
        this.searchAbort = null;
      }
    });
  };

  searchNextBatch = (
    meta: MetadataFlightRequest,
    generalDetails: GeneralDetails
  ): Promise<{
    itineraries: Itinerary[];
    meta: MetadataFlightRequest;
  }> => {
    return new Promise(async (resolve, reject) => {
      const body = {
        general_details: generalDetails,
        meta: meta,
      };

      try {
        const response = await this.apiClient.post(
          '/duffel/flights/finder/next',
          body
        );
        resolve({
          itineraries: response.data.itineraries,
          meta: response.data.meta,
        });
      } catch (error: any) {
        if (error.response)
          reject({
            status: error.response.status,
            message: error.response.data,
          });
        else
          reject({
            status: 500,
            message: error.message,
          });
      }
    });
  };

  revalidate = (
    passengers: Passengers,
    selectedFlight: Itinerary
  ): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const body = {
        travelers: {
          number_of_adults: passengers.adults,
          number_of_children: passengers.children + passengers.infants,
          age_of_children: Array(passengers.infants)
            .fill(Number(2))
            .concat(Array(passengers.children).fill(Number(17))),
        },
        selected_flight: selectedFlight,
      };

      if (!this.isDuffel) {
        (body.travelers as any) = [body.travelers];
      }

      try {
        const response = await this.apiClient.post(
          `${this.isDuffel ? 'duffel' : ''}/flights/revalidate`,
          body
        );
        resolve(response.data);
      } catch (error: any) {
        if (error.response)
          reject({
            status: error.response.status,
            message: error.response.data,
          });
        else
          reject({
            status: 500,
            message: error.message,
          });
      }
    });
  };
}
