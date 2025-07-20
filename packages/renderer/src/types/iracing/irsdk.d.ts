import { ITelemetry } from './irTelemetry';
import { ISessionInfo } from './irSession';

type irOptionKeys =
  | 'telemetryUpdateInterval'
  | 'sessionInfoUpdateInterval'
  | 'sessionInfoParser';
type sessionInfoParser = {
  // define as any
  sessionInfo: string;
};
type irOptions =
  | {
      // Define the structure of irOptions if needed
      [key in irOptionKeys]: number | sessionInfoParser | null | undefined;
    }
  | undefined;
enum BroadcastMsg {
  CamSwitchPos = 0, // switch cam, args: car position, group, camera
  CamSwitchNum = 1, // switch cam, args: driver #, group camera
  CamSetState = 2, // set cam state, args: CameraState
  ReplaySetPlaySpeed = 3, // set replay play speed, args: speed, slow motion
  ReplaySetPlayPosition = 4, // Jump to frame, args: RpyPosMode, FrameNumber(high, low)
  ReplaySearch = 5, // Search replay, args: RpySrchMode
  ReplaySetState = 6, // Set replay state, args: RpyStateMode
  ReloadTextures = 7, // reload textures, args: ReloadTexturesMode, carIdx
  ChatCommand = 8, // Chat Commands, args: ChatCommand, subCommand
  PitCommand = 9, // Pit Commands, args: PitCommand, param
  TelemCommand = 10, // Disk telemetry commands, args: TelemCommand
  FFBCommand = 11, // not supported yet in NODE, args: FFBCommand, value(float, high, low)
  ReplaySearchSessionTime = 12, // search replay by timestamp, args: SessionNum, sessionTimeMS(high, low)
}
enum CameraState {
  // enum for camera state; is bitfield
  IsSessionScreen = 1,
  IsScenicActive = 2,
  CamToolActive = 4,
  UIHidden = 8,
  UseAutoShotSelection = 16,
  UseTemporaryEdits = 32,
  UseKeyAcceleration = 64,
  UseKey10xAcceleration = 128,
  useMouseAimMode = 256,
}
enum RpyPosMode {
  Begin = 0, // FrameNumber relative to start of replay
  Current = 1, // FrameNumber relative to current frame
  End = 2, // FrameNumber relative to end of replay
}
enum RpySrchMode {
  ToStart = 0, // search to start of replay
  ToEnd = 1, // search to end of replay
  PrevSession = 2, // search for previous session
  NextSession = 3, // search for next session
  PrevLap = 4, // search for previous lap
  NextLap = 5, // search for next lap
  PrevFrame = 6, // search for previous frame
  NextFrame = 7, // search for next frame
  PrevIncident = 8, // search for previous incident
  NextIncident = 9, // search for next incident
}
enum RpyStateMode {
  EraseTape = 0, // erase tape
}
enum ReloadTexturesMode {
  All = 0, // reload all textures
  CarIdx = 1, // reload textures for carIdx
}
enum ChatCommand {
  Macro = 0, // Chat macro command 0-15
  BeginChat = 1, // Open New Chat Window
  Reply = 2, // Reply to Last Private Chat
  CloseChat = 3, // Close Chat Window
}
enum PitCommand {
  // 11 commands
  Clear = 0, // Clear all pit checkboxes
  CleanWindshield = 1, // Clean windshield
  Fuel = 2, // Requests Fuel, args: FuelAmount(liters, optional)
  LFTire = 3, // Left Front Tire, args: TirePressure(kPa, optional)
  RFTire = 4, // Right Front Tire, args: TirePressure(kPa, optional)
  LRTire = 5, // Left Rear Tire, args: TirePressure(kPa, optional)
  RRTire = 6, // Right Rear Tire, args: TirePressure(kPa, optional)
  ClearTires = 7, // Clear all tire checkboxes, args: none
  FRepair = 8, // Fast Repair, args: none
  ClearWS = 9, // disable CleanWindshield, args: none
  ClearFR = 10, // disable Fast Repair, args: none
  ClearFuel = 11, // disable Fueling, args: none
}
enum TelemCommand {
  Stop = 0, // Stop disk logging
  Start = 1, // Start disk logging
  Restart = 2, // Restart disk logging
}
enum CamFocusAt {
  Incident = -3, // Focus on incident
  Leader = -2, // Focus on leader
  Exciting = -1, // Focus on exciting
}
enum ChatMacro {
  // unk values 0-15
  Macro0 = 0,
  Macro1 = 1,
  Macro2 = 2,
  Macro3 = 3,
  Macro4 = 4,
  Macro5 = 5,
  Macro6 = 6,
  Macro7 = 7,
  Macro8 = 8,
  Macro9 = 9,
  Macro10 = 10,
  Macro11 = 11,
  Macro12 = 12,
  Macro13 = 13,
  Macro14 = 14,
  Macro15 = 15,
}
type carInt = number | string | CamFocusAt; // Represents a car index, can be any integer
type IrDataUnk = null | undefined;
type IrSdkConsts = {
  BroadcastMsg: BroadcastMsg;
  CameraState: CameraState;
  RpyPosMode: RpyPosMode;
  RpySrchMode: RpySrchMode;
  RpyStateMode: RpyStateMode;
  ReloadTexturesMode: ReloadTexturesMode;
  ChatCommand: ChatCommand;
  PitCommand: PitCommand;
  TelemCommand: TelemCommand;
  CamFocusAt: CamFocusAt;
};

