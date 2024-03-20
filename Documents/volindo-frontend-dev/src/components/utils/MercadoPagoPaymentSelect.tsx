// TODO: Refactor declaration of payment type buttons.
// The payment type buttons (card, cash, bank-tranfer) repeat exactly the same code except for a couple of values.
// This can be improved by identifying the repeated code, declaring it once and iterating over it to print the 3 buttons.

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from '@styles/modals/payment-modal.module.scss';
import MercadoPagoCashSelect from './MercadoPagoCashSelect';
import { checkLimitsByPaymentType } from 'src/utils/mercadoPagoUtils';
import { MercadoPagoPaymentType } from '@typing/types';
import { useVariableValue } from '@devcycle/react-client-sdk';
import { getChangeCurrency } from '@utils/axiosClients';
import config from '@config';

const MercadoPagoPaymentSelect = ({
  amount,
  setSelectedPayment,
  setSelectedCashOption,
}: {
  amount: string;
  setSelectedPayment: (selectedPayment: string) => void;
  setSelectedCashOption: (selectedCashOption: string) => void;
}) => {
  const mercadoPagoCashPaymentValue = useVariableValue(
    'mercado-pago-cash-payment',
    false
  );
  const mercadoPagoBankTransferPaymentValue = useVariableValue(
    'mercado-pago-bank-transfer-payment',
    false
  );
  const [currentPayment, setCurrentPayment] = useState('card');
  const [currentCashPayment, setCurrentCashPayment] = useState('');
  const [price, setPrice] = useState(amount);
  const { t } = useTranslation();

  const setCashOption = (cashOption: string) => {
    setCurrentCashPayment(cashOption);
    setSelectedCashOption(cashOption);
  };

  const handleClick = (paymentType: string) => {
    setCurrentPayment(paymentType);
  };

  useEffect(() => {
    setSelectedPayment(currentPayment);
  }, [currentPayment]);

  useEffect(() => {
    if (currentPayment !== 'cash') setCurrentCashPayment('');
  }, [currentPayment]);

  useEffect(() => {
    const currency = config.WHITELABELNAME === 'Volindo' ? 'USD' : 'MXN';
    if (currency === 'USD') {
      getChangeCurrency('MXN').then(({ data }) => {
        const value = data.MXN[1];
        setPrice(`${parseFloat(value) * parseInt(amount)}`);
      });
    }
  }, []);

  return (
    <div className={styles.packageSelection}>
      <div className={styles.packageSelection_optionContainer}>
        {checkLimitsByPaymentType(price, MercadoPagoPaymentType.card) && (
          <button
            type="button"
            className={`${styles.packageOption} ${
              currentPayment === 'card' ? styles.activeOption : ''
            }`}
            onClick={() => handleClick('card')}
          >
            {t('payment.card')}
          </button>
        )}
        {mercadoPagoCashPaymentValue &&
          checkLimitsByPaymentType(price, MercadoPagoPaymentType.cash) && (
            <button
              type="button"
              className={`${styles.packageOption} ${
                currentPayment === 'cash' ? styles.activeOption : ''
              }`}
              onClick={() => handleClick('cash')}
            >
              {t('payment.cash')}
            </button>
          )}
        {mercadoPagoBankTransferPaymentValue &&
          checkLimitsByPaymentType(
            price,
            MercadoPagoPaymentType.bankTransfer
          ) && (
            <button
              type="button"
              className={`${styles.packageOption} ${
                currentPayment === 'bank-transfer' ? styles.activeOption : ''
              }`}
              onClick={() => handleClick('bank-transfer')}
            >
              {t('payment.bank_transfer')}
            </button>
          )}
      </div>
      {currentPayment === 'cash' && (
        <MercadoPagoCashSelect amount={price} setCashOption={setCashOption} />
      )}
    </div>
  );
};

export default MercadoPagoPaymentSelect;
