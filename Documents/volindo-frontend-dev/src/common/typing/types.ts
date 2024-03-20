import { Flight, Itinerary } from '@context/slices/flightSlice/flightSlice';
import { StripeElementsOptionsMode } from '@stripe/stripe-js';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { FileType } from 'rsuite/esm/Uploader';

export type ObjStrCommonType = {
  [key: string]: boolean | number | string;
};

export type ObjStrCustomType<T> = {
  [key: string]: T;
};
/******************
 ****** Boot ******
 ******************/
declare global {
  interface Window {
    dataLayer: any; // 👈️ turn off type checking
  }
}

export type BootType = {
  required: string;
};

export type BootSignInType = BootType & {
  email: string;
};

export type BootSignUpType = BootSignInType &
  BootType & {
    password: string;
  };

export type BootForgotPasswordType = BootType & {
  password_1: string;
  password_2: string;
};

export type BootReservationDetailsStayType = BootType & {
  email: string;
  only_letter: string;
  min_length: string;
  only_num: string;
};
export type BootReservationHotelType = BootType & {
  email: string;
  only_letters: string;
  min_length: string;
  only_num: string;
};
export const boot = {
  required: 'Required',
  only_num: 'Numbers only',
  only_letter: 'Letters only',
  min_length: 'Minimum 3 characters',
  email: 'Invalid email',
};
export interface Errors {
  [key: string]: string;
}
export interface ValidationError {
  errors: Record<string, string>;
}
/******************
 **** End Boot ****
 ******************/

/******************
 ****** Record ******
 ******************/
export type RecordSignInType = 'email' | 'password';

export type RecordSignUpType = 'fields';

export type RecordForgotPasswordType = 'email';

export type RecordConfirmForgotPasswordType = 'password_1' | 'password_2';

export type RecordSearchStaysForm =
  | 'destination'
  | 'check_in'
  | 'check_out'
  | 'rooms'
  | 'nationality';

export type RecordTravelerFormType =
  | 'id'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'birth_date'
  | 'phone_number'
  | 'title'
  | 'address'
  | 'city'
  | 'state_province'
  | 'zip_code'
  | 'passport'
  | 'country_id'
  | 'traveler_status_id';
/******************
 **** End Record ****
 ******************/

/*****************
 *  PAGES TYPES
 ****************/

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

/*****************
 * END PAGES TYPES
 ****************/

export type SignInType = {
  email: string;
  password: string;
};

export type FieldSignUpType = {
  fields: SigUpType;
};

export type SigUpType = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

export type ForgotPasswordType = {
  email: string;
};

export type ConfirmForgotPasswordType = {
  password_1: string;
  password_2: string;
};

export type CognitoErrorType = {
  __type: string;
  message: string;
};

export type SessionUserType = {
  id_token: string;
  refresh_token: string;
};

export type ResultCheckoutType = {
  url: string;
};

export type RangeDateType = {
  startDate: null | moment.Moment;
  endDate: null | moment.Moment;
};

export type PositionType = {
  lat: number;
  lng: number;
};

export type SearchStaysFiltersRoomType = {
  number_of_adults: number;
  children_age: number[];
};

export type SearchStaysFiltersType = {
  hotel_id: string;
  city: string;
  check_in: string;
  check_out: string;
  destination: string;
  rooms: SearchStaysFiltersRoomType[];
  nationality: string;
  NoOfRooms: number;
};

export type AmenitiesStaysType = {
  amenity: string;
};

export type PicturesStaysType = {
  url: string;
};

export type CancellationPoliciesType = {
  CancellationCharge: any;
  ChargeType: any;
  FromDate: any;
};

export type RoomType = {
  BookingCode: string;
  CancelPolicies: any;
  MealType: any;
  Name: any;
  TotalFare: number;
  suplements: any;
  mael_type: any;
  cancel_policy: any;
  id: string;
  min_price: number;
  name: string;
  booking_code: string;
  cancellation_policies: CancellationPoliciesType[];
  price: number;
  is_refundable: string | boolean;
  amenities: string[];
  extras: string;
  with_transfers: string;
  // room_promotions: string[];
  hotel: any;
};

export type StaysType = {
  amenities: any;
  check_in_time: any;
  check_out_time: any;
  HotelFacilities: any;
  Rating: any;
  Map: any;
  LowestTotalFare: number;
  HotelRating: number;
  Address: string;
  HotelName: string;
  Id: string;
  hotel: any;
  Images: any;
  cheaper_room: any;
  id: string;
  address: string;
  external_id: string;
  hotel_name: string;
  stars: number;
  latitude: string;
  longitude: string;
  hotel_amenities: any;
  hotel_pictures: any;
  description: string;
  price: number;
  number_of_nights: number;
  rooms: any;
  is_available: any;
};

