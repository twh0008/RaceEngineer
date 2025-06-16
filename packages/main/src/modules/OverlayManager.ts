import type {AppModule} from '../AppModule.js';
import {ModuleContext} from '../ModuleContext.js';
import {BrowserWindow} from 'electron';
import type {AppInitConfig} from '../AppInitConfig.js';
import * as fs from 'fs';
import * as path from 'path';
import { setupOverlayIpcHandlers, removeOverlayIpcHandlers } from './IpcHandler.js';
import type {OverlayConfig} from '../../../../packages/renderer/src/types/overlays.ts';

class OverlayManager implements AppModule {
  readonly #preload: {path: string};
  readonly #renderer: {path: string} | URL;
  readonly #overlayWindows = new Map<string, BrowserWindow>();
  readonly #positionsFilePath: string;
  #mainWindow: BrowserWindow | null = null;

  constructor({initConfig}: {initConfig: AppInitConfig}) {
    this.#preload = initConfig.preload;
    this.#renderer = initConfig.renderer;
    
    // Set up the path for storing overlay positions
    this.#positionsFilePath = path.join(
      process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share"),
      'RaceEngineer',
      'overlay-positions.json'
    );
    
    // Ensure directory exists
    const dir = path.dirname(this.#positionsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
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
    // Use method binding to ensure 'this' context is preserved
    const boundMethods = {
      createOverlay: this.createOverlay.bind(this),
      closeOverlay: this.closeOverlay.bind(this),
      closeAllOverlays: this.closeAllOverlays.bind(this),
      updateOverlayProperties: this.updateOverlayProperties.bind(this),
      loadOverlayPositions: this.loadOverlayPositions.bind(this),
      saveOverlayPositions: this.saveOverlayPositions.bind(this),
      getOverlayPosition: this.getOverlayPosition.bind(this)
    };
    
    setupOverlayIpcHandlers(boundMethods, () => this.#mainWindow);
  }
  
  private async updateOverlayProperties(overlayConfig: OverlayConfig): Promise<string> {
    console.log(`Updating properties for overlay: ${overlayConfig.id}`);
    const overlayWindow = this.#overlayWindows.get(overlayConfig.id);
    
    if (!overlayWindow) {
      console.error(`Overlay window not found for ID: ${overlayConfig.id}`);
      return this.createOverlay(overlayConfig);
    }
    
    // Update the window movable property based on anchor mode
    overlayWindow.setMovable(overlayConfig.anchorMode || false);
    console.log(`Set overlay window movable: ${overlayConfig.anchorMode || false}`);
    
    // Load the URL with anchor mode parameter if needed
    if (this.#renderer instanceof URL) {
      const overlayUrl = new URL(this.#renderer.href);
      overlayUrl.searchParams.set('overlay', overlayConfig.id);
      
      // Add anchor mode parameter if present
      if (overlayConfig.anchorMode) {
        overlayUrl.searchParams.set('anchorMode', 'true');
      } else {
        overlayUrl.searchParams.delete('anchorMode');
      }
      
      console.log('Reloading overlay URL with new parameters:', overlayUrl.href);
      await overlayWindow.loadURL(overlayUrl.href);
    } else {
      // For file paths, we need to construct the URL with query parameters
      const baseFile = this.#renderer.path;
      const anchorModeParam = overlayConfig.anchorMode ? `&anchorMode=true` : '';
      const urlWithParams = `file://${baseFile}?overlay=${encodeURIComponent(overlayConfig.id)}${anchorModeParam}`;
      console.log('Reloading overlay file URL with new parameters:', urlWithParams);
      await overlayWindow.loadURL(urlWithParams);
    }
      // Update window position if provided
    if (overlayConfig.position) {
      console.log(`Setting overlay position for ${overlayConfig.id} to:`, overlayConfig.position);
      overlayWindow.setPosition(overlayConfig.position.x, overlayConfig.position.y);
    } else {
      console.log(`No position provided for overlay ${overlayConfig.id}`);
    }
    
    // Focus the window
    overlayWindow.focus();
    
    return overlayConfig.id;
  }
  
  async createOverlay(overlayConfig: OverlayConfig): Promise<string> {
    console.log('Creating overlay:', overlayConfig);
    
    // Check if overlay already exists
    const existingWindow = this.#overlayWindows.get(overlayConfig.id);
    if (existingWindow) {
      console.log(`Overlay ${overlayConfig.id} already exists, updating properties instead of recreating`);
      return this.updateOverlayProperties(overlayConfig);
    }
    
    // Try to load saved position for this overlay
    let position = overlayConfig.position;
    if (!position) {
      const savedPositions = this.loadOverlayPositions();
      position = savedPositions[overlayConfig.id] || { x: 200, y: 200 };
    }
    
    const overlayWindow = new BrowserWindow({
      width: Math.max(overlayConfig.size.width, 400), // Ensure minimum width
      height: Math.max(overlayConfig.size.height, 300), // Ensure minimum height
      x: position.x,
      y: position.y,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: this.#preload.path,
        webSecurity: false // Disable web security for development
      },
      frame: false, // Remove frame for overlay appearance
      transparent: false, // Re-enable transparency
      alwaysOnTop: true,
      skipTaskbar: true, // Hide from taskbar for overlay behavior
      resizable: true,
      show: false, // Don't show immediately, wait for ready-to-show
      opacity: 0.95, // Slightly transparent for overlay effect
      movable: overlayConfig.anchorMode || false, // Only allow moving in anchor mode
      minimizable: false,
      maximizable: false,
      closable: true,
      backgroundColor: '#00000000' // Transparent background
    });
    
    console.log('Overlay window created, loading content...');
    console.log('Renderer path type:', typeof this.#renderer);
    console.log('Renderer path value:', this.#renderer);
    
    // Load the overlay content
    if (this.#renderer instanceof URL) {
      const overlayUrl = new URL(this.#renderer.href);
      overlayUrl.searchParams.set('overlay', overlayConfig.id);
      
      // Add anchor mode parameter if present
      if (overlayConfig.anchorMode) {
        overlayUrl.searchParams.set('anchorMode', 'true');
      }
      
      console.log('Loading overlay URL:', overlayUrl.href);
      await overlayWindow.loadURL(overlayUrl.href);
    } else {
      // For file paths, we need to construct the URL with query parameters
      console.log('Handling file path renderer');
      const baseFile = this.#renderer.path;
      // For development, we need to add query parameters differently
      const anchorModeParam = overlayConfig.anchorMode ? `&anchorMode=true` : '';
      const urlWithParams = `file://${baseFile}?overlay=${encodeURIComponent(overlayConfig.id)}${anchorModeParam}`;
      console.log('Loading overlay file URL:', urlWithParams);
      await overlayWindow.loadURL(urlWithParams);
    }
    
    console.log('URL loaded, setting up event handlers...');

    overlayWindow.webContents.on('did-start-loading', () => {
      console.log('Overlay started loading:', overlayConfig.id);
    });
    
    overlayWindow.webContents.on('dom-ready', () => {
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
    });
    
    overlayWindow.webContents.on('did-finish-load', () => {
      console.log('Overlay finished loading:', overlayConfig.id);
      // Force show since ready-to-show might not fire with transparent windows
      console.log('Forcing overlay to show');
      overlayWindow.show();
      overlayWindow.focus();
    });

    overlayWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error('Overlay failed to load:', overlayConfig.id, errorCode, errorDescription, validatedURL);
    });
    
    overlayWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
      console.log(`Overlay console [${overlayConfig.id}]:`, message);
    });
    
    // Add a timeout to force show after 1 second as fallback
    setTimeout(() => {
      console.log('Timeout check: Window visible?', overlayWindow.isVisible());
      if (!overlayWindow.isVisible()) {
        console.log('Timeout: Forcing overlay to show after 1 second');
        overlayWindow.show();
        overlayWindow.focus();
        overlayWindow.moveTop(); // Bring to front
      }
    }, 1000);
    
    overlayWindow.on('show', () => {
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

  private saveOverlayPositions(positions: Record<string, { x: number; y: number }>): boolean {
    try {
      fs.writeFileSync(this.#positionsFilePath, JSON.stringify(positions, null, 2), 'utf8');
      console.log('Saved overlay positions to:', this.#positionsFilePath);
      return true;
    } catch (error) {
      console.error('Failed to save overlay positions:', error);
      return false;
    }
  }
  
  private loadOverlayPositions(): Record<string, { x: number; y: number }> {
    try {
      if (fs.existsSync(this.#positionsFilePath)) {
        const data = fs.readFileSync(this.#positionsFilePath, 'utf8');
        const positions = JSON.parse(data) as Record<string, { x: number; y: number }>;
        console.log('Loaded overlay positions from:', this.#positionsFilePath);
        return positions;
      }
    } catch (error) {
      console.error('Failed to load overlay positions:', error);
    }
    return {};
  }

  getOverlayPosition(overlayId: string): { x: number; y: number } | null {
    const window = this.#overlayWindows.get(overlayId);
    if (window) {
      const bounds = window.getBounds();
      return { x: bounds.x, y: bounds.y };
    }
    return null;
  }

  async disable(): Promise<void> {
    // Clean up IPC handlers
    removeOverlayIpcHandlers();
    
    // Close all overlay windows
    this.closeAllOverlays();
  }
}

export function createOverlayManagerModule(...args: ConstructorParameters<typeof OverlayManager>) {
  return new OverlayManager(...args);
}
