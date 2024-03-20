import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import { Modal } from '@components';

import style from '@styles/modals/register-modal.module.scss';

import { useEffect } from 'react';

import { useAppDispatch } from '@context';

const RegistrateModal = ({ onClose, open }: any) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleRedirect = () => {
    router.push('/payment');
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className={style.register_container}>
        <div className={style.register_container_text}>
          <p className={style.register_container_text_title}>
            {t('agent.regModal.title')}
          </p>
          <p className={style.register_container_text_paragraph}>
            {t('agent.regModal.text')}
          </p>
        </div>

        <div className="md:flex w-full md:mt-[20px] md:mb-[10px]">
          <button
            className={style.register_container_button}
            onClick={handleRedirect}
          >
            {t('agent.regModal.button')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RegistrateModal;