export type StaysAvailableType = {
  HotelName: any;
  HotelRating: number;
  LowestTotalFare: any;
  Id: any;
  cheaper_room: any;
  id: string;
  price: number;
  stars: number;
  hotel_name: string;
  is_available: boolean;
  Rooms?: any[];
  HotelFacilities: any[];
};
export type StaysUnavailableType = {
  HotelName: any;
  LowestTotalFare: any;
  HotelRating: number;
  Id: any;
  cheaper_room: any;
  id: string;
  price: number;
  stars: number;
  hotel_name: string;
  is_available: boolean;
};

export type SearchStaysType = {
  results_id: string;
  status: any;
  filters: SearchStaysFiltersType;
  hotels: StaysType[];
};

export type PriceCompareType = {
  statuscode: number;
  requestId: string;
  result: any;
};

export type SearchStaysAvailableType = {
  results_id: string;
  status: string;
  filters: SearchStaysFiltersType;
  available_hotels: StaysAvailableType[];
};
export type SearchStaysUnavailableType = {
  results_id: string;
  status: string;
  filters: SearchStaysFiltersType;
  unavailable_hotels: StaysUnavailableType[];
};

export type CountryType = {
  id: string;
  iso_code: string;
  country_name: string;
};

export type CataloguesType = {
  id: string;
  slug: string;
  description: string;
  metadata: null;
  word: string;
};

export type AgentEditProfileType = {
  full_name: string;
  address: string | null;
  city: string | null;
  state_province: string | null;
  country: string | null;
  zip_code: string | null;
  phone_country_code: string | null;
  phone_number: string | null;
  birthday: string | null;
  web_site: string | null;
  url_facebook: string | null;
  url_instagram: string | null;
  url_whatsapp: string | null;
  languages: string[];
  area_specialize: string[];
  type_specialize: string[];
  description: string;
};

export type ReservationHotelType = {
  agent_id: string;
  payments: {
    agent_commission: number;
    provider_price: string;
    subtotal: number;
    total: number;
    transaction_details: {
      payment_id: string;
      payment_type: string;
      processor_name: string;
      stripe_id: string;
    };
  };
  service: {
    address: string;
    booking_code: string;
    cancel_policies: {
      Index: string;
      FromDate: string;
      ChargeType: string;
      CancellationCharge: number;
    }[];
    check_in: string;
    check_out: string;
    hotel_name: string;
    id_meilisearch: string;
    inclusion: string;
    is_refundable: boolean;
    latitude: number;
    longitude: number;
    meal_type: string;
    name_room: string[];
    response_book_tbo: {
      Status: {
        Code: number;
        Description: string;
      };
    };
    search_parameters: {
      destination: string;
      check_out: string;
      rooms: {
        number_of_adults: number;
        children_age: number[];
      }[];
      nationality: string;
      city: string;
      check_in: string;
    };
    service_type: string;
    with_transfers: boolean;
    withdraw: boolean;
  };
  booking_id: number;
  approved_at: number;
  main_contact: {
    last_name: string;
    title: string;
    first_name: string;
    phone: string;
    email: string;
    is_contact: boolean;
  }[];
  status: string;
  agent: {
    country: {
      iso_code: string;
      country_name: string;
      id: string;
    };
    phone_number: string;
    full_name: string;
    email: string;
  };
  payment: string;
};

export type ProfileType = {
  full_name: string;
  photo: string | null;
  address: string | null;
  city: string | null;
  state_province: string | null;
  country: string | null;
  zip_code: string | null;
  phone_country_code: string | null;
  phone_number: string | null;
  birthday: string | null;
  web_site: string | null;
  url_facebook: string | null;
  url_instagram: string | null;
  url_whatsapp: string | null;
  languages: string[];
  area_specialize: string[];
  type_specialize: string[];
  description: string;
};

export type ProfileTypeBackend = {
  full_name_account: string;
  address_full: string;
  address_city: string;
  address_state_province: string;
  address_country: string;
  address_zip_code: string;
  phone_country_code: string;
  phone_number: string;
  birthday: string;
  web_site: string;
  url_facebook: string;
  url_instagram: string;
  url_whatsapp: string;
  languages: string[];
  area_specialize: string[];
  type_specialize: string[];
  description: string;
  photo?: string;
};

export type AgentType = {
  agent_id: string;
  email: string;
  profile: ProfileType;
  agent_is_subscribed: boolean;
};

