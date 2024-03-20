import React from 'react';
import { GoogleMap, InfoWindowF, MarkerF } from '@react-google-maps/api';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import type { MapStaysProps } from '@typing/proptypes';
import styles from './map.module.scss';

import logoIcon from '@icons/logo.svg';
import whitelabellogo from '@icons/whitelabellogo.png';
import pinIcon from '@icons/pin.svg';
import starIcon from '@icons/star-black.svg';
import mapPinPurple from '@icons/map-pinPurple.svg';
import mapPinGrayIcon from '@icons/map-pin-gray.svg';
import { darkModeStyles } from '../../map';

import { usePrice } from '@components/utils/Price/Price';

export default function Map({
  markers,
  activeMarker,
  setActiveMarker,
  handleMarkerAmount,
  handleBook,
}: MapStaysProps) {
  const { t } = useTranslation('common');

  const center: google.maps.LatLngLiteral | undefined =
    markers.length > 0 &&
    markers[0].position &&
    !isNaN(markers[0].position.lat) &&
    !isNaN(markers[0].position.lng)
      ? markers[0].position
      : markers.length > 0 && markers[0].address
        ? { lat: NaN, lng: NaN }
        : undefined;

  const [active, setActive] = React.useState<string | null>(null);

  const price = usePrice();

  const handleOnLoad = (map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };
  const logoWhiteLabel =
    window.location.host.includes('dashboard.volindo.com') ||
    window.location.host.includes('dashboard.dev.volindo.com')
      ? logoIcon
      : whitelabellogo;

  const handleActiveMarker = (id: string) => {
    if (id === activeMarker) {
      return;
    }
    setActive(id);
    if (setActiveMarker) return setActiveMarker(id);
  };

  React.useEffect(() => {
    setActive(activeMarker);
  }, [activeMarker]);

  const options = React.useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      styles: darkModeStyles,
    }),
    []
  );

  const clickHandleBook = (Id: string) => {
    if (handleBook) {
      handleBook(Id);
    } else {
      console.error('Error in redirection');
    }
  };

  return (
    <GoogleMap
      options={options}
      zoom={16}
      center={center}
      onLoad={handleOnLoad}
      mapContainerStyle={{
        // width: windowSize < 700 ? '100vw' : 240,
        width: '100%',
        height: '100vh',
        maxHeight: '650px',
        borderTopRightRadius: '20px',
        borderTopLeftRadius: '20px',
        top: 0,
      }}
      onClick={() => setActiveMarker && setActiveMarker(null)}
    >
      {/*---TODO-- if the selected item is equal to selected pin black else they are gray*/}
      {markers.map(item => (
        <MarkerF
          key={item.id}
          position={item.position}
          onClick={() => handleActiveMarker(item.id)}
          icon={
            item.price
              ? mapPinPurple.src
              : mapPinGrayIcon.src || item.id
                ? mapPinPurple.src
                : mapPinGrayIcon.src ||
                  (item.id === 'selected' && mapPinPurple.src)
          }
        >
          {active === item.id && (
            <InfoWindowF
              onCloseClick={() => setActiveMarker && setActiveMarker(null)}
            >
              <div className={styles.card}>
                <div className={styles.card_details}>
                  <div
                    className={styles.card_details_image}
                    style={{
                      backgroundImage: `url(${
                        item.picture || logoWhiteLabel.src
                      })`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }}
                  />

                  <label className={styles.card_details_hotelName}>
                    {item.name}
                  </label>

                  <p className={styles.card_details_addressContainer}>
                    <Image alt="icon" src={pinIcon} />
                    <label
                      className={styles.card_details_addressContainer_address}
                    >
                      {item.address}
                    </label>
                  </p>

                  <div className={styles.card_details_starsContainer}>
                    <Image alt="icon" src={starIcon} />
                    <label className={styles.card_details_starsContainer_text}>
                      {item.stars}
                    </label>
                  </div>
                </div>

                <div className={styles.card_priceContainer}>
                  {item.price ? (
                    <>
                      <label className={styles.card_priceContainer_symbol}>{`${
                        price.countrySymbol
                      } ${price.integerRate(item.price)}`}</label>
                      <label className={styles.card_priceContainer_text}>
                        {t('stays.price-per-night')}
                      </label>
                    </>
                  ) : (
                    <label className={styles.card_priceContainer_text}>
                      {t('stays.not-available')}
                    </label>
                  )}

                  <button
                    className={styles.card_priceContainer_button}
                    onClick={() => clickHandleBook(item?.id)}
                  >
                    {t(item.price ? 'stays.book' : 'stays.change-date')}
                  </button>
                </div>
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}
    </GoogleMap>
  );
}
