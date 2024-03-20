import { FormEvent, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { DateRangePicker } from 'react-dates';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Input } from 'rsuite';
import moment from 'moment';
import config from '@config';
import { HotelInfo } from '@typing/types';
import { HotelService } from '@services/HotelsService';
import { createQueryString } from '@utils/urlFunctions';

import {
  useAppDispatch,
  useAppSelector,
  setDestination,
  setCity,
  setFilterPriceMaxLimit,
  setFilterPriceMinLimit,
  setCheckin,
  setCheckout,
  setEmptyFilter,
  setHotelId,
  setHotels,
  resetHotels,
  setResultId,
  setSearchProgress,
  setSearchTotal,
  addHotels,
  setHotelFound,
  setSocketError,
  setNotHotelAvailableFound,
  setLoadedChange,
  setSubstractTraveler,
  setAddTraveler,
  setAddRoom,
  setSubstractRoom,
} from '@context';

import pinIcon from '@icons/pin.svg';
import hotelIcon from '@icons/hotelIcon.svg';
import calendarIcon from '@icons/calendar.svg';
import lineIcon from '@icons/line.svg';
import travelerIcon from '@icons/traveler.svg';
import arrowLeftIcon from '@icons/arrow-left.svg';
import arrowRightIcon from '@icons/arrow-right.svg';

import SearchLoader from 'src/components/SearchLoader';
import { RegisterModal } from '@components';

import type { RangeDateType, HotelSearchType } from '@typing/types';

import { useVariableValue } from '@devcycle/react-client-sdk';

import styles from './hotel-search.module.scss';
import InputSearch, {
  InputSearchItem,
} from '@components/general/inputSearch/InputSearch';
import { searchHotelById, searchHotelsAndCities } from '@utils/axiosClients';
import Popover from '@components/general/popover';
import TravelersRooms from './TravelersRooms/TravelersRooms';

