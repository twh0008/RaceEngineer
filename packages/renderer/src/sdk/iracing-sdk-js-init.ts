// Use require to import the SDK module
const irsdk = require('../../../iracing-sdk-js/src/iracing-sdk-js.js');

let iracingInstance: any = null;
let isIracingConnected = false;

export function initIracingSdk() {
  if (!iracingInstance) {
    iracingInstance = irsdk.init({ telemetryUpdateInterval: 100 });
    iracingInstance.on('Connected', () => {
      isIracingConnected = true;
    });
    iracingInstance.on('Disconnected', () => {
      isIracingConnected = false;
    });
  }
  return iracingInstance;
}

export function getIracingStatus() {
  return isIracingConnected;
}