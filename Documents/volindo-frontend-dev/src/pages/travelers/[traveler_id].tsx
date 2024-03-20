import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styleHeader from '@styles/crm/header.module.scss';
import style from '@styles/crm/travelers/travelersProfile.module.scss';
import config from '@config';

//Getting Flags
import { findFlagByCountry } from '../../helpers/findFlagByCountry';

import type { GetServerSideProps } from 'next';
import type { TravelersProps } from '@typing/proptypes';
import type { NextPageWithLayout, UploadedFilesType } from '@typing/types';

import { FileType } from 'rsuite/esm/Uploader';

import arrowLeft from '@icons/arrow-left.svg';
import userDefaultIMG from '@icons/userDefaultIMG.svg';
import editPencil from '@icons/editPencil.svg';
import phone from '@icons/resphoneIcon.svg';
import text from '@icons/restextIcon.svg';
import phoneIcon from '@icons/traveler-phone.svg';
import emailIcon from '@icons/traveler-email.svg';
import whatsappIcon from '@icons/traveler-whatsapp.svg';
import descriptionIcon from '@icons/traveler-description.svg';
import homeIcon from '@icons/traveler-home.svg';
import birthdayIcon from '@icons/traveler-birthday.svg';
import lockIcon from '@icons/traveler-lock.svg';

import countryDataEN from '../../../public/data/countries/en/countriesData.json';
import countryDataES from '../../../public/data/countries/es/countriesData.json';

import {
  UploaderModal,
  ModalTraveler,
  ModalTravelerStatus,
  SEO,
} from '@components';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { getLayout } from '@layouts/MainLayout';
import { updateTravelerImage } from '@utils/axiosClients';

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const countries = context.locale === 'en' ? countryDataEN : countryDataES;

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
        ['common'],
        nextI18nextConfig
      )),
      id_token: session.user.id_token,
      countries,
    },
  };
};

