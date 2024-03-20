import React, { useState } from 'react';
import MercadoPagoPaymentSelect from './MercadoPagoPaymentSelect';
import MercadoPagoCardForm from './MercadoPagoCardForm';
import MercadoPagoCashForm from './MercadoPagoCashForm';
import MercadoPagoBankTransferForm from './MercadoPagoBankTransferForm';
import { PackageType } from '@typing/types';
import { checkLimitsByPaymentType } from 'src/utils/mercadoPagoUtils';
import { MercadoPagoPaymentType } from '@typing/types';
import { useVariableValue } from '@devcycle/react-client-sdk';

const MercadoPagoPayment = ({
  amount,
  redirectUrl,
  service,
  payload,
  packageName,
  createPayment,
  createPaymentArgs,
  onError,
  onClose,
  isSubscription = false,
}: {
  amount: string;
  redirectUrl: string;
  service: string;
  payload: {};
  packageName: PackageType;
  createPayment: (...args: any[]) => Promise<any>;
  createPaymentArgs: any[];
  onError: (error: any) => void;
  isSubscription: boolean;
  onClose: () => void;
}) => {
  const mercadoPagoCashPaymentValue = useVariableValue(
    'mercado-pago-cash-payment',
    false
  );
  const mercadoPagoBankTransferPaymentValue = useVariableValue(
    'mercado-pago-bank-transfer-payment',
    false
  );
  const [paymentType, setPaymentType] = useState('');
  const [cashOption, setCashOption] = useState('');

  const setSelectedPayment = (selectedPayment: string) => {
    setPaymentType(selectedPayment);
  };

  const setSelectedCashOption = (selectedCashOption: string) => {
    setCashOption(selectedCashOption);
  };

  return (
    <>
      <MercadoPagoPaymentSelect
        amount={amount}
        setSelectedPayment={setSelectedPayment}
        setSelectedCashOption={setSelectedCashOption}
      />
      {paymentType === 'card' &&
        checkLimitsByPaymentType(amount, MercadoPagoPaymentType.card) && (
          <MercadoPagoCardForm
            redirectUrl={redirectUrl}
            amount={amount}
            payload={payload}
            createPayment={createPayment}
            createPaymentArgs={createPaymentArgs}
            onError={onError}
            isSubscription={isSubscription}
          />
        )}
      {mercadoPagoCashPaymentValue &&
        paymentType === 'cash' &&
        checkLimitsByPaymentType(amount, MercadoPagoPaymentType.cash) && (
          <MercadoPagoCashForm
            cashOption={cashOption}
            payload={payload}
            createPayment={createPayment}
            createPaymentArgs={createPaymentArgs}
            onError={onError}
            onClose={onClose}
          />
        )}
      {mercadoPagoBankTransferPaymentValue &&
        paymentType === 'bank-transfer' &&
        checkLimitsByPaymentType(
          amount,
          MercadoPagoPaymentType.bankTransfer
        ) && (
          <MercadoPagoBankTransferForm
            payload={payload}
            createPayment={createPayment}
            createPaymentArgs={createPaymentArgs}
            onError={onError}
            onClose={onClose}
          />
        )}
    </>
  );
};

export default MercadoPagoPayment;
