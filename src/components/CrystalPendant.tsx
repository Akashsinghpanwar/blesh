// Crystal Pendant Component - Animated crystal with stress-responsive glow

'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBiometricStore, selectStressLevel, selectFeedbackIntensity, selectIsFeedbackActive } from '@/store/biometricStore';
import { getStressConfig, StressLevel } from '@/lib/stressDetection';

interface CrystalPendantProps {
  size?: number;
}

const getAnimationConfig = (level: StressLevel, feedbackActive: boolean) => {
  const baseConfig = {
    calm: {
      pulseSpeed: 4,
      glowIntensity: 0.4,
      breatheScale: 1.02,
    },
    mild: {
      pulseSpeed: 3,
      glowIntensity: 0.5,
      breatheScale: 1.03,
    },
    elevated: {
      pulseSpeed: 2,
      glowIntensity: 0.7,
      breatheScale: 1.04,
    },
    overload: {
      pulseSpeed: 0.8,
      glowIntensity: 1,
      breatheScale: 1.06,
    },
  };
  
  return baseConfig[level];
};

export const CrystalPendant: React.FC<CrystalPendantProps> = ({ size = 280 }) => {
  const stressLevel = useBiometricStore(selectStressLevel);
  const feedbackIntensity = useBiometricStore(selectFeedbackIntensity);
  const isFeedbackActive = useBiometricStore(selectIsFeedbackActive);
  
  const config = useMemo(() => getStressConfig(stressLevel), [stressLevel]);
  const animConfig = useMemo(
    () => getAnimationConfig(stressLevel, isFeedbackActive),
    [stressLevel, isFeedbackActive]
  );
  
  const glowSize = size * 0.6;
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.95,
          height: size * 0.95,
          background: `radial-gradient(circle, ${config.glowColor}20 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, animConfig.breatheScale, 1],
          opacity: [0.3, animConfig.glowIntensity * 0.6, 0.3],
        }}
        transition={{
          duration: animConfig.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Inner glow */}
      <motion.div
        className="absolute rounded-full blur-xl"
        style={{
          width: glowSize,
          height: glowSize,
          backgroundColor: config.color,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, animConfig.glowIntensity, 0.4],
        }}
        transition={{
          duration: animConfig.pulseSpeed * 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Crystal shape */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: [1, animConfig.breatheScale * 0.98, 1],
        }}
        transition={{
          duration: animConfig.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          width={size * 0.5}
          height={size * 0.65}
          viewBox="0 0 100 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crystal body with gradient */}
          <defs>
            <linearGradient id="crystalGradient" x1="50%" y1="0%" x2="50%" y2="100%">
              <motion.stop
                offset="0%"
                animate={{ stopColor: config.glowColor }}
                transition={{ duration: 0.5 }}
              />
              <motion.stop
                offset="50%"
                animate={{ stopColor: config.color }}
                transition={{ duration: 0.5 }}
              />
              <motion.stop
                offset="100%"
                animate={{ stopColor: config.color + '80' }}
                transition={{ duration: 0.5 }}
              />
            </linearGradient>
            
            <linearGradient id="crystalHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="50%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            
            <filter id="crystalGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Main crystal shape */}
          <motion.path
            d="M50 0 L85 35 L75 90 L50 130 L25 90 L15 35 Z"
            fill="url(#crystalGradient)"
            filter="url(#crystalGlow)"
            animate={{
              fillOpacity: [0.85, 0.95, 0.85],
            }}
            transition={{
              duration: animConfig.pulseSpeed,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Crystal facets */}
          <path
            d="M50 0 L50 130 M15 35 L85 35 M25 90 L75 90"
            stroke="white"
            strokeOpacity="0.3"
            strokeWidth="0.5"
          />
          
          {/* Left facet */}
          <path
            d="M50 0 L15 35 L25 90 L50 130"
            fill="url(#crystalHighlight)"
            fillOpacity="0.4"
          />
          
          {/* Center highlight */}
          <ellipse
            cx="40"
            cy="40"
            rx="8"
            ry="12"
            fill="white"
            fillOpacity="0.3"
            transform="rotate(-15 40 40)"
          />
        </svg>
      </motion.div>
      
      {/* Feedback active indicator - pulsing ring */}
      <AnimatePresence>
        {isFeedbackActive && (
          <motion.div
            className="absolute rounded-full border-2"
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderColor: config.color,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.85, 1.1, 0.85],
              opacity: [0.8, 0.2, 0.8],
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Overload flash effect */}
      <AnimatePresence>
        {stressLevel === 'overload' && (
          <motion.div
            className="absolute rounded-full bg-white"
            style={{
              width: size * 0.4,
              height: size * 0.4,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Chain attachment point */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ marginTop: size * 0.05 }}
      >
        <motion.div
          className="w-4 h-4 rounded-full border-2 border-gray-400"
          style={{ backgroundColor: config.glowColor + '40' }}
          animate={{ borderColor: config.color }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default CrystalPendant;
