import React from 'react';
import { Modal } from '@components';

import style from '@styles/modals/service-modal.module.scss';

const PersonalizedModal = ({ open, onClose, title, text }: any) => {
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className={style.personalizedContainer}>
          <h1 className={style.personalizedContainer_title}>{title}</h1>
          <div>{text}</div>
        </div>
      </Modal>
    </>
  );
};

export default PersonalizedModal;
