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
import { ipcMain, BrowserWindow } from 'electron';
import { createRequire } from 'module';
import { IRacingSDK, irInstance } from '@iracing/';

const require = createRequire(import.meta.url);
const importedModule = require('../../iracing-sdk-js/src/iracing-sdk-js.js');
let iracingInstance: irInstance | null = null;
let irsdk: IRacingSDK = importedModule.default || importedModule;
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

  function sendDataToAllWindows(channel: string, data: any) {
    const allWindows = BrowserWindow.getAllWindows();
    allWindows.forEach((window) => {
      try {
        console.log(
          `Sending data to window: ${window.id}, channel: ${channel}`
        );
        window.webContents.send(channel, data);
      } catch (error) {
        console.error(`Failed to send data to window: ${window.id}`, error);
      }
    });
  }

  if (!iracingInstance) {
    iracingInstance = irsdk.init({ telemetryUpdateInterval: 100 });
    console.log('SDK instance created:', !!iracingInstance);

    // Listen for connection events
    iracingInstance.on('Connected', () => {
      isIracingConnected = true;
      console.log('iRacing Connected, isIracingConnected:', isIracingConnected);
      sendDataToAllWindows('iracing:updateStatus', { isConnected: true });
    });

    iracingInstance.on('Disconnected', () => {
      isIracingConnected = false;
      console.log(
        'iRacing Disconnected, isIracingConnected:',
        isIracingConnected
      );
      sendDataToAllWindows('iracing:updateStatus', { isConnected: false });
    });

    // Listen for telemetry updates
    iracingInstance.on('Telemetry', (telemetry: irInstance.telemetry) => {
      console.log('Telemetry updated');
      sendDataToAllWindows('iracing:updateTelemetry', telemetry);
    });

    // Listen for session info updates
    iracingInstance.on('SessionInfo', (sessionInfo: irInstance.sessionInfo) => {
      console.log('Session info updated');
      sendDataToAllWindows('iracing:updateSessionInfo', sessionInfo);
    });
  }
  return iracingInstance;
}

ipcMain.handle('get-status', async () => {
  return { isConnected: isIracingConnected };
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
