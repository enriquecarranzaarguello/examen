import React, { useState, useEffect } from 'react';
import { ModalCancelSupplier, SEO } from '@components';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import nextI18nextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { authOptions } from '../api/auth/[...nextauth]';
import config from '@config';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Image from 'next/image';

import arrowLeft from '@icons/arrow-left.svg';
import userDef from '@icons/userDefaultIMG.svg';
import editPencil from '@icons/editPencil.svg';
import star from '@icons/star-white.svg';
import phone from '@icons/resphoneIcon.svg';
import message from '@icons/resmessageIcon.svg';
import text from '@icons/restextIcon.svg';
import minichat from '@icons/minichat.svg';
import greenCheck from '@icons/greenCheck.svg';
import supplierhome from '@icons/supplierhome.svg';
import hotelIconColor from '@icons/hotelIconColor.svg';
import lock from '@icons/lock.svg';
import instagramColor from '@icons/instagramColor.svg';
import fbMessenger from '@icons/fbMessenger.svg';
import whatsAppcolor from '@icons/whatsAppcolor.svg';
import recipt from '@icons/recipt.svg';
import xfolder from '@icons/xfolderIcon.svg';
import stay from '@icons/stays.svg';

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

import { FlexboxGrid, Loader } from 'rsuite';
import {
  SupplierProfileType,
  Amenity,
  NextPageWithLayout,
} from '@typing/types';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';
import { getLayout } from '@layouts/MainLayout';
import Link from 'next/link';

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

