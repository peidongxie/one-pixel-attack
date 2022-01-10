import { Chart, type ChartOptions } from 'chart.js';
import 'chart.js/auto';
import { useEffect, useRef, type FC } from 'react';

interface PredictionChartProps {
  className?: string;
  predictions: [number[], number[]] | null;
}

const options: ChartOptions<'bar'> = {};

const PredictionChart: FC<PredictionChartProps> = (props) => {
  const { className, predictions } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart>();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [],
      },
      options: options,
    });
  }, []);
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    if (predictions) {
      chart.data = {
        datasets: [
          {
            label: 'Probabilities Before Attack',
            data: predictions[0],
          },
          {
            label: 'Probabilities After Attack',
            data: predictions[1],
          },
        ],
        labels: predictions[0].map((value, index) => 'Class ' + index),
      };
    } else {
      chart.data = {
        datasets: [
          {
            label: 'Probabilities Before Attack',
            data: [],
          },
          {
            label: 'Probabilities Before Attack',
            data: [],
          },
        ],
        labels: [],
      };
    }
    chart.update();
  }, [predictions]);
  return <canvas className={className} ref={canvasRef} />;
};

export { PredictionChart as default };
