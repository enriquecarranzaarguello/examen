import { useMemo } from 'react';
import type { ModalPolicyProps } from '@typing/proptypes';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import styles from './ModalPolicy.module.scss';
import { Modal } from '@components';
import InfoCard from '@components/general/infoCard/InfoCard';

import TicketIcon from '@icons/ticket.svg';
import TakeOffIcon from '@icons/takeoff.svg';
import FlightPolicyIcon from 'src/assets/icons/flightPolicy.svg';
import { FlightModification } from '@context/slices/flightSlice/flightSlice';

const ModalPolicy = ({ open, onClose, conditions }: ModalPolicyProps) => {
  const { t } = useTranslation();

  const itineraryConditions = useMemo(() => {
    if (!conditions) return null;

    let itineraryRefund: { title: string; policy: string } | null = null;
    let itineraryChangeable: { title: string; policy: string } | null = null;
    let changeableEqualOnAllItinerary = false;

    for (const itineraryModification of conditions.all_itinerary) {
      if (itineraryModification.modification === 'refund_before_departure') {
        // * REFUND CASE
        let title = t('flights.conditions.refund.title');
        let policy = t('flights.conditions.refund.no_allowed');

        if (itineraryModification.allowed) {
          policy = t('flights.conditions.refund.allowed');

          if (itineraryModification.penalty) {
            policy +=
              itineraryModification.penalty.amount === 0
                ? t('flights.conditions.no_penalty')
                : t('flights.conditions.penalty', {
                    type: t('flights.conditions.refund.name'),
                    amount: itineraryModification.penalty.amount,
                    currency: itineraryModification.penalty.currency,
                  });
          } else {
            policy += t('flights.conditions.possible_penalty');
          }
        }

        itineraryRefund = { title, policy };
      } else {
        // * CHANGE CASE
        let title = t('flights.conditions.change.title');
        let policy = '';

        changeableEqualOnAllItinerary = conditions.per_flight.every(flight => {
          return flight.modifications
            .filter(
              flightModification =>
                flightModification.modification === 'change_before_departure'
            )
            .every(
              flightModification =>
                flightModification.allowed === itineraryModification.allowed &&
                flightModification.penalty?.amount ===
                  itineraryModification.penalty?.amount
            );
        });

        if (itineraryModification.allowed) {
          policy = t('flights.conditions.change.allowed');

          if (itineraryModification.penalty) {
            policy +=
              itineraryModification.penalty.amount === 0
                ? t('flights.conditions.no_penalty')
                : t('flights.conditions.penalty', {
                    type: t('flights.conditions.change.name'),
                    amount: itineraryModification.penalty.amount,
                    currency: itineraryModification.penalty.currency,
                  });
          } else {
            policy += t('flights.conditions.possible_penalty');
          }
        } else {
          if (changeableEqualOnAllItinerary)
            policy = t('flights.conditions.change.no_allowed');
        }

        itineraryChangeable = policy !== '' ? { title, policy } : null;
      }
    }
    return {
      itineraryRefund,
      itineraryChangeable,
      changeableEqualOnAllItinerary,
    };
  }, [conditions, t]);

  const renderChangePolicy = (modification: FlightModification) => {
    let title = t('flights.conditions.change.title_f');
    let policy = '';

    if (modification.allowed) {
      policy = t('flights.conditions.change.allowed_f');

      if (modification.penalty) {
        policy +=
          modification.penalty.amount === 0
            ? t('flights.conditions.no_penalty')
            : t('flights.conditions.penalty', {
                type: t('flights.conditions.change.name'),
                amount: modification.penalty.amount,
                currency: modification.penalty.currency,
              });
      } else {
        policy += t('flights.conditions.possible_penalty');
      }
    } else {
      policy = t('flights.conditions.change.no_allowed_f');
    }

    return (
      <InfoCard
        title={title}
        information={policy}
        image={FlightPolicyIcon}
        className={styles.modalPolicy_section_policy}
      />
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modalPolicy}>
        <h1 className={styles.modalPolicy_mainTitle}>
          {t('flights.policies')}
        </h1>
        {!conditions ? (
          <span className={styles.modalPolicy_notAvailable}>
            {t('flights.conditions.not_available')}
          </span>
        ) : (
          <>
            <div className={styles.modalPolicy_section}>
              <div className={styles.modalPolicy_section_title}>
                <Image
                  className={styles.modalPolicy_section_image__allFlights}
                  src={TicketIcon}
                  width={24}
                  height={24}
                  alt="Ticket"
                />
                <span>{t('flights.conditions.all_itinerary')}</span>
              </div>
              <div className={styles.modalPolicy_section_policies}>
                {itineraryConditions?.itineraryChangeable && (
                  <InfoCard
                    title={itineraryConditions.itineraryChangeable.title}
                    information={itineraryConditions.itineraryChangeable.policy}
                    image={FlightPolicyIcon}
                    className={styles.modalPolicy_section_policy}
                  />
                )}
                {itineraryConditions?.itineraryRefund && (
                  <InfoCard
                    title={itineraryConditions.itineraryRefund.title}
                    information={itineraryConditions.itineraryRefund.policy}
                    image={FlightPolicyIcon}
                    className={styles.modalPolicy_section_policy}
                  />
                )}
                {conditions.on_airline.conditions_of_carriage_url && (
                  <InfoCard
                    title={t('flights.conditions.airline')}
                    information={t('flights.conditions.airline_info', {
                      name: conditions.on_airline.name,
                    })}
                    image={FlightPolicyIcon}
                    className={styles.modalPolicy_section_policy}
                    link={{
                      text: t('flights.conditions.see_conditions'),
                      href: conditions.on_airline.conditions_of_carriage_url,
                      target: '_blank',
                    }}
                  />
                )}
              </div>
            </div>

            <div className={styles.modalPolicy_flights}>
              {!itineraryConditions?.changeableEqualOnAllItinerary &&
                conditions.per_flight.map(flight => (
                  <div
                    className={styles.modalPolicy_section}
                    key={flight.arrival_city}
                  >
                    <div className={styles.modalPolicy_section_title}>
                      <Image
                        className={styles.modalPolicy_section_image__segment}
                        src={TakeOffIcon}
                        width={24}
                        height={24}
                        alt="TakeOff"
                      />
                      <span>
                        {t('flights.conditions.for_flight', {
                          arrival: flight.arrival_city,
                        })}
                      </span>
                    </div>
                    <div className={styles.modalPolicy_section_policies}>
                      {flight.modifications.map(modification =>
                        renderChangePolicy(modification)
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModalPolicy;
