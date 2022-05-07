const drawWithCanvas = (
  context: CanvasRenderingContext2D,
  image: ImageData,
): void => {
  context.putImageData(image, 0, 0);
};

export { drawWithCanvas as default };
