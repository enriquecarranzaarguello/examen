import React from 'react';
import { useRouter } from 'next/router';
import { setLoading, useAppDispatch, useAppSelector } from '@context';

import type { ServiceProviderProps } from '@typing/proptypes';
export default function ServiceProvider({ children }: ServiceProviderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loading = useAppSelector(state => state.general.loading);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const volindoanimate = require('@images/animate/volindoanimate.mp4');

  React.useEffect(() => {
    const changeStart = () => {
      dispatch(setLoading(true));
    };

    const changeComplete = () => {
      dispatch(setLoading(false));
    };

    router.events.on('routeChangeStart', changeStart);
    router.events.on('routeChangeComplete', changeComplete);

    return () => {
      router.events.off('routeChangeStart', changeStart);
      router.events.off('routeChangeComplete', changeComplete);
    };
  }, [router]);

  return (
    <>
      {loading /* router.pathname === "/" || */ &&
      (router.pathname.startsWith('/booking/') ||
        router.pathname.startsWith('/booking/stay') ||
        router.pathname.startsWith('/booking/stay/room')) ? (
        <div
          style={
            {
              // backgroundColor: 'black',
              // height: '100vh',
              // width: '100vw',
              // position: 'fixed',
              // top: 0,
              // left: 0,
              // zIndex: '999999',
            }
          }
        >
          {/* <video
            autoPlay
            loop
            muted
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              zIndex: 9999,
            }}
          >
            <source src={volindoanimate} type="video/mp4" />
          </video> */}
        </div>
      ) : null}
      {children}
    </>
  );
}
