import { useState, useEffect } from 'react';
import type { TelemetryData } from '../../types/telemetry';
import { telemetryService } from '../../services/telemetry/TelemetryService';
import './styles/TestComponent.css';

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
      <div className="test-component__title-bar">
        Race Engineer - Drag to move
      </div>

      <div className="test-component__content">
        {/* Speed and RPM */}
        <div className="test-component__card">
          <div className="test-component__speed">{telemetry.speed} km/h</div>
          <div className="test-component__rpm">
            {telemetry.rpm.toLocaleString()} RPM
          </div>
          <div className="test-component__gear">Gear: {telemetry.gear}</div>
        </div>

        {/* Lap Times */}
        <div className="test-component__card">
          <div className="test-component__lap-times">
            <div>
              <span className="test-component__lap-label">Current:</span>
              <span className="test-component__current-lap">
                {telemetry.lapTime}
              </span>
            </div>
            <div>
              <span className="test-component__lap-label">Last:</span>
              <span className="test-component__last-lap">
                {telemetry.lastLap}
              </span>
            </div>
            <div>
              <span className="test-component__best-label">Best:</span>
              <span className="test-component__best-lap">
                {telemetry.bestLap}
              </span>
            </div>
          </div>
        </div>

        {/* Car Status */}
        <div className="test-component__card">
          <div className="test-component__status-grid">
            <div>
              <span className="test-component__status-label">Fuel:</span>
              <span className="test-component__status-value">
                {telemetry.fuel.toFixed(1)}L
              </span>
            </div>
            <div>
              <span className="test-component__status-label">ERS:</span>
              <span className="test-component__status-value">
                {telemetry.ers.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="test-component__status-label">DRS:</span>
              <span
                className={`test-component__status-value ${
                  telemetry.drs
                    ? 'test-component__drs--on'
                    : 'test-component__drs--off'
                }`}
              >
                {telemetry.drs ? 'ON' : 'OFF'}
              </span>
            </div>
            <div>
              <span className="test-component__status-label">Pos:</span>
              <span className="test-component__status-value">
                P{telemetry.position}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
