import { useCallback } from 'react';
import type { OverlayConfig } from '../types/overlays';


// Declare the electron API for TypeScript
declare global {
  interface Window {
    electronAPI: {
      toggleClickThrough: (enabled: boolean) => Promise<void>;
      getWindowBounds: () => Promise<{ x: number; y: number; width: number; height: number } | null>;
      createOverlay: (overlayConfig: OverlayConfig) => Promise<string>;
      closeOverlay: (overlayId: string) => Promise<void>;
      closeAllOverlays: () => Promise<void>;
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
    console.log('useElectron: window.electronAPI exists:', !!window.electronAPI);
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

  return {
    toggleClickThrough,
    getWindowBounds,
    createOverlay,
    closeOverlay,
    closeAllOverlays,
    isElectron: !!window.electronAPI,
  };
}
