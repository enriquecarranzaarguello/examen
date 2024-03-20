import React from 'react';
import moment from 'moment';

import { ModalReservations } from '@typing/proptypes';
import { Modal } from '@components';

//Icons
import calendarWhite from '@icons/calendar-white.svg';
import userDefaultIMG from '@icons/userDefaultIMG.svg';
import phoneIcon from '@icons/phone.svg';
import emailIcon from '@icons/email.svg';
import computerIcon from '@icons/computerIcon.svg';
import volindo from '@images/volindo.png';
import download from '@icons/download.svg';
import print from '@icons/print.svg';
import locationIcon from '@icons/pingSuppierIcon.svg';

import Image from 'next/image';

export default function ModalGeneralReservation({
  open,
  onClose,
  reservation,
}: ModalReservations) {
  const formatDate = (dateString: string | number | Date) => {
    const date = moment(dateString).add(1, 'day');
    const formattedDate = date.format('ddd, DD MMM');
    return formattedDate;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative flex flex-col justify-between items-center w-[45vw] rounded-[16px] py-5 max-h-80vh overflow-hidden">
        <div className="flex w-100 justify-center">
          <h2 className="text-white text-3xl font-bold">Reservation</h2>
        </div>
        <div className="flex gap-3 w-3/4 justify-center text-md text-white">
          <div className="w-3/4"></div>
          <div className="w-1/4 flex flex-row px-2 my-2">
            <div className="flex gap-3 mr-2">
              <Image src={download} height={10} width={10} alt="download" />
              <button>PDF</button>
            </div>
            <div className="flex gap-3 px-2">
              <Image src={print} height={10} width={10} alt="print" />
              <button>Print</button>
            </div>
          </div>
        </div>
        <div className="w-3/4 background bg-white/[0.08] flex flex-row justify-between p-1 rounded-md">
          <p className="text-base font-normal text-white/50 m-0 capitalize ml-5">
            Trip Status
          </p>
          <p className="text-base font-normal text-white m-0 capitalize mr-5">
            {reservation?.status_trip_reservation}
          </p>
        </div>
        <div className="w-3/4 flex flex-column mt-2">
          <div className="w-1/2">
            <h2 className="text-white text-2xl font-bold">
              {reservation?.service?.hotel_name}
            </h2>
            <div className="flex gap-1">
              <Image src={locationIcon} height={10} width={10} alt="volindo" />
              <p>{reservation?.service?.address}</p>
            </div>
            <div>Estrellas</div>
          </div>
          <div className="w-1/2">
            <div className="w-full mr-2 h-[100px] bg-black rounded-[12px] flex justify-center items-center">
              <Image alt="logo" src={volindo.src} width={105} height={28} />
            </div>
          </div>
        </div>
        <div className="justify-start flex w-3/4">
          <h3 className="text-white text-1xl font-bold align-start">Agent</h3>
        </div>
        <div className="w-3/4 grid grid-cols-2 gap-4 text-white">
          <div className="flex items-center justify-center gap-2">
            <Image src={userDefaultIMG} height={30} width={30} alt="volindo" />
            <p className="text-base font-sm">{reservation?.agent?.full_name}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Image src={emailIcon} height={30} width={30} alt="volindo" />
            <p className="text-base font-sm">{reservation?.agent?.email}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Image src={phoneIcon} height={30} width={30} alt="volindo" />
            <p className="text-base font-sm">
              {reservation?.agent?.phone_number}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Image src={computerIcon} height={30} width={30} alt="volindo" />
            <p className="text-base font-sm">No website</p>
          </div>
        </div>
        <div className="w-3/4 background bg-white/[0.08] flex flex-row p-1 mt-5 rounded-md justify-between">
          <div className="w-full flex flex-row justify-center px-10">
            <div className="w-1/2">
              <p className="text-sm">Check-in</p>
              <div className="flex gap-2">
                <Image
                  src={calendarWhite}
                  height={14}
                  width={14}
                  alt="volindo"
                />
                <p className="text-base font-sm text-white/50">
                  {formatDate(reservation?.service?.check_in)}
                </p>
              </div>
            </div>
            <div className="w-1/2">
              <p className="text-sm">Check-Out</p>
              <div className="flex gap-2">
                <Image
                  src={calendarWhite}
                  height={14}
                  width={14}
                  alt="volindo"
                />
                <p className="text-base font-sm text-white/50">
                  {formatDate(reservation?.service?.check_out)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="justify-start flex w-3/4">
          <h3 className="text-white text-1xl font-bold align-start">Guest 1</h3>
        </div>
        <div className="w-3/4">
          <div className=" flex justify-between text-sm">
            <p className="text-white/50">Nombre</p>
            <p className="text-white">
              {reservation?.main_contact[0]?.first_name}{' '}
              {reservation?.main_contact[0].last_name}
            </p>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-white/50">Phone</p>
            <p className="text-white">
              {reservation?.main_contact[0]?.phone ||
                reservation?.main_contact[0]?.phone_number}
            </p>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-white/50">Email</p>
            <p className="text-white">{reservation?.main_contact[0]?.email}</p>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-white/50">Age, Gender</p>
            <p className="text-white">
              {reservation?.main_contact[0]?.age || 33},{' '}
              {reservation?.main_contact[0]?.title}
            </p>
          </div>
        </div>

        <div className="w-3/4 flex flex-row mb-2">
          <div className="w-1/2">
            {reservation?.Images?.length > 0 ? (
              <div
                onClick={() => console.log('Lanzar imagen')}
                className="min-w-[200px] min-h-[160px] rounded-[12px]"
                style={{
                  backgroundImage: `url(${
                    reservation?.Images[
                      Math.floor(Math.random() * reservation?.Images?.length)
                    ]
                  })`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            ) : (
              <div className="w-auto mr-2 h-[120px] bg-black rounded-[12px] flex justify-center items-center">
                <Image alt="logo" src={volindo.src} width={105} height={28} />
              </div>
            )}
          </div>
          <div className="w-1/2">
            <p className="text-sm text-gray-100 leading-3">
              Room{' '}
              {reservation?.service?.supplier_type === 'adventures'
                ? 10
                : reservation?.service?.name_room.length}
            </p>
            <p className="text-md text-white">
              {reservation?.service?.supplier_type === 'adventures'
                ? 10
                : reservation?.service?.name_room[0]}
            </p>
            <p className="text-md text-white">{`{Fully Refunable before}`}</p>
          </div>
        </div>
        <div className="w-3/4 background bg-white/[0.08] flex flex-row justify-between p-1 rounded-md">
          <p className="text-base font-normal text-white/50 m-0 capitalize ml-5">
            Total
          </p>
          <p className="text-base font-normal text-white m-0 capitalize mr-5">
            $ {reservation?.payments?.total}
          </p>
        </div>
      </div>
    </Modal>
  );
}
