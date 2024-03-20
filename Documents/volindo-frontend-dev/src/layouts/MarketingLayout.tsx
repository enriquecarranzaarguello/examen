import type { ReactNode } from 'react';
import { getLayout as getMainLayout } from '@layouts/MainLayout';
import styles from '@styles/marketing.module.scss';
import { MarketLinksBar, MarketSecondAction } from '@components/marketing';
import { useTranslation } from 'react-i18next';

const MarketingLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.layout}>
      <h1 className={styles.mainTitle} data-testid="marketing-title">
        {t('home.marketing-studio')}
      </h1>
      <div className={styles.linksBar__container}>
        <MarketLinksBar />
        <MarketSecondAction />
      </div>
      {children}
    </div>
  );
};

export const getLayout = (page: ReactNode) =>
  getMainLayout(<MarketingLayout>{page}</MarketingLayout>);

export default MarketingLayout;
