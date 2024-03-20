import { CountryType, UploadPostModalProps } from '@typing/types';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import closebtn from '@icons/close-black.svg';
import cloudUpload from '@icons/cloudUpload.svg';
import { Form, Input, Uploader, SelectPicker } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';

const Textarea = React.forwardRef<HTMLTextAreaElement>((props, ref) => (
  <Input {...props} as="textarea" ref={ref} rows={4} />
));

const UploadPostModal = ({
  isOpen,
  close,
  currentUploaderKey,
  handleFileUpload,
  fileList,
  description,
  country,
  city,
  onChangeDescription,
  onChangeCountry,
  onChangeCity,
  callbackAndClose,
}: UploadPostModalProps) => {
  const [isNext, setIsNext] = useState(false);
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();

  // Aux states
  const [countries, setCountries] = React.useState<CountryType[]>([]);

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

  if (!isOpen) return null;

  return (
    <div
      className={`fixed w-screen h-screen inset-0 bg-black  z-50 lg:flex lg:justify-center lg:items-center lg:backdrop-blur-md lg:bg-transparent `}
    >
      <div className="lg:relative lg:bg-[#141416] lg:shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] lg:rounded-[16px] lg:p-10 lg:h-auto lg:w-fit lg:max-w-[90vw]">
        <button
          onClick={() => {
            setIsNext(false);
            close();
          }}
          className="float-right px-2 mt-4 lg:absolute lg:-right-10 lg:-top-10"
        >
          <Image src={closebtn} alt="close" className="lg:h-20 lg:w-20" />
        </button>
        <div className="flex flex-col justify-around items-center w-full h-full relative px-4 pt-20 lg:pt-0">
          {!isNext ? (
            <>
              <Uploader
                draggable
                listType="picture-text"
                name={currentUploaderKey}
                multiple
                onChange={files => {
                  if (files.length > 10)
                    handleFileUpload(currentUploaderKey, files.slice(-10));
                  else handleFileUpload(currentUploaderKey, files);
                }}
                fileList={fileList}
                action={''}
                accept="image/png, image/jpeg, image/png, image/jfif, image/webp"
                autoUpload={false}
                className="w-full h-fit max-h-[70vh] mb-3 flex flex-col items-center justify-center overflow-y-auto lg:scrollbar-hide"
              >
                <div className="flex flex-col gap-y-8 items-center mt-20 bg-transparent">
                  <Image
                    src={cloudUpload}
                    alt="cloud"
                    className="mx-auto my-2 block"
                  />
                  <div className="flex flex-col items-center gap-y-2 text-center">
                    <span className="text-white text-base font-bold">
                      {t('upload.drop_multi')}{' '}
                      <span className="text-[var(--primary-background)] underline cursor-pointer">
                        {t('upload.browse')}
                      </span>
                    </span>
                    <p className="text-[#676767] w-[232px] text-xs leading-6">
                      {t('upload.formats')} JPEG, PNG, JFIF, WEBP
                      <br /> (Max. 10 {t('agent.posts.images')})
                    </p>
                  </div>
                </div>
              </Uploader>
              <div>
                <button
                  disabled={fileList.length === 0}
                  onClick={() => setIsNext(true)}
                  className={`text-white  w-[361px] h-[59px] font-[760] flex items-center justify-center rounded-full ${
                    fileList.length > 0
                      ? 'bg-[var(--primary-background)]'
                      : 'bg-[#262626]'
                  }`}
                >
                  {t('agent.posts.next')}
                </button>
              </div>
            </>
          ) : (
            <div>
              <h1 className="font-medium text-xl ml-2 text-white">
                {t('agent.posts.title_description')}
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
                    onChange={v => onChangeCountry(v)}
                    placeholder={t('agent.posts.country')}
                    className={`profilecountrypbtn bg-transparent border w-full border-gray-500 rounded-3xl h-full px-4 text-white text-base outline-none flex cursor-pointer items-center`}
                    menuClassName="black-picker"
                  />
                  <Form.Control
                    className={`bg-transparent border border-gray-500 rounded-3xl py-4 px-4 text-white text-base outline-none w-full`}
                    placeholder={t('agent.posts.city')}
                    type="text"
                    name="city"
                    value={city}
                    onChange={v => onChangeCity(v)}
                    errorMessage={
                      city.length > 50
                        ? t('agent.editSections.errors.city')
                        : ''
                    }
                    style={{ width: '100%' }}
                  />
                </div>
              </Form>
              <button
                onClick={() => {
                  setIsNext(false);
                  callbackAndClose();
                }}
                className={`text-white mx-auto w-[361px] h-[59px] font-[760] flex items-center justify-center rounded-full ${
                  fileList.length > 0
                    ? 'bg-[var(--primary-background)]'
                    : 'bg-[#262626]'
                }`}
              >
                {t('agent.posts.upload')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default UploadPostModal;
