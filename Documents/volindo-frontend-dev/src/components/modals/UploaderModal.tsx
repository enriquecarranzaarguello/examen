import { UploaderModelProps } from '@typing/types';
import React from 'react';
import Image from 'next/image';
import closebtn from '@icons/close-black.svg';
import cloudUpload from '@icons/cloudUpload.svg';
import { Uploader } from 'rsuite';
import { useTranslation } from 'react-i18next';
import config from '@config';

const UploaderModel = ({
  isOpen,
  close,
  currentUploaderKey,
  handleFileUpload,
  fileList,
  fileType = 'All',
  singleFile = false,
  callbackAndClose,
  limit,
}: UploaderModelProps) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const checkWL = config.WHITELABELNAME === 'Volindo';

  return (
    <div
      className={`fixed inset-0 h-screen bg-black z-50 lg:flex lg:justify-center lg:items-center lg:backdrop-blur-md lg:bg-transparent `}
    >
      <div className="lg:relative lg:bg-[#141416] lg:shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] lg:rounded-[16px] lg:p-10  lg:h-auto lg:w-[678px] ">
        <button
          onClick={close}
          className="float-right px-4 mt-4 lg:absolute lg:-right-10 lg:-top-10"
        >
          <Image src={closebtn} alt="close" className="lg:h-20 lg:w-20" />
        </button>
        <div className="flex flex-col justify-around items-center w-full h-full relative px-[15px]">
          <Uploader
            draggable
            listType="picture-text"
            name={currentUploaderKey}
            multiple={!singleFile}
            onChange={
              !limit
                ? files => handleFileUpload(currentUploaderKey, files)
                : files => {
                    if (files.length > limit)
                      handleFileUpload(currentUploaderKey, files.slice(-limit));
                    else handleFileUpload(currentUploaderKey, files);
                  }
            }
            fileList={fileList}
            action={''}
            accept={
              fileType === 'Images'
                ? 'image/png, image/jpeg, image/png, image/jfif, image/webp'
                : ''
            }
            autoUpload={false}
            className="w-full text-center h-[295px] mb-3 flex flex-col items-center justify-center overflow-y-auto lg:scrollbar-hide"
          >
            <div className="flex flex-col gap-y-8 items-center mt-20 bg-transparent">
              <Image
                src={cloudUpload}
                alt="cloud"
                className="mx-auto my-2 block"
              />
              <div className="flex flex-col items-center gap-y-2 text-center">
                <span className="text-white text-base font-bold">
                  {singleFile ? t('upload.drop') : t('upload.drop_multi')}{' '}
                  <span
                    className={`underline cursor-pointer ${
                      checkWL
                        ? 'text-[var(--primary-background)]'
                        : 'text-[var(--blue-color)]'
                    }`}
                  >
                    {t('upload.browse')}
                  </span>
                </span>
                <p className="text-[#676767] w-[232px] text-xs leading-6">
                  {t('upload.formats')}{' '}
                  {fileType == 'Images'
                    ? 'JPEG, PNG, JFIF, WEBP'
                    : 'JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT'}
                  {limit ? (
                    <>
                      <br /> (Max. {limit}{' '}
                      {fileType === 'All'
                        ? t('upload.files')
                        : t('upload.images')}
                      )
                    </>
                  ) : null}
                </p>
              </div>
            </div>
          </Uploader>
          <button
            disabled={fileList.length === 0}
            onClick={
              typeof callbackAndClose === 'undefined' ? close : callbackAndClose
            }
            className={`text-white w-full max-w-[361px] h-[59px] text-[16px] font-[760] flex items-center justify-center rounded-full ${
              fileList.length > 0
                ? checkWL
                  ? 'bg-[var(--primary-background)]'
                  : 'bg-[var(--blue-color)] hover:bg-[var(--blue-color-darken)]'
                : 'bg-[#262626]'
            }`}
          >
            {t('upload.action')}
            {singleFile ? '' : 's'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default UploaderModel;
