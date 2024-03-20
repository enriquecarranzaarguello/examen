import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Middleware } from 'redux';
import { FilterFlights, GroupFilterFlights } from 'src/common/schemas/filters';

interface Segment {
  origin: string;
  destination: string;
  startDate: Date | null;
  endDate?: Date | null;
  index: number;
  roundtrip: boolean;
}
interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

enum FlightClass {
  S = 'Premium Economy',
  C = 'Business',
  J = 'Premium Business',
  F = 'First',
  Y = 'Economy',
  P = 'Premium First',
}

enum FlightClassCode {
  PremiumEconomy = 'S',
  Business = 'C',
  PremiumBusiness = 'J',
  First = 'F',
  Economy = 'Y',
  PremiumFirst = 'P',
}

enum FlightType {
  R = 'round trip',
  O = 'one way',
  M = 'multi trips',
}

export enum FlightTime {
  'Early morning',
  'Morning',
  'Afternoon',
  'Evening',
}

export enum SortFlightType {
  'cheapest',
  'fastest',
  'best',
}

export enum FlightsProvider {
  Duffel = 'Duffel',
  Sabre = 'Sabre',
}

interface Filters {
  sortBy: SortFlightType;
  price: {
    min: number;
    max: number;
    selectedMin: number;
    selectedMax: number;
  };
  airlineName?: string | null;
  selectedAirline: string | null;
  numberOfStops: number;
  departureTime: FlightTime;
  arrivalTime: FlightTime;
}

interface Flight {
  flight_id: number;
  departure_details: {
    city: string;
    city_name: string;
    airport: string;
    departure_date: string;
    datetime: string;
    departure_time: string;
    booking_code: string;
    airline: {
      marketing: {
        airline_code: string;
        airline_name: string;
      };
      operating: {
        airline_code: string;
        airline_name: string;
      };
    };
  };
  arrival_details: {
    city: string;
    city_name: string;
    airport: string;
    arrival_date: string;
    datetime: string;
    arrival_time: string;
    booking_code: string;
    airline: {
      marketing: {
        airline_code: string;
        airline_name: string;
      };
      operating: {
        airline_code: string;
        airline_name: string;
      };
    };
  };
  stops: {
    stop_id: number;
    flight_number: number;
    booking_code: string;
    class_code: string;
    airline: {
      marketing: {
        airline_code: string;
        airline_name: string;
      };
      operating: {
        airline_code: string;
        airline_name: string;
      };
    };
    departure_details: {
      city: string;
      city_name: string;
      airport: string;
      departure_date: string;
      datetime: string;
      departure_time: string;
    };
    arrival_details: {
      city: string;
      city_name: string;
      airport: string;
      arrival_date: string;
      datetime: string;
      arrival_time: string;
    };
    stop_duration: string;
  }[];
  total_time: {
    total_time_in_minutes: number;
    total_time_formatted: {
      days: number;
      hours: number;
      minutes: number;
    };
  };
  flight_number: number;
  booking_code: string;
  class_code: string;
}

interface TotalPrice {
  currency: string;
  provider_base_price: number;
  provider_taxes: number;
  provider_total_price: number;
  volindo_fee: number;
  total_price: number;
}

interface ProviderData {
  provider: `${FlightsProvider}`;
  data: any;
}

interface GeneralDetails {
  class_of_service: string;
  type_of_trip: string;
  total_travelers: number;
  pnr_deadline_datetime: string;
  ticketing_deadline_datetime_mx: string;
  carry_on_available: boolean;
  checked_baggage_available: boolean;
  type_of_passengers: Passengers;
  provider_data?: ProviderData;
}

interface TravelPolicy {
  aplication: string;
  description: string;
  feature_type?: string;
}
interface Feature {
  feature: TravelPolicy;
}

interface BaggagePolicy {
  count: number;
  provision_type: string;
  weight?: string;
  size?: string;
}
interface PolicySegment {
  baggage_policies: BaggagePolicy[];
  destination_airport: string;
  origin_airport: string;
  segment_id: number;
  travel_policies: Feature[];
}
interface PolicyType {
  flight_policies_per_segment: PolicySegment[];
  passenger_type: string;
  volindo_passenger_type: string;
  passanger_id: string;
}

