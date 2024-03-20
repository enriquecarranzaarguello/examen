import Image from 'next/image';
import { Modal } from '@components';
import styles from '@styles/hotels/modals/confirmation.module.scss';

//Icons
import copyPurple from '@icons/copy.svg';
import copyBlue from '@icons/copy-blue.svg';

import config from '@config';
import { usePrice } from '@components/utils/Price/Price';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

interface ModalConfirmationProposalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  bookingId: string;
  agentId: string;
  type: 'button' | 'link';
  cb: () => void;
  origin?: string;
}

const ModalProposalConfirmation = ({
  open,
  onClose,
  title,
  description,
  bookingId,
  agentId,
  type,
  cb,
  origin,
}: ModalConfirmationProposalProps) => {
  const { t } = useTranslation();
  const checkWL = config.WHITELABELNAME === 'Volindo';
  const price = usePrice();
  const link =
    origin === 'suppliers'
      ? `${window.location.origin}/suppliers/proposal/${bookingId}--${agentId}?selectedCurrency=${price.countryCode}`
      : `${window.location.origin}/proposal/${bookingId}--${agentId}?selectedCurrency=${price.countryCode}`;

  const copyIcon = checkWL ? copyPurple : copyBlue;

  const handleLinkProposal = () => {
    window.open(link, '_blank');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <h2 className={styles.modal_title}>{title}</h2>
        <p className={styles.modal_description}>{description}</p>
        {type === 'button' ? (
          <button onClick={cb} className={styles.modal_button}>
            {t('stays.got-it')}
          </button>
        ) : (
          <div className={styles.modal_container}>
            <p className={styles.modal_container_text}>{link}</p>
            <div className={styles.modal_container_buttons}>
              <Image
                src={copyIcon}
                alt="Copy Icon"
                width={20}
                height={20}
                className={styles.modal_container_buttons_copyIcon}
                onClick={() => navigator.clipboard.writeText(link)}
              />
              <button
                className={styles.modal_container_buttons_action}
                onClick={handleLinkProposal}
              >
                GO
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalProposalConfirmation;
