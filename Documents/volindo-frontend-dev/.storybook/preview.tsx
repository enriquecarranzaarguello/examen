import React from 'react';
import type { Preview } from '@storybook/react';
import i18n from './i18next';
import '../src/styles/globals.scss';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

const preview: Preview = {
  globals: {
    locale: 'en',
    locales: {
      en: 'English',
      es: 'Spanish',
    },
  },
  parameters: {
    i18n,
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      values: [{ name: 'black', value: '#000' }],
    },
  },
  decorators: [
    Story => (
      <main className={inter.className}>
        <Story />
      </main>
    ),
  ],
};

export default preview;
