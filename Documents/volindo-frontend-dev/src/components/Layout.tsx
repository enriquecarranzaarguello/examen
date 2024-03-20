import React from 'react';
import { Inter, Montserrat } from '@next/font/google';
import { Container, Content } from 'rsuite';

import type { LayoutProps } from '@typing/proptypes';

import { Header, Footer } from '@components';
// Todo check export and import to remove file
const inter = Inter({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const montserratFont = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export default function Layout({
  children,
  paddingBottom,
  paddingBottomSignup,
  noLogin = false,
}: LayoutProps) {
  return (
    <Container
      className={`h-screen px-[18px] cursor-default lg:px-[48px] scroll-smooth ${
        paddingBottom && 'lg:pb-[51px]'
      } ${paddingBottomSignup && 'md:pb-[51px]'}`}
    >
      <Header noLogin={noLogin} />
      <Content className={`${inter.className} h-full`}>{children}</Content>
      {/* <Footer /> */}
    </Container>
  );
}
