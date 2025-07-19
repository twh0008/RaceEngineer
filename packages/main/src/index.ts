import type { AppInitConfig } from './AppInitConfig.js';
import { createModuleRunner } from './ModuleRunner.js';
import { disallowMultipleAppInstance } from './modules/SingleInstanceApp.js';
import { createWindowManagerModule } from './modules/WindowManager.js';
import { createOverlayManagerModule } from './modules/OverlayManager.js';
import { terminateAppOnLastWindowClose } from './modules/ApplicationTerminatorOnLastWindowClose.js';
import { hardwareAccelerationMode } from './modules/HardwareAccelerationModule.js';
import { autoUpdater } from './modules/AutoUpdater.js';
import { allowInternalOrigins } from './modules/BlockNotAllowdOrigins.js';
import { allowExternalUrls } from './modules/ExternalUrls.js';
import { ipcMain } from 'electron';
import { createRequire } from 'module';
import { IRacingSDK, ITelemetry, ISessionInfo } from '@iracing/';

const require = createRequire(import.meta.url);
const importedModule = require('../../iracing-sdk-js/src/iracing-sdk-js.js');
let irsdk: IRacingSDK | null = importedModule.default || importedModule;
let isIracingConnected: boolean = false;

function isIrSdkLoaded(): boolean {
  if (irsdk) {
    return true;
  }
  try {
    irsdk = importedModule.default || importedModule;
    return !!irsdk;
  } catch (e) {
    console.error('Failed to load irsdk:', e);
    return false;
  }
}

async function initIracingSdk() {
  if (!isIrSdkLoaded()) {
    console.error(
      'iracing-sdk-js module could not be loaded. Cannot initialize iRacing SDK.'
    );
    return null;
  }
  let irsdkCreateirsdk: IRacingSDK | null = null;
  try {
    irsdkCreateirsdk = irsdk.getInstance();
  } catch (e) {
    console.log('iRacing SDK instance not found, creating a new one...');
    try {
      irsdkCreateirsdk = irsdk.init({ telemetryUpdateInterval: 100 });
    } catch (e) {
      console.error('Failed to initialize iRacing SDK:', e);
      return null;
    }
  }
  if (!irsdkCreateirsdk) {
    console.error('Failed to create iRacing SDK instance.');
    return null;
  }
  irsdkCreateirsdk.on('connected', () => {
    console.log('iRacing SDK connected');
    isIracingConnected = true;
  });
  irsdkCreateirsdk.on('disconnected', () => {
    console.log('iRacing SDK disconnected');
    isIracingConnected = false;
  });
  irsdkCreateirsdk.on('telemetry', (telemetry: ITelemetry) => {
    console.log('Received telemetry data:', telemetry);
    // Temporary: Log telemetry data to console
  });
  irsdkCreateirsdk.on('sessionInfo', (sessionInfo: ISessionInfo) => {
    console.log('Received session info:', sessionInfo);
    // Temporary: Log session info to console
  });
}

// IPC handler for renderer to get iRacing connection status
ipcMain.handle('iracing:getStatus', () => {
  return isIracingConnected;
});

ipcMain.handle('iracing:telemetry', () => {
  // create instance when accessing telemetry
  let iracingInstance: IRacingSDK | null = null;
  if (!isIrSdkLoaded()) {
    console.error('iRacing SDK is not loaded.');
    return null;
  } else {
    iracingInstance = irsdk.getInstance();
  }
  if (!iracingInstance) {
    return null;
  }
  const telemetry: ITelemetry | null = iracingInstance.telemetry;
  if (!telemetry) {
    return null;
  }
  // Return a copy of the telemetry data to avoid direct mutation
  return { ...telemetry };
});

ipcMain.handle('iracing:sessionInfo', () => {
  // create instance when accessing session info
  let iracingInstance: IRacingSDK | null = null;
  if (!isIrSdkLoaded()) {
    console.error('iRacing SDK is not loaded.');
    return null;
  } else {
    iracingInstance = irsdk.getInstance();
  }
  // Check if the instance is available
  if (!iracingInstance) {
    return null;
  }
  const sessionInfo: ISessionInfo | null = iracingInstance.sessionInfo;
  if (!sessionInfo) {
    return null;
  }
  // Return a copy of the session info to avoid direct mutation
  return { ...sessionInfo };
});

export async function initApp(initConfig: AppInitConfig) {
  initIracingSdk(); // Initialize SDK at app start
  const moduleRunner = createModuleRunner()
    .init(
      createWindowManagerModule({
        initConfig,
        openDevTools: import.meta.env.DEV,
      })
    )
    .init(createOverlayManagerModule({ initConfig }))
    .init(disallowMultipleAppInstance())
    .init(terminateAppOnLastWindowClose())
    .init(hardwareAccelerationMode({ enable: false }))
    .init(autoUpdater())

    // Install DevTools extension if needed
    // .init(chromeDevToolsExtension({extension: 'VUEJS3_DEVTOOLS'}))

    // Security
    .init(
      allowInternalOrigins(
        new Set(
          initConfig.renderer instanceof URL ? [initConfig.renderer.origin] : []
        )
      )
    )
    .init(
      allowExternalUrls(
        new Set(
          initConfig.renderer instanceof URL
            ? [
                'https://vite.dev',
                'https://developer.mozilla.org',
                'https://solidjs.com',
                'https://qwik.dev',
                'https://lit.dev',
                'https://react.dev',
                'https://preactjs.com',
                'https://www.typescriptlang.org',
                'https://vuejs.org',
              ]
            : []
        )
      )
    );

  await moduleRunner;
}
