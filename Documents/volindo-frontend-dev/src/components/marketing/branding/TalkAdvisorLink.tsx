import styles from '@styles/marketing.module.scss';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@context';
import MarketModal from '../MarketModal';
import MarketingService from '@services/MarketingService';
import { useSession } from 'next-auth/react';
import config from '@config';

const GetPhone = dynamic(() => import('./ModalPhone'), { ssr: false });

const TalkAdvisorLink = () => {
  const { t } = useTranslation();
  const agent = useAppSelector(state => state.agent);
  const { data: session } = useSession();
  const [openModal, setOpenModal] = useState<
    'none' | 'phone' | 'success' | 'error'
  >('none');

  const advisorLinkWL = config.WHITELABELNAME === 'Volindo';

  const handleClick = () => {
    const phone = agent.profile.phone_number;
    const phoneCode = agent.profile.phone_country_code;

    if (!phone || !phoneCode) {
      setOpenModal('phone');
    } else {
      sendMail();
    }
  };

  const handleClose = () => setOpenModal('none');

  const sendMail = () => {
    if (session?.user.id_token)
      MarketingService.sendLetterToAdvisor(session?.user.id_token)
        .then(() => {
          setOpenModal('success');
        })
        .catch(err => {
          console.log(err);
          setOpenModal('error');
        });
  };

  return (
    <>
      <button
        data-testid="marketing-talk-advisor"
        onClick={handleClick}
        className={advisorLinkWL ? styles.advisorLink : styles.advisorLinkWL}
      >
        {t('marketing.branding.advisor')}
      </button>

      <GetPhone
        open={openModal == 'phone'}
        onClose={() => setOpenModal('none')}
        onSuccessfullUpdate={sendMail}
        onError={() => setOpenModal('error')}
      />

      <MarketModal
        open={openModal == 'success' || openModal == 'error'}
        onClose={handleClose}
      >
        <MarketModal.Title>
          {openModal == 'success'
            ? t('marketing.branding.talkAdvisor.send')
            : t('marketing.branding.talkAdvisor.error')}
        </MarketModal.Title>
        <MarketModal.Content>
          <MarketModal.Paragraph>
            {openModal == 'success'
              ? t('marketing.branding.talkAdvisor.sendMessage')
              : t('marketing.branding.talkAdvisor.errorMessage')}
          </MarketModal.Paragraph>
        </MarketModal.Content>
        <MarketModal.Button onClick={handleClose}>Okey</MarketModal.Button>
      </MarketModal>
    </>
  );
};

export default TalkAdvisorLink;
