import Image from 'next/image';
import { FC, forwardRef, useEffect, useState } from 'react';
import closebtn from '@icons/close-black.svg';
import { Form, Input, SelectPicker } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { CountryType } from '@typing/types';
import { useSession } from 'next-auth/react';
import AgentService from '@services/AgentService';
import { LoadingSpinner } from '../profile/atoms';

const Textarea = forwardRef<HTMLTextAreaElement>((props, ref) => (
  <Input {...props} as="textarea" ref={ref} rows={4} />
));

const ModalEditPost: FC<{
  open: boolean;
  close: () => void;
  description: string;
  onChangeDescription: (_v: string) => void;
  country: string;
  onChangeCountry: (_v: string) => void;
  city: string;
  onChangeCity: (_v: string) => void;
  uuid: string;
  launchPopup: (_type: 'info' | 'loading', _title: string) => void;
}> = ({
  open,
  close,
  description,
  country,
  city,
  onChangeDescription,
  onChangeCountry,
  onChangeCity,
  uuid,
  launchPopup,
}) => {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  // Aux states
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [disable, setDisable] = useState(false);

  const handleSubmit = () => {
    setDisable(true);
    AgentService.updatePostByUUID(uuid, description, country, city)
      .then(res => {
        if (!res.status) {
          //All good
          launchPopup('info', t('agent.posts.successEdit'));
        } else {
          launchPopup('info', t('agent.posts.errorEdit'));
        }
      })
      .catch(err => {
        console.error(err);
        launchPopup('info', t('agent.posts.errorEdit'));
      })
      .finally(() => {
        close();
        onChangeDescription('');
        onChangeCountry('');
        onChangeCity('');
        setDisable(false);
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
    const setCountryAgentOnFirstLoad = async () => {
      if (country) {
        const exist = countries.some(
          countryData => countryData.country_name === country
        );
        if (!exist) {
          const languageToSearch = i18n.language === 'es' ? 'en' : 'es';
          const countriesResponse = await fetch(
            `/data/countries/${languageToSearch}/countriesData.json`
          );
          const countriesObject = await countriesResponse.json();

          const countryCode = countriesObject.find(
            (countryData: any) => countryData.country_name === country
          )?.iso_code;

          const correctCountry = countries.find(
            country => country.iso_code === countryCode
          )?.country_name;

          onChangeCountry(correctCountry || '');
        }
      }
    };
    if (countries.length != 0) setCountryAgentOnFirstLoad();
  }, [country, countries, i18n.language, onChangeCountry]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 w-screen h-screen bg-black  z-50 lg:flex lg:justify-center lg:items-center lg:backdrop-blur-md lg:bg-transparent `}
    >
      <div className="lg:relative lg:bg-[#141416] lg:shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] lg:rounded-[16px] lg:p-10 lg:h-auto lg:w-fit lg:max-w-[90vw]">
        <button
          onClick={close}
          className="float-right px-2 mt-4 lg:absolute lg:-right-10 lg:-top-10"
        >
          <Image src={closebtn} alt="close" className="lg:h-20 lg:w-20" />
        </button>
        <div className="flex flex-col justify-around items-center w-full h-full relative px-4 pt-20 lg:pt-0">
          <h1 className="font-medium text-xl ml-2 text-white">
            {t('agent.posts.edit_inst')}
          </h1>
          <Form>
            <Form.Control
              className={`bg-transparent border border-gray-500 rounded-3xl py-4 px-4 mt-5 text-white text-base outline-none w-full`}
              accepter={Textarea}
              placeholder={t('agent.posts.placeholder_description')}
              name="description"
              value={description}
              onChange={v => onChangeDescription(v)}
              errorMessage={
                description.length > 150
                  ? t('agent.posts.error_description')
                  : ''
              }
              style={{ width: '100%' }}
            />
            <div className="grid gap-3 grid-cols-2 my-3">
              <Form.Control
                placement="bottomStart"
                name="country"
                accepter={SelectPicker}
                cleanable={false}
                value={country}
                data={countries.map(item => ({
                  label: item.country_name,
                  value: item.country_name,
                }))}
                menuClassName="black-picker"
                onChange={v => onChangeCountry(v)}
                placeholder={t('agent.posts.country')}
                className={`profilecountrypbtn bg-transparent border w-full border-gray-500 rounded-3xl h-full px-4 text-white text-base outline-none flex cursor-pointer items-center`}
              />
              <Form.Control
                className={`bg-transparent border border-gray-500 rounded-3xl py-4 px-4 text-white text-base outline-none w-full`}
                placeholder={t('agent.posts.city')}
                type="text"
                name="city"
                value={city}
                onChange={v => onChangeCity(v)}
                errorMessage={
                  city.length > 50 ? t('agent.editSections.errors.city') : ''
                }
                style={{ width: '100%' }}
              />
            </div>
          </Form>
          <button
            onClick={handleSubmit}
            disabled={disable}
            className="text-white mx-auto w-[361px] h-[59px] font-[760] flex items-center justify-center rounded-full bg-[var(--primary-background)]  disabled:cursor-not-allowed customTailwind"
          >
            {disable ? <LoadingSpinner /> : t('agent.posts.update')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditPost;
