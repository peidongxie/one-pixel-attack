import { useEffect, useRef, type FC } from 'react';

interface ImageCanvasProps {
  className?: string;
  image: ImageData | null;
}

const ImageCanvas: FC<ImageCanvasProps> = (props) => {
  const { className, image } = props;
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.width = image?.width || 0;
    canvas.height = image?.height || 0;
    image && canvas.getContext('2d')?.putImageData(image, 0, 0);
  }, [image]);
  return <canvas className={className} ref={ref} />;
};

export { ImageCanvas as default };
