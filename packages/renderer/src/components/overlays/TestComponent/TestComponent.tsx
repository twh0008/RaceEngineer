import { useState, useEffect } from 'react';
import type { TelemetryData } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetry/TelemetryService';
import './TestComponent.css';

export const TestComponent = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);

  useEffect(() => {
    telemetryService.connect();
    const unsubscribe = telemetryService.subscribe(setTelemetry);
    return () => {
      unsubscribe();
      telemetryService.disconnect();
    };
  }, []);

  if (!telemetry) return null;

  return (
    <div className="test-component">
      {/* Title bar */}
      <div className="title-bar">
        Race Engineer - Drag to move
      </div>

      <div className="content">
        {/* Speed and RPM */}
        <div className="card">
          <div className="speed">
            {telemetry.speed} km/h
          </div>
          <div className="rpm">
            {telemetry.rpm.toLocaleString()} RPM
          </div>
          <div className="gear">
            Gear: {telemetry.gear}
          </div>
        </div>

        {/* Lap Times */}
        <div className="card">
          <div className="lap-times">
            <div>
              <span className="lap-label">Current:</span>
              <span className="current-lap">{telemetry.lapTime}</span>
            </div>
            <div>
              <span className="lap-label">Last:</span>
              <span className="last-lap">{telemetry.lastLap}</span>
            </div>
            <div>
              <span className="best-label">Best:</span>
              <span className="best-lap">{telemetry.bestLap}</span>
            </div>
          </div>
        </div>

        {/* Car Status */}
        <div className="card">
          <div className="status-grid">
            <div>
              <span className="status-label">Fuel:</span>
              <span className="status-value">
                {telemetry.fuel.toFixed(1)}L
              </span>
            </div>
            <div>
              <span className="status-label">ERS:</span>
              <span className="status-value">
                {telemetry.ers.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="status-label">DRS:</span>
              <span className={`status-value ${
                telemetry.drs ? 'drs--on' : 'drs--off'
              }`}>
                {telemetry.drs ? 'ON' : 'OFF'}
              </span>
            </div>
            <div>
              <span className="status-label">Pos:</span>
              <span className="status-value">
                P{telemetry.position}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
