import { useEffect, useState } from 'react';
import { IpcChannels } from '@constants/';
import { useElectron } from '../../hooks/useElectron';

type SessionStatus = {
  isConnected: boolean;
};

export const useSession = () => {
  const [connectionStatus, setConnectionStatus] = useState<SessionStatus>();
  const { on, removeAllListeners } = useElectron();

  useEffect(() => {
    const handleStatusUpdate = (data: SessionStatus) => {
      setConnectionStatus(data);
    };

    on(IpcChannels.IRACING_UPDATE_STATUS, handleStatusUpdate);

    return () => {
      removeAllListeners(IpcChannels.IRACING_UPDATE_STATUS);
    };
  }, []);
  return connectionStatus;
};
