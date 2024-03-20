import React, { useEffect, useRef, useState } from 'react';

import volindo from '@images/volindo.png';
import { usePrice } from '@components/utils/Price/Price';

import type { MarkerI } from '@typing/interface';
import type { MapWrapperStaysProps } from '@typing/proptypes';

import { YAM } from '@components';
import { changeLanguage } from 'i18next';

export default function MapWrapperStays({
  dataResult,
  activeMarker,
  setActiveMarker,
  handleCloseMap,
  origin,
  handleOpenCompare,
}: MapWrapperStaysProps) {
  const [markers, setMarkers] = useState<MarkerI[]>([]);
  const price = usePrice();
  const currencySymbol = price.countrySymbol;
  const countryCode = price.countryCode;
  const prevCountryCodeRef = useRef(countryCode);

  const latitudes = markers.map(marker => marker.position.lat);
  const longitudes = markers.map(marker => marker.position.lng);

  const latitudesWithoutNull = latitudes.filter(lat => !isNaN(lat));
  const longitudesWithoutNull = longitudes.filter(lng => !isNaN(lng));

  const sumLatitudes = latitudesWithoutNull.reduce((sum, lat) => sum + lat, 0);
  const sumLongitudes = longitudesWithoutNull.reduce(
    (sum, lng) => sum + lng,
    0
  );

  const averageLatitude = sumLatitudes / latitudesWithoutNull.length;
  const averageLongitude = sumLongitudes / longitudesWithoutNull.length;

  function euclideanDistance(x1: any, y1: any, x2: any, y2: any) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }

  const thresholdDistance = 1; // Umbral de distancia en grados decimales

  for (const marker of markers) {
    const distance = euclideanDistance(
      marker.position.lat,
      marker.position.lng,
      averageLatitude,
      averageLongitude
    );

    if (distance > thresholdDistance) {
      // Usar dirección en lugar de coordenadas
      marker.position = { lat: NaN, lng: NaN };
      marker.address = marker.address || '';
    }
  }
  useEffect(() => {
    const newMarkers = dataResult

      .filter(hotel => hotel)
      .map(hotel => ({
        id: hotel.Id || '',
        picture:
          hotel.Images && hotel.Images.length > 0
            ? hotel.Images[0]
            : volindo.src,
        name: hotel.HotelName || '',
        address: hotel.Address || '',
        stars: hotel.HotelRating || 0,
        price: price.integerRate(Number(hotel.LowestTotalFare)) || 0,
        // position is not when sent back is sent as map
        position: {
          lat: parseFloat(hotel.Map.split('|')[0]),
          lng: parseFloat(hotel.Map.split('|')[1]),
        },
        Rooms: hotel.Rooms || 0,
      }))
      .filter(item => item.position.lat && item.position.lng);

    if (dataResult.length > markers.length) {
      // Check and add only the new markers to the existing array
      const existingMarkersIds = markers.map(marker => marker.id);
      const updatedMarkers = markers.concat(
        newMarkers.filter(marker => !existingMarkersIds.includes(marker.id))
      );
      setMarkers(updatedMarkers);
      return;
    } else {
      setMarkers([]);
      setMarkers(newMarkers);
      return;
    }
  }, [dataResult]);

  useEffect(() => {
    const prevCountryCode = prevCountryCodeRef.current;
    if (prevCountryCode !== countryCode) {
      if (handleCloseMap) return handleCloseMap();
    }
    prevCountryCodeRef.current = countryCode;
  }, [countryCode, currencySymbol]);

  return (
    <YAM
      markers={markers}
      activeMarker={activeMarker}
      setActiveMarker={setActiveMarker}
      currencySymbol={currencySymbol}
      origin={origin}
      handleOpenCompare={handleOpenCompare}
    />
  );
}
