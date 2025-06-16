import * as exports from './index.js';
import {contextBridge, ipcRenderer} from 'electron';
import { IPC_CHANNELS } from './ipcChannels.js';

 interface OverlayConfig {
  id: string;
  name: string; 
  description?: string;
  component?: string; // Container element ID for the overlay
  enabled?: boolean;
  size: { width: number; height: number };
  position?: { x: number; y: number };
  anchorMode?: boolean;
  windowId?: string; // Used to track the overlay window ID
  url?: string; // Optional URL override for the overlay
}

const isExport = (key: string): key is keyof typeof exports => Object.hasOwn(exports, key);

for (const exportsKey in exports) {
  if (isExport(exportsKey)) {
    contextBridge.exposeInMainWorld(btoa(exportsKey), exports[exportsKey]);
  }
}

// Expose overlay management APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  toggleClickThrough: (enabled: boolean) => ipcRenderer.invoke(IPC_CHANNELS.TOGGLE_CLICK_THROUGH, enabled),
  getWindowBounds: () => ipcRenderer.invoke(IPC_CHANNELS.GET_WINDOW_BOUNDS),
  createOverlay: (overlayConfig: OverlayConfig) => ipcRenderer.invoke(IPC_CHANNELS.CREATE_OVERLAY, overlayConfig),
  closeOverlay: (overlayId: string) => ipcRenderer.invoke(IPC_CHANNELS.CLOSE_OVERLAY, overlayId),
  closeAllOverlays: () => ipcRenderer.invoke(IPC_CHANNELS.CLOSE_ALL_OVERLAYS),
  getOverlayPosition: (overlayId: string) => ipcRenderer.invoke(IPC_CHANNELS.GET_OVERLAY_POSITION, overlayId),
  saveOverlayPositions: (positions: Record<string, { x: number; y: number }>) => ipcRenderer.invoke(IPC_CHANNELS.SAVE_OVERLAY_POSITIONS, positions),
  loadOverlayPositions: () => ipcRenderer.invoke(IPC_CHANNELS.LOAD_OVERLAY_POSITIONS),
  updateOverlayProperties: (overlayConfig: OverlayConfig) => ipcRenderer.invoke(IPC_CHANNELS.UPDATE_OVERLAY_PROPERTIES, overlayConfig),
});

// Re-export for tests
export * from './index.js';
