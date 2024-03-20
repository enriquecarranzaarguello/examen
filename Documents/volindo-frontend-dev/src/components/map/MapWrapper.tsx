import React, { useEffect } from 'react';

import type { MarkerI } from '@typing/interface';
import type { MapWrapperProps } from '@typing/proptypes';
import volindo from '@images/volindo.png';

import { YAM } from '@components';
import { usePrice } from '@components/utils/Price/Price';

export default function MapWrapper({
  dataResult,
  activeMarker,
  setActiveMarker,
  displayPrice,
  origin,
}: MapWrapperProps) {
  const [markers, setMarkers] = React.useState<MarkerI[]>([]);
  const price = usePrice();
  const currencySymbol = price.countrySymbol;

  useEffect(() => {
    setMarkers(
      dataResult
        .filter(hotel => hotel)
        .map(hotel => ({
          id: hotel.id || '',
          picture:
            hotel.hotel_pictures && hotel.hotel_pictures.length > 0
              ? hotel.hotel_pictures[0]
              : volindo.src,
          name: hotel.hotel_name || '',
          address: hotel.address || '',
          stars: hotel.stars || 0,
          price: displayPrice
            ? Number(displayPrice.toFixed(1))
            : price.integerRate(hotel?.rooms[0] && hotel.rooms[0].TotalFare) ||
              0,
          position: {
            lat: parseFloat(hotel.latitude),
            lng: parseFloat(hotel.longitude),
          },
        }))
        .filter(item => item.position.lat && item.position.lng)
    );
  }, [dataResult]);

  return (
    <YAM
      markers={markers}
      activeMarker={activeMarker}
      setActiveMarker={setActiveMarker}
      currencySymbol={currencySymbol}
      origin={origin}
    />
  );
}
