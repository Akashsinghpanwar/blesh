// Vital Card Component - Individual metric display card

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Droplets, Thermometer, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useBiometricStore, selectHistoryForChart } from '@/store/biometricStore';
import { BiometricSparkline } from './BiometricChart';

type VitalType = 'heartRate' | 'hrv' | 'gsr' | 'skinTemp';

interface VitalCardProps {
  type: VitalType;
  showSparkline?: boolean;
}

const vitalConfig: Record<VitalType, {
  label: string;
  icon: React.ElementType;
  unit: string;
  color: string;
  bgColor: string;
  normalRange: [number, number];
  format: (value: number) => string;
}> = {
  heartRate: {
    label: 'Heart Rate',
    icon: Heart,
    unit: 'BPM',
    color: '#EF4444',
    bgColor: '#FEF2F2',
    normalRange: [60, 100],
    format: (v) => Math.round(v).toString(),
  },
  hrv: {
    label: 'HRV',
    icon: Activity,
    unit: 'ms',
    color: '#10B981',
    bgColor: '#ECFDF5',
    normalRange: [50, 100],
    format: (v) => v.toFixed(1),
  },
  gsr: {
    label: 'Skin Response',
    icon: Droplets,
    unit: 'μS',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    normalRange: [2, 6],
    format: (v) => v.toFixed(2),
  },
  skinTemp: {
    label: 'Skin Temp',
    icon: Thermometer,
    unit: '°C',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    normalRange: [33, 35],
    format: (v) => v.toFixed(1),
  },
};

const getTrend = (history: number[]): 'up' | 'down' | 'stable' => {
  if (history.length < 5) return 'stable';
  
  const recent = history.slice(-5);
  const older = history.slice(-10, -5);
  
  if (older.length < 5) return 'stable';
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  const threshold = (recentAvg + olderAvg) / 2 * 0.05; // 5% change threshold
  
  if (diff > threshold) return 'up';
  if (diff < -threshold) return 'down';
  return 'stable';
};

const getStatus = (value: number, normalRange: [number, number]): 'normal' | 'warning' | 'alert' => {
  const [min, max] = normalRange;
  const margin = (max - min) * 0.2;
  
  if (value >= min && value <= max) return 'normal';
  if (value >= min - margin && value <= max + margin) return 'warning';
  return 'alert';
};

export const VitalCard: React.FC<VitalCardProps> = ({ type, showSparkline = true }) => {
  const history = useBiometricStore(selectHistoryForChart);
  const currentData = useBiometricStore(state => state.currentData);
  
  const config = vitalConfig[type];
  const Icon = config.icon;
  
  const value = currentData?.[type] ?? 0;
  const formattedValue = config.format(value);
  
  const trend = useMemo(() => {
    const values = history.map(h => h[type]);
    return getTrend(values);
  }, [history, type]);
  
  const status = useMemo(() => getStatus(value, config.normalRange), [value, config.normalRange]);
  
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = type === 'hrv' 
    ? (trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#9CA3AF')
    : (trend === 'up' ? '#EF4444' : trend === 'down' ? '#10B981' : '#9CA3AF');
  
  return (
    <motion.div
      className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: config.bgColor }}
        >
          <Icon size={20} style={{ color: config.color }} />
        </div>
        
        <div className="flex items-center gap-1" style={{ color: trendColor }}>
          <TrendIcon size={16} />
          <span className="text-xs font-medium capitalize">{trend}</span>
        </div>
      </div>
      
      <div className="mb-2">
        <span className="text-sm text-gray-500">{config.label}</span>
        <div className="flex items-baseline gap-1">
          <motion.span
            className="text-2xl font-bold text-gray-900"
            key={formattedValue}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {formattedValue}
          </motion.span>
          <span className="text-sm text-gray-400">{config.unit}</span>
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div 
          className={`w-2 h-2 rounded-full ${
            status === 'normal' ? 'bg-green-400' :
            status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
          }`}
        />
        <span className="text-xs text-gray-400 capitalize">
          {status === 'normal' ? 'Normal range' : 
           status === 'warning' ? 'Slightly elevated' : 'Outside range'}
        </span>
      </div>
      
      {/* Sparkline */}
      {showSparkline && (
        <div className="pt-2 border-t border-gray-100">
          <BiometricSparkline metric={type} width={140} height={35} />
        </div>
      )}
    </motion.div>
  );
};

// Compact horizontal version
export const VitalCardCompact: React.FC<{ type: VitalType }> = ({ type }) => {
  const currentData = useBiometricStore(state => state.currentData);
  const config = vitalConfig[type];
  const Icon = config.icon;
  
  const value = currentData?.[type] ?? 0;
  const formattedValue = config.format(value);
  
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
      <div 
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: config.bgColor }}
      >
        <Icon size={16} style={{ color: config.color }} />
      </div>
      <div className="flex-1">
        <span className="text-xs text-gray-500">{config.label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-gray-900">{formattedValue}</span>
          <span className="text-xs text-gray-400">{config.unit}</span>
        </div>
      </div>
    </div>
  );
};

export default VitalCard;
