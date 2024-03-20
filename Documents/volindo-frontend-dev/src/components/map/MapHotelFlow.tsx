import React from 'react';
import config from '@config';

//Transtlation
import { useTranslation } from 'react-i18next';
import { useLoadScript } from '@react-google-maps/api';

import type { MarkerI } from '@typing/interface';
import type { MapWrapperPropsHotelFlow } from '@typing/proptypes';

import { Map } from '@components';

export default function MapHotelFlow({
  dataResult,
  activeMarker,
  setActiveMarker,
}: MapWrapperPropsHotelFlow) {
  const { i18n } = useTranslation();
  const [markers, setMarkers] = React.useState<MarkerI[]>([]);

  const { isLoaded } = useLoadScript({
    id: 'google-map-stays',
    language: i18n.language,
    googleMapsApiKey: config.google_maps_api_key || '',
  });

  React.useEffect(() => {
    {
      /* Set Map */
    }
  }, [dataResult]);

  if (!isLoaded) return null;
  return (
    <Map
      markers={markers}
      activeMarker={activeMarker}
      setActiveMarker={setActiveMarker}
    />
  );
}
