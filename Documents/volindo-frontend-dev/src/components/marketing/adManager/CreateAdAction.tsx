import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdFormStore } from './context/NewAdContext';
import MarketModal from '../MarketModal';
import { useState } from 'react';
import { LoadingSpinner } from '@components/profile/atoms';
import axios from 'axios';
import { useRouter } from 'next/router';
import MarketingService from '@services/MarketingService';
import { useSession } from 'next-auth/react';
import config from '@config';

import { MarketingPaymentModal } from '@components';

import { marketingCampSkipPayment } from '@utils/axiosClients';

import {
  setCouponCode,
  useAppDispatch,
  useAppSelector,
  setMarketingTotalRedo,
} from '@context';

import styles from '@styles/marketing.module.scss';

const CreateAdAction = () => {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const { replace } = useRouter();
  const dispatch = useAppDispatch();

  const [form] = useAdFormStore(store => store);

  const marketingState = useAppSelector(state => state.marketing);

  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalText, setModalText] = useState('');
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmPay, setConfirmPay] = useState(false);

  const [campain_uuid, setCampain_uuid] = useState<string>('');
  const [agent_id, setAgentId] = useState<string>('');

  //Total final price
  const [budget] = useAdFormStore(store => store.budget);
  const [days] = useAdFormStore(store => store.days);

  const [subtotal, setSubtotal] = useState(budget * days);
  const [fee, setFee] = useState(Math.round(subtotal * 0.04));
  const [total, setTotal] = useState(subtotal + fee);

  useEffect(() => {
    const subtotal = budget * days;
    const fee = Math.round(subtotal * 0.04);
    setSubtotal(subtotal);
    setFee(fee);
    setTotal(subtotal + fee);
    // new total
    dispatch(setMarketingTotalRedo(subtotal));
  }, [budget, days]);

  const isInvalidData = () => {
    const { socialNetwork, days, startTime, endTime } = form;
    if (!socialNetwork) {
      setModalText(t('marketing.adManager.new.valid.social') || '');
      return true;
    }

    if (!days) {
      setModalText(t('marketing.adManager.new.valid.days') || '');
      return true;
    }

    if (!startTime || !endTime) {
      setModalText(t('marketing.adManager.new.valid.time') || '');
      return true;
    }
    return false;
  };

  const calculateBudget = (budget: number, percentage: number) => {
    const result = form.budget * (percentage / 100);
    return result;
  };

  const submitForm = () => {
    const title = form.title ? form.title : t('marketing.adManager.new.title');
    setModalText(t('marketing.adManager.new.uploadInfo') || '');

    form.coupon_name = marketingState.couponCode.code;
    form.coupon_budget = calculateBudget(
      marketingState.couponCode.budget,
      marketingState.couponCode.percent
    );

    form.percentage = marketingState.couponCode.percent;

    MarketingService.createAd(session?.user.id_token || '', form, title)
      .then(({ data }) => {
        const urls: string[] = data.presigned_urls;

        if (urls) {
          uploadFiles(urls, data.campaign_uuid, data.agent_id);
        } else {
          setOpenModal(false);
          setCampain_uuid(data.campaign_uuid);
          setAgentId(data.agent_id);
          setOpen(true);
          dispatch(
            setCouponCode({
              code: '',
              budget: 0,
              percent: 0,
            })
          );
        }
      })

      .catch(err => {
        console.error(err);
        setError(true);
        setModalTitle(t('marketing.branding.payment.errorTitle') || '');
        setModalText(t('marketing.adManager.new.error') || '');
      });
  };

  const uploadFiles = async (
    urls: string[],
    campaign_uuid: string,
    agent_id: string
  ) => {
    setAgentId(agent_id);
    setCampain_uuid(campaign_uuid);

    let uploadedFiles = 0;

    for (let i = 0; i < urls.length; i++) {
      setModalText(
        `${t('marketing.adManager.new.uploadFiles')} ${i + 1}/${urls.length}...`
      );

      const file = form.uploadFiles[i];
      try {
        const response = await axios.put(urls[i], file, {
          headers: {
            'Content-Type': file.type,
          },
        });
        if (response.status === 200) uploadedFiles++;
      } catch (error) {
        console.error('Error On Upload Image:', error);
      }
    }

    if (uploadedFiles !== urls.length) {
      console.error(`Uploaded ${uploadFiles} files of ${urls.length}`);
      setError(true);
      setModalTitle(t('marketing.branding.payment.errorTitle') || '');
      setModalText(t('marketing.adManager.new.error') || '');
    } else {
      setOpenModal(false);
      setOpen(true);
    }
    dispatch(
      setCouponCode({
        code: '',
        budget: 0,
        percent: 0,
      })
    );
  };

  const handleClick = () => {
    const isInvalid = isInvalidData();
    setError(isInvalid);
    setOpenModal(true);

    if (isInvalid) {
      setModalTitle(t('marketing.adManager.new.valid.errorT') || '');
    } else {
      setModalTitle(t('marketing.adManager.new.creating') || '');
      submitForm();
    }
  };

  const checkLoadingStyleWL =
    config.WHITELABELNAME === 'Volindo'
      ? styles.branding__modalPayment__loading__icon
      : '';

  const onClose = () => {
    setOpen(false);
  };

  const handleSkipPay = () => {
    marketingCampSkipPayment(agent_id, campain_uuid)
      .then(res => {
        replace('/marketing/manager/thanks');
      })

      .catch(err => {
        console.error(err, 'SKIP PAYMENT ERROR');
        // replace('/marketing/manager/thanks');
      });
  };

  return (
    <>
      <button className={styles.test} onClick={handleClick}>
        <span>{t('marketing.adManager.new.create')}</span>
      </button>
      {open && (
        <MarketingPaymentModal
          onClose={onClose}
          open={open}
          confirmPay={confirmPay}
          setConfirmPay={setConfirmPay}
          handleSkipPay={handleSkipPay}
          campaignUUID={campain_uuid}
          agentId={agent_id}
          total={total}
        />
      )}

      <MarketModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        noClose={!error}
      >
        <MarketModal.Title>{modalTitle}</MarketModal.Title>
        {error ? (
          <>
            <MarketModal.Content>
              <MarketModal.Paragraph>{modalText}</MarketModal.Paragraph>
            </MarketModal.Content>
            <MarketModal.Button onClick={() => setOpenModal(false)}>
              Ok
            </MarketModal.Button>
          </>
        ) : (
          <>
            <MarketModal.Content
              className={styles.adManagerAddNew__modal__content}
            >
              <LoadingSpinner size="big" className={checkLoadingStyleWL} />
              <MarketModal.Paragraph>{modalText}</MarketModal.Paragraph>
            </MarketModal.Content>
          </>
        )}
      </MarketModal>
    </>
  );
};

export default CreateAdAction;
