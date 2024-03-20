import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import Image from 'next/image';
import moment from 'moment';
import { Form } from 'rsuite';
import { DisplayAirportType } from '@typing/types';

import calendarIcon from '@icons/calendar.svg';
import arrowLeftIcon from '@icons/arrow-left.svg';
import arrowRightIcon from '@icons/arrow-right.svg';
import lineIcon from '@icons/line.svg';
import pinIcon from '@icons/pin.svg';
import travelerIcon from '@icons/traveler.svg';
import PinIcon from '@icons/pin-gray-dot.svg';
import AirplaneIcon from '@icons/airplane.svg';

import {
  useAppSelector,
  useAppDispatch,
  setFlightOrigin,
  setFlightDestination,
  setFlightStartDate,
  setFlightEndDate,
} from '@context';

import { TravelersClass } from '@components';
import SearchLoader from '@components/SearchLoader';
import InputSearch, { InputSearchItem } from '@components/general/inputSearch';
import { getAirportByCode, getAirports } from '@utils/axiosClients';

const CustomSearch = ({
  onSubmit,
  index,
  windowSize,
  isResultsView = false,
  isLoading = false,
  isPurple,
}: any) => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const flightType = useAppSelector(state => state.flights.flightType);
  const segments = useAppSelector(state => state.flights.segments);
  const { origin, destination } = segments[index];

  const [focus, setFocus] = useState<null | 'startDate' | 'endDate'>(null);
  const [focused, setFocused] = useState(false);
  const [airportsOrigin, setAirportsOrigin] = useState<InputSearchItem[]>([]);
  const [airportsDestination, setAirportsDestination] = useState<
    InputSearchItem[]
  >([]);
  const [defaultOrigin, setDefaultOrigin] = useState<InputSearchItem | null>(
    null
  );
  const [defaultDestination, setDefaultDestination] =
    useState<InputSearchItem | null>(null);

  const caledarOrientation = windowSize > 768 ? 'horizontal' : 'vertical';
  const verticalHeightVar = windowSize > 768 ? 0 : 300;

  const handleOrigin = (value: any) => {
    dispatch(setFlightOrigin({ index: index, origin: value }));
  };

  const handleDestination = (value: any) => {
    dispatch(setFlightDestination({ index: index, destination: value }));
  };

  const handleChangeDates = ({ startDate, endDate }: any) => {
    if (startDate)
      dispatch(
        setFlightStartDate({
          index: index,
          startDate: startDate.toDate(),
        })
      );

    if (endDate)
      dispatch(
        setFlightEndDate({
          index: index,
          endDate: endDate.toDate(),
        })
      );
  };

  const handleSingleDateChange = (value: any) => {
    dispatch(
      setFlightStartDate({
        index: index,
        startDate: value.toDate(),
      })
    );
  };

  const handleSearchAirport = (
    search: string,
    setter: Dispatch<SetStateAction<InputSearchItem[]>>
  ) => {
    if (search) {
      getAirportsList(search).then(res => {
        setter(
          res.map(airport => {
            return {
              value: airport.code,
              label:
                airport.type === 'area' ? (
                  <>
                    <b>{airport.code}</b> {airport.city}, {airport.country}
                    <br />
                    {t('flights.allAirports')}
                  </>
                ) : (
                  <>
                    <b>{airport.code}</b> {airport.name}, {airport.city},{' '}
                    {airport.country}
                  </>
                ),
              labelOnSelection: `${airport.city} (${airport.code})`,
              sublevel: airport.type === 'sub',
              imageType: airport.type,
            };
          })
        );
      });
    } else {
      setter([]);
    }
  };

  // * Util Functions * //

  const getAirportsList: (
    search: string
  ) => Promise<DisplayAirportType[]> = async search => {
    try {
      return (await getAirports(search)).data;
    } catch (error) {
      console.error('Error on getting airports', error);
      return [];
    }
  };

  const RenderTitle = () => {
    const num = index + 1;
    return (
      <div className="my-[15px] text-white w-full flex justify-start px-[20px] ">
        {t('flights.flight')} {num}{' '}
      </div>
    );
  };

  useEffect(() => {
    const setDefaultAirport = (
      code: string,
      setter: Dispatch<SetStateAction<InputSearchItem | null>>
    ) => {
      getAirportByCode(code)
        .then(res => {
          setter({
            value: res.data.code,
            label: `${res.data.city} (${res.data.code})`,
          });
        })
        .catch(err => {
          console.error('Error getting airport by code', err);
        });
    };

    if (origin) setDefaultAirport(origin, setDefaultOrigin);
    if (destination) setDefaultAirport(destination, setDefaultDestination);
  }, [origin, destination]);

  return (
    <>
      {index + 1 > 1 ? <RenderTitle /> : ''}
      <Form
        className={`form-container flex flex-wrap gap-[10px] w-[inherit]
        lg:flex-nowrap lg:gap-[0px] ${
          isResultsView ? '' : 'lg:max-w-[855px]'
        } lg:bg-[white] lg:rounded-[32px] lg:items-center lg:pr-[2px] lg:h-[64px] ${
          flightType === 'multi trips'
            ? 'multripContainer'
            : flightType === 'round trip'
              ? 'roundtrip'
              : ''
        }`}
      >
        <div
          className={`leaving dropdownLoc relative flex mx-[2px] w-[inherit] bg-[white] rounded-[25px] h-[59px] justify-start items-center lg:m-[0px] ${
            isResultsView ? 'lg:flex-1' : 'flex-grow'
          }`}
        >
          <Image
            className="img w-[12px] mr-[17px] ml-[20px]"
            alt="icon"
            src={pinIcon}
          />
          <InputSearch
            key="origin"
            defaultSelectedOption={defaultOrigin}
            onChange={handleOrigin}
            onSearch={search => handleSearchAirport(search, setAirportsOrigin)}
            items={airportsOrigin}
            placeholder={t('flights.origin') || ''}
            placeholderOnSearch={t('common.search') || ''}
            imageItem={AirplaneIcon}
            imagesItemByType={{
              area: PinIcon,
            }}
            delayOnSearchTime={250}
            className="flightsInput"
          />
        </div>

        <div
          className={`going dropdownLoc relative flex mx-[2px] border-x-[1px] w-[inherit] bg-[white] rounded-[25px] h-[59px] justify-start items-center lg:rounded-[0px] lg:m-[0px] ${
            isResultsView ? 'lg:flex-1' : 'flex-grow'
          }`}
        >
          <Image
            alt="icon"
            src={pinIcon}
            className="w-[12px] mr-[17px] ml-[20px]"
          />
          <InputSearch
            key="destination"
            defaultSelectedOption={defaultDestination}
            onChange={handleDestination}
            onSearch={search =>
              handleSearchAirport(search, setAirportsDestination)
            }
            items={airportsDestination}
            placeholder={t('flights.destination') || ''}
            placeholderOnSearch={t('common.search') || ''}
            imageItem={AirplaneIcon}
            imagesItemByType={{
              area: PinIcon,
            }}
            delayOnSearchTime={250}
            className="flightsInput"
          />
        </div>

        <div
          className={`calendar ${
            flightType === 'multi trips' ? 'calendar-multi' : ''
          } ${isResultsView ? 'calendar--resultView' : ''}`}
        >
          {flightType === 'round trip' ? (
            <DateRangePicker
              readOnly={false}
              data-testid="roundtrip-calendar"
              noBorder
              showClearDates={false}
              firstDayOfWeek={1}
              disabled={!session}
              startDateId="startDate"
              // TODO: Start date remove null
              startDate={
                segments[index]?.startDate
                  ? moment(segments[index]?.startDate)
                  : null
              }
              startDatePlaceholderText={t('flights.check-in') || ''}
              endDateId="endDate"
              endDate={
                segments[index]?.endDate
                  ? moment(segments[index]?.endDate)
                  : null
              }
              endDatePlaceholderText={t('flights.check-out') || ''}
              hideKeyboardShortcutsPanel
              onDatesChange={handleChangeDates}
              displayFormat="dd, D MMM"
              focusedInput={focus}
              verticalHeight={verticalHeightVar}
              orientation={caledarOrientation}
              onFocusChange={(focus: null | 'startDate' | 'endDate') =>
                setFocus(focus)
              }
              customInputIcon={
                <Image
                  className={`flex justify-center`}
                  alt="icon"
                  src={calendarIcon}
                />
              }
              customArrowIcon={<Image alt="icon" src={lineIcon} />}
              navPrev={<Image alt="icon" src={arrowLeftIcon} />}
              navNext={<Image alt="icon" src={arrowRightIcon} />}
              minimumNights={0}
            />
          ) : (
            <SingleDatePicker
              data-testid="oneway-calendar"
              noBorder
              placeholder={`${t('flights.departure')}`}
              date={
                segments[index]?.startDate
                  ? moment(segments[index]?.startDate)
                  : null
              }
              onDateChange={handleSingleDateChange}
              focused={focused}
              onFocusChange={({ focused }) => setFocused(focused)}
              id="your_unique_id"
              customInputIcon={<Image alt="icon" src={calendarIcon} />}
              navPrev={<Image alt="icon" src={arrowLeftIcon} />}
              navNext={<Image alt="icon" src={arrowRightIcon} />}
              displayFormat="dd, D MMM"
              firstDayOfWeek={1}
              numberOfMonths={1}
            />
          )}
        </div>

        {isResultsView ? (
          <div className="hidden lg:block flex-1">
            <TravelersClass
              isResultsView={isResultsView}
              disabled={index > 0}
            />
          </div>
        ) : null}

        {/* TO DISPLAY TRAVELERS CLASS ON MOBILE */}
        <div className="lowerButton pl-[15px] lg:hidden flex mx-[2px] border-x-[1px] w-[inherit] bg-[white] rounded-[25px] h-[59px] items-center MOBILE lg:rounded-[0px] lg:m-[0px] lg:w-[14%] lg:items-center lg:h-[48px] lg:left-[3px]">
          <Image className="" alt="icon" src={travelerIcon} />
          <TravelersClass disabled={index > 0} />
        </div>

        {flightType !== 'multi trips' && (
          <button
            className={`mobileButton relative flex mx-[2px] px-8 flex-1 rounded-[25px] h-[59px] mt-[30px] justify-center items-center lg:rounded-[32px] lg:m-[0px] lg:left[14px] lg:h-full lg:left-[3px] disabled:cursor-not-allowed customTailwind ${
              isResultsView || isPurple
                ? 'bg-whiteLabelColor lg:max-w-[180px] !mt-0'
                : 'bg-[black]'
            }`}
            disabled={isLoading}
            onClick={onSubmit}
          >
            <span className="flex justify-center scale-y-[0.8] text-[20px] font-[760] text-white md:scale-y-[1] lg:text-[17px]">
              {isLoading ? <SearchLoader /> : t('common.search')}
            </span>
          </button>
        )}
      </Form>
    </>
  );
};

export default CustomSearch;