export type AgentWithDrawType = {
  email: string;
  account_full_name: string;
  bank_name: string;
  bank_account_address: string;
  swift_number: string;
  account_number: string;
  amount_to_withdrwal: number | null;
  payment_method: string;
};

export type PostItemGrid = {
  created_at: string;
  image: string;
  uuid: string;
};

export type IndividualPost = {
  description: string;
  images: string[];
  city: string;
  country: string;
  created_at: string;
};

/** Slices **/

export interface Currency {
  selectedCurrency: string;
  currencyNumber: number;
  currencySymbol: string;
}

export type GeneralSliceType = {
  loading: boolean;
  currency: Currency;
};

export type FiltersSliceType = {
  staysSearch: SearchStaysFiltersType;
  staysResult: ResultStaysFiltersType;
};

export type StaysSliceType = {
  data: SearchStaysType;
};

export type SuppliersSliceType = {
  data: SupplierProfileType;
};
export type AgentSliceType = AgentType;

/** End Slices **/

export type ResultStaysFiltersType = {
  name: string;
  stars: number[];
  prices: number[];
  priceMin: number;
  priceMax: number;
  priceValue: [number, number];
  available: string | number;
};

export type MarkerType = {
  id: string;
  picture: string | null;
  name: string;
  address: string;
  stars: number;
  price?: number;
  position: PositionType;
};

export type FiltersStaysRoomType = {
  number_of_adults: number;
};

export type SearchStaysFormType = {
  stays: SearchStaysFiltersType;
};

export type SupplementType = {
  description: string;
  price: string;
  type: string;
};

export type RoomDetailsType = {
  name: string;
  price: number;
  supplements: SupplementType[];
};

export type ReservationDetailsStayRoomType = {
  dayrates: any;
  meal_type: any;
  inclusion: any;
  isRefundable: any;
  with_transfer: any;
  booking_code: string;
  cancellation_policies: any;
  price: number;
  rooms_details: any;
  tax: any;
  recomended_price: number;
  // room_promotions: any;
};

export type ReservationDetails = {
  service: any;
  payments: any;
  main_contact: any;
  total: any;
  check_in: any;
  check_out: any;
  package: any;
  travelers: any;
  cancelled_at: string;
  reservation_status: {
    description: string;
  };
  payment: {
    subtotal: string;
  };
  search_parameters: {
    check_in: string;
    check_out: string;
    currency: string;
    destination: string;
    nationality: string;
  };
  hotel: {
    address: string | null;
    description: string | null;
    external_id: string | null;
    hotel_amenities: AmenitiesStaysType[];
    hotel_pictures: PicturesStaysType[];
    latitude: string | null;
    longitude: string | null;
    hotel_name: string | null;
    stars: number;
  };
  rooms: {
    Name: any;
    name: string;
    // room_promotions: [];
    guests: {
      traveler: {
        address: string | null;
        birth_date: string | null;
        city: string | null;
        country: {
          id: string;
          iso_code: string;
          country_name: string;
          metadata: any;
        };
        email: string;
        first_name: string;
        id: string;
        in_vacation: boolean;
        is_active: boolean;
        last_name: string;
        phone_number: string;
        state_province: string | null;
        title: string;
      };
      traveler_status: {
        id: string;
        slug: string;
        description: string;
        metadata: any;
      };
      zip_code: string | null;
    }[];
  }[];
};

export type ReservationDetailsStayType = {
  filters: SearchStaysFiltersType;
  hotel: any;
  number_of_nights: number;
  policies: string[];
  rooms: ReservationDetailsStayRoomType;
};

export type GuestICType = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  title: string;
  //country: CountryType;
  child: boolean;
  save: boolean;
};

export type ReservationDetailsStayDataType = {
  commission: number;
  rooms: RoomsICType[];
};

export type RoomsICType = {
  guests: GuestICType[];
};

export type GuestSendType = {
  traveler_id: string;
  is_lead: boolean;
};

export type RoomsSendType = {
  guests: GuestSendType[];
};

export type PaymentStayReservationRoomSupplementTravelerType = {
  [x: string]: any;
  TravelerTypes: any;
  Type: string;
  Index: number;
  Price: number;
  Currency: string;
  Description: string;
};

export type AgentWalletBalance = {
  sales: {
    total: number;
    on_hold: number;
  };
  commissions: {
    total: number;
    on_hold: number;
  };
  earnings: {
    available: number;
    withdrawn: number;
  };
};

