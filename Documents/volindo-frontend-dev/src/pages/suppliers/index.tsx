import { ModalCancelSupplier, SEO, HeaderCRM } from '@components';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import nextI18nextConfig from 'next-i18next.config';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from '../api/auth/[...nextauth]';
import config from '@config';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Swal from 'sweetalert2';

import Image from 'next/image';
import filterIcon from '@icons/filterIcon.svg';
import userDefaultIMG from '@icons/userDefaultIMG.svg';
import phone from '@icons/resphoneIcon.svg';
import message from '@icons/resmessageIcon.svg';
import instagramColor from '@icons/instagramColor.svg';
import fbMessenger from '@icons/fbMessenger.svg';
import whatsAppcolor from '@icons/whatsAppcolor.svg';
import yellowPending from '@icons/yellowPending.svg';
import text from '@icons/restextIcon.svg';
import greenCheck from '@icons/greenCheck.svg';
import addIcon from '@icons/add.svg';
import { FlexboxGrid, Loader } from 'rsuite';
import SupplierFilter from 'src/components/filters/SupplierFilter';
import {
  NextPageWithLayout,
  SupplierFilters,
  SupplierType,
} from '@typing/types';
import { SuppliersServerProps } from '@typing/proptypes';
import { getLayout } from '@layouts/MainLayout';

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

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
        ['common'],
        nextI18nextConfig
      )),
    },
  };
};

