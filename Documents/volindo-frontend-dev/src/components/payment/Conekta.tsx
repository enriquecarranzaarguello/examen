import React, { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

interface CheckoutProps {
  checkoutRequestId: string;
  publicKey: string;
}
declare global {
  interface Window {
    ConektaCheckoutComponents: any;
  }
}

const Checkout: React.FC<CheckoutProps> = ({
  checkoutRequestId,
  publicKey,
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://assets.conekta.com/component/3.3.2/assets/component.min.js';
    script.type = 'module';
    script.crossOrigin = 'anonymous';
    script.onload = initConekta; // Initialize Conekta after the script is loaded
    document.body.appendChild(script);

    // Cleanup the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initConekta = () => {
    if (window.ConektaCheckoutComponents) {
      const config = {
        targetIFrame: 'conektaIframeContainer',
        checkoutRequestId,
        publicKey,
        locale: 'es',
      };
      const callbacks = {
        onFinalizePayment: (event: any) => console.log(event),
        onErrorPayment: (event: any) => console.log(event),
        onGetInfoSuccess: (event: any) => console.log(event),
      };

      window.ConektaCheckoutComponents.Integration({ config, callbacks });

      // Add any event listeners or additional configuration
    } else {
      console.error('Conekta script not loaded');
      Sentry.captureException(
        `Conekta script not loaded. Checkout ID ${checkoutRequestId}`
      );
    }
  };

  return (
    <div
      id="conektaIframeContainer"
      style={{ height: '700px', margin: '0 auto' }}
    ></div>
  );
};

export default Checkout;