export type NewReservationType = {
  agent: AgentType;
  agent_id: string;
  approved_at: number;
  booking_id: number;
  main_contact: {
    email: string;
    first_name: string;
    last_name: string;
    is_contact: boolean;
    phone: string;
    title: string;
  };
  payment: string;
  payments: {
    provider_price: number;
    subtotal: number;
    agent_commission: number;
    total: number;
    transaction_details: {
      transaction_id: string;
      payment_id: string;
      payment_type: string;
      processor_name: string;
    };
  };
  service: {
    date_checkin: string;
    address: string;
    booking_code: string;
    cancel_policies: {
      CancellationCharge: number;
      ChargeType: string;
      FromDate: string;
    };
    check_in: string;
    check_out: string;
    confirmation_number: string;
    hotel_name: string;
    id_meilisearch: string;
    inclusion: string;
    is_refundable: boolean;
    meal_type: string;
    name_room: string[];
    payments: {
      agent_commission: number;
      payment_id: string;
      payment_type: string;
      provider_price: string;
      stripe_id: string;
      subtotal: number;
      total: number;
    };
    response_book_tbo: {
      ClientReferenceId: string;
      ConfirmationNumber: string;
      Status: {
        Code: number;
        Description: string;
      };
    };
    search_parameters: {
      check_in: string;
      check_out: string;
      city: string;
      destination: string;
      nationality: string;
      rooms: {
        children_age: number[][];
        number_of_adults: number;
      }[];
    };
    service_type: string;
    with_transfers: boolean;
  };
  status: string;
  status_trip_reservation: string;
};

export type UploadedFilesType = {
  [key: string]: FileType[];
};

export type SupplierPaymetDetailsTwoTypes = {
  bookingData: {
    agent_id: string;
    booking_id: number;
  };
  supplierProfile: any | null;
};

export type SupplierPaymentDetailsType = {
  bookingData: {
    total_price: string;
    accommodation_date_checkout: string;
    agent_discount: string;
    agent_id: string;
    agent_servicefee: string;
    agentcommission: string;
    booking_id: number | null;
    cost_service_price: string;
    date_checkin: string;
    number_of_people_permitted: string;
    service_time: string;
    status: string;
    supplier_type: string;
    transport_trip_type: string;
    traveler_age: string;
    traveler_email: string;
    traveler_name: string;
    traveler_number: string;
    traveler_title: string;
  } | null;
  supplierProfile: any | null;
};

export type SupplierHeaderType = {
  number: number;
  text: string;
  isActive: boolean;
  isLast: boolean;
};

export type SupplierType = {
  add_image_text: string;
  full_name: string;
  company_name: string;
  country_id: string;
  selectedSupplier: string;
  status: string;
  phone_number: string;
  email: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  supplier_id: string;
};

export type SupplierProfileType = {
  amenities: string;
  supplier_lat: number | null;
  supplier_long: number | null;
  supplier_address: string;
  supplier_city: string;
  supplier_country_id: string;
  cancel_policies: string;
  cancel_policies_2: string;
  full_name: string;
  address: string;
  company_name: string;
  country_id: string;
  selectedSupplier: string;
  status: string;
  phone_number: string;
  email: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  supplier_id: string;
  hotel_images: [];
  room_images: [];
  add_image_text: [];
  additional_info: string;
  extra_note_to_customer: string;
  extra_service_description: string;
  language: string;
  other_social: string;
  room_size: string;
  stars: string;
  supplier_additional_info: string;
  type_of_room: string;
  website: string;
  transportation_vehicle_photos: [];
};

export type TravelerType = {
  traveler_source: string;
  source: string;
  passport: string;
  description: string;
  variable: string;
  created_at: string;
  tag_group: string;
  typecasts: string[];
  special_requests: string[];
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: null | string;
  phone_number: string;
  title: string;
  traveler_status: {
    id: string;
    slug: string;
    description: string;
    metadata: null;
  };
  in_vacation: boolean;
  is_active: boolean;
  address: null | string;
  country: {
    id: string;
    iso_code: string;
    country_name: string;
    metadata: null;
  };
  city: null | string;
  state_province: null | string;
  zip_code: null | string;
};

export type DataTravlerType = {
  passportNo: string;
  country: string;
  zipCode: string;
  gender: string;
  city: string;
  fullName: string;
  description: string;
  adress: string; // Typo error
  referralName: string;
  travelerTypecast: string;
  phoneNumber: string;
  referral: string;
  dayOfBirth: string;
  specialRequest: string;
  addToGroup: string;
  email: string;
};

export type TravelerDataType = {
  agent_id: string;
  data_traveler: DataTravlerType;
  photo: string;
  traveler_id: string;
};

export type ModalFilterType = {
  open: boolean;
  onClose: () => void;
  travelers: TravelerDataType[];
  handleChangeFilterName: (name: string) => void;
  handleChangeFilterCountries: (countries: string) => void;
  handleChangeFilterTypecast: (selecType: string) => void;
  handleChangeFilterReferral: (referral: string) => void;
};

