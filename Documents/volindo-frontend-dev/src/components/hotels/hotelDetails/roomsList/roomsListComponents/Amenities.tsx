import Image from 'next/image';
import kitchenHotelIcon from '@icons/hotelIcons/kitchenHotel.svg';
import balconyHotelIcon from '@icons/hotelIcons/balconyHotel.svg';
import closeToBeachHotelIcon from '@icons/hotelIcons/closeToBeachHotel.svg';
import { RoomDetails } from '@typing/types';

const Amenities = ({ name }: { name: RoomDetails['Name'] }) => {
  const amenityMapping = {
    Kitchen: { name: 'Kitchen', icon: kitchenHotelIcon },
    Terrace: { name: 'Terrace', icon: balconyHotelIcon },
    'Ocean View': { name: 'Ocean View', icon: balconyHotelIcon },
    Oceanfront: { name: 'Ocean Front', icon: closeToBeachHotelIcon },
    'Ocean front': { name: 'Ocean Front', icon: closeToBeachHotelIcon },
    'City View': { name: 'City View', icon: balconyHotelIcon },
    'Park View': { name: 'Park View', icon: balconyHotelIcon },
  };

  const amenities = Object.entries(amenityMapping)
    .filter(([key]) => name.includes(key))
    .map(([, value]) => value);

  if (amenities.length === 0) {
    return null;
  }

  return (
    <>
      {amenities.map((amenity, index) => (
        <div key={index} className="flex row gap-1 items-center mb-[15px]">
          <Image
            className="mr-[7px]"
            src={amenity.icon}
            alt={amenity.name}
            width={16}
            height={16}
          />
          <p className="text-[400] text-[13px]">{amenity.name}</p>
        </div>
      ))}
    </>
  );
};

export default Amenities;
