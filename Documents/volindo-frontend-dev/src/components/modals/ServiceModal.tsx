import React from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { Modal, VerticalSelector, HotelSearch } from '@components';
import { FlightsSearchContainer } from '@containers';

import style from '@styles/modals/service-modal.module.scss';

// TODO naming conventions think
const ServiceModal = ({ open, onClose, serviceType }: any) => {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();

  const handleChangeTab = (tab: string) => {
    if (!session) {
      redirectToSignUp();
      return;
    }
    if (tab === 'Suppliers') {
      router.push('/suppliers');
      return;
    }
  };

  const redirectToSignUp = () => {
    router.push('/signin');
  };

  const triggerHandleTab = (tab: string) => {
    handleChangeTab(tab);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className={style.container}>
          <h1 className={style.container_title}> Add Service </h1>
          <VerticalSelector
            triggerHandle={triggerHandleTab}
            origin={'modal'}
            serviceType={serviceType}
          />
          {/* <VerticalSelector /> */}
          {serviceType === 'flights' ? (
            <FlightsSearchContainer
              redirect={true}
              className={''}
              isPurple={true}
            />
          ) : (
            <HotelSearch hotelData={''} searchType="" hotelId="" />
          )}
        </div>
      </Modal>
    </>
  );
};

export default ServiceModal;
