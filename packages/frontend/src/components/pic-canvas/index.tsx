import { useEffect, useRef, type FC } from 'react';

interface PicCanvasProps {
  className?: string;
  minHeight?: number;
  minWidth?: number;
  picture: number[];
  shape: [number, number, number];
}

const PicCanvas: FC<PicCanvasProps> = (props) => {
  const { className, minHeight = 200, minWidth = 200, picture, shape } = props;
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const times = Math.max(
      Math.ceil(minHeight / shape[0]),
      Math.ceil(minWidth / shape[1]),
    );
    ref.current.height = shape[0] * times;
    ref.current.width = shape[1] * times;
  }, [minHeight, minWidth, shape]);
  return <canvas className={className} ref={ref} />;
};

export { PicCanvas as default };
