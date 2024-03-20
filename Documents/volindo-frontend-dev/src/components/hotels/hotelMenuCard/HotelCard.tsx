import { memo } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import logoIcon from '@icons/logo.svg';
import whitelabellogo from '@icons/whitelabellogo.png';
import starWhiteIcon from '@icons/hotelIcons/starWhiteIcon.svg';
import wifiHotelIcon from '@icons/hotelIcons/wifiIconGray.svg';
import poolHotelIconGray from '@icons/hotelIcons/poolGrayIcon.svg';
import breakfastHotelIconGreen from '@icons/hotelIcons/breakfastGreenIcon.svg';
import pinIcon from '@icons/pin.svg';

import { insertHotelId } from '@utils/urlFunctions';
import { HotelStars, GeneralButton } from '@components';

import { HotelInfo, RoomHotelInfo } from '@typing/types';
import styles from './hotel-card.module.scss';

const HotelResultCard = ({
  item,
  index,
  handleShowMap = () => {},
  totalPeticions = 0,
  currencySymbol,
  price,
  type,
  origin = '',
  handleOpenCompare = () => {},
}: {
  item: any;
  index: number;
  handleShowMap?: Function;
  totalPeticions?: number;
  currencySymbol: string;
  price: number;
  type?: string;
  origin?: string;
  handleOpenCompare?: Function;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { results_id: resultId } = router.query || {};

  const iconArrayServices = [
    { service: 'Free breakfast', icon: breakfastHotelIconGreen },
    { service: 'Free WiFi', icon: wifiHotelIcon },
    { service: 'FREE WIFI', icon: wifiHotelIcon },
    { service: 'Pool', icon: poolHotelIconGray },
    { service: 'Billiards / Pool', icon: poolHotelIconGray },
    { service: 'Water activities', icon: poolHotelIconGray },
    { service: 'Private pool', icon: poolHotelIconGray },
    { service: 'Aqua fit', icon: poolHotelIconGray },
    { service: 'Outdoor seasonal pool', icon: poolHotelIconGray },
  ];

  const logoWhiteLabel =
    window.location.host.includes('dashboard.volindo.com') ||
    window.location.host.includes('dashboard.dev.volindo.com')
      ? logoIcon
      : whitelabellogo;

  const hanldeInclusion = (Inclusion: any) => {
    const getServiceIcon = (service: any) => {
      const foundService = iconArrayServices.find(
        item => item?.service === service
      );

      return foundService ? foundService.icon : null;
    };

    const services = Inclusion.split(',');

    const renderedServices = services.map((service: any, index: number) => {
      const poolName =
        service === 'Outdoor seasonal pool' ||
        service === 'Aqua fit' ||
        service === 'Private pool' ||
        service === 'Water activities' ||
        service === 'Billiards / Pool';

      const icon = getServiceIcon(service.trim());

      return (
        <div key={index}>
          {service === 'Free breakfast' ? (
            <div key={index} className="flex row gap-1 items-center">
              {icon && (
                <Image src={icon} alt={service} width={16} height={16} />
              )}
              <p className="text-[400] text-[13px] text-[#008F4B]">{service}</p>
            </div>
          ) : (
            <div key={index} className="flex row gap-1 items-center">
              {icon && (
                <Image src={icon} alt={service} width={16} height={16} />
              )}
              {poolName ? (
                <p className="text-[13px] text-[var(--gray-color-darker)]">
                  {t('stays.pool')}
                </p>
              ) : (
                <p className="text-[13px] text-[var(--gray-color-darker)]">
                  {service}
                </p>
              )}
            </div>
          )}
        </div>
      );
    });

    return renderedServices;
  };

  const findFreeCancellation = (rooms: RoomHotelInfo[]): string | null => {
    const hasFreeCancellation = rooms.some(room => {
      return room.CancelPolicies.some(
        policy =>
          policy.ChargeType === 'Fixed' && policy.CancellationCharge === 0
      );
    });

    return hasFreeCancellation ? 'Free Cancellation' : null;
  };

  const renderPrice = (item: HotelInfo, index: number) => {
    if (item?.LowestTotalFare || price) {
      return (
        <>
          <span data-testid={`hotel-result-card-price-${index}`}>
            {currencySymbol}
            {price}
          </span>
        </>
      );
    }

    return (
      <div
        className={`skeleton p-2 rounded-full flex justify-center relative w-[97px] h-[36px] bg-gray-300 md
        :mx-auto`}
      />
    );
  };

  const handleBook = (Id: string) => {
    window.open(
      `${window.location.protocol}//${
        window.location.host
      }/booking/stay/${insertHotelId(resultId, Id)}`,
      '_blank'
    );
  };

  return (
    <>
      <div
        key={index}
        data-testid={`hotel-result-card-${index}`}
        className={`${styles.hotelCard} ${styles[`hotelCard__${type}`]}`}
      >
        <div
          className={`${styles.hotelCard_info} ${styles[`hotelCard_info__${type}`]}`}
        >
          <div
            className={`${styles.hotelCard_info_image} ${styles[`hotelCard_info_image__${type}`]}`}
            onClick={() =>
              origin !== 'proposal' && handleBook(item?.Id || item.id)
            }
            style={{
              backgroundImage: `url(${item?.Images ? item?.Images[0] : item.picture || logoWhiteLabel.src})`,
            }}
          >
            <div
              className={`${styles.hotelCard_info_image_rating} ${styles[`hotelCard_info_image_rating`]}`}
            >
              <Image alt="icon" src={starWhiteIcon} />
              <label className={styles.hotelCard_info_image_rating_label}>
                {item?.HotelRating || item.stars}.0
              </label>
            </div>
          </div>

          <div
            className={`${styles.hotelCard_info_details}  ${styles[`hotelCard_info_details__${type}`]}`}
          >
            <div
              className={`${styles.hotelCard_info_details_sections} ${styles[`hotelCard_info_details_sections__${type}`]}`}
            >
              <p
                className={`${styles.hotelCard_info_details_sections_title} ${styles[`hotelCard_info_details_sections_title__${type}`]}`}
                onClick={() =>
                  origin !== 'proposal' && handleBook(item?.Id || item.id)
                }
              >
                {type !== 'mini' && (
                  <>
                    <span className="">{item?.HotelName || item.name}</span>
                  </>
                )}

                {type === 'mini' && (
                  <>
                    <span className="">
                      {item?.name.length > 15
                        ? item?.name.substring(0, 15) + '...'
                        : item?.name}
                    </span>
                  </>
                )}
              </p>

              <div
                className={`${styles.hotelCard_info_details_sections_address} ${styles[`hotelCard_info_details_sections_address__${type}`]}`}
              >
                <Image alt="icon" src={pinIcon} />
                <p
                  className={`${styles.hotelCard_info_details_sections_address_text} ${styles[`hotelCard_info_details_sections_address_text__${type}`]}`}
                >
                  {type !== 'mini' && (
                    <>
                      <span className="hidden md:flex">{item?.Address}</span>

                      <span className="md:hidden">
                        {item?.Address.length > 32
                          ? item?.Address.substring(0, 32) + '...'
                          : item?.Address}
                      </span>
                    </>
                  )}

                  {type === 'mini' && (
                    <>
                      <span className="">
                        {item?.address.length > 25
                          ? item?.address.substring(0, 25) + '...'
                          : item?.address}
                      </span>
                    </>
                  )}
                </p>
              </div>

              {item?.LowestTotalFare && (
                <button
                  className={`${styles.hotelCard_info_details_sections_compare} ${styles[`hotelCard_info_details_sections_compare__${type}`]}`}
                  onClick={() => handleOpenCompare(item)}
                >
                  {t('stays.compare_price')}
                </button>
              )}

              <div
                className={`${styles.hotelCard_info_details_sections_starsDiv} ${styles[`hotelCard_info_details_sections_starsDiv__${type}`]}`}
              >
                <HotelStars
                  hotelRating={item?.HotelRating || item.stars}
                  origin="hotelCard"
                />
              </div>
            </div>

            <div
              className={`${styles.hotelCard_info_details_clickables} ${styles[`hotelCard_info_details_clickables__${type}`]}`}
            >
              <div
                className={styles.hotelCard_info_details_clickables_amenities}
              >
                {item?.LowestTotalFare && (
                  <p
                    key={index}
                    className="text-[400] text-[13px] text-[#008F4B] mb-1"
                  >
                    {findFreeCancellation(item?.Rooms)}
                  </p>
                )}

                {item?.HotelFacilities?.map((element: any) => (
                  <>
                    {iconArrayServices?.map((el, i) => (
                      <>
                        {element !== '' && element === el.service
                          ? hanldeInclusion(element)
                          : null}
                      </>
                    ))}
                  </>
                ))}
              </div>

              <div
                className={`${styles.hotelCard_info_details_clickables_buttons} ${styles[`hotelCard_info_details_clickables_buttons__${type}`]}`}
              >
                <button
                  data-testid="show-map-button"
                  className={`${styles.hotelCard_info_details_clickables_buttons__map} ${styles[`hotelCard_info_details_clickables_buttons__map__${type}`]}`}
                  onClick={() => handleShowMap(item?.Id)}
                  disabled={totalPeticions < 1}
                >
                  {t('stays.show-on-map')}
                </button>

                <button
                  data-testid="new-booking-button"
                  className={`${styles.hotelCard_info_details_clickables_buttons__compare} ${styles[`hotelCard_info_details_clickables_buttons__compare__${type}`]}`}
                  onClick={() => handleOpenCompare(item)}
                >
                  {t('stays.compare_price')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${styles.hotelCard_priceButton} ${styles[`hotelCard_priceButton__${type}`]}`}
        >
          <div
            className={`${styles.hotelCard_priceButton_price} ${styles[`hotelCard_priceButton_price__${type}`]}`}
          >
            <span
              className={`${styles.hotelCard_priceButton_price_num} ${styles[`hotelCard_priceButton_price_num__${type}`]}`}
            >
              {renderPrice(item, index)}
            </span>
            <span
              className={`${styles.hotelCard_priceButton_price_text} ${styles[`hotelCard_priceButton_price_text__${type}`]}`}
            >
              {t('stays.full-price')}
            </span>
          </div>

          {origin === 'proposal' ||
            (origin === 'details' ? null : (
              <GeneralButton
                // TODO check price consitional
                // disabled={!item?.LowestTotalFare}
                text={`${t(item?.LowestTotalFare || price ? 'stays.book' : 'stays.change-date')}`}
                cb={() => handleBook(item.Id || item.id)}
                originText="primary"
                index={index}
                parentType={type}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default memo(HotelResultCard);
