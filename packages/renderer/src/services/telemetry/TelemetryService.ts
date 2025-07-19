import type {
  TelemetryData,
  SimulatorEventHandler,
} from '../../types/telemetry';

class TelemetryService {
  private listeners: SimulatorEventHandler[] = [];
  private connected: boolean = false;

  constructor() {
    // We'll implement the actual simulator connections later
    this.initializeMockData();
  }

  private initializeMockData() {
    // For development, we'll use mock data
    setInterval(() => {
      if (!this.connected) return;

      const mockData: TelemetryData = {
        speed: Math.floor(Math.random() * 320),
        gear: Math.floor(Math.random() * 8),
        rpm: Math.floor(Math.random() * 12000),
        lapTime: '1:34.567',
        lastLap: '1:34.789',
        bestLap: '1:33.456',
        position: Math.floor(Math.random() * 20) + 1,
        fuel: 75 + Math.random() * 25,
        tyreWear: {
          frontLeft: 90 + Math.random() * 10,
          frontRight: 90 + Math.random() * 10,
          rearLeft: 90 + Math.random() * 10,
          rearRight: 90 + Math.random() * 10,
        },
        delta: '+0.234',
        drs: Math.random() > 0.5,
        ers: Math.random() * 100,
      };

      this.notifyListeners(mockData);
    }, 100); // Update every 100ms
  }

  public connect() {
    this.connected = true;
    // We'll implement actual simulator connection logic later
  }

  public disconnect() {
    this.connected = false;
  }

  public subscribe(handler: SimulatorEventHandler) {
    this.listeners.push(handler);
    return () => {
      this.listeners = this.listeners.filter((h) => h !== handler);
    };
  }

  private notifyListeners(data: TelemetryData) {
    this.listeners.forEach((handler) => handler(data));
  }
}

export const telemetryService = new TelemetryService();