interface ServiceGeneralInfo {
  type: string;
  flight_id: number;
  passenger_id: number;
  total_amount: number;
  currency: string;
  id_provider: string;
}

interface ExtraBaggage extends ServiceGeneralInfo {
  quantity: number;
  weight?: string;
  size?: string;
}

interface ExtraSeats extends ServiceGeneralInfo {
  designator: string;
  disclosures?: string[];
}

interface ExtraCancelFullRefund {
  refund_amount: number;
  terms_and_conditions: string;
  total_amount: number;
  currency: string;
  id_provider: string;
}

interface ExtraServices {
  baggages?: ExtraBaggage[] | null;
  seats?: ExtraSeats[] | null;
  cancel_full_refund?: ExtraCancelFullRefund | null;
}

interface FlightModification {
  modification: string;
  allowed: boolean;
  penalty: {
    amount: number;
    currency: string;
  } | null;
}

interface FlightConditionPerFlight {
  arrival_city: string;
  modifications: FlightModification[];
}

interface FlightConditions {
  all_itinerary: FlightModification[];
  per_flight: FlightConditionPerFlight[];
  on_airline: {
    name: string;
    conditions_of_carriage_url: string | null;
  };
}

interface Itinerary {
  offer_id?: string; // Remove in 3 months (15/12/2023)
  itinerary_id: number;
  total_price: TotalPrice;
  general_details: GeneralDetails;
  flights: Flight[];
  flight_policies?: PolicyType[];
  conditions?: FlightConditions | null;
  extra_services?: ExtraServices;
}

interface SelectedFlight {
  selected_flight_id: string;
  itinerary: Itinerary[];
  travelers: Passengers[];
}
interface FlightSliceType {
  segments: Segment[];
  passengers: Passengers;
  class: FlightClassCode;
  flightType: FlightType;
  filters: Filters;
  results: Itinerary[];
  filteredResults: Itinerary[];
  selectedFlight: SelectedFlight | null;
  isLoadingSkeletons: boolean;
  isLoadingAllItineraries: boolean;
}

const initialState: FlightSliceType = {
  segments: [
    {
      index: 0,
      origin: '',
      destination: '',
      startDate: null,
      endDate: null,
      roundtrip: true,
    },
  ],
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  class: FlightClassCode.Economy,
  flightType: FlightType.R,
  filters: {
    sortBy: SortFlightType.best,
    price: {
      min: 0,
      max: 0,
      selectedMin: 0,
      selectedMax: 0,
    },
    airlineName: null,
    selectedAirline: null,
    numberOfStops: 1,
    departureTime: FlightTime.Morning,
    arrivalTime: FlightTime.Morning,
  },
  results: [],
  filteredResults: [],
  selectedFlight: null,
  isLoadingSkeletons: false,
  isLoadingAllItineraries: false,
};

const getTotalPassengers = (passengers: Passengers): number =>
  passengers.adults + passengers.children + passengers.infants;

