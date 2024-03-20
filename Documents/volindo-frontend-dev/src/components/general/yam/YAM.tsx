import React, { useState, useEffect, useMemo } from 'react';

import {
  GoogleMap,
  InfoWindow,
  MarkerClusterer,
  Marker,
  useLoadScript,
} from '@react-google-maps/api';

import config from '@config';
import { useTranslation } from 'next-i18next';

import mapPin from '@icons/map-pinPurple.svg';
import mapBlackIcon from '@icons/map-pin-black.svg';

import { HotelResultCard } from '@components';

interface MapStaysProps {
  markers: MarkerType[];
  activeMarker: any;
  setActiveMarker: (id: string) => void;
  currencySymbol?: string;
  origin?: string;
  handleCloseMap?: () => void;
  handleOpenCompare?: () => void;
}

interface MarkerType {
  address: string;
  id: string;
  name: string;
  picture: string;
  position: { lat: number; lng: number };
  price?: number | undefined;
  stars: number;
}
// Change folder name to map when all are unified
const YAM = ({
  markers,
  activeMarker,
  setActiveMarker,
  currencySymbol = '$',
  origin,
  handleOpenCompare,
}: MapStaysProps) => {
  const { i18n } = useTranslation();

  const [active, setActive] = useState<string | null>(null);

  const { isLoaded } = useLoadScript({
    id: 'google-map-stays',
    language: i18n.language,
    googleMapsApiKey: config.google_maps_api_key || '',
  });

  const getCenter = () => {
    if (!!activeMarker) {
      const result = markers.filter(item => item.id === activeMarker);
      return {
        lat: result[0]?.position.lat,
        lng: result[0]?.position.lng,
      };
    }

    return markers[0]?.position;
  };

  // TODO check center for all maps case
  const center: google.maps.LatLngLiteral | undefined = getCenter();

  const handleOnLoad = (map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };

  const handleClickMarker = (id: string) => {
    setActive(id);
    setActiveMarker(id);
  };

  const handleCloseInfoWindow = () => {
    setActive('');
    setActiveMarker('');
  };

  useEffect(() => {
    if (!!activeMarker) {
      setActive(activeMarker);
    }
  }, [activeMarker]);

  const options = useMemo(
    () => ({
      minZoom: 4,
      maxZoom: 20,
      disableDefaultUI: true,
      clickableIcons: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
    }),
    []
  );

  if (!isLoaded) return null;
  // map style can be a prop obj
  return (
    <>
      <GoogleMap
        options={options}
        zoom={16}
        center={center}
        onLoad={handleOnLoad}
        mapContainerStyle={{
          width: '100%',
          height: '100%',
          maxHeight: '650px',
          borderTopRightRadius: '20px',
          borderTopLeftRadius: '20px',
          top: 0,
        }}
      >
        <MarkerClusterer minimumClusterSize={3}>
          {clusterer => {
            return (
              <>
                {markers?.map((item, index) => (
                  <Marker
                    key={item?.id}
                    position={item?.position}
                    onClick={() => handleClickMarker(item.id)}
                    icon={active === item.id ? mapBlackIcon.src : mapPin.src}
                    clusterer={clusterer}
                  >
                    {active === item.id && (
                      <InfoWindow
                        position={item.position}
                        onCloseClick={() => handleCloseInfoWindow()}
                      >
                        <HotelResultCard
                          item={item}
                          index={index}
                          currencySymbol={`${currencySymbol}`}
                          price={item.price || 0}
                          type="mini"
                          origin={origin}
                          handleOpenCompare={handleOpenCompare}
                        />
                      </InfoWindow>
                    )}
                  </Marker>
                ))}
              </>
            );
          }}
        </MarkerClusterer>
      </GoogleMap>
    </>
  );
};

export default YAM;
