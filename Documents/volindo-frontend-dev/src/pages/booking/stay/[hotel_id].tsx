/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from 'next-i18next.config.js';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import config from '@config';
import { useAppSelector } from '@context';

import type { GetServerSidePropsContext } from 'next';
import type { NextPageWithLayout, StaysType } from '@typing/types';

import staysIcon from '@icons/stays.svg';
import flightsIcon from '@icons/flights.svg';
import pinIcon from '@icons/pin.svg';
import leftChevronBlackIcon from '@icons/leftChevronBlackIcon.svg';
import leftIconMobile from '@icons/leftIconMobile.svg';
import carIcon from '@icons/car.svg';

import { authOptions } from '@pages/api/auth/[...nextauth]';
import { io } from 'socket.io-client';

import { getLayout } from '@layouts/MainLayout';
import { montserratFont } from 'src/components/Layout';
import { Lottie } from '@components/Lottie';

import { decodeQueryString } from '@utils/urlFunctions';

import { translateDescription } from '@utils/axiosClients';

import {
  ModalCustom,
  ModalError,
  ModalHotelImages,
  SEO,
  HotelSearch,
  HotelStarsRating,
  RoomsList,
  SidebarDetails,
  ImageSlider,
  Amenities,
  DescriptionCard,
  SearchMobileForm,
} from '@components';

export async function getServerSideProps({
  locale,
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(req, res, authOptions);

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
        locale || 'en',
        ['common'],
        nextI18NextConfig
      )),
      session,
    },
  };
}

