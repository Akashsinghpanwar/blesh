// Stress Indicator Component - Circular gauge showing stress level

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBiometricStore, selectStressScore, selectStressLevel } from '@/store/biometricStore';
import { getStressConfig, StressLevel } from '@/lib/stressDetection';

interface StressIndicatorProps {
  size?: number;
  showLabel?: boolean;
}

export const StressIndicator: React.FC<StressIndicatorProps> = ({
  size = 200,
  showLabel = true,
}) => {
  const stressScore = useBiometricStore(selectStressScore);
  const stressLevel = useBiometricStore(selectStressLevel);
  const config = useMemo(() => getStressConfig(stressLevel), [stressLevel]);
  
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke offset for progress (270 degrees arc)
  const arcLength = circumference * 0.75; // 270 degrees
  const progress = stressScore / 100;
  const strokeDashoffset = arcLength - (progress * arcLength);
  
  // Rotation to start from bottom-left
  const rotation = 135; // Start from 135 degrees
  
  return (
    <div className="relative inline-flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="stressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#stressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          
          {/* Colored overlay based on current level */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth={strokeWidth * 0.5}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeOpacity={0.5}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </svg>
        
        {/* Center content */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: `rotate(0deg)` }}
        >
          <motion.span
            className="text-4xl font-bold"
            style={{ color: config.color }}
            animate={{ color: config.color }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(stressScore)}
          </motion.span>
          <span className="text-sm text-gray-500 mt-1">Stress Score</span>
        </div>
        
        {/* Tick marks */}
        <div className="absolute inset-0">
          {[0, 30, 55, 75, 100].map((tick) => {
            const angle = (tick / 100) * 270 + 135;
            const tickRadius = radius + strokeWidth / 2 + 8;
            const x = Math.round((size / 2 + tickRadius * Math.cos((angle * Math.PI) / 180)) * 100) / 100;
            const y = Math.round((size / 2 + tickRadius * Math.sin((angle * Math.PI) / 180)) * 100) / 100;
            
            return (
              <span
                key={tick}
                className="absolute text-xs text-gray-400 font-medium"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                suppressHydrationWarning
              >
                {tick}
              </span>
            );
          })}
        </div>
      </div>
      
      {/* Label */}
      {showLabel && (
        <motion.div
          className="mt-4 px-4 py-2 rounded-full font-medium text-white"
          style={{ backgroundColor: config.color }}
          animate={{ backgroundColor: config.color }}
          transition={{ duration: 0.3 }}
        >
          {config.label}
        </motion.div>
      )}
    </div>
  );
};

// Compact version for smaller displays
export const StressIndicatorCompact: React.FC<{ size?: number }> = ({ size = 80 }) => {
  const stressScore = useBiometricStore(selectStressScore);
  const stressLevel = useBiometricStore(selectStressLevel);
  const config = useMemo(() => getStressConfig(stressLevel), [stressLevel]);
  
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = stressScore / 100;
  const strokeDashoffset = circumference - (progress * circumference);
  
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={config.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      <span 
        className="absolute text-lg font-bold"
        style={{ color: config.color }}
      >
        {Math.round(stressScore)}
      </span>
    </div>
  );
};

export default StressIndicator;
