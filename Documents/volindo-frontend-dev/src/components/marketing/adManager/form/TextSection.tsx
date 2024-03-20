import { useTranslation } from 'react-i18next';
import styles from '@styles/marketing.module.scss';
import { useAdFormStore } from '@components/marketing/adManager/context/NewAdContext';
import { TextArea } from '@components';

const TextSection = ({ selected }: any) => {
  const { t } = useTranslation();
  const [adText, setStore] = useAdFormStore(store => store.adText);

  return (
    <>
      <TextArea
        className={styles.textAreaAd}
        placeholder={
          selected
            ? t('marketing.adManager.new.letWLhandle').replace('or', '') || ''
            : t('marketing.adManager.new.textP') || ''
        }
        maxLength={1500}
        value={adText}
        onChange={e => setStore({ adText: e.target.value })}
        disabled={selected}
      />
    </>
  );
};

export default TextSection;
