import { Schema } from 'rsuite';
import type {
  BootReservationDetailsStayType,
  SupplierDataType,
} from '@typing/types';

export const initialSupplierFormValues: SupplierDataType = {
  accommodation_address: '',
  accommodation_city: '',
  accommodation_country_id: '',
  accommodation_lat: '',
  accommodation_long: '',
  cancel_policies: '',
  cancel_policies_2: '',
  selectedSupplier: '',
  full_name: '',
  phone_number: '',
  email: '',
  address: '',
  city: '',
  country_id: '',
  language: [],
  website: '',
  instagram: '',
  facebook: '',
  other_social: '',
  company_name: '',
  supplier_identity: [],
  adventure_insurance_doc: [],
  hotel_images: [],
  stars: '',
  room_images: [],
  type_of_room: '',
  number_of_people_permitted: '',
  room_size: '',
  amenities: [],
  transportation_driver_license: [],
  transportation_vehicle_photos: [],
  transportation_vehicle_license: [],
  additional_info: '',
  add_image_text: [],
  extra_service_description: '',
  extra_note_to_customer: '',
  additionalLinks: [],
  supplier_additional_info: '',
  name_on_account: null,
  bank_name: null,
  bank_address: null,
  bankaccount_SWIFT: null,
  bankaccount_number: null,
  payment_method: '',
  paypal_email: '',
  representative_name: '',
  representative_photos: [],
  representative_phone_number: '',
  representative_email: '',
};

export const SupplierSchema = (boot: BootReservationDetailsStayType) => {
  return Schema.Model({
    full_name: Schema.Types.StringType()
      .pattern(/^(?=.*[a-z A-Z])/, boot.only_letter)
      .isRequired(boot.required)
      .minLength(3, boot.min_length),
    phone_number: Schema.Types.StringType()
      .pattern(/^\d+$/, boot.only_num)
      .isRequired(boot.required),
    email: Schema.Types.StringType()
      .isRequired(boot.required)
      .isEmail(boot.email),
    city: Schema.Types.StringType().isRequired(boot.required),
    country_id: Schema.Types.StringType().isRequired(boot.required),
    address: Schema.Types.StringType().isRequired(boot.required),
    language: Schema.Types.StringType().isRequired(boot.required),
    company_name: Schema.Types.StringType().isRequired(boot.required),
  });
};

export const SupplierBookingSchema = (boot: BootReservationDetailsStayType) => {
  return Schema.Model({
    traveler_name: Schema.Types.StringType()
      .pattern(/^(?=.*[a-z A-Z])/, boot.only_letter)
      .isRequired(boot.required)
      .minLength(3, boot.min_length),
    traveler_number: Schema.Types.StringType()
      .pattern(/^\d+$/, boot.only_num)
      .isRequired(boot.required),
    traveler_email: Schema.Types.StringType()
      .isRequired(boot.required)
      .isEmail(boot.email),
    traveler_title: Schema.Types.StringType().isRequired(boot.required),
    traveler_age: Schema.Types.StringType().isRequired(boot.required),
    cost_service_price: Schema.Types.StringType().isRequired(boot.required),
    agent_servicefee: Schema.Types.StringType().isRequired(boot.required),
    agent_discount: Schema.Types.StringType().isRequired(boot.required),
  });
};

export const AccommodationSchema = (boot: any) => {
  return Schema.Model({
    traveler_name: Schema.Types.StringType()
      .pattern(/^(?=.*[a-z A-Z])/, boot.only_letter)
      .isRequired(boot.required)
      .minLength(3, boot.min_length),
    traveler_number: Schema.Types.StringType()
      .pattern(/^\d+$/, boot.only_num)
      .isRequired(boot.required),
    traveler_email: Schema.Types.StringType()
      .isRequired(boot.required)
      .isEmail(boot.email),
    traveler_title: Schema.Types.StringType().isRequired(boot.required),
    traveler_age: Schema.Types.StringType().isRequired(boot.required),
  });
};
