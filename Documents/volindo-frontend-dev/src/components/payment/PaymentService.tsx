import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  SelectTypePayment,
  StripePayment,
  ConektaPayment,
  LoadingSpinner,
  MercadoPagoPayment,
} from '@components';
import {
  setSelectedAcademyVideo,
  useAppSelector,
  useAppDispatch,
} from '@context';
import { payMarketing } from '@utils/axiosClients';
import { useVariableValue } from '@devcycle/react-client-sdk';

const PaymentService = ({
  open,
  onClose,
  total,
  courseId,
  coursesIdsToUnlock,
  courseNamesToUnlock,
  name,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  courseId: string;
  coursesIdsToUnlock: string[];
  courseNamesToUnlock: string[];
  name: string;
}) => {
  const videoRedirection = useVariableValue('marketing-videos', false);
  const email = useAppSelector(state => state.agent.email);

  const dispatch = useAppDispatch();

  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [checkoutId, setCheckoutId] = useState<string>('');
  const [mercadoPagoPayment, setMercadoPagoPayment] = useState<string | null>(
    ''
  );
  const [mercadoPagoData, setMercadoPagoData] = useState({});
  const [mercadoPagoArgs, setMercadoPagoArgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [service, setService] = useState('');
  const [payWithCash, setPayWithCash] = useState(false);

  const userEmail = email ? email : t('payment.payment_state');

  const checkHandler = () => {
    setPayWithCash(currentValue => !currentValue);
  };

  const getClientData = (
    service: string,
    plan: string,
    currency: string,
    phone_number: string,
    plazo: string,
    amount: string,
    paymentMethod: string,
    action: string = ''
  ) => {
    setLoading(true);
    const requestBody = {
      phone_number: phone_number,
      provider_payment: service,
      plazo: plazo,
      payment_method: paymentMethod,
      course_names: [...courseNamesToUnlock],
      course_ids: [...coursesIdsToUnlock],
      amount: total,
      currency: 'MXN',
      action,
    };

    payMarketing(session?.user.id_token || '', requestBody)
      .then(res => {
        clearData();
        if (res?.data?.secret) {
          setClientSecret(res?.data?.secret);
        } else if (
          res.data?.checkout_id?.checkout_id &&
          res.data?.checkout_id?.checkout_id !== ''
        ) {
          setCheckoutId(res.data?.checkout_id?.checkout_id);
        } else if (service === 'mercado_pago' && res.data?.total_price) {
          setMercadoPagoPayment(res.data.total_price.toString());
          setMercadoPagoData(requestBody);
          setMercadoPagoArgs([session?.user.id_token || '', '{body}']);
        } else if (res?.data?.message?.message == 'success') {
          setMessage(`${i18n.t('payment.oxxo_pay', { EMAIL: userEmail })}`);
        }
      })
      .catch(error => {
        setMessage(`${t('payment.error_on_payment')}`);
        if (error.response.status === 409) {
          setMessage(`${t('payment.error_on_amount')}`);
        }
      })
      .finally(() => {
        setLoading(false);
        const videoData = {
          player_embed_url: '',
          description: '',
          name: '',
        };
        dispatch(setSelectedAcademyVideo(videoData));
      });
  };

  const clearData = () => {
    setCheckoutId('');
    setClientSecret('');
    setMessage('');
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
    setMessage('');
    setClientSecret('');
    setCheckoutId('');
    setService(service);
    if (service === 'conekta' && phone_number) {
      getClientData(
        service,
        '',
        currency,
        phone_number,
        plazo,
        amount,
        payment_method
      ); // First call
    } else if (service === 'stripe') {
      getClientData(
        service,
        '',
        currency,
        phone_number,
        plazo,
        amount,
        payment_method
      );
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

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full h-fit md:max-w-[550px] p-10">
        <h2 className="font-[700] text-center text-[32px] text-white mb-5 capitalize">
          {t('payment.safe-pay')}
        </h2>
        <SelectTypePayment
          handlePaymentService={handlePaymentService}
          paymentCase={'marketingPayment'}
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

        {checkoutId && (
          <ConektaPayment
            checkoutRequestId={checkoutId}
            service="marketing"
            redirectUrl={`${window.location.protocol}//${window.location.hostname}/marketing/course-flyway/player/${courseId}`}
          />
        )}

        {mercadoPagoPayment && service === 'mercado_pago' && (
          <MercadoPagoPayment
            amount={mercadoPagoPayment}
            redirectUrl={`${window.location.protocol}//${window.location.hostname}/marketing/course-flyway/player/${courseId}`}
            onError={(error: any) => setMessage(error)}
            service={service}
            payload={mercadoPagoData}
            packageName={'None'}
            createPayment={payMarketing}
            createPaymentArgs={mercadoPagoArgs}
            isSubscription={false}
            onClose={onClose}
          />
        )}

        {clientSecret && (
          <div className="w-full h-fit">
            <StripePayment
              className=""
              clientSecret={clientSecret}
              type="payment"
              redirectUrl={
                payWithCash
                  ? `${window.location.href}`
                  : `${window.location.protocol}//${window.location.hostname}/marketing/course-flyway/player/${courseId}`
              }
              confirmationOutside={false}
              paymentConfirmed={false}
              showCashOption={total <= 10_000}
              payWithCash={payWithCash}
              checkHandler={checkHandler}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentService;
