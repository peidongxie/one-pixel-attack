import { useEffect, useMemo, useRef, type FC } from 'react';

interface PicCanvasProps {
  className?: string;
  minWidth: number;
  picture: [number, number, number][][];
}

const PicCanvas: FC<PicCanvasProps> = (props) => {
  const { className, minWidth, picture } = props;
  const size = useMemo(() => {
    const row = picture.length;
    const column = picture[0]?.length || 0;
    const times = column === 0 ? 0 : Math.ceil(minWidth / column);
    return [row, column, row * times, column * times];
  }, [minWidth, picture]);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.height = size[2];
    ref.current.width = size[3];
  }, [size]);
  return <canvas className={className} ref={ref} />;
};

export { PicCanvas as default };
