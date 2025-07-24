import { AppModule } from '../AppModule.js';
import { ModuleContext } from '../ModuleContext.js';
import { ipcMain, BrowserWindow } from 'electron';
import { IRacingSDK, irInstance } from '@iracing/types/';
import { IpcChannels } from '@constants/';
import { createRequire } from 'module';

class IracingSdkModule implements AppModule {
  private iracingInstance: irInstance | null = null;
  private irsdk: IRacingSDK | null = null;
  private isIracingConnected: boolean = false;

  private isIrSdkLoaded(): boolean {
    if (this.irsdk) {
      return true;
    }
    try {
      const require = createRequire(import.meta.url);
      const importedModule = require('../../iracing-sdk-js/src/iracing-sdk-js.js');
      this.irsdk = importedModule.default || importedModule;
      return !!this.irsdk;
    } catch (e) {
      console.error('Failed to load irsdk:', e);
      return false;
    }
  }

  private sendDataToAllWindows(channel: string, data: any): void {
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

  enable({ app }: ModuleContext): void {
    if (!this.isIrSdkLoaded()) {
      console.error(
        'iracing-sdk-js module could not be loaded. Cannot initialize iRacing SDK.'
      );
      return;
    }

    if (!this.iracingInstance) {
      this.iracingInstance = this.irsdk!.init({ telemetryUpdateInterval: 100 });
      console.log('SDK instance created:', !!this.iracingInstance);

      // Listen for connection events
      this.iracingInstance.on('Connected', () => {
        this.isIracingConnected = true;
        console.log(
          'iRacing Connected, isIracingConnected:',
          this.isIracingConnected
        );
        this.sendDataToAllWindows(IpcChannels.IRACING_UPDATE_STATUS, {
          isConnected: true,
        });
      });

      this.iracingInstance.on('Disconnected', () => {
        this.isIracingConnected = false;
        console.log(
          'iRacing Disconnected, isIracingConnected:',
          this.isIracingConnected
        );
        this.sendDataToAllWindows(IpcChannels.IRACING_UPDATE_STATUS, {
          isConnected: false,
        });
      });

      // Listen for telemetry updates
      this.iracingInstance.on(
        'Telemetry',
        (telemetry: irInstance.telemetry) => {
          console.log('Telemetry updated');
          this.sendDataToAllWindows(IpcChannels.IRACING_TELEMETRY, telemetry);
        }
      );

      // Listen for session info updates
      this.iracingInstance.on(
        'SessionInfo',
        (sessionInfo: irInstance.sessionInfo) => {
          console.log('Session info updated');
          this.sendDataToAllWindows(
            IpcChannels.IRACING_SESSION_INFO,
            sessionInfo
          );
        }
      );
    }

    // Register IPC handlers
    ipcMain.handle(IpcChannels.IRACING_GET_STATUS, async () => {
      return { isConnected: this.isIracingConnected };
    });
  }

  disable({ app }: ModuleContext): void {
    // Clean up IPC handlers
    ipcMain.removeHandler(IpcChannels.IRACING_GET_STATUS);

    // Clean up SDK instance
    if (this.iracingInstance) {
      this.iracingInstance.removeAllListeners();
      this.iracingInstance = null;
    }
    this.isIracingConnected = false;
  }
}

export function initIracingSdk(
  ...args: ConstructorParameters<typeof IracingSdkModule>
) {
  return new IracingSdkModule(...args);
}
