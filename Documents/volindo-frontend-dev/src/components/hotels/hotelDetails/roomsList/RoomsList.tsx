import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import infoIcon from '@icons/hotelIcons/info-circle-gray.svg';
import arrowRightGreenIcon from '@icons/hotelIcons/arrowGreenRight.svg';
import arrowLeftRedIcon from '@icons/hotelIcons/arrowRedLeft.svg';

import { usePrice } from 'src/components/utils/Price/Price';
import { decodeQueryString } from '@utils/urlFunctions';
import {
  useAppDispatch,
  setHotelDetail,
  setSelectedRoomDetails,
} from '@context';

import type { StaysType, RoomDetails } from '@typing/types';
import {
  AccessibilityStatus,
  Amenities,
  BreakfastStatus,
  CancellationCharges,
  BedsStatus,
  RefundableStatus,
  SmokingStatus,
  WifiStatus,
} from './roomsListComponents';
import SharedButton from '@components/general/button/GeneralButton';
import Tooltip from '@components/general/tooltip/Tooltip';

import styles from './roomsList.module.scss';

const RoomsList = ({ stay }: { stay: StaysType }) => {
  const { t } = useTranslation();
  const price = usePrice();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const localSearchParams: any = decodeQueryString(router.query.hotel_id || '');

  const handleBook = (room: any, hotel_code: string) => {
    const {
      BookingCode,
      RecommendedSellingRate,
      Name,
      TotalFare,
      MealType,
      Inclusion,
      WithTransfers,
      IsRefundable,
      CancelPolicies,
    } = room;

    dispatch(setHotelDetail({ hotelDetail: stay }));
    const encodedData = encodeURIComponent(JSON.stringify(localSearchParams));
    const roomDetails: RoomDetails = {
      Name,
      MealType,
      Inclusion,
      WithTransfers,
      IsRefundable,
      CancelPolicies,
      TotalFare,
    };
    dispatch(setSelectedRoomDetails({ hotelDetails: roomDetails }));
    window.open(
      `${window.location.protocol}//${window.location.host}/booking/stay/room/${hotel_code}||${BookingCode}||${encodedData}?selling_rate=${RecommendedSellingRate}`,
      '_blank'
    );
  };

  const renderRoomDetails = (room: any) => {
    return (
      <div className={styles.item_details_inner}>
        <div className={styles.item_details_inner_cancellation}>
          {localSearchParams?.rooms?.length > 1 ? (
            <CancellationCharges
              cancellationCharges={room?.CancelPolicies.slice(
                0,
                Math.ceil(
                  room?.CancelPolicies.length / localSearchParams?.rooms?.length
                )
              )}
            />
          ) : (
            <CancellationCharges cancellationCharges={room?.CancelPolicies} />
          )}
        </div>
        {room?.WithTransfers ? (
          <span className={styles.item_details_inner_transfer}>
            <input
              disabled
              type="radio"
              defaultChecked={!!room.with_transferss}
            />
            <label htmlFor="">{t('stays.transfer')}</label>
          </span>
        ) : (
          <span className={styles.item_details_inner_transfer}>
            <label htmlFor="">{t('stays.non-transfer')}</label>
          </span>
        )}
        {room?.Supplements && (
          <div className={styles.item_details_inner_mandatory}>
            {room?.Supplements
              ? `Mandatory local tax of ${room?.Supplements[0][0]?.Price} ${room?.Supplements[0][0]?.Currency} will be charged at your arrival`
              : ''}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {stay?.rooms?.map((room: any, index_r: number) => (
        <li key={index_r} className={styles.item}>
          <div className={styles.item_about}>
            <div className={styles.item_about_hotelName}>{room?.Name[0]}</div>

            <div className={styles.item_about_beds}>
              <BedsStatus name={room?.Name[0]} />
            </div>

            <div className={styles.item_facilities}>
              <SmokingStatus name={room.Name[0]} />
              <AccessibilityStatus name={room.Name[0]} />
              <WifiStatus inclusion={room.Inclusion} />
              <Amenities name={room?.Name[0]} />
            </div>

            <div className={styles.item_option}>
              <div className={styles.item_refundable}>
                <RefundableStatus
                  refundable={room?.IsRefundable}
                  cancellationCharges={
                    localSearchParams?.rooms?.length > 1
                      ? room?.CancelPolicies.slice(
                          0,
                          Math.ceil(
                            room?.CancelPolicies.length /
                              localSearchParams?.rooms?.length
                          )
                        )
                      : room?.CancelPolicies
                  }
                />
              </div>

              <div className={styles.item_breakfast}>
                <BreakfastStatus mealType={room?.MealType} />
              </div>
            </div>
          </div>

          <div className={styles.item_details}>
            <div className={styles.item_details_info}>
              <Tooltip
                icon={infoIcon}
                text={t('stays.moredetails')}
                description={renderRoomDetails(room)}
                disabled={false}
                stylesProps="tooltipRoomList"
              />
            </div>

            <div className={styles.item_details_inner_check}>
              <div className={styles.item_details_inner_check_clock}>
                <div>
                  <Image src={arrowRightGreenIcon} alt="Arrow right" />
                  Check-in
                </div>{' '}
                -<span>{stay?.check_in_time}</span>
              </div>
              <div className={styles.item_details_inner_check_clock}>
                <div>
                  <Image src={arrowLeftRedIcon} alt="Arrow right" />
                  Check-out
                </div>{' '}
                -<span>{stay?.check_out_time}</span>
              </div>
            </div>
          </div>
          <div className={styles.item_wrapper}>
            <div className={styles.item_wrapper_price}>
              <div className={styles.item_wrapper_taxes}>
                {t('stays.taxes')}
              </div>
              <div className={styles.item_wrapper_value}>
                <div>
                  {price.countrySymbol}
                  {room?.RecommendedSellingRate
                    ? price.integerRate(room?.RecommendedSellingRate)
                    : price.integerRate(room.TotalFare)}
                </div>
              </div>
            </div>
            <SharedButton
              text={t('stays.reserv') as string}
              cb={() => handleBook(room, stay?.id)}
              originText={'roomList'}
              index={index_r}
            />
          </div>
        </li>
      ))}
    </>
  );
};

export default RoomsList;
