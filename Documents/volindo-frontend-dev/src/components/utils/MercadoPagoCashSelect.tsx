import { useEffect, useState } from 'react';

import styles from '@styles/modals/payment-modal.module.scss';
import { checkLimitsByCashOption } from 'src/utils/mercadoPagoUtils';
import { MercadoPagoCashOption } from '@typing/types';
import { useVariableValue } from '@devcycle/react-client-sdk';

const MercadoPagoCashSelect = ({
  amount,
  setCashOption,
}: {
  setCashOption: (cashOption: string) => void;
  amount: string;
}) => {
  const [currentPayment, setCurrentPayment] = useState('bancomer');
  const mercadoPagoOxxoPaymentValue = useVariableValue(
    'mercado-pago-oxxo-payment',
    false
  );

  const handleClick = (paymentType: string) => {
    setCurrentPayment(paymentType);
  };

  useEffect(() => {
    setCashOption(currentPayment);
  }, [currentPayment]);

  return (
    <div className={styles.packageSelection_optionContainer}>
      {checkLimitsByCashOption(amount, MercadoPagoCashOption.bancomer) && (
        <button
          type="button"
          className={`${styles.packageOption} ${
            currentPayment === 'bancomer' ? styles.activeOption : ''
          }`}
          onClick={() => handleClick('bancomer')}
        >
          Bancomer
        </button>
      )}
      {checkLimitsByCashOption(amount, MercadoPagoCashOption.banamex) && (
        <button
          type="button"
          className={`${styles.packageOption} ${
            currentPayment === 'banamex' ? styles.activeOption : ''
          }`}
          onClick={() => handleClick('banamex')}
        >
          Banamex
        </button>
      )}
      {checkLimitsByCashOption(amount, MercadoPagoCashOption.serfin) && (
        <button
          type="button"
          className={`${styles.packageOption} ${
            currentPayment === 'serfin' ? styles.activeOption : ''
          }`}
          onClick={() => handleClick('serfin')}
        >
          Serfin
        </button>
      )}
      {mercadoPagoOxxoPaymentValue &&
        checkLimitsByCashOption(amount, MercadoPagoCashOption.oxxo) && (
          <button
            type="button"
            className={`${styles.packageOption} ${
              currentPayment === 'oxxo' ? styles.activeOption : ''
            }`}
            onClick={() => handleClick('oxxo')}
          >
            OXXO
          </button>
        )}
    </div>
  );
};

export default MercadoPagoCashSelect;
