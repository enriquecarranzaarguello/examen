import {
  Segment,
  Passengers,
  FlightClassCode,
  Itinerary,
  GeneralDetails,
} from '@context/slices/flightSlice/flightSlice';
import { MetadataFlightRequest } from '@typing/types';

export default interface FlightsPort {
  search: (
    segments: Segment[],
    passengers: Passengers,
    flightClass: FlightClassCode
  ) => Promise<{
    itineraries: Itinerary[];
    meta: MetadataFlightRequest;
  }>;

  searchNextBatch: (
    meta: MetadataFlightRequest,
    generalDetails: GeneralDetails
  ) => Promise<{
    itineraries: Itinerary[];
    meta: MetadataFlightRequest;
  }>;

  revalidate: (
    passengers: Passengers,
    selectedFlight: Itinerary
  ) => Promise<any>;
}
