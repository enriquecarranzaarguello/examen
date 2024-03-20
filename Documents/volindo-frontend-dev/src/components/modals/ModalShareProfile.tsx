import { ModalGeneralProps } from '@typing/proptypes';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@context';
import config from '@config';
import IconCloseBlack from '@icons/close-black.svg';
import copyShareIcon from '@icons/copyPurple.svg';
import facebookIcon from '@icons/facebook.svg';
import whatsAppIcon from '@icons/whatsappSquare.svg';
import linkedinIcon from '@icons/linkedinSquare.svg';
import { useTranslation } from 'react-i18next';

const ModalShareProfile = ({ open, onClose }: ModalGeneralProps) => {
  // Data
  const email = useAppSelector(state => state.agent.email);
  const profile = useAppSelector(state => state.agent.profile);
  // URL state
  const [urlPublicProfile, setUrlPublicProfile] = useState('');
  // Aux window state
  const [windowSize, setWindowSize] = useState(0);
  // Transalation
  const { t } = useTranslation();

  useEffect(() => {
    const cleanEmail = encodeURIComponent(email);
    const cleanName = encodeURIComponent(
      profile.full_name
        .toLowerCase()
        .normalize('NFD'.replace(/[\u0300-\u036f]/g, ''))
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]+/g, '')
    );

    let volindoURL = config.base_dashboard || '';
    volindoURL =
      volindoURL[volindoURL.length - 1] === '/'
        ? volindoURL.slice(0, -1)
        : volindoURL;
    setUrlPublicProfile(`${volindoURL}/profile/${cleanEmail}/${cleanName}`);
  }, [profile.full_name]);

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
        <div
          data-testid="modal-share-profile"
          className="relative rounded-[16px] bg-black shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-full h-full md:h-fit md:w-fit px-5 lg:px-16 text-white"
        >
          <button
            data-testid="modal-share-profile-close"
            className="absolute  top-0 right-0  md:-top-5 md:-right-6"
            onClick={onClose}
          >
            <Image className=" " alt="icon" src={IconCloseBlack} />
          </button>

          <div className="flex justify-center flex-col items-center h-full overflow-hidden overflow-y-scroll scrollbar-hide">
            <h1
              data-testid="modal-share-profile-title"
              className="font-[760] text-center text-4xl text-white mt-11 mb-7"
            >
              {t('agent.share.link')}
            </h1>

            <span className="text-white text-base text-center">
              {t('agent.share.instruction')}
            </span>

            <div
              data-testid="modal-share-profile-copy"
              className="py-3 px-7 flex w-full md:w-fit md:max-w-lg items-center rounded-full border-2 border-whiteLabelColor mt-5 mb-7"
            >
              <a
                data-testid="modal-share-profile-copy-link"
                className="truncate overflow-hidden h-fit pr-3"
                href={urlPublicProfile}
                target="_blank"
                rel="noreferrer"
              >
                {urlPublicProfile}
              </a>

              <button
                data-testid="modal-share-profile-copy-button"
                className="lg:ml-3"
              >
                <Image
                  src={copyShareIcon}
                  width={windowSize < 756 ? 24 : 18}
                  height={windowSize < 756 ? 24 : 18}
                  alt="Copy Paste"
                  onClick={() => {
                    navigator.clipboard.writeText(urlPublicProfile);
                  }}
                />
              </button>
            </div>

            <span className="text-white text-base">
              {t('agent.share.social')}
            </span>

            <div
              data-testid="modal-share-profile-socials"
              className="flex gap-8 mt-5 mb-11"
            >
              <button
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${urlPublicProfile}`,
                    '_blank'
                  );
                }}
              >
                <Image
                  src={facebookIcon}
                  alt="Facebook"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </button>

              <button
                onClick={() => {
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${urlPublicProfile}`,
                    '_blank'
                  );
                }}
              >
                <Image
                  src={linkedinIcon}
                  alt="LinkedIn"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </button>
              <button
                onClick={() => {
                  window.open(
                    `https://api.whatsapp.com/send?text=${urlPublicProfile}`,
                    '_blank'
                  );
                }}
              >
                <Image
                  src={whatsAppIcon}
                  alt="WhatsApp"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalShareProfile;
