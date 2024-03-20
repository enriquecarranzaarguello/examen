import React, { useEffect } from 'react';
import Image from 'next/image';

import type { ModalProps } from '@typing/proptypes';
import styles from '@styles/hotels/modals/modal.module.scss';

import IconCloseGray from '@icons/close-gray.svg';

export default function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      // Restore the body's style when the component is unmounted.
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    if (target.id === 'wrapper') onClose();
  };

  if (!open) return null;
  return (
    <div
      data-testid="general-modal"
      id="wrapper"
      className={styles.container}
      onClick={handleClose}
    >
      <div className={styles.container_card}>
        <div className={styles.container_card_close}>
          <button
            data-testid="general-modal-close"
            // className="absolute top-[-15px] right-[-15px]"
            className={styles.container_card_close_button}
            onClick={onClose}
          >
            <Image width={42} height={42} alt="icon" src={IconCloseGray} />
          </button>
        </div>

        <div className={styles.container_card_content}>{children}</div>
      </div>
    </div>
  );
}
