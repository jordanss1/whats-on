import React, { useState } from 'react';
import fallbackImg from '../assets/event-fallback.jpg';

type ImgWithFallbackType = {} & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

const ImgWithFallback: React.FC<ImgWithFallbackType> = ({ src, ...props }) => {
  const [img, setImg] = useState<string>(src as string);

  return <img src={img} onError={() => setImg(fallbackImg)} {...props} />;
};

export default ImgWithFallback;
