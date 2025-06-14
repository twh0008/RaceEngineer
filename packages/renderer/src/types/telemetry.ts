export interface TelemetryData {
  speed: number;
  gear: number;
  rpm: number;
  lapTime: string;
  lastLap: string;
  bestLap: string;
  position: number;
  fuel: number;
  tyreWear: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  delta: string;
  drs: boolean;
  ers: number;
}

export interface SimulatorState {
  isConnected: boolean;
  simulator: 'F1' | 'iRacing' | null;
  data: TelemetryData | null;
}

export type SimulatorEventHandler = (data: TelemetryData) => void;
