import { useState, useEffect, useRef } from 'react';
import {
  SEO,
  UploaderModal,
  SupplierMapWrapper,
  GeneralButton,
  TitleAndDescription,
  ThankYouContainer,
} from '@components';
import nextI18nextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useTranslation } from 'next-i18next';
import { Form, Rate, SelectPicker, Loader, CheckPicker } from 'rsuite';
import { useSession } from 'next-auth/react';

import { authOptions } from '../../api/auth/[...nextauth]';
import config from '@config';
import { SupplierSchema, initialSupplierFormValues } from '@schemas';

import Image from 'next/image';
import { useRouter } from 'next/router';
import supplierbg from '@images/supplierbg.svg';
import supplierbgWL from '@images/supplierbgWL.svg';
import supplierAdvenIconMobile from '@icons/supplierAdvenIconMobile.svg';
import suppierHomeIcon from '@icons/suppierHomeIcon.svg';
import suppierTransportIcon from '@icons/suppierTransportIcon.svg';
import supplierLuxuryIcon from '@icons/supplierLuxuryIcon.svg';
import supplierExtraIcon from '@icons/supplierExtraIcon.svg';
import volindoVerified from '@icons/volindoVerified.svg';
import supplierAdvenIcon from '@icons/supplierAdvenIcon.svg';
import mobileSuppierbg_1 from '@icons/mobileSuppierbg_1.svg';
import mobileSuppierbg_2 from '@icons/mobileSuppierbg_2.svg';
import instagramSupplierIcon from '@icons/instagramSupplierIcon.svg';
import facebookSupplierIcon from '@icons/facebookSupplierIcon.svg';
import supplierOtherSocial from '@icons/supplierOtherSocial.svg';
import globeSuppierIcon from '@icons/globeSuppierIcon.svg';
import downloadBlack from '@icons/downloadBlack.svg';
import coffieIcon from '@icons/amenityIcons/coffieIcon.svg';
import barIcon from '@icons/amenityIcons/barIcon.svg';
import wifiIcon from '@icons/amenityIcons/wifiIcon.svg';
import plus18 from '@icons/amenityIcons/plus18.svg';
import accessIcon from '@icons/amenityIcons/accessIcon.svg';
import balconyIcon from '@icons/amenityIcons/balconyIcon.svg';
import poolIcon from '@icons/amenityIcons/poolIcon.svg';
import shuttleIcon from '@icons/amenityIcons/shuttleIcon.svg';
import tvIcon from '@icons/amenityIcons/tvIcon.svg';
import gymIcon from '@icons/amenityIcons/gymIcon.svg';
import kitchenIcon from '@icons/amenityIcons/kitchenIcon.svg';
import spaIcon from '@icons/amenityIcons/spaIcon.svg';
import sofaIcon from '@icons/amenityIcons/sofaIcon.svg';
import copyIcon from '@icons/copy.svg';
import {
  SupplierDataType,
  UploadedFilesType,
  Amenity,
  SupplierImagesType,
  SupplierImageMetadataType,
  NextPageWithLayout,
} from '@typing/types';
import { FileType } from 'rsuite/esm/Uploader';
import axios from 'axios';
import InfoPopup from 'src/components/popups/InfoPopup';
import { getLayout } from '@layouts/MainLayout';
import countryDataEN from '../../../../public/data/countries/en/countriesData.json';
import countryDataES from '../../../../public/data/countries/es/countriesData.json';
import BigPin from '@icons/marketingIcons/big-pin.svg';
import whitelabellogoBigger from '@icons/whitelabellogoBigger.svg';

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
      countries,
    },
  };
};

