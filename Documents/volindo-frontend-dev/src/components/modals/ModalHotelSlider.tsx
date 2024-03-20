import { ModalHotelImageProps } from '@typing/proptypes';
import { Modal } from '@components';

import Image from 'next/image';

import starWhite from '@icons/star-white.svg';
import starGrayIcon from '@icons/star-gray.svg';

import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function ModalHotelSlider({
  open,
  onClose,
  stay,
}: ModalHotelImageProps) {
  const Stars = (stars: number) => {
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

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className="flex flex-col  justify-center items-center mt-[67px] lg:mt-0 py-6 px-20 xs:h[100vh] xs:mt-[150px] xs:pr-[80px]">
          <div className="flex justify-center flex-col items-center px-[150px] pb-24">
            <div className="flex flex-col justify-center items-center xs:hidden">
              <h2 className="text-[32px] font-[760] text-white xs:hidden">
                {stay.hotel_name}
              </h2>
              <div className="flex space-x-5 mb-[22px] xs:hidden">
                {Stars(stay.stars)}
              </div>
            </div>
            <Carousel
              centerMode
              showThumbs={false}
              stopOnHover
              className="w-[735px] h-[498px] hotelcarousel xs:w-[335px] xs:h-[250px]"
              autoPlay
              showStatus={false}
              showIndicators={false}
              renderArrowPrev={(clickHandler, hasPrev) => {
                return (
                  <div
                    className={`${
                      hasPrev ? 'absolute' : 'hidden'
                    } top-0 bottom-0 left-0 flex justify-center items-center p-3  hover:opacity-100 cursor-pointer z-20 xs:hidden`}
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
              renderArrowNext={(clickHandler, hasNext) => {
                return (
                  <div
                    className={`${
                      hasNext ? 'absolute' : 'hidden'
                    } top-0 bottom-0 right-0 flex justify-center items-center p-3  hover:opacity-100 cursor-pointer z-20 xs:hidden`}
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
              {stay.Images.map((image: any, index: number) => (
                <div
                  key={index}
                  className="w-[735px] h-[498px] object-fill  xs:w-[330px] "
                >
                  <img width={100} height={100} src={image} alt={'images'} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </Modal>
    </>
  );
}
