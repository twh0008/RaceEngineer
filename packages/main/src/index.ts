import type {AppInitConfig} from './AppInitConfig.js';
import {createModuleRunner} from './ModuleRunner.js';
import {disallowMultipleAppInstance} from './modules/SingleInstanceApp.js';
import {createWindowManagerModule} from './modules/WindowManager.js';
import {createOverlayManagerModule} from './modules/OverlayManager.js';
import {terminateAppOnLastWindowClose} from './modules/ApplicationTerminatorOnLastWindowClose.js';
import {hardwareAccelerationMode} from './modules/HardwareAccelerationModule.js';
import {autoUpdater} from './modules/AutoUpdater.js';
import {allowInternalOrigins} from './modules/BlockNotAllowdOrigins.js';
import {allowExternalUrls} from './modules/ExternalUrls.js';
import { ipcMain } from 'electron';
import { createRequire } from 'module';

let iracingInstance: any = null;
let isIracingConnected: boolean = false;
let irsdk: any = null;

async function initIracingSdk() {
  const require = createRequire(import.meta.url);
  if (!irsdk) {
    const imported = require('../../iracing-sdk-js/src/iracing-sdk-js.js');
    irsdk = imported.default || imported;
    console.log('SDK loaded:', !!irsdk);
  }
  if (!iracingInstance) {
    iracingInstance = irsdk.init({ telemetryUpdateInterval: 100 });
    console.log('SDK instance created:', !!iracingInstance);
    iracingInstance.on('Connected', () => {
      isIracingConnected = true;
      console.log('iRacing Connected');
    });
    iracingInstance.on('Disconnected', () => {
      isIracingConnected = false;
      console.log('iRacing Disconnected');
    });
  }
  return iracingInstance;
}

// IPC handler for renderer to get iRacing connection status
ipcMain.handle('iracing:getStatus', () => {
  return isIracingConnected;
});

export async function initApp(initConfig: AppInitConfig) {
  initIracingSdk(); // Initialize SDK at app start
  const moduleRunner = createModuleRunner()
    .init(createWindowManagerModule({initConfig, openDevTools: import.meta.env.DEV}))
    .init(createOverlayManagerModule({initConfig}))
    .init(disallowMultipleAppInstance())
    .init(terminateAppOnLastWindowClose())
    .init(hardwareAccelerationMode({enable: false}))
    .init(autoUpdater())

    // Install DevTools extension if needed
    // .init(chromeDevToolsExtension({extension: 'VUEJS3_DEVTOOLS'}))

    // Security
    .init(allowInternalOrigins(
      new Set(initConfig.renderer instanceof URL ? [initConfig.renderer.origin] : []),
    ))
    .init(allowExternalUrls(
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
          : [],
      )),
    );

  await moduleRunner;
}