const Suppliers: NextPageWithLayout = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reloadOnDelete, setReloadOnDelete] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [windowSize, setWindowSize] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [initialSuppliers, setInitialSuppliers] = useState<SupplierType[]>([]);
  const [supplier, setSuppliers] = useState<SupplierType[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [showCancelSupplier, setShowCancelSupplier] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SupplierFilters>({
    name: '',
    companyName: '',
    countries: [],
    services: '0',
    status: '0',
  });
  const [deleteSupplier, setDeleteSupplier] = useState('');
  const [deleteIndex, setDeleteSupplierIndex] = useState(0);
  const statusMapping: Record<string, string> = {
    '1': 'pending',
    '2': 'approved',
  };
  const servicesMapping: Record<string, string> = {
    '1': 'luxury',
    '2': 'adventures',
    '3': 'extras',
    '4': 'transportation',
    '5': 'accommodation',
  };
  const [countries, setCountries] = useState([]);

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
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      setInitialSuppliers([]);
      setSuppliers([]);
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (activeIndex >= 0) {
        const socialsDiv = document.getElementById(
          `socials-div-${activeIndex}`
        );
        if (socialsDiv && !socialsDiv.contains(event.target as Node)) {
          setActiveIndex(-1);
        }
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [activeIndex]);

  useEffect(() => {
    const getSupplierDetails = async () => {
      const res = await fetch(`${config.api}/suppliers/cmr`, {
        headers: {
          Authorization: 'Bearer ' + session?.user.id_token,
          'Content-Type': 'application/json',
        },
      });

      let supppliersGet = [];
      if (res.status === 200) {
        supppliersGet = await res.json();
        setInitialSuppliers(supppliersGet);
      }
    };
    if (status === 'authenticated') {
      getSupplierDetails();
    }
  }, [status, reloadOnDelete]);

  useEffect(() => {
    if (showFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showFilter]);

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
  const handleFacebook = (page: string) => {
    let pageUrl;
    // Check if input is a page URL or username
    if (page.includes('facebook.com')) {
      pageUrl = page;
    } else if (page !== '') {
      pageUrl = `https://www.facebook.com/${page}`;
    } else {
      pageUrl = 'https://www.facebook.com';
    }
    window.open(pageUrl, '_blank');
  };

  const handleInstagram = (page: string) => {
    let pageUrl;
    // Check if input is a page URL or username
    if (page.includes('instagram.com')) {
      pageUrl = page;
    } else if (page !== '') {
      pageUrl = `https://www.instagram.com/${page}`;
    } else {
      pageUrl = `https://www.instagram.com/`;
    }
    window.open(pageUrl, '_blank');
  };

  const handleShowProfile = (id: string) => {
    setSupplierId(id);
    router.push(`${window.location.origin}/suppliers/${id}`);
  };
  const handleDeleteClick = async (id: string, index: number) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${config.api}/suppliers/cmr/${id}`, {
        headers: {
          Authorization: 'Bearer ' + session?.user.id_token || '',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        Swal.fire('Your Supplier has succesfully been deleted', '', 'success');
        setReloadOnDelete(!reloadOnDelete);
        router.push('/suppliers');
        setActiveIndex(prevIndex => {
          if (prevIndex > index) {
            return prevIndex - 1;
          } else {
            return prevIndex;
          }
        });
      } else {
        Swal.fire(
          'Something went wrong please try again',
          'supplier not deleted',
          'error'
        );
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let aux = initialSuppliers;

    if (filters.name) {
      aux = aux.filter(item => item.full_name === filters.name);
    }
    if (filters.companyName) {
      aux = aux.filter(item => item.company_name === filters.companyName);
    }

    if (filters.countries && filters.countries.length > 0) {
      aux = aux.filter(item => filters.countries.includes(item.country_id));
    }

    if (filters.services && filters.services !== '0') {
      const mappedService = servicesMapping[filters.services];
      aux = aux.filter(item => {
        return item.selectedSupplier === mappedService;
      });
    }

    if (filters.status !== '0') {
      const mappedStatus = statusMapping[filters.status]; // Map the filter status
      aux = aux.filter(item => {
        return item.status === mappedStatus;
      });
    }
    setSuppliers(aux);
  }, [initialSuppliers, filters]);

  const handleChangeFilterName = (value: string | null) => {
    setFilters({ ...filters, name: value || '' });
  };

  const handleChangeFilterCompanyName = (value: string | null) => {
    setFilters({ ...filters, companyName: value || '' });
  };

  const handleChangeFilterCountries = (value: string[]) => {
    setFilters({ ...filters, countries: value });
  };

  const handleChangeFilterStatus = (value: string | number) => {
    setFilters({ ...filters, status: value as string });
  };

  const handleChangeFilterServices = (value: string | number) => {
    setFilters({ ...filters, services: value as string });
  };

  return (
    <div className="relative px-[15px] md:px-0">
      {isLoading && <Loader size="lg" backdrop content="loading..." vertical />}
      <>
        <SEO title={t('SEO.supplier')} />

        <h2 className="text-white text-[32px] font-[650] mt-[10px] scale-y-[0.8] md:mt-[35px] md:font-[760]">
          {t('suppliers.title')}
        </h2>
        <div className="flex flex-col-reverse items-center justify-between mt-5 lg:flex-row mb-5 cursor-default ">
          <HeaderCRM active={'Suppliers'} />
          {showFilter && (
            <SupplierFilter
              data={supplier}
              countries={countries}
              close={() => setShowFilter(false)}
              handleChangeFilterName={handleChangeFilterName}
              handleChangeFilterCompanyName={handleChangeFilterCompanyName}
              handleChangeFilterCountries={handleChangeFilterCountries}
              handleChangeFilterServices={handleChangeFilterServices}
              handleChangeFilterStatus={handleChangeFilterStatus}
            />
          )}

          <div className="flex justify-between w-full gap-3 items-center text-white text-base lg:justify-end">
            <button
              className="flex items-center"
              onClick={() => router.push('/suppliers/add_suppliers')}
            >
              <Image src={addIcon} alt="Filter" width={30} height={30} />
              {t('suppliers.add')}
            </button>
            {windowSize < 768 && (
              <button className="p-0 m-0" onClick={() => setShowFilter(true)}>
                <Image
                  className="invert"
                  src={filterIcon}
                  alt="Filter"
                  width={25}
                  height={25}
                />
              </button>
            )}
          </div>
        </div>
        {windowSize > 768 && (
          <SupplierFilter
            data={supplier}
            countries={countries}
            close={() => setShowFilter(false)}
            filters={filters}
            handleChangeFilterName={handleChangeFilterName}
            handleChangeFilterCompanyName={handleChangeFilterCompanyName}
            handleChangeFilterCountries={handleChangeFilterCountries}
            handleChangeFilterServices={handleChangeFilterServices}
            handleChangeFilterStatus={handleChangeFilterStatus}
          />
        )}
        {supplier.length === 0 && (
          <div className="flex flex-col justify-center items-center w-full h-[502px] bg-[#141414] rounded-t-[20px] lg:rounded-[20px] mx-auto mt-4 lg:h-[calc(100vh-347px)]">
            <h2 className="text-white/[.7] text-sm">
              {t('suppliers.not-data')}
            </h2>
          </div>
        )}

        {windowSize < 768 ? (
          <div className="flex flex-col justify-start items-center gap-y-4 mt-4 overflow-y-scroll scrollbar-hide">
            {supplier.map((item, index) => (
              <div
                key={index}
                className="xxs:w-[264px] w-full md:w-[358px] h-[209px] bg-[#141414] rounded-[20px] p-4"
              >
                <div
                  onClick={
                    item.status === 'approved'
                      ? () => handleShowProfile(item.supplier_id)
                      : undefined
                  }
                  className="flex cursor-pointer items-center gap-3 border-b border-b-white/[.1] pb-4 text-white"
                >
                  <Image
                    className="rounded-full w-[40px] h-[40px] border object-cover"
                    src={
                      item.add_image_text && item.add_image_text.length > 0
                        ? item.add_image_text[0]
                        : userDefaultIMG
                    }
                    width={40}
                    height={40}
                    alt="userdefault"
                  />
                  <div className="flex flex-col">
                    <label>{item.company_name}</label>
                    <label>{item.country_id}</label>
                  </div>
                </div>
                <div className="flex flex-col gap-y-[18px] mt-4">
                  <div className="flex justify-between">
                    <label className="text-[#808080] text-sm font-normal">
                      {t('suppliers.service-type')}
                    </label>
                    <label className="text-white text-[13px] font-normal">
                      {item.selectedSupplier
                        ? item.selectedSupplier.charAt(0).toUpperCase() +
                          item.selectedSupplier.slice(1).toLowerCase()
                        : ''}
                    </label>
                  </div>
                  <div className="flex justify-between">
                    <label className="text-[#808080] text-sm font-normal">
                      {t('suppliers.contact')}
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handlePhone(supplier[index].phone_number)
                        }
                        className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center"
                      >
                        <Image src={phone} alt="phone" />
                      </button>
                      <div className="flex flex-col relative">
                        <button
                          onClick={() => setActiveIndex(index)}
                          className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center"
                        >
                          <Image src={message} alt="message" />
                        </button>
                        {activeIndex === index && (
                          <div
                            id={`socials-div-${index}`}
                            className="w-[132px] h-auto bg-[#222222] absolute top-9 -right-12 rounded-[10px] z-10 px-3 py-4"
                          >
                            <button
                              onClick={() =>
                                handleInstagram(supplier[index].instagram)
                              }
                            >
                              <div className="flex gap-3 justify-center items-center">
                                <Image src={instagramColor} alt="instagram" />
                                <label className="text-white/[0.48]">
                                  Instagram
                                </label>
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                handleFacebook(supplier[index].facebook)
                              }
                            >
                              <div className="flex gap-3 justify-center items-center my-3">
                                <Image src={fbMessenger} alt="facebook" />
                                <label className="text-white/[0.48]">
                                  Facebook
                                </label>
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                handleWhatsApp(supplier[index].phone_number)
                              }
                            >
                              <div className="flex gap-3 justify-center items-center">
                                <Image
                                  width={24}
                                  height={24}
                                  src={whatsAppcolor}
                                  alt="whatsapp"
                                />
                                <label className="text-white/[0.48]">
                                  Whatsapp
                                </label>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleEmail(supplier[index].email)}
                        className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center"
                      >
                        <Image src={text} alt="text" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <label className="text-[#808080] text-sm font-normal">
                      {t('reservations.services')}
                    </label>
                    <div className="flex gap-3 items-center">
                      <label
                        className={`text-[13px] ${
                          item.status === 'approved'
                            ? 'text-green-500'
                            : 'text-[#FFB84E]'
                        }`}
                      >
                        {item.status}
                      </label>
                      {item.status === 'approved' ? (
                        <Image
                          className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center p-1"
                          src={greenCheck}
                          alt="check"
                        />
                      ) : (
                        <>
                          <ModalCancelSupplier
                            onClose={() => {
                              setShowCancelSupplier(false);
                              setReloadOnDelete(true);
                            }}
                            open={showCancelSupplier}
                            deleteSupplier={() =>
                              handleDeleteClick(deleteSupplier, deleteIndex)
                            }
                          />
                          <div className="flex gap-3 items-center">
                            <label className="text-[#FFB84E] w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center">
                              <Image src={yellowPending} alt="yellow" />
                            </label>
                            <button
                              onClick={() => {
                                setShowCancelSupplier(true);
                                setDeleteSupplier(item.supplier_id);
                                setDeleteSupplierIndex(index);
                              }}
                              className="text-red-500 text-sm flex justify-center items-center w-6 h-6 rounded-full bg-white/10 p-1"
                            >
                              X
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[450px] overflow-y-scroll scrollbar-hide lg:h-[calc(100vh-347px)]">
            {supplier.map((item, index) => (
              <div key={index}>
                <FlexboxGrid className="justify-center text-white bg-white/[.04] h-[78px] mt-6 gap-y-3 rounded-xl p-6 grid grid-cols-6 items-center justify-items-center ">
                  <FlexboxGrid.Item
                    className="flex justify-start w-full cursor-pointer"
                    onClick={
                      item.status === 'approved'
                        ? () => handleShowProfile(item.supplier_id)
                        : undefined
                    }
                  >
                    <div className="flex gap-3 items-center justify-center">
                      <Image
                        className="rounded-full w-[40px] h-[40px] border object-cover"
                        src={
                          item.add_image_text && item.add_image_text.length > 0
                            ? item.add_image_text[0]
                            : userDefaultIMG
                        }
                        width={40}
                        height={40}
                        alt="userdefault"
                      />
                      <span>{item.full_name}</span>
                    </div>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item>{item.company_name}</FlexboxGrid.Item>
                  <FlexboxGrid.Item>{item.country_id}</FlexboxGrid.Item>
                  <FlexboxGrid.Item>
                    <label className="text-white text-[13px] font-normal">
                      {item.selectedSupplier
                        ? item.selectedSupplier.charAt(0).toUpperCase() +
                          item.selectedSupplier.slice(1).toLowerCase()
                        : ''}
                    </label>
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handlePhone(supplier[index].phone_number)
                        }
                        className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center"
                      >
                        <Image src={phone} alt="phone" />
                      </button>
                      <div className="flex flex-col relative">
                        <button
                          onClick={() => setActiveIndex(index)}
                          className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center"
                        >
                          <Image src={message} alt="message" />
                        </button>
                        {activeIndex === index && (
                          <div
                            id={`socials-div-${index}`}
                            className="w-[132px] h-auto bg-[#222222] absolute top-9 -right-12 rounded-[10px] z-10 px-3 py-4"
                          >
                            <button
                              onClick={() =>
                                handleInstagram(supplier[index].instagram)
                              }
                            >
                              <div className="flex gap-3 justify-center items-center">
                                <Image src={instagramColor} alt="instagram" />{' '}
                                <label className="text-white/[0.48]">
                                  Instagram
                                </label>
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                handleFacebook(supplier[index].facebook)
                              }
                            >
                              <div className="flex gap-3 justify-center items-center my-3">
                                <Image src={fbMessenger} alt="facebook" />{' '}
                                <label className="text-white/[0.48]">
                                  Facebook
                                </label>
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                handleWhatsApp(supplier[index].phone_number)
                              }
                            >
                              <div className="flex gap-3 justify-center items-center">
                                <Image
                                  width={24}
                                  height={24}
                                  src={whatsAppcolor}
                                  alt="whatsapp"
                                />{' '}
                                <label className="text-white/[0.48]">
                                  Whatsapp
                                </label>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleEmail(supplier[index].email)}
                        className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center"
                      >
                        <Image src={text} alt="text" />
                      </button>
                    </div>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item className="flex gap-3 items-center">
                    <label
                      className={`text-[13px] ${
                        item.status === 'approved'
                          ? 'text-green-500'
                          : 'text-[#FFB84E]'
                      }`}
                    >
                      {item.status}
                    </label>
                    {item.status === 'approved' ? (
                      <Image
                        className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center p-1"
                        src={greenCheck}
                        alt="check"
                      />
                    ) : (
                      <>
                        <ModalCancelSupplier
                          onClose={() => {
                            setShowCancelSupplier(false);
                            setReloadOnDelete(true);
                          }}
                          open={showCancelSupplier}
                          deleteSupplier={() =>
                            handleDeleteClick(deleteSupplier, deleteIndex)
                          }
                        />
                        <div className="flex gap-3 items-center">
                          <label className="text-[#FFB84E] w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center">
                            <Image src={yellowPending} alt="yellow" />
                          </label>
                          <button
                            onClick={() => {
                              setShowCancelSupplier(true);
                              setDeleteSupplier(item.supplier_id);
                              setDeleteSupplierIndex(index);
                            }}
                            className="text-red-500 text-sm flex justify-center items-center w-6 h-6 rounded-full bg-white/10 p-1"
                          >
                            X
                          </button>
                        </div>
                      </>
                    )}
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </div>
            ))}
          </div>
        )}
      </>
    </div>
  );
};

Suppliers.getLayout = getLayout;

export default Suppliers;
