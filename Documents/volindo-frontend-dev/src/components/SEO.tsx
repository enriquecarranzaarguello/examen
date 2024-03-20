/* eslint-disable @next/next/no-sync-scripts */
import React from 'react';
import Head from 'next/head';
import config from '@config';

import type { SEOProps } from '@typing/proptypes';

import flywayFavicon from '@icons/faviconFlyway.ico';
import volindoFavicon from '@icons/favicon.ico';
import { StaticImageData } from 'next/image';
import ConektaInit from './ConektaInit';

export default function SEO({ title, description = '' }: SEOProps) {
  const getIcon = (
    param: any,
    iconMap: Record<string, StaticImageData>
  ): string => {
    return iconMap[param]?.src || '';
  };

  const faviconMap = {
    Flywaytoday: flywayFavicon,
    Volindo: volindoFavicon,
  };

  const icon = getIcon(config.WHITELABELNAME, faviconMap);

  return (
    <Head>
      <title>{`${title} | ${config.WHITELABELNAME}`}</title>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <link rel="icon" href={icon} />
    </Head>
  );
}
