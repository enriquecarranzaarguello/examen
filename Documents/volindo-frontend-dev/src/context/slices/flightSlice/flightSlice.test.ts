import { Store, configureStore } from '@reduxjs/toolkit';
import {
  flightSlice,
  FlightClassCode,
  FlightType,
  FlightTime,
  SortFlightType,
} from './flightSlice';

describe('FlightSlice', () => {
  let store: Store;

  beforeEach(() => {
    store = configureStore({ reducer: { flights: flightSlice.reducer } });
  });

  it('should handle initial state', () => {
    const { flights } = store.getState();
    expect(flights.segments).toEqual([
      {
        index: 0,
        origin: '',
        destination: '',
        startDate: null,
        endDate: null,
        roundtrip: true,
      },
    ]);
    expect(flights.passengers).toEqual({
      adults: 1,
      children: 0,
      infants: 0,
    });
    expect(flights.class).toEqual(FlightClassCode.Economy);
    expect(flights.flightType).toEqual(FlightType.R);
    expect(flights.filters.sortBy).toEqual(SortFlightType.cheapest);
    expect(flights.filters.price).toEqual({
      min: 0,
      max: 0,
      selectedMin: 0,
      selectedMax: 0,
    });
    expect(flights.filters.airlineName).toBeNull();
    expect(flights.filters.selectedAirline).toBeNull();
    expect(flights.filters.numberOfStops).toEqual(1);
    expect(flights.filters.departureTime).toEqual(FlightTime.Morning);
    expect(flights.filters.arrivalTime).toEqual(FlightTime.Morning);
    expect(flights.results).toEqual([]);
    expect(flights.filteredResults).toEqual([]);
    expect(flights.selectedFlight).toBeNull();
  });

  it('should handle setFlightOrigin', () => {
    store.dispatch(
      flightSlice.actions.setFlightOrigin({
        index: 0,
        origin: 'New Origin',
      })
    );
    expect(store.getState().flights.segments[0].origin).toEqual('New Origin');
  });

  it('should handle setFlightDestination', () => {
    store.dispatch(
      flightSlice.actions.setFlightDestination({
        index: 0,
        destination: 'New Destination',
      })
    );
    expect(store.getState().flights.segments[0].destination).toEqual(
      'New Destination'
    );
  });

  it('should handle setFlightStartDate', () => {
    const startDate = new Date(2022, 1, 1);
    store.dispatch(
      flightSlice.actions.setFlightStartDate({ index: 0, startDate })
    );
    expect(store.getState().flights.segments[0].startDate).toEqual(startDate);
  });

  it('should handle setFlightEndDate', () => {
    const endDate = new Date(2022, 1, 10);
    store.dispatch(flightSlice.actions.setFlightEndDate({ index: 0, endDate }));
    expect(store.getState().flights.segments[0].endDate).toEqual(endDate);
  });

  it('should handle incrementFlightAdults', () => {
    store.dispatch(flightSlice.actions.incrementFlightAdults());
    expect(store.getState().flights.passengers.adults).toEqual(2);
  });

  it('should handle decrementFlightAdults', () => {
    store.dispatch(flightSlice.actions.decrementFlightAdults());
    expect(store.getState().flights.passengers.adults).toEqual(0);
  });

  it('should handle incrementFlightChildren', () => {
    store.dispatch(flightSlice.actions.incrementFlightChildren());
    expect(store.getState().flights.passengers.children).toEqual(1);
  });

  it('should handle decrementFlightChildren', () => {
    store.dispatch(flightSlice.actions.decrementFlightChildren());
    expect(store.getState().flights.passengers.children).toEqual(0);
  });

  it('should handle incrementFlightInfants', () => {
    store.dispatch(flightSlice.actions.incrementFlightInfants());
    expect(store.getState().flights.passengers.infants).toEqual(1);
  });

  it('should handle decrementFlightInfants', () => {
    store.dispatch(flightSlice.actions.decrementFlightInfants());
    expect(store.getState().flights.passengers.infants).toEqual(0);
  });

  it('should handle setFlightClass', () => {
    store.dispatch(
      flightSlice.actions.setFlightClass(FlightClassCode.Business)
    );
    expect(store.getState().flights.class).toEqual(FlightClassCode.Business);
  });

  it('should handle setFlightType', () => {
    store.dispatch(flightSlice.actions.setFlightType(FlightType.O));
    expect(store.getState().flights.flightType).toEqual(FlightType.O);
  });
  it('should handle setFlightResults', () => {
    const results = [
      {
        offer_id: 'offer1',
        itinerary_id: 1,
        total_price: {
          currency: 'USD',
          provider_base_price: 100,
          provider_taxes: 20,
          provider_total_price: 120,
          volindo_fee: 10,
          total_price: 130,
        },
        general_details: {
          class_of_service: 'Economy',
          type_of_trip: 'round trip',
          total_travelers: 1,
          pnr_deadline_datetime: '2022-12-31T23:59:59Z',
          ticketing_deadline_datetime_mx: '2022-12-31T23:59:59Z',
          carry_on_available: true,
          checked_baggage_available: true,
          type_of_passengers: {
            adults: 1,
            children: 0,
            infants: 0,
          },
        },
        flights: [],
      },
    ];
    store.dispatch(flightSlice.actions.setFlightResults(results));
    expect(store.getState().flights.results).toEqual(results);
  });

  it('should handle updateFlightFilteredResults', () => {
    expect(store.getState().flights.filteredResults).toEqual([]);
  });

  it('should handle addFlightSegment', () => {
    store.dispatch(flightSlice.actions.addFlightSegment());
    expect(store.getState().flights.segments.length).toEqual(2);
  });

  it('should handle removeFlightSegment', () => {
    store.dispatch(flightSlice.actions.addFlightSegment());
    expect(store.getState().flights.segments.length).toEqual(2);
    store.dispatch(flightSlice.actions.removeFlightSegment());
    expect(store.getState().flights.segments.length).toEqual(1);
  });

  it('should handle resetSegments', () => {
    store.dispatch(flightSlice.actions.resetSegments());
    expect(store.getState().flights.segments.length).toEqual(1);
  });

  it('should handle resetRoundTrip', () => {
    store.dispatch(flightSlice.actions.resetRoundTrip());
    expect(store.getState().flights.segments[0].roundtrip).toEqual(false);
  });

  it('should handle setRoundTrip', () => {
    store.dispatch(flightSlice.actions.setRoundTrip());
    expect(store.getState().flights.segments[0].roundtrip).toEqual(true);
  });

  it('should handle setSelectedFlight', () => {
    const selectedFlight = {
      selected_flight_id: 'flight1',
      itinerary: [],
      travelers: [],
    };
    store.dispatch(flightSlice.actions.setSelectedFlight(selectedFlight));
    expect(store.getState().flights.selectedFlight).toEqual(selectedFlight);
  });
});
