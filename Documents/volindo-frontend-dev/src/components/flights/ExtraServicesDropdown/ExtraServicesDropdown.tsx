import { useEffect, useState } from 'react';
import styles from './extraServicesDropdown.module.scss';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import BaggageIcon from '@icons/suitcase-outline.svg';
import SeatIcon from '@icons/seatFlight.svg';
import FlightIcon from '@icons/takeoff.svg';
import FlightInsuranceIcon from '@icons/flightInsurance.svg';

import {
  Flight,
  PolicyType,
  ExtraServices,
} from '@context/slices/flightSlice/flightSlice';
import { usePrice } from '@components/utils/Price/Price';
import { ServicesPerSegmentType } from '@typing/types';

const ExtraServicesDropdown = ({
  flights,
  flightPolicies,
  extraServices,
  isWhite = false,
}: {
  flights: Flight[];
  flightPolicies: PolicyType[];
  extraServices?: ExtraServices | null;
  isWhite?: boolean;
}) => {
  const { t } = useTranslation();
  const [servicesPerSegment, setServicesPerSegment] = useState<
    ServicesPerSegmentType[]
  >([]);
  const price = usePrice();

  const passengerTypes: { [key: string]: string } = {
    ADT: 'flights.adult',
    CHD: 'stays.child',
    INF: 'flights.infant',
  };

  useEffect(() => {
    const passengersCount = (function () {
      let adult = 0;
      let child = 0;
      let infant = 0;
      return {
        init() {
          adult = 0;
          child = 0;
          infant = 0;
        },
        getCount(type: string) {
          switch (type) {
            case 'CHD':
              return child++;
            case 'INF':
              return infant++;
            default:
              return adult++;
          }
        },
      };
    })();

    const buildServicesPerSegmentFromFlightPolicies = () => {
      let servicesPerSegment: { [key: string]: ServicesPerSegmentType } = {};
      passengersCount.init();
      flightPolicies.forEach(policy => {
        const indexType = passengersCount.getCount(policy.passenger_type);
        policy.flight_policies_per_segment.forEach(segment => {
          const segmentKey = `${segment.origin_airport}-${segment.destination_airport}-${segment.segment_id}`;
          if (!servicesPerSegment[segmentKey]) {
            servicesPerSegment[segmentKey] = {
              origin: segment.origin_airport,
              destination: segment.destination_airport,
              segment_id: segment.segment_id,
              per_passenger: [],
            };
          }

          const passengerServices = {
            type: policy.passenger_type,
            indexType: indexType,
            baggages: segment.baggage_policies
              .map(bag => {
                return {
                  quantity: bag.count,
                  type: bag.provision_type === 'A' ? 'checked' : 'carry_on',
                  price: 0,
                };
              })
              .filter(baggage => baggage.quantity > 0),
            seats: [],
          };

          servicesPerSegment[segmentKey].per_passenger.push(passengerServices);
        });
      });
      return Object.values(servicesPerSegment);
    };

    const addExtraServices = (servicesPerSegment: ServicesPerSegmentType[]) => {
      if (extraServices?.baggages)
        extraServices.baggages.forEach(baggage => {
          servicesPerSegment[baggage.flight_id].per_passenger[
            baggage.passenger_id
          ].baggages.push({
            quantity: baggage.quantity,
            type: baggage.type === 'checked' ? 'checked' : 'carry_on',
            price: baggage.total_amount,
          });
        });

      if (extraServices?.seats)
        extraServices.seats.forEach(seat => {
          servicesPerSegment[seat.flight_id].per_passenger[
            seat.passenger_id
          ].seats.push({
            designator: seat.designator,
            price: seat.total_amount,
          });
        });

      return servicesPerSegment;
    };

    const filterByFlights = (servicesPerSegment: ServicesPerSegmentType[]) => {
      let servicesFiltered: ServicesPerSegmentType[] = [];

      const groupedPerFlight: {
        destination: string;
        segments: ServicesPerSegmentType[];
      }[] = flights.map(flight => {
        return {
          destination: flight.arrival_details.airport,
          segments: [],
        };
      });

      let indexPerFlight = 0;
      servicesPerSegment.forEach(segment => {
        groupedPerFlight[indexPerFlight].segments.push(segment);
        if (
          segment.destination === groupedPerFlight[indexPerFlight].destination
        )
          indexPerFlight++;
      });

      groupedPerFlight.forEach(group => {
        const segmentToCompare = JSON.stringify(
          group.segments[0].per_passenger
        );
        if (
          group.segments.every(
            segment =>
              JSON.stringify(segment.per_passenger) === segmentToCompare
          )
        )
          servicesFiltered.push(
            group.segments.at(-1) as ServicesPerSegmentType
          );
        else servicesFiltered = servicesFiltered.concat(group.segments);
      });

      return servicesFiltered;
    };

    if (flights && flightPolicies) {
      let servicesPerSegment = buildServicesPerSegmentFromFlightPolicies();

      if (extraServices)
        servicesPerSegment = addExtraServices(servicesPerSegment);

      servicesPerSegment = filterByFlights(servicesPerSegment);
      setServicesPerSegment(servicesPerSegment);
    }
  }, [flightPolicies, extraServices, flights]);

  return (
    <div className={`${styles.container} ${isWhite ? styles.white_mode : ''}`}>
      {servicesPerSegment.map((segment, index) => (
        <details
          className={styles.dropdown_main_content}
          key={segment.segment_id}
          open={index === 0}
        >
          <summary
            className={`${styles.dropdown_title} ${styles.dropdown_title__flight}`}
          >
            <Image
              className={styles.icon}
              src={FlightIcon}
              width={24}
              height={24}
              alt="Flight"
            />
            <span>
              {t('flights.flight-to')} {segment.destination}
            </span>
          </summary>
          <div className={styles.dropdown_flight_content}>
            {segment.per_passenger.map(passenger => (
              <>
                <details className={styles.dropdown_inner_dropdown} open>
                  <summary
                    className={`${styles.dropdown_title} ${styles.dropdown_title__bags}`}
                  >
                    <Image
                      className={styles.icon}
                      src={BaggageIcon}
                      width={24}
                      height={24}
                      alt="Baggage"
                    />
                    <span>
                      {t('common.bags')} (
                      {t(passengerTypes[`${passenger.type}`])}{' '}
                      {passenger.indexType + 1})
                    </span>
                  </summary>
                  <div className={styles.dropdown_item}>
                    <div className={styles.dropdown_item_label}>
                      <input type="radio" readOnly checked />
                      <span>1 {t('flights.luggage.personal')}</span>
                    </div>
                    <span>{price.countrySymbol}0</span>
                  </div>
                  {passenger.baggages.map((baggage, index) => (
                    <div className={styles.dropdown_item} key={index}>
                      <div className={styles.dropdown_item_label}>
                        <input type="radio" readOnly checked />
                        <span>
                          {baggage.quantity}{' '}
                          {baggage.type === 'checked'
                            ? t('flights.luggage.documented')
                            : t('flights.luggage.carry-on')}
                        </span>
                      </div>
                      <span>
                        {price.countrySymbol}
                        {price.integerWithOneDecimal(baggage.price)}
                      </span>
                    </div>
                  ))}
                </details>

                {passenger.seats.length > 0 ? (
                  <details className={styles.dropdown_inner_dropdown} open>
                    <summary
                      className={`${styles.dropdown_title} ${styles.dropdown_title__seats}`}
                    >
                      <Image
                        className={styles.icon}
                        src={SeatIcon}
                        width={28}
                        height={28}
                        alt="Seat"
                      />
                      <span>
                        {t('flights.seat')} (
                        {t(passengerTypes[`${passenger.type}`])}{' '}
                        {passenger.indexType + 1})
                      </span>
                    </summary>
                    {passenger.seats.map((seat, index) => (
                      <div className={styles.dropdown_item} key={index}>
                        <div className={styles.dropdown_item_label}>
                          <input type="radio" readOnly checked />
                          <span>
                            {t('flights.upgrade-seat')} {seat.designator}
                          </span>
                        </div>
                        <span>
                          {price.countrySymbol}
                          {price.integerWithOneDecimal(seat.price)}
                        </span>
                      </div>
                    ))}
                  </details>
                ) : null}
              </>
            ))}
          </div>
        </details>
      ))}

      {extraServices?.cancel_full_refund ? (
        <>
          <div className={styles.dropdown_title__insurance_container}>
            <div
              className={`${styles.dropdown_title} ${styles.dropdown_title__insurance}`}
            >
              <Image
                className={styles.icon}
                src={FlightInsuranceIcon}
                width={26}
                height={26}
                alt="FlightInsurance"
              />
              <span>{t('flights.flexible-flight-upgrade')}</span>
            </div>
            <span>
              {price.countrySymbol}
              {price.integerWithOneDecimal(
                extraServices.cancel_full_refund.total_amount
              )}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ExtraServicesDropdown;
