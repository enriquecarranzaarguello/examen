import type { ReactNode } from 'react';

import type {
  SearchStaysFiltersType,
  MarkerType,
  SigUpType,
  StaysType,
  CancellationPoliciesType,
  RoomsICType,
  GuestICType,
  ReservationDetailsStayType,
  CountryType,
  TravelerStatus,
  TravelerType,
  ReservationStatus,
  SupplierType,
  HotelInfo,
} from './types';
import { FlightConditions } from '@context/slices/flightSlice/flightSlice';

export interface LayoutProps {
  children: ReactNode;
  paddingBottom?: boolean;
  paddingBottomSignup?: boolean;
  noLogin?: boolean;
}
export interface BookingLayoutProps {
  agentId?: string;
  isPublic?: boolean;
  children: ReactNode;
}

export interface SEOProps {
  title: string;
  description?: string;
}

/** MODALS **/

export interface ModalProps extends LayoutProps {
  open: boolean;
  onClose: (event?: React.SyntheticEvent) => void;
  stylesModal?: string;
}

export interface ModalGeneralProps {
  open: boolean;
  onClose: () => void;
}

export interface ModalWithDrawFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (v: string) => void;
}
export interface ResevationDetailsProps {
  open: boolean;
  onClose: () => void;
  res_id: string;
  reservationDets: any;
}

export interface DetailCAncelProps {
  open: boolean;
  onClose: () => void;
  res_id: string;
  reservationDets: any;
  isRefundable: boolean;
}

export interface ModalSignInProps {
  openSignIn: boolean;
  onOpenSignUp: () => void;
  onCloseSignIn: () => void;
}

export interface ModalSignUpProps {
  openSignUp: boolean;
  onOpenSignIn: () => void;
  onCloseSignUp: () => void;
}

export interface SignInFormProps {
  onOpenSignUp: () => void;
  onCloseSignIn: () => void;
}

export interface SignUpFormProps {
  onOpenSignIn: () => void;
  onCloseSignUp: () => void;
}

export interface ModalHotelImageProps extends ModalGeneralProps {
  stay: StaysType;
}
export interface ModalPolicyProps {
  open: boolean;
  onClose: () => void;
  conditions: FlightConditions | null;
}
export interface ModalPaymentProps {
  open: boolean;
  onClose: () => void;
}
export interface ModalNotStaysProps {
  open: boolean;
  onClose: () => void;
}
export interface ModalDeleteSupplierProps {
  open: boolean;
  onClose: () => void;
  deleteSupplier: () => void;
}

export interface ModalDeleteBooking {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  deleteBooking: () => void;
}

export interface ModalCancellationPolicyProps {
  open: boolean;
  onClose: () => void;
  policies: CancellationPoliciesType[];
  supplements: any;
  isRefundable: boolean;
  origin?: string;
}

export interface ModalPolicyArrayProps {
  open: boolean;
  onClose: () => void;
  policies: any[];
}

export interface ModalRateConditionsProps {
  open: boolean;
  onClose: () => void;
  rateConditions: any[];
}

export interface ModalReservations {
  open: boolean;
  onClose: () => void;
  reservation: any;
}

export interface ModalCustomProps {
  open: boolean;
  onClose: () => void;
  text: string;
}

export interface ModalGenericProps {
  open: boolean;
  onClose: () => void;
  onCloseAll: () => void;
  text: string;
  error: string;
}

export interface ModalSupplierServiceProps {
  open: boolean;
  onClose: () => void;
  text: string;
}

export interface ModalTravelerProps extends ModalGeneralProps {
  edit?: boolean;
  id_token: string;
  countries: CountryType[];
  traveler_status: TravelerStatus;
  traveler?: TravelerType;
  setTraveler?: React.Dispatch<TravelerType>;
  travelers?: TravelerType[];
  setTravelers?: React.Dispatch<TravelerType[]>;
}

/** END MODALS **/

export interface ErrorMessageProps {
  title: string;
}

export interface ErrorsProp extends ModalGeneralProps {
  title: string;
}
export interface SuppliersServerProps {
  countries: CountryType[];
  suppliers: SupplierType[];
  id_token: string;
}

export interface ForgotPasswordFormProps {
  onClose: () => void;
  edit?: boolean;
  id_token: string;
  countries: CountryType[];
  traveler_status: TravelerStatus;
  traveler?: TravelerType;
  setTraveler?: React.Dispatch<TravelerType>;
  travelers?: TravelerType[];
  setTravelers?: React.Dispatch<TravelerType[]>;
}