export type UploaderModelProps = {
  isOpen: boolean;
  close: () => void;
  currentUploaderKey: string;
  handleFileUpload: (key: string, files: FileType[]) => void;
  fileList: FileType[];
  fileType?: 'Images' | 'All';
  singleFile?: boolean;
  callbackAndClose?: () => void;
  limit?: number;
};

export type UploadPostModalProps = {
  isOpen: boolean;
  close: () => void;
  currentUploaderKey: string;
  handleFileUpload: (key: string, files: FileType[]) => void;
  fileList: FileType[];
  callbackAndClose: () => void;
  description: string;
  onChangeDescription: (v: string) => void;
  country: string;
  onChangeCountry: (v: string) => void;
  city: string;
  onChangeCity: (v: string) => void;
};

export type SupplierDataType = {
  [key: string]: any;
  cancel_policies: string;
  cancel_policies_2: string;
  selectedSupplier: string;
  full_name: string | null;
  phone_number: string;
  email: string | null;
  address?: string | null;
  city?: string | null;
  country_id: string | null;
  language: string[] | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  other_social: string | null;
  company_name: string | null;
  supplier_identity: File[];
  adventure_insurance_doc?: File[];
  hotel_images: File[];
  stars: string | null;
  room_images: File[];
  type_of_room: string | null;
  number_of_people_permitted: string | null;
  room_size: string | null;
  amenities: string[];
  transportation_driver_license: File[];
  transportation_vehicle_photos: File[];
  transportation_vehicle_license: File[];
  additional_info: string | null;
  add_image_text: File[];
  extra_service_description: string | null;
  extra_note_to_customer: string | null;
  additionalLinks: string[];
  supplier_additional_info: string | null;
  name_on_account: string | null;
  bank_name: string | null;
  bank_address: string | null;
  bankaccount_SWIFT: number | null;
  bankaccount_number: number | null;
  payment_method: string;
  paypal_email: string | null;
  accommodation_address: string | null;
  accommodation_city: string | null;
  accommodation_country_id: string | null;
  accommodation_lat: string | null;
  accommodation_long: string | null;
  representative_name: string;
  representative_photos: File[];
  representative_phone_number: string;
  representative_email: string;
};

export type SupplierImagesType = {
  typeImages: string;
  imagesFiles: FileType[];
  metadata: SupplierImageMetadataType[];
};

export type SupplierImageMetadataType = {
  extension: string;
  filename: string;
  contentType: string;
};

export type PaymentStayReservationTravelerTravelerType = {
  is_lead: boolean;
  traveler: TravelerType;
};

export type PaymentStayReservationRoomTraveler = {
  id: string;
  name: string;
  supplements: PaymentStayReservationRoomSupplementTravelerType[];
  price: string;
  reservation: string;
  guests: PaymentStayReservationTravelerTravelerType[];
  cancel_policies?: CancellationPoliciesType[];
  // room_promotions?: [];
};

export type PaymentStayReservationTraveler = {
  id: string;
  hotel: StaysType;
  policies: null;
  policies_acceptance: boolean;
  booking_code: string;
  cancelled_at: null | string;
  created_at: string;
  updated_at: string;
  search_parameters: SearchStaysFiltersType;
  reservation: any;
  reservation_status: {
    id: string;
    slug: string;
    description: string;
    metadata: null;
  };
  rooms: PaymentStayReservationRoomTraveler[];
};

export type PaymentStayTraveler = {
  status: any;
  agent: AgentType;
  id: string;
  subtotal: any;
  display_price: number;
  display_total_price: number;
  approved_at: null | string;
  reservation: any;
  rooms: any;
  package: any;
  total: any;
  contact: any;
  agent_commission: any;
  provider_price: any;
  total_price: any;
  agentId: any;
  cancel_policies: any;
  supplements: any;
  is_refundable: any;
};

export type TravelerStatus = {
  slug: string;
  description: string;
  items: CataloguesType[];
};

export type ReservationStatus = {
  id: number;
  description: string;
  slug: string;
  word: string;
  //items: CataloguesType[];
};

export type TravelersFilters = {
  name: string;
  countries: string[];
  status: string;
  services: string;
};
export type ResevationsFiltersCRM = {
  name: string;
  countries: string[];
  tripStatus: string;
  range: string;
  services: string;
};

export type ResevationsFilters = {
  name: string[];
  countries: string[];
  description: string[];
  range: string;
  services: string[];
};

export type SupplierFilters = {
  name: string;
  companyName: string;
  countries: string[];
  services: string;
  status: string;
};

