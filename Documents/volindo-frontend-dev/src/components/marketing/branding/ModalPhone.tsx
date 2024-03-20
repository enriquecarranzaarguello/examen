import { useState, useEffect } from 'react';
import MarketModal from '../MarketModal';
import styles from '@styles/marketing.module.scss';
import phoneCodes from '../../../common/data/countries/phoneCountries.json';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@context';
import {
  setPhone as setPhoneDispatch,
  setProfile,
} from '../../../context/slices/agentSlice';
import AgentService from '@services/AgentService';
import { useTranslation } from 'react-i18next';
import { AgentEditProfileType, ProfileType } from '@typing/types';

const ModalPhone = ({
  open = false,
  onClose,
  onSuccessfullUpdate,
  onError,
  withAddress = false,
}: {
  open: boolean;
  onClose: () => void;
  onSuccessfullUpdate: () => void;
  onError: () => void;
  withAddress?: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const agent_id = useAppSelector(state => state.agent.agent_id);
  const profile = useAppSelector(state => state.agent.profile);
  const dispatch = useAppDispatch();
  const phoneRegex = /^[0-9]{7,10}$/;
  const [phoneCode, setPhoneCode] = useState(phoneCodes[0].iso_code);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState<any>({
    address: '',
    city: '',
    state_province: '',
    zip_code: '',
    country: '',
  });
  const [phoneOk, setPhoneOk] = useState(false);
  const [addressOk, setAddressOk] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);

  const handleSubmit = () => {
    if (withAddress) {
      const updatedProfile: AgentEditProfileType = {
        ...profile,
        phone_country_code: phoneCode,
        phone_number: phone,
        address: address.address,
        city: address.city,
        state_province: address.state_province,
        zip_code: address.zip_code,
        country: address.country,
      };
      AgentService.editAgentProfile(agent_id, updatedProfile)
        .then(res => {
          const newProfile: ProfileType = {
            photo: profile.photo,
            ...updatedProfile,
          };
          dispatch(setProfile(newProfile));
          onSuccessfullUpdate();
        })
        .catch(ex => {
          console.error(ex);
          onError();
        });
    } else {
      AgentService.updatePhoneNumber(agent_id, phone, phoneCode)
        .then(res => {
          dispatch(
            setPhoneDispatch({
              phone_number: phone,
              phone_country_code: phoneCode,
            })
          );
          onSuccessfullUpdate();
        })
        .catch(err => {
          console.error(err);
          onError();
        });
    }
  };

  const handlePhoneChange = (e: any) => {
    const phone = e.target.value.replace(/[^0-9-]/g, '');
    setPhone(phone);
    setPhoneOk(phoneRegex.test(phone));
  };

  const handleAddress = (e: any) => {
    setAddress((prev: any) => {
      return { ...prev, address: e.target.value };
    });
  };

  const handleCity = (e: any) => {
    setAddress((prev: any) => {
      return { ...prev, city: e.target.value };
    });
  };

  const handleState = (e: any) => {
    setAddress((prev: any) => {
      return { ...prev, state_province: e.target.value };
    });
  };

  const handleCountry = (e: any) => {
    setAddress((prev: any) => {
      return { ...prev, country: e.target.value };
    });
  };
  const handleZip = (e: any) => {
    const zip = e.target.value.replace(/[^0-9-]/g, '');
    setAddress((prev: any) => {
      return { ...prev, zip_code: zip };
    });
  };

  useEffect(() => {
    const getCountriesData = async () => {
      const countriesResponse = await fetch(
        `/data/countries/${i18n.language}/countriesData.json`
      );
      const countriesObject = await countriesResponse.json();
      setCountries(countriesObject);
    };
    getCountriesData();
  }, [i18n.language]);

  useEffect(() => {
    const getActualIsoCode = () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const apiUrl =
          'https://api.bigdatacloud.net/data/reverse-geocode-client';

        axios
          .get(`${apiUrl}?latitude=${latitude}&longitude=${longitude}`)
          .then(response => {
            const isoCode = response.data.countryCode;
            const countryPhone = phoneCodes.find(
              item => item.iso_code === isoCode
            );
            const countryCountries = countries.find(
              item => item.iso_code === isoCode
            );

            if (countryPhone) setPhoneCode(countryPhone.code);
            else setPhoneCode(phoneCodes[0].code);

            if (countryCountries)
              setAddress((prev: any) => {
                return { ...prev, country: countryCountries.country_name };
              });
            else
              setAddress((prev: any) => {
                return { ...prev, country: countries[0].country_name };
              });
          })
          .catch(() => {
            setPhoneCode(phoneCodes[0].code);
            setAddress((prev: any) => {
              return { ...prev, country: countries[0].country_name };
            });
          });
      });
    };
    if (countries.length !== 0) getActualIsoCode();
  }, [countries]);

  useEffect(() => {
    if (withAddress) {
      if (
        address.address &&
        address.city &&
        address.state_province &&
        address.zip_code &&
        address.country
      )
        setAddressOk(true);
      else setAddressOk(false);
    }
  }, [address, withAddress]);

  return (
    <MarketModal
      open={open}
      onClose={onClose}
      className={withAddress ? styles.modalPhone__noMt : ''}
    >
      <MarketModal.Title>
        {t('marketing.branding.talkAdvisor.details')}
      </MarketModal.Title>
      <MarketModal.Content>
        <MarketModal.Paragraph>
          {t('marketing.branding.talkAdvisor.moreDetails')}
        </MarketModal.Paragraph>
        <div className={styles.modalPhone__phone}>
          <select
            className={`${styles.input} ${styles.input__select}`}
            value={phoneCode}
            onChange={e => setPhoneCode(e.target.value)}
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
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            className={styles.input}
            placeholder={t('agent.phone_number') || ''}
          />
        </div>
        {withAddress ? (
          <>
            <input
              type="text"
              value={address.address}
              onChange={handleAddress}
              className={styles.input}
              placeholder={t('agent.address') || ''}
            />
            <input
              type="text"
              value={address.city}
              onChange={handleCity}
              className={styles.input}
              placeholder={t('agent.city') || ''}
            />
            <input
              type="text"
              value={address.state_province}
              onChange={handleState}
              className={styles.input}
              placeholder={t('agent.state_province') || ''}
            />
            <div className={styles.modalPhone__phone}>
              <input
                type="text"
                value={address.zip_code}
                onChange={handleZip}
                className={styles.input}
                maxLength={5}
                placeholder={t('travelers.zip') || ''}
              />
              <select
                className={`${styles.input} ${styles.input__select}`}
                value={address.country}
                onChange={handleCountry}
              >
                {countries.map((country: any, index) => {
                  return (
                    <option
                      className={styles.input__option}
                      key={index}
                      value={country.country_name}
                    >
                      {country.country_name}
                    </option>
                  );
                })}
              </select>
            </div>
          </>
        ) : null}
      </MarketModal.Content>
      <MarketModal.Button
        disabled={!phoneOk || (withAddress && !addressOk)}
        onClick={handleSubmit}
      >
        {t('auth.continue')}
      </MarketModal.Button>
    </MarketModal>
  );
};

export default ModalPhone;