const SupplierID: NextPageWithLayout = () => {
  const { t, i18n } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [supplier, setSuppliers] = useState<SupplierProfileType[]>([]);
  const [activeIndex, setActiveIndex] = useState(false);
  const supplierId = router.query.supplierId as string;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showCancelSupplier, setShowCancelSupplier] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amenitiesString, setAmenitiesString] = useState('');

  const iconArrayServices = [
    { service: 'Breakfast', icon: coffieIcon },
    { service: 'Bar', icon: barIcon },
    { service: 'WIFI', icon: wifiIcon },
    { service: '18+', icon: plus18 },
    { service: 'Accessible', icon: accessIcon },
    { service: 'Balcony', icon: balconyIcon },
    { service: 'Pool', icon: poolIcon },
    { service: 'TV', icon: tvIcon },
    { service: 'Gym', icon: gymIcon },
    { service: 'Kitchen', icon: kitchenIcon },
    { service: 'Spa', icon: spaIcon },
    { service: 'Sofa', icon: sofaIcon },
    { service: 'Shuttle', icon: shuttleIcon },
  ];

  useEffect(() => {
    const getSupplierProfile = async () => {
      try {
        const res = await fetch(
          `${config.api}/suppliers/profile/${supplierId}--${session?.user.agent_id}`
        );

        if (res.status === 200) {
          const result = await res.json();

          const amenitiesArray: (string | undefined)[] = [];

          for (const key in result.Item) {
            if (
              Object.prototype.hasOwnProperty.call(result.Item, key) &&
              key.startsWith('amenities[')
            ) {
              const match = key.match(/\[(\d+)\]/);
              if (match) {
                const index = parseInt(match[1]);
                amenitiesArray[index] = result.Item[key];
              }
            }
          }

          const nonEmptyAmenitiesArray = amenitiesArray.filter(Boolean);
          const amenitiesString = nonEmptyAmenitiesArray.join(', ');
          setAmenitiesString(amenitiesString);

          const supplierData = result.Item;
          setSuppliers([supplierData]);
        }
      } catch (error) {
        // setOpenError(true);
      }
    };
    if (status === 'authenticated') getSupplierProfile();
  }, [status]);

  const [windowSize, setWindowSize] = useState(0);
  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const [activeItem, setActiveItem] = useState(0);

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
  const handleInclusion = (Inclusion: string) => {
    const getServiceInfo = (service: string) => {
      const foundService = iconArrayServices.find(
        item => item.service === service
      );
      return foundService;
    };

    const amenities = Inclusion.split(',');

    const renderedAmenities = amenities.map(
      (amenity: string, index: number) => {
        const trimmedAmenity = amenity.trim();
        const serviceInfo = getServiceInfo(trimmedAmenity);
        if (!serviceInfo) {
          return null;
        }

        return (
          <div
            key={index}
            className="flex flex-col gap-y-2 items-center border rounded-md py-1 hover:bg-[var(--primary-background)]"
          >
            <Image
              src={serviceInfo.icon}
              alt={serviceInfo.service}
              className="w-6 h-6 brightness-200"
            />
            <span className="text-white text-xs">{serviceInfo.service}</span>
          </div>
        );
      }
    );

    return renderedAmenities;
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
  useEffect(() => {
    const handleClickOutside = (event: React.MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as HTMLElement)
      ) {
        setActiveIndex(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside as unknown as EventListener
    );
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside as unknown as EventListener
      );
    };
  }, []);
  const handleSupplierBooking = (supplierId: string) => {
    router.push(`/suppliers/booking/${supplierId}`);
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

  const handleDeleteClick = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.api}/suppliers/cmr/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.user.id_token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        Swal.fire('Your Supplier has succesfully been deleted', '', 'success');
        router.push('/suppliers');
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

  return (
    <>
      <SEO title={t('SEO.supplier_profile')} />
      {isLoading && <Loader size="lg" backdrop content="loading..." vertical />}
      <ModalCancelSupplier
        onClose={() => setShowCancelSupplier(false)}
        open={showCancelSupplier}
        deleteSupplier={() => handleDeleteClick(supplierId)}
      />
      <div className="w-full h-full flex flex-col items-center justify-center px-[20px]">
        {/* Image and data display */}
        <div className="flex flex-row items-center gap-[20px] mb-[22px] mr-auto md:gap-5">
          <Link href="/suppliers">
            <Image
              className="w-6 h-6 rounded-full bg-white cursor-pointer"
              src={arrowLeft}
              alt="Arrow left"
            />
          </Link>
          <h2 className="text-white text-[28px] scale-y-75 md:text-[32px] font-[760]">
            Suppliers Profile
          </h2>
        </div>
        <div className="flex flex-col w-full gap-[20px] md:flex-row md:w-[70%]">
          <div className="w-full h-fit md:w-1/3 flex flex-col bg-white/[.08] rounded-[24px] text-white p-10 pt-[14px] pb-[22px] items-center justify-center">
            {supplier?.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center"
              >
                {/* Image profile  */}
                {item.add_image_text.length > 0 ? (
                  <div className="rounded-full w-[120px] h-[120px] lg:w-[140px] lg:h-[140px] overflow-hidden">
                    <Image
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                      src={item.add_image_text[0]}
                      alt={'Image of profile'}
                    />
                  </div>
                ) : (
                  <Image
                    src={userDef}
                    width={120}
                    height={120}
                    alt={'agent photo'}
                    className="object-contain"
                  />
                )}
                {/* Update Button */}
                <button className="flex gap-2 items-center my-4">
                  <Image src={editPencil} alt="edit pencil" className="" />
                  <span className="text-white/70 text-xs font-semibold">
                    {t('agent.photo')}
                  </span>
                </button>
                {/* Supplier Company Name */}
                <h2 className="w-full text-[24px] leading-normal md:text-[32px] font-bold text-center my-2">
                  {supplier[0]?.company_name}
                </h2>
                {/* Stars */}
                {supplier[0]?.selectedSupplier === 'accommodation' && (
                  <div className="flex gap-2 items-center mb-2">
                    <Image src={star} alt="star" width={14} height={14} />
                    <span className="text-base font-semibold">
                      {supplier[0]?.stars}
                    </span>
                  </div>
                )}
                {/* Type of supplier */}
                {supplier && supplier[0] && supplier[0]?.selectedSupplier && (
                  <span className="mt-[29px] text-[15px] font-[510] bg-white/10 w-[225px] h-[39px] flex justify-center items-center rounded-full mb-6">
                    {supplier[0].selectedSupplier.charAt(0).toUpperCase() +
                      supplier[0].selectedSupplier.slice(1)}
                  </span>
                )}
                {/* Contact buttons */}
                <div className="flex items-center justify-center gap-10 my-5 mb-[26px]">
                  <button
                    onClick={() => handlePhone(supplier[0]?.phone_number)}
                  >
                    <Image width={18} height={15} src={phone} alt="phone" />
                  </button>
                  <div className="flex flex-col relative" ref={containerRef}>
                    <button
                      onClick={() => setActiveIndex(!activeIndex)}
                      className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9]/[.1] flex justify-center items-center"
                    >
                      <Image src={message} alt="message" />
                    </button>
                    {activeIndex && (
                      <div
                        id={`socials-div`}
                        className="w-[132px] h-auto bg-[#222222] absolute top-9 -right-12 rounded-[10px] z-10 px-3 py-4 lg:w-[140px] lg:-right-[3.5rem] lg:-top-[0.75rem]"
                      >
                        <button
                          onClick={() =>
                            handleInstagram(supplier[0]?.instagram)
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
                          onClick={() => handleFacebook(supplier[0]?.facebook)}
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
                            handleWhatsApp(supplier[0]?.phone_number)
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
                  <button onClick={() => handleEmail(supplier[0]?.email)}>
                    <Image width={18} height={15} src={text} alt="text" />
                  </button>
                </div>

                <button
                  onClick={() => setShowCancelSupplier(true)}
                  className="border-2 border-[var(--primary-background)] text-[var(--primary-background)] rounded-full w-[110px] h-[40px] text-sm md:hidden"
                >
                  {t('travelers.delete-profile')}
                </button>

                {/* Button of booking */}
                <button
                  onClick={() => handleSupplierBooking(supplierId)}
                  className="bg-[var(--primary-background)] rounded-full w-full min-h-[48px] text-black text-base hidden md:block"
                >
                  {t('travelers.booking')}
                </button>
              </div>
            ))}
          </div>
          <div className="w-full md:w-2/3">
            <div className="flex flex-col mb-[15px] md:flex-row gap-2 justify-center items-center md:justify-between w-full">
              <h2 className="flex items-center gap-2 mr-auto text-white text-xl font-semibold">
                Statuses:
                <span
                  className={` text-sm ${
                    supplier[0]?.status === 'pending'
                      ? 'text-orange-400'
                      : 'text-green-500'
                  }`}
                >
                  {supplier[0]?.status}{' '}
                </span>
                {supplier[0]?.status === 'pending' ? (
                  <label className="text-orange-400 text-sm flex justify-center items-center w-6 h-6 rounded-full bg-white/10 p-1">
                    X
                  </label>
                ) : (
                  <Image
                    className="w-6 h-6 rounded-full bg-white/10 p-1"
                    src={greenCheck}
                    alt="check"
                  />
                )}
              </h2>
              <button
                onClick={() => setShowCancelSupplier(true)}
                className="hidden border-2 border-[var(--primary-background)] text-[var(--primary-background)] rounded-full w-[110px] h-[40px] text-sm md:block"
              >
                {t('travelers.delete-profile')}
              </button>
            </div>
            {/* Info of user */}
            <div className="flex flex-col gap-[10px]">
              {supplier[0]?.supplier_additional_info && (
                <div className="flex items-start gap-[15px]">
                  <div className="min-w-[24px]">
                    <Image
                      src={minichat}
                      alt="minichat"
                      className="opacity-70 w-full"
                    />
                  </div>
                  <span className="text-sm text-white/[.7] font-normal lg:text-white/30">
                    {supplier[0]?.supplier_additional_info}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-y-4">
                {supplier[0]?.selectedSupplier !== 'extras' && (
                  <>
                    <div className="flex flex-row items-center md:gap-5">
                      <div className="flex w-[128px] gap-[12px] text-white items-center text-sm text-white/70">
                        <div className="w-[24px]">
                          <Image src={supplierhome} alt="sup home" />
                        </div>
                        Place:
                      </div>
                      <p className="text-white">{supplier[0]?.address}</p>
                    </div>
                    <div className="flex flex-row items-center md:gap-5">
                      <div className="flex w-[128px] gap-[12px] text-white items-center text-sm text-white/70">
                        <div className="w-[24px]">
                          <Image
                            src={phone}
                            width={20}
                            height={20}
                            alt="phone"
                            className="opacity-70"
                          />
                        </div>
                        Phone:
                      </div>
                      <span className="text-white text xxs:text-center">
                        {supplier[0]?.phone_number}
                      </span>
                    </div>
                    <div className="flex flex-row items-center md:gap-5">
                      <div className="flex w-[128px] gap-[12px] text-white items-center text-sm text-white/70">
                        <div className="w-[24px]">
                          <Image
                            className="opacity-70"
                            src={message}
                            width={20}
                            height={20}
                            alt="message"
                          />
                        </div>
                        Email:
                      </div>
                      <p className="text-white text xxs:text-center">
                        {supplier[0]?.email}
                      </p>
                    </div>
                    <div className="flex flex-row items-center md:gap-5">
                      <div className="flex w-[128px] gap-[12px] text-white items-center text-sm text-white/70">
                        <div className="w-[24px]">
                          <Image src={lock} alt="Lock" className="opacity-70" />{' '}
                        </div>
                        Owner:
                      </div>
                      <span className="w-[212px] text-white text flex items-center gap-4 xxs:justify-center">
                        {supplier[0]?.company_name}
                        <button>
                          <Image src={recipt} alt="rec" />
                        </button>
                      </span>
                    </div>
                  </>
                )}
                {supplier[0]?.selectedSupplier === 'adventures' && (
                  <>
                    <div className="flex flex-row items-center md:gap-5">
                      <div className="flex w-[128px] gap-[12px] text-white items-center text-sm text-white/70">
                        <div className="w-[24px]">
                          <Image src={lock} alt="Lock" className="opacity-70" />{' '}
                        </div>
                        Insurance:
                      </div>
                      <p className="w-[212px] text-white text flex items-center gap-4 xxs:justify-center">
                        Resort advisory group
                        <button>
                          <Image src={recipt} alt="rec" />
                        </button>
                      </p>
                    </div>
                    <div className="flex flex-row items-center md:gap-5">
                      <div className="flex w-[128px] gap-[12px] text-white items-start text-sm text-white/70">
                        <div className="w-[24px]">
                          <Image
                            src={xfolder}
                            alt="Lock"
                            className="opacity-70"
                          />
                        </div>
                        <span className="whitespace-wrap">
                          Cancellation Policy
                        </span>
                      </div>
                      <p className="w-[212px] text-white text flex items-center gap-4 xxs:justify-center">
                        {supplier[0]?.cancel_policies ||
                          (supplier[0]?.cancel_policies_2 &&
                            supplier[0].cancel_policies.replace(
                              /[^a-zA-Z0-9 ]/g,
                              ' '
                            )) ||
                          supplier[0].cancel_policies_2.replace(
                            /[^a-zA-Z0-9_ ]/g,
                            ' '
                          )}
                        <button>
                          <Image src={recipt} alt="rec" />
                        </button>
                      </p>
                    </div>
                  </>
                )}
                {supplier[0]?.selectedSupplier === 'transportation' && (
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-row items-center md:gap-5">
                      <span className="flex gap-4 text-white items-center text-sm text-white/70">
                        <Image src={lock} alt="Lock" className="opacity-70" />{' '}
                        Driving license:
                      </span>
                      <p className="w-[212px] text-white text flex items-center gap-4 xxs:justify-center">
                        File
                        <button>
                          <Image src={recipt} alt="rec" />
                        </button>
                      </p>
                    </div>
                    <div className="flex flex-row items-center md:gap-5">
                      <span className="flex gap-4 text-white items-center text-sm text-white/70">
                        <Image src={lock} alt="Lock" className="opacity-70" />
                        Licenses, insurance:
                      </span>
                      <p className="w-[212px] text-white text flex items-center gap-4 xxs:justify-center">
                        File
                        <button>
                          <Image src={recipt} alt="rec" />
                        </button>
                      </p>
                    </div>
                    <div className="flex flex-row gap-2">
                      <span className="flex gap-4 text-white items-center text-sm text-white/70">
                        <Image
                          src={xfolder}
                          alt="Lock"
                          className="opacity-70"
                        />
                        <span className="whitespace-wrap">
                          Cancellation Policy
                        </span>
                      </span>
                      <p className="w-[212px] text-white text flex items-center gap-4 xxs:justify-center">
                        {supplier[0]?.cancel_policies ||
                          (supplier[0]?.cancel_policies_2 &&
                            supplier[0].cancel_policies.replace(
                              /[^a-zA-Z0-9 ]/g,
                              ' '
                            )) ||
                          supplier[0].cancel_policies_2.replace(
                            /[^a-zA-Z0-9_ ]/g,
                            ' '
                          )}
                        <button>
                          <Image src={recipt} alt="rec" />
                        </button>
                      </p>
                    </div>
                  </div>
                )}
                {supplier[0]?.selectedSupplier === 'accommodation' && (
                  <div className="flex flex-row gap-2">
                    <span className="flex gap-4 text-white items-center text-sm text-white/70">
                      <Image src={xfolder} alt="Lock" className="opacity-70" />
                      <span className="whitespace-wrap">
                        Cancellation Policy
                      </span>
                    </span>
                    <p className="w-[212px] text-white text flex items-center gap-4 xxs:justify-center">
                      {supplier[0]?.cancel_policies ||
                        (supplier[0]?.cancel_policies_2 &&
                          supplier[0]?.cancel_policies.replace(
                            /[^a-zA-Z0-9_]/g,
                            ' '
                          )) ||
                        supplier[0].cancel_policies_2.replace(
                          /[^a-zA-Z0-9_]/g,
                          ' '
                        )}
                      <button>
                        <Image src={recipt} alt="rec" />
                      </button>
                    </p>
                  </div>
                )}

                {supplier[0]?.selectedSupplier === 'luxury' && (
                  <div className="flex flex-row gap-2">
                    <span className="flex gap-4 text-white items-center text-sm text-white/70">
                      <Image src={xfolder} alt="Lock" className="opacity-70" />
                      <span className="whitespace-wrap">
                        Cancellation Policy
                      </span>
                    </span>
                    <p className="w-[212px] text-white text flex items-center gap-4 xxs:justify-center">
                      {supplier[0]?.cancel_policies ||
                        (supplier[0]?.cancel_policies_2 &&
                          supplier[0].cancel_policies.replace(
                            /[^a-zA-Z0-9_]/g,
                            ' '
                          )) ||
                        supplier[0].cancel_policies_2.replace(
                          /[^a-zA-Z0-9_]/g,
                          ' '
                        )}
                      <button>
                        <Image src={recipt} alt="rec" />
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Menu of Sections */}
            <div
              className={`flex items-center justify-around xxs:mx-auto xs:mx-auto xxs:w-full bg-[#191919] h-[42px] rounded-[7px] border border-[#323232] my-4 md:w-[315px] mt-[25px] ${
                supplier[0]?.selectedSupplier === 'accommodation' &&
                'md:w-[494px] xxs:w-[80%]'
              }`}
            >
              <div
                className={`text-[12px] font-[590] text-white text-md cursor-pointer ${
                  activeItem === 0 &&
                  'bg-[#323232] rounded-[7px] w-[90px] h-[30px] flex justify-center items-center'
                }`}
                onClick={() => setActiveItem(0)}
              >
                Proposals
              </div>
              <div
                className={`text-[12px] font-[590] text-white text-md cursor-pointer ${
                  activeItem === 1 &&
                  'bg-[#323232] rounded-[7px] w-[90px] h-[30px] flex justify-center items-center'
                }`}
                onClick={() => setActiveItem(1)}
              >
                Details
              </div>
              <div
                className={`text-[12px] font-[590] text-white text-md cursor-pointer whitespace-nowrap ${
                  activeItem === 2 &&
                  'bg-[#323232] rounded-[7px] w-[90px] h-[30px] flex justify-center items-center'
                }`}
                onClick={() => setActiveItem(2)}
              >
                Service Photos
              </div>
              {supplier[0]?.selectedSupplier === 'accommodation' && (
                <div
                  className={`text-[9px] text-white text-md cursor-pointer ${
                    activeItem === 3 &&
                    'bg-[#323232] rounded-[7px] w-[90px] h-[30px] flex justify-center items-center'
                  }`}
                  onClick={() => setActiveItem(3)}
                >
                  Rooms
                </div>
              )}
            </div>
            {/* Sections */}
            {supplier[0]?.selectedSupplier === 'accommodation' &&
              activeItem === 3 && (
                <div className="flex flex-col mb-6 w-full mx-auto gap-y-3 lg:w-[687px]">
                  <h2 className=" text-white text-base font-semibold">Rooms</h2>
                  {windowSize < 1024 ? (
                    <div className=" w-full h-[218px] bg-[#141414] rounded-[20px] p-4 max-w-[419px]">
                      <div className="flex items-center justify-between pb-3 border-b border-b-white/10 ">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#D9D9D9] w-6 h-6 flex items-center justify-center rounded-full bg-opacity-[.1] p-1">
                            <Image
                              src={hotelIconColor}
                              width={13}
                              height={13}
                              alt="reservation"
                            />
                          </div>
                          <span className="text-white">{'Luxury room'}</span>
                        </div>
                        <button
                          onClick={() => handleSupplierBooking(supplierId)}
                          className="bg-[#fefefe] rounded-full text-black font-semibold text-sm w-[103px] h-[32px]"
                        >
                          Reserve
                        </button>
                      </div>
                      <div className="flex flex-col gap-y-3 mt-4 w-full">
                        <div className="flex justify-between">
                          <label className="text-[#808080] text-sm font-normal">
                            Convenience
                          </label>
                          <label className="text-white text-xs font-medium">
                            {supplier[0]?.type_of_room}
                          </label>
                        </div>
                        <div className="flex justify-between">
                          <label className="text-[#808080] text-sm font-normal">
                            Room size
                          </label>
                          <label className="text-white text-xs font-medium">
                            {supplier[0]?.room_size}
                          </label>
                        </div>
                        <div className="flex justify-between">
                          <label className="text-[#808080] text-sm font-normal">
                            Photo room
                          </label>
                          <button className="text-white text-xs font-medium underline">
                            {supplier[0]?.room_images.length} Photos
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between px-6 lg:w-[503px] xl:w-[687px] h-[58px] bg-white/[.08] rounded-2xl">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-opacity-[.1] p-1">
                        <Image
                          src={stay}
                          width={18}
                          height={18}
                          alt="reservation"
                          className="invert"
                        />
                      </div>
                      {/* <span className="text-white">{"Luxury room"}</span> */}
                      <div className="flex justify-between">
                        <label className="text-white text-xs font-medium">
                          {supplier[0]?.type_of_room}
                        </label>
                      </div>
                      <div className="flex justify-between">
                        <label className="text-white text-xs font-medium">
                          {supplier[0]?.room_size}
                        </label>
                      </div>
                      <span className="text-white">$833</span>
                      <div className="flex justify-between">
                        <button className="text-white text-xs font-medium underline">
                          {supplier[0]?.room_images.length} Photos
                        </button>
                      </div>
                      <button
                        onClick={() => handleSupplierBooking(supplierId)}
                        className="bg-[#fefefe] rounded-full text-black font-semibold text-sm w-[103px] h-[32px]"
                      >
                        Reserve
                      </button>
                    </div>
                  )}
                </div>
              )}
            {activeItem === 1 && (
              <div className="flex flex-col mb-6 md:w-[352px] w-full mx-auto gap-y-3 lg:w-[687px]">
                {supplier[0]?.selectedSupplier === 'accommodation' ? (
                  <div className="w-full">
                    <h2 className=" text-white text-base font-semibold my-3">
                      Hotel Accommodations
                    </h2>
                    <p className=" text-white/[.64] text-sm font-semibold my-3 w-[320px] lg:w-[419px]">
                      {supplier[0]?.supplier_additional_info}
                    </p>
                    <div className="max-w-[419px] w-full grid gap-3 grid-cols-3">
                      {handleInclusion(
                        supplier[0]?.amenities || amenitiesString
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col xxs:items-center mb-7">
                    <h2 className=" text-white text-base font-semibold my-3">
                      Supplier Details
                    </h2>
                    <p className=" text-white/[.64] text-sm font-semibold my-3 w-[320px] lg:w-[419px]">
                      {supplier[0]?.supplier_additional_info}
                    </p>
                  </div>
                )}
              </div>
            )}
            {activeItem === 2 && (
              <div className="w-full flex flex-col mb-6 md:w-[352px] mx-auto gap-y-3 lg:w-[687px] xxs:items-center">
                <h2 className=" text-white text-base font-semibold xs:pl-5">
                  Photos/videos of offers
                </h2>

                {supplier?.map((item, index) => (
                  <div
                    className=" max-w-[419px] w-full grid gap-3 gap-y-3 grid-cols-3 grid-rows-auto xxs:grid-cols-2 xxs:w-[270px]"
                    key={index}
                  >
                    {item.hotel_images &&
                      item.hotel_images.map((image, index) => (
                        <Image
                          key={index}
                          width={112}
                          height={84}
                          className={`w-[112px] h-[84px] object-cover ${
                            windowSize > 768 && 'w-[126px] h-[136px]'
                          }`}
                          src={image}
                          alt={'hotel Images'}
                        />
                      ))}
                    {item.room_images &&
                      item.room_images.map((image, index) => (
                        <Image
                          key={index}
                          width={112}
                          height={84}
                          className={`w-[112px] h-[84px] object-cover ${
                            windowSize > 768 && 'w-[126px] h-[136px]'
                          }`}
                          src={image}
                          alt={'hotel Images'}
                        />
                      ))}
                    {item.add_image_text &&
                      item.add_image_text.map((image, index) => (
                        <Image
                          key={index}
                          width={112}
                          height={84}
                          className={`w-[112px] h-[84px] object-cover ${
                            windowSize > 768 && 'w-[126px] h-[136px]'
                          }`}
                          src={image}
                          alt={'hotel Images'}
                        />
                      ))}
                    {item.transportation_vehicle_photos &&
                      item.transportation_vehicle_photos.map((image, index) => (
                        <Image
                          key={index}
                          width={112}
                          height={84}
                          className={`w-[112px] h-[84px] object-cover ${
                            windowSize > 768 && 'w-[126px] h-[136px]'
                          }`}
                          src={image}
                          alt={'hotel Images'}
                        />
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Button for Mobile */}
      <div className="h-[100px] flex items-center justify-center px-[20px] md:px-0">
        <button
          onClick={() => handleSupplierBooking(supplierId)}
          className="bg-[var(--primary-background)] text-white w-full h-[48px] flex justify-center mx-auto items-center rounded-full text-[22px] font-[760] md:max-w-[361px] md:hidden"
        >
          <span className="block scale-y-75">{t('travelers.booking')}</span>
        </button>
      </div>
    </>
  );
};

SupplierID.getLayout = getLayout;

export default SupplierID;
