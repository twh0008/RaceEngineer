import { ipcMain, BrowserWindow } from 'electron';
import { createRequire } from 'module';
import { IRacingSDK, irInstance } from '@iracing/';
import { IpcChannels } from '@constants/';

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

export async function initIracingSdk() {
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
      sendDataToAllWindows(IpcChannels.IRACING_UPDATE_STATUS, {
        isConnected: false,
      });
    });

    // Listen for telemetry updates
    iracingInstance.on('Telemetry', (telemetry: irInstance.telemetry) => {
      console.log('Telemetry updated');
      sendDataToAllWindows(IpcChannels.IRACING_UPDATE_TELEMETRY, telemetry);
    });

    // Listen for session info updates
    iracingInstance.on('SessionInfo', (sessionInfo: irInstance.sessionInfo) => {
      console.log('Session info updated');
      sendDataToAllWindows(
        IpcChannels.IRACING_UPDATE_SESSION_INFO,
        sessionInfo
      );
    });
  }
  return iracingInstance;
}

export function checkIracingManually() {
  ipcMain.handle(IpcChannels.GET_STATUS, async () => {
    return { isConnected: isIracingConnected };
  });
}
