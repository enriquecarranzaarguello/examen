import React, { useState, useEffect } from 'react';

import { NextPageWithLayout } from '@typing/types';
import { getLayout } from '@layouts/MarketingLayout';
import { SEO, Modal } from '@components';

import { unstable_getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';

import { getMarketingCampaing, cancelCampaignFunc } from '@utils/axiosClients';

import { useAppSelector } from '@context';

import styles from '@styles/marketing-crm.module.scss';

export const getServerSideProps = async ({
  locale,
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        ['common'],
        nextI18nextConfig
      )),
      session,
    },
  };
};

const AddManagerCrm: NextPageWithLayout = () => {
  const { t, i18n } = useTranslation('common');
  const { data: session } = useSession();

  const [availableCampaings, setAvailableCampaings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [cancelCampaign, setCancelCampaign] = useState(true);
  const [campaignId, setCampaignId] = useState('');
  const [modalTitle, setModalTitle] = useState(
    t('marketing.adManager.campaign.details')
  );
  const [showButton, setShowButton] = useState(false);

  const agentId = useAppSelector(state => state.agent.agent_id);

  const handleRes = ({ data }: any) => {
    setAvailableCampaings(data);
  };

  useEffect(() => {
    handleclick();
  }, []);

  const handleclick = () => {
    getMarketingCampaing(agentId)
      .then(res => handleRes(res))
      .catch(err => console.error(err));
  };

  const internalHeaderLinks = [
    'Name',
    'Social media',
    'Type',
    'Dates',
    'Finances',
    'Status',
  ];

  const getPlaceholder = (param: any) => {
    const obj: any = {
      title: 'Name',
      social: 'Social network',
      campaing: 'Type',
      dates: 'Dates',
      finances: 'Finances',
      views: 'Views',
      status: 'Status',
    };

    return obj[param];
  };

  const getColor = (status: string) => {
    const statusObj: any = {
      'Under Review': 'orange',
      Approved: 'yellow',
      Active: 'green',
      Completed: 'gray',
    };
    return statusObj[status];
  };

  const handleClickButton = (item: any) => {
    setOpenModal(true);

    setCampaignId(item.uuid);
  };

  const onClose = () => {
    setOpenModal(false);
    setCancelCampaign(false);
    setModalTitle(t('marketing.adManager.campaign.details'));
    setCancelCampaign(true);
    setShowButton(false);
  };

  const clickCancel = () => {
    setCancelCampaign(false);
    setModalTitle(t('marketing.adManager.campaign.cancel-q'));
    setShowButton(true);
  };

  const declineCancel = () => {
    setModalTitle(t('marketing.adManager.campaign.details'));
    setCancelCampaign(true);
    setShowButton(false);
    setOpenModal(false);
  };

  const acceptCancel = () => {
    cancelCampaignFunc(agentId, campaignId, session?.user?.id_token || '')
      .then(res => {
        setModalTitle(t('marketing.adManager.campaign.confirm-cancel'));
        setShowButton(false);
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <div>
        <Modal open={openModal} onClose={onClose}>
          <div className={styles.modal_content}>
            <p className={styles.modal_content_title}>{modalTitle}</p>

            {cancelCampaign && (
              <button
                className={styles.modal_content_cancel}
                onClick={clickCancel}
              >
                {t('marketing.adManager.campaign.cancel-button')}
              </button>
            )}

            {showButton && (
              <p className={styles.modal_content_options}>
                <button
                  onClick={acceptCancel}
                  className={styles.modal_content_options_yes}
                >
                  {t('common.yes')}
                </button>
                <button
                  onClick={declineCancel}
                  className={styles.modal_content_options_no}
                >
                  {t('common.no')}
                </button>
              </p>
            )}
          </div>
        </Modal>

        <SEO title={t('SEO.campaign')} />
        <div className={styles.container}>
          <div className={styles.container_header}>
            {internalHeaderLinks.map((item, index) => {
              return (
                <p key={index} className={styles.container_header_link}>
                  {item}
                </p>
              );
            })}
          </div>

          <div className={styles.container_list}>
            {availableCampaings.map((item: any, index: number) => {
              const color = getColor(item.status_ad);
              const { status_ad: status } = item;
              return (
                <>
                  <div
                    key={index}
                    className={styles.container_list_item}
                    onClick={() => handleClickButton(item)}
                  >
                    <p className={styles.container_list_item_content}>
                      <span
                        className={
                          styles.container_list_item_content_placeholder
                        }
                      >
                        {getPlaceholder('title')}
                      </span>
                      <span className={styles.container_list_item_content_text}>
                        {item?.title}
                      </span>
                    </p>
                    <p className={styles.container_list_item_content}>
                      <span
                        className={
                          styles.container_list_item_content_placeholder
                        }
                      >
                        {getPlaceholder('social')}
                      </span>
                      <span className={styles.container_list_item_content_text}>
                        {item?.social_network}
                      </span>
                    </p>
                    <p className={styles.container_list_item_content}>
                      <span
                        className={
                          styles.container_list_item_content_placeholder
                        }
                      >
                        {getPlaceholder('campaing')}
                      </span>
                      <span className={styles.container_list_item_content_text}>
                        {item?.campaign_type}
                      </span>
                    </p>
                    <p className={styles.container_list_item_content}>
                      <span
                        className={
                          styles.container_list_item_content_placeholder
                        }
                      >
                        {getPlaceholder('dates')}
                      </span>
                      <span className={styles.container_list_item_content_text}>
                        {item?.end_date} / {item?.start_date}
                      </span>
                    </p>
                    <p className={styles.container_list_item_content}>
                      <span
                        className={
                          styles.container_list_item_content_placeholder
                        }
                      >
                        {getPlaceholder('finances')}
                      </span>
                      <span className={styles.container_list_item_content_text}>
                        $ {item?.budget_total}
                      </span>
                    </p>
                    <p className={styles.container_list_item_content}>
                      <span
                        className={
                          styles.container_list_item_content_placeholder
                        }
                      >
                        {getPlaceholder('status')}
                      </span>
                      <span
                        className={styles.container_list_item_content_text}
                        style={{
                          color: color,
                        }}
                      >
                        {item?.status_ad}
                      </span>
                    </p>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

AddManagerCrm.getLayout = getLayout;

export default AddManagerCrm;
