// Biosensor Data Simulator - Generates realistic HRV, GSR, and Heart Rate data

export interface BiometricData {
  timestamp: number;
  heartRate: number;      // BPM (60-180)
  hrv: number;            // RMSSD in ms (20-100, lower = more stress)
  gsr: number;            // Galvanic Skin Response in microSiemens (1-20)
  skinTemp: number;       // Temperature in Celsius (32-37)
}

export interface SimulatorState {
  baseHeartRate: number;
  baseHRV: number;
  baseGSR: number;
  baseSkinTemp: number;
  stressLevel: number;    // 0-100, affects all metrics
  isStressEvent: boolean;
}

// Add realistic noise to a value
const addNoise = (value: number, noiseRange: number): number => {
  return value + (Math.random() - 0.5) * 2 * noiseRange;
};

// Smoothly interpolate between values
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

// Clamp value between min and max
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export class BiosensorSimulator {
  private state: SimulatorState;
  private targetStressLevel: number;
  
  constructor() {
    this.state = {
      baseHeartRate: 72,
      baseHRV: 65,
      baseGSR: 4,
      baseSkinTemp: 33.5,
      stressLevel: 20,
      isStressEvent: false,
    };
    this.targetStressLevel = 20;
  }

  // Trigger a stress event
  triggerStressEvent(): void {
    this.state.isStressEvent = true;
    this.targetStressLevel = 85 + Math.random() * 15; // 85-100
  }

  // Return to calm state
  returnToCalm(): void {
    this.state.isStressEvent = false;
    this.targetStressLevel = 15 + Math.random() * 15; // 15-30
  }

  // Set stress level directly (for slider control)
  setStressLevel(level: number): void {
    this.targetStressLevel = clamp(level, 0, 100);
  }

  // Generate next data point
  generateReading(): BiometricData {
    // Smoothly transition stress level
    const transitionSpeed = this.state.isStressEvent ? 0.15 : 0.08;
    this.state.stressLevel = lerp(
      this.state.stressLevel,
      this.targetStressLevel,
      transitionSpeed
    );

    const stress = this.state.stressLevel / 100;

    // Heart Rate: increases with stress (60-100 normal, up to 140+ stress)
    const targetHR = 65 + stress * 55;
    this.state.baseHeartRate = lerp(this.state.baseHeartRate, targetHR, 0.1);
    const heartRate = clamp(
      addNoise(this.state.baseHeartRate, 3),
      55,
      160
    );

    // HRV: decreases with stress (80ms relaxed, down to 25ms stressed)
    const targetHRV = 85 - stress * 60;
    this.state.baseHRV = lerp(this.state.baseHRV, targetHRV, 0.08);
    const hrv = clamp(
      addNoise(this.state.baseHRV, 5),
      15,
      100
    );

    // GSR: increases with stress/arousal (2-4 normal, up to 15+ stressed)
    const targetGSR = 3 + stress * 12;
    this.state.baseGSR = lerp(this.state.baseGSR, targetGSR, 0.12);
    const gsr = clamp(
      addNoise(this.state.baseGSR, 0.5),
      1,
      20
    );

    // Skin Temperature: slightly decreases with stress (peripheral vasoconstriction)
    const targetTemp = 34 - stress * 2;
    this.state.baseSkinTemp = lerp(this.state.baseSkinTemp, targetTemp, 0.05);
    const skinTemp = clamp(
      addNoise(this.state.baseSkinTemp, 0.2),
      30,
      37
    );

    return {
      timestamp: Date.now(),
      heartRate: Math.round(heartRate),
      hrv: Math.round(hrv * 10) / 10,
      gsr: Math.round(gsr * 100) / 100,
      skinTemp: Math.round(skinTemp * 10) / 10,
    };
  }

  // Get current stress level
  getStressLevel(): number {
    return this.state.stressLevel;
  }

  // Check if stress event is active
  isStressEventActive(): boolean {
    return this.state.isStressEvent;
  }

  // Add random fluctuation (natural variability)
  addNaturalVariation(): void {
    // Occasional small random shifts in baseline stress
    if (Math.random() < 0.1) {
      const variation = (Math.random() - 0.5) * 10;
      this.targetStressLevel = clamp(
        this.targetStressLevel + variation,
        this.state.isStressEvent ? 60 : 10,
        this.state.isStressEvent ? 100 : 50
      );
    }
  }
}

// Singleton instance
let simulatorInstance: BiosensorSimulator | null = null;

export const getSimulator = (): BiosensorSimulator => {
  if (!simulatorInstance) {
    simulatorInstance = new BiosensorSimulator();
  }
  return simulatorInstance;
};

export const resetSimulator = (): void => {
  simulatorInstance = new BiosensorSimulator();
};
