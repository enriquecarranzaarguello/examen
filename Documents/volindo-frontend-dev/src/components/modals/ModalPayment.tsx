import Image from 'next/image';
import * as Sentry from '@sentry/nextjs';
import IconCloseBlack from '@icons/close-black.svg';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import config from '@config';
import {
  StripePayment,
  LoadingSpinner,
  Modal,
  ConektaTokenizer,
  MercadoPagoPayment,
} from '@components';
import ConektaInit from '../ConektaInit';
import { createPortal } from 'react-dom';
import SelectTypePayment from '@components/payment/SelectTypePayment';
import { agentHasSubscription, createSuscription } from '@utils/axiosClients';
import { useAppSelector } from '@context';
import { useRouter } from 'next/router';
import { useVariableValue } from '@devcycle/react-client-sdk';

enum ErrorType {
  AmountExceeded = 'AmountExceeded',
  SubscriptionError = 'SubscriptionError',
}

const ModalPayment = ({
  open,
  onClose,
  type,
  time = 0,
  price = 0,
}: {
  open: boolean;
  onClose: () => void;
  type: 'trial' | 'complete' | 'starter' | 'pro' | 'max' | 'flyway';
  time: number;
  price: number;
}) => {
  const { email, agent_id } = useAppSelector(state => state.agent);
  const router = useRouter();

  const mercadoPagoSubscriptionActive = useVariableValue(
    'subscription-mercado-pago',
    false
  );

  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const [activeServicePayment, setActiveServicePayment] = useState('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [checkoutId, setCheckoutId] = useState<string>('');
  const [subsConektaOnePayment, setSubsConektaOnePayment] =
    useState<boolean>(false);
  const [mercadoPagoData, setMercadoPagoData] = useState({});
  const [mercadoPagoArgs, setMercadoPagoArgs] = useState<any[]>([]);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    type: ErrorType.SubscriptionError,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [payWithCash, setPayWithCash] = useState(false);

  const checkHandler = () => {
    setPayWithCash(currentValue => !currentValue);
  };

  useEffect(() => {
    handlePaymentService(
      'stripe',
      'pro',
      'USD',
      '',
      '1',
      `${price}`,
      payWithCash ? 'subscription-cash' : 'installments'
    );
  }, [payWithCash]);

  useEffect(() => {
    if (!open) {
      setClientSecret('');
      setMessage('');
      setCheckoutId('');
    }
  }, [open]);

  const userEmail = email ? email : t('payment.payment_state');

  const clearData = () => {
    setCheckoutId('');
    setClientSecret('');
    setMessage('');
    setSubsConektaOnePayment(false);
    setErrorModal({ visible: false, type: ErrorType.SubscriptionError });
  };

  const getClientData = (
    service: string,
    plan: string,
    currency: string,
    phone_number: string,
    plazo: string,
    amount: string,
    paymentMethod: string
  ) => {
    const requestBody = {
      plan: type === 'trial' ? 'trial' : `${plan}_${service}`,
      time: `${time}`,
      provider: service,
      currency: config.WHITELABELNAME === 'Volindo' ? 'USD' : 'MXN',
      phone_number: phone_number,
      plazo: parseInt(plazo),
      payment_method: payWithCash
        ? 'subscription-cash'
        : service === 'stripe' || service === 'mercado_pago'
          ? 'subscription'
          : paymentMethod,
      amount: amount,
      product_name: 'subscription',
    };

    setLoading(true);

    if (service === 'mercado_pago') {
      clearData();
      setMercadoPagoData(requestBody);
      setMercadoPagoArgs(['{body}', session?.user.id_token || '']);
      setLoading(false);
      return;
    }

    createSuscription(requestBody, session?.user.id_token || '')
      .then(res => {
        clearData();
        // TODO check these conditions
        if (res.data.client_secret) {
          setClientSecret(res?.data?.client_secret);
        } else if (
          res.data?.checkout_id?.checkout_id &&
          res.data?.checkout_id?.checkout_id !== ''
        ) {
          setCheckoutId(res.data?.checkout_id?.checkout_id);
        } else if (res?.data?.message?.message == 'success') {
          setMessage(`${i18n.t('payment.oxxo_pay', { EMAIL: userEmail })}`);
        }

        setLoading(false);
      })
      .catch(error => {
        setLoading(false);

        let errorType = ErrorType.SubscriptionError; // Valor por defecto

        if (error?.response?.status === 409) {
          const detailMessage = error?.response?.data?.detail;
          if (
            detailMessage === 'The amount cannot be more than 10000.00 MXN.'
          ) {
            errorType = ErrorType.AmountExceeded;
          }
          setErrorModal({ visible: true, type: errorType });
        }
      });
  };

  if (!open) return null;

  const handlePaymentService = async (
    service: 'stripe' | 'conekta' | 'mercado_pago',
    plan = '',
    currency = '',
    phone_number = '',
    plazo = '',
    amount = '',
    payment_method = ''
  ) => {
    //TODO Optimize to an object
    setActiveServicePayment(service);
    clearData();
    // TODO check these else and ifs
    if (service === 'conekta' && phone_number) {
      // console.log('payment_method', payment_method);
      if (plazo === '1' && payment_method !== 'cash') {
        if (!(await verifySubscription())) {
          setSelectedPlan(plan);
          setPhone(phone_number);
          setSubsConektaOnePayment(true);
        }
      } else {
        getClientData(
          service,
          plan,
          currency,
          phone_number,
          plazo,
          amount,
          payment_method
        ); // First call
      }
    } else if (service === 'stripe') {
      getClientData(
        service,
        plan,
        currency,
        phone_number,
        plazo,
        amount,
        payment_method
      ); // Second call
    } else if (service === 'mercado_pago') {
      getClientData(
        service,
        plan,
        currency,
        phone_number,
        plazo,
        amount,
        payment_method
      ); // Third call
    }
  };

  const handleSubscriptionConekta = (token: string) => {
    setMessage('');
    setLoading(true);
    const requestBody = {
      plan: `${selectedPlan}_conekta`,
      time: `${time}`,
      provider: 'conekta',
      phone_number: phone,
      plazo: 1,
      payment_method: 'subscription',
      product_name: 'subscription',
      token_id: token,
    };

    createSuscription(requestBody, session?.user.id_token || '')
      .then(res => {
        clearData();
        if (res.data.message === 'success') {
          router.replace('/subscription/thankyou');
        }
      })
      .catch(error => {
        setLoading(false);
        if (error?.response?.status === 500) {
          setMessage(t('payment.error_on_payment') || '');
        } else {
          setMessage(t('payment.invalid_card') || '');
        }
      });
  };

  const verifySubscription = async () => {
    setLoading(true);
    let hasSubs = false;
    try {
      const response = await agentHasSubscription(agent_id);
      if (response.status === 200) {
        hasSubs = response?.data?.has_subscription;
      }

      if (hasSubs)
        setErrorModal({ visible: true, type: ErrorType.SubscriptionError });
      else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
    return hasSubs;
  };

  return createPortal(
    <Modal open={open} onClose={onClose}>
      <div className="relative bg-black shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-full min-h-full h-dvh py-12 px-5 md:rounded-[16px] md:h-fit md:w-[605px] md:pb-10 md:pt-10 md:px-16 text-white">
        <div className="flex justify-center flex-col items-center h-fit overflow-hidden overflow-y-scroll scrollbar-hide">
          <h1 className="font-[700] text-center text-[40px] text-white ">
            {t('payment.payment-details')}
          </h1>
          <p className="text-white text-xs text-center max-w-[430px] mb-8">
            {type == 'trial'
              ? t('payment.freetrial-policy')
              : t('payment.complete-policy')}
          </p>
          <SelectTypePayment
            handlePaymentService={handlePaymentService}
            paymentCase={'subscription'}
            time={6}
            price={price}
            services={{
              stripeShow: true,
              conektaShow: true,
              mercadoShow: mercadoPagoSubscriptionActive,
            }}
            disableCash={price > 10000}
          />
          {message && (
            <div className="w-full flex items-center justify-center text-center md:text-left">
              <p className="text-center text-white">{message}</p>
            </div>
          )}
          {/* {checkoutId && activeServicePayment === 'conekta' && ( */}
          {activeServicePayment === 'conekta' &&
            (subsConektaOnePayment ? (
              <ConektaTokenizer
                key="tokenizer"
                onTokenGenerated={handleSubscriptionConekta}
                onErrorToken={() => {
                  setMessage(t('payment.invalid_card') || '');
                }}
                hidden={loading}
              />
            ) : (
              checkoutId && (
                <ConektaInit
                  key="conektaNormal"
                  checkoutRequestId={checkoutId}
                  service="suscription"
                  redirectUrl={`${config.base_dashboard}/subscription/thankyou`}
                />
              )
            ))}
          {clientSecret && activeServicePayment === 'stripe' && (
            <div className="w-full h-fit">
              {type === 'trial' ? (
                <StripePayment
                  key="trial"
                  className="md:mb-10 px-2"
                  clientSecret={clientSecret}
                  type={'setup'}
                  redirectUrl={`${config.base_dashboard}/subscription/thankyou`}
                  cancelButtonOnClick={onClose}
                  confirmButtonText={t('payment.save') || ''}
                  cancelButtonText={t('payment.skip') || ''}
                />
              ) : (
                <StripePayment
                  key="complete"
                  className="md:mb-10 px-2"
                  clientSecret={clientSecret}
                  type={'payment'}
                  redirectUrl={
                    payWithCash
                      ? `${config.base_dashboard}/payment`
                      : `${config.base_dashboard}/subscription/thankyou`
                  }
                  cancelButtonOnClick={onClose}
                  cancelButtonText={t('payment.skip') || ''}
                  showCashOption={price <= 10_000}
                  payWithCash={payWithCash}
                  checkHandler={checkHandler}
                />
              )}
            </div>
          )}
          {price && activeServicePayment === 'mercado_pago' && (
            <MercadoPagoPayment
              amount={price.toString()}
              redirectUrl={`${config.base_dashboard}/subscription/thankyou`}
              onError={(error: any) => setMessage(error)}
              service={''}
              payload={mercadoPagoData}
              packageName={'None'}
              createPayment={createSuscription}
              createPaymentArgs={mercadoPagoArgs}
              isSubscription={true}
              onClose={onClose}
            />
          )}
          {loading && (
            <div className="w-full min-h-[385px] md:pb-16 flex items-center justify-center">
              <LoadingSpinner size="big" />
            </div>
          )}
          {errorModal.visible && (
            <p className="font-[400] text-[16px] leading-[20px] text-white my-2">
              {errorModal.type === ErrorType.SubscriptionError
                ? t('paymentreg.WL.payment_error')
                : t('paymentreg.WL.payment_error_cash')}
            </p>
          )}
        </div>
      </div>
    </Modal>,
    document.getElementById('mainLayout') || document.body
  );
};

export default ModalPayment;