/** INPUT CONTROL */
export interface InputControlProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldError: any;
}

export interface InputControlSignUpProps extends InputControlProps {
  value: SigUpType;
  onChange: (value: SigUpType) => void;
}

export interface InputControlSearchStaysProps extends InputControlProps {
  value: SearchStaysFiltersType;
  onChange: (value: SearchStaysFiltersType) => void;
}
/** END INPUT CONTROL */

export interface StaysProps {
  dataResult: StaysType[];
  isOpen: boolean;
}

export interface ServiceProviderProps {
  children: ReactNode;
}

export interface MapWrapperProps {
  dataResult: any[];
  activeMarker: string | null;
  setActiveMarker: React.Dispatch<string | null>;
  displayPrice?: number;
  origin?: string;
}

export interface MapWrapperPropsHotelFlow {
  dataResult: any;
  activeMarker: string | null;
  setActiveMarker: React.Dispatch<string | null>;
}

export interface MapProps {
  markers: MarkerType[];
  activeMarker: string | null;
  setActiveMarker: React.Dispatch<string | null>;
}
export interface SupplierMapProps {
  onSelectLocation: (location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  }) => void;
  onClose: () => void;
}

export interface MapWrapperStaysProps {
  dataResult: HotelInfo[];
  activeMarker: string | null;
  setActiveMarker: React.Dispatch<string | null>;
  handleCloseMap?: () => void;
  origin?: string;
  handleOpenCompare?: () => void;
}

export interface MapStaysProps {
  windowSize?: number;
  markers: MarkerType[];
  activeMarker: string | null;
  setActiveMarker?: React.Dispatch<string | null>;
  handleMarkerAmount?: (value: boolean) => void;
  showAll?: boolean;
  handleBook?: (Id: string) => void;
  currencySymbol?: string;
}

export interface RoomsICProps {
  data: ReservationDetailsStayType;
  value: RoomsICType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldError: any;
  onChange: (value: RoomsICType[]) => void;
}

export interface RoomICProps {
  data: any;
  rowIndex: number;
  rowValue: RoomsICType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowError: any;
  onChange: (rowIndex: number, value: RoomsICType) => void;
}

export interface GuestsICProps {
  value: GuestICType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldError: any;
  onChange: (value: GuestICType[]) => void;
}

export interface GuestICProps {
  rowIndex: number;
  rowValue: GuestICType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowError: any;
  onChange: (rowIndex: number, value: GuestICType) => void;
}

export interface TravelersProps {
  id_token: string;
  countries: CountryType[];
  traveler_status: TravelerStatus;
  traveler_id: string;
}

export interface ReservationProps {
  id_token: string;
  countries: CountryType[];
  reservation_status: ReservationStatus;
  reservations: any[];
}
export interface SuppliersProps {
  id_token: string;
}

export interface StaysFilterProps {
  isOpen: boolean;
}

export interface ConektaProps {
  checkoutRequestId: string;
  service: string;
  redirectUrl: string;
}

export interface PaymentServices {
  stripeShow: boolean;
  conektaShow: boolean;
  mercadoShow: boolean;
}

export interface GuestSummaryProps {
  rooms: number;
  adults: number;
  childs: number;
}

export interface MercadoPagoCashFormProps {
  email: string;
}

export interface MercadoPagoBankTransferFormProps {
  firstName: string;
  lastName: string;
  email: string;
}

export interface GeneralTextModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  text: string;
  loading?: boolean;
  cb: () => void;
}

export interface PaymentAgentProposalFlightsProps {
  flightTotalCost: number;
  subTotal: number;
  transactionFee: number;
  totalPrice: number;
  agentcommissionType: string;
  setAgentCommissionType: (type: string) => void;
}

export interface ImageSliderProps {
  open: boolean;
  onClose: () => void;
  title: string;
  stars: number;
  ImageArray: string[];
  selectedIndex: number;
}
type Price = {
  min: number;
  max: number;
  selectedMin: number;
  selectedMax: number;
};

type Filter = {
  name: string;
  price: Price;
  rating: number[];
  mealType: string[];
  orderBy: 'min' | 'max';
  cancelPolicy: string[];
};

export interface FilterTypeProps {
  hotelFilters: Filter;
  totalPeticions: number;
  onChange: (value: string | number) => void;
}