const Traveler: NextPageWithLayout<TravelersProps> = ({
  id_token,
  countries,
  traveler_status,
}: TravelersProps) => {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const travelerId = Array.isArray(router.query.traveler_id)
    ? router.query.traveler_id[0]
    : router.query.traveler_id || '';

  const [traveler, setTraveler] = useState<any>({});
  const [photo, setPhoto] = useState('');
  const [editTraveler, setEditTraveler] = useState(false);
  const [openUploaderModal, setOpenUploaderModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesType>({});
  const [imageForm, setImageForm] = useState({
    profile_image: traveler?.photo || '',
  });
  const [modalAddTraveler, setModalAddTraveler] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const getTraveler = async () => {
      try {
        const response = await axios.get(
          `${config.api}/travelers/${travelerId}`,
          {
            headers: {
              Authorization: 'Bearer ' + id_token || '',
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.status === 200) {
          setTraveler(response.data);
          setPhoto(response.data.photo);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (id_token && travelerId) {
      getTraveler();
    }
  }, []);

  const updateImage = async () => {
    updateTravelerImage(imageForm, session?.user.id_token || '', travelerId);
    try {
      const response = await axios.put(
        `${config.api}/travelers/image/${travelerId}`,
        imageForm,
        {
          headers: {
            Authorization: 'Bearer ' + session?.user.id_token || '',
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setModalAddTraveler(true);
        setMessage(`${t('travelers.photo_success')}`);
      } else {
        setModalAddTraveler(true);
        setMessage(`${t('travelers.photo_error')}`);
      }
    } catch (error) {
      //TODO HandleError
    }
  };

  useEffect(() => {
    if (imageForm.profile_image !== '') {
      updateImage();
    }
  }, [imageForm]);

  const handleFileChange = (key: string, files: FileType[]) => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [key]: files,
    }));
  };

  const handleUploadProfilePhoto = async () => {
    setOpenUploaderModal(false);
    const profilePhoto = uploadedFiles.travelerPhoto[0].blobFile;

    if (profilePhoto) {
      const reader = new FileReader();

      reader.onload = function (event: any) {
        const byteArray = new Uint8Array(event.target.result);
        const base64String = arrayBufferToBase64(byteArray);

        setImageForm({
          ...imageForm,
          profile_image: base64String,
        });
      };

      reader.readAsArrayBuffer(profilePhoto);
    }
  };

  function arrayBufferToBase64(buffer: Uint8Array) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  const handlePhone = (phone_number: string) => {
    window.location.href = `tel:${phone_number}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleWhatsApp = (phone_number: string) => {
    window.open(
      `https://api.whatsapp.com/send?l=${i18n.language}&phone=${phone_number}`,
      '_blank'
    );
  };

  return (
    <div className={style.profile}>
      <SEO title={'Traveler Profile'} />
      {modalAddTraveler && (
        <ModalTravelerStatus
          open={modalAddTraveler}
          onClose={() => setModalAddTraveler(false)}
          onCloseAll={() => router.reload()}
          text={message}
          error={''}
        />
      )}
      {editTraveler && (
        <ModalTraveler
          open={editTraveler}
          onClose={() => setEditTraveler(false)}
          traveler={traveler}
        />
      )}
      {openUploaderModal && (
        <UploaderModal
          isOpen={openUploaderModal}
          close={() => setOpenUploaderModal(false)}
          currentUploaderKey="travelerPhoto"
          fileList={uploadedFiles['travelerPhoto'] || []}
          handleFileUpload={handleFileChange}
          fileType="Images"
          singleFile={true}
          callbackAndClose={handleUploadProfilePhoto}
        />
      )}

      <div className={style.profile_container}>
        <div className={style.profile_container_header}>
          <Link href="/travelers">
            <Image
              className={style.profile_container_header_image}
              src={arrowLeft}
              alt="Arrow left"
            />
          </Link>
          <h2 className={style.profile_container_header_header}>
            {t('travelers.title_profile')}
          </h2>
        </div>
        <div className={style.profile_container_content}>
          <div className={style.profile_container_content_card}>
            <Image
              src={photo ? photo : userDefaultIMG}
              alt="Profile Image of Traveler"
              width={100}
              height={100}
              className={style.profile_container_content_card_userPhoto}
            />
            {/* Update Button */}
            <button
              className={style.profile_container_content_card_update}
              onClick={() => setOpenUploaderModal(true)}
            >
              <Image src={editPencil} alt="edit pencil" className="" />
              <span
                className={style.profile_container_content_card_update_editText}
              >
                {t('travelers.update-photo')}
              </span>
            </button>
            <h3 className={style.profile_container_content_card_name}>
              {traveler?.data_traveler?.fullName || ''}
            </h3>
            <div className="text-white">
              {`${findFlagByCountry(traveler?.data_traveler?.country || '')} ${
                traveler?.data_traveler?.country || ''
              }`}
            </div>
            <div className={style.profile_container_content_card_bgBlack}>
              {traveler?.data_traveler?.travelerTypecast
                ? t(
                    `travelers.typecast.${traveler?.data_traveler?.travelerTypecast}`
                  )
                : ''}
            </div>
            <div className={style.profile_container_content_card_bgBlack}>
              {traveler?.data_traveler?.referral
                ? t(`travelers.referral.${traveler?.data_traveler?.referral}`)
                : ''}
            </div>
            <div className={style.profile_container_content_card_icons}>
              <button
                onClick={() =>
                  handlePhone(traveler?.data_traveler?.phoneNumber)
                }
              >
                <Image width={24} height={24} src={phoneIcon} alt="phone" />
              </button>
              <button
                onClick={() => handleEmail(traveler?.data_traveler?.email)}
              >
                <Image width={24} height={24} src={emailIcon} alt="phone" />
              </button>
              <button
                onClick={() =>
                  handleWhatsApp(traveler?.data_traveler?.phoneNumber)
                }
              >
                <Image width={20} height={20} src={text} alt="phone" />
              </button>
            </div>

            <button
              className={
                style.profile_container_content_info_title_buttonMobile
              }
              onClick={() => setEditTraveler(true)}
            >
              {t('travelers.edit-profile')}
            </button>
          </div>
          <div className={style.profile_container_content_info}>
            <div className={style.profile_container_content_info_title}>
              <h4 className={style.profile_container_content_info_title_header}>
                {t('travelers.tourist-profile')}
              </h4>
              <button
                className={style.profile_container_content_info_title_button}
                onClick={() => setEditTraveler(true)}
              >
                {t('travelers.edit-profile')}
              </button>
            </div>
            <div className={style.profile_container_content_info_details}>
              {traveler?.data_traveler?.description && (
                <div
                  className={
                    style.profile_container_content_info_details_container
                  }
                >
                  <div
                    className={
                      style.profile_container_content_info_details_container_cards
                    }
                  >
                    <div
                      className={
                        style.profile_container_content_info_details_container_cards_icon
                      }
                    >
                      <Image src={descriptionIcon} alt="Description" />
                    </div>
                    {t('travelers.form.description')}
                  </div>
                  <p
                    className={
                      style.profile_container_content_info_details_container_cards_text
                    }
                  >
                    {traveler?.data_traveler?.description || ''}
                  </p>
                </div>
              )}
              <div
                className={
                  style.profile_container_content_info_details_container
                }
              >
                <span
                  className={
                    style.profile_container_content_info_details_container_cards
                  }
                >
                  <div
                    className={
                      style.profile_container_content_info_details_container_cards_icon
                    }
                  >
                    <Image src={homeIcon} alt="sup home" />{' '}
                  </div>
                  {t('travelers.form.address')}
                </span>
                <p
                  className={
                    style.profile_container_content_info_details_container_cards_text
                  }
                >
                  {traveler?.data_traveler?.adress || ''}{' '}
                  {traveler?.data_traveler?.city
                    ? ` ${traveler?.data_traveler.city}`
                    : ''}
                </p>
              </div>
              <div
                className={
                  style.profile_container_content_info_details_container
                }
              >
                <span
                  className={
                    style.profile_container_content_info_details_container_cards
                  }
                >
                  <div
                    className={
                      style.profile_container_content_info_details_container_cards_icon
                    }
                  >
                    <Image src={phone} width={20} height={20} alt="sup home" />{' '}
                  </div>
                  {t('travelers.form.phone')}
                </span>
                <span
                  className={
                    style.profile_container_content_info_details_container_cards_text
                  }
                >
                  {`${traveler?.data_traveler?.phoneCode} ${traveler?.data_traveler?.phoneNumber}`}
                </span>
              </div>
              <div
                className={
                  style.profile_container_content_info_details_container
                }
              >
                <span
                  className={
                    style.profile_container_content_info_details_container_cards
                  }
                >
                  <div
                    className={
                      style.profile_container_content_info_details_container_cards_icon
                    }
                  >
                    <Image
                      className="opacity-70"
                      src={emailIcon}
                      width={20}
                      height={20}
                      alt="message"
                    />
                  </div>

                  {t('travelers.email')}
                </span>
                <p
                  className={
                    style.profile_container_content_info_details_container_cards_text
                  }
                >
                  {traveler?.data_traveler?.email || ''}
                </p>
              </div>
              <div
                className={
                  style.profile_container_content_info_details_container
                }
              >
                <span
                  className={
                    style.profile_container_content_info_details_container_cards
                  }
                >
                  <div
                    className={
                      style.profile_container_content_info_details_container_cards_icon
                    }
                  >
                    <Image
                      className="opacity-70"
                      src={birthdayIcon}
                      width={20}
                      height={20}
                      alt="birhtay logo"
                    />
                  </div>
                  {t('travelers.birth-date')}
                </span>
                <p
                  className={
                    style.profile_container_content_info_details_container_cards_text
                  }
                >
                  {traveler?.data_traveler?.dayOfBirth || ''}
                </p>
              </div>
              <div
                className={
                  style.profile_container_content_info_details_container
                }
              >
                <span
                  className={
                    style.profile_container_content_info_details_container_cards
                  }
                >
                  <div
                    className={
                      style.profile_container_content_info_details_container_cards_icon
                    }
                  >
                    <Image
                      className="opacity-70"
                      src={lockIcon}
                      width={20}
                      height={20}
                      alt="birhtay logo"
                    />
                  </div>
                  {t('travelers.form.passport')}
                </span>
                <p
                  className={
                    style.profile_container_content_info_details_container_cards_text
                  }
                >
                  {traveler?.data_traveler?.passportNo || ''}
                </p>
              </div>
            </div>
            <div className={styleHeader.header_container}>
              <div className={styleHeader.header_container_card}>
                <button className={styleHeader.header_container_card_button}>
                  {t('travelers.proposal')}
                </button>

                <button className={styleHeader.header_container_card_button}>
                  {t('travelers.booking')}
                </button>

                <button className={styleHeader.header_container_card_button}>
                  {t('travelers.special-req')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Traveler.getLayout = getLayout;

export default Traveler;
