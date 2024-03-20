import { useRouter } from 'next/router';
import styles from '@styles/marketing.module.scss';
import { TalkAdvisorLink, AddNewAdButton } from '@components/marketing';

const MarketSecondAction = () => {
  const actualPage = useRouter().pathname.replace('/marketing', '');

  const renderSecondAction = (page: string) => {
    switch (page) {
      case '/branding':
        return <TalkAdvisorLink />;
      case '/course-flyway':
        return <TalkAdvisorLink />;
      case '/mix-pack':
        return <TalkAdvisorLink />;
      case '/manager':
        return null;
      // return <AddNewAdButton />; '
      default:
        return null;
    }
  };

  return (
    <div
      data-testid="marketing-bar-button"
      className={styles.linksBar__secondAction}
    >
      {renderSecondAction(actualPage)}
    </div>
  );
};

export default MarketSecondAction;
