import {
  ExtraBaggage,
  ExtraSeats,
  ExtraCancelFullRefund,
  ExtraServices,
  Flight,
} from '@context/slices/flightSlice/flightSlice';

export class ExtraServicesBuilder {
  private static getPassengersAndFlightsIndexes(
    flights: Flight[],
    duffelPassengers: any[]
  ): [{ [key: string]: number }, { [key: string]: number }] {
    let flightsIndexes: { [key: string]: number } = {};
    let passengersIndexes: { [key: string]: number } = {};

    let index = 0;
    flights.forEach(flight => {
      if (flight.stops.length == 0) {
        flightsIndexes[flight.departure_details.booking_code] = index;
        index++;
      } else {
        flight.stops.forEach(stop => {
          if (flightsIndexes[stop.booking_code] === undefined) {
            flightsIndexes[stop.booking_code] = index;
            index++;
          }
        });
      }
    });

    duffelPassengers.forEach((passenger, index) => {
      passengersIndexes[passenger.id] = index;
    });

    return [flightsIndexes, passengersIndexes];
  }

  private static buildExtraBaggage(
    flightsIndexes: { [key: string]: number },
    passengersIndexes: { [key: string]: number },
    baggageServices: any[]
  ): ExtraBaggage[] {
    return baggageServices.map(service => {
      const info = service.serviceInformation;
      const weight = info.maximum_weight_kg
        ? `${info.maximum_weight_kg}kg`
        : '';
      const dimensions =
        info.maximum_height_cm &&
        info.maximum_length_cm &&
        info.maximum_depth_cm
          ? `${info.maximum_height_cm}x${info.maximum_length_cm}x${info.maximum_depth_cm} cm`
          : '';
      const baggage: ExtraBaggage = {
        type: info.type,
        flight_id: flightsIndexes[info.segmentId || info.segmentIds[0]],
        passenger_id:
          passengersIndexes[info.passengerId || info.passengerIds[0]],
        total_amount: Number(info.total_amount),
        currency: info.total_currency,
        id_provider: service.id,
        quantity: service.quantity,
        weight,
        size: dimensions,
      };
      return baggage;
    });
  }

  private static buildExtraSeats(
    flightsIndexes: { [key: string]: number },
    passengersIndexes: { [key: string]: number },
    seatsServices: any[]
  ): ExtraSeats[] {
    return seatsServices.map(service => {
      const info = service.serviceInformation;
      const seat: ExtraSeats = {
        type: info.type,
        flight_id: flightsIndexes[info.segmentId || info.segmentIds[0]],
        passenger_id:
          passengersIndexes[info.passengerId || info.passengerIds[0]],
        total_amount: Number(info.total_amount),
        currency: info.total_currency,
        id_provider: service.id,
        designator: info.designator,
        disclosures: info.disclosures,
      };

      return seat;
    });
  }

  private static buildExtraCancelFullRefund(
    cancelFullRefundServices: any[]
  ): ExtraCancelFullRefund {
    const info = cancelFullRefundServices[0].serviceInformation;
    const extraCancel: ExtraCancelFullRefund = {
      id_provider: cancelFullRefundServices[0].id,
      refund_amount: Number(info.refund_amount),
      terms_and_conditions: info.terms_and_conditions_url,
      total_amount: Number(info.total_amount),
      currency: info.total_amount,
    };
    return extraCancel;
  }

  public static buildExtraServices(
    flights: Flight[],
    duffelPassengers: any[],
    duffelUpsalesMetadata: any
  ): ExtraServices {
    const [flightsIndexes, passengersIndexes] =
      ExtraServicesBuilder.getPassengersAndFlightsIndexes(
        flights,
        duffelPassengers
      );

    const baggages =
      duffelUpsalesMetadata.baggage_services.length !== 0
        ? ExtraServicesBuilder.buildExtraBaggage(
            flightsIndexes,
            passengersIndexes,
            duffelUpsalesMetadata.baggage_services
          )
        : null;

    const seats =
      duffelUpsalesMetadata.seat_services.length !== 0
        ? ExtraServicesBuilder.buildExtraSeats(
            flightsIndexes,
            passengersIndexes,
            duffelUpsalesMetadata.seat_services
          )
        : null;

    const cancel_full_refund =
      duffelUpsalesMetadata.cancel_for_any_reason_services.length !== 0
        ? ExtraServicesBuilder.buildExtraCancelFullRefund(
            duffelUpsalesMetadata.cancel_for_any_reason_services
          )
        : null;

    return {
      baggages,
      seats,
      cancel_full_refund,
    };
  }
}
