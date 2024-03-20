import React from 'react';
import Image from 'next/image';
import config from '@config';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import type { DataTravlerType } from '@typing/types';

import userDefaultIMG from '@icons/userDefaultIMG.svg';
import { findFlagByCountry } from '../../../helpers/findFlagByCountry';

import cancelFlightsIcon from '@icons/flightGray.svg';
import resFlightsVolindoIcon from '@icons/resFlightsIcon.svg';
import resFlightsFlywayIcon from '@icons/resFlightsIcon_flyway.svg';

import canceldHotelIcon from '@icons/resSupplierIcon.svg';
import hotelVolindoIcon from '@icons/hotelIconColor.svg';
import hotelFlywayIcon from '@icons/hotelIconColor_flyway.svg';

import canceledAdventuraIcon from '@icons/resStayIcon.svg';
import adventureVolindoIcon from '@icons/resStayIconPurple.svg';
import adventureFlywayIcon from '@icons/resStayIconPink.svg';

import styles from '@styles/crm/travelers/components/travelerCard.module.scss';

const TravelerCard = ({
  traveler,
  photo = '',
  id,
}: {
  traveler: DataTravlerType;
  photo: string;
  id: string;
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    country,
    fullName,
    description,
    travelerTypecast,
    referral,
    addToGroup,
  } = traveler;

  const hotelIconMap = {
    Flywaytoday: hotelFlywayIcon,
    Volindo: hotelVolindoIcon,
  };

  const adventureIconMap = {
    Flywaytoday: adventureFlywayIcon,
    Volindo: adventureVolindoIcon,
  };

  const flightIconMap = {
    Flywaytoday: resFlightsFlywayIcon,
    Volindo: resFlightsVolindoIcon,
  };

  const getIcon = (param: any, iconMap: Record<string, string>): string => {
    return iconMap[param] || '';
  };

  const hotelIconColor = getIcon(config.WHITELABELNAME, hotelIconMap);
  const AdventureIcon = getIcon(config.WHITELABELNAME, adventureIconMap);
  const resFlightsIcon = getIcon(config.WHITELABELNAME, flightIconMap);

  const handleOpenTraveler = (id: string) => {
    router.push(`/travelers/${id}`);
  };

  return (
    <div onClick={() => !id.includes('rec') && handleOpenTraveler(id)}>
      {/* Desktop View */}
      <div className={styles.cardDesktop}>
        <div className={styles.cardDesktop_profileElement}>
          <Image
            src={photo ? photo : userDefaultIMG}
            alt="Profile Image of Traveler"
            width={100}
            height={100}
            className={styles.cardDesktop_profileElement_image}
          />
          <p className={styles.cardDesktop_profileElement_content}>
            {fullName}
          </p>
        </div>
        <div className={styles.cardDesktop_profileElement}>
          <p>
            {country ? findFlagByCountry(country) : ''}
            {country || t('travelers.no_country')}
          </p>
        </div>
        <div className={styles.cardDesktop_profileElement}>
          <p>
            {travelerTypecast
              ? t(`travelers.typecast.${travelerTypecast}`)
              : '-'}
          </p>
        </div>
        <div className={styles.cardDesktop_profileElement}>
          <p>{id.includes('rec') ? <span>Lead</span> : <span>Normal</span>}</p>
        </div>
        <div className={styles.cardDesktop_profileElement}>
          <p>{referral ? t(`travelers.referral.${referral}`) : '-'}</p>
        </div>
        <div className={styles.cardDesktop_profileElement}>
          <p>{addToGroup || t('travelers.no_group')}</p>
        </div>
        <div className={styles.cardDesktop_profileElement}>
          <div className="bg-[#D9D9D9] w-7 h-7 flex items-center justify-center rounded-full bg-opacity-[.1]">
            <Image
              src={
                description === 'cancelled' ? hotelIconColor : canceldHotelIcon
              }
              alt="Hotel Color Icon"
            />
          </div>
          <div className="bg-[#D9D9D9] w-7 h-7 flex items-center justify-center rounded-full bg-opacity-[.1]">
            <Image
              src={
                description === 'cancelled'
                  ? AdventureIcon
                  : canceledAdventuraIcon
              }
              alt="Suppliers Color Icon"
            />
          </div>
          <div className="bg-[#D9D9D9] w-7 h-7 flex items-center justify-center rounded-full bg-opacity-[.1]">
            <Image
              src={
                description === 'cancelled' ? resFlightsIcon : cancelFlightsIcon
              }
              alt="Suppliers Color Icon"
            />
          </div>
        </div>
      </div>
      {/* Mobile View */}
      <div className={styles.cardMobile}>
        <div className={styles.cardMobile_container}>
          <div className={styles.cardMobile_container_image}>
            <Image
              src={photo ? photo : userDefaultIMG}
              alt="Profile Image of Traveler"
              width={100}
              height={100}
              className={styles.cardMobile_container_image_profilePicture}
            />
          </div>
          <div className={styles.cardMobile_container_content}>
            <span className={styles.cardMobile_container_content_text}>
              {fullName}
            </span>
            <span className={styles.cardMobile_container_content_text}>
              {country ? `${findFlagByCountry(country)}` : ''} {country}
            </span>
          </div>
        </div>
        <hr className={styles.cardMobile_hr} />
        <div className={styles.cardMobile_content}>
          <div className={styles.cardMobile_content_lines}>
            <p className={styles.cardMobile_content_lines_types}>
              {t('travelers.typecast_title')}
            </p>
            <p className={styles.cardMobile_content_lines_data}>
              {travelerTypecast
                ? t(`travelers.typecast.${travelerTypecast}`)
                : t('travelers.no_typecast')}
            </p>
          </div>
          <div className={styles.cardMobile_content_lines}>
            <p className={styles.cardMobile_content_lines_types}>
              {t('travelers.traveler-source')}
            </p>
            <p className={styles.cardMobile_content_lines_data}>
              {referral
                ? t(`travelers.referral.${referral}`)
                : t('travelers.no_travel_source')}
            </p>
          </div>
          <div className={styles.cardMobile_content_lines}>
            <p className={styles.cardMobile_content_lines_types}>
              {t('travelers.group')}
            </p>
            <p className={styles.cardMobile_content_lines_data}>
              {addToGroup || t('travelers.no_group')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerCard;
