import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

import EditIcon from '@icons/marketingIcons/editAd.svg';
import styles from '@styles/marketing.module.scss';
import { useAdFormStore } from './context/NewAdContext';

const TitleEditable = () => {
  const { t } = useTranslation();
  const [title, setStore] = useAdFormStore(store => store.title);
  const [edit, setEdit] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setEdit(true);
  };

  const handleFocusOut = () => {
    setEdit(false);
  };

  const onEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEdit(false);
    }
  };

  useEffect(() => {
    if (edit && refInput.current) {
      refInput.current?.focus();
    }
  }, [edit]);

  return (
    <>
      <div
        className={`${styles.title} ${styles.title__edit} ${
          edit ? '' : styles.none
        }`}
      >
        <input
          value={title}
          ref={refInput}
          autoFocus
          onChange={e => setStore({ title: e.target.value })}
          onBlur={handleFocusOut}
          onKeyDown={onEnter}
          maxLength={100}
        />
        <Image src={EditIcon} alt="Edit" width={24} height={24} />
      </div>
      <button
        className={`${styles.title} ${edit ? styles.none : ''}`}
        onClick={handleEdit}
      >
        <h1 data-testid="marketing-form-advertisement">
          {title ? title : t('marketing.adManager.new.title')}
        </h1>
        <Image src={EditIcon} alt="Edit" width={24} height={24} />
      </button>
    </>
  );
};

export default TitleEditable;
