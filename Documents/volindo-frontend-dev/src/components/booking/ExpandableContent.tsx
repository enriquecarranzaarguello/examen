import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import arrowBottomWhite from '@icons/hotelIcons/arrow-whiteDown.svg';
import categoryHotelIcon from '@icons/hotelIcons/whiteIcons/checkHotel.svg';

import { obtainServiceTranslation } from '@utils/userFunctions';

const DropableContent = ({
  description,
  roomAmenities,
  hotelAmenities,
}: {
  description: any;
  roomAmenities: any;
  hotelAmenities: any;
}) => {
  const { t, i18n } = useTranslation('common');

  const [expandContent, setExpandContent] = useState(false);

  const handleHotelFacilities = (facilities: any) => {
    const uniqueFacilities = facilities.reduce(
      (unique: any[], facility: any) => {
        const service = facility.split('-')[0].trim();
        let formattedFacility = facility;

        if (
          facility.includes('Wheelchair-accessible') ||
          facility.includes('Wheelchair accessible') ||
          facility.includes('In-room accessibility')
        ) {
          formattedFacility = 'Accessible Hotel';
        } else if (facility.match(/pool(s?)/i)) {
          if (unique.some(item => item.includes('Pool facilities'))) {
            return unique;
          }
          formattedFacility = 'Pool facilities';
        } else if (facility.includes('bar')) {
          formattedFacility = 'Bar';
        } else if (facility.match(/spa/i)) {
          formattedFacility = 'Spa';
        } else if (facility.match(/(laundry|cleaning)/i)) {
          formattedFacility = 'Laundry service';
        } else if (facility.match(/24[-\s]?hour/i)) {
          formattedFacility = '24 hour service';
        }

        if (!unique.some(item => item === formattedFacility)) {
          unique.push(formattedFacility);
        }

        return unique;
      },
      []
    );

    const renderedFacilities = uniqueFacilities.map(
      (facility: any, index: any) => {
        const service = facility.split('-')[0].trim();

        return (
          <div key={index} className="flex row gap-1 items-center">
            <Image
              src={categoryHotelIcon}
              alt={service}
              width={16}
              height={16}
            />
            <p className="text-[400] text-[13px] text-white">
              {/* {facility} */}
              {i18n.language === 'en'
                ? facility
                : obtainServiceTranslation(facility)}
            </p>
          </div>
        );
      }
    );

    return renderedFacilities;
  };

  const handleShowDescription = (description: any) => {
    return (
      <div
        className="text-[13px] text-white"
        dangerouslySetInnerHTML={{ __html: description }}
      ></div>
    );
  };

  const toggleContentHeight = () => {
    setExpandContent(!expandContent);
  };

  /*
  TODO
  - check whole component translation
  */

  return (
    <div className="relative">
      <div
        className={`bg-[#242424] mb-5 pt-[15px] pb-[40px] px-[20px] rounded-[24px] flex flex-row overflow-hidden ${
          expandContent ? 'h-auto' : 'h-[187px]'
        }`}
      >
        {description && (
          <div className="flex flex-col">
            <h3 className="text-white font-[500] text-[16px]">About Hotel</h3>
            <p className="font-[274] text-[13px] text-[#9F9F9F] overflow-hidden">
              {handleShowDescription(description)}
            </p>
          </div>
        )}
        {roomAmenities && (
          <div className="w-1/2">
            <h3 className="text-white font-[500] text-[16px]">
              Room Facilities
            </h3>
            {/* Inclusion */}
            {handleHotelFacilities(roomAmenities)}
          </div>
        )}
        {hotelAmenities && (
          <div className="w-1/2">
            <h3 className="text-white font-[500] text-[16px]">
              Hotel Facilities
            </h3>
            {/* Inclusion */}
            {handleHotelFacilities(hotelAmenities)}
          </div>
        )}
      </div>
      <button
        className={`flex justify-center items-center rounded-[20px] font-[400] w-full text-[12px] text-white absolute bottom-0 ${
          expandContent ? 'h-[50px]' : 'h-[100px] pt-[60px]'
        }`}
        style={{
          background:
            'linear-gradient(rgba(36, 36, 36, 0.1) 0, rgb(36, 36, 36) 60%, rgb(36, 36, 36) 100%)',
        }}
        onClick={toggleContentHeight}
      >
        {expandContent ? 'Less' : 'More'}
        {expandContent ? (
          <Image
            src={arrowBottomWhite}
            width={24}
            height={24}
            alt="Arrow top"
            className="mt-[1px] rotate-180"
          />
        ) : (
          <Image
            src={arrowBottomWhite}
            width={24}
            height={24}
            alt="Arrow bottom"
            className="mt-[3px]"
          />
        )}
      </button>
    </div>
  );
};

export default DropableContent;
