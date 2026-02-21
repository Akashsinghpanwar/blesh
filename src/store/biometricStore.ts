// Zustand Store for Biometric State Management

import { create } from 'zustand';
import { BiometricData } from '@/lib/sensorSimulator';
import { StressAnalysis, StressLevel } from '@/lib/stressDetection';

export interface HistoricalDataPoint {
  timestamp: number;
  heartRate: number;
  hrv: number;
  gsr: number;
  skinTemp: number;
  stressScore: number;
}

interface BiometricStore {
  // Current readings
  currentData: BiometricData | null;
  stressAnalysis: StressAnalysis | null;
  
  // Historical data for charts (last 60 readings)
  history: HistoricalDataPoint[];
  maxHistoryLength: number;
  
  // Simulation state
  isRunning: boolean;
  simulationSpeed: number; // 1 = normal (500ms), 2 = fast (250ms), 0.5 = slow (1000ms)
  
  // Feedback state
  isFeedbackActive: boolean;
  feedbackIntensity: number;
  
  // Actions
  updateBiometrics: (data: BiometricData, analysis: StressAnalysis) => void;
  setSimulationRunning: (running: boolean) => void;
  setSimulationSpeed: (speed: number) => void;
  setFeedbackActive: (active: boolean) => void;
  clearHistory: () => void;
  reset: () => void;
}

const initialState = {
  currentData: null,
  stressAnalysis: null,
  history: [],
  maxHistoryLength: 60,
  isRunning: false,
  simulationSpeed: 1,
  isFeedbackActive: false,
  feedbackIntensity: 0,
};

export const useBiometricStore = create<BiometricStore>((set, get) => ({
  ...initialState,
  
  updateBiometrics: (data: BiometricData, analysis: StressAnalysis) => {
    const { history, maxHistoryLength } = get();
    
    const newDataPoint: HistoricalDataPoint = {
      timestamp: data.timestamp,
      heartRate: data.heartRate,
      hrv: data.hrv,
      gsr: data.gsr,
      skinTemp: data.skinTemp,
      stressScore: analysis.score,
    };
    
    // Keep only the last maxHistoryLength points
    const newHistory = [...history, newDataPoint].slice(-maxHistoryLength);
    
    set({
      currentData: data,
      stressAnalysis: analysis,
      history: newHistory,
      isFeedbackActive: analysis.shouldActivateFeedback,
      feedbackIntensity: analysis.feedbackIntensity,
    });
  },
  
  setSimulationRunning: (running: boolean) => {
    set({ isRunning: running });
  },
  
  setSimulationSpeed: (speed: number) => {
    set({ simulationSpeed: speed });
  },
  
  setFeedbackActive: (active: boolean) => {
    set({ isFeedbackActive: active });
  },
  
  clearHistory: () => {
    set({ history: [] });
  },
  
  reset: () => {
    set(initialState);
  },
}));

// Selectors for optimized re-renders
export const selectCurrentHeartRate = (state: BiometricStore) => 
  state.currentData?.heartRate ?? 0;

export const selectCurrentHRV = (state: BiometricStore) => 
  state.currentData?.hrv ?? 0;

export const selectCurrentGSR = (state: BiometricStore) => 
  state.currentData?.gsr ?? 0;

export const selectCurrentSkinTemp = (state: BiometricStore) => 
  state.currentData?.skinTemp ?? 0;

export const selectStressScore = (state: BiometricStore) => 
  state.stressAnalysis?.score ?? 0;

export const selectStressLevel = (state: BiometricStore): StressLevel => 
  state.stressAnalysis?.level ?? 'calm';

export const selectIsFeedbackActive = (state: BiometricStore) => 
  state.isFeedbackActive;

export const selectFeedbackIntensity = (state: BiometricStore) => 
  state.feedbackIntensity;

export const selectHistoryForChart = (state: BiometricStore) => 
  state.history;

export const selectIsRunning = (state: BiometricStore) => 
  state.isRunning;
