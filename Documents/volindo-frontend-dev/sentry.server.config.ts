import config from '@config';

// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://ea13c6f179e746baad255698138fc2f8@o4504579223060480.ingest.sentry.io/4504806180913152',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  // environment: process.env.SENTRY_ENVIRONMENT,
  environment: config.SENTRY_ENVIRONMENT,
});