const Suppliers: NextPageWithLayout = ({ countries }: any) => {
  const formRef = useRef<any>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [additionalLinks, setAdditionalLinks] = useState<string[]>([]);
  const [currentUploaderKey, setCurrentUploaderKey] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [openUploaderModal, setOpenUploaderModal] = useState(false);
  const [fileType, setFileType] = useState<'All' | 'Images'>('All');
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState('');

  const [windowSize, setWindowSize] = useState(0);
  const [supplersTab, setSuppliersTab] = useState('home');

  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  } | null>(null);

  const { data: session } = useSession();

  const formTranslations = {
    required: t('valid.required'),
    email: t('valid.email'),
    only_letter: 'Only letters are allowed',
    min_length: 'Max of 12 characters',
    only_num: 'Only numbers are allowed',
  };
  const checkWL = config.WHITELABELNAME === 'Volindo';
  const checkIconWL = checkWL ? BigPin : whitelabellogoBigger;

  type FieldInteractionsType = {
    [key: string]: boolean;
  };

  const addpeople = () => {
    setNumberOfPeople(numberOfPeople + 1);
    setFormValue((prevSupplierDataType: any) => ({
      ...prevSupplierDataType,
      number_of_people_permitted: numberOfPeople + 1,
    }));
  };

  const removepeople = () => {
    if (numberOfPeople > 0) {
      setNumberOfPeople(numberOfPeople - 1);
      setFormValue((prevSupplierDataType: any) => ({
        ...prevSupplierDataType,
        number_of_people_permitted: numberOfPeople - 1,
      }));
    }
  };

  const handleSupplierSelect = (supplier: string) => {
    setSelectedSupplier(supplier);
    setFormValue({ ...formData, selectedSupplier: supplier });
  };

  const tabs = [
    'home',
    'generalDetials',
    'supplierDetails',
    'supplierPayment',
    'thankYou',
  ];

  const paymentMethod = ['Paypal', 'Bank'].map(item => ({
    label: item,
    value: item,
  }));

  const showComingSoonText = (supplier: string) => {
    if (supplier === 'extras') {
      setShowComingSoon(true);
      setTimeout(() => {
        setShowComingSoon(false);
      }, 4000); // Ocultar después de 3 segundos (ajusta el tiempo según tus necesidades)
    }
  };

  const currentTabIndex = tabs.indexOf(supplersTab);
  const currentStep = currentTabIndex + 1;

  const [isFormValid, setIsFormValid] = useState(false);
  const [fieldInteractions, setFieldInteractions] =
    useState<FieldInteractionsType>({});

  const handleFieldInteraction = (fieldName: any) => {
    setFieldInteractions(prevInteractions => ({
      ...prevInteractions,
      [fieldName]: true,
    }));
  };

  const cancellationData = [
    {
      label: 'Full refund within 30min after booking',
      value: 'Full refund within 30min after booking',
    },
    {
      label: 'Fully refundable up to 24h before check-in',
      value: 'Fully refundable up to 24h before check-in',
    },
    {
      label: 'Full refund within 30min before checkin/start time',
      value: 'Full refund within 30min before checkin/start time',
    },
    {
      label: 'Partial refund no less than 24h',
      value: 'Partial refund no less than 24h',
    },
    {
      label: 'Partial refund within 30min before checkin/start time',
      value: 'pPartial refund within 30min before checkin/start time',
    },
    {
      label: 'Partial refund within 30min after booking',
      value: 'Partial refund within 30min after booking',
    },
    { label: 'No refund', value: 'No refund' },
  ].map(item => ({ label: item.label, value: item.value }));

  const handleNextClick = () => {
    const nextTabIndex = currentTabIndex + 1;
    if (nextTabIndex >= tabs.length) {
      return;
    }
    setSuppliersTab(tabs[nextTabIndex]);

    const isMobile = window.innerWidth <= 768; // Check for mobile

    if (isMobile) {
      // Scroll up
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackClick = () => {
    if (supplersTab === tabs[0]) {
      router.back();
    }

    const prevTabIndex = currentTabIndex - 1;
    if (prevTabIndex < 0) {
      // TODO: handle when there are no more tabs to show
      return;
    }
    setSuppliersTab(tabs[prevTabIndex]);
  };

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [formData, setFormValue] = useState<SupplierDataType>(
    initialSupplierFormValues
  );

  useEffect(() => {
    const savedFormValues = localStorage.getItem('formDatas');
    if (savedFormValues) {
      setFormValue(JSON.parse(savedFormValues));
    }
  }, []);

  const handleSubmit = async (
    checkStatus: boolean,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (formData.payment_method === '' && formData.cancel_policies === '') {
      setOpenPopup(true);
      setPopupTitle(t('suppliers.messages.methodAndPolicy') || '');
      return;
    }

    setLoading(true);
    setLoadingText(`${t('suppliers.uploadInfo')}...`);

    const formPayload = new FormData();
    // Append each property of formData to formPayload
    for (const key in formData) {
      const value = formData[key];
      if (value instanceof Array) {
        if (value.length > 0 && value[0] instanceof File) {
          // Handle file inputs (e.g., images)
          value.forEach((file, index) => {
            formPayload.append(`${key}[${index}]`, file);
            formPayload.append(`${key}[${index}-name]`, file.name);
          });
        } else {
          // Handle array of text inputs
          value.forEach((item, index) => {
            formPayload.append(`${key}[${index}]`, item);
          });
        }
      } else {
        formPayload.append(key, value);
      }
    }
    if (selectedLocation) {
      formPayload.append('address', selectedLocation.address);
      formPayload.append('supplier_city', selectedLocation.city);
      formPayload.append('country_id', selectedLocation.country);
      formPayload.append('supplier_lat', selectedLocation.lat.toString());
      formPayload.append('supplier_long', selectedLocation.lng.toString());
    }

    const imagesToUpload: SupplierImagesType[] = [];
    let totalImages = 0;
    for (const key in uploadedFiles) {
      const metadata: SupplierImageMetadataType[] = [];

      for (const file of uploadedFiles[key]) {
        totalImages++;
        metadata.push({
          extension: file.name?.split('.').pop() || 'jpeg',
          filename: file.name || 'name',
          contentType: file.blobFile?.type || 'image/jpeg',
        });
      }

      const setImagesToUpload: SupplierImagesType = {
        typeImages: key,
        imagesFiles: uploadedFiles[key],
        metadata: metadata,
      };

      imagesToUpload.push(setImagesToUpload);
    }

    if (totalImages === 0) {
      setOpenPopup(true);
      setPopupTitle(t('suppliers.messages.imageAlert') || '');
      setLoading(false);
      return;
    }

    imagesToUpload.forEach(imageInfo => {
      formPayload.append(
        imageInfo.typeImages,
        JSON.stringify(imageInfo.metadata)
      );
    });

    try {
      const response = await axios.post(
        `${config.api}/suppliers`,
        formPayload,
        {
          headers: {
            Authorization: 'Bearer ' + session?.user.id_token,
          },
        }
      );
      if (response.status === 401) {
        setOpenPopup(true);
        setPopupTitle(t('suppliers.messages.auth') || '');
        return;
      }
      if (response.status !== 200) {
        setOpenPopup(true);
        setPopupTitle(t('suppliers.messages.error') || '');
        return;
      }
      // Upload of each set of images into S3
      const presignedUrls = response.data;
      let uploadedFiles = 0;
      for (let i = 0; i < imagesToUpload.length; i++) {
        const imageInfo = imagesToUpload[i];
        const urls = presignedUrls.find(
          (obj: any) => obj.typeImages == imageInfo.typeImages
        )?.urls;
        for (let j = 0; j < urls.length; j++) {
          const textLoad = `${t('suppliers.uploadImage')} ${
            uploadedFiles + 1
          }/${totalImages}...`;
          setLoadingText(textLoad);
          try {
            const response = await axios.put(
              urls[j],
              imageInfo.imagesFiles[j].blobFile,
              {
                headers: {
                  'Content-Type': imageInfo.imagesFiles[j].blobFile?.type,
                },
              }
            );
            if (response.status === 200) uploadedFiles++;
          } catch (error) {
            console.error('Error On Upload Image:', error);
          }
        }
      }
      if (totalImages !== uploadedFiles) {
        setOpenPopup(true);
        setPopupTitle(t('suppliers.messages.errorImages') || '');
        return;
      }
      setOpenPopup(true);
      setPopupTitle(t('suppliers.messages.success') || '');
      handleNextClick();
    } catch (error) {
      setOpenPopup(true);
      setPopupTitle(t('suppliers.messages.errorData') || '');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (updatedFormValue: Record<string, any>) => {
    setFormValue(prevState => ({
      ...prevState,
      ...updatedFormValue,
    }));
  };
  const spokenLanguages = [
    'Spanish',
    'English',
    'Bengali',
    'Hindi',
    'Portuguese',
    'Russian',
    'Japanese',
    'German, standard',
    'Chinese, Wu',
    'Javanese',
    'Korean',
    'French',
    'Vietnamese',
    'Telugu',
    'Chinese, Yue',
    'Marathi',
    'Tamil',
    'Turkish',
    'Urdu',
    'Chinese, Min Nan',
    'Chinese, Jinyu',
    'Gujarati',
    'Polish',
    'Arabic, Egyptian spoken',
    'Ukrainian',
    'Italian',
    'Chinese, Xiang',
    'Malayalam',
    'Chinese, Hakka',
    'Kannada',
    'Oriya',
    'Panjabi, Western',
    'Sunda',
    'Panjabi, Eastern',
    'Romanian',
    'Bhojpuri',
    'Azerbaijani, South',
    'Farsi, Western',
    'Maithili',
    'Hausa',
    'Arabic, Algerian spoken',
    'Burmese',
    'Serbo-Croatian',
    'Chinese, Gan',
    'Awadhi',
    'Thai',
    'Dutch',
    'Yoruba',
    'Sindhi',
    'Arabic, Moroccan spoken',
    'Arabic, Saidi spoken',
    'Uzbek, Northern',
    'Malay',
    'Amharic',
    'Indonesian',
    'Igbo',
    'Tagalog',
    'Nepali',
    'Arabic, Sudanese spoken',
    'Saraiki',
    'Cebuano',
    'Arabic, North Levantine spoken',
    'Thai, Northeastern',
    'Assamese',
    'Hungarian',
    'Chittagonian',
    'Arabic, Mesopotamian spoken',
    'Madura',
    'Sinhala',
    'Haryanvi',
    'Marwari',
    'Czech',
    'Greek',
    'Magahi',
    'Chhattisgarhi',
    'Deccan',
    'Chinese, Min Bei',
    'Belarusan',
    'Zhuang, Northern',
    'Arabic, Najdi spoken',
    'Pashto, Northern',
    'Somali',
    'Malagasy',
    'Arabic, Tunisian spoken',
    'Rwanda',
    'Zulu',
    'Bulgarian',
    'Swedish',
    'Lombard',
    'Oromo, West-Central',
    'Pashto, Southern',
    'Kazakh',
    'Ilocano',
    'Tatar',
    'Fulfulde, Nigerian',
    'Arabic, Sanaani spoken',
    'Uyghur',
    'Haitian Creole French',
    'Azerbaijani, North',
    'Napoletano-Calabrese',
    'Khmer, Central',
    'Farsi, Eastern',
    'Akan',
    'Hiligaynon',
    'Kurmanji',
    'Shona',
    'Hebrew',
  ].map(item => ({ label: item, value: item }));

  const handleCheckPickerChange = (value: any) => {
    setFormValue({
      ...formData,
      language: value,
    });
    handleFieldInteraction('language');
  };

  const amenities: Amenity[] = [
    { name: 'Breakfast', icon: coffieIcon },
    { name: 'Bar', icon: barIcon },
    { name: 'WIFI', icon: wifiIcon },
    { name: '18+', icon: plus18 },
    { name: 'Accessible', icon: accessIcon },
    { name: 'Balcony', icon: balconyIcon },
    { name: 'Pool', icon: poolIcon },
    { name: 'TV', icon: tvIcon },
    { name: 'Gym', icon: gymIcon },
    { name: 'Kitchen', icon: kitchenIcon },
    { name: 'Spa', icon: spaIcon },
    { name: 'Sofa', icon: sofaIcon },
    { name: 'Shuttle', icon: shuttleIcon },
  ];

  const handleAmenityChange = (amenityName: string) => {
    const selectedAmenities = formData.amenities.slice();
    const index = selectedAmenities.indexOf(amenityName);
    if (index === -1) {
      selectedAmenities.push(amenityName);
    } else {
      selectedAmenities.splice(index, 1);
    }
    setFormValue({ ...formData, amenities: selectedAmenities });
  };

  const handleImageInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    setAdditionalLinks(prevLinks => {
      if (prevLinks.length === 0) {
        return [value];
      } else {
        const newLinks = [...prevLinks];
        newLinks[index] = value;
        return newLinks;
      }
    });
  };

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesType>({});
  const handleFileUpload = (key: string, files: FileType[]) => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [key]: files,
    }));
  };

  const handleUploaderButtonClick = (uploaderKey: string) => {
    const documentTypes = [
      'supplier_identity',
      'adventure_insurance_doc',
      'transportation_driver_license',
      'transportation_vehicle_license',
      'representative_photos',
    ];
    setCurrentUploaderKey(uploaderKey);
    if (documentTypes.includes(uploaderKey)) setFileType('All');
    else setFileType('Images');
    setOpenUploaderModal(true);
  };

  const handleMapSelect = (location: {
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  }) => {
    if (location) {
      setShowMap(false);
      setSelectedLocation(location);
    }
  };

  useEffect(() => {
    if (currentTabIndex === 1 && selectedSupplier !== 'extras') {
      const requiredFields = ['full_name', 'phone_number', 'email'];

      const isValidAddress =
        !!selectedLocation?.address &&
        !!selectedLocation?.city &&
        !!selectedLocation?.country;

      const isLanguageValid =
        formData.language !== null && formData.language.length > 0;

      const isValid = requiredFields.every(
        field =>
          (formData as { [key: string]: string })[field] &&
          (formData as { [key: string]: string })[field].trim() !== ''
      );

      setIsFormValid(
        isValid &&
          isLanguageValid &&
          isValidAddress &&
          uploadedFiles['adventure_insurance_doc']?.length > 0
      );

      if (!isValid && !isLanguageValid) {
        return;
      }
    }
  }, [formData, selectedLocation, uploadedFiles]);

  return (
    <>
      {loading && (
        <Loader
          size="lg"
          backdrop
          inverse
          center
          content={loadingText}
          vertical
        />
      )}
      {showMap && (
        <SupplierMapWrapper
          onSelectLocation={handleMapSelect}
          onClose={() => {
            setShowMap(false);
            handleFieldInteraction('supplier_address');
          }}
        />
      )}
      <UploaderModal
        close={() => {
          setOpenUploaderModal(false);
          handleFieldInteraction('add_image_text');
        }}
        isOpen={openUploaderModal}
        currentUploaderKey={currentUploaderKey}
        limit={10}
        handleFileUpload={handleFileUpload}
        fileList={uploadedFiles[currentUploaderKey] || []}
        fileType={fileType}
      />
      <InfoPopup
        open={openPopup}
        onClose={() => {
          setPopupTitle('');
          setOpenPopup(false);
        }}
        title={popupTitle}
        textButton="Ok"
      />
      <>
        <SEO title={t('suppliers.title')} />
        <div className="flex flex-col w-full px-[15px] cursor-default relative md:pt-[94px]">
          {/*-------------------------------------------------Header------------------------------------------------------------*/}
          <div className="flex flex-row justify-start items-center gap-[15px] px-3 mb-[10px] md:mb-[27px] lg:mr-auto lg:flex-col-reverse lg:gap-y-3 lg:pl-[150px]">
            <p className="text-white text-sm whitespace-nowrap font-[590] lg:mr-auto">
              {`${currentStep} of 5`}
            </p>
            <div className="flex justify-center gap-[13px] lg:gap-[18px]">
              <span
                className={`w-[35px] lg:w-[50px] h-[7px] rounded-full ${
                  currentStep >= 1
                    ? checkWL
                      ? 'bg-[var(--primary-background)]'
                      : 'bg-[var(--blue-color)]'
                    : 'bg-white/[.2]'
                }`}
              />
              <span
                className={`w-[35px] lg:w-[50px] h-[7px] rounded-full ${
                  currentStep >= 2
                    ? checkWL
                      ? 'bg-[var(--primary-background)]'
                      : 'bg-[var(--blue-color)]'
                    : 'bg-white/[.2]'
                }`}
              />
              <span
                className={`w-[35px] lg:w-[50px] h-[7px] rounded-full ${
                  currentStep >= 3
                    ? checkWL
                      ? 'bg-[var(--primary-background)]'
                      : 'bg-[var(--blue-color)]'
                    : 'bg-white/[.2]'
                }`}
              />
              <span
                className={`w-[35px] lg:w-[50px] h-[7px] rounded-full ${
                  currentStep >= 4
                    ? checkWL
                      ? 'bg-[var(--primary-background)]'
                      : 'bg-[var(--blue-color)]'
                    : 'bg-white/[.2]'
                }`}
              />
              <span
                className={`w-[35px] lg:w-[50px] h-[7px] rounded-full ${
                  currentStep >= 5
                    ? checkWL
                      ? 'bg-[var(--primary-background)]'
                      : 'bg-[var(--blue-color)]'
                    : 'bg-white/[.2]'
                }`}
              />
            </div>
          </div>
          {/*-------------------------------------------------Header------------------------------------------------------------*/}

          {/*-------------------------------------------------Start of home type section------------------------------------------------------------*/}
          {supplersTab === tabs[0] && (
            <div className="xxs:px-3 flex flex-col w-full justify-center gap-y-[21px] ">
              <TitleAndDescription
                title={t('suppliers.supplier-kind')}
                description={[]}
                originText="supplierTitle"
              />
              <div className="flex flex-col gap-y-[10px] lg:flex-row lg:gap-[21px] items-center justify-center transition duration-1000 transform-all px-30 w-full">
                <div
                  className={`supplierBox w-full ${
                    selectedSupplier === 'adventures'
                      ? checkWL
                        ? 'bg-[var(--primary-background)] text-white'
                        : 'bg-[var(--blue-color)] text-white'
                      : ''
                  }`}
                  onClick={() => handleSupplierSelect('adventures')}
                >
                  {windowSize <= 428 ? (
                    <Image
                      className={`${
                        selectedSupplier === 'adventures'
                          ? 'brightness-200'
                          : 'opacity-70'
                      }`}
                      width={36}
                      height={20}
                      src={supplierAdvenIconMobile}
                      alt="Adventures"
                    />
                  ) : (
                    <Image
                      className={`${
                        selectedSupplier === 'adventures'
                          ? 'brightness-200'
                          : 'opacity-20'
                      } ${windowSize > 1024 && 'w-[55px] h-[55px]'}`}
                      width={27}
                      height={16}
                      src={supplierAdvenIcon}
                      alt="Adventures"
                    />
                  )}
                  {selectedSupplier === 'adventures' && (
                    <Image
                      className="bg-white w-6 h-6 rounded-full absolute right-8 p-1 lg:top-5 lg:right-5 "
                      src={volindoVerified}
                      alt="check"
                    />
                  )}
                  <p className="text-[14px] font-bold">
                    {t('suppliers.adventures')}
                  </p>
                </div>
                <div
                  className={`supplierBox w-full ${
                    selectedSupplier === 'transportation'
                      ? checkWL
                        ? 'bg-[var(--primary-background)] text-white'
                        : 'bg-[var(--blue-color)] text-white'
                      : ''
                  }`}
                  onClick={() => handleSupplierSelect('transportation')}
                >
                  <Image
                    className={` ${
                      selectedSupplier === 'transportation'
                        ? 'brightness-200'
                        : 'opacity-70'
                    } ${windowSize > 1024 && 'w-[65px] h-[65px]'}`}
                    width={33}
                    height={16}
                    src={suppierTransportIcon}
                    alt="transport"
                  />
                  {selectedSupplier === 'transportation' && (
                    <Image
                      className="bg-white w-6 h-6 rounded-full absolute right-8 p-1 lg:top-5 lg:right-5 "
                      src={volindoVerified}
                      alt="check"
                    />
                  )}
                  <p className="text-[14px] font-bold">
                    {t('suppliers.transportation')}
                  </p>
                </div>
                <div
                  className={`supplierBox w-full ${
                    selectedSupplier === 'accommodation'
                      ? checkWL
                        ? 'bg-[var(--primary-background)] text-white'
                        : 'bg-[var(--blue-color)] text-white'
                      : ''
                  }`}
                  onClick={() => handleSupplierSelect('accommodation')}
                >
                  <Image
                    className={` ${
                      selectedSupplier === 'accommodation'
                        ? 'brightness-200'
                        : 'opacity-70'
                    } ${windowSize > 1024 && 'w-[50px] h-[50px]'}`}
                    width={30}
                    height={16}
                    src={suppierHomeIcon}
                    alt="accommodations"
                  />
                  {selectedSupplier === 'accommodation' && (
                    <Image
                      className="bg-white w-6 h-6 rounded-full absolute right-8 p-1 lg:top-5 lg:right-5 "
                      src={volindoVerified}
                      alt="check"
                    />
                  )}
                  <p className="text-[14px] font-bold">
                    {t('suppliers.accommodation')}
                  </p>
                </div>

                <div
                  className={`supplierBox w-full ${
                    selectedSupplier === 'luxury'
                      ? checkWL
                        ? 'bg-[var(--primary-background)] text-white'
                        : 'bg-[var(--blue-color)] text-white'
                      : ''
                  }`}
                  onClick={() => handleSupplierSelect('luxury')}
                >
                  <Image
                    className={` ${
                      selectedSupplier === 'luxury'
                        ? 'brightness-200'
                        : 'opacity-70'
                    } ${windowSize > 1024 && 'w-[55px] h-[55px]'}`}
                    width={33}
                    height={16}
                    src={supplierLuxuryIcon}
                    alt="luxury"
                  />
                  {selectedSupplier === 'luxury' && (
                    <Image
                      className="bg-white w-6 h-6 rounded-full absolute right-8 p-1 lg:top-5 lg:right-5 "
                      src={volindoVerified}
                      alt="check"
                    />
                  )}
                  <p className="text-[14px] font-bold">
                    {t('suppliers.luxury')}
                  </p>
                </div>
                <div
                  className={`supplierBox w-full ${
                    selectedSupplier === 'extras'
                      ? 'bg-[var(--primary-background)] text-white'
                      : ''
                  }`}
                  onClick={() => showComingSoonText('extras')}
                >
                  <Image
                    className={` ${
                      selectedSupplier === 'extras'
                        ? 'brightness-200'
                        : 'opacity-80'
                    } ${windowSize > 1024 && 'w-[55px] h-[55px]'}`}
                    width={36}
                    height={26}
                    src={supplierExtraIcon}
                    alt="extras"
                  />
                  {selectedSupplier === 'extras' && (
                    <Image
                      className="bg-white w-6 h-6 rounded-full absolute right-8 p-1 lg:top-5 lg:right-5 "
                      src={volindoVerified}
                      alt="check"
                    />
                  )}
                  <p className="text-[14px] font-bold">
                    {t('suppliers.extra')}
                  </p>
                  {showComingSoon && (
                    <p className="text-sm text-gray-200 mt-1">Coming Soon</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {/*-----------------------------------------------End of home type section ------------------------------------------------------------------------ */}

          {/*-------------------------------------------------Start of General information section------------------------------------------------------------*/}
          <Form
            fluid
            ref={formRef}
            formValue={formData}
            onSubmit={handleSubmit}
            onChange={handleInputChange}
            model={SupplierSchema(formTranslations)}
            className={`form-traveler flex flex-col gap-[10px]`}
          >
            {supplersTab === tabs[1] && selectedSupplier !== 'extras' && (
              <div className="flex flex-col w-full justify-center">
                <TitleAndDescription
                  title={t('suppliers.general-text')}
                  description={[
                    t('suppliers.general-description'),
                    t('suppliers.required_fields'),
                  ]}
                  originText="supplierTitle"
                />
                <div className="w-full lg:max-w-[441px] mx-auto">
                  <div className={`form-traveler flex flex-col gap-[10px]`}>
                    <Form.ControlLabel className="text-white">
                      {t('suppliers.general')}
                    </Form.ControlLabel>
                    <Form.Control
                      placeholder={`${t('suppliers.commercial_name')}*`}
                      name="full_name"
                      className={`${
                        fieldInteractions['full_name'] && !formData.full_name
                          ? 'border-red-500'
                          : 'border-white'
                      } rounded-[90px] border h-[48px] px-4 !bg-[rgba(255,255,255,0.22)] text-black ${
                        formData.full_name &&
                        'border-2 !border-[var(--primary-background)]'
                      }`}
                      onBlur={() => handleFieldInteraction('full_name')}
                    />

                    <Form.Control
                      name="phone_number"
                      type="number"
                      max={12}
                      placeholder={`${t('suppliers.telephone')}*`}
                      className={`${
                        fieldInteractions['phone_number'] &&
                        !formData.phone_number
                          ? 'border-red-500'
                          : 'border-white'
                      } ${formData.phone_number && 'border-2 !border-[var(--primary-background)]'} rounded-[90px] border h-[48px] px-4 text-black !bg-[rgba(255,255,255,0.22)]`}
                      onBlur={() => handleFieldInteraction('phone_number')}
                    />
                    <Form.Control
                      name="email"
                      placeholder={`${t('suppliers.email')}*`}
                      className={`${
                        fieldInteractions['email'] && !formData.email
                          ? 'border-red-500'
                          : 'border-white'
                      } ${formData.email && 'border-2 !border-[var(--primary-background)]'} rounded-[90px] border h-[48px] px-4 text-black !bg-[rgba(255,255,255,0.22)]`}
                      onBlur={() => handleFieldInteraction('email')}
                    />
                    <Form.ControlLabel className="text-white">
                      {t('suppliers.contact-address')}
                    </Form.ControlLabel>
                    <div className="flex">
                      <span
                        className={`flex float-left text-white p-2 rounded-full active:-translate-y-1 cursor-pointer ransition duration-150 transform-all ${
                          checkWL
                            ? 'bg-[var(--primary-background)]'
                            : 'bg-[var(--blue-color)] hover:bg-[var(--blue-color-darken)]'
                        }`}
                        onClick={() => setShowMap(true)}
                      >
                        {t('suppliers.select_address')}
                      </span>
                    </div>
                    <div className="flex flex-col gap-y-3 text-white">
                      <Form.Control
                        name="supplier_address"
                        placeholder={`${t('suppliers.service_address')}*`}
                        className={`w-full rounded-[90px] h-[48px] px-4 text-white flex items-center justify-between border !bg-[rgba(255,255,255,0.22)] ${
                          fieldInteractions['supplier_address'] &&
                          !selectedLocation?.address
                            ? 'border-red-500'
                            : 'border-white'
                        } ${
                          selectedLocation?.address &&
                          'border-2 !border-[var(--primary-background)]'
                        }`}
                        value={selectedLocation?.address || ''}
                        readOnly
                        disabled
                        style={{ backgroundColor: 'transparent', opacity: 1 }}
                      />
                    </div>
                    <div className="flex gap-[13px] xxs:flex-col  flex-row">
                      <Form.Control
                        name="supplier_city"
                        placeholder={t('suppliers.contact-city')}
                        value={selectedLocation?.city}
                        className={`rounded-[90px] border h-[48px] px-4 text-white lg:bg-transparent w-1/2 !bg-[rgba(255,255,255,0.22)] ${
                          fieldInteractions['supplier_address'] &&
                          !selectedLocation?.city
                            ? 'border-red-500'
                            : 'border-white'
                        } ${
                          selectedLocation?.city &&
                          'border-2 !border-[var(--primary-background)]'
                        }`}
                        readOnly
                        disabled
                        style={{ backgroundColor: 'transparent', opacity: 1 }}
                      />
                      <Form.Control
                        name="supplier_country_id"
                        accepter={SelectPicker}
                        cleanable={false}
                        placement="bottomStart"
                        value={selectedLocation?.country || ''}
                        data={countries.map((item: any) => ({
                          label: item.country_name,
                          value: item.country_name,
                        }))}
                        placeholder={`${t('travelers.country')}*`}
                        className={`!bg-[rgba(255,255,255,0.22)] ${
                          fieldInteractions['supplier_address'] &&
                          !selectedLocation?.country
                            ? 'border-[red!important]'
                            : 'border-white'
                        } ${
                          selectedLocation?.country &&
                          'border-2 !border-[var(--primary-background)]'
                        } rounded-[90px] h-[48px] px-4 text-white w-full border`}
                        readOnly
                        style={{
                          backgroundColor: 'transparent',
                          opacity: 1,
                        }}
                      />
                    </div>

                    <CheckPicker
                      placement="bottomStart"
                      cleanable={false}
                      menuMaxHeight={200}
                      data={spokenLanguages}
                      name="language"
                      placeholder={t('suppliers.language')}
                      className={`${
                        fieldInteractions['language'] &&
                        (!formData ||
                          !formData.language ||
                          formData.language.length < 1)
                          ? 'border-red-500'
                          : 'border-white'
                      } ${formData.language && formData.language.length > 0 && 'border-2 !border-[var(--primary-background)]'} !bg-[rgba(255,255,255,0.22)] rounded-[90px] border h-[48px] px-4 text-[white] bg-black`}
                      onChange={handleCheckPickerChange}
                      onExiting={() => handleFieldInteraction('language')}
                    />

                    <Form.ControlLabel className="text-white">
                      {t('suppliers.document_title')}
                    </Form.ControlLabel>

                    <div
                      className={`${
                        uploadedFiles['adventure_insurance_doc']?.length === 0
                          ? 'border-red-500'
                          : 'border-transparent'
                      } ${uploadedFiles['adventure_insurance_doc']?.length > 0 && 'border-2 !border-[var(--primary-background)]'} border relative rounded-[90px] !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] flex items-center justify-between w-full`}
                    >
                      <div className="w-full">
                        <div>
                          <div className="flex items-center justify-between w-full overflow-hidden">
                            <label className="text-white/[.6] text-xs">
                              {uploadedFiles['adventure_insurance_doc']
                                ?.length || 0}{' '}
                              {`${t('suppliers.documents_field')}*`}
                            </label>
                            <div
                              onClick={() =>
                                handleUploaderButtonClick(
                                  'adventure_insurance_doc'
                                )
                              }
                            >
                              <Image
                                src={downloadBlack}
                                alt="download"
                                className="w-6 h-6 bg-white rounded-full p-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Form.ControlLabel className="text-white">
                      {t('suppliers.social')}
                    </Form.ControlLabel>
                    <div className="relative">
                      <Form.Control
                        name="website"
                        placeholder={t('suppliers.website')}
                        className={`${
                          fieldInteractions['website'] && !formData.website
                            ? 'border-transparent'
                            : 'border-white'
                        } ${formData.website && 'border-2 !border-[var(--primary-background)]'} rounded-[90px] !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] w-full border`}
                      />
                      <Image
                        src={globeSuppierIcon}
                        alt="pin"
                        className="absolute right-[29px] top-[12px]"
                      />
                    </div>
                    <div className="relative">
                      <Form.Control
                        name="instagram"
                        placeholder={t('suppliers.instagram')}
                        className={`${
                          fieldInteractions['instagram'] && !formData.instagram
                            ? 'border-transparent'
                            : 'border-white'
                        } ${formData.instagram && 'border-2 !border-[var(--primary-background)]'} rounded-[90px] !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] w-full border`}
                      />
                      <Image
                        src={instagramSupplierIcon}
                        alt="pin"
                        className="absolute right-[29px] top-[12px]"
                      />
                    </div>

                    <div className="relative">
                      <Form.Control
                        name="facebook"
                        placeholder={t('suppliers.facebook')}
                        className={`${
                          fieldInteractions['facebook'] && !formData.facebook
                            ? 'border-transparent'
                            : 'border-white'
                        } ${formData.facebook && 'border-2 !border-[var(--primary-background)]'} rounded-[90px] !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] w-full border`}
                      />
                      <Image
                        src={facebookSupplierIcon}
                        alt="pin"
                        className="absolute right-[29px] top-[12px]"
                      />
                    </div>

                    <div className="relative">
                      <Form.Control
                        name="other_social"
                        placeholder={t('suppliers.another-link')}
                        className={`${
                          fieldInteractions['other_social'] &&
                          !formData.other_social
                            ? 'border-transparent'
                            : 'border-white'
                        } ${formData.other_social && 'border-2 !border-[var(--primary-background)]'} rounded-[90px] !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] w-full border`}
                      />
                      <Image
                        src={supplierOtherSocial}
                        alt="pin"
                        className="absolute right-[29px] top-[12px]"
                      />
                    </div>
                    {additionalLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex justify-start mt-4 relative"
                      >
                        <input
                          name="additionalLinks"
                          placeholder={`${t('suppliers.another-link')}`}
                          value={link}
                          onChange={e => {
                            handleImageInputChange(e, index);
                          }}
                          className=" rounded-[90px] border-none !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] bg-white w-full"
                        />

                        <div
                          className="text-white ml-2 bg-gray-500 w-6 h-6 flex justify-center items-center rounded-full absolute -right-2 -top-3"
                          onClick={() => {
                            setAdditionalLinks(prevLinks =>
                              prevLinks.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          X
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-start">
                      {additionalLinks.length < 2 && (
                        <div
                          className="text-white"
                          onClick={() => {
                            setAdditionalLinks([...additionalLinks, '']);
                          }}
                        >
                          {t('suppliers.add-link')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/*------------------------------------------------ General information section for extras-----*/}

            {supplersTab === tabs[1] && selectedSupplier === 'extras' && (
              <div className="flex flex-col w-full justify-center ">
                <div className="w-full flex justify-center">
                  <h2 className="text-white font-[500] text-2xl w-[345px] text-center tracking-tight scale-x-[1.4] scale-y-[1] px-6">
                    {t('suppliers.extra-detail')}
                  </h2>
                </div>
                <div className="flex flex-col text-center px-5 text-base gap-3 mt-10 text-white/[.68] lg:w-[570px] mx-auto">
                  <p>
                    {t('suppliers.extra-info')} <b>100 USD,</b>{' '}
                    {t('suppliers.extra-info-1.1')}
                  </p>
                  <p>{t('suppliers.extra-info2')}</p>
                  <div className="flex gap-4 items-center justify-center my-9 text-white">
                    <input
                      type="radio"
                      className="supplierRadio"
                      name="extras_radio"
                      value={''} //todo
                      onChange={e =>
                        setFormValue({
                          ...formData,
                          other_social: e.target.value,
                        })
                      }
                    />
                    <span className="mt-2">{t('suppliers.dont-show')}</span>
                  </div>
                </div>
              </div>
            )}
            {/*-------------------------------------------------End of General information section------------------------------------------------------------*/}

            {/*-------------------------------------------------Start of Service Details section------------------------------------------------------------*/}
            {supplersTab === tabs[2] && selectedSupplier !== 'extras' && (
              <div className="flex flex-col w-full justify-center text-center">
                <TitleAndDescription
                  title={t('suppliers.supplier-details')}
                  description={[
                    t('suppliers.general-description'),
                    t('suppliers.required_fields'),
                  ]}
                  originText="supplierTitle"
                />
                <div className="w-full h-full max-w-[357px] lg:max-w-[441px] mx-auto">
                  <div className="h-full text-center flex flex-col w-full gap-y-[20px] mt-4">
                    <Form.Control
                      name="company_name"
                      placeholder={`${t('suppliers.service_name')}*`}
                      className={`${
                        fieldInteractions['company_name'] &&
                        !formData.company_name
                          ? 'border-red-500'
                          : 'border-white'
                      } ${formData.company_name && 'border-2 !border-[var(--primary-background)]'} !bg-[rgba(255,255,255,0.22)] rounded-[90px] h-[48px] px-4 text-[white] bg-black w-full`}
                      required
                      onBlur={() => handleFieldInteraction('company_name')}
                    />

                    {/*Accommodations */}

                    {selectedSupplier === 'accommodation' && (
                      <>
                        <div
                          className={`${
                            uploadedFiles['hotel_images']?.length === 0
                              ? 'border-red-500'
                              : 'border-transparent'
                          } relative rounded-[90px] !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] flex items-center justify-between bg-black lg:bg-transparent border  w-full`}
                        >
                          <div className="w-full">
                            <div>
                              <div className="flex items-center justify-between w-full overflow-hidden">
                                <label className="text-white/[.6] text-xs">
                                  {uploadedFiles['hotel_images']?.length || 0}{' '}
                                  {t('suppliers.hotel-img')}
                                </label>
                                <div
                                  onClick={() =>
                                    handleUploaderButtonClick('hotel_images')
                                  }
                                >
                                  <Image
                                    src={downloadBlack}
                                    alt="download"
                                    className="w-6 h-6 bg-white rounded-full p-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-[90px] border-[#ffffff26] bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] flex items-center justify-between w-full">
                          <Form.Group
                            controlId="rate"
                            className="flex items-center justify-between w-full"
                          >
                            <Form.ControlLabel className="whitespace-nowrap text-white/[.6] text-xs">
                              {t('suppliers.stars')}
                            </Form.ControlLabel>
                            <Form.Control
                              name="stars"
                              accepter={Rate}
                              allowHalf
                              className="object-contain float-right"
                            />
                          </Form.Group>
                        </div>
                        <Form.ControlLabel className="text-white mr-auto">
                          {t('common.room')} 1
                        </Form.ControlLabel>
                        <div
                          className={`${
                            uploadedFiles['room_images']?.length === 0
                              ? 'border-red-500'
                              : 'border-transparent'
                          } relative rounded-[90px]  bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] flex items-center justify-between w-full`}
                        >
                          <div className="w-full">
                            <div>
                              <div className="flex items-center justify-between w-full overflow-hidden">
                                <label className="text-white/[.6] text-xs">
                                  {uploadedFiles['room_images']?.length || 0}{' '}
                                  {t('suppliers.room-img')}
                                </label>
                                <div
                                  onClick={() =>
                                    handleUploaderButtonClick('room_images')
                                  }
                                >
                                  <Image
                                    src={downloadBlack}
                                    alt="download"
                                    className="w-6 h-6 bg-white rounded-full p-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Form.Control
                          name="type_of_room"
                          placeholder={t('suppliers.room-type')}
                          className="rounded-[90px] border-none bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] flex items-center justify-between w-full"
                        />
                        <Form.Control
                          name="number_of_beds"
                          placeholder={t('suppliers.supplier-beds')}
                          className="rounded-[90px] border-none bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] flex items-center justify-between w-full"
                        />
                        <div className="flex  justify-between items-center rounded-[90px] bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] w-full">
                          <label className="text-[#777e90] whitespace-nowrap">
                            {t('suppliers.people-number')}
                          </label>
                          <Form.Control
                            hidden
                            type="number"
                            name="number_of_people_permitted"
                            value={numberOfPeople}
                          />

                          <div className="flex gap-3">
                            <div
                              className={`w-6 h-6 bg-white text-[#777E90] rounded-full ${
                                numberOfPeople <= 0 && 'bg-white/[.10]'
                              }`}
                              onClick={removepeople}
                            >
                              -
                            </div>
                            <span>{numberOfPeople}</span>
                            <div
                              className="w-6 h-6 bg-white text-[#777E90] rounded-full"
                              onClick={addpeople}
                            >
                              +
                            </div>
                          </div>
                        </div>
                        <Form.Control
                          type="text"
                          name="room_size"
                          placeholder={t('suppliers.room-size')}
                          className="rounded-[90px] border-none bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] w-full"
                        />
                        <div className="grid grid-cols-2 grid-rows-6 gap-y-4 gap-5 w-full justify-items-center">
                          {amenities.map(amenity => (
                            <div
                              key={amenity.name}
                              className={`rounded-full h-[48px] flex items-center justify-start px-3 gap-2 w-full max-w-[172px] ${
                                formData.amenities.includes(amenity.name)
                                  ? `text-white overflow-hidden ${
                                      checkWL
                                        ? 'bg-[var(--primary-background)]'
                                        : 'bg-[var(--blue-color)]'
                                    }`
                                  : 'bg-[#141416]'
                              }`}
                              onClick={() => handleAmenityChange(amenity.name)}
                            >
                              {formData.amenities.includes(amenity.name) ? (
                                <Image
                                  className="bg-white/90 w-6 h-6 rounded-lg p-1"
                                  src={volindoVerified}
                                  alt="check"
                                />
                              ) : (
                                <div className=" rounded-[10px] w-6 h-6 bg-[#777e90] min-w-6" />
                              )}
                              <Image
                                className={`mx-2  ${
                                  formData.amenities.includes(amenity.name)
                                    ? 'brightness-200'
                                    : 'opacity-30'
                                }`}
                                src={amenity.icon}
                                alt={amenity.name}
                              />
                              <label className="text-[10px] md:text-base">
                                {amenity.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/*-------------------------------------------------Transportation------------------------------------------ */}
                    {/* {selectedSupplier === 'transportation' && (
                      <>
                        <div
                          className={`${
                            uploadedFiles['transportation_driver_license']
                              ?.length === 0
                              ? 'border-red-500'
                              : 'border-transparent'
                          } relative rounded-[90px]  bg-[#ffffff26] h-[48px] px-4 text-[white] flex items-center justify-between bg-black border lg:bg-transparent w-full`}
                        >
                          <div className="w-full">
                            <div>
                              <div className="flex items-center justify-between w-full overflow-hidden">
                                <label className="text-white/[.6] text-xs">
                                  {uploadedFiles[
                                    'transportation_driver_license'
                                  ]?.length || 0}{' '}
                                  {t('suppliers.driver-license')}
                                </label>
                                <div
                                  onClick={() =>
                                    handleUploaderButtonClick(
                                      'transportation_driver_license'
                                    )
                                  }
                                >
                                  <Image
                                    src={downloadBlack}
                                    alt="download"
                                    className="w-6 h-6 bg-white rounded-full p-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${
                            uploadedFiles['transportation_vehicle_photos']
                              ?.length === 0
                              ? 'border-red-500'
                              : 'border-transparent'
                          } relative rounded-[90px]  bg-[#ffffff26] h-[48px] px-4 text-[white] flex items-center justify-between bg-black border lg:bg-transparent w-full`}
                        >
                          <div className="w-full">
                            <div>
                              <div className="flex items-center justify-between w-full overflow-hidden">
                                <label className="text-white/[.6] text-xs">
                                  {uploadedFiles[
                                    'transportation_vehicle_photos'
                                  ]?.length || 0}{' '}
                                  {t('suppliers.add-vehicle-photos')}
                                </label>
                                <div
                                  onClick={() =>
                                    handleUploaderButtonClick(
                                      'transportation_vehicle_photos'
                                    )
                                  }
                                >
                                  <Image
                                    src={downloadBlack}
                                    alt="download"
                                    className="w-6 h-6 bg-white rounded-full p-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${
                            uploadedFiles['transportation_vehicle_license']
                              ?.length === 0
                              ? 'border-red-500'
                              : 'border-transparent'
                          } relative rounded-[90px]  bg-[#ffffff26] h-[48px] px-4 text-[white] flex items-center justify-between bg-black border lg:bg-transparent w-full`}
                        >
                          <div className="w-full">
                            <div>
                              <div className="flex items-center justify-between w-full overflow-hidden">
                                <label className="text-white/[.6] text-xs">
                                  {uploadedFiles[
                                    'transportation_vehicle_license'
                                  ]?.length || 0}{' '}
                                  {t('suppliers.add-vehicle-plates')}
                                </label>
                                <div
                                  onClick={() =>
                                    handleUploaderButtonClick(
                                      'transportation_vehicle_license'
                                    )
                                  }
                                >
                                  <Image
                                    src={downloadBlack}
                                    alt="download"
                                    className="w-6 h-6 bg-white rounded-full p-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )} */}
                    <textarea
                      name="supplier_additional_info"
                      className={`${
                        fieldInteractions['supplier_additional_info'] &&
                        !formData.supplier_additional_info
                          ? 'border-red-500'
                          : 'border-white'
                      } ${formData.supplier_additional_info && 'border-2 !border-[var(--primary-background)]'} !bg-[rgba(255,255,255,0.22)]  rounded-[25px] p-6 border outline-none text-white`}
                      rows={5}
                      placeholder={`${t('suppliers.service_description')}*`}
                      style={{ resize: 'none' }}
                      value={formData.supplier_additional_info ?? ''}
                      onChange={e =>
                        setFormValue({
                          ...formData,
                          supplier_additional_info: e.target.value,
                        })
                      }
                      onBlur={() =>
                        handleFieldInteraction('supplier_additional_info')
                      }
                    />
                    <div
                      className={`relative rounded-[90px] border ${
                        fieldInteractions['add_image_text']
                          ? uploadedFiles['add_image_text']?.length < 1
                            ? 'border-red-500'
                            : 'border-white'
                          : 'border-transparent'
                      } ${uploadedFiles['add_image_text']?.length > 0 && 'border !border-[var(--primary-background)]'} !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 flex items-center justify-between bg-black border w-full`}
                    >
                      <div className="flex items-center justify-between w-full overflow-hidden">
                        <label
                          className={`${uploadedFiles['add_image_text']?.length > 0 ? 'text-white' : 'text-white opacity-70'} text-xs`}
                        >
                          {uploadedFiles['add_image_text']?.length || 0}{' '}
                          {`${t('suppliers.service_photos')}*`}
                        </label>
                        <div
                          onClick={() =>
                            handleUploaderButtonClick('add_image_text')
                          }
                        >
                          <Image
                            src={downloadBlack}
                            alt="download"
                            className="w-6 h-6 bg-white rounded-full p-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/*-------------------------------------------------End of Service Details section------------------------------------------------------------*/}

            {/*-------------------------------------------------Payment options section------------------------------------------------------------*/}
            {supplersTab === tabs[3] && (
              <div className="w-full mx-auto">
                <TitleAndDescription
                  title={`${t('suppliers.payment_title')}`}
                  description={[
                    t('suppliers.general-description'),
                    t('suppliers.required_fields'),
                  ]}
                  originText="supplierTitle"
                />
                <div className="flex flex-col max-w-[357px] lg:max-w-[441px] mx-auto">
                  {/* Representative data */}
                  <Form.Control
                    placeholder={`${t('suppliers.representative_fullname')}*`}
                    name="representative_name"
                    className={`${
                      fieldInteractions['representative_name'] &&
                      !formData.representative_name
                        ? 'border-red-500'
                        : 'border-transparent'
                    } ${formData.representative_name && 'border-2 !border-[var(--primary-background)]'} rounded-[90px] border h-[48px] px-4 text-black !bg-[rgba(255,255,255,0.22)] mb-5`}
                    onBlur={() => handleFieldInteraction('representative_name')}
                  />

                  <div
                    className={`${
                      fieldInteractions['representative_photos'] &&
                      uploadedFiles['representative_photos']?.length === 0
                        ? 'border-red-500'
                        : 'border-transparent'
                    } ${uploadedFiles['representative_photos']?.length > 0 && 'border-2 !border-[var(--primary-background)]'} relative rounded-[90px] !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] flex items-center justify-between bg-black lg:bg-transparent border  w-full mb-5`}
                  >
                    <div className="w-full">
                      <div>
                        <div className="flex items-center justify-between w-full overflow-hidden">
                          <label className="text-white/[.6]">
                            {uploadedFiles['representative_photos']?.length}{' '}
                            {`${t('suppliers.representative_photos')}*`}
                          </label>
                          <div
                            onClick={() =>
                              handleUploaderButtonClick('representative_photos')
                            }
                          >
                            <Image
                              src={downloadBlack}
                              alt="download"
                              className="w-6 h-6 bg-white rounded-full p-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Form.Control
                    placeholder={`${t('suppliers.representative_phone')}*`}
                    type="number"
                    name="representative_phone_number"
                    className={`${
                      fieldInteractions['representative_phone_number'] &&
                      !formData.representative_phone_number
                        ? 'border-red-500'
                        : 'border-transparent'
                    } ${formData.representative_phone_number && 'border-2 !border-[var(--primary-background)]'} rounded-[90px] border h-[48px] px-4 text-black !bg-[rgba(255,255,255,0.22)] mb-5`}
                    onBlur={() =>
                      handleFieldInteraction('representative_phone_number')
                    }
                  />

                  <Form.Control
                    placeholder={`${t('suppliers.representative_email')}*`}
                    type="email"
                    name="representative_email"
                    className={`${
                      fieldInteractions['representative_email'] &&
                      !formData.representative_email
                        ? 'border-red-500'
                        : 'border-transparent'
                    } ${formData.representative_email && 'border-2 !border-[var(--primary-background)]'} rounded-[90px] border h-[48px] px-4 text-black !bg-[rgba(255,255,255,0.22)] mb-5`}
                    onBlur={() =>
                      handleFieldInteraction('representative_email')
                    }
                  />

                  {/* End Representative data */}

                  <Form.ControlLabel className="text-white/[.68] text-[16px] text-center mb-[25px] md:px-9">
                    {t('suppliers.supplier-payment')}
                  </Form.ControlLabel>
                  <div className="relative">
                    <Form.Control
                      placeholder={t('suppliers.select-payment-method')}
                      accepter={SelectPicker}
                      cleanable={false}
                      name="payment_method"
                      menuClassName="black-picker"
                      data={paymentMethod}
                      className={`border ${
                        fieldInteractions['payment_method'] &&
                        !formData.payment_method
                          ? 'border-red-500'
                          : 'border-transparent'
                      } ${formData.payment_method && 'border-2 !border-[var(--primary-background)]'} rounded-[90px] !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] bg-black lg:bg-transparent w-full`}
                      onBlur={() => handleFieldInteraction('payment_method')}
                    />
                  </div>
                  {formData.payment_method === 'Paypal' && (
                    <Form.Control
                      className={`rounded-[90px] border h-[48px!important] ${
                        fieldInteractions['paypal_email'] &&
                        !formData.paypal_email
                          ? 'border-red-500'
                          : 'border-transparent'
                      } ${formData.paypal_email && 'border-2 !border-[var(--primary-background)]'} px-4 text-[white] !bg-[rgba(255,255,255,0.22)] w-full mt-6`}
                      placeholder={t('suppliers.paypal-email')}
                      type="Email"
                      name="paypal_email"
                      onBlur={() => handleFieldInteraction('paypal_email')}
                    />
                  )}
                  {formData.payment_method === 'Bank' && (
                    <div className="flex flex-col space-y-[16px] mt-[16px]">
                      <Form.Control
                        className={`rounded-[90px] ${
                          fieldInteractions['paypal_email'] &&
                          !formData.paypal_email
                            ? 'border-red-500'
                            : 'border-[#ffffff26] '
                        } ${formData.paypal_email && 'border-2 !border-[var(--primary-background)]'} !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] bg-black lg:bg-transparent border w-full`}
                        placeholder={t('withdraw.email')}
                        type="Email"
                        name="paypal_email"
                        onBlur={() => handleFieldInteraction('paypal_email')}
                      />
                      <Form.Control
                        name="account_fullname"
                        type="text"
                        placeholder={`${t('withdraw.name')}`}
                        className={`rounded-[90px] ${
                          fieldInteractions['account_fullname'] &&
                          !formData.account_fullname
                            ? 'border-red-500'
                            : 'border-[#ffffff26] '
                        } ${formData.account_fullname && 'border-2 !border-[var(--primary-background)]'} !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] bg-black lg:bg-transparent border w-full`}
                        onBlur={() =>
                          handleFieldInteraction('account_fullname')
                        }
                      />
                      <Form.Control
                        name="bank_name"
                        type="text"
                        placeholder={`${t('withdraw.bank_name')}`}
                        className={`rounded-[90px] ${
                          fieldInteractions['bank_name'] && !formData.bank_name
                            ? 'border-red-500'
                            : 'border-[#ffffff26] '
                        } ${formData.bank_name && 'border-2 !border-[var(--primary-background)]'} !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] bg-black lg:bg-transparent border w-full`}
                        onBlur={() => handleFieldInteraction('bank_name')}
                      />
                      <Form.Control
                        name="bank_address"
                        type="text"
                        placeholder={`${t('withdraw.address')}`}
                        className={`rounded-[90px] ${
                          fieldInteractions['bank_address'] &&
                          !formData.bank_address
                            ? 'border-red-500'
                            : 'border-[#ffffff26]'
                        } ${formData.bank_address && 'border-2 !border-[var(--primary-background)]'} !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] bg-black lg:bg-transparent border w-full`}
                        onBlur={() => handleFieldInteraction('bank_address')}
                      />
                      <Form.Control
                        name="swift_number"
                        type="number"
                        placeholder={`${t('withdraw.swift')}`}
                        className={`rounded-[90px] ${
                          fieldInteractions['swift_number'] &&
                          !formData.swift_number
                            ? 'border-red-500'
                            : 'border-[#ffffff26] '
                        } ${formData.swift_number && 'border-2 !border-[var(--primary-background)]'} !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] bg-black lg:bg-transparent border w-full`}
                        onBlur={() => handleFieldInteraction('swift_number')}
                      />
                      <Form.Control
                        name="account_number"
                        type="number"
                        placeholder={`${t('withdraw.account_number')}`}
                        className={`rounded-[90px] ${
                          fieldInteractions['account_number'] &&
                          !formData.account_number
                            ? 'border-red-500'
                            : 'border-[#ffffff26] '
                        } ${formData.account_number && 'border-2 !border-[var(--primary-background)]'} !bg-[rgba(255,255,255,0.22)] h-[48px] px-4 text-[white] bg-black lg:bg-transparent border w-full`}
                        onBlur={() => handleFieldInteraction('account_number')}
                      />
                    </div>
                  )}
                  <div className="mt-[25px] flex justify-center">
                    {' '}
                    <Form.ControlLabel className="text-white/[.68] text-[16px] text-center md:px-9">
                      {t('suppliers.supplier-cancellation')}
                    </Form.ControlLabel>
                  </div>

                  <Form.Control
                    name="cancel_policies"
                    placeholder={t('suppliers.cancel-policy')}
                    accepter={SelectPicker}
                    data={cancellationData}
                    cleanable={false}
                    searchable={false}
                    menuClassName="black-picker"
                    className={`rounded-[90px] border h-[48px!important] ${
                      fieldInteractions['cancel_policies'] &&
                      !formData?.cancel_policies
                        ? 'border-red-500'
                        : 'border-white'
                    } ${formData?.cancel_policies && 'border-2 !border-[var(--primary-background)]'} px-4 text-[white] !bg-[rgba(255,255,255,0.22)] w-full my-6`}
                    onBlur={() => handleFieldInteraction('cancel_policies')}
                  />
                  <textarea
                    name="cancel_policies_2"
                    className={`${
                      !fieldInteractions['cancel_policies_2'] &&
                      formData?.cancel_policies_2 &&
                      'border-white'
                    } rounded-[25px] border mb-5 p-6 text-white !bg-[rgba(255,255,255,0.22)] outline-none w-full ${formData?.cancel_policies_2 && 'border-2 !border-[var(--primary-background)]'}`}
                    rows={5}
                    placeholder={`${t('suppliers.additional-policy-info')}`}
                    style={{ resize: 'none' }}
                    value={formData.cancel_policies_2 ?? ''}
                    onChange={e =>
                      setFormValue({
                        ...formData,
                        cancel_policies_2: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            {/*-------------------------------------------------End Payment options section------------------------------------------------------------*/}

            {/*-------------------------------------------------Start of EXTRAS Details of Supplier section------------------------------------------------------------*/}
            {supplersTab === tabs[2] && selectedSupplier === 'extras' && (
              <div className="w-full max-w-[357px] lg:max-w-[441px] mx-auto">
                <div className="flex flex-col w-full justify-center text-center">
                  <div className="w-full flex justify-center flex-col gap-y-3 px-5">
                    <h2 className="text-white font-[500] text-2xl w-[345px] text-center tracking-tight scale-x-[1.4] scale-y-[1] px-6">
                      {t('suppliers.supplier-details')}
                    </h2>
                  </div>
                  <div className="w-full flex justify-center flex-col gap-y-3">
                    <div className=" text-center flex flex-col w-full px-6 gap-y-[20px] mt-4">
                      <textarea
                        name="extra_service_description"
                        className={`rounded-[25px] bg-[#ffffff26] p-6 text-white lg:bg-transparent border ${
                          !formData.country_id ? 'border-0' : 'boreder-red-500'
                        }`}
                        rows={5}
                        placeholder={`${t('suppliers.extra-info-3')}`}
                        value={formData.extra_service_description ?? ''}
                        onChange={e =>
                          setFormValue({
                            ...formData,
                            extra_service_description: e.target.value,
                          })
                        }
                        style={{ resize: 'none' }}
                      />
                      <textarea
                        name="extra_note_to_customer"
                        className="rounded-[25px] bg-[#ffffff26] p-6 text-white lg:bg-transparent"
                        rows={5}
                        placeholder={`${t('suppliers.extra-info-4')}`}
                        value={formData.extra_note_to_customer ?? ''}
                        onChange={e =>
                          setFormValue({
                            ...formData,
                            extra_note_to_customer: e.target.value,
                          })
                        }
                        style={{ resize: 'none' }}
                      />

                      <div className="relative rounded-[90px] border-[#ffffff26] bg-[#ffffff26] h-[48px] px-4 text-[white] flex items-center justify-between bg-black lg:bg-transparent border lg:border-[#777e90] w-full">
                        <div className="flex items-center justify-between w-full overflow-hidden">
                          <label className="text-white/[.6] text-xs">
                            {uploadedFiles['add_image_text']?.length || 0}{' '}
                            {t('suppliers.service-photos')}
                          </label>
                          <div
                            onClick={() =>
                              handleUploaderButtonClick('add_image_text')
                            }
                          >
                            <Image
                              src={downloadBlack}
                              alt="download"
                              className="w-6 h-6 bg-white rounded-full p-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/*-------------------------------------------------End of EXTRAS Details of Supplier section------------------------------------------------------------*/}

            {/*-------------------------------------------------END of EXTRAS Details of Supplier section------------------------------------------------------------*/}
            {supplersTab === tabs[4] && selectedSupplier !== 'extras' && (
              <div className="w-full max-w-[1000px] mx-auto">
                <ThankYouContainer
                  title={`${t('suppliers.supplier-thankyou')}`}
                  description={t('suppliers.supplier-thankyou2')}
                  buttonText={t('suppliers.main')}
                  redirectPath={'/suppliers'}
                />
              </div>
            )}
            {supplersTab === tabs[3] && (
              <div className="w-full flex-col items-center gap-y-14 flex justify-center lg:flex-row lg:gap-6">
                <GeneralButton
                  text={`${t('suppliers.back')}`}
                  cb={handleBackClick}
                  originText="backButton"
                />
                {formData.payment_method &&
                  formData.paypal_email &&
                  formData?.cancel_policies && (
                    <button
                      className={`font-[760] tracking-widest h-[59px] w-[25%] text-white rounded-[24px] z-10 lg:rounded-full lg:h-[48px] ${
                        checkWL
                          ? 'bg-[var(--primary-background)]'
                          : 'bg-[var(--blue-color)] hover:bg-[var(--blue-color-darken)]'
                      }`}
                      type="submit"
                      disabled={
                        !formData.payment_method ||
                        !formData.paypal_email ||
                        !formData.representative_name ||
                        !uploadedFiles['representative_photos'] ||
                        !formData.representative_phone_number ||
                        !formData.representative_email
                      }
                    >
                      {t('suppliers.supplier-add')}
                    </button>
                  )}
              </div>
            )}
          </Form>

          <div
            className={`flex flex-col gap-y-3 pt-[68px] justify-center items-center lg:flex-row-reverse lg:gap-6 relative`}
          >
            {supplersTab !== tabs[3] && (
              <>
                {supplersTab !== tabs[3] &&
                  supplersTab !== tabs[4] &&
                  supplersTab !== tabs[2] && (
                    <GeneralButton
                      text={`${t('suppliers.next')}`}
                      cb={handleNextClick}
                      originText="supplierButton"
                      disabled={
                        !selectedSupplier ||
                        (supplersTab === tabs[1] &&
                          !isFormValid &&
                          selectedSupplier !== 'extras')
                      }
                    />
                  )}
                {supplersTab === tabs[2] && (
                  <GeneralButton
                    text={`${t('suppliers.next')}`}
                    cb={handleNextClick}
                    originText="supplierButton"
                    disabled={
                      !uploadedFiles['add_image_text'] ||
                      !formData.company_name ||
                      !formData.supplier_additional_info
                    }
                  />
                )}

                {supplersTab !== tabs[4] && (
                  <GeneralButton
                    text={`${t('suppliers.back')}`}
                    cb={handleBackClick}
                    originText="backButton"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </>
      {windowSize > 1024 ? (
        <div className="relative bottom-0 right-0 flex items-end">
          <div
            className="min-w-[230px] min-h-[250px] w-full"
            style={{
              backgroundImage: `url(${
                checkWL ? supplierbg.src : supplierbgWL.src
              })`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          />
        </div>
      ) : (
        <>
          {checkWL ? (
            <div className="relative bottom-0 -left-[54px] right-0 h-full flex items-end">
              <div className={`w-full overflow-hidden h-[72px]`}>
                <div className={`mt-[1.9rem] h-full flex justify-center ml-2`}>
                  <Image
                    src={mobileSuppierbg_1}
                    alt="mobile_bg_1"
                    className="w-[21rem] h-[12rem] -mt-3 -ml-10"
                  />
                  <Image
                    src={mobileSuppierbg_2}
                    alt="bg-2"
                    className="-ml-[103px]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <Image src={supplierbgWL} alt="bg-2" />
          )}
        </>
      )}
    </>
  );
};

Suppliers.getLayout = getLayout;

export default Suppliers;
