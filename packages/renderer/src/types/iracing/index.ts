export type { ISessionInfo } from './irSession';
export type { ITelemetry } from './irTelemetry';
export type { IRacingSDK, irInstance } from './irsdk';
import type { irInstance } from './irsdk';
export type IRacingTelem = irInstance['telemetry'];
export type IRacingSessionInfo = irInstance['sessionInfo'];
