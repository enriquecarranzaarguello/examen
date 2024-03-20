import { FC, useEffect, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, InputGroup, InputPicker, RangeSlider } from 'rsuite';
import {
  AvailableFilters,
  FilterFlights,
  GroupFilterFlights,
} from '../../common/schemas/filters';

import { timeOnRange } from '@utils/timeFunctions';

import { usePrice } from 'src/components/utils/Price/Price';

const FlightsFilter: FC<{
  minPrice: number;
  maxPrice: number;
  airlines: string[];
  availableFilters: AvailableFilters;
  onFilterChange: (_filters: FilterFlights[]) => void;
  className?: string;
}> = ({ minPrice, maxPrice, airlines, onFilterChange, availableFilters }) => {
  const price = usePrice();
  const { t } = useTranslation();
  // State for setting min and max prices selected by user
  const [minFilterPrice, setMinFilterPrice] = useState(minPrice);
  const [maxFilterPrice, setMaxFilterPrice] = useState(maxPrice);
  // State for filters
  const [filters, setFilters] = useState<FilterFlights[]>([]);
  // State of extraButtons checked (ones only accesible from dropdown)
  const [extraAirlineButton, setExtraAirlineButton] = useState<string[]>([]);

  useEffect(() => {
    setFilters([]);
    setExtraAirlineButton([]);
    setMinFilterPrice(minPrice);
    setMaxFilterPrice(maxPrice);
  }, [availableFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (minFilterPrice < minPrice) setMinFilterPrice(minPrice);
      if (minFilterPrice > maxPrice) setMinFilterPrice(maxPrice);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [minFilterPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (maxFilterPrice < minPrice) setMaxFilterPrice(minPrice);
      if (maxFilterPrice > maxPrice) setMaxFilterPrice(maxPrice);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [maxFilterPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const name = 'rangePrice';
      const group = GroupFilterFlights.PRICE;
      const fnc = (itinerary: any) =>
        itinerary.total_price.total_price <= maxFilterPrice &&
        itinerary.total_price.total_price >= minFilterPrice;

      const filterWithoutRangePrice = [...filters].filter(
        f => !(f.name === name && f.group === group)
      );
      filterWithoutRangePrice.push({ name, group, fnc });
      setFilters(filterWithoutRangePrice);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [maxFilterPrice, minFilterPrice]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  // * HANDLE FUNCTIONS * //

  const handleAllAirlines = () => {
    if (filters.find(f => f.group === GroupFilterFlights.AIRLINE) === undefined)
      return; // Do nothing if there is no airline filter

    // Remove all airlines filter
    setFilters(currentFilters =>
      currentFilters.filter(f => !(f.group === GroupFilterFlights.AIRLINE))
    );
  };

  const handleOnClickExtraButton = (airline: string) => {
    // Remove on filters and on extra buttons list
    setFilters(currentFilters =>
      currentFilters.filter(
        f => !(f.name === airline && f.group === GroupFilterFlights.AIRLINE)
      )
    );
    const time = setTimeout(() => {
      setExtraAirlineButton(extraAirlineButton.filter(a => a !== airline));
    }, 300);

    return () => {
      clearTimeout(time);
    };
  };

  const handleSelectAirlinePicker = (airline: string) => {
    toggleFilter(airline, GroupFilterFlights.AIRLINE, (itinerary: any) =>
      itinerary.flights.some(
        (flight: any) =>
          flight.departure_details.airline.marketing.airline_name === airline ||
          flight.arrival_details.airline.marketing.airline_name === airline
      )
    );

    if (airlines.indexOf(airline) >= 5) {
      if (!extraAirlineButton.includes(airline)) {
        // Add on extraButtons
        setExtraAirlineButton([...extraAirlineButton, airline]);
      } else {
        // Remove of extraButtons
        setExtraAirlineButton(extraAirlineButton.filter(a => a !== airline));
      }
    }
  };

  // * FILTERS UTILIY FUNCTIONS * //

  function filterExists(name: string | number, group: GroupFilterFlights) {
    return (
      filters.find(f => f.name === name && f.group === group) !== undefined
    );
  }

  function toggleFilter(
    name: string,
    group: GroupFilterFlights,
    fnc: Function
  ) {
    if (filterExists(name, group)) {
      // Remove filter
      setFilters(currentFilters =>
        currentFilters.filter(f => !(f.name === name && f.group === group))
      );
    } else {
      // Add filter
      setFilters(currentFilters => [...currentFilters, { name, group, fnc }]);
    }
  }

  return (
    <div className="px-4 pb-4 lg:pl-0 lg:pr-4 lg:mt-4 flex flex-col gap-9">
      {/* Filter By Price */}
      <article>
        <label className="text-[16px] text-white opacity-[.48]">
          {t('flights.filters.price')}
        </label>
        <div className="flex justify-between mb-2 mt-4">
          <InputGroup
            inside
            className="bg-transparent rounded-[15px] border border-[#E2E2E2] h-[28px] text-center"
            style={{ width: '90px' }}
          >
            <InputGroup.Addon className="text-white h-[28px] text-center">
              {price.countrySymbol}
            </InputGroup.Addon>
            <Input
              className="bg-transparent rounded-[15px] border border-[#E2E2E2] h-[28px] text-center text-white"
              value={price.integerRate(minFilterPrice)}
              type="number"
              onChange={value =>
                setMinFilterPrice(price.baseCurrency(Number(value)))
              }
            />
          </InputGroup>
          <InputGroup
            inside
            className="bg-transparent rounded-[15px] border border-[#E2E2E2] h-[28px] text-center"
            style={{ width: '90px' }}
          >
            <InputGroup.Addon className="text-white h-[28px] text-center">
              {price.countrySymbol}
            </InputGroup.Addon>
            <Input
              className="bg-transparent rounded-[15px] border border-[#E2E2E2] h-[28px] text-center text-white"
              value={price.integerRate(maxFilterPrice)}
              type="number"
              onChange={value =>
                setMaxFilterPrice(price.baseCurrency(Number(value)))
              }
            />
          </InputGroup>
        </div>
        <div className="my-5">
          <RangeSlider
            min={minPrice}
            max={maxPrice}
            value={[minFilterPrice, maxFilterPrice]}
            onChange={prices => {
              setMinFilterPrice(prices[0]);
              setMaxFilterPrice(prices[1]);
            }}
            className="progress-slider-flights"
            renderTooltip={(value: number | undefined) => (
              <div>{`$${price.integerRate(Number(value))}`}</div>
            )}
          />
        </div>
      </article>
      {/*  Filter By Airline*/}
      <article className="flex flex-col gap-1">
        <label className="text-[16px] text-white opacity-[.48]">
          {t('flights.filters.airlines')}
        </label>
        {/* By Text */}
        <div className="flex flex-row xs:justify-between mt-4">
          <InputPicker
            className="airline-picker"
            menuClassName="black-picker"
            placeholder={t('flights.filters.airline') || ''}
            data={airlines.map(airline => ({ value: airline, label: airline }))}
            onSelect={handleSelectAirlinePicker}
          />
        </div>
        {/* By RadioButton */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-y-2 mt-4">
            {/* All airlines */}
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={handleAllAirlines}
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(f => f.group === GroupFilterFlights.AIRLINE) ===
                  undefined
                }
                readOnly
              />
              <p className="text-[15px] text-white">
                {t('flights.filters.allAirlines')}
              </p>
            </button>

            {/* TOP 5 AIRLINES */}
            {airlines.slice(0, 5).map((airline, index) => (
              <button
                key={index}
                type="button"
                className="flex gap-2 items-center py-1"
                onClick={() => {
                  toggleFilter(
                    airline,
                    GroupFilterFlights.AIRLINE,
                    (itinerary: any) =>
                      itinerary.flights.some(
                        (flight: any) =>
                          flight.departure_details.airline.marketing
                            .airline_name === airline ||
                          flight.arrival_details.airline.marketing
                            .airline_name === airline
                      )
                  );
                }}
              >
                <input
                  className="w-5 h-5 inputradiohotelM"
                  type="radio"
                  checked={
                    filters.find(
                      f =>
                        f.name === airline &&
                        f.group === GroupFilterFlights.AIRLINE
                    ) !== undefined
                  }
                  readOnly
                />
                <p className="text-[15px] text-white">{airline}</p>
              </button>
            ))}

            {/* REMAINING AIRLINES (CHECKED ON SEARCH) */}
            {extraAirlineButton.map(airline => (
              <button
                type="button"
                key={airline}
                className="flex gap-2 items-center py-1"
                onClick={() => handleOnClickExtraButton(airline)}
              >
                <input
                  className="w-5 h-5 inputradiohotelM"
                  type="radio"
                  checked
                  readOnly
                />
                <p className="text-[15px] text-white">{airline}</p>
              </button>
            ))}
          </div>
        </div>
      </article>
      {/* Filter by Baggage */}
      <article>
        <label className="text-sm text-white opacity-[.48]">
          {t('flights.baggage')}
        </label>
        <div className="flex flex-col gap-y-2 mt-4">
          {availableFilters.arePersonalItemOnly ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'personalItem',
                  GroupFilterFlights.BAGGAGE,
                  (itinerary: any) =>
                    !itinerary.general_details.carry_on_available &&
                    !itinerary.general_details.checked_baggage_available
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'personalItem' &&
                      f.group === GroupFilterFlights.BAGGAGE
                  ) !== undefined
                }
                readOnly
              />
              <p className="text-base text-white ">
                {t('flights.luggage.only')}
              </p>
            </button>
          ) : null}
          {availableFilters.areCarryOnBaggage ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'carryOn',
                  GroupFilterFlights.BAGGAGE,
                  (itinerary: any) =>
                    itinerary.general_details.carry_on_available &&
                    !itinerary.general_details.checked_baggage_available
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'carryOn' &&
                      f.group === GroupFilterFlights.BAGGAGE
                  ) !== undefined
                }
                readOnly
              />
              <p className="text-base text-white ">
                {t('flights.luggage.carry-on')}
              </p>
            </button>
          ) : null}
          {availableFilters.areCheckedBaggage ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'checked',
                  GroupFilterFlights.BAGGAGE,
                  (itinerary: any) =>
                    itinerary.general_details.checked_baggage_available
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'checked' &&
                      f.group === GroupFilterFlights.BAGGAGE
                  ) !== undefined
                }
                readOnly
              />
              <p className="text-base text-white ">
                {t('flights.luggage.documented')}
              </p>
            </button>
          ) : null}
        </div>
      </article>
      {/* Filter By Stops */}
      <article>
        <label className="text-base text-white opacity-[.48]">
          {t('flights.stops')}
        </label>
        <div className="flex flex-col gap-y-2 mt-[9px]">
          {availableFilters.areNonstops ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'nonstop',
                  GroupFilterFlights.STOPS,
                  (itinerary: any) =>
                    itinerary.flights.some(
                      (flight: any) => flight.stops.length === 0
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'nonstop' &&
                      f.group === GroupFilterFlights.STOPS
                  ) !== undefined
                }
                readOnly
              />
              <p className="text-[15px] text-white">
                {t('flights.filters.nonstop')}
              </p>
            </button>
          ) : null}
          {availableFilters.are1Stop ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  '1stop',
                  GroupFilterFlights.STOPS,
                  (itinerary: any) =>
                    itinerary.flights.some(
                      (flight: any) => flight.stops.length === 2
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === '1stop' && f.group === GroupFilterFlights.STOPS
                  ) !== undefined
                }
                readOnly
              />
              <p className="text-[15px] text-white">
                {t('flights.filters.1stop')}
              </p>
            </button>
          ) : null}
          {availableFilters.areMore2Stops ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'more2stop',
                  GroupFilterFlights.STOPS,
                  (itinerary: any) =>
                    itinerary.flights.some(
                      (flight: any) => flight.stops.length > 2
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'more2stop' &&
                      f.group === GroupFilterFlights.STOPS
                  ) !== undefined
                }
                readOnly
              />
              <p className="text-[15px] text-white">
                {t('flights.filters.more2stop')}
              </p>
            </button>
          ) : null}
        </div>
      </article>
      {/* Filter by Departure Time */}
      <article>
        <label className="text-base text-white opacity-[.48]">
          {t('flights.filters.departure')}
        </label>
        <div className="flex flex-col gap-y-2 mt-[9px]">
          {availableFilters.departureEarly ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'early',
                  GroupFilterFlights.DEPARTURE_TIME,
                  (itinerary: any) =>
                    itinerary.flights.some((flight: any) =>
                      timeOnRange(
                        flight.departure_details.departure_time,
                        '00:00',
                        '04:59'
                      )
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'early' &&
                      f.group === GroupFilterFlights.DEPARTURE_TIME
                  ) !== undefined
                }
                readOnly
              />
              <p className="flex flex-col text-left">
                <span className="text-base text-white ">
                  {t('flights.filters.early')}
                </span>
                <span className="text-xs text-white opacity-50 ">
                  (00:00 - 04:59)
                </span>
              </p>
            </button>
          ) : null}
          {availableFilters.departureMorning ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'morning',
                  GroupFilterFlights.DEPARTURE_TIME,
                  (itinerary: any) =>
                    itinerary.flights.some((flight: any) =>
                      timeOnRange(
                        flight.departure_details.departure_time,
                        '05:00',
                        '11:59'
                      )
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'morning' &&
                      f.group === GroupFilterFlights.DEPARTURE_TIME
                  ) !== undefined
                }
                readOnly
              />
              <p className="flex flex-col text-left">
                <span className="text-[15px] text-white">
                  {t('flights.filters.morning')}
                </span>
                <span className="text-xs text-white opacity-50">
                  (05:00 - 11:59)
                </span>
              </p>
            </button>
          ) : null}
          {availableFilters.departureAfternoon ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'afternoon',
                  GroupFilterFlights.DEPARTURE_TIME,
                  (itinerary: any) =>
                    itinerary.flights.some((flight: any) =>
                      timeOnRange(
                        flight.departure_details.departure_time,
                        '12:00',
                        '17:59'
                      )
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'afternoon' &&
                      f.group === GroupFilterFlights.DEPARTURE_TIME
                  ) !== undefined
                }
                readOnly
              />
              <p className="flex flex-col text-left">
                <span className="text-[15px] text-white">
                  {t('flights.filters.afternoon')}
                </span>
                <span className="text-xs text-white opacity-50">
                  (12:00 - 17:59)
                </span>
              </p>
            </button>
          ) : null}
          {availableFilters.departureEvening ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'evening',
                  GroupFilterFlights.DEPARTURE_TIME,
                  (itinerary: any) =>
                    itinerary.flights.some((flight: any) =>
                      timeOnRange(
                        flight.departure_details.departure_time,
                        '18:00',
                        '23:59'
                      )
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'evening' &&
                      f.group === GroupFilterFlights.DEPARTURE_TIME
                  ) !== undefined
                }
                readOnly
              />
              <p className="flex flex-col text-left">
                <span className="text-[15px] text-white">
                  {t('flights.filters.evening')}
                </span>
                <span className="text-xs text-white opacity-50">
                  (18:00 - 23:59)
                </span>
              </p>
            </button>
          ) : null}
        </div>
      </article>
      {/* Filter by Arrival Time */}
      <article>
        <label className="text-base text-white opacity-[.48]">
          {t('flights.filters.arrival')}
        </label>
        <div className="flex flex-col gap-y-2 mt-[9px]">
          {availableFilters.arrivalEarly ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'early',
                  GroupFilterFlights.ARRIVAL_TIME,
                  (itinerary: any) =>
                    itinerary.flights.some((flight: any) =>
                      timeOnRange(
                        flight.arrival_details.arrival_time,
                        '00:00',
                        '04:59'
                      )
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'early' &&
                      f.group === GroupFilterFlights.ARRIVAL_TIME
                  ) !== undefined
                }
                readOnly
              />
              <p className="flex flex-col text-left">
                <span className="text-base text-white ">
                  {t('flights.filters.early')}
                </span>
                <span className="text-xs text-white opacity-50 ">
                  (00:00 - 04:59)
                </span>
              </p>
            </button>
          ) : null}
          {availableFilters.arrivalMorning ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'morning',
                  GroupFilterFlights.ARRIVAL_TIME,
                  (itinerary: any) =>
                    itinerary.flights.some((flight: any) =>
                      timeOnRange(
                        flight.arrival_details.arrival_time,
                        '05:00',
                        '11:59'
                      )
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'morning' &&
                      f.group === GroupFilterFlights.ARRIVAL_TIME
                  ) !== undefined
                }
                readOnly
              />
              <p className="flex flex-col text-left">
                <span className="text-[15px] text-white">
                  {t('flights.filters.morning')}
                </span>
                <span className="text-xs text-white opacity-50">
                  (05:00 - 11:59)
                </span>
              </p>
            </button>
          ) : null}
          {availableFilters.arrivalAfternoon ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'afternoon',
                  GroupFilterFlights.ARRIVAL_TIME,
                  (itinerary: any) =>
                    itinerary.flights.some((flight: any) =>
                      timeOnRange(
                        flight.arrival_details.arrival_time,
                        '12:00',
                        '17:59'
                      )
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'afternoon' &&
                      f.group === GroupFilterFlights.ARRIVAL_TIME
                  ) !== undefined
                }
                readOnly
              />
              <p className="flex flex-col text-left">
                <span className="text-[15px] text-white">
                  {t('flights.filters.afternoon')}
                </span>
                <span className="text-xs text-white opacity-50">
                  (12:00 - 17:59)
                </span>
              </p>
            </button>
          ) : null}
          {availableFilters.arrivalEvening ? (
            <button
              type="button"
              className="flex gap-2 items-center py-1"
              onClick={() =>
                toggleFilter(
                  'evening',
                  GroupFilterFlights.ARRIVAL_TIME,
                  (itinerary: any) =>
                    itinerary.flights.some((flight: any) =>
                      timeOnRange(
                        flight.arrival_details.arrival_time,
                        '18:00',
                        '23:59'
                      )
                    )
                )
              }
            >
              <input
                className="w-5 h-5 inputradiohotelM"
                type="radio"
                checked={
                  filters.find(
                    f =>
                      f.name === 'evening' &&
                      f.group === GroupFilterFlights.ARRIVAL_TIME
                  ) !== undefined
                }
                readOnly
              />
              <p className="flex flex-col text-left">
                <span className="text-[15px] text-white">
                  {t('flights.filters.evening')}
                </span>
                <span className="text-xs text-white opacity-50">
                  (18:00 - 23:59)
                </span>
              </p>
            </button>
          ) : null}
        </div>
      </article>
    </div>
  );
};

export default memo(FlightsFilter);
