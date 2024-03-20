import React, { useEffect } from 'react';

import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { appWithTranslation } from 'next-i18next';
import nextI18nextConfig from 'next-i18next.config';
import { store, persistor } from '../context/app/store';
import { ServiceContext } from '@context';

import { PersistGate } from 'redux-persist/integration/react';

import { AppPropsWithLayout } from '@typing/types';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'rsuite/dist/rsuite.min.css';
import '../styles/globals.scss';
import Script from 'next/script';

import { Amplify } from 'aws-amplify';

import awsmobile from '../aws-exports';
import AnalyticsTrack from 'src/context/service/AnalyticsTrack';
import SessionStatusTracker from 'src/context/service/SessionStatusTracker';

import { withDevCycleProvider } from '@devcycle/react-client-sdk';

import config from '@config';

Amplify.configure(awsmobile);

const App = ({ Component, pageProps }: AppPropsWithLayout | any) => {
  const router = useRouter();

  const getLayout = Component.getLayout ?? ((page: any) => page);

  useEffect(() => {
    // Define a function to call heap.track on route change
    const handleRouteChange = (url: string) => {
      if (window.heap) {
        window.heap.track('Page View', { path: url });
      }
    };

    // on route change
    router.events.on('routeChangeComplete', handleRouteChange);

    // on cleanup
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=AW-11301135678" />

      <Script id="google-analytics">
        {`  
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-11301135678');
        `}
      </Script>

      <Script id="pixel-facebook">
        {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '3344520215825236');
          fbq('track', 'PageView');
          `}
      </Script>

      <noscript>
        {/* TODO: img to Image */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=3344520215825236&ev=PageView&noscript=1"
        />
      </noscript>

      <SessionProvider session={pageProps.session}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ServiceContext>
              <SessionStatusTracker>
                <AnalyticsTrack>
                  {getLayout(<Component {...pageProps} />)}
                </AnalyticsTrack>
              </SessionStatusTracker>
            </ServiceContext>
          </PersistGate>
        </Provider>
      </SessionProvider>
    </>
  );
};

const appTester = appWithTranslation(App, nextI18nextConfig);

// wrap your root component with the withDevCycleProvider higher-order component to initialize DevCycle SDK
export default withDevCycleProvider({
  sdkKey: `${config.DEV_CYCLE_KEY}`,
  user: {
    user_id: 'USER_ID',
    isAnonymous: false,
  },
})(appTester);
