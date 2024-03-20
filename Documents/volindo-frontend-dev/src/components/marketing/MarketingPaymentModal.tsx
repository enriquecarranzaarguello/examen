import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  StripePayment,
  SelectTypePayment,
  ConektaPayment,
  LoadingSpinner,
  MercadoPagoPayment,
} from '@components';

import { useAppSelector } from '@context';

import style from '@styles/marketing-payment.module.scss';

import {
  getMarketingPaymentSecret,
  marketingCampSkipPayment,
} from '@utils/axiosClients';

const MarketingPaymentModal = ({
  onClose,
  open,
  confirmPay,
  setConfirmPay,
  handleSkipPay,
  campaignUUID,
  agentId,
  total,
}: any) => {
  const email = useAppSelector(state => state.agent.email);

  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const [clientSecret, setClientSecret] = useState<string | null>('');
  const [checkoutId, setCheckoutId] = useState<string | null>('');
  const [mercadoPagoPayment, setMercadoPagoPayment] = useState<string | null>(
    ''
  );
  const [mercadoPagoArgs, setMercadoPagoArgs] = useState<any[]>([]);
  const [mercadoPagoData, setMercadoPagoData] = useState({});
  const [service, setService] = useState<string | null>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const userEmail = email ? email : t('payment.payment_state');
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
      `${total}`,
      payWithCash ? 'cash' : 'installments'
    );
  }, [payWithCash]);

  const getClientData = (
    service: string,
    plan: string,
    currency: string,
    phone_number: string,
    plazo: string,
    amount: string,
    paymentMethod: string,
    action: string = '',
    payWithCash?: boolean
  ) => {
    setLoading(true);
    const body = {
      phone_number: phone_number,
      provider_payment: service,
      plazo: plazo,
      payment_method: paymentMethod,
      currency: 'USD',
      action,
    };
    getMarketingPaymentSecret(
      campaignUUID,
      agentId,
      session?.user?.id_token || '',
      body
    )
      .then(res => {
        if (res?.data?.secret) {
          setClientSecret(res?.data?.secret);
          setCheckoutId('');
          setMessage('');
        } else if (res.data?.checkout_id?.checkout_id) {
          setCheckoutId(res.data?.checkout_id?.checkout_id);
          setMessage('');
          setClientSecret('');
        } else if (service === 'mercado_pago' && res.data?.total_price) {
          setMercadoPagoPayment(res.data.total_price.toString());
          setMercadoPagoData(body);
          setMercadoPagoArgs([
            campaignUUID,
            agentId,
            session?.user?.id_token || '',
            '{body}',
          ]);
        } else if (res?.data?.message?.message === 'success') {
          setMessage(`${i18n.t('payment.oxxo_pay', { EMAIL: userEmail })}`);
          setClientSecret('');
          setCheckoutId('');
        }
      })
      .catch(error => {
        setMessage(`${t('payment.error_on_payment')}`);
        if (error.response.status === 409) {
          setMessage(`${t('payment.error_on_amount')}`);
        }
      })
      .finally(() => setLoading(false));
  };

  const handlePaymentService = (
    service: 'stripe' | 'conekta' | 'mercado_pago',
    plan = '',
    currency = '',
    phone_number = '',
    plazo = '',
    amount = '',
    payment_method = ''
  ) => {
    setService(service);
    setCheckoutId('');
    setClientSecret('');
    setMessage('');
    if (service === 'conekta' && phone_number) {
      getClientData(
        service,
        plan,
        currency,
        phone_number,
        plazo,
        amount,
        payment_method
      ); // First call
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
        payment_method,
        'init'
      ); // Third call
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={style.payment_container}>
        <div className={style.payment_container_text}>
          <p className={style.payment_container_text_title}>
            {t('payment.payment-details')}
          </p>
          <p className={style.payment_container_text_paragraph}>
            {t('payment.safe-pay')}
          </p>
        </div>

        <SelectTypePayment
          handlePaymentService={handlePaymentService}
          paymentCase={'adCreation'}
          time={6}
          price={total}
          services={{ stripeShow: true, conektaShow: true, mercadoShow: true }}
        />

        {loading && (
          <div className="w-full flex items-center justify-center text-center">
            <LoadingSpinner size="big" />
          </div>
        )}

        {message && (
          <div className="w-full flex items-center justify-center text-center md:text-left md:max-w-[600px]">
            <p className="text-center">{message}</p>
          </div>
        )}

        {checkoutId && service === 'conekta' && (
          <>
            <ConektaPayment
              checkoutRequestId={checkoutId}
              service="marketing"
              redirectUrl={`${window.location.href.replace('form', 'thanks')}`}
            />
            <button
              className={style.payment_container_skip}
              onClick={() => handleSkipPay(true)}
            >
              {t('payment.skip')}
            </button>
          </>
        )}

        {mercadoPagoPayment && service === 'mercado_pago' && (
          <MercadoPagoPayment
            amount={mercadoPagoPayment}
            redirectUrl={`${window.location.href.replace('form', 'thanks')}`}
            onError={(error: any) => setMessage(error)}
            service={service}
            payload={mercadoPagoData}
            packageName={'None'}
            createPayment={getMarketingPaymentSecret}
            createPaymentArgs={mercadoPagoArgs}
            isSubscription={false}
            onClose={onClose}
          />
        )}

        {clientSecret && service === 'stripe' && (
          <>
            <StripePayment
              clientSecret={clientSecret}
              type="payment"
              redirectUrl={
                payWithCash
                  ? `${window.location.href}`
                  : `${window.location.href.replace('form', 'thanks')}`
              }
              paymentConfirmed={confirmPay}
              showCashOption={total <= 10_000}
              payWithCash={payWithCash}
              checkHandler={checkHandler}
            />
            <div className="md:flex w-full md:mt-[20px] md:mb-[10px]">
              <button
                className={style.payment_container_pay}
                onClick={() => setConfirmPay(true)}
              >
                <span className="block text-white scale-x-[1.4]">
                  {t('common.pay')}
                </span>
              </button>

              <button
                className={style.payment_container_skip}
                onClick={() => handleSkipPay(true)}
              >
                <span className="block scale-x-[1.4]">{t('payment.skip')}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default MarketingPaymentModal;
