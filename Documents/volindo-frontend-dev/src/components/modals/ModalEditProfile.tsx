import React, { FC, useMemo } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { setProfile, useAppDispatch, useAppSelector } from '@context';

import phoneCodes from '../../common/data/countries/phoneCountries.json';

import type {
  AgentEditProfileType,
  CountryType,
  ProfileType,
} from '@typing/types';

import IconCloseBlack from '@icons/close-black.svg';
import { Form, SelectPicker, TagPicker, Input, Schema } from 'rsuite';
import {
  agentTypeSpecialization,
  languagesCatalogue,
} from 'src/common/data/profileCatalogs';
import AgentService from '@services/AgentService';
import { LoadingSpinner } from '../profile/atoms';

const Textarea = React.forwardRef<HTMLTextAreaElement>((props, ref) => (
  <Input {...props} as="textarea" ref={ref} rows={2} />
));

const ModalEditProfile: FC<{
  open: boolean;
  onClose: () => void;
  launchPopup: (_type: 'info' | 'loading', _title: string) => void;
}> = ({ open, onClose, launchPopup }) => {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const formRef = React.useRef<any>(null);
  const dispatch = useAppDispatch();
  const [inputType, setInputType] = React.useState<'text' | 'date'>('text');
  const handleFocus = () => setInputType('date');
  const handleBlur = () => setInputType('text');
  const agent = useAppSelector(state => state.agent);
  const [countries, setCountries] = React.useState<CountryType[]>([]);
  const [formValue, setFormValue] = React.useState<AgentEditProfileType>({
    ...agent.profile,
  });
  const [formError, setFormError] = React.useState<Record<string, any>>({});

  // AUX states
  const [updating, setUpdating] = React.useState(false);

  const { StringType } = Schema.Types;

  const model = Schema.Model({
    full_name: StringType()
      .isRequired(t('agent.editSections.errors.full_name_min') || '')
      .maxLength(100, t('agent.editSections.errors.full_name') || ''),
    address: StringType().maxLength(
      100,
      t('agent.editSections.errors.address') || ''
    ),
    city: StringType().maxLength(50, t('agent.editSections.errors.city') || ''),
    state_province: StringType().maxLength(
      50,
      t('agent.editSections.errors.state_province') || ''
    ),
    zip_code: StringType().maxLength(
      5,
      t('agent.editSections.errors.zip_code') || ''
    ),
    phone_number: StringType().pattern(
      /^[0-9]{7,10}$/,
      t('agent.editSections.errors.phone_number') || ''
    ),
    web_site: StringType().isURL(t('agent.editSections.errors.web_site') || ''),
    url_facebook: StringType().pattern(
      /^https?:\/\/(?:www\.)?facebook\.com.*$/,
      t('agent.editSections.errors.url_facebook') || ''
    ),
    url_instagram: StringType().pattern(
      /^https?:\/\/(?:www\.)?instagram\.com.*$/,
      t('agent.editSections.errors.url_instagram') || ''
    ),
    url_whatsapp: StringType().pattern(
      /^https?:\/\/(?:www\.)?wa\.me.*$/,
      t('agent.editSections.errors.url_whatsapp') || ''
    ),
    description: StringType().maxLength(
      1000,
      t('agent.editSections.errors.description') || ''
    ),
  });

  const agentTypes = useMemo(
    () =>
      agentTypeSpecialization.map(type => {
        return {
          label: t(`agent.typeAgent.${type}`),
          value: type,
        };
      }),
    []
  );

  const languages = useMemo(
    () =>
      languagesCatalogue.map(language => {
        return {
          label: t(`languages.${language}`),
          value: language,
        };
      }),
    []
  );

  const handleFormChange = (
    updatedFormValue: Record<string, any>,
    _event?: React.SyntheticEvent<Element, Event>
  ) => {
    // * Validation AgentType up to 5
    if (updatedFormValue.type_specialize.length > 5)
      updatedFormValue.type_specialize.pop();
    // * Validation AreaSpecialize up to 5
    if (updatedFormValue.area_specialize.length > 5)
      updatedFormValue.area_specialize.pop();
    // * Validation Languages up to 20
    if (updatedFormValue.languages.length > 20)
      updatedFormValue.languages.pop();
    setFormValue({ ...formValue, ...updatedFormValue });
  };

  React.useEffect(() => {
    const getCountriesData = async () => {
      const countriesResponse = await fetch(
        `/data/countries/${i18n.language}/countriesData.json`
      );
      const countriesObject = await countriesResponse.json();
      setCountries(countriesObject);
    };
    getCountriesData();
    if (formValue.phone_country_code === '') {
      setFormValue({
        ...formValue,
        phone_country_code: '+376',
      });
    }
  }, [i18n.language]);

  React.useEffect(() => {
    const setCountryAgentOnFirstLoad = async () => {
      const countryAgent = agent.profile.country;
      if (countryAgent) {
        const exist = countries.some(
          country => country.country_name === countryAgent
        );
        if (!exist) {
          const languageToSearch = i18n.language == 'es' ? 'en' : 'es';
          const countriesResponse = await fetch(
            `/data/countries/${languageToSearch}/countriesData.json`
          );
          const countriesObject = await countriesResponse.json();

          const countryCode = countriesObject.find(
            (country: any) => country.country_name === countryAgent
          )?.iso_code;

          const correctCountry = countries.find(
            country => country.iso_code === countryCode
          )?.country_name;

          setFormValue({
            ...formValue,
            country: correctCountry || '',
          });
        }
      }
    };
    if (countries.length != 0) setCountryAgentOnFirstLoad();
  }, [agent.profile.country, countries, i18n.language]);

  const handleSubmit = async (_e: any) => {
    if (Object.keys(formError).length != 0) {
      launchPopup('info', t('agent.editSections.errors.inputs') || '');
      return;
    }

    setUpdating(true);
    AgentService.editAgentProfile(agent.agent_id, formValue)
      .then(res => {
        if (res.status === 422) {
          launchPopup('info', t('agent.editSections.errors.description') || '');

          return;
        }
        launchPopup('info', t('agent.editSections.success') || '');
        const profile: ProfileType = {
          photo: agent.profile.photo,
          ...formValue,
        };
        dispatch(setProfile(profile));
        onClose();
      })
      .then(ex => {
        console.error(ex);
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  if (!open) return null;

  return (
    <>
      <div
        data-testid="edit-modal"
        className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50"
      >
        <div className="relative rounded-[16px] bg-black shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-full h-full px-6 md:h-[calc(100vh-36px)] md:w-[639px] lg:px-[99px] text-white">
          <button
            className="absolute top-[8px] right-[14px] md:-top-5 md:-right-6"
            data-testid="edit-modal-close"
            onClick={onClose}
          >
            <Image className=" " alt="icon" src={IconCloseBlack} />
          </button>

          <div className="w-full flex justify-center flex-col items-center h-full pb-3 overflow-hidden overflow-y-scroll scrollbar-hide">
            <h1
              data-testid="edit-modal-title"
              className="mr-auto text-[44px] font-[760] scale-y-[0.8] text-white mt-11 mb-4 md:mr-0"
            >
              {t('common.edit-modal-title')}
            </h1>
            <div className="flex justify-center w-full h-full scrollbar-hide overflow-y-scroll scroll-smooth">
              <Form
                fluid
                formValue={formValue}
                onChange={handleFormChange}
                ref={formRef}
                className="flex flex-col gap-[16px] w-auto xxs:w-[232px] xs:w-full"
                model={model}
                onCheck={setFormError}
              >
                <h2 className="font-medium text-lg ml-2">
                  {t('agent.editSections.name')}
                </h2>

                <Form.Control
                  data-testid="edit-modal-name"
                  className={`bg-[rgba(255,255,255,0.22)] border ${
                    formValue.full_name
                      ? 'border-transparent'
                      : 'border-red-500'
                  } rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none`}
                  placeholder={t('agent.fullname')}
                  type="text"
                  name="full_name"
                  value={formValue.full_name || ''}
                  errorMessage={formError.full_name}
                />

                <Form.Control
                  data-testid="edit-modal-address"
                  className={`bg-[rgba(255,255,255,0.22)] border ${
                    formValue.address ? 'border-transparent' : 'border-red-500'
                  } border-transparent rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none`}
                  type="text"
                  placeholder={t('agent.address')}
                  name="address"
                  value={formValue.address || ''}
                  errorMessage={formError.address}
                />
                <div className="flex gap-[16px] flex-wrap ">
                  <Form.Control
                    className={`bg-[rgba(255,255,255,0.22)] border ${
                      formValue.city ? 'border-transparent' : 'border-red-500'
                    } rounded-[90px] py-4 px-4 flex-1 text-white text-base font-[510] outline-none`}
                    type="text"
                    placeholder={t('agent.city')}
                    name="city"
                    value={formValue.city || ''}
                    errorMessage={formError.city}
                  />
                  <Form.Control
                    className={`bg-[rgba(255,255,255,0.22)] border ${
                      formValue.state_province
                        ? 'border-transparent'
                        : 'border-red-500'
                    } rounded-[90px] py-4 px-4 flex-1 text-white text-base font-[510] outline-none`}
                    type="text"
                    placeholder={t('agent.state_province')}
                    name="state_province"
                    value={formValue.state_province || ''}
                    errorMessage={formError.state_province}
                  />
                  <div className="flex flex-1 gap-[16px] xs:flex-wrap">
                    <Form.Control
                      placement="bottomStart"
                      name="country"
                      accepter={SelectPicker}
                      cleanable={false}
                      data={countries.map(item => ({
                        label: item.country_name,
                        value: item.country_name,
                      }))}
                      placeholder={t('travelers.country')}
                      menuClassName="black-picker"
                      className={`profilecountrypbtn bg-[rgba(255,255,255,0.22)] border w-full border-transparent rounded-[90px] py-[10px] px-4 text-white text-base font-[510] outline-none flex-1 cursor-pointer ${
                        formValue.country
                          ? 'border-transparent'
                          : 'border-red-500'
                      }`}
                    />
                    <Form.Control
                      className={`bg-[rgba(255,255,255,0.22)] border ${
                        formValue.zip_code
                          ? 'border-transparent'
                          : 'border-red-500'
                      } rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none flex-1 xs:w-[135px]`}
                      type="number"
                      placeholder={t('travelers.zip')}
                      name="zip_code"
                      value={formValue.zip_code || ''}
                      maxLength={5}
                      errorMessage={formError.zip_code}
                    />
                  </div>
                </div>

                <h2 className="font-medium text-lg ml-2">
                  {t('agent.editSections.details')}
                </h2>
                <div className="flex gap-2">
                  <select
                    className={`xs:w-[130px] bg-[rgba(255,255,255,0.22)] border ${
                      formValue.phone_country_code
                        ? 'border-transparent'
                        : 'border-red-500'
                    } rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none`}
                    value={formValue.phone_country_code || ''}
                    onChange={e =>
                      setFormValue({
                        ...formValue,
                        phone_country_code: e.target.value,
                      })
                    }
                  >
                    {phoneCodes.map((country: any, index) => {
                      return (
                        <option
                          className="bg-[#151313d4] text-white scrollbar-hide backdrop-blur-lg text-lg"
                          key={index}
                          value={country.code}
                        >
                          {country.iso_code} {country.code}
                        </option>
                      );
                    })}
                  </select>

                  <Form.Control
                    className={`bg-[rgba(255,255,255,0.22)] border ${
                      formValue.phone_number
                        ? 'border-transparent'
                        : 'border-red-500'
                    } rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none flex-1 xs:w-[145px] xs:text-[14px]`}
                    type="tel"
                    placeholder={t('agent.phone_number')}
                    name="phone_number"
                    value={formValue.phone_number || ''}
                    errorMessage={formError.phone_number}
                  />
                </div>

                <Form.Control
                  data-testid="edit-modal-email"
                  className={`bg-[rgba(255,255,255,0.22)] border border-transparent cursor-not-allowed rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none col-span-2`}
                  type="email"
                  placeholder={t('agent.email')}
                  name="email"
                  value={agent.email}
                  readOnly
                />

                <div className="flex gap-2  items-center text-white/50">
                  <Form.Control
                    className={`bg-[rgba(255,255,255,0.22)] border ${
                      formValue.birthday
                        ? 'border-transparent'
                        : 'border-red-500'
                    } rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none xs:w-[140px]`}
                    type={inputType}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={t('agent.birthday')}
                    name="birthday"
                    value={formValue.birthday || ''}
                  />

                  <Form.Control
                    className={`bg-[rgba(255,255,255,0.22)] border ${
                      formValue.web_site
                        ? 'border-transparent'
                        : 'border-red-500'
                    } rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none flex-1 xs:w-[135px] xs:text-[12px]`}
                    type="text"
                    required={false}
                    placeholder={t('agent.website')}
                    name="web_site"
                    value={formValue.web_site || ''}
                    errorMessage={formError.web_site}
                  />
                </div>
                <h2 className="font-medium text-lg ml-2">
                  {t('agent.editSections.social')}
                </h2>
                <Form.Control
                  className={`bg-[rgba(255,255,255,0.22)] border ${
                    formValue.url_facebook
                      ? 'border-transparent'
                      : 'border-red-500'
                  } rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none`}
                  type="text"
                  placeholder={t('agent.urlFacebook')}
                  name="url_facebook"
                  value={formValue.url_facebook || ''}
                  errorMessage={formError.url_facebook}
                />
                <Form.Control
                  className={`bg-[rgba(255,255,255,0.22)] border ${
                    formValue.url_instagram
                      ? 'border-transparent'
                      : 'border-red-500'
                  } rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none`}
                  type="text"
                  placeholder={t('agent.urlInstagram')}
                  name="url_instagram"
                  value={formValue.url_instagram || ''}
                  errorMessage={formError.url_instagram}
                />
                <Form.Control
                  className={`bg-[rgba(255,255,255,0.22)] border ${
                    formValue.url_whatsapp
                      ? 'border-transparent'
                      : 'border-red-500'
                  } rounded-[90px] py-4 px-4 text-white text-base font-[510] outline-none`}
                  type="text"
                  placeholder={t('agent.urlWhatsApp')}
                  name="url_whatsapp"
                  value={formValue.url_whatsapp || ''}
                  errorMessage={formError.url_whatsapp}
                />
                <h2 className="font-medium text-lg ml-2">
                  {t('agent.editSections.about')}
                </h2>
                <Form.Control
                  placement="bottomStart"
                  name="languages"
                  accepter={TagPicker}
                  data={languages.map(item => ({
                    label: item.label,
                    value: item.value,
                  }))}
                  placeholder={t('agent.languages')}
                  className={`profilecountrypbtn check bg-[rgba(255,255,255,0.22)] border w-full border-transparent rounded-[16px] py-[10px] px-4 text-white text-base font-[510] outline-none flex-1 cursor-pointer ${
                    formValue.languages.length !== 0
                      ? 'border-transparent'
                      : 'border-red-500'
                  }`}
                />
                <Form.Control
                  placement="bottomStart"
                  name="type_specialize"
                  accepter={TagPicker}
                  data={agentTypes.map(item => ({
                    label: item.label,
                    value: item.value,
                  }))}
                  placeholder={t('agent.tripsSpecialize')}
                  className={`profilecountrypbtn check bg-[rgba(255,255,255,0.22)] border w-full border-transparent rounded-[16px] py-[10px] px-4 text-white text-base font-[510] outline-none flex-1 cursor-pointer ${
                    formValue.type_specialize.length !== 0
                      ? 'border-transparent'
                      : 'border-red-500'
                  }`}
                />
                <Form.Control
                  placement="bottomStart"
                  name="area_specialize"
                  accepter={TagPicker}
                  data={countries.map(item => ({
                    label: item.country_name,
                    // SEE SOMETHING HERE
                    value: item.id,
                  }))}
                  placeholder={t('agent.areaSpecialize')}
                  className={`profilecountrypbtn check bg-[rgba(255,255,255,0.22)] border w-full border-transparent rounded-[90px] py-[10px] px-4 text-white text-base font-[510] outline-none flex-1 cursor-pointer ${
                    formValue.area_specialize.length !== 0
                      ? 'border-transparent'
                      : 'border-red-500'
                  }`}
                />

                <Form.Control
                  className={`min-h-[132px] bg-[rgba(255,255,255,0.22)] border ${
                    formValue.description
                      ? 'border-transparent'
                      : 'border-red-500'
                  } rounded-[16px] py-4 px-4 text-white text-base font-[510] outline-none`}
                  accepter={Textarea}
                  placeholder={t('agent.description')}
                  name="description"
                  value={formValue.description || ''}
                  errorMessage={formError.description}
                />

                <div className="flex justify-center pt-6 pb-6">
                  <button
                    data-testid="edit-modal-submit"
                    onClick={handleSubmit}
                    disabled={updating}
                    className="bg-whiteLabelColor w-[352px] h-[48px] rounded-[90px] text-white md:text-black mx-auto text-[20px] font-[760] disabled:cursor-not-allowed customTailwind"
                  >
                    <span className="block scale-y-[0.8]">
                      {updating ? <LoadingSpinner /> : t('common.save')}
                    </span>
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalEditProfile;
