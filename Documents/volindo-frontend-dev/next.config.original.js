/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['api.tbotechnology.in'],
  },
  env: {
    NEXT_API: process.env.NEXT_API,
    SOCKET_API: process.env.SOCKET_API,
    BOOKING_API: process.env.BOOKING_API,
    DESTINATIONS_API: process.env.DESTINATIONS_API,
    TRANSACTIONFEE: process.env.TRANSACTIONFEE,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    COGNITO_REGION: process.env.COGNITO_REGION,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_APP_CLIENT_ID: process.env.COGNITO_APP_CLIENT_ID,
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
    COGNITO_SCOPE: process.env.COGNITO_SCOPE,
    COGNITO_REDIRECT_SIGN_IN: process.env.COGNITO_REDIRECT_SIGN_IN,
    COGNITO_REDIRECT_SIGN_OUT: process.env.COGNITO_REDIRECT_SIGN_OUT,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
    BASICCOLOR: process.env.BASICCOLOR,
    BASICCOLORLIGHT: process.env.BASICCOLORLIGHT,
    WHITELABELLOGO: process.env.WHITELABELLOGO,
    WHITELABELEMAIL: process.env.WHITELABELEMAIL,
    WHITELABELNAME: process.env.WHITELABELNAME,
  },
  server: {
    https: true,
  },
};

module.exports = nextConfig;
