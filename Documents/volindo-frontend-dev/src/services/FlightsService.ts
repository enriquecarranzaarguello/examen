import { FlightsRestAdapter } from '@adapters/index';
import FlightsPort from '@ports/FlightsPort';
import {
  Itinerary,
  Segment,
  Passengers,
  FlightClassCode,
  GeneralDetails,
} from '@context/slices/flightSlice/flightSlice';
import { MetadataFlightRequest } from '@typing/types';

export class FlightsService {
  private adapter: FlightsPort;

  constructor(token: string | null = null, isDuffel: boolean = false) {
    this.adapter = FlightsRestAdapter.getInstance(token, isDuffel);
  }

  search = (
    segments: Segment[],
    passengers: Passengers,
    flightClass: FlightClassCode
  ): Promise<{
    itineraries: Itinerary[];
    meta: MetadataFlightRequest;
  }> => {
    return this.adapter.search(segments, passengers, flightClass);
  };

  searchNextBatch = (
    meta: MetadataFlightRequest,
    generalDetails: GeneralDetails
  ): Promise<{
    itineraries: Itinerary[];
    meta: MetadataFlightRequest;
  }> => {
    return this.adapter.searchNextBatch(meta, generalDetails);
  };

  revalidate = (
    passengers: Passengers,
    selectedFlight: Itinerary
  ): Promise<any> => {
    return this.adapter.revalidate(passengers, selectedFlight);
  };
}
