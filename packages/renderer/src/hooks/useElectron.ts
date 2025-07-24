import { useCallback } from 'react';
import type { OverlayConfig } from '../types/overlays';
import type { ISessionInfo, ITelemetry } from '@iracing/types/';
import { IpcChannels } from '@constants/';

type IpcChannelArgs = {
  [IpcChannels.IRACING_TELEMETRY]: [ITelemetry];
  [IpcChannels.IRACING_SESSION_INFO]: [ISessionInfo];
  [IpcChannels.IRACING_UPDATE_STATUS]: [{ isConnected: boolean }];
  [IpcChannels.IRACING_GET_STATUS]: [];
};
// Declare the electron API for TypeScript
declare global {
  interface Window {
    electronAPI: {
      toggleClickThrough: (enabled: boolean) => Promise<void>;
      getWindowBounds: () => Promise<{
        x: number;
        y: number;
        width: number;
        height: number;
      } | null>;
      createOverlay: (overlayConfig: OverlayConfig) => Promise<string>;
      closeOverlay: (overlayId: string) => Promise<void>;
      closeAllOverlays: () => Promise<void>;
      getOverlayPosition: (
        overlayId: string
      ) => Promise<{ x: number; y: number } | null>;
      saveOverlayPositions: (
        positions: Record<string, { x: number; y: number }>
      ) => Promise<void>;
      loadOverlayPositions: () => Promise<
        Record<string, { x: number; y: number }>
      >;
      updateOverlayProperties: (
        overlayConfig: OverlayConfig
      ) => Promise<string>;
      on: <K extends keyof IpcChannelArgs>(
        channel: K,
        listener: (...args: IpcChannelArgs[K]) => void
      ) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

export function useElectron() {
  const toggleClickThrough = useCallback((enabled: boolean) => {
    return window.electronAPI?.toggleClickThrough(enabled);
  }, []);

  const getWindowBounds = useCallback(() => {
    return window.electronAPI?.getWindowBounds();
  }, []);

  const createOverlay = useCallback((overlayConfig: OverlayConfig) => {
    console.log('useElectron: createOverlay called with:', overlayConfig);
    console.log(
      'useElectron: window.electronAPI exists:',
      !!window.electronAPI
    );
    if (window.electronAPI) {
      console.log('useElectron: calling window.electronAPI.createOverlay');
      return window.electronAPI.createOverlay(overlayConfig);
    }
    console.log('useElectron: window.electronAPI not available');
    return Promise.reject('electronAPI not available');
  }, []);

  const closeOverlay = useCallback((overlayId: string) => {
    return window.electronAPI?.closeOverlay(overlayId);
  }, []);

  const closeAllOverlays = useCallback(() => {
    return window.electronAPI?.closeAllOverlays();
  }, []);

  const getOverlayPosition = useCallback((overlayId: string) => {
    return window.electronAPI?.getOverlayPosition(overlayId);
  }, []);

  const saveOverlayPositions = useCallback(
    (positions: Record<string, { x: number; y: number }>) => {
      return window.electronAPI?.saveOverlayPositions(positions);
    },
    []
  );

  const loadOverlayPositions = useCallback(() => {
    return window.electronAPI?.loadOverlayPositions();
  }, []);

  const updateOverlayProperties = useCallback(
    (overlayConfig: OverlayConfig) => {
      console.log(
        'useElectron: updateOverlayProperties called with:',
        overlayConfig
      );
      if (window.electronAPI) {
        console.log(
          'useElectron: calling window.electronAPI.updateOverlayProperties'
        );
        return window.electronAPI.updateOverlayProperties(overlayConfig);
      }
      console.log('useElectron: window.electronAPI not available');
      return Promise.reject('electronAPI not available');
    },
    []
  );

  // Add event listener methods for iRacing updates
  const on = useCallback(
    <K extends keyof IpcChannelArgs>(
      channel: K,
      listener: (...args: IpcChannelArgs[K]) => void
    ) => {
      window.electronAPI?.on(channel, listener);
    },
    []
  );

  const removeAllListeners = useCallback((channel: string) => {
    window.electronAPI?.removeAllListeners(channel);
  }, []);

  return {
    toggleClickThrough,
    getWindowBounds,
    createOverlay,
    closeOverlay,
    closeAllOverlays,
    getOverlayPosition,
    saveOverlayPositions,
    loadOverlayPositions,
    updateOverlayProperties,
    on,
    removeAllListeners,
    isElectron: !!window.electronAPI,
  };
}
