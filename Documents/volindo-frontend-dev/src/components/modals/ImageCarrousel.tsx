import React from 'react';
import Image from 'next/image';

import { Modal, ModalImageSlider, HotelStarsRating } from '@components';
import starWhiteIcon from '@icons/star-white.svg';
import starGrayIcon from '@icons/star-gray.svg';

export default function ModalImagesCarrousel({
  open,
  onClose,
  title,
  stars,
  ImageArray,
}: any) {
  const [openSlider, setOpenSlider] = React.useState(false);
  const [selectedImageIndex, setSelectedModalIndex] = React.useState(0);

  const handleSelectedImage = (index: number) => {
    setSelectedModalIndex(index);
    setOpenSlider(true);
  };

  return (
    <>
      <ModalImageSlider
        open={openSlider}
        onClose={() => setOpenSlider(false)}
        title={title}
        stars={stars}
        ImageArray={ImageArray}
        selectedIndex={selectedImageIndex}
      />
      {openSlider === true ? (
        ''
      ) : (
        <Modal open={open} onClose={onClose}>
          <div className="flex flex-col space-y-[83px] justify-center items-center mt-[67px] lg:mt-0 py-6 px-20 xs:mt-[0px] xs:px-2">
            <div className="flex justify-center flex-col items-center">
              <label className="text-[#FCFCFD] text-center text-[40px] font-[760] xs:text-left xs:text-[20px]">
                {title}
              </label>
              {stars > 0 && (
                <label className="text-[#FCFCFD] text-center text-[40px] font-[760] xs:text-left xs:text-[20px]">
                  <HotelStarsRating
                    hotelRating={stars}
                    origin="hotelProposal"
                  />
                </label>
              )}
              <div className=" flex flex-wrap justify-center items-start pt-5 h-fit cursor-pointer overflow-y-auto duration-1000 scrollbar-hide xs:flex-col">
                {ImageArray.map((image: any, index: any) => (
                  <div
                    key={index}
                    className="overflow-hidden w-[195px] h-[128px] hover:scale-105 items-center self-center mx-auto"
                  >
                    <div className="xs:min-w-full min-h-[120px] rounded-3xl">
                      <Image
                        onClick={() => handleSelectedImage(index)}
                        src={image}
                        alt={`Image ${index}`}
                        width={500}
                        height={500}
                        className="w-full h-[120px] rounded-[20px] object-cover object-center px-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
