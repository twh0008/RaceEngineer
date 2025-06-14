import type {AppModule} from '../AppModule.js';
import {ModuleContext} from '../ModuleContext.js';
import {BrowserWindow, ipcMain} from 'electron';
import type {AppInitConfig} from '../AppInitConfig.js';

interface OverlayConfig {
  id: string;
  size: { width: number; height: number };
  position?: { x: number; y: number };
}

class OverlayManager implements AppModule {
  readonly #preload: {path: string};
  readonly #renderer: {path: string} | URL;
  readonly #overlayWindows = new Map<string, BrowserWindow>();
  #mainWindow: BrowserWindow | null = null;

  constructor({initConfig}: {initConfig: AppInitConfig}) {
    this.#preload = initConfig.preload;
    this.#renderer = initConfig.renderer;
  }
  async enable({app}: ModuleContext): Promise<void> {
    await app.whenReady();
    this.setupIpcHandlers();
    
    // Find the main window created by WindowManager
    this.#mainWindow = BrowserWindow.getAllWindows().find(w => !w.isDestroyed()) || null;
    
    // Also listen for new windows in case the main window is created later
    app.on('browser-window-created', (_, window) => {
      if (!this.#mainWindow && !this.#overlayWindows.has(window.id.toString())) {
        this.#mainWindow = window;
      }
    });
  }
  private setupIpcHandlers(): void {
    console.log('Setting up IPC handlers for overlay management');
    
    ipcMain.handle('toggle-click-through', (_event, enabled: boolean) => {
      console.log('Toggle click-through:', enabled);
      if (this.#mainWindow) {
        this.#mainWindow.setIgnoreMouseEvents(enabled);
      }
    });

    ipcMain.handle('get-window-bounds', () => {
      const bounds = this.#mainWindow ? this.#mainWindow.getBounds() : null;
      console.log('Get window bounds:', bounds);
      return bounds;
    });

    ipcMain.handle('create-overlay', async (_event, overlayConfig: OverlayConfig) => {
      console.log('IPC: create-overlay called with:', overlayConfig);
      try {
        const result = await this.createOverlay(overlayConfig);
        console.log('IPC: create-overlay result:', result);
        return result;
      } catch (error) {
        console.error('IPC: create-overlay error:', error);
        throw error;
      }
    });

    ipcMain.handle('close-overlay', (_event, overlayId: string) => {
      console.log('IPC: close-overlay called with:', overlayId);
      return this.closeOverlay(overlayId);
    });

    ipcMain.handle('close-all-overlays', () => {
      console.log('IPC: close-all-overlays called');
      return this.closeAllOverlays();
    });
  }
  async createOverlay(overlayConfig: OverlayConfig): Promise<string> {
    console.log('Creating overlay:', overlayConfig);    const overlayWindow = new BrowserWindow({
      width: Math.max(overlayConfig.size.width, 400), // Ensure minimum width
      height: Math.max(overlayConfig.size.height, 300), // Ensure minimum height
      x: overlayConfig.position?.x || 200,
      y: overlayConfig.position?.y || 200,      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: this.#preload.path,
        webSecurity: false // Disable web security for development
      },      frame: false, // Remove frame for overlay appearance
      transparent: false, // Re-enable transparency
      alwaysOnTop: true,
      skipTaskbar: true, // Hide from taskbar for overlay behavior
      resizable: true,
      show: false, // Don't show immediately, wait for ready-to-show
      opacity: 0.95, // Slightly transparent for overlay effect
      movable: true,
      minimizable: false,
      maximizable: false,
      closable: true,      backgroundColor: '#00000000' // Transparent background
    });console.log('Overlay window created, loading content...');
    console.log('Renderer path type:', typeof this.#renderer);
    console.log('Renderer path value:', this.#renderer);
    
    // Load the overlay content
    if (this.#renderer instanceof URL) {
      const overlayUrl = new URL(this.#renderer.href);
      overlayUrl.searchParams.set('overlay', overlayConfig.id);
      console.log('Loading overlay URL:', overlayUrl.href);
      await overlayWindow.loadURL(overlayUrl.href);
    } else {
      // For file paths, we need to construct the URL with query parameters
      console.log('Handling file path renderer');
      const baseFile = this.#renderer.path;
      // For development, we need to add query parameters differently
      const urlWithParams = `file://${baseFile}?overlay=${encodeURIComponent(overlayConfig.id)}`;
      console.log('Loading overlay file URL:', urlWithParams);
      await overlayWindow.loadURL(urlWithParams);
    }    console.log('URL loaded, setting up event handlers...');

    overlayWindow.webContents.on('did-start-loading', () => {
      console.log('Overlay started loading:', overlayConfig.id);
    });    overlayWindow.webContents.on('dom-ready', () => {
      console.log('Overlay DOM ready:', overlayConfig.id);
      // Show the window as soon as DOM is ready
      console.log('Showing overlay after DOM ready');
      overlayWindow.show();
      overlayWindow.focus();
      
      // Debug: Check if the DOM has content
      overlayWindow.webContents.executeJavaScript(`
        console.log('DOM content check:', document.body.innerHTML.length);
        console.log('Window location:', window.location.href);
        console.log('React root element:', document.getElementById('root') ? 'Found' : 'Not found');
      `);
    });

    overlayWindow.once('ready-to-show', () => {
      console.log('Overlay ready to show:', overlayConfig.id);
      overlayWindow.show();
      overlayWindow.focus(); // Try to bring to front
    });    overlayWindow.webContents.on('did-finish-load', () => {
      console.log('Overlay finished loading:', overlayConfig.id);
      // Force show since ready-to-show might not fire with transparent windows
      console.log('Forcing overlay to show');
      overlayWindow.show();
      overlayWindow.focus();
    });

    overlayWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error('Overlay failed to load:', overlayConfig.id, errorCode, errorDescription, validatedURL);
    });    overlayWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
      console.log(`Overlay console [${overlayConfig.id}]:`, message);
    });    // Add a timeout to force show after 1 second as fallback
    setTimeout(() => {
      console.log('Timeout check: Window visible?', overlayWindow.isVisible());
      if (!overlayWindow.isVisible()) {
        console.log('Timeout: Forcing overlay to show after 1 second');
        overlayWindow.show();
        overlayWindow.focus();
        overlayWindow.moveTop(); // Bring to front
      }
    }, 1000);overlayWindow.on('show', () => {
      console.log('Overlay window shown:', overlayConfig.id);
      console.log('Window bounds:', overlayWindow.getBounds());
      console.log('Window visible:', overlayWindow.isVisible());
      console.log('Window always on top:', overlayWindow.isAlwaysOnTop());
    });

    overlayWindow.on('hide', () => {
      console.log('Overlay window hidden:', overlayConfig.id);
    });

    this.#overlayWindows.set(overlayConfig.id, overlayWindow);
    
    overlayWindow.on('closed', () => {
      console.log('Overlay window closed:', overlayConfig.id);
      this.#overlayWindows.delete(overlayConfig.id);
    });

    console.log('Overlay creation completed for:', overlayConfig.id);
    return overlayConfig.id;
  }

  closeOverlay(overlayId: string): boolean {
    const window = this.#overlayWindows.get(overlayId);
    if (window) {
      window.close();
      this.#overlayWindows.delete(overlayId);
      return true;
    }
    return false;
  }

  closeAllOverlays(): void {
    this.#overlayWindows.forEach(window => window.close());
    this.#overlayWindows.clear();
  }
}

export function createOverlayManagerModule(...args: ConstructorParameters<typeof OverlayManager>) {
  return new OverlayManager(...args);
}
