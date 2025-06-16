/**
 * IPC Channel constants for overlay management
 */
export const IPC_CHANNELS = {
  TOGGLE_CLICK_THROUGH: 'toggle-click-through',
  GET_WINDOW_BOUNDS: 'get-window-bounds',
  CREATE_OVERLAY: 'create-overlay',
  CLOSE_OVERLAY: 'close-overlay',
  CLOSE_ALL_OVERLAYS: 'close-all-overlays',
  UPDATE_OVERLAY_PROPERTIES: 'update-overlay-properties',
  GET_OVERLAY_POSITION: 'get-overlay-position',
  SAVE_OVERLAY_POSITIONS: 'save-overlay-positions',
  LOAD_OVERLAY_POSITIONS: 'load-overlay-positions'
} as const;

/**
 * Type for IPC channel names
 */
export type IpcChannel = keyof typeof IPC_CHANNELS;

/**
 * Type for IPC channel values
 */
export type IpcChannelValue = typeof IPC_CHANNELS[IpcChannel];
