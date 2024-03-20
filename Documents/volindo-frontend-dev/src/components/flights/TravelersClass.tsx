import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

import Image from 'next/image';
import { InputPicker, Whisper, Tooltip, Button } from 'rsuite';

import ArrowIcon from '@icons/arrow-down.svg';

import {
  useAppDispatch,
  incrementFlightAdults,
  incrementFlightChildren,
  incrementFlightInfants,
  decrementFlightAdults,
  decrementFlightChildren,
  decrementFlightInfants,
  setFlightClass,
  useAppSelector,
} from '@context';

const TravelersClass = ({
  isResultsView = false,
  windowSize,
  disabled = false,
}: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { adults, children, infants } = useAppSelector(
    state => state.flights.passengers
  );
  const flightsClass = useAppSelector(state => state.flights.class);
  const flightsPassengers = useAppSelector(state => state.flights.passengers);

  const refTooltip = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const maxPassengersTotal =
    flightsPassengers.adults +
      flightsPassengers.children +
      flightsPassengers.infants ===
    9;

  const minusAdult = () => {
    dispatch(decrementFlightAdults());
  };

  const plusAdult = () => {
    dispatch(incrementFlightAdults());
  };

  const minusChild = () => {
    dispatch(decrementFlightChildren());
  };

  const plusChild = () => {
    dispatch(incrementFlightChildren());
  };

  const minusInfant = () => {
    dispatch(decrementFlightInfants());
  };

  const plusInfant = () => {
    dispatch(incrementFlightInfants());
  };

  const handleClass = (value: any) => {
    dispatch(setFlightClass(value));
    setShowTooltip(false);
  };

  const data2 = [
    { name: t('flights.classes.Y'), value: 'Y' },
    { name: t('flights.classes.S'), value: 'S' },
    { name: t('flights.classes.C'), value: 'C' },
    { name: t('flights.classes.F'), value: 'F' },
  ].map((item, i) => ({
    label: item.name,
    value: item.value,
    key: i,
  }));

  const newPlacement = windowSize > 768 ? 'bottomEnd' : 'bottom';

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (refTooltip.current && !refTooltip.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip)
      document.addEventListener('click', handleClickOutside, true);
    else document.removeEventListener('click', handleClickOutside, true);
  }, [showTooltip]);

  return (
    <>
      <div className={`w-[90%] ${isResultsView ? 'ml-2' : ''}`}>
        <Whisper
          open={showTooltip}
          onClick={() => setShowTooltip(true)}
          placement={newPlacement}
          controlId={`control-id-${'bottomStart'}`}
          speaker={
            <Tooltip className="traveler-tooltip min-w-[82%] bg-[white] text-black left-[35px] md:min-w-[300px] !md:left-[590px] shadow-lg">
              <div
                className="px-[15px] py-[20px] rounded-[27px]"
                ref={refTooltip}
              >
                <div className="w-[inherit] flex justify-between mt-4">
                  <div className="adultsText font-[510] text-base leading-[23px]">
                    {t('stays.adults')}
                  </div>
                  <div className="controls flex min-w-[40px]">
                    <button
                      className="controls-control w-[24px] mx-[4px] flex justify-items-center justify-center bg-[#E9E9E9] rounded-[50%]"
                      onClick={minusAdult}
                      disabled={adults <= 1}
                    >
                      -
                    </button>
                    <span className="font-[400] h-[24px] leadin-[23px]">
                      {adults}
                    </span>
                    <button
                      className="controls-control w-[24px] mx-[4px] flex justify-items-center justify-center bg-[#E9E9E9] rounded-[50%] items-center"
                      onClick={plusAdult}
                      disabled={maxPassengersTotal}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="w-[inherit] flex justify-between mt-4">
                  <div className="childtext font-[510] text-base leading-[23px]">
                    {t('stays.children')}
                    <span className="text-[#00000070] text-xs ml-1">
                      {t('flights.agesChildren')}
                    </span>
                  </div>

                  <div className="controls flex min-w-[40px]">
                    <button
                      className="controls-control w-[24px] mx-[4px] flex justify-items-center justify-center bg-[#E9E9E9] rounded-[50%] items-center"
                      onClick={minusChild}
                      disabled={children === 0}
                    >
                      -
                    </button>
                    <span className="font-[400] h-[24px] leadin-[23px]">
                      {children}
                    </span>
                    <button
                      className="controls-control w-[24px] mx-[4px] flex justify-items-center justify-center bg-[#E9E9E9] rounded-[50%] items-center"
                      onClick={plusChild}
                      disabled={maxPassengersTotal}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="w-[inherit] flex justify-between mt-4">
                  <div className="childtext font-[510] text-base leading-[23px]">
                    {t('flights.infants')}
                    <span className="text-[#00000070] text-xs ml-1">
                      {t('flights.agesInfant')}
                    </span>
                  </div>

                  <div className="controls flex min-w-[40px]">
                    <button
                      className="controls-control w-[24px] mx-[4px] flex justify-items-center justify-center bg-[#E9E9E9] rounded-[50%] items-center"
                      onClick={minusInfant}
                      disabled={infants === 0}
                    >
                      -
                    </button>
                    <span className="font-[400] h-[24px] leadin-[23px]">
                      {infants}
                    </span>
                    <button
                      className="controls-control w-[24px] mx-[4px] flex justify-items-center justify-center bg-[#E9E9E9] rounded-[50%] items-center"
                      onClick={plusInfant}
                      disabled={maxPassengersTotal}
                    >
                      +
                    </button>
                  </div>
                </div>

                <InputPicker
                  className="input-picker-traveler w-[100%] border-transparent mt-4"
                  menuClassName="text-sm"
                  onChange={handleClass}
                  data={data2}
                  placement={'bottomStart'}
                  value={flightsClass}
                  cleanable={false}
                  container={() => refTooltip.current as HTMLElement}
                />
              </div>
            </Tooltip>
          }
        >
          <Button
            className={`w-[100%] justify-start text-black ${
              !isResultsView
                ? 'lg:text-white'
                : 'flex items-center gap-2 justify-start w-fit'
            } px-5 pl-[10px]`}
            disabled={disabled}
          >
            {flightsClass ? `${t(`flights.classes.${flightsClass}`)}, ` : ''}
            {adults + children + infants} {t('flights.passenger')}
            {isResultsView ? (
              <Image src={ArrowIcon} width={10} height={10} alt="arrow" />
            ) : null}
          </Button>
        </Whisper>
      </div>
    </>
  );
};

export default TravelersClass;
