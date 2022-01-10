import { Chart, type ChartOptions } from 'chart.js';
import 'chart.js/auto';
import { useEffect, useRef, type FC } from 'react';
import { useTheme } from '@material-ui/core';

interface PredictionChartProps {
  className?: string;
  predictions: [number[], number[]] | null;
}

const options: ChartOptions<'bar'> = {};

const PredictionChart: FC<PredictionChartProps> = (props) => {
  const { className, predictions } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart>();
  const theme = useTheme();
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
            data: predictions[0],
            label: 'Probabilities Before Attack',
            backgroundColor: theme.palette.primary.main,
            hoverBackgroundColor: theme.palette.primary.main + '95',
          },
          {
            data: predictions[1],
            label: 'Probabilities After Attack',
            backgroundColor: theme.palette.secondary.main,
            hoverBackgroundColor: theme.palette.secondary.main + '95',
          },
        ],
        labels: predictions[0].map((value, index) => 'Class ' + index),
      };
    } else {
      chart.data = {
        datasets: [
          {
            data: [],
            label: 'Probabilities Before Attack',
            backgroundColor: theme.palette.primary.main,
            hoverBackgroundColor: theme.palette.primary.main + '95',
          },
          {
            data: [],
            label: 'Probabilities After Attack',
            backgroundColor: theme.palette.secondary.main,
            hoverBackgroundColor: theme.palette.secondary.main + '95',
          },
        ],
        labels: [],
      };
    }
    chart.update();
  }, [predictions, theme.palette]);
  return <canvas className={className} ref={canvasRef} />;
};

export { PredictionChart as default };
