import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { FormEvent, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@components';
import Link from 'next/link';
import { useVariableValue } from '@devcycle/react-client-sdk';

const StripeForm = ({
  className = '',
  type,
  redirectUrl = '/',
  cancelButton = true,
  confirmButtonText,
  cancelButtonText,
  confirmationOutside = false,
  paymentConfirmed = false,
  onChangeLoading,
  cancelButtonOnClick = () => {},
  showCashOption = false,
  payWithCash = false,
  checkHandler = () => {},
}: {
  className?: string;
  type: 'setup' | 'payment';
  redirectUrl: string;
  cancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmationOutside?: boolean;
  paymentConfirmed?: boolean;
  onChangeLoading?: (actuaLoading: boolean) => void;
  cancelButtonOnClick?: () => void;
  showCashOption?: boolean;
  payWithCash?: boolean;
  checkHandler?: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [generatingTicket, setGeneratingTicket] = useState(false);

  const { t } = useTranslation();
  const payWithOxxo = useVariableValue('stripe-oxxo-payment', false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handlePayment();
  };

  const handlePayment = async () => {
    if (payWithCash) {
      setGeneratingTicket(true);
    } else {
      setLoading(true);
    }
    if (onChangeLoading) onChangeLoading(true);
    if (!stripe || !elements) return null;

    let stripeResponse;
    if (type === 'setup') {
      stripeResponse = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: redirectUrl,
        },
      });
    } else {
      stripeResponse = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: redirectUrl,
        },
      });
    }

    if (stripeResponse?.error) {
      setErrorMessage(stripeResponse?.error.message || '');
    }
    if (onChangeLoading) onChangeLoading(false);
    if (payWithCash) {
      setGeneratingTicket(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentConfirmed) setTimeout(handlePayment, 3000);
  }, [paymentConfirmed]);

  return (
    <>
      {payWithOxxo && showCashOption && (
        <>
          <div>
            <input
              type="checkbox"
              id="checkbox"
              checked={payWithCash}
              onChange={checkHandler}
            />
            <label htmlFor="checkbox"> {t('flights.cashModal.pay-cash')}</label>
          </div>
          <br />
        </>
      )}
      {!confirmationOutside ? (
        <form
          data-testid="stripe-form"
          onSubmit={handleSubmit}
          className={`w-full min-h-[320px] ${className}`}
        >
          <PaymentElement className="min-h-[240px]" />

          {errorMessage ? (
            <span className="block w-full text-center text-[#f27474] text-base mt-[1rem] mb-[-1rem] ">
              {errorMessage}
            </span>
          ) : null}
          <div className="grid mt-9 gap-4 md:grid-cols-2">
            <button
              type="submit"
              disabled={loading || generatingTicket}
              className="bg-whiteLabelColor w-full h-[48px] rounded-3xl text-black md:text-white mx-auto text-base font-[760] disabled:cursor-not-allowed customTailwind"
            >
              {loading ? (
                <LoadingSpinner />
              ) : confirmButtonText ? (
                confirmButtonText
              ) : (
                t('payment.pay-now')
              )}
            </button>

            {cancelButton ? (
              <Link
                className="flex items-center justify-center bg-[black] border border-whiteLabelColor text-whiteLabelColor w-full h-[48px] rounded-3xl mx-auto text-base font-[760] disabled:cursor-not-allowed customTailwind"
                href={'/'}
              >
                {cancelButtonText
                  ? cancelButtonText
                  : t('common.cancel-simple')}
              </Link>
            ) : null}
          </div>
        </form>
      ) : (
        <form className={`w-full min-h-[160px] ${className}`}>
          <PaymentElement className="min-h-[160px]" />
          {errorMessage ? (
            <span className="block w-full text-center text-[#f27474] text-base mt-[1rem] mb-[-1rem] ">
              {errorMessage}
            </span>
          ) : null}
        </form>
      )}
    </>
  );
};

export default StripeForm;
