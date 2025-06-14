import { useState, useEffect } from 'react';
import './styles/InputTelemetry.css';

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
  const InputBar = ({ label, value, type }: {
    label: string;
    value: number;
    type: 'throttle' | 'brake' | 'clutch';
  }) => (
    <div className="input-bar">
      <div className="input-bar__header">
        <span className="input-bar__label">{label}</span>
        <span className="input-bar__value">{value.toFixed(0)}%</span>
      </div>
      <div className="input-bar__track">
        <div
          className={`input-bar__indicator input-bar__indicator--${type}`}
          style={{
            width: `${Math.abs(value)}%`
          }}
        />
      </div>
    </div>
  );

  const SteeringBar = ({ value }: { value: number }) => (
    <div className="steering-bar">
      <div className="steering-bar__header">
        <span className="steering-bar__label">Steering</span>
        <span className="steering-bar__value">{value.toFixed(0)}%</span>
      </div>
      <div className="steering-bar__track">
        {/* Center line */}
        <div className="steering-bar__center" />
        {/* Steering indicator */}
        <div
          className="steering-bar__indicator"
          style={{
            left: value >= 0 ? '50%' : `${50 + value}%`,
            width: `${Math.abs(value) / 2}%`
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="input-telemetry">
      <h3 className="input-telemetry__title">
        Input Telemetry
      </h3>
      
      <InputBar 
        label="Throttle" 
        value={inputs.throttle} 
        type="throttle" 
      />
      
      <InputBar 
        label="Brake" 
        value={inputs.brake} 
        type="brake" 
      />
      
      <SteeringBar value={inputs.steering} />
      
      <InputBar 
        label="Clutch" 
        value={inputs.clutch} 
        type="clutch" 
      />
    </div>
  );
};
