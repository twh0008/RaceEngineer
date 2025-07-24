import { useEffect, useState } from 'react';
import { IpcChannels } from '@constants/';
import type { ITelemetry } from '@iracing/types/';
import { useElectron } from '../../hooks/useElectron';

export const useTelemetry = () => {
  const [telemetry, setTelemetry] = useState<ITelemetry>();
  const { on, removeAllListeners } = useElectron();

  useEffect(() => {
    const handleTelemetryUpdate = (data: ITelemetry) => {
      setTelemetry(data);
    };

    on(IpcChannels.IRACING_TELEMETRY, handleTelemetryUpdate);

    return () => {
      removeAllListeners(IpcChannels.IRACING_TELEMETRY);
    };
  }, []); // empty dependency array to run only once on mount
  return telemetry;
};
