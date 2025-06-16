import { ipcMain, BrowserWindow } from 'electron';
import { IPC_CHANNELS, type OverlayConfig } from '../constants/ipcChannels.js';

/**
 * Sets up IPC handlers for overlay management
 * 
 * @param overlayManager - Object with methods for overlay management
 * @param getMainWindow - Function to get the main application window
 */
export function setupOverlayIpcHandlers(
  overlayManager: {
    createOverlay: (config: OverlayConfig) => Promise<string>;
    closeOverlay: (overlayId: string) => boolean;
    closeAllOverlays: () => void;
    updateOverlayProperties: (config: OverlayConfig) => Promise<string>;
    loadOverlayPositions: () => Record<string, { x: number; y: number }>;
    saveOverlayPositions: (positions: Record<string, { x: number; y: number }>) => boolean;
    getOverlayPosition?: (overlayId: string) => { x: number; y: number } | null;
  },
  getMainWindow: () => BrowserWindow | null
): void {
    // Register all IPC handlers
  ipcMain.handle(IPC_CHANNELS.TOGGLE_CLICK_THROUGH, (_event, enabled: boolean) => {
    const mainWindow = getMainWindow();
    if (mainWindow) {
      mainWindow.setIgnoreMouseEvents(enabled);
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_WINDOW_BOUNDS, () => {
    const mainWindow = getMainWindow();
    const bounds = mainWindow ? mainWindow.getBounds() : null;
    return bounds;
  });

  ipcMain.handle(IPC_CHANNELS.CREATE_OVERLAY, async (_event, overlayConfig: OverlayConfig) => {
    try {
      const result = await overlayManager.createOverlay(overlayConfig);
      return result;
    } catch (error) {
      throw error;
    }
  });
  
  ipcMain.handle(IPC_CHANNELS.CLOSE_OVERLAY, (_event, overlayId: string) => {
    return overlayManager.closeOverlay(overlayId);
  });

  ipcMain.handle(IPC_CHANNELS.CLOSE_ALL_OVERLAYS, () => {
    return overlayManager.closeAllOverlays();
  });
  
  // Handler for updating overlay properties
  ipcMain.handle(IPC_CHANNELS.UPDATE_OVERLAY_PROPERTIES, async (_event, overlayConfig: OverlayConfig) => {
    try {
      const result = await overlayManager.updateOverlayProperties(overlayConfig);
      return result;
    } catch (error) {
      throw error;
    }
  });


    // Handlers for overlay positioning
  ipcMain.handle(IPC_CHANNELS.GET_OVERLAY_POSITION, (_event, overlayId: string) => {
    const position = overlayManager.getOverlayPosition?.(overlayId) || null;
    return position;
  });
  
  ipcMain.handle(IPC_CHANNELS.SAVE_OVERLAY_POSITIONS, (_event, positions: Record<string, { x: number; y: number }>) => {
    const result = overlayManager.saveOverlayPositions(positions);
    return result;
  });
  
  ipcMain.handle(IPC_CHANNELS.LOAD_OVERLAY_POSITIONS, () => {
    const positions = overlayManager.loadOverlayPositions();
    return positions;
  });
}

/**
 * Removes all IPC handlers related to overlay management
 */
export function removeOverlayIpcHandlers(): void {
  Object.values(IPC_CHANNELS).forEach(channel => {
    ipcMain.removeHandler(channel);
  });
}