export type Amenity = {
  name: string;
  icon: string;
};

export type ProposalModalProps = {
  openProposal: boolean;
  setOpenProposal: (value: boolean) => void;
  openProposalNext: boolean;
  setOpenProposalNext: (value: boolean) => void;
  openAlreadyProposal: boolean;
  paymentId: string;
  proposalType: string;
  handleLinkProposal: () => void;
  internalLink: string;
};

export type GeneralInfoCardProps = {
  origin: string;

  travelerInfo: {
    origin: string;
    address: string;
    base_price_per_traveler: number;
    city: string;
    country: string;
    currency: string;
    dob: string;
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    phone: string;
    zip_code: number;
    is_contact: boolean;
    id_traveler: number;
    passport: string;
    taxes_per_traveler: number;
    total_price_per_traveler: number;
    traveler_type: string;
    travel_date: string;
  };

  setTravelerInfo: (travelerInfo: {
    origin: string;
    address: string;
    base_price_per_traveler: number;
    city: string;
    country: string;
    currency: string;
    dob: string;
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    id_traveler: number;
    is_contact: boolean;
    passport: string;
    phone: string;
    taxes_per_traveler: number;
    total_price_per_traveler: number;
    traveler_type: string;
    zip_code: number;
    travel_date: string;
  }) => void;
};

export type ChosenFlightsDetails = {
  // todo
  flights: {
    flight_id: number;
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
  }[];
  id: number;
  selected_flight_id: number;
  total_price: {
    total_price: number;
    total_taxes: number;
    total_price_no_taxes: number;
    currency: string;
    per_passenger: {
      id: number;
      passenger_type: string;
      price: number;
      taxes: number;
      base_price: number;
      currency: string;
      total_price: number;
    }[];
  };
  travelers: [
    {
      number_of_adults: number;
      number_of_children: number;
      age_of_children: object;
    },
  ];
};

export type RervationCRMprops = {
  Address: string;
  Attractions: {};
  CheckInTime: string;
  CheckOutTime: string;
  CityId: string;
  CityName: string;
  CountryCode: string;
  CountryName: string;
  Description: string;
  FaxNumber: string;
  HotelFacilities: [string];
  HotelName: string;
  HotelRating: number;
  Id: string;
  Images: [string];
  Map: string;
  PhoneNumber: string;
  PinCode: string;
  _Document__doc: {
    Map: string;
  };
};

export type SearchFlightType = {
  travelers: {
    adults: number;
    children: number;
    infants: number;
  };
  flight_info: {
    start_date: string;
    start_location: string;
    end_date?: string;
    end_location: string;
  }[];
  class_type: string;
  type_of_flight: 'one way' | 'round trip' | 'multi trips';
};

export type FlightSliceType = {
  searchFlight: SearchFlightType;
  flightResults: any[];
  isLoading: boolean;
};

export type StripePaymentProps = {
  className?: string;
  type: 'setup' | 'payment';
  redirectUrl: string;
  cancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmationOutside?: boolean;
  paymentConfirmed?: boolean;
  cancelButtonOnClick?: () => void;
  onChangeLoading?: (actuaLoading: boolean) => void;
  showCashOption?: boolean;
  payWithCash?: boolean;
  checkHandler?: () => void;
} & (StripePaymentClientSecret | StripePaymentWithOptions);

export type StripePaymentClientSecret = {
  withoutClientSecret?: false;
  clientSecret: string;
};

export type StripePaymentWithOptions = {
  withoutClientSecret: true;
  options: Omit<StripeElementsOptionsMode, 'appearance' | 'locale'>;
};

// MARKETING GENERAL TYPES

export type NewMarketingAdForm = {
  title: string;
  socialNetwork: string;
  type: 'profile' | 'deals';
  uploadFiles: File[];
  filesThumbnails: string[];
  adText: string;
  startDate: string;
  endDate: string;
  days: number;
  startTime: string;
  endTime: string;
  budget: number;
  coupon_budget: number;
  coupon_name: string;
  percentage: number;
};

export type FileMetadata = {
  extension: string;
  contentType: string;
};

interface TravelerData {
  passportNo: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  description: string;
  dayOfBirth: string;
  travelerTypecast: string;
  referral: string;
  referralName: string;
  addToGroup: string;
  specialRequest: string;
  gender: string;
  fullName: string;
  email: string;
  profile_image: string;
}

export type TravelerSaved = {
  agent_id: string;
  data_traveler: TravelerData;
  traveler_id: string;
};

export type AgentAirtableType = {
  email: string;
  phone: string;
  web_site: string;
};

