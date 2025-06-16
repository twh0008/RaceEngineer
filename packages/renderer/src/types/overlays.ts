export interface OverlayConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  anchorMode?: boolean;
}

export interface OverlayType {
  id: string;
  name: string;
  description: string;
  component: string;
  defaultSize: { width: number; height: number };
}

export const AVAILABLE_OVERLAYS: OverlayType[] = [
  {
    id: 'telemetry-dashboard',
    name: 'Telemetry Dashboard',
    description: 'Main racing telemetry display with speed, gear, lap times',
    component: 'Dashboard',
    defaultSize: { width: 400, height: 200 }
  },
  {
    id: 'tyre-wear',
    name: 'Tyre Wear Monitor',
    description: 'Real-time tire wear and temperature monitoring',
    component: 'TyreWear',
    defaultSize: { width: 300, height: 200 }
  },
  {
    id: 'relative-widget',
    name: 'Relative Widget',
    description: 'Shows position relative to cars around you',
    component: 'RelativeWidget',
    defaultSize: { width: 400, height: 300 }
  },
  {
    id: 'input-telemetry',
    name: 'Input Telemetry',
    description: 'Shows steering, brake, and throttle inputs',
    component: 'InputTelemetry',
    defaultSize: { width: 350, height: 250 }
  },
  {
    id: 'track-position',
    name: 'Track Position',
    description: 'Shows car position on track layout with circuit visualization',
    component: 'TrackPositionOverlay',
    defaultSize: { width: 350, height: 300 }
  }
];
