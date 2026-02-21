// Biometric Chart Component - Real-time visualization of biosensor data

'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useBiometricStore, selectHistoryForChart } from '@/store/biometricStore';

type MetricType = 'heartRate' | 'hrv' | 'gsr' | 'stressScore' | 'skinTemp';

interface BiometricChartProps {
  metric: MetricType;
  height?: number;
  showGrid?: boolean;
}

const metricConfig: Record<MetricType, {
  label: string;
  color: string;
  unit: string;
  domain: [number, number];
  thresholds?: { value: number; color: string; label: string }[];
}> = {
  heartRate: {
    label: 'Heart Rate',
    color: '#EF4444',
    unit: 'BPM',
    domain: [50, 160],
    thresholds: [
      { value: 100, color: '#F59E0B', label: 'Elevated' },
      { value: 120, color: '#EF4444', label: 'High' },
    ],
  },
  hrv: {
    label: 'HRV (RMSSD)',
    color: '#10B981',
    unit: 'ms',
    domain: [10, 110],
    thresholds: [
      { value: 50, color: '#F59E0B', label: 'Low' },
      { value: 30, color: '#EF4444', label: 'Very Low' },
    ],
  },
  gsr: {
    label: 'Skin Conductance',
    color: '#8B5CF6',
    unit: 'μS',
    domain: [0, 20],
    thresholds: [
      { value: 8, color: '#F59E0B', label: 'Elevated' },
      { value: 12, color: '#EF4444', label: 'High' },
    ],
  },
  stressScore: {
    label: 'Stress Level',
    color: '#F97316',
    unit: '',
    domain: [0, 100],
    thresholds: [
      { value: 55, color: '#F59E0B', label: 'Feedback Threshold' },
      { value: 75, color: '#EF4444', label: 'Overload Zone' },
    ],
  },
  skinTemp: {
    label: 'Skin Temperature',
    color: '#F59E0B',
    unit: '°C',
    domain: [30, 38],
    thresholds: [
      { value: 33, color: '#F59E0B', label: 'Low' },
      { value: 35, color: '#10B981', label: 'Normal' },
    ],
  },
};

export const BiometricChart: React.FC<BiometricChartProps> = ({
  metric,
  height = 120,
  showGrid = true,
}) => {
  const history = useBiometricStore(selectHistoryForChart);
  const config = metricConfig[metric];
  
  const data = useMemo(() => {
    return history.map((point, index) => ({
      index,
      value: point[metric],
      time: new Date(point.timestamp).toLocaleTimeString('en-US', {
        hour12: false,
        minute: '2-digit',
        second: '2-digit',
      }),
    }));
  }, [history, metric]);
  
  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">{config.label}</span>
        <span 
          className="text-lg font-bold"
          style={{ color: config.color }}
        >
          {typeof latestValue === 'number' ? latestValue.toFixed(1) : latestValue}
          <span className="text-xs ml-1 text-gray-500">{config.unit}</span>
        </span>
      </div>
      
      <div style={{ height, width: '100%', minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                vertical={false}
              />
            )}
            
            <XAxis
              dataKey="index"
              hide
              domain={['dataMin', 'dataMax']}
            />
            
            <YAxis
              domain={config.domain}
              hide
              width={0}
            />
            
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                      <p className="text-sm font-medium" style={{ color: config.color }}>
                        {payload[0].value} {config.unit}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payload[0].payload.time}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            {/* Threshold reference lines */}
            {config.thresholds?.map((threshold, idx) => (
              <ReferenceLine
                key={idx}
                y={threshold.value}
                stroke={threshold.color}
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
            ))}
            
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Mini sparkline version for compact display
export const BiometricSparkline: React.FC<{
  metric: MetricType;
  width?: number;
  height?: number;
}> = ({ metric, width = 100, height = 30 }) => {
  const history = useBiometricStore(selectHistoryForChart);
  const config = metricConfig[metric];
  
  const data = useMemo(() => {
    return history.slice(-20).map((point, index) => ({
      index,
      value: point[metric],
    }));
  }, [history, metric]);
  
  return (
    <div style={{ width, height, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={config.color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BiometricChart;
