import { useEffect, useMemo, useRef, type FC } from 'react';

interface ImageCanvasProps {
  className?: string;
  image: number[];
  minHeight?: number;
  minWidth?: number;
  shape: [number, number, number];
}

const ImageCanvas: FC<ImageCanvasProps> = (props) => {
  const { className, image, minHeight = 200, minWidth = 200, shape } = props;
  const imageData = useMemo(() => {
    if (!image.length) return null;
    return new ImageData(Uint8ClampedArray.from(image), shape[1], shape[0]);
  }, [image, shape]);
  const times = useMemo(() => {
    return Math.max(
      Math.ceil(minHeight / shape[0]),
      Math.ceil(minWidth / shape[1]),
    );
  }, [minHeight, minWidth, shape]);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current || !imageData) return;
    ref.current.height = shape[0] * times;
    ref.current.width = shape[1] * times;
    const context = ref.current.getContext('2d');
    if (!context) return;
    context?.putImageData(imageData, 0, 0);
    context?.scale(times, times);
    context.globalCompositeOperation = 'copy';
    context?.drawImage(
      ref.current,
      0,
      0,
      shape[1],
      shape[0],
      0,
      0,
      shape[1],
      shape[0],
    );
  }, [imageData, shape, times]);
  return <canvas className={className} ref={ref} />;
};

export { ImageCanvas as default };
