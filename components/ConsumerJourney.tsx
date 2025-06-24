'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ConsumerJourneyProps {
  campaign: any;
}

export default function ConsumerJourney({ campaign }: ConsumerJourneyProps) {
  // Generate consumer journey data
  const generateJourneyData = () => {
    const stages = ['Awareness', 'Interest', 'Consideration', 'Action', 'Advocacy'];
    return {
      labels: stages,
      datasets: [
        {
          label: 'Conversion Rate %',
          data: [100, 75, 45, 25, 15],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: '#374151',
        },
      },
      y: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: '#374151',
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
        <h3 className="text-2xl font-medium mb-6 text-green-400">Consumer Journey Visualization</h3>
        <div className="h-96">
          <Line data={generateJourneyData()} options={chartOptions} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {['Awareness', 'Interest', 'Consideration', 'Action', 'Advocacy'].map((stage, index) => (
          <div key={stage} className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold">{index + 1}</span>
            </div>
            <h4 className="font-medium mb-2">{stage}</h4>
            <p className="text-2xl font-bold text-green-400">{[100, 75, 45, 25, 15][index]}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}