import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Dropdown, Progress } from 'rsuite';
import {
  useAppDispatch,
  useAppSelector,
  setFilterOrderBy,
  setLoadedChange,
} from '@context';

import type { HotelInfo } from '@typing/types';

import mapIcon from '@icons/map.svg';
import miniPin from '@icons/miniPin.svg';
import arrowRightTwoIcon from '@icons/arrow-right-two.svg';
import filerIcon from '@icons/filterIcon.svg';
import IconCloseBlack from '@icons/close-black.svg';

import {
  MapWrapperStays,
  ModalError,
  ModalComparingPrice,
  HotelResultCard,
  HotelFilters,
  GeneralButton,
} from '@components';

import { usePrice } from 'src/components/utils/Price/Price';

import styles from './stays.module.scss';

const Stays = () => {
  const myDivRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { results_id } = router.query || {};
  const price = usePrice();

  const [loading, setLoading] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [activeMarker, setActiveMarker] = useState<string | null>('');
  const [windowSize, setWindowSize] = useState(0);

  const [newFeaturePopUp, setNewFeaturePopUp] = useState<Boolean>(true);
  const [progress, setProgress] = useState(0);
  const [openComparingModal, setOpenComparingModal] = useState(false);
  const [hotelCompare, setHotelCompare] = useState<any>({});

  const hotelSearch = useAppSelector(state => state.hotels);

  const hotelsAvailable = useAppSelector<HotelInfo[]>(
    state => state.hotels.filteredResults
  );
  const hotelFoundNew = useAppSelector(state => state.hotels.hotelFound);
  const totalPeticions = useAppSelector<number>(
    state => state.hotels.loadingTotal
  );
  const currentPeticions = useAppSelector<number>(
    state => state.hotels.loadingProgress
  );
  const showProgressBar = useAppSelector<boolean>(
    state => state.hotels.showProgresBar
  );
  const currencySymbol = useAppSelector(
    state => state.general.currency.currencySymbol
  );

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [loading]);

  useEffect(() => {
    if (newFeaturePopUp) {
      setTimeout(() => {
        setNewFeaturePopUp(false);
      }, 10000);
    }
  }, [newFeaturePopUp]);

  const handleOpenMapRedirect = () => {
    if (openMap) {
      setOpenMap(!openMap);
    } else {
      setOpenMap(!openMap);
      if (myDivRef.current == null || myDivRef.current == undefined) {
        return;
      } else {
        myDivRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (hotelSearch?.results[0]?.LowestTotalFare !== undefined) {
      setProgress((currentPeticions * 100) / totalPeticions);

      if (currentPeticions === totalPeticions) {
        setTimeout(() => {
          dispatch(setLoadedChange(false));
        }, 500);
      }
    }
  }, [
    hotelSearch.results[0]?.LowestTotalFare,
    currentPeticions,
    totalPeticions,
  ]);

  const handleShowMap = (id: string) => {
    setNewFeaturePopUp(false);
    setOpenMap(true);
    setActiveMarker(id);
  };

  const handleCloseMap = () => {
    setActiveMarker('');
    setOpenMap(false);
  };

  const handleCloseError = () => {
    setOpenError(false);
    router.push('/', '/', { locale: i18n.language });
  };

  const handleSelectDropable = (eventKey: any) => {
    dispatch(setFilterOrderBy(eventKey));
  };

  useEffect(() => {
    if (hotelsAvailable?.length === 0) {
      if (myDivRef.current) {
        myDivRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hotelsAvailable]);

  const hoteldisplayString = hotelFoundNew;

  const handleOpenCompare = (hotel: any) => {
    const hotelToCompareId = hotel.Id || hotel.id;
    const hotelToCompare = hotelsAvailable.filter(
      hotel => hotel.Id === hotelToCompareId
    );
    setHotelCompare(hotelToCompare[0]);
    setOpenComparingModal(true);
  };

  return (
    <>
      <ModalComparingPrice
        open={openComparingModal}
        onClose={() => setOpenComparingModal(false)}
        hotel={hotelCompare}
      />

      <ModalError open={openError} onClose={handleCloseError} />

      <div className={styles.staysContainer}>
        <div className={styles.staysContainer_filters}>
          <GeneralButton
            text={`${t('stays.show-on-map')}`}
            cb={() => setOpenMap(true)}
            originText="icon_and_text"
            image={mapIcon}
            disabled={totalPeticions < 1}
          />
          <HotelFilters source="stays" totalPeticions={totalPeticions} />
        </div>

        <div
          ref={myDivRef}
          data-testid="hotel-results-container"
          className={styles.staysContainer_results}
        >
          {newFeaturePopUp && (
            <div className={styles.staysContainer_results_alert}>
              <button
                className={styles.staysContainer_results_alert_close}
                onClick={() => setNewFeaturePopUp(false)}
              >
                <Image alt="icon" src={IconCloseBlack} />
              </button>
              <h2 className={styles.staysContainer_results_alert_title}>
                {t('stays.new')}
              </h2>
              <span className={styles.staysContainer_results_alert_text}>
                {t('stays.pop_up_new')}
              </span>
            </div>
          )}

          <div className={styles.staysContainer_results_container}>
            <div className={styles.staysContainer_results_container_inner}>
              <div
                className={styles.staysContainer_results_container_inner_bar}
              >
                <span
                  className={
                    styles.staysContainer_results_container_inner_bar_title
                  }
                >
                  {t('stays.search-result')}
                </span>

                <div
                  className={
                    styles.staysContainer_results_container_inner_bar_filters
                  }
                >
                  {!newFeaturePopUp && (
                    <>
                      <p>
                        {hotelsAvailable?.length} {t('stays.hotels-for-dates')}
                      </p>
                      <Dropdown
                        className="ml-2"
                        onSelect={handleSelectDropable}
                        placement="bottomEnd"
                        noCaret
                        icon={<Image src={filerIcon} alt="Filter Icon Price" />}
                      >
                        <Dropdown.Item eventKey="min">
                          {t('stays.sortLowerToHigherPrice')}
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="max">
                          {t('stays.sortHigherToLowerPrice')}
                        </Dropdown.Item>
                      </Dropdown>
                    </>
                  )}
                </div>
              </div>

              <div
                id="scrollableDiv"
                className={styles.staysContainer_results_container_inner_pannel}
              >
                {/* TODO make component ? */}
                {showProgressBar && (
                  <Progress.Line
                    percent={isNaN(progress) ? 0 : progress}
                    className={`p-0 md:absolute transition-opacity duration-1000 ${
                      !showProgressBar ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                )}

                {openMap && (
                  <button
                    className={
                      styles.staysContainer_results_container_inner_pannel_close
                    }
                    onClick={() => setOpenMap(false)}
                  >
                    <div
                      className={
                        styles.staysContainer_results_container_inner_pannel_close_line
                      }
                    ></div>
                  </button>
                )}

                {hoteldisplayString && (
                  <p
                    className={
                      styles.staysContainer_results_container_inner_pannel_hotelFound
                    }
                  >
                    {hoteldisplayString}
                  </p>
                )}

                {hotelsAvailable?.length === 0 && (
                  <p
                    className={
                      styles.staysContainer_results_container_inner_pannel_notFound
                    }
                  >
                    {t('stays.filter-error')}
                  </p>
                )}

                {hotelsAvailable?.length !== 0 && (
                  <>
                    {totalPeticions === currentPeticions &&
                    !hotelsAvailable[0].LowestTotalFare ? (
                      <h2
                        className={
                          styles.staysContainer_results_container_inner_pannel_notFound
                        }
                      >
                        {t('stays.no_available_results')}
                      </h2>
                    ) : (
                      <>
                        {hotelsAvailable?.map((item, index) => (
                          <HotelResultCard
                            item={item}
                            index={index}
                            key={index}
                            handleShowMap={handleShowMap}
                            totalPeticions={totalPeticions}
                            currencySymbol={currencySymbol}
                            price={price.integerRate(
                              Number(item?.LowestTotalFare)
                            )}
                            handleOpenCompare={handleOpenCompare}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>

              <div
                className={
                  styles.staysContainer_results_container_inner_mobileMapButton
                }
              >
                <GeneralButton
                  text={`${t('stays.map')}`}
                  cb={() => handleOpenMapRedirect()}
                  originText="only_icon_map_mobile"
                  image={miniPin}
                />
              </div>
            </div>

            {openMap && (
              <div
                className={styles.staysContainer_results_container_mapHolder}
              >
                <GeneralButton
                  text=""
                  cb={() => handleCloseMap()}
                  originText="only_icon_map"
                  image={arrowRightTwoIcon}
                />

                <MapWrapperStays
                  dataResult={hotelsAvailable}
                  activeMarker={activeMarker}
                  setActiveMarker={setActiveMarker}
                  handleCloseMap={handleCloseMap}
                  // @ts-ignore
                  handleOpenCompare={handleOpenCompare}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Stays;
