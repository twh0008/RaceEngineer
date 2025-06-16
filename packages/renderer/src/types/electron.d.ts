import { OverlayConfig } from '@/types/common';

interface ElectronAPI {
  toggleClickThrough: (enabled: boolean) => Promise<void>;
  getWindowBounds: () => Promise<Electron.Rectangle | null>;
  createOverlay: (overlayConfig: OverlayConfig) => Promise<string>;
  closeOverlay: (overlayId: string) => Promise<void>;
  closeAllOverlays: () => Promise<void>;
  getOverlayPosition: (overlayId: string) => Promise<{ x: number; y: number } | null>;
  saveOverlayPositions: (positions: Record<string, { x: number; y: number }>) => Promise<boolean>;
  loadOverlayPositions: () => Promise<Record<string, { x: number; y: number }>>;
  updateOverlayProperties: (overlayConfig: OverlayConfig) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
