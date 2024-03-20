/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import phoneCodes from '../../common/data/countries/phoneCountries.json';

import Image from 'next/image';
import conektaIcon from '@icons/conektaLogo.svg';
import stripeLogo from '@icons/stripeLogo.svg';
import mercadoLogo from '@icons/mercadoPagoLogo.svg';

import { useVariableValue } from '@devcycle/react-client-sdk';

import styles from '@styles/modals/payment-modal.module.scss';

import { PaymentServices } from '@typing/proptypes';

import { usePrice } from 'src/components/utils/Price/Price';

import config from '@config';

type FieldInteractionsType = {
  [key: string]: boolean;
};

const SelectTypePayment = ({
  handlePaymentService,
  paymentCase,
  time,
  price = 0,
  disableCash = false,
  services = { stripeShow: false, conektaShow: false, mercadoShow: false },
}: {
  handlePaymentService: any;
  paymentCase: string;
  time: number;
  price: number;
  disableCash?: boolean;
  services: PaymentServices;
}) => {
  const { stripeShow, conektaShow, mercadoShow } = services;
  const paymentWithCard = useVariableValue('payment-with-card', true);
  const payWithConekta = useVariableValue('pay-with-conekta', false);
  const payWithStripe = useVariableValue('payment-with-stripe', true);
  const payWithMercado = useVariableValue('payment-with-mercadopago', false);

  const { t, i18n } = useTranslation('common');
  const [paymentActive, setPaymentActive] = useState('');
  const [monthlyPaymentPeriod, setMonthlyPaymentPeriod] = useState('1');
  const [fieldInteractions, setFieldInteractions] =
    useState<FieldInteractionsType>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<any>({
    phoneNumber: '',
    plan: '',
  });

  const [isChecked, setIsChecked] = useState(false);
  const [phoneCode, setPhoneCode] = useState(phoneCodes[0].code);

  const brandPackages = config.WHITELABELPACKAGES;

  const priceCurrency = usePrice();

  const subscriptionOptions = ['Pro Plan'];
  const monthlyPaymentOptions = [1, 3, 6, 9, 12];

  const filteredMonthlyPaymentOptions = monthlyPaymentOptions.filter(
    option => option <= time
  );

  const handleMonthlyPaymentClick = (number: number) => {
    setMonthlyPaymentPeriod(number.toString());
  };

  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'phoneNumber':
        if (!value) {
          setFieldErrors({
            ...fieldErrors,
            [fieldName]: `${t('travelers.required_phone_number')}`,
          });
        } else {
          setFieldErrors({ ...fieldErrors, [fieldName]: '' });
        }
        break;
      default:
        setFieldErrors({ ...fieldErrors, [fieldName]: '' });
    }
  };

  const handleFieldInteraction = (fieldName: any) => {
    setFieldInteractions(prevInteractions => ({
      ...prevInteractions,
      [fieldName]: true,
    }));
    validateField(fieldName, formData[fieldName]);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: `${value}` });
        validateField(name, value);
      }
    } else {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);
    }
  };

  const clearData = () => {
    setFieldInteractions({});
    setFormData({
      phoneNumber: '',
      plan: '',
    });
  };

  const isValidNumber = (number: string) => phoneCode && number.length === 10;

  useEffect(() => {
    switch (paymentActive) {
      case 'stripe':
        handlePaymentService(
          paymentActive,
          'pro',
          'USD',
          '',
          monthlyPaymentPeriod,
          price,
          'installments'
        );
        break;
      case 'conekta':
        handlePaymentService(
          paymentActive,
          'pro',
          'MXN',
          isValidNumber(formData.phoneNumber)
            ? `${phoneCode}${formData.phoneNumber}`
            : '',
          monthlyPaymentPeriod,
          price,
          isChecked ? 'cash' : 'installments'
        );
        break;
      case 'mercado_pago':
        handlePaymentService(
          paymentActive,
          'pro',
          'MXN',
          '',
          monthlyPaymentPeriod,
          price,
          'installments'
        );
        break;
      default:
        break;
    }
  }, [formData, monthlyPaymentPeriod, isChecked, paymentActive]);

  useEffect(() => {
    handlePaymentService(
      '',
      'pro',
      'MXN',
      '',
      monthlyPaymentPeriod,
      price,
      'installments'
    );
  }, []);

  return (
    <>
      <div className={styles.packageSelection}>
        <div
          data-testid="payment-methods"
          className={styles.packageSelection_optionContainer}
        >
          {/* TODO I think this could be refactored all payment methods button look 
          the same conditions and and some content is dynamic only */}
          {payWithStripe && stripeShow && (
            <button
              data-testid="payment-method-stripe"
              className={`${styles.packageOption} ${
                paymentActive === 'stripe' ? styles.activeOption : ''
              }`}
              onClick={() => {
                setPaymentActive('stripe');
                clearData();
              }}
            >
              <Image
                src={stripeLogo}
                alt="Stripe Payment Logo"
                width={50}
                height={40}
              />
              <span className={styles.optionText}>Pay By Stripe</span>
            </button>
          )}

          {payWithConekta && conektaShow && (
            <button
              data-testid="payment-method-coneckta"
              className={`${styles.packageOption} ${
                paymentActive === 'conekta' ? styles.activeOption : ''
              }`}
              onClick={() => {
                setPaymentActive('conekta');
                clearData();
              }}
            >
              <Image
                src={conektaIcon}
                alt="Conekta Payment Logo"
                width={100}
                height={40}
              />
              <span className={styles.optionText}>Pay By Conekta</span>
            </button>
          )}

          {payWithMercado && mercadoShow && (
            <button
              data-testid="payment-method-mercado"
              className={`${styles.packageOption} ${
                paymentActive === 'mercado_pago' ? styles.activeOption : ''
              }`}
              onClick={() => {
                setPaymentActive('mercado_pago');
                clearData();
              }}
            >
              <Image
                src={mercadoLogo}
                alt="Mercado Pago Payment Logo"
                width={50}
                height={40}
                className={styles.packageOption_image}
              />
              <span className={styles.optionText}>Pay By Mercado Pago</span>
            </button>
          )}

          {!stripeShow && !conektaShow && !mercadoShow && (
            <h2
              className={styles.packageSelection_optionContainer_messageError}
            >
              {t('payment.service_no_available')}
            </h2>
          )}
        </div>

        {/* Subscription options */}
        {paymentActive && paymentActive === 'conekta' && (
          <>
            <div className={styles.packageSelection_plansContainer}>
              {paymentCase === 'subscription' && (
                <select
                  name="paymentPlan"
                  value={subscriptionOptions[0]}
                  defaultValue={subscriptionOptions[0]}
                  className={styles.packageSelection_plansContainer_selector}
                  onBlur={() => handleFieldInteraction('plan')}
                >
                  {subscriptionOptions.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {disableCash ||
            price * priceCurrency.baseCurrency(price) > 10000 ? null : (
              <div className={styles.packageSelection_plansContainer_check}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    setMonthlyPaymentPeriod('1');
                    setIsChecked(!isChecked);
                  }}
                  className={
                    styles.packageSelection_plansContainer_check_checkbox
                  }
                />
                <span
                  className={styles.packageSelection_plansContainer_check_text}
                >
                  ¿Quieres pagar con efectivo?
                </span>
              </div>
            )}

            {paymentWithCard && !isChecked && (
              <div
                data-testid="payments-months"
                className={styles.packageSelection_monthsContainer}
              >
                {filteredMonthlyPaymentOptions.map(
                  (number: number, index: number) => (
                    <div
                      data-testid={`payments-month-selector-${index + 1}`}
                      key={index}
                      className={`w-full min-h-[70px] flex flex-col bg-[#202020] rounded-[5px] border border-[#414141] text-[#C0C0C0] items-center justify-center p-2 hover:border-[var(--primary-background)] hover:text-[var(--primary-background-light)] ${
                        monthlyPaymentPeriod === number.toString()
                          ? styles.activeOption
                          : ''
                      }`}
                      onClick={() => handleMonthlyPaymentClick(number)}
                    >
                      <p
                        data-testid={`package-title-${index}`}
                        className="font-[600] text-[11px]"
                      >
                        {number}{' '}
                        {`${
                          number === 1
                            ? `${t('payment.payment')}`
                            : `${t('payment.payments')}`
                        }`}
                      </p>

                      {brandPackages === 'WLPAYMENT' &&
                      (paymentCase === 'marketing' ||
                        paymentCase === 'subscription' ||
                        paymentCase === 'marketingPayment') ? (
                        <>
                          <p
                            data-testid={`package-price-${index + 1}`}
                            className="font-[400] text-[8px]"
                          >
                            {`$ ${Math.floor(price / number)} MXN`}
                          </p>

                          <p
                            data-testid={`package-text-${index}`}
                            className="font-[400] text-[8px]"
                          >
                            {t('payment.per_month')}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-[400] text-[8px]">{`${
                            priceCurrency.countrySymbol
                          } ${Number(
                            priceCurrency.integerRate(price / number)
                          )} ${priceCurrency.countryCode}`}</p>
                          <p className="font-[400] text-[8px]">
                            {t('payment.per_month')}
                          </p>
                        </>
                      )}
                    </div>
                  )
                )}
              </div>
            )}

            {isChecked || monthlyPaymentPeriod ? (
              <div
                data-testid="payments-months-phone"
                className={styles.packageSelection_phoneContainer}
              >
                <div
                  className={
                    styles.packageSelection_phoneContainer_codesContainer
                  }
                >
                  <select
                    data-testid="payments-months-phone-code"
                    className={
                      styles.packageSelection_phoneContainer_codesContainer_selector
                    }
                    value={phoneCode}
                    onChange={e => setPhoneCode(e.target.value)}
                  >
                    {phoneCodes.map((country: any, index) => {
                      return (
                        <option
                          key={index}
                          value={country.code}
                          className="text-[#C0C0C0]"
                        >
                          {country.iso_code} {country.code}
                        </option>
                      );
                    })}
                  </select>

                  <input
                    data-testid="payments-months-phone-input"
                    name="phoneNumber"
                    type="text"
                    onChange={handleChange}
                    placeholder="Phone number*"
                    onBlur={() => handleFieldInteraction('phoneNumber')}
                    className={`w-3/4 h-[45px] bg-[#202020] rounded-[5px] border border-[#414141] text-[#C0C0C0] p-5 focus:outline-none focus:border-[var(--primary-background)] ${
                      fieldInteractions['phoneNumber'] && !formData.phoneNumber
                        ? 'border-red-500'
                        : ''
                    }`}
                    maxLength={10}
                  />
                </div>
                <div
                  className={
                    styles.packageSelection_phoneContainer_phoneMessageContainer
                  }
                >
                  {fieldErrors['phoneNumber'] && (
                    <p
                      className={
                        styles.packageSelection_phoneContainer_phoneMessageContainer_text
                      }
                    >
                      {fieldErrors['phoneNumber']}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default SelectTypePayment;
