import { Schema } from 'rsuite';

import type {
  BootReservationDetailsStayType,
  ReservationDetailsStayDataType,
} from '@typing/types';

export const DEFAULT_RESERVATION_DETAILS_STAY_VALUES: ReservationDetailsStayDataType =
  {
    commission: 1,
    rooms: [{ guests: [] }],
  };

export const ReservationDetailsStaySchema = (
  boot: BootReservationDetailsStayType
) => {
  return Schema.Model({
    commission: Schema.Types.NumberType().isRequired(boot.required),
    rooms: Schema.Types.ArrayType().of(
      Schema.Types.ObjectType().shape({
        guests: Schema.Types.ArrayType().of(
          Schema.Types.ObjectType().shape({
            first_name: Schema.Types.StringType()
              .isRequired(boot.required)
              .containsLetterOnly(boot.only_letter)
              .minLength(3, boot.min_length),
            last_name: Schema.Types.StringType()
              .pattern(/^(?=.*[a-z A-Z])/, boot.only_letter)
              .isRequired(boot.required)
              .minLength(3, boot.min_length),
            email: Schema.Types.StringType()
              .isRequired(boot.required)
              .isEmail(boot.email),
            phone_number: Schema.Types.StringType()
              .pattern(/^\d+$/, boot.only_num)
              .isRequired(boot.required),
            title: Schema.Types.StringType().isRequired(boot.required),
          })
        ),
      })
    ),
  });
};