export type DealTemplateFields = {
  'Booking.com Price': number;
  'Discount Percentage': number;
  'Free Text/Description': string;
  'Hotel location': string;
  'Hotel name': string;
  'Offer headline': string;
  'Offer’s dates': string;
  'Offer’s price': number;
};

export type DealTemplate = {
  createdTime: string;
  fields: DealTemplateFields;
  id: string;
};

export type PackageType =
  | 'Pro'
  | 'Plus'
  | 'Premium'
  | 'Starter'
  | 'Platinum'
  | 'Diamante'
  | 'None';

export enum MixPackages {
  Esencial = 'Esencial',
  Elite = 'Elite',
  Prestigio = 'Prestigio',
}

export type MixPackagesType = `${MixPackages}`;

// HOTEL TYPE FOR REDUX
export type Price = {
  min: number;
  max: number;
  selectedMin: number;
  selectedMax: number;
};

export type Filter = {
  name: string;
  price: Price;
  rating: number[];
  mealType: string[];
  orderBy: 'min' | 'max';
  cancelPolicy: string[];
};

export type Room = {
  number_of_adults: number;
  number_of_children: number;
  children_age: number[];
};

export type SerachParams = {
  hotel_id: string;
  city: string;
  destination: string;
  check_in: string;
  check_out: string;
  rooms: Room[];
  nationality: string;
};
export type RoomDetails = {
  Name: string;
  MealType: string;
  Inclusion: string;
  WithTransfers: boolean;
  IsRefundable: boolean;
  CancelPolicies: string[];
  TotalFare: number;
};

export type SearchHotelType = {
  results: HotelInfo[];
  loadingTotal: number;
  loadingProgress: number;
  resultId: string;
  searchParams: SerachParams;
  hotelDetail: any;
  filter: Filter;
  filteredResults: HotelInfo[];
  hotelFound: String;
  socketError: boolean;
  notHotelAvailable: boolean;
  selectedRoom: RoomDetails;
  showProgresBar: boolean;
};

export type HotelInfo = {
  CityName: string;
  Images: string[];
  CountryName: string;
  HotelName: string;
  HotelFacilities: any;
  Rooms: any;
  Id: string;
  Description: string;
  Address: string;
  PinCode: string;
  CityId: string;
  PhoneNumber: string;
  FaxNumber: string;
  Map: string;
  HotelRating: number;
  CountryCode: string;
  CheckInTime: string;
  CheckOutTime: string;
  Currency?: string;
  LowestTotalFare?: number;
  LowestTotalTax?: number;
  provider_price?: number;
};

type RoomPrebook = {
  Name: string[];
  BookingCode: string;
  Inclusion: string;
  DayRates: { BasePrice: number }[][];
  TotalFare: number;
  TotalTax: number;
  RecommendedSellingRate: string;
  RoomPromotion: string[];
  CancelPolicies: {
    FromDate: string;
    ChargeType: string;
    CancellationCharge: number;
  }[];
  MealType: string;
  IsRefundable: boolean;
  Supplements: {
    Index: number;
    Type: string;
    Description: string;
    Price: number;
    Currency: string;
  }[][];
  WithTransfers: boolean;
  Amenities: string[];
  provider_price: number;
  totalBasePrice: number;
};

type RateConditions = string[];

export type PreebookInfo = {
  HotelCode: string;
  Currency: string;
  Rooms: RoomPrebook[];
  RateConditions: RateConditions;
};

type DuffelUpsalesPropsWithOfferId = {
  clientKey: string;
  passengers: any[];
  idsOfPassengers: any;
  debug?: false;
  offer: any;
  onSelection: (selection: any) => void;
};

type DuffelUpsalesPropsDebug = {
  debug: true;
};

export type DuffelUpsalesProps =
  | DuffelUpsalesPropsWithOfferId
  | DuffelUpsalesPropsDebug;

export type ServicesPerSegmentType = {
  origin: string;
  destination: string;
  segment_id: number;
  per_passenger: {
    type: string;
    indexType: number;
    baggages: {
      quantity: number;
      type: string;
      price: number;
    }[];
    seats: {
      designator: string;
      price: number;
    }[];
  }[];
};

export enum MercadoPagoPaymentType {
  bankTransfer = 'bankTransfer',
  cash = 'cash',
  card = 'card',
}

export enum MercadoPagoCashOption {
  bancomer = 'bancomer',
  serfin = 'serfin',
  banamex = 'banamex',
  oxxo = 'oxxo',
}

