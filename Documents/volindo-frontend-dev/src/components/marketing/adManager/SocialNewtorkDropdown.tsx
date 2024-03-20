import styles from '@styles/marketing.module.scss';
import Image from 'next/image';

import CaretIcon from '@icons/marketingIcons/caret-down.svg';
import FacebookIcon from '@icons/marketingIcons/facebook-sqrt.svg';
import InstagramIcon from '@icons/marketingIcons/instagram-sqrt.svg';
import TikTokIcon from '@icons/marketingIcons/tiktok-sqrt.svg';
import LinkedInIcon from '@icons/marketingIcons/linkedin-sqrt.svg';
import ThreadsIcon from '@icons/marketingIcons/threads-sqrt.svg';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAdFormStore } from '@components/marketing/adManager/context/NewAdContext';

const SOCIAL_NETWORKS = [
  {
    name: 'Facebook',
    icon: FacebookIcon,
  },
  {
    name: 'Instagram',
    icon: InstagramIcon,
  },
  {
    name: 'TikTok',
    icon: TikTokIcon,
  },
  {
    name: 'LinkedIn',
    icon: LinkedInIcon,
  },
  {
    name: 'Threads',
    icon: ThreadsIcon,
  },
];

const SocialNewtorkDropdown = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const refDropdown = useRef<HTMLDivElement>(null);

  const [social, setStore] = useAdFormStore(store => store.socialNetwork);

  const handleSelection = (option: string) => {
    setStore({ socialNetwork: option });
    setOpen(false);
  };

  const handleKeyDown = (event: any, value: string) => {
    if (event.key === 'Enter') {
      handleSelection(value);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (refDropdown.current && !refDropdown.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener('click', handleClickOutside, true);
    else document.removeEventListener('click', handleClickOutside, true);
  }, [open]);

  return (
    <div className={styles.inputAd__dropdown__container}>
      <div className={styles.inputAd__dropdown__button__wrapper}>
        <button
          className={`${styles.inputAd} ${styles.inputAd__dropdown__button} ${
            open ? styles.active : ''
          }`}
          onClick={() => {
            setOpen(true);
          }}
        >
          <div className={styles['inputAd--withIcon']}>
            {social ? (
              <>
                <Image
                  src={
                    SOCIAL_NETWORKS.find(socialNet => socialNet.name === social)
                      ?.icon
                  }
                  alt={social}
                  width={16}
                  height={16}
                />
                <span>
                  {social}
                  {/* - {t('marketing.adManager.new.sOption')} */}
                </span>
              </>
            ) : (
              <span className={styles.placeholder}>
                {t('marketing.adManager.new.socialS')}
              </span>
            )}
          </div>
          <Image
            className={`${styles['inputAd__dropdown__arrow']} ${
              open ? styles.active : ''
            }`}
            src={CaretIcon}
            alt="Arrow"
            width={24}
            height={24}
          />
        </button>
      </div>
      <div
        className={`${styles.inputAd__dropdown} ${open ? styles.active : ''}`}
        ref={refDropdown}
      >
        {SOCIAL_NETWORKS.map((network, i) => (
          <div
            key={network.name}
            className={`${styles['inputAd--withIcon']} ${styles.inputAd__dropdown__option}`}
            onClick={() => handleSelection(network.name)}
            onKeyDown={e => handleKeyDown(e, network.name)}
            role="button"
            tabIndex={0}
          >
            <Image
              src={network.icon}
              alt={network.name}
              width={16}
              height={16}
            />
            <span>{network.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialNewtorkDropdown;
