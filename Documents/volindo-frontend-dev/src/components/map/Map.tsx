import React from 'react';
import { GoogleMap, InfoWindowF, MarkerF } from '@react-google-maps/api';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import type { MapProps } from '@typing/proptypes';

import logoIcon from '@icons/logo.svg';
import whitelabellogo from '@icons/whitelabellogo.png';
import pinIcon from '@icons/pin.svg';
import starIcon from '@icons/star-black.svg';
import mapPinwhiteIcon from '@icons/map-pingwhite.svg';
import mapPinPurple from '@icons/map-pinPurple.svg';
import mapPinGrayIcon from '@icons/map-pin-gray.svg';
import { darkModeStyles } from '.';

import { usePrice } from '@components/utils/Price/Price';

export default function Map({
  markers,
  activeMarker,
  setActiveMarker,
}: MapProps) {
  const { t } = useTranslation('common');

  const center =
    markers.length > 0 && markers[0].position ? markers[0].position : undefined;
  const [active, setActive] = React.useState<string | null>(null);
  const handleOnLoad = (map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };

  const price = usePrice();

  const handleActiveMarker = (id: string) => {
    if (id === activeMarker) {
      return;
    }
    setActive(id);
    setActiveMarker(id);
  };
  const logoWhiteLabel =
    window.location.host.includes('dashboard.volindo.com') ||
    window.location.host.includes('dashboard.dev.volindo.com')
      ? logoIcon
      : whitelabellogo;

  React.useEffect(() => {
    setActive(activeMarker);
  }, [activeMarker]);

  const options = React.useMemo(
    () => ({
      minZoom: 4,
      maxZoom: 16,
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

  return (
    <GoogleMap
      options={options}
      zoom={16}
      center={center}
      onLoad={handleOnLoad}
      mapContainerStyle={{
        width: '100%',
        height: '100%',
      }}
      onClick={() => setActiveMarker(null)}
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
            <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
              <div className="bg-white rounded-[12px] w-[230px] h-[264px] flex flex-col justify-between pb-[14px]">
                <div className="flex flex-col gap-2">
                  <div
                    className="min-w-[230px] min-h-[78px]"
                    style={{
                      backgroundImage: `url(${
                        item.picture || logoWhiteLabel.src
                      })`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }}
                  />

                  <label className="px-3 text-[20px] font-[760] w-[206px] whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.name}
                  </label>

                  <p className="px-3 flex gap-2 items-center">
                    <Image alt="icon" src={pinIcon} />
                    <label className="text-black opacity-[.64] text-[12px] whitespace-nowrap text-ellipsis overflow-hidden">
                      {item.address}
                    </label>
                  </p>

                  <div className="px-3 flex gap-1 items-end">
                    <Image alt="icon" src={starIcon} />
                    <label className="text-[12px] text-black font-[590]">
                      {item.stars}
                    </label>
                  </div>
                </div>

                <div className="px-3 flex flex-col items-center gap-1">
                  {item.price ? (
                    <>
                      <label className="text-[20px] text-black font-[760]">{`${
                        price.countrySymbol
                      }${price.integerRate(item.price)}`}</label>
                      <label className="text-[11px] text-[#202020] opacity-[.64]">
                        {t('stays.price-per-night')}
                      </label>
                    </>
                  ) : (
                    <label className="text-[13px] font-[400] opacity-[.64]">
                      {t('stays.not-available')}
                    </label>
                  )}

                  <button
                    className="bg-black h-[40px] py-[11px] text-[#FEFEFE] rounded-[20px] mt-2 w-[140px]"
                    onClick={() =>
                      window.open(`/booking/stay/${item.id}`, '_blank')
                    }
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
