import config from '@config';
// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const replaysOnError = config.SENTRY_ENVIRONMENT?.includes('production')
  ? 1.0
  : 0.0;
const replaysSession = config.SENTRY_ENVIRONMENT?.includes('production')
  ? 0.1
  : 0.0;

Sentry.init({
  dsn: 'https://ea13c6f179e746baad255698138fc2f8@o4504579223060480.ingest.sentry.io/4504806180913152',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: replaysOnError,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: replaysSession,
  // environment: process.env.SENTRY_ENVIRONMENT,
  environment: config.SENTRY_ENVIRONMENT,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    new Sentry.Replay({
      // Additional Replay configuration goes in here, for example:
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: false,
      networkCaptureBodies: true,
    }),
  ],
});
