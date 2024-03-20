import React from 'react';
import style from '@styles/crm/header.module.scss';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const HeaderCRM = ({
  active,
}: {
  active: 'Reservations' | 'Travelers' | 'Suppliers';
}) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  //TODO Pass all to sass
  return (
    <div className={style.header_container}>
      <div className={style.header_container_card}>
        <button
          className={`${style.header_container_card_button}${
            active === 'Reservations' ? ` bg-[#323232] rounded-xl` : ''
          }`}
          onClick={() =>
            router.push('/reservations', '/reservations', {
              locale: i18n.language,
            })
          }
        >
          {t('reservations.title')}
        </button>

        <button
          className={`${style.header_container_card_button}${
            active === 'Travelers' ? ` bg-[#323232] rounded-xl` : ''
          }`}
          onClick={() =>
            router.push('/travelers', '/travelers', {
              locale: i18n.language,
            })
          }
        >
          {t('travelers.title')}
        </button>

        <button
          onClick={() =>
            router.push('/suppliers', '/suppliers', {
              locale: i18n.language,
            })
          }
          className={`${style.header_container_card_button}${
            active === 'Suppliers' ? ` bg-[#323232] rounded-xl` : ''
          }`}
        >
          {t('suppliers.title')}
        </button>
      </div>
    </div>
  );
};

export default HeaderCRM;
