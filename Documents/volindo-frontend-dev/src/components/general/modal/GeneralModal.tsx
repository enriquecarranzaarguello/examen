import React from 'react';
import { Modal, LoadingSpinner } from '@components';
import { GeneralTextModalProps } from '@typing/proptypes';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';

const GeneralTextModal = ({
  open,
  onClose,
  title,
  text,
  loading,
  cb,
}: GeneralTextModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.container}>
        <h1 className={styles.container_title}>{title}</h1>
        <h2 className={styles.container_subtitle}>{text}</h2>
        <button onClick={cb} className={styles.container_button}>
          {loading ? <LoadingSpinner size="normal" /> : 'OK'}
        </button>
      </div>
    </Modal>
  );
};

export default GeneralTextModal;
