import { Chart, type ChartOptions } from 'chart.js';
import 'chart.js/auto';
import { useEffect, useRef, type FC } from 'react';
import { useTheme } from '@material-ui/core';

interface PredictionChartProps {
  className?: string;
  predictions: [number[], number[], string[]];
}

const options: ChartOptions<'bar'> = {
  interaction: {
    intersect: false,
    mode: 'index',
  },
  scales: {
    y: {
      min: 0,
      max: 1,
      ticks: {
        stepSize: 0.25,
        callback: (value) => (Number(value) * 100).toFixed(0) + '%',
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: (item) => 'Class ' + item[0].dataIndex,
        label: (item) => (Number(item.raw) * 100).toFixed(2) + '%',
      },
    },
  },
};

const PredictionChart: FC<PredictionChartProps> = (props) => {
  const { className, predictions } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<'bar', number[], string>>();
  const theme = useTheme();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        datasets: [],
        labels: [],
      },
      options: options,
    });
  }, []);
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
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
      labels: predictions[2],
    };
    chart.update();
  }, [predictions, theme.palette]);
  return <canvas className={className} ref={canvasRef} />;
};

export { PredictionChart as default };
