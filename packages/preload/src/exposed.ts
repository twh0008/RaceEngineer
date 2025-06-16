import * as exports from './index.js';
import {contextBridge, ipcRenderer} from 'electron';

interface OverlayConfig {
  id: string;
  size: { width: number; height: number };
  position?: { x: number; y: number };
  anchorMode?: boolean;
}

const isExport = (key: string): key is keyof typeof exports => Object.hasOwn(exports, key);

for (const exportsKey in exports) {
  if (isExport(exportsKey)) {
    contextBridge.exposeInMainWorld(btoa(exportsKey), exports[exportsKey]);
  }
}

// Expose overlay management APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  toggleClickThrough: (enabled: boolean) => ipcRenderer.invoke('toggle-click-through', enabled),
  getWindowBounds: () => ipcRenderer.invoke('get-window-bounds'),
  createOverlay: (overlayConfig: OverlayConfig) => ipcRenderer.invoke('create-overlay', overlayConfig),
  closeOverlay: (overlayId: string) => ipcRenderer.invoke('close-overlay', overlayId),
  closeAllOverlays: () => ipcRenderer.invoke('close-all-overlays'),
  getOverlayPosition: (overlayId: string) => ipcRenderer.invoke('get-overlay-position', overlayId),
  saveOverlayPositions: (positions: Record<string, { x: number; y: number }>) => 
    ipcRenderer.invoke('save-overlay-positions', positions),
  loadOverlayPositions: () => ipcRenderer.invoke('load-overlay-positions'),
  updateOverlayProperties: (overlayConfig: OverlayConfig) => ipcRenderer.invoke('update-overlay-properties', overlayConfig),
});

// Re-export for tests
export * from './index.js';
