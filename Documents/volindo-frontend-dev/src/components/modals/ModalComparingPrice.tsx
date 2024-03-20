import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

import { useAppSelector } from '@context';

import config from '@config';

//Icons
import defaultIcon from '@icons/hotelIcons/volindoLogo.svg';
import whitelabellogoHeader from '@icons/whitelabelLogoHeader.svg';
import bookingIcon from '@icons/hotelIcons/bookingHotelIcon.svg';

//Translation
import { useTranslation } from 'react-i18next';

import { Modal, LoadingSpinner } from '@components';

import { usePrice } from '@components/utils/Price/Price';

// Define un tipo para los objetos de marcas
type BrandInfo = {
  brand: string;
  page: string;
  icon: any; // Ajusta el tipo de icon según corresponda
};

// TODO need to seperate component
const BrandCard = ({
  brand,
  hotelName,
  hotelBed = '',
  lowestTotalFare,
  discount = 0,
}: {
  brand: keyof typeof brands;
  hotelName: string;
  hotelBed: string;
  lowestTotalFare: number;
  discount: number;
}) => {
  const { t } = useTranslation();
  const currentPage = window.location.hostname;

  const brands: Record<string, BrandInfo> = {
    booking: { brand: 'Booking', page: 'booking.com', icon: bookingIcon },
    volindo: {
      brand: 'WLBrand',
      page: `${currentPage}`,
      icon: currentPage.includes('volindo')
        ? defaultIcon
        : whitelabellogoHeader,
    },
  };

  const createPerson = () => {
    return (
      <div className="flex flex-col">
        <div className="h-2 w-2 bg-white rounded-full"></div>
        <div className="w-2 h-1 bg-white"></div>
      </div>
    );
  };

  const handleBeds = (name: any) => {
    const bedTypes = [
      'King Bed',
      'Double Bed',
      'Twin Bed',
      'Sofa Bed',
      'Twin Sofa Bed',
    ];
    const bedCounts: { [key: string]: number } = {};

    bedTypes.forEach(type => {
      const regex = new RegExp(`(\\d+) ${type}`, 'g');
      const matches = name[0].match(regex);

      if (matches) {
        const count = matches.reduce((sum: number, match: string) => {
          const num = parseInt(match.split(' ')[0]);
          return sum + num;
        }, 0);

        bedCounts[type] = count;
      }
    });

    const totalBeds = Object.values(bedCounts).reduce(
      (sum: number, count: number) => sum + count,
      0
    );

    if (totalBeds > 0) {
      return (
        <div className="flex flex-row items-center gap-[6px]">
          {Object.entries(bedCounts).map(([type, count], index) => {
            if (count > 0) {
              const additionalDivs = [
                'Twin Bed',
                'Double Bed',
                'Twin Sofa Bed',
              ].includes(type) ? (
                <>
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mb-0.5 opacity-70"></div>
                    <div className="w-2 h-0.5 bg-white opacity-70"></div>
                  </div>
                </>
              ) : null;

              return (
                <>
                  <p className="text-[14px] text-white opacity-70">
                    {count} {type}
                  </p>
                  <div className="w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full mb-0.5 opacity-70"></div>
                    <div className="w-2 h-0.5 bg-white opacity-70"></div>
                  </div>
                  {additionalDivs}
                  <span className={index === 0 ? 'mx-2' : ''}></span>
                </>
              );
            }
            return null;
          })}
        </div>
      );
    }

    return null;
  };

  // Accede al objeto correcto dentro de brands utilizando el parámetro brand
  const selectedBrand = brands[brand];

  const price = usePrice();

  return (
    <div className="relative flex flex-row items-start w-full gap-[14px] py-5 px-4 bg-[#252525] rounded-2xl">
      {discount > 0 && (
        <div className="absolute -top-[9px] right-[12px] px-2 bg-[#AACD5F] text-[13px] text-black rounded-full">
          {Math.round(discount)}%
        </div>
      )}
      <Image
        src={selectedBrand.icon}
        alt="bookingIcon"
        width={80}
        height={80}
      />
      <div className="w-full flex flex-col">
        {hotelName && (
          <h3 className="mb-[12px] font-[700] text-[20px] text-white leading-[24px] scale-y-[0.9]">
            <span className="md:hidden">
              {hotelName.length > 36
                ? hotelName?.substring(0, 36) + '...'
                : hotelName}
            </span>
            <span className="hidden md:block">{hotelName}</span>
          </h3>
        )}

        <div className="flex flex-row items-center justify-between">
          <div>
            {hotelBed && (
              <div className="flex flex-row gap-2 mb-1 items-center">
                <p className="font-[400] text-[14px]">{handleBeds(hotelBed)}</p>
              </div>
            )}
            <p className="font-[400] text-[10px] text-white opacity-70">
              {selectedBrand.page}
            </p>
          </div>

          <div className="flex flex-col items-end gap-[5px]">
            <p className="font-[400] text-[13px] text-white opacity-70">
              {t('stays.full-price')}
            </p>
            <p className="font-[760] text-[28px] text-white m-0 scale-y-[0.7] leading-[26px]">
              {price.countrySymbol}
              {price.integerRate(Math.round(lowestTotalFare))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ModalComparingPrice({
  open,
  onClose,
  hotel,
}: {
  open: boolean;
  onClose: () => void;
  hotel: any;
}) {
  const { t } = useTranslation();
  const [hotelCompare, setHotelCompare] = useState<any>({});
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useAppSelector(state => state.hotels.searchParams);

  const getCompare = async () => {
    setLoading(true);

    const body = {
      hotel: hotel,
      filter: searchParams,
    };

    axios
      .post(`${config.api}/hotels/destinations/compare_booking`, body)
      .then(res => {
        setLoading(false);
        setHotelCompare(res.data);
        if (res.data.MinTotalPrice > 0) {
          getCalcDiscount(hotel.LowestTotalFare, res.data.MinTotalPrice);
        }
      })
      .catch(err => {
        console.error('compare Error', err);
        clearStates();
      });
  };

  const getCalcDiscount = (originalPrice: number, comparePrice: number) => {
    const discountAmount = originalPrice - comparePrice;

    // Calc percentage discount and make it absolute
    const discountPercentage = Math.abs((discountAmount / originalPrice) * 100);
    setDiscount(discountPercentage);
  };

  const clearStates = () => {
    setHotelCompare({});
    setLoading(false);
  };

  useEffect(() => {
    if (!!open) {
      getCompare();
    } else {
      clearStates();
    }
  }, [open]);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      {open && (
        <div className="modalContainer w-full h-full md:h-fit md:min-w-[800px] flex flex-col items-center justify-start pt-[15px] px-[15px]">
          <h2 className="title mb-[25px] mr-auto">
            {t('stays.compare_prices')}
          </h2>
          <div className="flex flex-col gap-4 w-full">
            <BrandCard
              key={hotel?.Id}
              brand={'volindo'}
              hotelName={hotel?.HotelName || ''}
              hotelBed={hotel?.Rooms[0]?.Name || ''}
              lowestTotalFare={hotel.LowestTotalFare || 0}
              discount={discount || 0}
            />

            {hotelCompare.MinTotalPrice && (
              <BrandCard
                key={''}
                brand={'booking'}
                hotelName={hotel?.HotelName || ''}
                hotelBed={hotel?.Rooms[0]?.Name || ''}
                lowestTotalFare={hotelCompare.MinTotalPrice || 0}
                discount={0}
              />
            )}

            {hotelCompare.message && (
              <div className="flex flex-row items-center justify-center">
                <p className="py-4 font-[400] text-[16px] text-white">
                  {t('stays.avalability')}
                </p>
              </div>
            )}
          </div>

          {loading && (
            <div className="my-4">
              <LoadingSpinner />
            </div>
          )}

          <div
            className="hidden w-full md:w-[40%] rounded-full bg-whiteLabelColor my-5 py-2 md:flex flex-row items-center justify-center text-black font-[760] text-[16px]"
            onClick={onClose}
          >
            OK
          </div>
        </div>
      )}
    </Modal>
  );
}
