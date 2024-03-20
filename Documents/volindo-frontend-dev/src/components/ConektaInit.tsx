import React, { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import configuration from '@config';
import { useRouter } from 'next/router';
import { ConektaProps } from '@typing/proptypes';

declare global {
  interface Window {
    ConektaCheckoutComponents: any;
  }
}

export default function Checkout({
  checkoutRequestId,
  service = '',
  redirectUrl = '',
}: ConektaProps) {
  let publicKey = configuration.conkecta_publishable_key || '';
  const router = useRouter();
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://assets.conekta.com/component/3.3.2/assets/component.min.js';
    script.type = 'module';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      initConekta(checkoutRequestId, publicKey);
    };

    document.body.appendChild(script);
    const container = document.getElementById('conektaIframeContainer');
    if (container) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            const extraHeight = 200;
            container.style.height = `${
              container.offsetHeight + extraHeight
            }px`;
          }
        });
      });

      observer.observe(container, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      return () => {
        document.body.removeChild(script);
        observer.disconnect();
      };
    } else {
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const initConekta = async (checkoutRequestId: string, publicKey: string) => {
    if (window.ConektaCheckoutComponents) {
      const config = {
        targetIFrame: 'conektaIframeContainer',
        checkoutRequestId,
        publicKey,
        locale: 'es',
      };
      const callbacks = {
        onFinalizePayment: (event: any) => {
          if (event?.charge?.paymentMethod?.type !== 'bankTransfer') {
            router.push(
              redirectUrl || `${window.location.href}?success=confirmation`
            );
          }
        },
        onErrorPayment: (event: any) => {
          Sentry.captureException(
            `Error on Conekta payment. ${event}. Checkout Id: ${checkoutRequestId}`
          );
        },
        onGetInfoSuccess: (event: any) => console.log(event),
      };

      const options = {
        theme: 'dark', // 'dark' | 'default' | 'green' | 'red'
      };

      await window.ConektaCheckoutComponents.Integration({
        config,
        options,
        callbacks,
      });
    } else {
      console.error('Conekta script not loaded');
      Sentry.captureException(
        `Conekta script not loaded. Checkout ID ${checkoutRequestId}`
      );
    }
  };

  return (
    <div
      data-testid="conekta-form"
      id="conektaIframeContainer"
      className="w-full h-auto mx-auto"
    ></div>
  );
}
