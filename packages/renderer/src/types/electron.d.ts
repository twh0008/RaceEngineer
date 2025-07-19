interface OverlayConfig {
  id: string;
  size: { width: number; height: number };
  position?: { x: number; y: number };
}

interface ElectronAPI {
  toggleClickThrough: (enabled: boolean) => Promise<void>;

  getWindowBounds: () => Promise<Electron.Rectangle | null>;
  createOverlay: (overlayConfig: OverlayConfig) => Promise<string>;
  closeOverlay: (overlayId: string) => Promise<void>;
  closeAllOverlays: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
