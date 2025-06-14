import { useState, useEffect } from 'react';

interface InputData {
  throttle: number;
  brake: number;
  steering: number;
  clutch: number;
}

export const InputTelemetry = () => {
  const [inputs, setInputs] = useState<InputData>({
    throttle: 0,
    brake: 0,
    steering: 0,
    clutch: 0
  });

  useEffect(() => {
    // Mock input data that changes over time
    const interval = setInterval(() => {
      setInputs({
        throttle: Math.random() * 100,
        brake: Math.random() * 100,
        steering: (Math.random() - 0.5) * 100,
        clutch: Math.random() * 100
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);
  const containerStyle = {
    position: 'fixed' as const,
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    pointerEvents: 'auto' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #374151',
    cursor: 'move',
    userSelect: 'none' as const,
    WebkitAppRegion: 'drag' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    width: '300px',
    height: 'fit-content',
    margin: 'auto'
  };
  const InputBar = ({ label, value, color }: {
    label: string;
    value: number;
    color: string;
  }) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '4px' 
      }}>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{label}</span>
        <span style={{ fontSize: '0.75rem', color: 'white' }}>{value.toFixed(0)}%</span>
      </div>
      <div style={{ 
        width: '100%', 
        backgroundColor: '#374151', 
        borderRadius: '4px', 
        height: '8px',
        position: 'relative'
      }}>
        <div
          style={{
            height: '8px',
            borderRadius: '4px',
            backgroundColor: color,
            width: `${Math.abs(value)}%`,
            transition: 'width 0.1s ease'
          }}
        />
      </div>
    </div>
  );

  const SteeringBar = ({ value }: { value: number }) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '4px' 
      }}>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Steering</span>
        <span style={{ fontSize: '0.75rem', color: 'white' }}>{value.toFixed(0)}%</span>
      </div>
      <div style={{ 
        width: '100%', 
        backgroundColor: '#374151', 
        borderRadius: '4px', 
        height: '8px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* Center line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '2px',
          height: '8px',
          backgroundColor: '#6b7280'
        }} />
        {/* Steering indicator */}
        <div
          style={{
            position: 'absolute',
            left: value >= 0 ? '50%' : `${50 + value}%`,
            width: `${Math.abs(value) / 2}%`,
            height: '8px',
            borderRadius: '4px',
            backgroundColor: '#3b82f6',
            transition: 'all 0.1s ease'
          }}
        />
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', fontWeight: 'bold' }}>
        Input Telemetry
      </h3>
      
      <InputBar 
        label="Throttle" 
        value={inputs.throttle} 
        color="#10b981" 
      />
      
      <InputBar 
        label="Brake" 
        value={inputs.brake} 
        color="#ef4444" 
      />
      
      <SteeringBar value={inputs.steering} />
      
      <InputBar 
        label="Clutch" 
        value={inputs.clutch} 
        color="#f59e0b" 
      />
    </div>
  );
};