type MercadoPagoExtraData = {
  product_name: string;
  agent_full_name: string;
  transaction_number: number;
  amount_charge: number;
  date_of_expiration: string;
  acquirer_reference?: string;
  payment_method_reference_id?: string;
  branch_office?: string;
  account_number?: string;
  financial_institution?: string;
  barcode_url?: string;
};

export interface MercadoPagoBankTransferExtraData extends MercadoPagoExtraData {
  acquirer_reference: string;
  payment_method_reference_id: string;
}

export interface MercadoPagoCashBancomerExtraData extends MercadoPagoExtraData {
  financial_institution: string;
  payment_method_reference_id: string;
}

export interface MercadoPagoCashBanamexExtraData extends MercadoPagoExtraData {
  branch_office: string;
  account_number: string;
  payment_method_reference_id: string;
}

export interface MercadoPagoCashSerfinExtraData extends MercadoPagoExtraData {
  financial_institution: string;
  payment_method_reference_id: string;
}

export interface MercadoPagoCashOxxoExtraData extends MercadoPagoExtraData {
  barcode_url: string;
}

export type HotelRoom = {
  name: string;
  price: number;
};

export type HotelData = {
  hotel_name: string;
  HotelName: string;
  Id: string;
  Description: string;
  HotelFacilities: string[];
  Images: string[];
  Address: string;
  Map: string;
  CountryCode: string;
  HotelRating: number;
  CheckInTime: string;
  CheckOutTime: string;
  index: number;
  block: number;
  Currency: string;
  Rooms: [
    {
      Name: string[];
      BookingCode: string;
      Inclusion: string;
      DayRates: [
        [
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
        ],
      ];
      TotalFare: number;
      TotalTax: number;
      RoomPromotion: string[];
      CancelPolicies: [
        {
          FromDate: string;
          ChargeType: string;
          CancellationCharge: number;
        },
        {
          FromDate: string;
          ChargeType: string;
          CancellationCharge: number;
        },
      ];
      MealType: string;
      IsRefundable: true;
      WithTransfers: false;
    },
  ];
  LowestTotalFare: number;
  LowestTotalTax: number;
  provider_price: number;
  brandingfee: [
    {
      Name: string[];
      BookingCode: string;
      Inclusion: string;
      DayRates: [
        [
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
          {
            BasePrice: number;
          },
        ],
      ];
      TotalFare: number;
      TotalTax: number;
      RoomPromotion: string[];
      CancelPolicies: [
        {
          FromDate: string;
          ChargeType: string;
          CancellationCharge: number;
        },
        {
          FromDate: string;
          ChargeType: string;
          CancellationCharge: number;
        },
      ];
      MealType: string;
      IsRefundable: true;
      WithTransfers: false;
    },
  ];
};

export type HotelResultCardType = {
  CityName: string;
  CountryName: string;
  Address: string;
  Id: string;
  Rating: number;
  HotelFacilities: string[];
  check_in_time: string;
  check_out_time: string;
};

export type CancellationType = {
  CancellationCharge: number;
  ChargeType: string;
  FromDate: string;
  Index: string;
};

export type DayRates = {
  BasePrice: number;
};

export type RoomHotelInfo = {
  BookingCode: string;
  CancelPolicies: CancellationType[];
  DayRates: DayRates;
  Inclusion: string;
  IsRefundable: Boolean;
  MealType: string;
  Name: string[];
  RoomPromotion: string[];
  TotalFare: number;
  TotalTax: number;
  WithTransfers: boolean;
};

export type RoomFilterType = {
  children_age: number[];
  number_of_adults: number;
  number_of_children: number;
};

export type GeneralButtonType = {
  text?: string;
  cb: Function;
  originText: string;
  index?: number;
  image?: any;
  id?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  dataTestId?: string;
  parentType?: string;
};

export type HotelSearchType = {
  hotelData?: any;
  searchType?: string;
  hotelId?: string;
  source?: string;
  buttonClass?: string;
};

export type StopsDetailsType = {
  stops: any[];
  originalArrivalcity: string;
  originalDepartCity: string;
  totalTimeFormated: Flight['total_time']['total_time_formatted'];
  itinerary: Itinerary | null;
};

export type DisplayAirportType = {
  type: 'normal' | 'area' | 'sub';
  id?: number;
  code: string;
  city: string;
  country: string;
  name?: string;
};

export type MetadataFlightRequest = {
  request_id: string;
  next_page: string | null;
};

export type AdultGuest = {
  name: '';
  lastname: '';
  phoneNumber: '';
  email: '';
  gender: 'MR' | 'MS';
  age: '';
};
export type ChildrenGuest = {
  name: '';
  age: '';
};

export type GuestArray = {
  adults: AdultGuest[];
  children: ChildrenGuest[];
};
