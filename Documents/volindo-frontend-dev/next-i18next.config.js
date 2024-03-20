/* eslint-disable no-undef */
module.exports = {
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: `${process.env.DEFAULT_LANGUAGE}` || 'en',
  },
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/public/locales',
  ns: ['common'],
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
