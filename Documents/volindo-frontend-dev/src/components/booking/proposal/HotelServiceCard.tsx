import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@context';

import hotelIcon from '@icons/traveler-stay.svg';

import style from '@styles/deals/hotel.module.scss';

import {
  RoomDetails,
  MapWrapper,
  DateDetails,
  AmenitiesList,
  ServiceDetails,
} from '@components';
import { useTranslation } from 'react-i18next';

//TODO Add mising props
const HotelServiceCard = ({
  prebook,
  hotelData,
  displayPrice,
  origin,
}: any) => {
  const { t } = useTranslation();
  const [roomAmenities, setRoomAmenities] = useState([]);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const searchParams = useAppSelector(state => state.hotels.searchParams);

  useEffect(() => {
    setRoomAmenities(prebook?.Rooms[0]?.Amenities);
  }, []);

  const temporaryHotelData = {
    id: hotelData?.Id,
    hotel_pictures: hotelData?.Images,
    hotel_name: hotelData?.HotelName,
    address: hotelData?.Address,
    stars: hotelData?.HotelRating,
    rooms: [{ TotalFare: prebook?.Rooms[0]?.TotalFare }],
    latitude: parseFloat(hotelData?.Map.split('|')[0]),
    longitude: parseFloat(hotelData?.Map.split('|')[1]),
  };

  return (
    <div className={style.container}>
      <div className={style.container_title}>
        <Image src={hotelIcon} alt="Icon" width={15} height={15} />
        <h2 className={style.detailsContainer_summary_text}>Hotel</h2>
      </div>

      <ServiceDetails
        serviceName={hotelData.HotelName}
        address={hotelData.Address}
        rating={hotelData.HotelRating}
      />
      <RoomDetails
        images={hotelData?.Images || []}
        hotelName={hotelData?.HotelName || ''}
        stars={hotelData?.HotelRating || 0}
        roomNames={prebook?.Rooms[0]?.Name || []}
        origin="hotels"
      />
      <DateDetails
        checkIn={searchParams.check_in}
        checkOut={searchParams.check_out}
        hourCheckIn={hotelData.CheckInTime}
        hourCheckOut={hotelData.CheckOutTime}
      />
      {roomAmenities?.length > 0 || hotelData?.HotelAmenities.length > 0 ? (
        <AmenitiesList
          title={t('reservations.facilities') || ''}
          roomAmenities={roomAmenities || []}
          hotelAmenities={hotelData?.HotelAmenities || []}
        />
      ) : null}
      {temporaryHotelData?.latitude && temporaryHotelData?.longitude && (
        <div className={style.mapContainer}>
          <MapWrapper
            dataResult={[temporaryHotelData]}
            activeMarker={activeMarker}
            setActiveMarker={setActiveMarker}
            displayPrice={displayPrice}
            origin={origin}
          />
        </div>
      )}
    </div>
  );
};

export default HotelServiceCard;
