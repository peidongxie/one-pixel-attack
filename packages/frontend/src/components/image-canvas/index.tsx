import { useEffect, useMemo, useRef, type FC } from 'react';

interface ImageCanvasProps {
  className?: string;
  image: ImageData | null;
  minHeight?: number;
  minWidth?: number;
}

const ImageCanvas: FC<ImageCanvasProps> = (props) => {
  const { className, image, minHeight = 200, minWidth = 200 } = props;
  const times = useMemo(() => {
    if (!image) return 0;
    return Math.max(
      Math.ceil(minHeight / image.height),
      Math.ceil(minWidth / image.width),
    );
  }, [image, minHeight, minWidth]);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (!image) return;
    ref.current.height = image.height * times;
    ref.current.width = image.width * times;
    const context = ref.current.getContext('2d');
    if (!context) return;
    context?.putImageData(image, 0, 0);
    context?.scale(times, times);
    context.globalCompositeOperation = 'copy';
    context?.drawImage(
      ref.current,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      image.width,
      image.height,
    );
  }, [image, times]);
  return <canvas className={className} ref={ref} />;
};

export { ImageCanvas as default };
