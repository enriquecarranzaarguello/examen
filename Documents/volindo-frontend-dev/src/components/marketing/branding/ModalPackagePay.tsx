import { MarketModal } from '@components/marketing';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import styles from '@styles/marketing.module.scss';
import { useRouter } from 'next/router';
import config from '@config';
import { purchasePackage } from '@utils/axiosClients';
import { PackageType } from '@typing/types';
import { useAppSelector } from '@context';

import {
  ConektaPayment,
  SelectTypePayment,
  StripePayment,
  MercadoPagoPayment,
  LoadingSpinner,
  Modal,
} from '@components';

const ModalPackagePay = ({
  packageName,
  total,
  onClose,
}: {
  onClose: () => void;
  total: number;
  packageName: PackageType;
}) => {
  const email = useAppSelector(state => state.agent.email);
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const [clientSecret, setClientSecret] = useState<string | null>('');
  const [checkoutId, setCheckoutId] = useState<string | null>('');
  const [mercadoPagoData, setMercadoPagoData] = useState({});
  const [mercadoPagoArgs, setMercadoPagoArgs] = useState<any[]>([]);
  const [service, setService] = useState<string | null>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmPay, setConfirmPay] = useState(false);

  const handleOnChangeLoading = (actualLoading: boolean) => {
    if (!actualLoading) {
      setConfirmPay(false);
    }
  };

  const checkLoadingStyleWL =
    config.WHITELABELNAME === 'Volindo'
      ? styles.branding__modalPayment__loading__icon
      : '';

  const userEmail = email ? email : t('payment.payment_state');

  const clearData = () => {
    setCheckoutId('');
    setClientSecret('');
    setMessage('');
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
    const body = {
      phone_number: phone_number,
      provider_payment: service,
      plazo: plazo,
      payment_method: paymentMethod,
      currency: 'USD',
      action,
    };
    purchasePackage(
      session?.user?.id_token || '',
      packageName,
      config.WHITELABELNAME == 'Volindo' ? 'volindo' : 'flyway',
      body
    )
      .then(res => {
        clearData();
        if (res?.data?.secret) {
          setClientSecret(res?.data?.secret);
        } else if (res.data?.checkout_id?.checkout_id) {
          setCheckoutId(res.data?.checkout_id?.checkout_id);
        } else if (service === 'mercado_pago' && res.data?.amount) {
          setMercadoPagoData(body);
          setMercadoPagoArgs([
            session?.user?.id_token || '',
            packageName,
            config.WHITELABELNAME == 'Volindo' ? 'volindo' : 'flyway',
            '{body}',
          ]);
        } else if (res?.data?.message?.message === 'success') {
          setMessage(`${i18n.t('payment.oxxo_pay', { EMAIL: userEmail })}`);
        }
      })
      .catch(error => {
        setMessage(`${t('payment.error_on_payment')}`);
        if (error.response.status === 409) {
          setMessage(`${t('payment.error_on_amount')}`);
        } else {
          setClientSecret(null);
          onClose();
          router.replace('/marketing/branding?payment=error', undefined, {
            shallow: true,
          });
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
    <Modal
      open={packageName !== 'None'}
      onClose={() => {
        onClose();
        clearData();
      }}
    >
      <div className={styles.branding__modalPayment}>
        <MarketModal.Title>{t('payment.payment-details')}</MarketModal.Title>
        <MarketModal.Content>
          <MarketModal.Paragraph>
            <Trans
              i18nKey="marketing.branding.payment.details"
              components={{
                b: <b />,
              }}
              values={{
                totalPrice: total,
                currency: config.WHITELABELNAME === 'Volindo' ? 'USD' : 'MXN',
                packageName,
              }}
            />
          </MarketModal.Paragraph>
          <SelectTypePayment
            handlePaymentService={handlePaymentService}
            paymentCase={'marketing'}
            time={6}
            price={total}
            services={{
              stripeShow: true,
              conektaShow: true,
              mercadoShow: true,
            }}
            disableCash
          />

          {loading && (
            <div className={styles.branding__modalPayment__loading}>
              <LoadingSpinner size="big" className={checkLoadingStyleWL} />
            </div>
          )}

          {message && (
            <div className="w-full flex items-center justify-center text-center md:text-left text-white">
              <p className="text-center">{message}</p>
            </div>
          )}

          {checkoutId && service === 'conekta' && (
            <ConektaPayment
              checkoutRequestId={checkoutId}
              service="marketing"
              redirectUrl={`${window.location.href}?payment=success`}
            />
          )}

          {total && service === 'mercado_pago' && (
            <MercadoPagoPayment
              amount={total.toString()}
              redirectUrl={`${window.location.href}?payment=success`}
              onError={(error: any) => setMessage(error)}
              service={service}
              payload={mercadoPagoData}
              packageName={packageName}
              createPayment={purchasePackage}
              createPaymentArgs={mercadoPagoArgs}
              isSubscription={false}
              onClose={onClose}
            />
          )}

          {clientSecret && service === 'stripe' && (
            <>
              <StripePayment
                clientSecret={clientSecret}
                type={'payment'}
                redirectUrl={`${window.location.href}?payment=success`}
                confirmationOutside={true}
                paymentConfirmed={confirmPay}
                onChangeLoading={handleOnChangeLoading}
              />
              <MarketModal.Button
                disabled={confirmPay}
                onClick={() => setConfirmPay(true)}
              >
                {confirmPay ? t('common.processing') : t('common.pay')}
              </MarketModal.Button>
            </>
          )}
        </MarketModal.Content>
      </div>
    </Modal>
  );
};

export default ModalPackagePay;