// Define the irEvent type as a union of string literals
type irEvent =
  | 'TelemetryDescription'
  | 'Telemetry'
  | 'SessionInfo'
  | 'Connected'
  | 'Disconnected'
  | 'update';

export interface irInstance {
  telemetry: ITelemetry | IrDataUnk;
  telemetryDescription: string | object | IrDataUnk; // telemetry description as string or object
  sessionInfo: ISessionInfo | IrDataUnk; // session info as object or null
  Consts: IrSdkConsts | IrDataUnk;
  camControls: {
    setState: (state: CameraState) => void;
    switchToCar: (
      carIdx: carInt,
      group: number | undefined,
      camera: number | undefined
    ) => void;
    switchToPos: (
      carPos: number,
      group: number | undefined,
      camera: number | undefined
    ) => void;
  };
  playbackControls: {
    play: () => void;
    pause: () => void;
    fastForward: {
      (speed: number): void; // 2-16 def 2 (double speed)
      (): void;
    };
    rewind: {
      (speed: number): void; // 2-16 def 2 (double speed)
      (): void;
    };
    slowForward: {
      (divider: number): void; // 2-16 def 2 (half speed)
      (): void;
    };
    slowBackward: {
      (divider: number): void; // 2-16 def 2 (half speed)
      (): void;
    };
    search: (mode: RpySrchMode) => void;
    searchTs: (sessionNum: number, sessionTimeMS: number) => void;
    searchFrame: (frameNum: number, rpyPosMode: RpyPosMode) => void;
  };
  execCmd: (msgId: number, ...args: number[]) => any;
  reloadTextures: () => void;
  reloadTexture: (carIdx: number) => void;
  execChatCmd: (msgId: ChatCommand, arg: number) => any;
  execChatMacro: (macro: ChatMacro) => any; // Chat macro command 0-15
  execPitCmd: {
    (cmd: PitCommand, arg: number): any;
    (cmd: PitCommand): any;
  };
  execTelemetryCmd: (cmd: TelemCommand) => any;
  on: (event: irEvent, callback: (evt: any) => any) => void;
  sessionInfoParser: sessionInfoParser | null;
}

export interface IRacingSDK {
  init: {
    (options: irOptions): void;
    (): void;
  };
  getInstance: () => irInstance;
}

// This module declaration allows TypeScript to recognize the iracing-sdk-js module
