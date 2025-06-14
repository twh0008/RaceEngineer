import { useState, useEffect } from 'react';
import type { TelemetryData } from '../../types/telemetry';
import { telemetryService } from '../../services/telemetry/TelemetryService';

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
  const containerStyle = {
    position: 'fixed' as const,
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    pointerEvents: 'auto' as const,
    cursor: 'move',
    userSelect: 'none' as const,
    WebkitAppRegion: 'drag' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center'
  };
  const titleBarStyle = {
    height: '24px',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    borderRadius: '8px 8px 0 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    fontSize: '0.75rem',
    color: '#d1d5db'
  };
  const contentStyle = {
    maxWidth: '1024px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '280px 280px 280px', // Fixed column widths
    gap: '8px'
  };
  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #374151'
  };

  return (
    <div style={containerStyle}>      {/* Title bar */}
      <div style={titleBarStyle}>
        Race Engineer - Drag to move
      </div>

      <div style={contentStyle}>        {/* Speed and RPM */}
        <div style={cardStyle}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            minWidth: '200px', // Fixed width to prevent resizing
            textAlign: 'left'
          }}>
            {telemetry.speed} km/h
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginTop: '4px',
            minWidth: '200px', // Fixed width to prevent resizing
            textAlign: 'left'
          }}>
            {telemetry.rpm.toLocaleString()} RPM
          </div>
          <div style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            marginTop: '4px',
            minWidth: '200px', // Fixed width to prevent resizing
            textAlign: 'left'
          }}>
            Gear: {telemetry.gear}
          </div>
        </div>

        {/* Lap Times */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Current:</span>
              <span style={{ fontSize: '1.5rem', marginLeft: '8px' }}>{telemetry.lapTime}</span>
            </div>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Last:</span>
              <span style={{ fontSize: '1.25rem', marginLeft: '8px' }}>{telemetry.lastLap}</span>
            </div>
            <div>
              <span style={{ color: '#a855f7', fontSize: '0.875rem' }}>Best:</span>
              <span style={{ fontSize: '1.25rem', marginLeft: '8px' }}>{telemetry.bestLap}</span>
            </div>
          </div>
        </div>

        {/* Car Status */}
        <div style={cardStyle}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '4px' 
          }}>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Fuel:</span>
              <span style={{ fontSize: '1.125rem', marginLeft: '4px' }}>
                {telemetry.fuel.toFixed(1)}L
              </span>
            </div>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>ERS:</span>
              <span style={{ fontSize: '1.125rem', marginLeft: '4px' }}>
                {telemetry.ers.toFixed(1)}%
              </span>
            </div>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>DRS:</span>
              <span style={{ 
                fontSize: '1.125rem', 
                marginLeft: '4px',
                color: telemetry.drs ? '#10b981' : '#ef4444'
              }}>
                {telemetry.drs ? 'ON' : 'OFF'}
              </span>
            </div>
            <div>
              <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Pos:</span>
              <span style={{ fontSize: '1.125rem', marginLeft: '4px' }}>
                P{telemetry.position}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
