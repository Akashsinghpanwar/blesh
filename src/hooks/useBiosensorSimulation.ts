// Custom hook for managing biosensor simulation

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useBiometricStore } from '@/store/biometricStore';
import { getSimulator, resetSimulator } from '@/lib/sensorSimulator';
import { analyzeStress } from '@/lib/stressDetection';

interface UseBiosensorSimulationOptions {
  autoStart?: boolean;
  updateInterval?: number; // Base interval in ms (default: 500)
}

export const useBiosensorSimulation = (options: UseBiosensorSimulationOptions = {}) => {
  const { autoStart = false, updateInterval = 500 } = options;
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const simulatorRef = useRef(getSimulator());
  
  const {
    isRunning,
    simulationSpeed,
    setSimulationRunning,
    updateBiometrics,
    clearHistory,
    reset: resetStore,
  } = useBiometricStore();
  
  // Generate and update biometric data
  const tick = useCallback(() => {
    const simulator = simulatorRef.current;
    simulator.addNaturalVariation();
    
    const data = simulator.generateReading();
    const analysis = analyzeStress(data);
    
    updateBiometrics(data, analysis);
  }, [updateBiometrics]);
  
  // Start simulation
  const start = useCallback(() => {
    if (intervalRef.current) return;
    
    setSimulationRunning(true);
    
    // Initial tick
    tick();
    
    // Set up interval
    const interval = updateInterval / simulationSpeed;
    intervalRef.current = setInterval(tick, interval);
  }, [tick, updateInterval, simulationSpeed, setSimulationRunning]);
  
  // Stop simulation
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSimulationRunning(false);
  }, [setSimulationRunning]);
  
  // Toggle simulation
  const toggle = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);
  
  // Trigger stress event
  const triggerStressEvent = useCallback(() => {
    simulatorRef.current.triggerStressEvent();
  }, []);
  
  // Return to calm
  const returnToCalm = useCallback(() => {
    simulatorRef.current.returnToCalm();
  }, []);
  
  // Set stress level manually
  const setStressLevel = useCallback((level: number) => {
    simulatorRef.current.setStressLevel(level);
  }, []);
  
  // Reset everything
  const reset = useCallback(() => {
    stop();
    resetSimulator();
    simulatorRef.current = getSimulator();
    clearHistory();
    resetStore();
  }, [stop, clearHistory, resetStore]);
  
  // Update interval when speed changes
  useEffect(() => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      const interval = updateInterval / simulationSpeed;
      intervalRef.current = setInterval(tick, interval);
    }
  }, [simulationSpeed, updateInterval, isRunning, tick]);
  
  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoStart, start]);
  
  return {
    isRunning,
    start,
    stop,
    toggle,
    triggerStressEvent,
    returnToCalm,
    setStressLevel,
    reset,
  };
};
