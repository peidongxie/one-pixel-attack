const getPerturbation = (option: string | [number, number]): number => {
  if (typeof option === 'string') return Number(option);
  const [width, height] = option;
  return Math.round(width * height * 0.01);
};

export default getPerturbation;
