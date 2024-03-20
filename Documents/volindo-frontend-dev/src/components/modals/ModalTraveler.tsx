import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { Form, SelectPicker, TagPicker, Input, Schema } from 'rsuite';
import Image from 'next/image';
import axios from 'axios';
import config from '@config';
import { useRouter } from 'next/router';
//TODO Change import to @
import phoneCodes from './../../common/data/countries/phoneCountries.json';

import styles from '@styles/crm/travelers/components/addTraveler.module.scss';

import type { ModalNotStaysProps } from '@typing/proptypes';
import {
  UploadedFilesType,
  TravelerDataType,
  CountryType,
} from '@typing/types';
import { FileType } from 'rsuite/esm/Uploader';

import {
  createTraveler,
  updateTraveler,
  deleteTraveler,
  getGroups,
} from '@utils/axiosClients';

import { Modal, ModalTravelerStatus, UploaderModal } from '@components';

import { useAppSelector } from '@context';

type FormData = {
  fullName: string;
  passportNo: string;
  adress: string;
  city: string;
  country: string;
  zipCode: string;
  phoneCode: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dayOfBirth: string;
  travelerTypecast: string;
  referral: string;
  referralName: string;
  addToGroup: string;
  specialRequest: string;
  description: string;
  [key: string]: string;
};

type FieldInteractionsType = {
  [key: string]: boolean;
};

