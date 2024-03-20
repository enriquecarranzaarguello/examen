import { Schema } from 'rsuite';

import type { BootSignInType, TravelerDataType } from '@typing/types';

export const DEFAULT_TRAVELER_VALUES: any = {
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  birth_date: null,
  phone_number: '',
  title: 'MR',
  address: '',
  city: '',
  state_province: '',
  zip_code: '',
  passport: '',
  country_id: '',
  traveler_status_id: '',
  special_requests: [],
  typecasts: [],
  tag_group: '',
  description: '',
  source: '',
};

export const TravelerSchema = (boot: BootSignInType) => {
  return Schema.Model({
    first_name: Schema.Types.StringType().isRequired(boot.required),
    last_name: Schema.Types.StringType().isRequired(boot.required),
    phone_number: Schema.Types.StringType().isRequired(boot.required),
    email: Schema.Types.StringType().isRequired(boot.required),
    birth_date: Schema.Types.DateType().isRequired(boot.required),
    country_id: Schema.Types.StringType().isRequired(boot.required),
    traveler_status_id: Schema.Types.StringType().isRequired(boot.required),
  });
};

export const TravelerFlightSchema = (
  errorMessages: {
    required: string;
    phone: string;
    email: string;
    adult: string;
    child: string;
    infant: string;
    minLength: string;
  },
  typeTraveler: 'child' | 'adult' | 'infant'
) =>
  Schema.Model({
    first_name: Schema.Types.StringType()
      .minLength(3, errorMessages.minLength)
      .isRequired(errorMessages.required),
    last_name: Schema.Types.StringType()
      .minLength(3, errorMessages.minLength)
      .isRequired(errorMessages.required),
    email: Schema.Types.StringType()
      .isEmail(errorMessages.email)
      .isRequired(errorMessages.required),
    phone: Schema.Types.StringType()
      .pattern(/^[0-9]{7,10}$/, errorMessages.phone)
      .isRequired(errorMessages.required),
    birth_date: Schema.Types.DateType().addRule(
      value => {
        if (typeof value !== 'string') {
          const today = new Date();
          const age = Math.floor(
            (today.getTime() - value.getTime()) / 1000 / 60 / 60 / 24 / 365.25
          );
          if (typeTraveler === 'child') {
            return age < 18 && age > 2;
          } else if (typeTraveler === 'infant') {
            return age <= 2;
          } else {
            //adult
            return age >= 18;
          }
        }
        return true;
      },
      typeTraveler === 'child'
        ? errorMessages.child
        : typeTraveler === 'infant'
          ? errorMessages.infant
          : errorMessages.adult
    ),
    gender: Schema.Types.StringType().isRequired(errorMessages.required),
  });