const HotelSearch = ({
  hotelData,
  searchType,
  hotelId,
  source = '',
}: HotelSearchType) => {
  const hotelService = new HotelService();
  const { t, i18n } = useTranslation('common');
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState<null | 'startDate' | 'endDate'>(null);
  const [windowSize, setWindowSize] = useState(0);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [isVolindo, setisVolindo] = useState(
    config.WHITELABELNAME === 'Volindo' || false
  );
  const [peticionId, setPeticionId] = useState<any>({});
  const [hotelsCitiesResults, setHotelsCitiesResults] = useState<
    InputSearchItem[]
  >([]);
  const [defaultDestination, setDefaultDestination] =
    useState<InputSearchItem | null>();

  const paywall = useVariableValue('paywall', false);

  const isValidSubscription = useAppSelector(
    state => state.agent.agent_is_subscribed
  );
  //TODO Put their types
  const filterNew = useAppSelector((state: any) => state.hotels.searchParams);
  const destinationOnSearch = useAppSelector(
    (state: any) => state.hotels.searchParams.destination
  );

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const today = moment();
    const checkInMoment = moment(filterNew.check_in);

    if (checkInMoment.isBefore(today, 'day')) {
      dispatch(setCheckin({ check_in: '' }));
      dispatch(setCheckout({ check_out: '' }));
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (destinationOnSearch) {
      const [type, destination] = destinationOnSearch.split('|');
      if (type === 'city') {
        setDefaultDestination({
          value: destination,
          label: destination.replaceAll('/', ', '),
        });
      } else {
        if (session)
          searchHotelById(destination, session.user.id_token)
            .then(res => {
              const hotel = res.data.hotels[0];
              const allHotelData = [
                hotel.name,
                hotel.city,
                hotel.state,
                hotel.country,
              ].filter((item: any) => !!item);

              setDefaultDestination({
                value: `hotel|${hotel.id}`,
                label: allHotelData.join(', '),
              });
            })
            .catch(error => {
              console.log(error);
            });
      }
    }
  }, [destinationOnSearch]);

  const handleClickForm = () => {
    if (!session) {
      redirectToSignUp();
    } else if (paywall) {
      if (session && !isVolindo && !isValidSubscription) {
        setRegisterModalOpen(true);
      }
    }
  };

  const handleSearchDestination = useCallback(
    (search: string) => {
      if (session && search)
        searchHotelsAndCities(search, session?.user?.id_token)
          .then(res => {
            const { hotels, cities } = res.data;

            const cityItems: InputSearchItem[] = cities.map((city: any) => {
              const allCityData = [city.city, city.state, city.country].filter(
                (item: any) => !!item
              );
              return {
                value: `city|${allCityData.join('/')}`,
                label: `${allCityData.join(', ')}`,
                imageType: 'city',
              };
            });

            const hotelItems: InputSearchItem[] = hotels.map((hotel: any) => {
              const allHotelData = [
                hotel.name,
                hotel.city,
                hotel.state,
                hotel.country,
              ].filter((item: any) => !!item);
              return {
                value: `hotel|${hotel.id}`,
                label: allHotelData.join(', '),
              };
            });

            setHotelsCitiesResults([...cityItems, ...hotelItems]);
          })
          .catch(err => {
            console.error('Error Searching Hotels: ', err);
          });
      else setHotelsCitiesResults([]);
    },
    [session?.user?.id_token]
  );

  const handleChangeDestination = (value: string | number) => {
    const [type, destination] = String(value).split('|');

    dispatch(setDestination({ destination: String(value) || '' }));

    switch (type) {
      case 'hotel':
        dispatch(setHotelId({ hotel_id: destination || '' }));
        break;
      case 'city':
        dispatch(setCity({ city: destination || '' }));
        break;
      default:
        break;
    }
  };

  const handleChangeDates = ({ startDate, endDate }: RangeDateType) => {
    dispatch(setCheckin({ check_in: startDate?.format('YYYY-MM-DD') || '' }));
    dispatch(setCheckout({ check_out: endDate?.format('YYYY-MM-DD') || '' }));
  };

  const calcTotalTravelers = () => {
    let adults = 0;
    let children = 0;
    filterNew.rooms.map((item: any) => {
      adults += item.number_of_adults;
      children += item.children_age.length;
    });
    return `${filterNew.rooms.length} ${t(
      filterNew.rooms.length === 1 ? 'stays.room' : 'stays.rooms'
    )}, ${adults + children} ${t('stays.travelers')}`;
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) {
      redirectToSignUp();
      return;
    }

    if (searchType === 'hotelUpdate') {
      const tempSearchParams = {
        ...filterNew,
        hotel_id: hotelId,
      };
      //TODO Replace width router replace and decode with different ways
      window.location.replace(
        `${window.location.origin}/booking/stay/${createQueryString(
          tempSearchParams
        )}`
      );
    } else {
      handleSubmit();
    }
  };

  const setHotelsData = (hotels: HotelInfo[]) => {
    dispatch(
      setHotels({
        hotels: hotels,
      })
    );

    const { hours, minutes, seconds } = calculateTempResultId();
    dispatch(setResultId({ resultId: `id${hours}${minutes}${seconds}` }));
    dispatch(setFilterPriceMaxLimit());
    dispatch(setFilterPriceMinLimit());
  };

  const calculateTempResultId = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return {
      hours,
      minutes,
      seconds,
    };
  };

  const handleRes = (data: any) => {
    const hotelsFound = data.reduce((acc: any, subArr: any) => {
      return acc.concat(subArr);
    }, []);

    setHotelsData(hotelsFound);
    const stringEncode = createQueryString(filterNew);

    router.push(`/booking/${stringEncode}`, `/booking/${stringEncode}`, {
      locale: i18n.language,
    });
  };

  const updateHotelsData = (hotels: HotelInfo[]) => {
    dispatch(addHotels({ hotels: hotels }));
    dispatch(setFilterPriceMaxLimit());
    dispatch(setFilterPriceMinLimit());
  };

  const emptyHotelResults = () => {
    resetHotels();
  };

  const handleTBOError = () => {
    dispatch(setNotHotelAvailableFound());
  };

  const handleSetPeticionId = (peticionId: string) => {
    setPeticionId(peticionId);
  };

  const updateProgressStatus = (total: number, current: number) => {
    dispatch(setSearchProgress(current));
    dispatch(setSearchTotal(total));
  };

  const handleSubmit = async () => {
    dispatch(setSearchProgress(true));
    setLoading(true);
    emptyHotelResults();

    dispatch(setHotelFound({ hotelFound: '' }));

    dispatch(setEmptyFilter());
    updateProgressStatus(0, 0);

    try {
      const idRequest = peticionId;

      if (filterNew.destination.includes('hotel')) {
        const messageForHotelSearch = {
          ...filterNew,
          currency: 'USD',
          hotel_id: hotelData?.id || filterNew.hotel_id,
          requestId: idRequest,
          city: '',
          token: {
            headers: {
              Authorization: 'Bearer ' + session?.user.id_token,
              'Content-Type': 'application/json',
            },
          },
        };

        hotelService
          .searchHotel(messageForHotelSearch)
          .then(res => {
            handleRes(res);
            updateProgressStatus(2, 2);
          })
          .catch(error => {
            const hotelNotFoundMessage = t('stays.no_hotel_found');
            dispatch(setHotelFound({ hotelFound: hotelNotFoundMessage }));
          })
          .finally(() => {
            setLoading(false);
            setSearchProgress(false);
          });
      } else {
        const messageForCitySearch = {
          ...filterNew,
          NoOfRooms: filterNew.rooms.length,
          currency: 'USD',
          requestId: idRequest,
          nationality: config.WHITELABELNATIONALITY || 'US',
          token: {
            headers: {
              Authorization: 'Bearer ' + session?.user.id_token,
              'Content-Type': 'application/json',
            },
          },
        };

        hotelService
          .searchCity(
            messageForCitySearch,
            updateHotelsData,
            updateProgressStatus,
            handleSetPeticionId,
            handleTBOError
          )
          .then(res => {
            handleRes(res);
            dispatch(setLoadedChange(true));
          })
          .catch(error => {
            dispatch(setSocketError());
          })
          .finally(() => {
            setLoading(false);
            dispatch(setSearchProgress(false));
          });
      }
    } catch (error) {
      setLoading(false);
      dispatch(setSocketError());
    }
  };

  const handleCloseRegModal = () => {
    setRegisterModalOpen(false);
  };

  const handleMinus = (index: number, type: string) => {
    dispatch(setSubstractTraveler({ index, type }));
  };

  const handlePlus = (index: number, type: string) => {
    dispatch(setAddTraveler({ index, type }));
  };

  const handleAddRoom = () => {
    dispatch(setAddRoom());
  };

  const handleRemoveRoom = () => {
    dispatch(setSubstractRoom());
  };

  const redirectToSignUp = () => {
    router.push('/signin');
  };

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  const checkEmptyParams = (filterNew: any): boolean => {
    const { destination, check_in, check_out } = filterNew;
    // uncomment to test
    // return true;
    return !(!!destination && !!check_in && !!check_out);
  };

  const isOutsideRange = (date: any) => {
    return date.isSameOrBefore(moment(), 'day');
  };

  return (
    <>
      <RegisterModal open={registerModalOpen} onClose={handleCloseRegModal} />

      <form
        className={`${styles.hotelSearch} form-search-booking ${styles[`hotelSearch${source}`]}`}
        onClick={handleClickForm}
        onSubmit={submitHandler}
      >
        <div
          className={`${styles.hotelSearch_destination} ${styles[`hotelSearch_destination${source}`]}`}
        >
          <Image
            alt="icon"
            src={pinIcon}
            className={styles.hotelSearch_destination_icon}
          />
          {hotelData?.hotel_name ? (
            <Input readOnly value={hotelData.hotel_name} className="input" />
          ) : (
            <InputSearch
              items={hotelsCitiesResults}
              defaultSelectedOption={defaultDestination}
              placeholder={t('home.where') || ''}
              placeholderOnSearch={t('common.search') || ''}
              className={`${styles.hotelSearch_destination_selection} ${styles[`hotelSearch_destination_selection${source}`]}`}
              classNameWrapper={styles.hotelSearch_destination_wrapper}
              classNameMenu={styles.hotelSearch_destination_dropdown}
              onSearch={handleSearchDestination}
              onChange={handleChangeDestination}
              imageItem={hotelIcon}
              imagesItemByType={{
                city: pinIcon,
              }}
              delayOnSearchTime={250}
            />
          )}
        </div>

        <div
          className={`${styles.hotelSearch_dates} ${styles[`hotelSearch_dates${source}`]}`}
        >
          <DateRangePicker
            noBorder
            firstDayOfWeek={1}
            disabled={!session}
            showClearDates={false}
            startDateId="startDate"
            startDate={filterNew.check_in ? moment(filterNew.check_in) : null}
            startDatePlaceholderText="Check in"
            endDateId="endDate"
            endDate={filterNew.check_out ? moment(filterNew.check_out) : null}
            onDatesChange={handleChangeDates}
            endDatePlaceholderText="Check out"
            hideKeyboardShortcutsPanel
            displayFormat="dd, D MMM"
            verticalHeight={windowSize > 674 ? 0 : 370}
            orientation={windowSize > 674 ? 'horizontal' : 'vertical'}
            focusedInput={focus}
            onFocusChange={(focus: null | 'startDate' | 'endDate') =>
              setFocus(focus)
            }
            customInputIcon={<Image alt="icon" src={calendarIcon} />}
            customArrowIcon={<Image alt="icon" src={lineIcon} />}
            navPrev={<Image alt="icon" src={arrowLeftIcon} />}
            navNext={<Image alt="icon" src={arrowRightIcon} />}
            isOutsideRange={isOutsideRange}
          />
        </div>

        <div
          className={`${styles.hotelSearch_travelers} ${styles[`hotelSearch_travelers${source}`]}`}
        >
          <Image alt="icon" src={travelerIcon} />
          <Popover
            buttonLabel={calcTotalTravelers()}
            classNameMenu={styles.hotelSearch_travelers_menu}
            classNameButton={styles.hotelSearch_travelers_button}
            placement="bottom-end"
          >
            <TravelersRooms
              origin={source}
              actualRooms={filterNew.rooms}
              onAddRoom={handleAddRoom}
              onRemoveRoom={handleRemoveRoom}
              onAddTraveler={handlePlus}
              onRemoveTraveler={handleMinus}
            />
          </Popover>
        </div>

        <button
          data-testid="hotel-search-submit"
          id="submit-button"
          type="submit"
          className={`${styles.hotelSearch_button} ${styles[`hotelSearch_button${source}`]} custom`}
          // comment to test
          disabled={checkEmptyParams(filterNew) || loading}
        >
          <div className="flex justify-center">
            {loading ? <SearchLoader /> : t('common.search')}
          </div>
        </button>
      </form>
    </>
  );
};

export default HotelSearch;
