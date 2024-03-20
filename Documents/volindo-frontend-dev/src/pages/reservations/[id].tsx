import React, { useState, useEffect } from 'react';
import config from '@config';
import { ResevationDetailsProps } from '@typing/proptypes';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import Swal from 'sweetalert2';
import { Carousel } from 'react-responsive-carousel';

import { ModalSupport, BookingLayout, DisplayAddressMap } from '@components';

import volindo from '@images/volindo.png';
import IconCloseBlack from '@icons/close-black.svg';
import pingray from '@icons/pin-gray.svg';
import starWhite from '@icons/star-white.svg';
import starGrayIcon from '@icons/star-gray.svg';
import calendarWhite from '@icons/calendar-white.svg';

import axios from 'axios';
import { useSession } from 'next-auth/react';

const ReservationPolicies = ({
  open,
  onClose,
  reservationDets,
}: ResevationDetailsProps) => {
  if (!open) return null;

  const reservations = reservationDets;

  const cancelPolicies = reservations?.service?.cancel_policies;

  return (
    <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-[60]">
      <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] rounded-[16px] py-10 px-5 h-auto max-h-[80%] min-w-[250px] max-w-[500px]">
        <button className="absolute -top-5 -right-5" onClick={onClose}>
          <Image alt="icon" src={IconCloseBlack} />
        </button>
        <div className="">
          <label className="text-white text-[40px] font-[760]">
            Cancellation Policy
          </label>
          {cancelPolicies && (
            <ul className="text-white">
              {cancelPolicies.map(
                (
                  policy: {
                    FromDate: Date;
                    ChargeType: string;
                    CancellationCharge: string;
                  },
                  index: number
                ) => (
                  <li
                    key={index}
                    className="flex justify-between w-full text-center px-5"
                  >
                    <span>{`${policy.FromDate}`}</span>
                    <span className="">
                      {' '}
                      {`${policy.ChargeType !== 'Percentage' ? '$' : ''}`}{' '}
                      {`${policy.CancellationCharge}`}{' '}
                      {`${policy.ChargeType === 'Percentage' ? '%' : ''}`}
                    </span>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const Reservation = () => {
  const [reservation, setReservation] = useState<any>();
  const { data: session } = useSession();
  const [openSupport, setOpenSupport] = useState(false);
  const [showReservationPolicies, setShowReservationPolicies] = useState(false);
  const [hotelSlider, setHotelSlider] = useState(false);

  const [stay, setStay] = useState<any>({});

  const Stars = (stars: number) => {
    if (!stars) {
      return null;
    }

    return (
      <div className="flex gap-3 items-center mt-1">
        {new Array(stars).fill('').map((_, index) => (
          <Image key={index} alt="icon" src={starWhite} />
        ))}

        {new Array(5 - stars).fill('').map((_, index) => (
          <Image key={index} alt="icon" src={starGrayIcon} />
        ))}
      </div>
    );
  };

  const handleClick = async () => {
    axios
      .post(`${config.api}/app/api/books/${reservation?.booking_id}/cancel/`, {
        headers: {
          Authorization: 'Bearer ' + (session?.user.id_token || ''),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(function (response) {
        Swal.fire(
          'Your Reservation has successfully been cancelled',
          'you will be notified via email once cancelled',
          'success'
        );
      })
      .catch(function (error) {
        Swal.fire('Oops! Error cancelling reservation', `${error}`, 'error');
      });
  };

  useEffect(() => {
    const storedReservation = JSON.parse(
      localStorage.getItem('reservation') || '{}'
    );
    setReservation(storedReservation);
  }, []);

  useEffect(() => {
    const saveHotel = () => {
      if (reservation?.booking_id) {
        axios
          .get(
            `${config?.api}/bookings/crm/${reservation?.service?.id_meilisearch}`,
            {
              headers: {
                Authorization: 'Bearer ' + (session?.user.id_token || ''),
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
          )
          .then(res => {
            setStay(res.data);
          })
          .catch(error => {
            console.log(error);
          });
      }
    };
    saveHotel();
  }, [reservation?.service?.id_meilisearch, session?.user.id_token]);

  return (
    <div className="relative">
      <BookingLayout>
        {reservation?.status_trip_reservation === 'Cancelled' && (
          <h2 className="text-center text-red-500/70 absolute top-28 left-[50%] whitespace-nowrap">
            Cancelled Reservation:{' '}
            {new Date(reservation.reservation.cancelled_at).toLocaleString()}
          </h2>
        )}
        {showReservationPolicies && (
          <ReservationPolicies
            open={true}
            onClose={() => setShowReservationPolicies(false)}
            reservationDets={reservation}
            res_id={''}
          />
        )}
        <ModalSupport
          open={openSupport}
          onClose={() => setOpenSupport(false)}
        />
        <div className="w-screen h-screen flex justify-center">
          <div className="flex flex-col px-3 mt-[82px] gap-12 lg:px-0 lg:flex-row">
            <div className="flex flex-col w-full">
              {reservation?.status_trip_reservation === 'Cancelled' ? (
                <h2 className="text-[32px] font-[650px] text-red-500/70 mb-[43px]">
                  Booking Cancelled
                </h2>
              ) : (reservation?.status === 'booked' ||
                  reservation?.status === 'cancelled') &&
                reservation?.service.response_book_tbo &&
                reservation?.service.response_book_tbo.Status &&
                reservation?.service.response_book_tbo.Status?.Code === 200 ? (
                <h2 className="text-[32px] font-[650px] text-white mb-[43px]">
                  Booking Confirmation
                </h2>
              ) : (
                <h2 className="text-[32px] font-[650px] text-red-500/70 mb-[43px]">
                  Booking was not confirmed
                </h2>
              )}

              {reservation?.service?.name_room.map(
                (room: any, roomIndex: number) => (
                  <div
                    key={roomIndex}
                    className="bg-white w-full rounded-[35px] flex flex-col px-11 py-6 mb-6"
                  >
                    <div className="bg-white w-full h-72 rounded-[35px] flex flex-col px-11 py-6">
                      <h2 className="text-black text-2xl font-medium mb-8">{`Guest ${
                        roomIndex + 1
                      }`}</h2>
                      <div className="flex justify-between items-center gap-3">
                        <label className="text-[#777e91] text-sm font-normal">
                          Name
                        </label>
                        <label className="text-base text-black font-normal">
                          {`${reservation?.main_contact[0]?.first_name} ${reservation?.main_contact[0]?.last_name}`}
                        </label>
                      </div>
                      <div className="flex justify-between items-center  gap-3 py-4">
                        <label className="text-[#777e91] text-sm font-normal">
                          Phone
                        </label>
                        <label className="text-base text-black font-normal">
                          {reservation?.main_contact[0]?.phone}
                        </label>
                      </div>
                      <div className="flex justify-between items-center  gap-3">
                        <label className="text-[#777e91] text-sm font-normal">
                          Email
                        </label>
                        <label className="text-base text-black font-normal">
                          {reservation?.main_contact[0]?.email}
                        </label>
                      </div>
                      <div className="flex justify-between items-center gap-3 py-4">
                        <label className="text-[#777e91] text-sm font-normal">
                          Age, gender
                        </label>
                        <label className="text-base text-black font-normal">
                          {reservation?.main_contact[0]?.title}
                        </label>
                      </div>
                    </div>
                  </div>
                )
              )}

              <button
                onClick={() => setShowReservationPolicies(true)}
                className="flex mt-3 text-white underline text-sm"
              >
                Cancellation Policy
              </button>
              <div className="">
                <button
                  onClick={handleClick}
                  className="mt-[23px] text-[var(--primary-background)] border-[var(--primary-background)] border h-[48px] w-[225.76px] rounded-full"
                >
                  Cancel reservation
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex flex-row items-center w-full h-9 justify-between bg-white/[0.08] rounded-md px-2">
                <p className="text-base font-normal text-white/50 m-0">
                  Trip status
                </p>
                <p className={` text-white/50 text-base font-normal  m-0`}>
                  {reservation && reservation?.status_trip_reservation
                    ? reservation?.status_trip_reservation
                    : 'No description available'}
                </p>
              </div>
              <div className="w-full gap-3 flex justify-between items-center mt-3">
                <div>
                  <span className="text-white text-xl font-[760]">
                    {stay?.HotelName}
                  </span>
                  <span className="text-white/[0.64] text-base flex w-[283px] gap-2">
                    <Image
                      src={pingray}
                      width={16}
                      height={16}
                      alt={'graypin'}
                    />
                    {stay?.Address}
                  </span>

                  <span className="text-white text-base flex gap-2  items-center">
                    {Stars(stay?.HotelRating)}{' '}
                    <span className="mt-2">
                      {stay?.HotelRating}
                      .0
                    </span>
                  </span>
                </div>
                <DisplayAddressMap
                  lat={reservation?.service?.latitude || 0}
                  lng={reservation?.service?.longitude || 0}
                />
              </div>
              <div className="w-full h-[54px] bg-white/[0.08] rounded-lg px-[54px] flex items-center justify-between mt-7">
                <div className="flex flex-col gap-y-[2.74px]">
                  <p className="text-xs text-white/50">Check-in</p>
                  <div className="flex gap-2">
                    <Image
                      src={calendarWhite}
                      width={13.65}
                      height={13.65}
                      alt="calendar"
                    />
                    <p className="text-base text-white">
                      {reservation?.service?.check_in}
                    </p>
                  </div>
                </div>
                <div className="w-[50px] bg-black border border-black" />
                <div className="flex flex-col gap-y-[2.74px]">
                  <p className="text-xs text-white/50">Check-out</p>
                  <div className="flex gap-2">
                    <Image
                      src={calendarWhite}
                      width={13.65}
                      height={13.65}
                      alt="calendar"
                    />
                    <p className="text-base text-white">
                      {reservation?.service?.check_out}
                    </p>
                  </div>
                </div>
              </div>

              {reservation?.service?.name_room.map(
                (room: any, index: number) => (
                  <div
                    key={index}
                    className="w-full flex gap-3 mt-12 border-b border-b-gray-800 pb-5"
                  >
                    <div className="w-[193px] h-[94px] rounded-xl border overflow-hidden border-white/50 flex items-center justify-center">
                      {stay?.Images?.length > 0 ? (
                        <div
                          onClick={() => setHotelSlider(true)}
                          className="min-w-[200px] min-h-[160px] rounded-[12px] cursor-pointer"
                          style={{
                            backgroundImage: `url(${
                              stay?.Images[
                                Math.floor(Math.random() * stay?.Images.length)
                              ]
                            })`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                          }}
                        />
                      ) : (
                        <div className="w-[200px] h-[160px] bg-black rounded-[12px] flex justify-center items-center">
                          <Image
                            alt="logo"
                            src={volindo.src}
                            width={105}
                            height={32}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col ">
                      <label>Room {index + 1}</label>
                      <span className="text-white text-base">
                        {reservation?.service?.name_room[0] || 'not specified'}
                      </span>
                      {/* <div className="text-white text-base h-7 flex justify-between">
                        <p>check in</p>
                        <p>{reservation?.service?.check_in}</p>
                      </div>
                      <div className="text-white text-base h-7 flex justify-between">
                        <p>check out</p>
                        <p>{reservation?.service?.check_out}</p>
                      </div> */}
                    </div>
                  </div>
                )
              )}
              <div className="flex flex-row items-center h-[44px] justify-between bg-white/[0.08] rounded-md px-2 mt-4">
                <p className="text-base font-normal text-white/50 m-0">Total</p>
                <p className={` text-white/50 text-base font-normal  m-0`}>
                  $ {reservation?.payments?.total}
                </p>
              </div>
            </div>
          </div>
        </div>
        {hotelSlider && (
          <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-40 w-screen h-screen ">
            <div className="relative bg-[#141416] shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] h-[57%] w-[77%] flex justify-center rounded-xl  md:w-[77%]  lg:rounded-[16px] lg:p-4 lg:w-[40%] lg:max-w-[77%]  2xl:w-auto">
              <button
                onClick={() => setHotelSlider(false)}
                className="absolute -top-5 -right-6 z-[50]"
              >
                <Image alt="icon" src={IconCloseBlack} />
              </button>
              <div className="flex flex-col  justify-center items-center py-6 px-20 scale-[.3] sm:scale-[.45] md:scale-75  xl:scale-[.55] lg:mt-0  xl:mt-28 2xl:scale-100">
                <div className="flex justify-center flex-col items-center px-[150px] pb-24">
                  <div className="flex flex-col justify-center items-center">
                    <h2 className="text-[32px] font-[760] text-white">
                      {stay?.HotelName}
                    </h2>
                    <div className="flex space-x-5 mb-[22px]">
                      {Stars(reservation?.reservation?.hotel.stars || 0)}
                    </div>
                  </div>
                  <Carousel
                    centerMode
                    showThumbs
                    stopOnHover
                    className="w-[735px] h-[498px] hotelcarousel"
                    autoPlay
                    showStatus={false}
                    showIndicators={false}
                    renderArrowPrev={(clickHandler: any, hasPrev: any) => {
                      return (
                        <div
                          className={`${
                            hasPrev ? 'absolute' : 'hidden'
                          } top-0 bottom-0 left-0 flex justify-center items-center p-3  hover:opacity-100 cursor-pointer z-20`}
                          onClick={clickHandler}
                        >
                          <svg
                            width={50}
                            height={50}
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="15"
                              cy="15"
                              r="15"
                              transform="rotate(180 15 15)"
                              fill="white"
                            />
                            <path
                              d="M13.3452 15L16.2071 17.8619C16.4674 18.1223 16.4674 18.5444 16.2071 18.8047C15.9467 19.0651 15.5246 19.0651 15.2643 18.8047L11.9309 15.4714C11.6706 15.2111 11.6706 14.7889 11.9309 14.5286L15.2643 11.1953C15.5246 10.9349 15.9467 10.9349 16.2071 11.1953C16.4674 11.4556 16.4674 11.8777 16.2071 12.1381L13.3452 15Z"
                              fill="#383838"
                            />
                          </svg>
                        </div>
                      );
                    }}
                    renderArrowNext={(clickHandler: any, hasNext: any) => {
                      return (
                        <div
                          className={`${
                            hasNext ? 'absolute' : 'hidden'
                          } top-0 bottom-0 right-0 flex justify-center items-center p-3  hover:opacity-100 cursor-pointer z-20`}
                          onClick={clickHandler}
                        >
                          <svg
                            className="rotate-180"
                            width={50}
                            height={50}
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="15"
                              cy="15"
                              r="15"
                              transform="rotate(180 15 15)"
                              fill="white"
                            />
                            <path
                              d="M13.3452 15L16.2071 17.8619C16.4674 18.1223 16.4674 18.5444 16.2071 18.8047C15.9467 19.0651 15.5246 19.0651 15.2643 18.8047L11.9309 15.4714C11.6706 15.2111 11.6706 14.7889 11.9309 14.5286L15.2643 11.1953C15.5246 10.9349 15.9467 10.9349 16.2071 11.1953C16.4674 11.4556 16.4674 11.8777 16.2071 12.1381L13.3452 15Z"
                              fill="#383838"
                            />
                          </svg>
                        </div>
                      );
                    }}
                  >
                    {stay?.Images?.map((image: any, index: any) => (
                      <div
                        key={index}
                        className="w-[735px] h-[498px] object-fill "
                      >
                        <img
                          width={100}
                          height={100}
                          src={image}
                          alt={'images'}
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        )}
      </BookingLayout>
    </div>
  );
};

export default Reservation;
