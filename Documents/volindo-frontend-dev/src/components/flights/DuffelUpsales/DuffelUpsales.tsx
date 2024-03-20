import { useState, useEffect, useMemo } from 'react';
import { CreateOrderPassenger, DuffelAncillaries } from '@duffel/components';
import config from '@config';
import styles from './duffelUpsales.module.scss';
import { DuffelUpsalesProps } from '@typing/types';

const testPassengers: CreateOrderPassenger[] = [
  {
    id: 'pas_0000AUde3KY1SptM6ABSfU',
    given_name: 'Mae',
    family_name: 'Jemison',
    gender: 'f',
    title: 'mr',
    born_on: '1956-10-17',
    email: 'm.jemison@nasa.gov',
    phone_number: '+16177562626',
  },
  {
    id: 'pas_0000AUde3KY1SptM6ABSfT',
    given_name: 'Dorothy',
    family_name: 'Green',
    gender: 'f',
    title: 'mr',
    born_on: '1942-10-17',
    email: 'm.jemison@nasa.gov',
    phone_number: '+16177562626',
  },
];

const DuffelUpsales = (props: DuffelUpsalesProps) => {
  const [color, setColor] = useState('126,111,241');
  const passengers = useMemo(() => {
    const buildPassengersDuffelInfo = (
      passengersInfo: any[],
      idsOfPassengers: any
    ) => {
      let passengers: any[] = [];
      let idsOfPassengersCopy = JSON.parse(JSON.stringify(idsOfPassengers));
      let infantsIdsCopy = idsOfPassengers?.infants
        ? JSON.parse(JSON.stringify(idsOfPassengers.infants))
        : [];

      for (let passenger of passengersInfo) {
        let passengerId: string;
        switch (passenger.traveler_type) {
          case 'CHD':
            passengerId = idsOfPassengersCopy?.children.shift();
            break;
          case 'INF':
            passengerId = idsOfPassengersCopy?.infants.shift();
            break;
          default:
            passengerId = idsOfPassengersCopy?.adults.shift();
        }

        let duffelPassenger: any = {
          id: passengerId,
          email: passenger?.email,
          phone_number: `${passenger?.phone_code}${passenger?.phone}`,
          given_name: passenger?.first_name,
          family_name: passenger?.last_name,
          born_on: passenger?.dob,
          gender: passenger?.gender.toLowerCase(),
          title: passenger?.gender === 'M' ? 'mr' : 'ms',
        };

        if (infantsIdsCopy.length !== 0 && passenger.traveler_type === 'ADT') {
          duffelPassenger = {
            ...duffelPassenger,
            infantPassengerId: infantsIdsCopy.shift(),
          };
        }
        passengers.push(duffelPassenger);
      }

      return passengers;
    };

    if (!props.debug && 'idsOfPassengers' in props) {
      const duffelPassengers = buildPassengersDuffelInfo(
        props.passengers,
        props.idsOfPassengers
      );
      return duffelPassengers;
    } else {
      return testPassengers;
    }
  }, [props]);

  useEffect(() => {
    const colorToRgb = (color: string) => {
      var elem = document.createElement('div');
      elem.style.color = color;
      document.body.appendChild(elem);
      const rgb = getComputedStyle(elem).color;
      document.body.removeChild(elem);
      const rgbValues = rgb.match(/\d+/g);
      if (!rgbValues) {
        return '';
      }
      const [r, g, b] = rgbValues;
      return `${r},${g},${b}`;
    };

    if (config.BASICCOLOR) {
      const color = colorToRgb(config.BASICCOLOR);
      setColor(color);
    }
  }, []);

  const handleOnPaylodReady = (data: any, metadata: any) => {
    if (!props.debug)
      props.onSelection(
        data.services.length !== 0
          ? {
              data,
              metadata,
              passengers,
            }
          : null
      );
  };

  return (
    <div className={styles.ancilliaries_card}>
      <DuffelAncillaries
        styles={{
          buttonCornerRadius: '5px',
          accentColor: color,
          fontFamily: 'inherit',
        }}
        offer={!props.debug ? props.offer : null}
        client_key={props.debug ? '' : props.clientKey}
        passengers={passengers}
        services={['bags', 'seats']}
        onPayloadReady={handleOnPaylodReady}
      />
    </div>
  );
};

export default DuffelUpsales;