export const flightSlice = createSlice({
  name: 'flights',
  initialState: initialState,
  reducers: {
    setFlightOrigin: (
      state,
      action: PayloadAction<{ index: number; origin: string }>
    ) => {
      state.segments[action.payload.index].origin = action.payload.origin;
    },
    setFlightDestination: (
      state,
      action: PayloadAction<{ index: number; destination: string }>
    ) => {
      state.segments[action.payload.index].destination =
        action.payload.destination;
    },
    setFlightStartDate: (
      state,
      action: PayloadAction<{ index: number; startDate: Date }>
    ) => {
      state.segments[action.payload.index].startDate = action.payload.startDate;
    },
    setFlightEndDate: (
      state,
      action: PayloadAction<{ index: number; endDate: Date }>
    ) => {
      state.segments[action.payload.index].endDate = action.payload.endDate;
    },
    incrementFlightAdults: state => {
      const totalPassengers = getTotalPassengers(state.passengers);
      if (totalPassengers < 9) {
        state.passengers.adults++;
      }
    },
    incrementFlightChildren: state => {
      const totalPassengers = getTotalPassengers(state.passengers);
      if (totalPassengers < 9) {
        state.passengers.children++;
      }
    },
    incrementFlightInfants: state => {
      const totalPassengers = getTotalPassengers(state.passengers);
      if (totalPassengers < 9) {
        state.passengers.infants++;
      }
    },
    decrementFlightAdults: state => {
      if (state.passengers.adults > 0) {
        state.passengers.adults--;
      }
    },
    decrementFlightChildren: state => {
      if (state.passengers.children > 0) {
        state.passengers.children--;
      }
    },
    decrementFlightInfants: state => {
      if (state.passengers.infants > 0) {
        state.passengers.infants--;
      }
    },
    setPassengers: (state, action: PayloadAction<Passengers>) => {
      state.passengers = action.payload;
    },
    setFlightClass: (state, action: PayloadAction<FlightClassCode>) => {
      state.class = action.payload;
    },
    setFlightType: (state, action: PayloadAction<FlightType>) => {
      // Remember if only value pass only payload
      state.flightType = action.payload;
    },
    setFlightResults: (state, action: PayloadAction<Itinerary[]>) => {
      state.results = action.payload;
    },
    addFlighsOnResults: (state, action: PayloadAction<Itinerary[]>) => {
      state.results = state.results.concat(action.payload);
    },
    filterFlightResults: (state, action: PayloadAction<FilterFlights[]>) => {
      const filters = action.payload;

      if (state.isLoadingAllItineraries) {
        state.filteredResults =
          state.filters.sortBy === SortFlightType.cheapest
            ? state.results
            : sortFlights(state.filters.sortBy, state.results);
        return;
      }

      const isInGroup = (
        itinerary: Itinerary,
        filters: FilterFlights[],
        group: GroupFilterFlights,
        all: boolean
      ) => {
        const groupFilters = filters.filter(filter => filter.group === group);
        if (groupFilters.length === 0) return true;
        return all
          ? groupFilters.every(filter => filter.fnc(itinerary))
          : groupFilters.some(filter => filter.fnc(itinerary));
      };

      let filteredArray = state.results.filter((itinerary: Itinerary) => {
        return (
          isInGroup(itinerary, filters, GroupFilterFlights.STOPS, false) &&
          isInGroup(
            itinerary,
            filters,
            GroupFilterFlights.DEPARTURE_TIME,
            false
          ) &&
          isInGroup(
            itinerary,
            filters,
            GroupFilterFlights.ARRIVAL_TIME,
            false
          ) &&
          isInGroup(itinerary, filters, GroupFilterFlights.AIRLINE, false) &&
          isInGroup(itinerary, filters, GroupFilterFlights.BAGGAGE, false)
        );
      });

      const priceFilter = filters.find(
        filter => filter.group === GroupFilterFlights.PRICE
      );
      if (priceFilter) {
        filteredArray = filteredArray.filter(itinerary =>
          priceFilter.fnc(itinerary)
        );
      }
      if (state.filters.sortBy !== SortFlightType.cheapest) {
        filteredArray = sortFlights(state.filters.sortBy, filteredArray);
      }

      state.filteredResults = filteredArray;
    },
    sortFlightResults: (state, action: PayloadAction<SortFlightType>) => {
      state.filteredResults = sortFlights(
        action.payload,
        state.filteredResults
      );
      state.filters.sortBy = action.payload;
    },
    addFlightSegment: state => {
      state.segments.push({
        index: state.segments.length + 1,
        origin: '',
        destination: '',
        startDate: null,
        endDate: null,
        roundtrip: false,
      });
    },
    removeFlightSegment: state => {
      state.segments.pop();
    },
    setSegments: (state, action: PayloadAction<Segment[]>) => {
      state.segments = action.payload;
    },
    resetSegments: state => {
      state.segments = state.segments.slice(0, 1);
    },
    resetRoundTrip: state => {
      state.segments[0].roundtrip = false;
    },
    setRoundTrip: state => {
      state.segments[0].roundtrip = true;
    },
    setSelectedFlight: (state, action: PayloadAction<SelectedFlight>) => {
      state.selectedFlight = action.payload;
    },
    resetFlightState: state => {
      state.segments = initialState.segments;
      state.passengers = initialState.passengers;
      state.class = initialState.class;
      state.flightType = initialState.flightType;
      state.filters = initialState.filters;
      state.results = initialState.results;
      state.filteredResults = initialState.filteredResults;
      state.selectedFlight = initialState.selectedFlight;
      state.isLoadingSkeletons = initialState.isLoadingSkeletons;
      state.isLoadingAllItineraries = initialState.isLoadingAllItineraries;
    },
    setIsLoadingSkeletons: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSkeletons = action.payload;
    },
    setIsLoadingAllItineraries: (state, action: PayloadAction<boolean>) => {
      state.isLoadingAllItineraries = action.payload;
    },
  },
});

