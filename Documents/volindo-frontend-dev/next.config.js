/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');

// reactStrictMode: true,
const nextConfig = {
  i18n,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [
      'api.tbotechnology.in',
      'res.cloudinary.com',
      's3.us-west-2.amazonaws.com',
      'www.tboholidays.com',
      'i.vimeocdn.com',
      's3.amazonaws.com',
      'volindo-travelers-images.s3.amazonaws.com',
      'flyway-prod-travelers-images.s3.amazonaws.com',
      'flywaytoday-dev-suppliers-wl.s3.amazonaws.com',
      'flywaytoday-prod-suppliers-wl.s3.amazonaws.com',
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(mov|mp4)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]',
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          esModule: false,
        },
      },
    });

    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        // react: {
        //   name: 'commons',
        //   chunks: 'all',
        //   test: /[\\/]node_modules[\\/](react|react-dom|scheduler|use-subscription)[\\/]/,
        // },
        // svgAssets: {
        //   test: /\.svg$/,
        //   name: 'commonSvgs',
        //   chunks: 'all',
        //   priority: 1,
        //   enforce: true,
        // },
        googleMapsVendor: {
          test: /[\\/]node_modules[\\/](@react-google-maps)[\\/]/,
          name: 'googleMapsVendor',
        },
        // datesVendor: {
        //   test: /[\\/]node_modules[\\/](react-dates|react-datepicker|)[\\/]/,
        //   name: 'datesVendor',
        // }
      };
    }

    return config;
  },
  env: {
    BASE_API: process.env.BASE_API,
    BASE_DASHBOARD: process.env.BASE_DASHBOARD,
    SOCKET_API: process.env.SOCKET_API,
    BOOKING_API: process.env.BASE_API,
    WALLET_API: process.env.WALLET_API,
    TRANSACTIONFEE: process.env.TRANSACTIONFEE,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    COGNITO_REGION: process.env.COGNITO_REGION,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_APP_CLIENT_ID: process.env.COGNITO_APP_CLIENT_ID,
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
    COGNITO_SCOPE: process.env.COGNITO_SCOPE,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    SECOND_API: process.env.SECOND_API,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    CONEKTA_PUBLISHABLE_KEY: process.env.CONEKTA_PUBLISHABLE_KEY,
    BASICCOLOR: process.env.BASICCOLOR,
    BASICCOLORLIGHT: process.env.BASICCOLORLIGHT,
    WHITELABELEMAIL: process.env.WHITELABELEMAIL,
    WHITELABELNAME: process.env.WHITELABELNAME,
    WHITELABELNATIONALITY: process.env.WHITELABELNATIONALITY,
    WHITELABELPACKAGES: process.env.WHITELABELPACKAGES,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
    ENVIRONMENT: process.env.ENVIRONMENT,
    GA4_TRACKING_ID: process.env.GA4_TRACKING_ID,
    DEV_CYCLE_KEY: process.env.DEV_CYCLE_KEY,
    GTM_ENVIRONMENT: process.env.GTM_ENVIRONMENT,
    SERVER_URL: process.env.SERVER_URL,
    USER_EMAIL: process.env.USER_EMAIL,
    USER_PASSWORD: process.env.USER_PASSWORD,
    MERCADO_PAGO_PUBLIC_KEY: process.env.MERCADO_PAGO_PUBLIC_KEY,
    MERCADO_PAGO_PUBLIC_KEY_SUBSCRIPTIONS:
      process.env.MERCADO_PAGO_PUBLIC_KEY_SUBSCRIPTIONS,
    HEAP_ANALYTICS: process.env.HEAP_ANALYTICS,
  },
  async headers() {
    return [
      {
        source: '/(.*)\\.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

// Next.js Bundle Analyzer

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(module.exports, {});

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
    // Suppresses source map uploading logs during build
    silent: true,
    org: 'volindo-as',
    project: 'volindo-webapp',
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
