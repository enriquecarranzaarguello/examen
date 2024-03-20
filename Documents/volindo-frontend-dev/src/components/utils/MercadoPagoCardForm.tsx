import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './mercado-pago.module.scss';
import marketingStyles from '@styles/marketing.module.scss';
import config from '@config';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface MercadoPagoError {
  message: string;
}

interface MercadoPagoFormErrors {
  [key: string]: string[];
}

interface MercadoPagoDetailObject {
  detail?: string | MercadoPagoDetailObject;
}

const textFormatter = (camel: string) => {
  const camelCaseWords = camel.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
  const capitalizedWords = camelCaseWords.map((word, index) =>
    index === 0
      ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      : word.toLowerCase()
  );
  return capitalizedWords.join(' ');
};

const getLastDetail = (obj: MercadoPagoDetailObject): string | undefined => {
  if (obj.detail && typeof obj.detail === 'object') {
    return getLastDetail(obj.detail);
  }
  return obj.detail;
};

const MercadoPagoCardForm = ({
  redirectUrl,
  amount,
  payload,
  createPayment,
  createPaymentArgs,
  onError,
  isSubscription = false,
}: {
  redirectUrl: string;
  amount: string;
  payload: {};
  createPayment: (...args: any[]) => Promise<any>;
  createPaymentArgs: any[];
  onError: (error: any) => void;
  isSubscription: boolean;
}) => {
  const [confirmPay, setConfirmPay] = useState(false);
  const { t } = useTranslation();
  const [currentErrors, setCurrentErrors] = useState<MercadoPagoError[]>([]);
  const [fieldErrors, setFieldErrors] = useState<MercadoPagoFormErrors>({
    cardNumber: [],
    MMYY: [],
    CVC: [],
    gral: [],
  });
  const [loading, setLoading] = useState(true);

  const sendData = ({
    token,
    description,
    installments,
    payment_method_id,
    issuer_id,
    amount,
    email,
    identificationType,
    identificationNumber,
    payload,
  }: {
    token: string;
    description: string;
    installments: number;
    payment_method_id: string;
    issuer_id: string;
    amount: string;
    email: string;
    identificationType: string;
    identificationNumber: string;
    payload: {};
  }) => {
    const body = {
      ...payload,
      action: 'create_payment',
      token,
      issuer_id,
      payment_method_id,
      transaction_amount: Number(amount),
      installments: Number(installments),
      description: description,
      payer_email: email,
      payer: {
        email,
        identification: {
          type: identificationType,
          number: identificationNumber,
        },
      },
      paymentType: 'card',
    };

    createPayment(
      ...createPaymentArgs.map(arg => (arg === '{body}' ? body : arg))
    )
      .then(() => {
        setConfirmPay(true);
        setFieldErrors({
          cardNumber: [],
          MMYY: [],
          CVC: [],
          gral: [],
        });
        window.location.replace(redirectUrl);
      })
      .catch(({ response }) => {
        console.error(response);
        if (response.status === 409) {
          onError(`${t('payment.rejected')}`);
        } else {
          onError(`${t('valid.email')}`);
        }
        setLoading(false);
      });
  };

  // Add mercado pago sdk
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
    script.onload = onLoadMercadoPago; // Load Mercado Pago script
    return () => {
      document.body.removeChild(script); // Unmount Mercado Pago SDK
    };
  }, []);

  // Mercado Pago form logic
  const onLoadMercadoPago = () => {
    const key =
      // @ts-ignore
      isSubscription && (payload?.time === '1' || payload?.time === '3')
        ? config.mercado_pago_public_key_subscriptions
        : config.mercado_pago_public_key;
    const mp = new window.MercadoPago(key);

    const cardForm = mp.cardForm({
      amount,
      iframe: true,
      installments: 3,
      form: {
        id: 'form-checkout',
        cardNumber: {
          id: 'form-checkout__cardNumber',
          placeholder: t('payment.card-number'),
          style: {
            color: ' #b5b5b5',
          },
        },
        expirationDate: {
          id: 'form-checkout__expirationDate',
          placeholder: 'MM/YY',
          style: {
            color: ' #b5b5b5',
          },
        },
        securityCode: {
          id: 'form-checkout__securityCode',
          placeholder: 'CVC',
          style: {
            color: ' #b5b5b5',
          },
        },
        cardholderName: {
          id: 'form-checkout__cardholderName',
          placeholder: t('payment.card-name'),
        },
        issuer: {
          id: 'form-checkout__issuer',
          placeholder: t('payment.bank_issuer'),
        },
        installments: {
          id: 'form-checkout__installments',
          placeholder: t('payment.installments'),
        },
        cardholderEmail: {
          id: 'form-checkout__cardholderEmail',
          placeholder: t('stays.placeholder-email'),
        },
      },
      callbacks: {
        onFormMounted: (error: any) => {
          if (error)
            return console.warn('Form Mounted handling error: ', error);
          setLoading(false);
        },
        onSubmit: (event: any) => {
          event.preventDefault();
          setLoading(true);
          const {
            paymentMethodId: payment_method_id,
            issuerId: issuer_id,
            cardholderEmail: email,
            amount,
            token,
            installments,
            identificationNumber,
            identificationType,
          } = cardForm.getCardFormData();

          const description = '';

          if (!confirmPay)
            sendData({
              token,
              description,
              installments,
              payment_method_id,
              issuer_id,
              amount,
              email,
              identificationType,
              identificationNumber,
              payload,
            });
        },
        onFetching: (resource: any) => {
          // Animate progress bar
          const progressBar = document.querySelector('.progress-bar');
          progressBar?.removeAttribute('value');

          return () => {
            progressBar?.setAttribute('value', '0');
          };
        },
        onError: (formErrors: []) => {
          setCurrentErrors(formErrors);
        },
      },
    });
  };

  useEffect(() => {
    const newFieldErrors: MercadoPagoFormErrors = {
      cardNumber: [],
      MMYY: [],
      CVC: [],
      gral: [],
    };
    currentErrors.forEach(error => {
      if (error.message.includes('cardNumber')) {
        if (error.message.includes('empty')) {
          newFieldErrors.cardNumber = [textFormatter(error.message)];
        } else if (newFieldErrors.cardNumber.length === 0) {
          newFieldErrors.cardNumber.push(textFormatter(error.message));
        }
      } else if (
        error.message.includes('expirationMonth') ||
        error.message.includes('expirationYear')
      ) {
        if (error.message.includes('empty')) {
          newFieldErrors.MMYY = [textFormatter(error.message)];
        } else if (newFieldErrors.MMYY.length === 0) {
          newFieldErrors.MMYY.push(textFormatter(error.message));
        }
      } else if (error.message.includes('securityCode')) {
        if (error.message.includes('empty')) {
          newFieldErrors.CVC = [textFormatter(error.message)];
        } else if (newFieldErrors.CVC.length === 0) {
          newFieldErrors.CVC.push(textFormatter(error.message));
        }
      }
    });
    setFieldErrors(newFieldErrors);
  }, [currentErrors]);

  return (
    <form
      id="form-checkout"
      data-testid="mercado-pago-form"
      className={styles.MercadoPagoCheckoutForm}
    >
      {/* Card Number */}
      <div className={styles.MercadoPagoCheckoutForm_field}>
        <div className={styles.MercadoPagoCheckoutForm_field_label}>
          {t('payment.card-number')}
        </div>

        <div className={styles.MercadoPagoCheckoutForm_field_field}>
          <div
            id="form-checkout__cardNumber"
            className={styles.MercadoPagoCheckoutForm_field_field_div}
            style={{ height: '46px' }}
          ></div>
        </div>

        {/* Errors */}
        <ul style={{ marginBottom: '15px', marginTop: '-15px' }}>
          {fieldErrors.cardNumber.map((error, index) => (
            <li
              key={index}
              className={styles.MercadoPagoCheckoutForm_field_error}
            >
              {error}
            </li>
          ))}
        </ul>
      </div>

      {/* Expiration Date */}
      <div className={styles.MercadoPagoCheckoutForm_field}>
        <div className={styles.MercadoPagoCheckoutForm_field_label}>MM/YY</div>
        <div className={styles.MercadoPagoCheckoutForm_field_field}>
          <div
            id="form-checkout__expirationDate"
            className={styles.MercadoPagoCheckoutForm_field_field_div}
            style={{ height: '46px' }}
          ></div>
        </div>
        {/* Errors */}
        <ul style={{ marginBottom: '15px', marginTop: '-15px' }}>
          {fieldErrors.MMYY.map((error, index) => (
            <li
              key={index}
              className={styles.MercadoPagoCheckoutForm_field_error}
            >
              {error}
            </li>
          ))}
        </ul>
      </div>

      {/* Security Code */}
      <div className={styles.MercadoPagoCheckoutForm_field}>
        <div className={styles.MercadoPagoCheckoutForm_field_label}>CVC</div>
        <div className={styles.MercadoPagoCheckoutForm_field_field}>
          <div
            id="form-checkout__securityCode"
            className={styles.MercadoPagoCheckoutForm_field_field_div}
            style={{ height: '46px' }}
          ></div>
        </div>
        {/* Errors */}
        <ul style={{ marginBottom: '15px', marginTop: '-15px' }}>
          {fieldErrors.CVC.map((error, index) => (
            <li
              key={index}
              className={styles.MercadoPagoCheckoutForm_field_error}
            >
              {error}
            </li>
          ))}
        </ul>
      </div>

      {/* Card Holder Name */}
      <div className={styles.MercadoPagoCheckoutForm_field}>
        <div className={styles.MercadoPagoCheckoutForm_field_label}>
          {t('payment.card-name')}
        </div>
        <div className={styles.MercadoPagoCheckoutForm_field_field}>
          <input
            type="text"
            id="form-checkout__cardholderName"
            className={styles.MercadoPagoCheckoutForm_field_field_input}
          />
        </div>
      </div>

      {/* Bank Issuer */}
      <div className={styles.MercadoPagoCheckoutForm_field}>
        <div className={styles.MercadoPagoCheckoutForm_field_label}>
          {t('payment.bank_issuer')}
        </div>
        <div className={styles.MercadoPagoCheckoutForm_field_field}>
          <select
            id="form-checkout__issuer"
            className={styles.MercadoPagoCheckoutForm_field_field_select}
          ></select>
        </div>
      </div>

      {/* Installments */}
      <div
        className={styles.MercadoPagoCheckoutForm_field}
        style={{ display: isSubscription ? 'none' : 'inline-block' }}
      >
        <div className={styles.MercadoPagoCheckoutForm_field_label}>
          {t('payment.installments')}
        </div>
        <div className={styles.MercadoPagoCheckoutForm_field_field}>
          <select
            id="form-checkout__installments"
            className={styles.MercadoPagoCheckoutForm_field_field_select}
          ></select>
        </div>
      </div>

      {/* Email */}
      <div
        className={styles.MercadoPagoCheckoutForm_field}
        style={{ display: isSubscription ? 'none' : 'inline-block' }}
      >
        <div className={styles.MercadoPagoCheckoutForm_field_label}>
          {t('stays.placeholder-email')}
        </div>
        <div className={styles.MercadoPagoCheckoutForm_field_field}>
          <input
            type="email"
            id="form-checkout__cardholderEmail"
            className={styles.MercadoPagoCheckoutForm_field_field_input}
          />
        </div>
      </div>

      {/* General Errors */}
      <ul>
        {fieldErrors.gral.map((error, index) => (
          <li
            key={index}
            className={styles.MercadoPagoCheckoutForm_field_error}
          >
            {error}
          </li>
        ))}
      </ul>

      {/* Pay Button */}
      <button
        className={`${
          config.WHITELABELNAME === 'Volindo'
            ? marketingStyles.modal__button
            : marketingStyles.modal__buttonWL
        }`}
        disabled={confirmPay || loading}
      >
        <span>
          {confirmPay || loading ? t('common.processing') : t('common.pay')}
        </span>
      </button>
    </form>
  );
};

export default MercadoPagoCardForm;
