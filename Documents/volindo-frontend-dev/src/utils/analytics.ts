import * as Sentry from '@sentry/browser';

const EVENT_NAMES = {
  SIGN_UP: 'signed-up-test',
  LOGIN: 'signed-in',
};

export const resetAnalytics = () => {
  // window.analytics.reset();/
  Sentry.setUser(null);
};

export const trackUserIdentify = (agent_id: string, email: string) => {
  // window.analytics.identify(agent_id, { email });
  Sentry.setUser({ email: email, id: agent_id });

  window.dataLayer.push({
    event: 'signed-in',
    user: {
      email: email,
      id: agent_id,
      time: Date.now(),
    },
  });
};

export const trackPageView = (pageRoute: string) => {
  // window.analytics.page(pageRoute);
};

export const trackSignUp = (agent_id: string, email: string) => {
  window.dataLayer.push({
    event: EVENT_NAMES.LOGIN,
    user: {
      id: agent_id,
      email: email,
      time: Date.now(),
    },
  });
  Sentry.setUser({ email: email, id: agent_id });
};

export const trackLogin = (agent_id: string, email: string) => {
  // window.datalayer.push({
  //   event: EVENT_NAMES.SIGN_UP,
  //   user: {
  //     email,
  //     agent_id,
  //     time: Date.now(),
  //   },
  // });
  Sentry.setUser({ email: email, id: agent_id });
};
