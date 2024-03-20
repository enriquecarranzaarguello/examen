import Image from 'next/image';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

import { Modal, HotelStarsRating } from '@components';

import { Carousel } from 'react-responsive-carousel';
import { ImageSliderProps } from '@typing/proptypes';

export default function ModalImageSlider({
  open,
  onClose,
  title,
  stars,
  ImageArray,
  selectedIndex,
}: ImageSliderProps) {
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className="flex flex-col  justify-center items-center mt-[67px] lg:mt-0 py-6 px-20 xs:h[100vh] xs:mt-[150px] xs:pr-[80px]">
          <div className="flex justify-center flex-col items-center px-[50px] pb-24">
            <div className="flex flex-col justify-center items-center xs:hidden">
              <label className="text-[#FCFCFD] text-center text-[40px] font-[760] xs:text-left xs:text-[20px]">
                {title}
              </label>
              {stars > 0 && (
                <div className="flex space-x-[10px] mb-[21px]">
                  <HotelStarsRating hotelRating={stars} origin="slider" />
                </div>
              )}
            </div>
            <Carousel
              centerMode
              showThumbs={false}
              stopOnHover
              className="w-[735px] h-[498px] hotelcarousel xs:w-auto xs:h-[250px] aspect-square"
              autoPlay={false}
              selectedItem={open ? selectedIndex : 0}
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
              {ImageArray.map((image: any, index: number) => (
                <div
                  key={index}
                  className="w-[735px] h-[498px] object-fill  xs:w-[330px] "
                >
                  <Image width={500} height={500} src={image} alt={'images'} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </Modal>
    </>
  );
}
