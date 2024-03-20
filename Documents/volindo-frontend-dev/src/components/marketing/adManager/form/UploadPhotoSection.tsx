import { useState } from 'react';
import styles from '@styles/marketing.module.scss';

import PhotoAddIcon from '@icons/marketingIcons/plus-photo.svg';
import Image from 'next/image';
import { MarketUploadFilesModal } from '@components/marketing';

import { useAdFormStore } from '@components/marketing/adManager/context/NewAdContext';

const UploadPhotoSection = ({ buttonDisable }: any) => {
  const [files, setStore] = useAdFormStore(store => store.uploadFiles);
  const [thumbnails] = useAdFormStore(store => store.filesThumbnails);

  const [openUpload, setOpenUpload] = useState(false);
  const [extraButtons, setExtraButtons] = useState(3);

  const getVideoThumbnail = async (videoFile: File) => {
    const videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(videoFile);
    videoElement.muted = true;
    videoElement.currentTime = 5;

    await videoElement.play();

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    let thumbnail = '';

    if (context) {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      thumbnail = canvas.toDataURL('image/jpeg');
    }
    await videoElement.pause();

    return thumbnail;
  };

  const updateFilesImages = async (newFiles: File[]) => {
    const imagesURLs: string[] = [];

    for (let file of newFiles) {
      if (file.type.startsWith('image')) {
        imagesURLs.push(URL.createObjectURL(file));
      } else {
        imagesURLs.push(await getVideoThumbnail(file));
      }
    }

    setStore({ filesThumbnails: imagesURLs });

    const extraButtons = 3 - imagesURLs.length;
    setExtraButtons(extraButtons <= 0 ? 1 : extraButtons);
  };

  const onChangeUploadFiles = (newFiles: File[]) => {
    updateFilesImages(newFiles);
    setStore({ uploadFiles: [...newFiles] });
  };

  return (
    <>
      <MarketUploadFilesModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        value={files}
        onChange={onChangeUploadFiles}
      />
      <div className={styles.photoAdd__container}>
        {thumbnails.map((imageURL, index) => (
          <div
            className={`${styles.photoAdd__box} ${styles.image}`}
            key={index}
            onClick={() => {
              setOpenUpload(true);
            }}
          >
            <Image src={imageURL} fill alt="image" />
          </div>
        ))}

        {Array(extraButtons)
          .fill('')
          .map((_, index) => (
            <button
              key={index}
              role="button"
              disabled={buttonDisable}
              tabIndex={0}
              className={`${styles.photoAdd__box} ${styles.noImage}`}
              onClick={() => setOpenUpload(true)}
            >
              <Image
                src={PhotoAddIcon}
                alt="Add photo"
                width={24}
                height={24}
              />
            </button>
          ))}
      </div>
    </>
  );
};

export default UploadPhotoSection;
