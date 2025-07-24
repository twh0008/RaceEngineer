import { useEffect, useState } from 'react';
import { IpcChannels } from '@constants/';
import type { ISessionInfo } from '@iracing/types/';
import { useElectron } from '../../hooks/useElectron';

export const useSession = () => {
  const [session, setSession] = useState<ISessionInfo>();
  const { on, removeAllListeners } = useElectron();

  useEffect(() => {
    const handleSessionUpdate = (data: ISessionInfo) => {
      setSession(data);
    };

    on(IpcChannels.IRACING_SESSION_INFO, handleSessionUpdate);

    return () => {
      removeAllListeners(IpcChannels.IRACING_SESSION_INFO);
    };
  }, []); // empty dependency array to run only once on mount
  return session;
};
