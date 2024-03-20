import { limits } from 'src/common/data/payments/mercadoPago';
import { MercadoPagoPaymentType, MercadoPagoCashOption } from '@typing/types';

// Define a type that uses the enum as keys
type PaymentTypeLimits = {
  minByPaymentType: { [key in MercadoPagoPaymentType]: number };
  maxByPaymentType: { [key in MercadoPagoPaymentType]: number };
};

type CashOptionLimits = {
  minByCashOption: { [key in MercadoPagoCashOption]: number };
  maxByCashOption: { [key in MercadoPagoCashOption]: number };
};

// Make sure 'limits' conforms to this new type
const paymentTypeLimits: PaymentTypeLimits = limits;

const cashOptionLimits: CashOptionLimits = limits;

export const checkLimitsByPaymentType = (
  amount: string,
  paymentType: MercadoPagoPaymentType
): boolean => {
  const amountInt = parseInt(amount);
  return (
    amountInt >= paymentTypeLimits.minByPaymentType[paymentType] &&
    amountInt <= paymentTypeLimits.maxByPaymentType[paymentType]
  );
};

export const checkLimitsByCashOption = (
  amount: string,
  cashOption: MercadoPagoCashOption
): boolean => {
  const amountInt = parseInt(amount);
  return (
    amountInt >= cashOptionLimits.minByCashOption[cashOption] &&
    amountInt <= cashOptionLimits.maxByCashOption[cashOption]
  );
};
