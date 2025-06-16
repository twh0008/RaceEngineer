
export const AVAILABLE_OVERLAYS: OverlayConfig[] = [
  {
    id: 'telemetry-dashboard',
    name: 'Telemetry Dashboard',
    description: 'Main racing telemetry display with speed, gear, lap times',
    component: 'Dashboard',
    size: { width: 400, height: 200 }
  },
  {
    id: 'tyre-wear',
    name: 'Tyre Wear Monitor',
    description: 'Real-time tire wear and temperature monitoring',
    component: 'TyreWear',
    size: { width: 300, height: 200 }
  },
  {
    id: 'relative-widget',
    name: 'Relative Widget',
    description: 'Shows position relative to cars around you',
    component: 'RelativeWidget',
    size: { width: 400, height: 300 }
  },
  {
    id: 'input-telemetry',
    name: 'Input Telemetry',
    description: 'Shows steering, brake, and throttle inputs',
    component: 'InputTelemetry',
    size: { width: 350, height: 250 }
  },
  {
    id: 'track-position',
    name: 'Track Position',
    description: 'Shows car position on track layout with circuit visualization',
    component: 'TrackPositionOverlay',
    size: { width: 350, height: 300 }
  }
];


export interface OverlayConfig {
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

/**
 * Extended configuration with customization options
 * Used in the renderer process for overlay settings
 */
export interface OverlayCustomization extends OverlayConfig {
    textColor: string;
    backgroundColor: string;
    opacity: number;
    fontSize: number;
    updateRate: number;
}

