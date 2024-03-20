import React from 'react';
import Home from '.';
import type { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config.js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        ['common'],
        nextI18NextConfig
      )),
    },
  };
}

const SignUpNow: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    return <Home />;
  } else {
    router.push('/');
  }
  return <Home />;
};

export default SignUpNow;
