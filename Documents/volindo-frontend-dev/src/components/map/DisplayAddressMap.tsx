import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import config from '@config';
import mapPinwhiteIcon from '@icons/map-pingwhite.svg';
import { darkModeStyles } from '.';
import { Loader } from 'rsuite';

import { useTranslation } from 'next-i18next';

const containerStyle = {
  width: '100%',
  height: '160px',
  borderRadius: '20px',
};

interface DisplayAddressMapProps {
  lat: number;
  lng: number;
}

const DisplayAddressMap = ({ lat, lng }: DisplayAddressMapProps) => {
  const { i18n } = useTranslation();
  const { isLoaded, loadError } = useLoadScript({
    language: i18n.language,
    googleMapsApiKey: config.google_maps_api_key || '',
  });
  const [position, setPosition] = React.useState({ lat: 0, lng: 0 });
  const [markerPosition, setMarkerPosition] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);

  React.useEffect(() => {
    const latNumber = Number(lat);
    const lngNumber = Number(lng);

    if (!isNaN(latNumber) && !isNaN(lngNumber)) {
      setPosition({
        lat: latNumber,
        lng: lngNumber,
      });
      setMarkerPosition({
        lat: latNumber,
        lng: lngNumber,
      });
    }
  }, [lat, lng]);

  React.useEffect(() => {
    if (typeof lat === 'number' && typeof lng === 'number') {
      setPosition({
        lat: lat,
        lng: lng,
      });
      setMarkerPosition({
        lat: lat,
        lng: lng,
      });
    }
  }, [lat, lng]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <Loader content="Loading map..." vertical />;
  }

  return (
    <>
      {markerPosition && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ ...position }}
          zoom={20}
          options={{
            disableDefaultUI: false,
            clickableIcons: false,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            styles: darkModeStyles,
          }}
        >
          <Marker icon={mapPinwhiteIcon.src} position={markerPosition} />
        </GoogleMap>
      )}
    </>
  );
};

export default DisplayAddressMap;