const HotelDetails: NextPageWithLayout = () => {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState('Stays');
  const [openCustom, setOpenCustom] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openHotelImages, setOpenHotelImages] = useState(false);
  const [customText, setCustomText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const catalogues = useAppSelector(state => state.hotels.catalogues);
  const hotelSearch = useAppSelector(state => state.hotels);

  const [stay, setStay] = useState<StaysType>({
    id: '',
    external_id: '',
    hotel_name: '',
    address: '',
    stars: 0,
    description: '',
    latitude: '',
    longitude: '',
    amenities: [],
    hotel_amenities: [],
    hotel_pictures: [],
    price: 0,
    number_of_nights: 0,
    rooms: [],
    hotel: '',
    Images: [],
    cheaper_room: '',
    check_in_time: '',
    check_out_time: '',
    Map: '',
    LowestTotalFare: 0,
    HotelRating: 0,
    Address: '',
    HotelName: '',
    Id: '',
    Rating: 0,
    HotelFacilities: [],
    is_available: '',
  });

  // not being used
  const stayAmenitiesLength = stay.amenities.length > 10;

  const [infoStay, setInfoStay] = useState({
    check_in: '',
    check_out: '',
    numberOfRooms: 0,
    numberOfPeople: 0,
    numberOfChildren: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [transaletedDescription, setTranslatedDescription] =
    useState<string>('');

  useEffect(() => {
    if (transaletedDescription !== '') {
      setStay({ ...stay, description: transaletedDescription });
    }
  }, [transaletedDescription]);

  const amenitiesToDelete = [
    'Check-in',
    'Distance',
    'none',
    'Total number of rooms',
    'Floor',
    'Single room',
    'Twin room',
    'Apartment number',
    'Triple rooms',
    'suites',
    'Studios',
    'Family room',
    'Superior room',
    'Villas',
    'Annexe',
    'King-size bed',
  ];

  const handleCloseCustom = () => {
    setOpenCustom(false);
    window.close();
  };

  const handleCloseError = () => {
    setOpenError(false);
    router.push('/', '/', { locale: i18n.language });
  };

  const localSearchParams: any = decodeQueryString(router.query.hotel_id || '');

  useEffect(() => {
    if (session?.user?.id_token) {
      getHotelData();
    }
  }, [session?.user?.id_token, i18n.language]);

  const getHotelData = async () => {
    try {
      setLoading(true);
      const socket = io(`${config.socket_api}`);

      const messageForRooms = {
        params: {
          ...localSearchParams,
          currency: 'USD',
          hotel_id: localSearchParams?.hotel_id,
        },
      };

      socket.emit(
        'hotel:rooms_one_hotel:search',
        JSON.stringify(messageForRooms)
      );

      socket.on('hotel:rooms_one_hotel:response', response => {
        if (response.error) {
          setOpenCustom(true);
          setCustomText(`${t('stays.modal-error')}`);
          setLoading(false);
          return;
        }
        const hotelResponse = response.result;
        const numOfNights = response.num_nights;

        const filteredAmenities = hotelResponse[0]?.CategoriesFound?.filter(
          (amenitie: any) => !amenitiesToDelete.includes(amenitie)
        );

        const {
          Rooms,
          Id,
          Images,
          HotelRating,
          Description,
          HotelFacilities,
          CheckInTime,
          CheckOutTime,
          HotelName,
          Address,
          Map,
        } = hotelResponse[0];

        setStay({
          ...stay,
          amenities: filteredAmenities || [],
          rooms: Rooms || [],
          id: Id || '',
          number_of_nights: numOfNights || 1,
          Images: Images || [],
          hotel_pictures: Images || [],
          stars: HotelRating || 0,
          description: Description || '',
          hotel_amenities: HotelFacilities || [],
          check_in_time: CheckInTime || '',
          check_out_time: CheckOutTime || '',
          hotel_name: HotelName || '',
          address: Address || '',
          latitude: Map.split('|')[0] || '',
          longitude: Map.split('|')[1] || '',
        });

        //TODO
        handleTranslateDescription(Description || '');

        const { totalAdults, totalChildren } =
          calculateNumberOfPeople(localSearchParams);

        setInfoStay({
          check_in: localSearchParams?.check_in,
          check_out: localSearchParams?.check_out,
          numberOfRooms: localSearchParams?.rooms?.length || 1,
          numberOfPeople: totalAdults || 1,
          numberOfChildren: totalChildren || 0,
        });
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const calculateNumberOfPeople = (searchParams: any) => {
    let totalAdults = 0;
    let totalChildren = 0;

    searchParams?.rooms?.forEach((room: any) => {
      totalAdults += Number(room.number_of_adults);
      totalChildren += Number(room.number_of_children);
    });

    return {
      totalAdults,
      totalChildren,
      totalPeople: totalAdults + totalChildren,
    };
  };

  const shortenText = (text: string, howManyWords: number) => {
    const words = text.split(' ');
    if (words.length > howManyWords) {
      return words.slice(0, howManyWords).join(' ') + '...';
    }
    return text;
  };

  const handleTranslateDescription = async (Description: string) => {
    const message = {
      text: Description,
      original_lg: 'EN',
      translate_lg: i18n.language.toUpperCase(),
    };

    translateDescription(message)
      .then(res => {
        setTranslatedDescription(res.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <SEO title={t('SEO.room_selection')} />
      {loading && (
        <div className="wrapperCarLoader">
          <Lottie src={'/carLoader.json'} className="carLoader" />
        </div>
      )}

      <ModalCustom
        open={openCustom}
        onClose={handleCloseCustom}
        text={customText}
      />

      <ModalError open={openError} onClose={handleCloseError} />

      {session && stay.id && (
        <>
          <ModalHotelImages
            open={openHotelImages}
            onClose={() => setOpenHotelImages(false)}
            stay={stay}
          />

          <SearchMobileForm
            toggleMenu={toggleMenu}
            catalogues={catalogues}
            filters={hotelSearch.searchParams}
          />

          <div className="mt-[10px] md:hidden">
            {isOpen && (
              <HotelSearch
                hotelData={stay}
                searchType="hotelUpdate"
                hotelId={localSearchParams?.hotel_id || ''}
                source="_booking"
              />
            )}
          </div>

          <div className=" BAR flex-col hidden justify-between items-center xl:flex-row xs:grid-cols-1 md:flex">
            <div className="flex justify-between h-[48px] bg-[#141414] rounded-[24px] xl:min-w-[291px] xl:mr-[20px]">
              <button
                //onClick={() => setTab("Stays")}
                className={`font-[600] px-6 flex gap-2 items-center ${
                  tab === 'Stays'
                    ? 'bg-white text-[#2F3447] rounded-[24px]'
                    : 'text-white opacity-[.48]'
                }`}
              >
                <Image
                  alt="icon"
                  src={staysIcon}
                  className={`${tab !== 'Stays' && 'invert'}`}
                />{' '}
                {t('home.stays')}
              </button>

              <button
                //onClick={() => setTab("Flights")}
                className={`font-[600] px-6 flex gap-2 items-center ${
                  tab === 'Flights'
                    ? 'bg-white text-[#2F3447] rounded-[24px]'
                    : 'text-white opacity-[.48]'
                }`}
              >
                <Image
                  alt="icon"
                  src={flightsIcon}
                  className={`${tab === 'Flights' && 'invert'}`}
                />{' '}
                {/* {t("home.flights")}*/}
              </button>

              <button
                onClick={() => router.push('/suppliers')}
                className={`font-[600] px-6 flex gap-2 items-center ${
                  tab === 'Suppliers'
                    ? 'bg-white text-[#2F3447] rounded-[24px]'
                    : 'text-white opacity-[.48]'
                }`}
              >
                <Image
                  alt="icon"
                  src={carIcon}
                  className={`${tab !== 'Suppliers' && 'invert'}`}
                />{' '}
                {/* {t("home.suppliers")}*/}
              </button>
            </div>
            <HotelSearch
              hotelData={stay}
              searchType="hotelUpdate"
              hotelId={localSearchParams?.hotel_id || ''}
              source="_booking"
            />
          </div>

          <div className="CONTENEDOR relative xst:flex xst:flex-wrap-reverse grid grid-cols-[291px_minmax(0px,_1fr)] gap-[24px] md:mt-[30px]">
            {/*-------------------------- Sidebar Stay details -------------------------*/}
            <div className="hidden md:block">
              <SidebarDetails stay={stay} infoStay={infoStay} />
            </div>
            {/*-------------------------- END Sidebar Stay details -------------------------*/}

            {/*---------------------------- Hotel Description ---------------------------*/}
            <div
              data-testid="chosen-hotel-details"
              className="chosen-hotel-details relative bg-white px-[0px] md:bg-[#f4f3f3] md:pt-[23px] md:px-[15px] md:rounded-t-[20px] text-black overflow-hidden md:pb-[20px]"
            >
              <div className="flex w-full">
                <div className="w-[inherit]">
                  <div
                    data-testid="chosen-hotel-title"
                    className="hidden md:flex justify-start items-center pl-[15px] pb-[11px]"
                  >
                    <span className="flex items-center">
                      <button onClick={() => router.back()} className="z-10">
                        <Image
                          className=""
                          src={leftChevronBlackIcon}
                          width={12}
                          height={12}
                          alt={'leftChevron'}
                        />
                      </button>
                      <p className="text-[24px] font-[760!important] pl-[40px] scale-x-[1.4] leading-[56px] capitalize">
                        {t('stays.hoteldetails')}
                      </p>
                    </span>
                  </div>

                  <div className="w-full h-auto flex flex-col flex-1 bg-black md:bg-transparent">
                    <div className="bg-white rounded-b-[20px] pb-[21px] md:bg-transparent">
                      <ImageSlider
                        setOpenHotelImages={setOpenHotelImages}
                        stay={stay}
                      />

                      <div className="flex-cols-1 md:hidden lg:hidden px-[15px]">
                        <div className="flex md:gap-3 items-center mb-[11px] leading-[normal]">
                          <span
                            className={`${montserratFont.className} text-[24px] font-[760] flex-col`}
                          >
                            {stay?.hotel_name}
                          </span>
                        </div>
                        <p className="flex gap-2 md:gap-4 flex-row mb-[15px] items-start">
                          <Image alt="icon" src={pinIcon} />
                          <label className="text-[#101010] opacity-[.64] text-[12px]">
                            {shortenText(stay?.address, 5)}
                          </label>
                        </p>
                        <div className="flex items-center gap-3 mb-[26px]">
                          <HotelStarsRating
                            hotelRating={stay?.stars}
                            origin="purple"
                            styleProp="hotelDetailsStars"
                          />
                          <div className="flex gap-1 items-center xs:flex-row ">
                            <label className="text-[15px] font-[650] scale-x-[1.4]">
                              {stay?.stars}.0
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="gap-0 px-[15px] xs:flex-col xs:w-full md:px-0 md:gap-2 xl:flex xl:min-h-[291px]">
                        <DescriptionCard description={stay.description} />

                        <Amenities
                          title={t('stays.facilities') || ''}
                          amenities={stay.amenities}
                          originText={'amenities'}
                          origin="details"
                          color={'black'}
                          maxAmenitiesToShow={10}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col px-[15px] mt-6 mb-[47px] text-white items-start md:px-0 md:items-center md:mt-0 md:hidden">
                      <SidebarDetails stay={stay} infoStay={infoStay} />
                    </div>

                    <h2 className="hidden text-[30px] leading-[normal] font-[760] md:flex">
                      <span className="block scale-y-75">
                        {t('stays.chooseroom')}
                      </span>
                    </h2>

                    <div
                      data-testid="chosen-hotel-rooms-container"
                      className="hotel-rooms rounded-3xl bg-white/95 w-auto pt-[20px] px-[15px] pb-10 h-auto md:px-0 md:bg-transparent"
                    >
                      <div className="flex">
                        <h2 className="mb-[19px] text-[22px] leading-[normal] font-[510] md:hidden">
                          {t('stays.chooseroom')}
                        </h2>
                      </div>
                      <ul className="flex flex-col flex-wrap gap-[20px] xl:gap-[16px]">
                        <RoomsList stay={stay} />
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*----------------------------End Hotel Description ---------------------------*/}
          </div>
        </>
      )}
    </>
  );
};

HotelDetails.getLayout = getLayout;

export default HotelDetails;
