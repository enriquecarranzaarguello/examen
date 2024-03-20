import { FC, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from '@styles/marketing.module.scss';
import IconCloseBlack from '@icons/close-black.svg';
import config from '@config';

type TitleModalType = FC<{ children: string }>;
type ParagraphModalType = FC<{ children: ReactNode }>;
type ButtonModalType = FC<{
  children: string;
  onClick: () => void;
  disabled?: boolean;
}>;
type ContentModalType = FC<{ children: ReactNode; className?: string }>;

type MarketModalType = FC<{
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  noClose?: boolean;
}> & {
  Title: TitleModalType;
  Content: ContentModalType;
  Paragraph: ParagraphModalType;
  Button: ButtonModalType;
};

const MarketModal: MarketModalType = ({
  open = false,
  onClose,
  children,
  className = '',
  noClose = false,
}) => {
  useEffect(() => {
    if (!noClose) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.keyCode === 27) {
          onClose();
        }
      };

      if (open) {
        document.addEventListener('keydown', handleKeyDown);
      }
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [open, onClose, noClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.modal__background}>
      <div className={`${styles.modal} ${className}`}>
        {noClose ? null : (
          <button className={styles.modal__exit} onClick={onClose}>
            <Image alt="icon" src={IconCloseBlack} />
          </button>
        )}
        <div className={styles.modal__main}>{children}</div>
      </div>
    </div>,
    document.getElementById('mainLayout') || document.body
  );
};

const Title: TitleModalType = ({ children }) => {
  return <span className={styles.modal__title}>{children}</span>;
};

const Paragraph: ParagraphModalType = ({ children }) => (
  <p className={styles.modal__paragraph}>{children}</p>
);

const Button: ButtonModalType = ({ children, onClick, disabled = false }) => (
  <button
    className={`${
      config.WHITELABELNAME === 'Volindo'
        ? styles.modal__button
        : styles.modal__buttonWL
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    <span>{children}</span>
  </button>
);

const Content: ContentModalType = ({ children, className = '' }) => (
  <div className={`${styles.modal__content} ${className}`}>{children}</div>
);

MarketModal.Button = Button;
MarketModal.Content = Content;
MarketModal.Paragraph = Paragraph;
MarketModal.Title = Title;

export default MarketModal;