export default function ModalTraveler({
  open,
  onClose,
  traveler = {},
}: {
  open: boolean;
  onClose: () => void;
  traveler: TravelerDataType | any;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { t, i18n } = useTranslation('common');
  const AgentId = useAppSelector(state => state.agent.agent_id);
  const TravelerId = traveler?.traveler_id || '';

  /* Photo States */
  const [openUploaderModal, setOpenUploaderModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesType>({});

  const [fieldInteractions, setFieldInteractions] =
    useState<FieldInteractionsType>({});
  const [formData, setFormData] = useState<FormData>({
    fullName: traveler?.data_traveler?.fullName || '',
    passportNo: traveler?.data_traveler?.passportNo || '',
    adress: traveler?.data_traveler?.adress || '',
    city: traveler?.data_traveler?.city || '',
    country: traveler?.data_traveler?.country || '',
    zipCode: traveler?.data_traveler?.zipCode || '',
    phoneCode: traveler?.data_traveler?.phoneCode || '',
    phoneNumber: traveler?.data_traveler?.phoneNumber || '',
    email: traveler?.data_traveler?.email || '',
    gender: traveler?.data_traveler?.gender || '',
    dayOfBirth: traveler?.data_traveler?.dayOfBirth || '',
    travelerTypecast: traveler?.data_traveler?.travelerTypecast || '',
    referral: traveler?.data_traveler?.referral || '',
    referralName: traveler?.data_traveler?.referralName || '',
    addToGroup: traveler?.data_traveler?.addToGroup || '',
    specialRequest: traveler?.data_traveler?.specialRequest || '',
    description: traveler?.data_traveler?.description || '',
    profile_image: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [modalAddTraveler, setModalAddTraveler] = useState<boolean>(false);
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [message, setMessage] = useState<string>('');
  const [groups, setGroups] = useState<string[]>([]);
  const [personalizedGroup, setPersonalizedGroup] = useState({
    group: traveler?.data_traveler?.group || '',
  });
  const [fieldPersonalized, setFiledPersonalized] = useState(false);

  const titles = [
    { label: 'Mr.', value: 'MR' },
    { label: 'Ms.', value: 'MS' },
    { label: 'Child', value: 'CH' },
  ];

  const typeCasting = [
    { label: 'Honeymoon', value: 'Honeymoon' },
    { label: 'Business Trip', value: 'Business_Trip' },
    { label: 'Just Traveler', value: 'Just_Traveler' },
    { label: 'Low cost', value: 'Low_cost' },
    { label: 'Family', value: 'Family' },
    { label: 'Bachelor Party', value: 'Bachelor_party' },
    { label: 'Company trip', value: 'Company_trip' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'New', value: 'New' },
  ];

  const travelerSource = [
    { label: 'Family/Friend', value: 'family/friend' },
    { label: 'Online campaigns', value: 'online_campaigns' },
    { label: 'Off-line campaigns', value: 'off-line_campaigns' },
    { label: 'Referral', value: 'referral' },
  ];

  useEffect(() => {
    if (!open) {
      setFieldInteractions({});
    }
    if (open) {
      setFieldErrors({});
      setUploadedFiles({});
      setFormData({
        fullName: '',
        passportNo: '',
        adress: '',
        city: '',
        country: '',
        zipCode: '',
        phoneCode: '',
        phoneNumber: '',
        email: '',
        gender: '',
        dayOfBirth: '',
        travelerTypecast: '',
        referral: '',
        referralName: '',
        addToGroup: '',
        specialRequest: '',
        description: '',
        profile_image: '',
      });
    }
  }, [open]);

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  useEffect(() => {
    const getCountriesData = async () => {
      const countriesResponse = await fetch(
        `/data/countries/${i18n.language}/countriesData.json`
      );
      const countriesObject = await countriesResponse.json();
      // Ordenar alfabéticamente los países por su 'country_name'
      const sortedCountries = countriesObject.sort((a: any, b: any) =>
        a.country_name.localeCompare(b.country_name)
      );
      setCountries(sortedCountries);
    };
    getCountriesData();
  }, [i18n.language]);

  const handleFieldInteraction = (fieldName: any) => {
    setFieldInteractions(prevInteractions => ({
      ...prevInteractions,
      [fieldName]: true,
    }));
    validateField(fieldName, formData[fieldName]);
  };

  useEffect(() => {
    if (Object.keys(traveler).length > 0) {
      setFormData({
        fullName: traveler?.data_traveler?.fullName || '',
        passportNo: traveler?.data_traveler?.passportNo || '',
        adress: traveler?.data_traveler?.adress || '',
        city: traveler?.data_traveler?.city || '',
        country: traveler?.data_traveler?.country || '',
        zipCode: traveler?.data_traveler?.zipCode || '',
        phoneCode: traveler?.data_traveler?.phoneCode || '',
        phoneNumber: traveler?.data_traveler?.phoneNumber || '',
        email: traveler?.data_traveler?.email || '',
        gender: traveler?.data_traveler?.gender || '',
        dayOfBirth: traveler?.data_traveler?.dayOfBirth || '',
        travelerTypecast: traveler?.data_traveler?.travelerTypecast || '',
        referral: traveler?.data_traveler?.referral || '',
        referralName: traveler?.data_traveler?.referralName || '',
        addToGroup: traveler?.data_traveler?.addToGroup || '',
        specialRequest: traveler?.data_traveler?.specialRequest || '',
        description: traveler?.data_traveler?.description || '',
        profile_image: traveler?.photo || '',
      });
    }
  }, [traveler]);

  // Define a validation function
  const validateForm = () => {
    const requiredFields = [
      'fullName',
      'city',
      'zipCode',
      'phoneNumber',
      'email',
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return false;
      }
    }
    return true;
  };

  const handleChangeGroup = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'addToGroup' && value === 'personalized') {
      setFiledPersonalized(true);
      setPersonalizedGroup({ ...personalizedGroup, group: value });
    } else if (value !== '') {
      setFiledPersonalized(false);
      setFormData({ ...formData, [name]: value });
      setPersonalizedGroup({ ...personalizedGroup, group: value });
    } else {
      setFiledPersonalized(false);
      setPersonalizedGroup({ ...personalizedGroup, group: '' });
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber' || name === 'zipCode') {
      if (/^\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
      }
    } else {
      setFormData({ ...formData, [name]: value });
      validateField(name, value);
    }
  };

  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'fullName':
        if (!value) {
          setFieldErrors({
            ...fieldErrors,
            [fieldName]: `${t('travelers.required_full_name')}`,
          });
        } else {
          setFieldErrors({ ...fieldErrors, [fieldName]: '' });
        }
        break;
      case 'city':
        if (!value) {
          setFieldErrors({
            ...fieldErrors,
            [fieldName]: `${t('travelers.required_city')}`,
          });
        } else {
          setFieldErrors({ ...fieldErrors, [fieldName]: '' });
        }
        break;
      case 'zipCode':
        if (!value) {
          setFieldErrors({
            ...fieldErrors,
            [fieldName]: `${t('travelers.required_zip_code')}`,
          });
        } else {
          setFieldErrors({ ...fieldErrors, [fieldName]: '' });
        }
        break;
      case 'phoneNumber':
        if (!value) {
          setFieldErrors({
            ...fieldErrors,
            [fieldName]: `${t('travelers.required_phone_number')}`,
          });
        } else {
          setFieldErrors({ ...fieldErrors, [fieldName]: '' });
        }
        break;
      case 'email':
        if (!value) {
          setFieldErrors({
            ...fieldErrors,
            [fieldName]: `${t('travelers.required_email')}`,
          });
        } else if (!value.includes('@')) {
          setFieldErrors({
            ...fieldErrors,
            [fieldName]: `${t('travelers.no_valid_email')}`,
          });
        } else {
          setFieldErrors({ ...fieldErrors, [fieldName]: '' });
        }
        break;
      default:
        setFieldErrors({ ...fieldErrors, [fieldName]: '' });
    }
  };

  useEffect(() => {
    // TODO Activate with axios client
    //   getGroups(AgentId)
    //     .then((response: any) => {
    //       setGroups(response.data);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    const getGroups = async () => {
      try {
        const response = await axios.get(
          `${config.api}/agent/traveler/group/${AgentId}`
        );
        if (response.status === 200) {
          setGroups(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getGroups();
  }, [AgentId]);

  const resetForm = () => {
    setFieldErrors({});
    setUploadedFiles({});
    setFormData({
      fullName: '',
      passportNo: '',
      adress: '',
      city: '',
      country: '',
      zipCode: '',
      phoneCode: '',
      phoneNumber: '',
      email: '',
      gender: '',
      dayOfBirth: '',
      travelerTypecast: '',
      referral: '',
      referralName: '',
      addToGroup: '',
      specialRequest: '',
      description: '',
      profile_image: '',
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }
    if (TravelerId) {
      editTraveler();
    } else {
      createProfile();
    }
  };

  const handleFileChange = (key: string, files: FileType[]) => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [key]: files,
    }));
  };

  const handleUploadProfilePhoto = () => {
    setOpenUploaderModal(false);
    const profilePhoto = uploadedFiles.travelerPhoto[0].blobFile;

    if (profilePhoto) {
      const reader = new FileReader();

      reader.onload = function (event: any) {
        const byteArray = new Uint8Array(event.target.result);
        const base64String = arrayBufferToBase64(byteArray);

        setFormData({
          ...formData,
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

  const createProfile = () => {
    createTraveler(formData, session?.user.id_token || '')
      .then(() => {
        setModalAddTraveler(true);
        setMessage(`${t('travelers.form.success')}`);
      })
      .catch(error => {
        setMessage(`${t('travelers.form.error')}`);
      });
  };

  const editTraveler = async () => {
    updateTraveler(formData, session?.user.id_token || '', TravelerId)
      .then(() => {
        setModalAddTraveler(true);
        setMessage(`${t('travelers.update_success')}`);
      })
      .catch(error => {
        setMessage(`${t('travelers.update_error')}`);
      });
  };

  const delteProfile = async () => {
    deleteTraveler(session?.user.id_token || '', TravelerId)
      .then(() => {
        setModalAddTraveler(true);
        setMessage(`${t('travelers.delete_success')}`);
      })
      .catch(error => {
        setModalAddTraveler(true);
        setMessage(`${t('travelers.delete_error')}`);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.add_traveler}>
        {modalAddTraveler && (
          <ModalTravelerStatus
            open={modalAddTraveler}
            onClose={() => {
              setModalAddTraveler(false);
              resetForm();
            }}
            onCloseAll={() => router.reload()}
            text={message}
            error={''}
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

        <h2 className={styles.add_traveler_title}>
          {TravelerId
            ? t('travelers.edit_profile')
            : t('travelers.add_traveler')}
        </h2>
        <form
          action=""
          className={styles.add_traveler_form}
          onSubmit={handleSubmit}
        >
          <input
            name={'fullName'}
            type="text"
            onChange={handleChange}
            value={formData.fullName}
            onBlur={() => handleFieldInteraction('fullName')}
            placeholder={`${t('travelers.form.full_name')}`}
            className={`w-[100%] h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 text-white focus:outline-none focus:border-[#777E90] ${
              fieldInteractions['fullName'] && !formData.fullName
                ? 'border-red-500'
                : 'border-[#777E90]'
            }`}
          />
          {fieldErrors['fullName'] && (
            <p className="text-red-500 text-[14px]">
              {fieldErrors['fullName']}
            </p>
          )}
          <input
            name={'passportNo'}
            type="text"
            value={formData.passportNo}
            onChange={handleChange}
            placeholder={`${t('travelers.form.passport')}`}
            className="w-[100%] h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 focus:outline-none focus:border-[#777E90] text-white"
          />
          <input
            name={'adress'}
            type="text"
            value={formData.adress}
            onChange={handleChange}
            placeholder={`${t('travelers.form.address')}`}
            className="w-[100%] h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 focus:outline-none focus:border-[#777E90] text-white"
          />
          <div className="flex flex-row w-full gap-5 justify-center items-center">
            <div className="w-1/2">
              <input
                name="city"
                type="text"
                onChange={handleChange}
                value={formData.city}
                placeholder={`${t('travelers.form.city')}`}
                onBlur={() => handleFieldInteraction('city')}
                className={`h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 md:my-2 w-full text-white focus:outline-none focus:border-[#777E90] ${
                  fieldInteractions['city'] && !formData.city
                    ? 'border-red-500'
                    : 'border-[#777E90]'
                }`}
              />
              {fieldErrors['city'] && (
                <p className="text-red-500 text-[14px]">
                  {fieldErrors['city']}
                </p>
              )}
            </div>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder={`${t('travelers.form.country')}`}
              className={`h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full px-5 md:my-2 w-1/2 text-[#777E90] focus:outline-none focus:border-[#777E90] ${
                fieldInteractions['country'] && !formData.country
                  ? 'border-red-500'
                  : 'border-[#777E90]'
              }`}
            >
              <option value="">{`${t('travelers.form.country')}`}</option>
              {countries.map(item => (
                <option key={item.country_name} value={item.country_name}>
                  {item.country_name}
                </option>
              ))}
            </select>
          </div>
          <input
            name="zipCode"
            type="text"
            onChange={handleChange}
            value={formData.zipCode}
            onBlur={() => handleFieldInteraction('zipCode')}
            placeholder={`${t('travelers.form.zip_code')}`}
            className={`h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 md:my-2 w-full md:w-1/2 text-white focus:outline-none focus:border-[#777E90] ${
              fieldInteractions['zipCode'] && !formData.zipCode
                ? 'border-red-500'
                : 'border-[#777E90]'
            }`}
            maxLength={10}
          />
          {fieldErrors['zipCode'] && (
            <p className="text-red-500 text-[14px]">{fieldErrors['zipCode']}</p>
          )}
          <div className="flex flex-row gap-5 items-center justify-between">
            <select
              name="phoneCode"
              className="w-1/2 h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full px-4 py-1 text-[#777E90] focus:outline-none focus:border-[#777E90] border-[#777E90]"
              value={formData.phoneCode}
              onChange={handleChange}
            >
              {phoneCodes.map((country: any, index) => {
                return (
                  <option
                    key={index}
                    className={styles.input__option}
                    value={country.code}
                  >
                    {country.iso_code} {country.code}
                  </option>
                );
              })}
            </select>
            <input
              name="phoneNumber"
              type="text"
              onChange={handleChange}
              value={formData.phoneNumber}
              onBlur={() => handleFieldInteraction('phoneNumber')}
              placeholder={`${t('travelers.form.phone_number')}`}
              className={`w-[100%] h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 text-white focus:outline-none focus:border-[#777E90] ${
                fieldInteractions['phoneNumber'] && !formData.phoneNumber
                  ? 'border-red-500'
                  : 'border-[#777E90]'
              }`}
              pattern="[0-9]*"
              maxLength={12}
            />
            {fieldErrors['phoneNumber'] && (
              <p className="text-red-500 text-[14px]">
                {fieldErrors['phoneNumber']}
              </p>
            )}
          </div>
          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            onBlur={() => handleFieldInteraction('email')}
            placeholder={`${t('travelers.form.email')}`}
            className={`w-[100%] h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 text-white focus:outline-none focus:border-[#777E90] ${
              fieldInteractions['email'] && !formData.email
                ? 'border-red-500'
                : 'border-[#777E90]'
            }`}
          />
          {fieldErrors['email'] && (
            <p className="text-red-500 text-[14px]">{fieldErrors['email']}</p>
          )}
          <div className="flex flex-row w-full gap-5 justify-center items-center">
            <select
              name="gender"
              onChange={handleChange}
              value={formData.gender}
              className={`h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full px-5 md:my-2 w-1/2 text-[#777E90] focus:outline-none focus:border-[#777E90] ${
                fieldInteractions['gender'] && !formData.gender
                  ? 'border-red-500'
                  : 'border-[#777E90]'
              }`}
            >
              <option value="">{`${t('travelers.form.gender')}`}</option>
              {titles.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              name="dayOfBirth"
              type="date"
              value={formData.dayOfBirth}
              onChange={handleChange}
              placeholder="Day of Birth"
              className="h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 focus:outline-none focus:border-[#777E90] w-1/2 text-[#777E90]"
            />
          </div>
          <div className="flex flex-col md:flex-row w-full gap-5">
            <select
              name="travelerTypecast"
              onChange={handleChange}
              value={formData.travelerTypecast}
              placeholder={`${t('travelers.form.typecast')}`}
              className={`h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full px-5 md:my-2 w-full md:w-1/2 text-[#777E90] focus:outline-none focus:border-[#777E90] ${
                fieldInteractions['travelerTypecast'] &&
                !formData.travelerTypecast
                  ? 'border-red-500'
                  : 'border-[#777E90]'
              }`}
            >
              <option value="">{`${t('travelers.form.typecast')}`}</option>
              {typeCasting.map(option => (
                <option key={option.value} value={option.value}>
                  {t(`travelers.typecast.${option.value}`)}
                </option>
              ))}
            </select>
            <select
              name="referral"
              onChange={handleChange}
              value={formData.referral}
              className={`h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full px-5 md:my-2 w-full md:w-1/2 text-[#777E90] focus:outline-none focus:border-[#777E90] ${
                fieldInteractions['referral'] && !formData.referral
                  ? 'border-red-500'
                  : 'border-[#777E90]'
              }`}
            >
              <option value="">{`${t('travelers.form.select')}`}</option>
              {travelerSource.map(option => (
                <option key={option.value} value={option.value}>
                  {t(`travelers.referral.${option.value}`)}
                </option>
              ))}
            </select>
          </div>
          <input
            name="referralName"
            type="text"
            onChange={handleChange}
            value={formData.referralName}
            placeholder={`${t('travelers.form.referral_name')}`}
            className="w-[100%] h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 focus:outline-none focus:border-[#777E90] text-white"
          />
          <div className="flex flex-row gap-5 items-center justify-center">
            <select
              name="addToGroup"
              onChange={handleChangeGroup}
              value={personalizedGroup.group}
              className={`h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full px-5 md:my-2 w-full text-[#777E90] focus:outline-none focus:border-[#777E90]`}
            >
              <option value="">{`${t('travelers.form.addToGroup')}`}</option>
              <option value="personalized">{`${t(
                'travelers.form.personalizedGroup'
              )}`}</option>
              {groups.map(group => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {fieldPersonalized && (
              <input
                name="addToGroup"
                type="text"
                onChange={handleChange}
                value={formData.addToGroup}
                placeholder={`${t('travelers.form.personalizedGroup')}`}
                className="w-1/2 h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 focus:outline-none focus:border-[#777E90] text-white"
              />
            )}
          </div>
          <input
            name="specialRequest"
            type="text"
            onChange={handleChange}
            value={formData.specialRequest}
            placeholder={`${t('travelers.form.special_request')}`}
            className="w-[100%] h-[50px] bg-[rgba(255,255,255,0.22)] rounded-full p-5 focus:outline-none focus:border-[#777E90] text-white"
          />
          <input
            name="description"
            type="text"
            onChange={handleChange}
            value={formData.description}
            placeholder={`${t('travelers.form.description')}`}
            className="w-[100%] h-[80px] bg-[rgba(255,255,255,0.22)] rounded-[33px] p-5 focus:outline-none focus:border-[#777E90] text-white"
          />
          {!TravelerId && (
            <div
              className="text-[#777E90] text-[14px] font-[510] mb-5 cursor-pointer"
              onClick={() => setOpenUploaderModal(true)}
            >
              {formData.profile_image !== ''
                ? `1 ${t('travelers.form.image_selected')}`
                : `+ ${t('travelers.form.add_picture')}`}
            </div>
          )}
          <div className="w-full flex flex-row items-center justify-center">
            <button
              className="w-full max-w-[360px] font-[760] text-[22px] bg-[var(--primary-background)] h-[50px] rounded-full text-white"
              disabled={
                !isFormValid || Object.values(fieldErrors).some(error => error)
              }
            >
              <span className="block scale-y-[0.8]">
                {t('travelers.form.save')}
              </span>
            </button>
          </div>
          {TravelerId && (
            <button
              className="w-full flex flex-row items-center justify-center text-red-500 mt-5"
              onClick={delteProfile}
            >
              {`${t('travelers.delete-profile')}`}
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
}
