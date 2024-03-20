import { useRef, useState, DragEvent } from 'react';
import Image from 'next/image';
import MarketModal from '../MarketModal';
import styles from '@styles/marketing.module.scss';
import CloudUpload from '@icons/cloudUpload.svg';
import CrossDelete from '@icons/marketingIcons/cross-delete.svg';
import { useTranslation } from 'react-i18next';

const MarketUploadFilesModal = ({
  open,
  onClose,
  value = [],
  onChange = () => {},
}: {
  open: boolean;
  onClose: () => void;
  value?: File[];
  onChange?: (files: File[]) => void;
}) => {
  const { t } = useTranslation();
  const LIMIT = 10;
  const EXTENSIONS = [
    '.jpg',
    '.jpeg',
    '.png',
    '.jfif',
    '.webp',
    '.mp4',
    '.ogg',
    '.webm',
  ];

  const files = useRef<File[]>([]);
  const refDropArea = useRef<HTMLDivElement>(null);
  const refInputFile = useRef<HTMLInputElement>(null);
  const [filenames, setFilenames] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const updateFiles = (fileList: File[]) => {
    files.current.push(...fileList);

    if (files.current.length > LIMIT) {
      while (files.current.length != LIMIT) {
        files.current.shift();
      }
    }

    setFilenames(files.current.map(file => file.name));
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const dataTransfer = e.dataTransfer?.files;

    if (dataTransfer) {
      let fileArray = Array.from(dataTransfer);
      fileArray = fileArray.filter(file =>
        EXTENSIONS.some(ext => file.name.endsWith(ext))
      );
      updateFiles(fileArray);
    }
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === refDropArea.current) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target !== refDropArea.current) {
      setDragging(false);
    }
  };

  const handleBrowse = () => {
    if (refInputFile.current) refInputFile.current.click();
  };

  const handleFileChange = (e: any) => {
    const files: FileList = e.target.files;
    if (files.length != 0) {
      const fileArray = Array.from(files);
      updateFiles(fileArray);
    }
  };

  const deleteFile = (index: number) => {
    files.current.splice(index, 1);
    setFilenames(files.current.map(file => file.name));
  };

  const handleUploadFiles = () => {
    onChange(files.current);
    onClose();
  };

  const handleClose = () => {
    files.current = [];
    updateFiles(value);
    onClose();
  };

  return (
    <MarketModal open={open} onClose={handleClose}>
      <div className={`${styles['modal--upload__wrapper']}`}>
        <div
          className={`${styles['modal--upload__dropArea']} ${
            dragging ? styles.dragging : ''
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          ref={refDropArea}
        >
          <Image src={CloudUpload} alt="Upload Image" width={74} height={74} />
          <div className={styles['modal--upload__dropArea__dragText']}>
            <span>{t('marketing.adManager.new.drag')}</span>
            <button onClick={handleBrowse}>
              {t('marketing.adManager.new.browse')}
            </button>
          </div>
          <div className={styles['modal--upload__dropArea__formats']}>
            {t('marketing.adManager.new.support')}JPEG, PNG, JFIFM WEBP, MP4,
            OGG, WEBM
          </div>
          <div className={styles['modal--upload__dropArea__formats']}>
            (Max. {LIMIT} {t('upload.files')})
          </div>
          <input
            ref={refInputFile}
            type="file"
            onChange={handleFileChange}
            accept=".jpg, .png, .jfif, .webp , .mp4 , .ogg , .webm"
            multiple
          />
        </div>
        <div className={styles['modal--upload__button__container']}>
          {filenames.map((filename, index) => (
            <div
              className={styles['modal--upload__button']}
              key={`${filename}-${index}`}
              tabIndex={0}
            >
              <span>{filename}</span>
              <Image
                src={CrossDelete}
                alt="Delete"
                width={20}
                height={20}
                onClick={() => deleteFile(index)}
                tabIndex={0}
              />
            </div>
          ))}
        </div>
        <MarketModal.Button onClick={handleUploadFiles}>
          {t('marketing.adManager.new.upload')}
        </MarketModal.Button>
      </div>
    </MarketModal>
  );
};

export default MarketUploadFilesModal;
