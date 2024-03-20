import Link from 'next/link';
import styles from '@styles/marketing.module.scss';
import Image from 'next/image';
import PlusIcon from '@icons/marketingIcons/plus-white.svg';
import { useTranslation } from 'react-i18next';

const AddNewAdButton = () => {
  const { t } = useTranslation();
  return (
    <Link
      className={styles.secondActionTextButton}
      href="/marketing/manager/form"
    >
      <Image src={PlusIcon} alt="+" width={24} height={24} />
      <span>{t('marketing.adManager.add')}</span>
    </Link>
  );
};

export default AddNewAdButton;
