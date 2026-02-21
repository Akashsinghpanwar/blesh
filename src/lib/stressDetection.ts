// Stress Detection Algorithm - Calculates stress score from biometric data

import { BiometricData } from './sensorSimulator';

export type StressLevel = 'calm' | 'mild' | 'elevated' | 'overload';

export interface StressAnalysis {
  score: number;          // 0-100
  level: StressLevel;
  label: string;
  color: string;
  shouldActivateFeedback: boolean;
  feedbackIntensity: number;  // 0-1
}

// Normalize a value to 0-100 scale
const normalize = (value: number, min: number, max: number): number => {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};

// Calculate stress score from biometric data
export const calculateStressScore = (data: BiometricData): number => {
  // Normalize each metric
  
  // HRV: Lower is worse (more stress)
  // Normal: 50-100ms, Stressed: 15-50ms
  const normalizedHRV = normalize(data.hrv, 15, 100);
  const hrvStressContribution = 100 - normalizedHRV; // Invert: low HRV = high stress
  
  // Heart Rate: Higher is worse
  // Normal: 55-85 BPM, Stressed: 85-140+ BPM
  const normalizedHR = normalize(data.heartRate, 55, 140);
  
  // GSR: Higher is worse (more arousal/stress)
  // Normal: 1-5 µS, Stressed: 5-18 µS
  const normalizedGSR = normalize(data.gsr, 1, 18);
  
  // Skin Temperature: Lower can indicate stress (peripheral vasoconstriction)
  // Normal: 33-35°C, Stressed: 31-33°C
  const normalizedTemp = normalize(data.skinTemp, 31, 35);
  const tempStressContribution = 100 - normalizedTemp;
  
  // Weighted stress calculation
  // HRV is the most reliable stress indicator
  const stressScore = 
    hrvStressContribution * 0.40 +    // 40% weight - most reliable
    normalizedGSR * 0.30 +             // 30% weight - arousal indicator
    normalizedHR * 0.20 +              // 20% weight - physiological response
    tempStressContribution * 0.10;     // 10% weight - supplementary
  
  return Math.round(stressScore * 10) / 10;
};

// Get stress level category
export const getStressLevel = (score: number): StressLevel => {
  if (score < 30) return 'calm';
  if (score < 55) return 'mild';
  if (score < 75) return 'elevated';
  return 'overload';
};

// Get stress level configuration
export const getStressConfig = (level: StressLevel): {
  label: string;
  color: string;
  glowColor: string;
  description: string;
} => {
  switch (level) {
    case 'calm':
      return {
        label: 'Calm',
        color: '#10B981',      // Emerald green
        glowColor: '#34D399',
        description: 'Relaxed state - no intervention needed'
      };
    case 'mild':
      return {
        label: 'Mild',
        color: '#F59E0B',      // Amber
        glowColor: '#FBBF24',
        description: 'Slightly elevated - monitoring'
      };
    case 'elevated':
      return {
        label: 'Elevated',
        color: '#F97316',      // Orange
        glowColor: '#FB923C',
        description: 'Stress rising - sensory anchoring active'
      };
    case 'overload':
      return {
        label: 'Overload',
        color: '#EF4444',      // Red
        glowColor: '#F87171',
        description: 'High stress - full intervention'
      };
  }
};

// Full stress analysis
export const analyzeStress = (data: BiometricData): StressAnalysis => {
  const score = calculateStressScore(data);
  const level = getStressLevel(score);
  const config = getStressConfig(level);
  
  // Determine if feedback should activate (threshold at 55)
  const shouldActivateFeedback = score >= 55;
  
  // Calculate feedback intensity (0-1 scale, ramps up from 55-100)
  const feedbackIntensity = shouldActivateFeedback 
    ? Math.min(1, (score - 55) / 45) 
    : 0;
  
  return {
    score,
    level,
    label: config.label,
    color: config.color,
    shouldActivateFeedback,
    feedbackIntensity,
  };
};

// Get trend from historical data
export const analyzeTrend = (
  history: number[],
  windowSize: number = 10
): 'improving' | 'stable' | 'worsening' => {
  if (history.length < windowSize) return 'stable';
  
  const recent = history.slice(-windowSize);
  const older = history.slice(-windowSize * 2, -windowSize);
  
  if (older.length < windowSize) return 'stable';
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 5) return 'worsening';
  if (diff < -5) return 'improving';
  return 'stable';
};

// Predict likelihood of overload based on trajectory
export const predictOverloadRisk = (
  currentScore: number,
  trend: 'improving' | 'stable' | 'worsening'
): { risk: 'low' | 'medium' | 'high'; minutes: number | null } => {
  if (currentScore >= 80) {
    return { risk: 'high', minutes: 0 };
  }
  
  if (trend === 'worsening') {
    if (currentScore >= 60) return { risk: 'high', minutes: 2 };
    if (currentScore >= 40) return { risk: 'medium', minutes: 5 };
  }
  
  if (trend === 'stable' && currentScore >= 50) {
    return { risk: 'medium', minutes: 10 };
  }
  
  return { risk: 'low', minutes: null };
};
