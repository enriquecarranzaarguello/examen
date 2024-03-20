import { object, string, number } from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const HotelAdultSchema = (errorMessages: {
  required: string;
  phone: string;
  email: string;
  positive: string;
  integer: string;
  minNumberLength: string;
  maxNumberLength: string;
  minLength: string;
  maxLength: string;
  minAge: string;
}) =>
  object({
    name: string()
      .required(errorMessages.required)
      .min(3, errorMessages.minLength)
      .max(40, errorMessages.maxLength),
    lastname: string()
      .required(errorMessages.required)
      .min(3, errorMessages.minLength)
      .max(40, errorMessages.maxLength),
    phoneNumber: string()
      .matches(phoneRegExp, errorMessages.phone)
      .min(10, errorMessages.minNumberLength)
      .max(10, errorMessages.maxNumberLength)
      .required(errorMessages.required),
    email: string().email(errorMessages.email),
    age: number()
      .positive(errorMessages.positive)
      .integer(errorMessages.integer)
      .required(errorMessages.required)
      .min(18, errorMessages.minAge),
    gender: string().required(),
  });

export const HotelChildSchema = (errorMessages: {
  required: string;
  minLength: string;
  maxLength: string;
  positive: string;
  integer: string;
  maxAge: string;
}) =>
  object({
    name: string()
      .required(errorMessages.required)
      .min(3, errorMessages.minLength)
      .max(40, errorMessages.maxLength),
    age: number()
      .positive(errorMessages.positive)
      .integer(errorMessages.integer)
      .required(errorMessages.required)
      .max(18, errorMessages.maxAge),
  });
