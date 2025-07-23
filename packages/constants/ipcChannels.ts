export enum IpcChannels {
  BROWSER_WINDOW_CREATED = 'browser-window-created',
  CREATE_OVERLAY = 'create-overlay',
  CLOSE_OVERLAY = 'close-overlay',

  CLOSE_ALL_OVERLAYS = 'close-all-overlays',

  TOGGLE_CLICK_THROUGH = 'toggle-click-through',
  GET_WINDOW_BOUNDS = 'get-window-bounds',

  UPDATE_OVERLAY_PROPERTIES = 'update-overlay-properties',
  GET_OVERLLAY_POSITION = 'get-overlay-position',
  SAVE_OVERLAY_POSITIONS = 'save-overlay-positions',
  LOAD_OVERLAY_POSITIONS = 'load-overlay-positions',

  IRACING_UPDATE_STATUS = 'iracing:updateStatus',
  IRACING_TELEMETRY = 'iracing:updateTelemetry',
  IRACING_SESSION_INFO = 'iracing:updateSessionInfo',

  IRACING_GET_STATUS = 'iracing:getStatus',
}
