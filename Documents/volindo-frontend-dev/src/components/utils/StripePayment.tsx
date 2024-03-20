import React, { useEffect, useState } from 'react';
import {
  StripeElementLocale,
  StripeElementsOptions,
  loadStripe,
} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentProps } from '@typing/types';
import StripeForm from './StripeForm';
import { useRouter } from 'next/router';
import config from '@config';

const StripePayment = (props: StripePaymentProps) => {
  const [stripePromise, setStripePromise] = useState<any>();
  const router = useRouter();
  // @ts-ignore
  const stripeLocale: StripeElementLocale = router.locale || 'en';

  const defaultOptions: Pick<StripeElementsOptions, 'locale' | 'appearance'> = {
    locale: stripeLocale,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: process.env.BASICCOLOR,
        colorBackground: '#202020',
        colorText: '#D3D3D3',
        colorDanger: '#f27474',
      },
    },
  };

  const options: StripeElementsOptions = props.withoutClientSecret
    ? { ...defaultOptions, ...props.options }
    : { ...defaultOptions, ...{ clientSecret: props.clientSecret } };

  useEffect(() => {
    setStripePromise(loadStripe(config.stripe_publishable_key || ''));
  }, []);

  if (!stripePromise || !options) return null;

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeForm
        className={props.className}
        type={props.type}
        redirectUrl={props.redirectUrl}
        cancelButton={props.cancelButton}
        cancelButtonOnClick={props.cancelButtonOnClick}
        cancelButtonText={props.cancelButtonText}
        confirmButtonText={props.confirmButtonText}
        confirmationOutside={props.confirmationOutside}
        paymentConfirmed={props.paymentConfirmed}
        onChangeLoading={props.onChangeLoading}
        showCashOption={props.showCashOption}
        payWithCash={props.payWithCash}
        checkHandler={props.checkHandler}
      />
    </Elements>
  );
};

export default StripePayment;