// Constants for Best Flight Sort
const PRICE_SCORE_MULTIPLIER = 0.5;
const TIME_SCORE_MULTIPLIER = 0.5;

const getTotalTime = (itinerary: Itinerary) => {
  return itinerary.flights.reduce(
    (acc: number, flight: any) => acc + flight.total_time.total_time_in_minutes,
    0
  );
};

const sortFlights = (type: SortFlightType, itineraries: Itinerary[]) => {
  return [...itineraries].sort(
    (itineraryA: Itinerary, itineraryB: Itinerary) => {
      switch (type) {
        case SortFlightType.fastest:
          return getTotalTime(itineraryA) - getTotalTime(itineraryB);
        case SortFlightType.cheapest:
          return (
            itineraryA.total_price.total_price -
            itineraryB.total_price.total_price
          );
        case SortFlightType.best:
          const timeScoreA = getTotalTime(itineraryA) * TIME_SCORE_MULTIPLIER;
          const timeScoreB = getTotalTime(itineraryB) * TIME_SCORE_MULTIPLIER;
          const priceScoreA =
            itineraryA.total_price.total_price * PRICE_SCORE_MULTIPLIER;
          const priceScoreB =
            itineraryB.total_price.total_price * PRICE_SCORE_MULTIPLIER;

          const flightScoreA = timeScoreA + priceScoreA;
          const flightScoreB = timeScoreB + priceScoreB;
          return flightScoreA - flightScoreB;
        default:
          return 0;
      }
    }
  );
};

const flightTypeChangeMiddleware: Middleware<{}, RootState> =
  store => next => action => {
    const { flightType: previousType } = store.getState().flights;
    const result = next(action);
    const { flightType: currentType } = store.getState().flights;

    if (previousType === FlightType.M && currentType !== FlightType.M) {
      store.dispatch(flightSlice.actions.resetSegments());
    }
    return result;
  };

export const {
  setFlightOrigin,
  setFlightDestination,
  setFlightStartDate,
  setFlightEndDate,
  incrementFlightAdults,
  incrementFlightChildren,
  incrementFlightInfants,
  decrementFlightAdults,
  decrementFlightChildren,
  decrementFlightInfants,
  setFlightClass,
  setFlightType,
  setFlightResults,
  addFlighsOnResults,
  setPassengers,
  addFlightSegment,
  removeFlightSegment,
  setSegments,
  resetSegments,
  resetRoundTrip,
  setRoundTrip,
  setSelectedFlight,
  sortFlightResults,
  filterFlightResults,
  setIsLoadingSkeletons,
  setIsLoadingAllItineraries,
  resetFlightState,
} = flightSlice.actions;

export type {
  Segment,
  GeneralDetails,
  Passengers,
  Flight,
  Itinerary,
  Filters,
  ExtraServices,
  ExtraBaggage,
  ExtraSeats,
  ExtraCancelFullRefund,
  PolicyType,
  FlightConditions,
  FlightModification,
};

export { FlightClass, FlightType, FlightClassCode, flightTypeChangeMiddleware };

export default flightSlice.reducer;
