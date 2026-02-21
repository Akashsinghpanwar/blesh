// Main Dashboard Page - CrystalStim Prototype

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Heart,
  Gem,
  Activity
} from 'lucide-react';
import { CrystalPendant } from '@/components/CrystalPendant';
import { StressIndicator } from '@/components/StressIndicator';
import { SensoryFeedback } from '@/components/SensoryFeedback';
import { BiometricChart } from '@/components/BiometricChart';
import { VitalCard } from '@/components/VitalCard';
import { useBiosensorSimulation } from '@/hooks/useBiosensorSimulation';
import { useBiometricStore, selectStressLevel, selectIsFeedbackActive } from '@/store/biometricStore';
import { getStressConfig } from '@/lib/stressDetection';

export default function Dashboard() {
  const {
    isRunning,
    start,
    stop,
    toggle,
    triggerStressEvent,
    returnToCalm,
    reset,
  } = useBiosensorSimulation();
  
  const stressLevel = useBiometricStore(selectStressLevel);
  const isFeedbackActive = useBiometricStore(selectIsFeedbackActive);
  const stressConfig = getStressConfig(stressLevel);
  
  // Auto-start simulation on mount
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">CrystalStim</h1>
                <p className="text-xs text-gray-500">Emotional Regulation Prototype</p>
              </div>
            </div>
            
            {/* Live indicator */}
            <div className="flex items-center gap-4">
              <Link 
                href="/about"
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
              >
                About
              </Link>
              
              <div className="flex items-center gap-2">
                <motion.div
                  className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-400'}`}
                  animate={isRunning ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm text-gray-600">
                  {isRunning ? 'Live Monitoring' : 'Paused'}
                </span>
              </div>
              
              {isFeedbackActive && (
                <motion.div
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: stressConfig.color }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Feedback Active
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Crystal Pendant & Controls */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Crystal Card */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Crystal Pendant</h2>
              <CrystalPendant size={260} />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Current State: <span className="font-medium" style={{ color: stressConfig.color }}>{stressConfig.label}</span>
                </p>
              </div>
            </motion.div>
            
            {/* Simulation Controls */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Simulation Controls</h3>
              
              <div className="space-y-3">
                {/* Play/Pause */}
                <button
                  onClick={toggle}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    isRunning 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  {isRunning ? <Pause size={18} /> : <Play size={18} />}
                  {isRunning ? 'Pause Simulation' : 'Start Simulation'}
                </button>
                
                {/* Trigger Stress */}
                <button
                  onClick={triggerStressEvent}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                >
                  <Zap size={18} />
                  Trigger Stress Event
                </button>
                
                {/* Return to Calm */}
                <button
                  onClick={returnToCalm}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-teal-100 text-teal-700 hover:bg-teal-200 transition-all"
                >
                  <Heart size={18} />
                  Return to Calm
                </button>
                
                {/* Reset */}
                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  <RotateCcw size={18} />
                  Reset All
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* Center Column - Stress Indicator & Feedback */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Stress Gauge */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Stress Analysis</h2>
              <StressIndicator size={220} />
            </motion.div>
            
            {/* Sensory Feedback Panel */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SensoryFeedback />
            </motion.div>
          </div>
          
          {/* Right Column - Biometric Data */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Vital Cards */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <VitalCard type="heartRate" />
              <VitalCard type="hrv" />
              <VitalCard type="gsr" />
              <VitalCard type="skinTemp" />
            </motion.div>
            
            {/* Charts */}
            <motion.div
              className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Real-Time Biometrics</h3>
              </div>
              
              <BiometricChart metric="heartRate" height={100} />
              <BiometricChart metric="hrv" height={100} />
              <BiometricChart metric="gsr" height={100} />
              <BiometricChart metric="stressScore" height={100} />
            </motion.div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <motion.div
          className="mt-12 bg-white rounded-3xl shadow-lg border border-gray-100 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How CrystalStim Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: 'Sense',
                description: 'Biosensors continuously monitor HRV, skin response, and physiological markers',
                color: '#10B981',
              },
              {
                step: 2,
                title: 'Analyze',
                description: 'AI processes biometric patterns to detect stress buildup before overload',
                color: '#8B5CF6',
              },
              {
                step: 3,
                title: 'Alert',
                description: 'Crystal changes color and activates subtle sensory feedback',
                color: '#F59E0B',
              },
              {
                step: 4,
                title: 'Stabilize',
                description: 'Multi-modal anchoring helps regulate the nervous system automatically',
                color: '#EF4444',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: item.color }}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            CrystalStim Prototype - Passive Emotional Regulation for Neurodivergent Individuals
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This is a simulation demonstrating the concept. Real device would include physical biosensors.
          </p>
        </div>
      </footer>
    </div>
  );
}
