import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import type { ModalHotelImageProps } from '@typing/proptypes';

import starWhite from '@icons/star-white.svg';
import starGrayIcon from '@icons/star-gray.svg';

import { Modal, ModalImageSlider, HotelStarsRating } from '@components';

export default function ModalHotelImages({
  open,
  onClose,
  stay,
}: ModalHotelImageProps) {
  const [openSlider, setOpenSlider] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { t } = useTranslation();

  return (
    <>
      <ModalImageSlider
        open={openSlider}
        onClose={() => setOpenSlider(false)}
        title={stay.hotel_name}
        ImageArray={stay.Images}
        stars={stay.stars}
        selectedIndex={selectedIndex}
      />
      {openSlider === true ? (
        ''
      ) : (
        <Modal open={open} onClose={onClose}>
          <div className="flex flex-col space-y-[83px] justify-center items-center mt-[67px] lg:mt-0 py-6 px-20 xs:mt-[0px] xs:px-2">
            <div className="flex justify-center flex-col items-center">
              <label className="text-[#FCFCFD] text-center text-[40px] font-[760] xs:text-left xs:text-[20px]">
                {stay.hotel_name}
              </label>
              <div className="flex space-x-[10px] mb-[21px]">
                <HotelStarsRating
                  hotelRating={stay.stars}
                  origin="hotelDetails"
                />
              </div>
              <div className="flex flex-wrap justify-center items-center space-x-[10px] space-y-[10px] h-[550px] cursor-pointer overflow-y-auto duration-1000 scrollbar-hide">
                {stay.Images.map((image: any, index: any) => (
                  <div
                    key={index}
                    className="object- overflow-hidden  w-[195px] h-[128px] hover:scale-110 xs:w-[100px] xs:h-[75px]"
                  >
                    {/*  <Image
                      width={195}
                      height={128}
                      src={"http://www.tboholidays.com//imageresource.aspx?img=FbrGPTrju5e5v0qrAGTD8pPBsj8/wYA5F3wAmN3NGLVydclVdmtcN2eDZL7Ri6iPF7eHFvLMUuZCkZqkDqksN843fmIZ/OGkfdCpnvwdYHA="}
                      alt={image}
                      onClick={() => setOpenSlider(true)}
                    /> */}
                    <div
                      className="xs:min-w-full min-h-[120px] rounded-3xl"
                      onClick={() => {
                        setSelectedIndex(index);
                        setOpenSlider(true);
                      }}
                      key={index}
                      style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="mx-auto my-3 w-full h-[48px] bg-whiteLabelColor text-white rounded-3xl max-w-[274px] px-[23px] mt-[31px]"
              >
                {t('stays.chooseroom')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
