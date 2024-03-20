import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import config from '@config';
import marketingStyles from '@styles/marketing.module.scss';
import styles from './mercado-pago.module.scss';
import { useAppSelector } from '@context';
import { MercadoPagoBankTransferFormProps } from '@typing/proptypes';
import { MercadoPagoBankTransferExtraData } from '@typing/types';

const MercadoPagoBankTransferForm = ({
  payload,
  createPayment,
  createPaymentArgs,
  onError,
  onClose,
}: {
  payload: {};
  createPayment: (...args: any[]) => Promise<any>;
  createPaymentArgs: any[];
  onError: (error: any) => void;
  onClose: () => void;
}) => {
  const agentData = useAppSelector(state => state.agent);
  const [loading, setLoading] = useState(false);
  const [confirmPay, setConfirmPay] = useState(false);
  const [form, setForm] = useState<MercadoPagoBankTransferFormProps>({
    firstName: agentData.profile.full_name.split(' ')[0],
    lastName: agentData.profile.full_name.split(' ')[1],
    email: agentData.email,
  });
  const { t } = useTranslation();
  const [instructions, setInstructions] = useState({
    firstPart: '',
    email: '',
  });
  const [paymentData, setPaymentData] =
    useState<MercadoPagoBankTransferExtraData>();

  const sendData = ({
    email,
    firstName,
    lastName,
    payload,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    payload: {};
  }) => {
    const body = {
      ...payload,
      action: 'create_payment',
      email,
      firstName,
      lastName,
      paymentType: 'bank-transfer',
    };
    createPayment(
      ...createPaymentArgs.map(arg => (arg === '{body}' ? body : arg))
    )
      .then(
        ({
          data: {
            payment: { extra_data },
          },
        }) => {
          setConfirmPay(true);
          setLoading(false);
          setPaymentData(extra_data);
        }
      )
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    sendData({
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      payload,
    });
    const [firstPart] = t('payment.details-submitted', {
      EMAIL: form.email,
    }).split(form.email);
    setInstructions({ firstPart, email: form.email });
  };

  const handleInput = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setForm(currentData => ({ ...currentData, [target.name]: target.value }));
  };

  if (confirmPay)
    return (
      <div className={styles.MercadoPagoTicket}>
        <div>
          <h2 className={styles.MercadoPagoTicket_h2}>
            {t('payment.payment-details')}:
          </h2>
        </div>
        <div className={styles.MercadoPagoTicket_content}>
          <div>
            <h3 className={styles.MercadoPagoTicket_h3}>
              {t('payment.transaction-number')}{' '}
              <strong>#{paymentData?.transaction_number}</strong>
            </h3>
            <p>
              {t('payment.payment-instructions', {
                AMOUNT_CHARGE: paymentData?.amount_charge,
              })}
            </p>
            <p>
              {t('payment.time-to-pay', {
                DATE_OF_EXPIRATION: paymentData?.date_of_expiration,
              })}
            </p>
          </div>
          <div>
            <h3 className={styles.MercadoPagoTicket_h3}>
              {t('payment.information-needed')}:
            </h3>
            <ul>
              <li>
                CLABE:{' '}
                <strong>{paymentData?.payment_method_reference_id}</strong>
              </li>
              <li>
                {t('payment.beneficiary-name')}: <strong>Mercado Pago</strong>
              </li>
              <li>
                {t('payment.optional-reference')}:{' '}
                <strong>{paymentData?.acquirer_reference}</strong>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <p>
            {instructions.firstPart}
            <strong>{instructions.email}</strong>
          </p>
        </div>
      </div>
    );

  return (
    <>
      <div>{t('suppliers.modal-notification-text')}</div>

      {/* Form */}
      <form className={styles.MercadoPagoCheckoutForm} onSubmit={handleSubmit}>
        {/* First Name Field */}
        <div className={styles.MercadoPagoCheckoutForm_field}>
          <label
            htmlFor="first-name"
            className={styles.MercadoPagoCheckoutForm_field_label}
          >
            {t('stays.placeholder-first-name')}
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder={`${t('stays.placeholder-first-name')}`}
            className={styles.MercadoPagoCheckoutForm_field_field_input}
            value={form.firstName}
            onInput={handleInput}
          />
        </div>

        {/* Last Name Field */}
        <div className={styles.MercadoPagoCheckoutForm_field}>
          <label
            htmlFor="last-name"
            className={styles.MercadoPagoCheckoutForm_field_label}
          >
            {t('stays.placeholder-last-name')}
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder={`${t('stays.placeholder-last-name')}`}
            className={styles.MercadoPagoCheckoutForm_field_field_input}
            value={form.lastName}
            onInput={handleInput}
          />
        </div>

        {/* Email Field */}
        <div className={styles.MercadoPagoCheckoutForm_field}>
          <label
            htmlFor="email"
            className={styles.MercadoPagoCheckoutForm_field_label}
          >
            {t('stays.placeholder-email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={`${t('stays.placeholder-email')}`}
            className={styles.MercadoPagoCheckoutForm_field_field_input}
            value={form.email}
            onInput={handleInput}
          />
        </div>

        {confirmPay && (
          <button
            className={`${
              config.WHITELABELNAME === 'Volindo'
                ? marketingStyles.modal__button
                : marketingStyles.modal__buttonWL
            }`}
            onClick={onClose}
          >
            <span>{t('common.close')}</span>
          </button>
        )}

        {/* Pay Button */}
        {!confirmPay && (
          <button
            className={`${
              config.WHITELABELNAME === 'Volindo'
                ? marketingStyles.modal__button
                : marketingStyles.modal__buttonWL
            }`}
            disabled={confirmPay || loading}
          >
            <span>
              {confirmPay || loading
                ? t('common.processing')
                : t('common.send')}
            </span>
          </button>
        )}
      </form>
    </>
  );
};

export default MercadoPagoBankTransferForm;
