import { Chart, type ChartOptions } from 'chart.js';
import 'chart.js/auto';
import { useEffect, useRef, type FC } from 'react';

interface ProbabilityChartProps {
  className?: string;
  data: number[] | null;
}

const options: ChartOptions<'bar'> = {};

const ProbabilityChart: FC<ProbabilityChartProps> = (props) => {
  const { className, data } = props;
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
    chart.data = {
      datasets: [
        {
          label: 'Probabilities',
          data: data || [],
        },
      ],
      labels: (data || []).map((value, index) => 'Class ' + index),
    };
    chart.update();
  }, [data]);
  return <canvas className={className} ref={canvasRef} />;
};

export { ProbabilityChart as default };
