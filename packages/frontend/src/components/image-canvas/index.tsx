import { useEffect, useRef, type FC } from 'react';
import drawWithCanvas from './canvas';
import drawWithWebGL, { type CacheOfWebGL } from './webgl';

interface ImageCanvasProps {
  className?: string;
  image: ImageData | null;
}

const ImageCanvas: FC<ImageCanvasProps> = (props) => {
  const { className, image } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webglRef = useRef<CacheOfWebGL>();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = image?.width || 0;
    canvas.height = image?.height || 0;
    if (!image) return;
    const webgl2Context = canvas.getContext('webgl2');
    if (webgl2Context) {
      webglRef.current = drawWithWebGL(webgl2Context, image, webglRef.current);
      return;
    }
    const webglContext = canvas.getContext('webgl');
    if (webglContext) {
      webglRef.current = drawWithWebGL(webglContext, image, webglRef.current);
      return;
    }
    const nativeContext = canvas.getContext('2d');
    if (nativeContext) {
      drawWithCanvas(nativeContext, image);
      return;
    }
  }, [image]);
  return <canvas className={className} ref={canvasRef} />;
};

export { ImageCanvas as default };
