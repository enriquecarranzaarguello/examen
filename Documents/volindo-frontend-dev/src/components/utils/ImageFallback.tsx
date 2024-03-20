import { useState, FC } from 'react';

const ImageFallback: FC<{
  src: string;
  fallbackSrc: string;
  [key: string]: any;
}> = ({ src, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  return <img src={imgSrc} onError={() => setImgSrc(fallbackSrc)} {...props} />;
};

export default ImageFallback;
