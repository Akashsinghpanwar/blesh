// Sensory Feedback Panel - Shows active feedback mechanisms

'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Vibrate, 
  Thermometer, 
  Volume2,
  Hand,
  Waves,
  Flower2
} from 'lucide-react';
import { useBiometricStore, selectIsFeedbackActive, selectFeedbackIntensity, selectStressLevel } from '@/store/biometricStore';
import { getStressConfig } from '@/lib/stressDetection';

interface FeedbackMode {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  activeAt: number; // Intensity threshold (0-1)
  color: string;
}

const feedbackModes: FeedbackMode[] = [
  {
    id: 'led',
    name: 'LED Glow',
    icon: Lightbulb,
    description: 'Calming color pulse',
    activeAt: 0,
    color: '#10B981',
  },
  {
    id: 'scent',
    name: 'Calming Scent',
    icon: Flower2,
    description: 'Lavender/chamomile micro-release',
    activeAt: 0.15,
    color: '#A855F7',
  },
  {
    id: 'haptic',
    name: 'Gentle Vibration',
    icon: Vibrate,
    description: 'Rhythmic haptic pattern',
    activeAt: 0.2,
    color: '#8B5CF6',
  },
  {
    id: 'breathing',
    name: 'Breath Guide',
    icon: Waves,
    description: 'Visual breathing rhythm',
    activeAt: 0.3,
    color: '#06B6D4',
  },
  {
    id: 'thermal',
    name: 'Warmth',
    icon: Thermometer,
    description: 'Subtle temperature shift',
    activeAt: 0.4,
    color: '#F59E0B',
  },
  {
    id: 'grounding',
    name: 'Touch Grounding',
    icon: Hand,
    description: 'Tactile anchor point',
    activeAt: 0.5,
    color: '#6366F1',
  },
  {
    id: 'sound',
    name: 'Audio Cue',
    icon: Volume2,
    description: 'Optional calming tone',
    activeAt: 0.7,
    color: '#EC4899',
  },
];

const FeedbackModeCard: React.FC<{
  mode: FeedbackMode;
  isActive: boolean;
  intensity: number;
}> = ({ mode, isActive, intensity }) => {
  const Icon = mode.icon;
  const localIntensity = isActive ? Math.min(1, (intensity - mode.activeAt) / (1 - mode.activeAt)) : 0;
  
  return (
    <motion.div
      className={`relative p-3 rounded-xl border transition-all ${
        isActive 
          ? 'bg-white shadow-lg border-gray-200' 
          : 'bg-gray-50 border-gray-100'
      }`}
      animate={{
        scale: isActive ? 1 : 0.98,
        opacity: isActive ? 1 : 0.6,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        {/* Icon with glow effect */}
        <div className="relative">
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: isActive ? mode.color + '20' : '#F3F4F6' }}
            animate={{
              backgroundColor: isActive ? mode.color + '30' : '#F3F4F6',
            }}
          >
            <Icon 
              size={20} 
              style={{ color: isActive ? mode.color : '#9CA3AF' }}
            />
          </motion.div>
          
          {/* Pulsing indicator when active */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: mode.color }}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                exit={{ scale: 1, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
              {mode.name}
            </span>
            {isActive && (
              <motion.span
                className="text-xs px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: mode.color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                Active
              </motion.span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">{mode.description}</p>
        </div>
      </div>
      
      {/* Intensity bar */}
      {isActive && (
        <motion.div
          className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: mode.color }}
            initial={{ width: 0 }}
            animate={{ width: `${localIntensity * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export const SensoryFeedback: React.FC = () => {
  const isFeedbackActive = useBiometricStore(selectIsFeedbackActive);
  const feedbackIntensity = useBiometricStore(selectFeedbackIntensity);
  const stressLevel = useBiometricStore(selectStressLevel);
  const stressConfig = useMemo(() => getStressConfig(stressLevel), [stressLevel]);
  
  const activeModes = useMemo(() => {
    if (!isFeedbackActive) return [];
    return feedbackModes.filter(mode => feedbackIntensity >= mode.activeAt);
  }, [isFeedbackActive, feedbackIntensity]);
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Sensory Anchoring</h3>
        <AnimatePresence>
          {isFeedbackActive && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: stressConfig.color }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-white"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Intervening
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Status message */}
      <p className="text-sm text-gray-500">
        {isFeedbackActive 
          ? `${activeModes.length} feedback mechanism${activeModes.length !== 1 ? 's' : ''} active`
          : 'All systems on standby - monitoring biometrics'
        }
      </p>
      
      {/* Feedback modes grid */}
      <div className="grid grid-cols-2 gap-3">
        {feedbackModes.map(mode => (
          <FeedbackModeCard
            key={mode.id}
            mode={mode}
            isActive={isFeedbackActive && feedbackIntensity >= mode.activeAt}
            intensity={feedbackIntensity}
          />
        ))}
      </div>
      
      {/* Overall intensity indicator */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Intervention Intensity</span>
          <span className="text-sm font-bold" style={{ color: isFeedbackActive ? stressConfig.color : '#9CA3AF' }}>
            {Math.round(feedbackIntensity * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ 
              backgroundColor: isFeedbackActive ? stressConfig.color : '#D1D5DB',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${feedbackIntensity * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default SensoryFeedback;
