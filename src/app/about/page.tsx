// About Page - CrystalStim Product Overview

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Gem, 
  Brain, 
  Heart, 
  Zap, 
  Shield,
  Users,
  Sparkles,
  Activity,
  Vibrate,
  Thermometer,
  Volume2,
  Eye,
  ArrowRight,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  Waves,
  Flower2
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                <Gem className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">CrystalStim</h1>
                <p className="text-xs text-gray-500">Emotional Regulation Technology</p>
              </div>
            </Link>
            
            <Link 
              href="/"
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6">
              Passive Emotional Regulation
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              The First Predictive Emotional Support Wearable
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              CrystalStim is a smart crystal pendant that detects stress <em>before</em> you feel it 
              and automatically activates calming sensory feedback — no app, no buttons, no effort required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeIn}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem We Solve</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              For neurodivergent individuals and high-stress professionals, emotional overload often arrives without warning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Pain Points */}
            <motion.div 
              className="bg-red-50 rounded-2xl p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-red-800 mb-6 flex items-center gap-2">
                <XCircle className="w-6 h-6" />
                Current Reality
              </h3>
              <ul className="space-y-4">
                {[
                  "Stress signals go unnoticed until overload occurs",
                  "Emotional shutdown or meltdown in meetings/public settings",
                  "Existing tools (apps, exercises) require active effort",
                  "Screen-based solutions increase cognitive load",
                  "Long-term masking leads to burnout"
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-red-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Solution */}
            <motion.div 
              className="bg-teal-50 rounded-2xl p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-teal-800 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                With CrystalStim
              </h3>
              <ul className="space-y-4">
                {[
                  "Continuous physiological monitoring detects stress early",
                  "AI predicts overload before it happens",
                  "Automatic sensory intervention — zero effort required",
                  "No screens, no apps during stressful moments",
                  "Discreet jewelry form factor — no one knows"
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-teal-700">
                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How CrystalStim Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A continuous loop of sensing, analyzing, and responding — all happening invisibly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                icon: Activity,
                title: "Sense",
                description: "Embedded biosensors continuously monitor your heart rate variability (HRV), skin conductance (GSR), and other physiological markers.",
                color: "#10B981"
              },
              {
                step: 2,
                icon: Brain,
                title: "Analyze",
                description: "Our MEI (Machine Emotional Intelligence) AI processes biometric patterns in real-time to detect stress buildup before you consciously feel it.",
                color: "#8B5CF6"
              },
              {
                step: 3,
                icon: Zap,
                title: "Alert",
                description: "When stress exceeds your personalized threshold, the crystal's color subtly shifts and sensory feedback mechanisms activate.",
                color: "#F59E0B"
              },
              {
                step: 4,
                icon: Shield,
                title: "Stabilize",
                description: "Multi-modal sensory anchoring (vibration, warmth, light) helps regulate your nervous system automatically — averting meltdown.",
                color: "#EF4444"
              }
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <div 
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-white"
                  style={{ backgroundColor: item.color }}
                >
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Step {item.step}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Flow Diagram */}
          <motion.div 
            className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">The Intervention Loop</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="px-4 py-2 bg-gray-100 rounded-lg">Biometric Stress Detected</div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">AI Interpretation</div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg">Sensory Anchoring Triggered</div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg">Emotional Stabilization</div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">Meltdown Averted</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sensory Feedback Mechanisms */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeIn}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sensory Anchoring Mechanisms</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Multiple feedback modes work together to ground your nervous system without requiring conscious attention.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Lightbulb, name: "LED Color Feedback", desc: "Soft light pulses that shift from calming teal to alerting amber as stress rises", color: "#10B981" },
              { icon: Flower2, name: "Aromatherapy Release", desc: "Micro-dose calming scents (lavender, chamomile) released automatically from the pendant", color: "#A855F7" },
              { icon: Vibrate, name: "Haptic Vibration", desc: "Gentle rhythmic patterns that provide tactile grounding without being noticeable to others", color: "#8B5CF6" },
              { icon: Thermometer, name: "Temperature Modulation", desc: "Subtle warmth that provides comforting thermal feedback against the skin", color: "#F59E0B" },
              { icon: Volume2, name: "Audio Cue (Optional)", desc: "Quiet tones via Bluetooth that can guide breathing or signal intervention", color: "#EC4899" },
              { icon: Waves, name: "Breathing Guide", desc: "Visual pulsing rhythm that subconsciously guides slower, deeper breathing", color: "#06B6D4" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeIn}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Is CrystalStim For?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed with and for neurodivergent women, but beneficial for anyone experiencing chronic stress or sensory overload.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Neurodivergent Women", desc: "ADHD, autistic, and hypersensitive professionals who mask daily" },
              { icon: Brain, title: "High-Stress Professionals", desc: "Executives, healthcare workers, and those in demanding roles" },
              { icon: Heart, title: "Therapy & Clinics", desc: "Mental health professionals supporting clients with regulation" },
              { icon: Target, title: "Corporate Wellness", desc: "DEI programs supporting neurodiverse employees" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 mx-auto mb-4 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* End Goal / Vision */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our End Goal</h2>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              To create a world where emotional overload is no longer invisible — where stress is detected 
              and addressed <em>before</em> it derails your day, your meeting, or your mental health.
            </p>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-left max-w-2xl mx-auto">
              <p className="text-lg mb-4 font-medium">CrystalStim is fundamentally:</p>
              <blockquote className="text-2xl font-bold italic border-l-4 border-white/50 pl-6">
                "A passive emotional early-warning and stabilization wearable for neurodivergent nervous systems."
              </blockquote>
              <p className="mt-6 opacity-80">
                It converts invisible stress signals into real-time sensory stabilization — 
                discreetly, automatically, and without adding cognitive burden.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Unique Value */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" {...fadeIn}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes CrystalStim Different</h2>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="py-4 px-4 font-semibold text-gray-500">Meditation Apps</th>
                  <th className="py-4 px-4 font-semibold text-gray-500">Smartwatches</th>
                  <th className="py-4 px-4 font-semibold text-teal-600">CrystalStim</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ["Passive (no action needed)", "No", "No", "Yes"],
                  ["Real-time intervention", "No", "Alerts only", "Yes"],
                  ["Discreet jewelry form", "N/A", "No", "Yes"],
                  ["Multi-sensory feedback", "Audio only", "Vibration only", "6+ modalities"],
                  ["Designed for neurodivergent", "No", "No", "Yes"],
                  ["No screen during stress", "No", "No", "Yes"]
                ].map(([feature, apps, watch, crystal], idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{feature}</td>
                    <td className="py-3 px-4 text-gray-500">{apps}</td>
                    <td className="py-3 px-4 text-gray-500">{watch}</td>
                    <td className="py-3 px-4 text-teal-600 font-medium">{crystal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Experience the Prototype</h2>
          <p className="text-lg text-gray-600 mb-8">
            See how real-time biosensor monitoring and sensory feedback work together to detect and respond to stress.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Gem className="w-5 h-5" />
            Try Interactive Demo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            CrystalStim — Passive Emotional Regulation for Neurodivergent Individuals
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Built on sociolinguistic and neurodivergence research on masking, emotional fatigue, and stress anticipation.
          </p>
        </div>
      </footer>
    </div>
  );
}
