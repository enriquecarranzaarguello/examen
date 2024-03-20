import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useAppSelector } from '../app/hooks';
import { trackPageView, trackUserIdentify } from '@utils/analytics';

const AnalyticsTrack = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { email, agent_id } = useAppSelector(state => state.agent);

  useEffect(() => {
    // Identify user on initial load
    if (email && agent_id) {
      trackUserIdentify(agent_id, email);
    }
  }, []);

  useEffect(() => {
    // Track page when changes
    trackPageView(router.route);
  }, [router.route]);

  return <>{children}</>;
};

export default AnalyticsTrack;
