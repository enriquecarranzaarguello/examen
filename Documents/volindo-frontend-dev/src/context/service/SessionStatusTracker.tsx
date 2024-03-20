import { signOut, useSession } from 'next-auth/react';
import config from '@config';
import { ReactNode, useEffect, useState } from 'react';
import { ProfileType } from '@typing/types';
import { DecodedIdToken } from '@typing/analytics';
import jwtDecode from 'jwt-decode';
import { useAppDispatch } from '../app/hooks';
import {
  setIdentifiers,
  setInitialStateAgent,
  setProfile,
} from '../slices/agentSlice';
import AgentService from '@services/AgentService';
import { resetAnalytics } from '@utils/analytics';
import { useRouter } from 'next/router';
import {
  setValidSubscription,
  useAppSelector,
  getCurrencyResponse,
  resetFlightState,
} from '@context';

import { parseISO, isBefore } from 'date-fns';
import { useDevCycleClient } from '@devcycle/react-client-sdk';

const SessionStatusTracker = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [initialLoadedSession, setInitialLoadedSession] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const clientDevCycle = useDevCycleClient();

  const envName = config.WHITELABELNAME;

  const exchangeCurrencyCode = useAppSelector(
    state => state.general.currency.selectedCurrency
  );

  const selectedCurrency = router.query.selectedCurrency;

  const devCycleIdentifyUser = (
    agent_id: string = 'no_user',
    email: string = 'no_user'
  ) => {
    const newUser: any = {
      user_id: agent_id,
      email: email,
      customData: {
        'white-label': envName,
      },
    };

    clientDevCycle
      .identifyUser(newUser)
      .then(res => console.log('Updated Variables'));
  };

  const loadAgentInfo = async (agent_id: string, email: string) => {
    try {
      // * SETTING ON STORE IDENTIFIERS AND PROFILE
      dispatch(setIdentifiers({ agent_id, email }));
      const resProfile = await AgentService.getAgentProfile(agent_id);
      if (!resProfile.status && resProfile !== 'ERR_NETWORK') {
        //If everything is fine, update the profile, if not, keep the store profile
        const newProfile: ProfileType = {
          full_name: resProfile.full_name_account || '',
          photo: resProfile.photo || '',
          address: resProfile.address_full || '',
          city: resProfile.address_city || '',
          state_province: resProfile.address_state_province || '',
          country: resProfile.address_country || '',
          zip_code: resProfile.address_zip_code || '',
          phone_country_code: resProfile.phone_country_code || '',
          phone_number: resProfile.phone_number || '',
          birthday: resProfile.birthday || '',
          web_site: resProfile.web_site || '',
          url_facebook: resProfile.url_facebook || '',
          url_instagram: resProfile.url_instagram || '',
          url_whatsapp: resProfile.url_whatsapp || '',
          languages: resProfile.languages || [],
          area_specialize: resProfile.area_specialize || [],
          type_specialize: resProfile.type_specialize || [],
          description: resProfile.description || '',
        };
        dispatch(setProfile(newProfile));
        window.heap.identify(agent_id);
        window.heap.addUserProperties({
          name: resProfile.full_name_account,
          userId: agent_id,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cleanBrowser = () => {
    dispatch(setInitialStateAgent());
    dispatch(resetFlightState());
    resetAnalytics();
    // Clean cookies
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    // Clean localStorage except persist:root
    const persistRootValue = localStorage.getItem('persist:root');
    localStorage.clear();
    localStorage.setItem('persist:root', persistRootValue || '');
  };

  const isValidSub = () => {
    dispatch(setValidSubscription(true));
  };

  const isNotValidSub = () => {
    dispatch(setValidSubscription(false));
  };

  const isBeforeAsNow = (isoDateString: any) => {
    const isoDate = parseISO(isoDateString);
    const now = new Date();
    return isBefore(isoDate, now);
  };

  const checkSubscription = (token: string) => {
    const decodedToken: DecodedIdToken = jwtDecode(token);
    const isoString = decodedToken['custom:date'];
    const result = isBeforeAsNow(isoString);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    result ? isNotValidSub() : isValidSub();
  };

  const firstCurrency = () => {
    const codeCountryCurrencies = [selectedCurrency, exchangeCurrencyCode];
    const firstCode = codeCountryCurrencies.find(currency => !!currency);
    return String(firstCode || '');
  };

  useEffect(() => {
    try {
      if (status === 'loading') return;

      if (status === 'authenticated') {
        dispatch(getCurrencyResponse(firstCurrency()) as any);
        devCycleIdentifyUser(session.user.agent_id, session.user.email);
        checkSubscription(session.user.id_token);
        if (!initialLoadedSession) {
          setInitialLoadedSession(true);
          return;
        }
        // Load agent info only on SignIn
        loadAgentInfo(session.user.agent_id, session.user.email);
      } else {
        dispatch(
          getCurrencyResponse(
            !!selectedCurrency ? selectedCurrency.toString() : ''
          ) as any
        );
        // DevCycle Init
        devCycleIdentifyUser();
        // Clean Browser
        if (initialLoadedSession) {
          // Redirect if needed
          if (router.pathname === '/') router.reload();
          else router.replace('/');
        }
        setInitialLoadedSession(true);
        cleanBrowser();
      }
    } catch (ex) {
      console.error(ex);
      cleanBrowser();
      signOut({ redirect: false });
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user.expired) {
      signOut({ redirect: false });
    }
  }, [router, status]);

  // ? This is commented to fix later the social login
  //SignIn with Socials:
  // useEffect(() => {
  //   const unsubscribe = Hub.listen('auth', ({ payload: { event, data } }) => {
  //     if (event === 'cognitoHostedUI') {
  //       signInWithNext();
  //     }
  //   });

  //   signInWithNext();

  //   return unsubscribe;
  // }, []);

  // const signInWithNext = async (): Promise<void> => {
  //   try {
  //     const currentUser: CognitoUser = await Auth.currentAuthenticatedUser();

  //     if (currentUser) {
  //       dispatch(setLoading(true));
  //       const userSession = currentUser?.getSignInUserSession();
  //       const idToken = userSession?.getIdToken()?.getJwtToken() || '';
  //       const refreshToken = userSession?.getRefreshToken()?.getToken();

  //       const response = await signIn('credentials', {
  //         id_token: idToken,
  //         refresh_token: refreshToken,
  //         redirect: false,
  //       });

  //       // Decode the token
  //       const decodedToken: DecodedIdToken = jwtDecode(idToken);
  //       const userId = decodedToken.sub;
  //       const email = decodedToken.email;

  //       trackUserIdentify(userId, email);
  //       trackLogin(userId, email);

  //       dispatch(setLoading(false));

  //       if (!response?.ok) {
  //         // Handle unauthorized flow
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     console.log('Not signed in');
  //   }
  // };

  return <>{children}</>;
};

export default SessionStatusTracker;
