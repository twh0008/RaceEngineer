export interface ITelemetry {
  // from RaceVision telemetry interface github: https://github.com/mpavich2/RaceVision
  timestamp: string;
  values: {
    SessionTime: number;
    SessionTick: number;
    SessionNum: number;
    SessionState: string;
    SessionUniqueID: number;
    SessionFlags: Array<string>;
    SessionTimeRemain: number;
    SessionLapsRemain: number;
    SessionLapsRemainEx: number;
    SessionTimeTotal: number;
    SessionLapsTotal: number;
    SessionJokerLapsRemain: number;
    SessionOnJokerLap: boolean;
    SessionTimeOfDay: number;
    RadioTransmitCarIdx: number;
    RadioTransmitRadioIdx: number;
    RadioTransmitFrequencyIdx: number;
    DisplayUnits: number;
    DriverMarker: boolean;
    PushToTalk: boolean;
    PushToPass: boolean;
    ManualBoost: boolean;
    ManualNoBoost: boolean;
    IsOnTrack: boolean;
    IsReplayPlaying: boolean;
    ReplayFrameNum: number;
    ReplayFrameNumEnd: number;
    IsDiskLoggingEnabled: boolean;
    IsDiskLoggingActive: boolean;
    FrameRate: number;
    CpuUsageFG: number;
    GpuUsage: number;
    ChanAvgLatency: number;
    ChanLatency: number;
    ChanQuality: number;
    ChanPartnerQuality: number;
    CpuUsageBG: number;
    ChanClockSkew: number;
    MemPageFaultSec: number;
    MemSoftPageFaultSec: number;
    PlayerCarPosition: number;
    PlayerCarClassPosition: number;
    PlayerCarClass: number;
    PlayerTrackSurface: string;
    PlayerTrackSurfaceMaterial: string;
    PlayerCarIdx: number;
    PlayerCarTeamIncidentCount: number;
    PlayerCarMyIncidentCount: number;
    PlayerCarDriverIncidentCount: number;
    PlayerCarWeightPenalty: number;
    PlayerCarPowerAdjust: number;
    PlayerCarDryTireSetLimit: number;
    PlayerCarTowTime: number;
    PlayerCarInPitStall: boolean;
    PlayerCarPitSvStatus: string;
    PlayerTireCompound: number;
    PlayerFastRepairsUsed: number;
    CarIdxLap: Array<number>;
    CarIdxLapCompleted: Array<number>;
    CarIdxLapDistPct: Array<number>;
    CarIdxTrackSurface: Array<string>;
    CarIdxTrackSurfaceMaterial: Array<string>;
    CarIdxOnPitRoad: Array<boolean>;
    CarIdxPosition: Array<number>;
    CarIdxClassPosition: Array<number>;
    CarIdxClass: Array<number>;
    CarIdxF2Time: Array<number>;
    CarIdxEstTime: Array<number>;
    CarIdxLastLapTime: Array<number>;
    CarIdxBestLapTime: Array<number>;
    CarIdxBestLapNum: Array<number>;
    CarIdxTireCompound: Array<number>;
    CarIdxQualTireCompound: Array<number>;
    CarIdxQualTireCompoundLocked: Array<boolean>;
    CarIdxFastRepairsUsed: Array<number>;
    CarIdxSessionFlags: Array<Array<string>>;
    PaceMode: string;
    CarIdxPaceLine: Array<number>;
    CarIdxPaceRow: Array<number>;
    CarIdxPaceFlags: Array<Array<any>>;
    OnPitRoad: boolean;
    CarIdxSteer: Array<number>;
    CarIdxRPM: Array<number>;
    CarIdxGear: Array<number>;
    SteeringWheelAngle: number;
    Throttle: number;
    Brake: number;
    Clutch: number;
    Gear: number;
    RPM: number;
    PlayerCarSLFirstRPM: number;
    PlayerCarSLShiftRPM: number;
    PlayerCarSLLastRPM: number;
    PlayerCarSLBlinkRPM: number;
    Lap: number;
    LapCompleted: number;
    LapDist: number;
    LapDistPct: number;
    RaceLaps: number;
    LapBestLap: number;
    LapBestLapTime: number;
    LapLastLapTime: number;
    LapCurrentLapTime: number;
    LapLasNLapSeq: number;
    LapLastNLapTime: number;
    LapBestNLapLap: number;
    LapBestNLapTime: number;
    LapDeltaToBestLap: number;
    LapDeltaToBestLap_DD: number;
    LapDeltaToBestLap_OK: boolean;
    LapDeltaToOptimalLap: number;
    LapDeltaToOptimalLap_DD: number;
    LapDeltaToOptimalLap_OK: boolean;
    LapDeltaToSessionBestLap: number;
    LapDeltaToSessionBestLap_DD: number;
    LapDeltaToSessionBestLap_OK: boolean;
    LapDeltaToSessionOptimalLap: number;
    LapDeltaToSessionOptimalLap_DD: number;
    LapDeltaToSessionOptimalLap_OK: boolean;
    LapDeltaToSessionLastlLap: number;
    LapDeltaToSessionLastlLap_DD: number;
    LapDeltaToSessionLastlLap_OK: boolean;
    Speed: number;
    Yaw: number;
    YawNorth: number;
    Pitch: number;
    Roll: number;
    EnterExitReset: number;
    TrackTemp: number;
    TrackTempCrew: number;
    AirTemp: number;
    TrackWetness: string;
    Skies: number;
    AirDensity: number;
    AirPressure: number;
    WindVel: number;
    WindDir: number;
    RelativeHumidity: number;
    FogLevel: number;
    Precipitation: number;
    SolarAltitude: number;
    SolarAzimuth: number;
    WeatherDeclaredWet: boolean;
    DCLapStatus: number;
    DCDriversSoFar: number;
    OkToReloadTextures: boolean;
    LoadNumTextures: boolean;
    CarLeftRight: string;
    PitsOpen: boolean;
    VidCapEnabled: boolean;
    VidCapActive: boolean;
    PitRepairLeft: number;
    PitOptRepairLeft: number;
    PitstopActive: boolean;
    FastRepairUsed: number;
    FastRepairAvailable: number;
    LFTiresUsed: number;
    RFTiresUsed: number;
    LRTiresUsed: number;
    RRTiresUsed: number;
    LeftTireSetsUsed: number;
    RightTireSetsUsed: number;
    FrontTireSetsUsed: number;
    RearTireSetsUsed: number;
    TireSetsUsed: number;
    LFTiresAvailable: number;
    RFTiresAvailable: number;
    LRTiresAvailable: number;
    RRTiresAvailable: number;
    LeftTireSetsAvailable: number;
    RightTireSetsAvailable: number;
    FrontTireSetsAvailable: number;
    RearTireSetsAvailable: number;
    TireSetsAvailable: number;
    CamCarIdx: number;
    CamCameraNumber: number;
    CamGroupNumber: number;
    CamCameraState: Array<string>;
    IsOnTrackCar: boolean;
    IsInGarage: boolean;
    SteeringWheelAngleMax: number;
    ShiftPowerPct: number;
    ShiftGrindRPM: number;
    ThrottleRaw: number;
    BrakeRaw: number;
    ClutchRaw: number;
    HandbrakeRaw: number;
    BrakeABSactive: boolean;
    EngineWarnings: Array<string>;
    FuelLevelPct: number;
    PitSvFlags: Array<any>;
    PitSvLFP: number;
    PitSvRFP: number;
    PitSvLRP: number;
    PitSvRRP: number;
    PitSvFuel: number;
    PitSvTireCompound: number;
    CarIdxP2P_Status: Array<boolean>;
    CarIdxP2P_Count: Array<number>;
    SteeringWheelPctTorque: number;
    SteeringWheelPctTorqueSign: number;
    SteeringWheelPctTorqueSignStops: number;
    SteeringWheelPctIntensity: number;
    SteeringWheelPctSmoothing: number;
    SteeringWheelPctDamper: number;
    SteeringWheelLimiter: number;
    SteeringWheelMaxForceNm: number;
    SteeringWheelPeakForceNm: number;
    SteeringWheelUseLinear: boolean;
    ShiftIndicatorPct: number;
    ReplayPlaySpeed: number;
    ReplayPlaySlowMotion: boolean;
    ReplaySessionTime: number;
    ReplaySessionNum: number;
    TireLF_RumblePitch: number;
    TireRF_RumblePitch: number;
    TireLR_RumblePitch: number;
    TireRR_RumblePitch: number;
    IsGarageVisible: boolean;
    SteeringWheelTorque_ST: Array<number>;
    SteeringWheelTorque: number;
    VelocityZ_ST: Array<number>;
    VelocityY_ST: Array<number>;
    VelocityX_ST: Array<number>;
    VelocityZ: number;
    VelocityY: number;
    VelocityX: number;
    YawRate_ST: Array<number>;
    PitchRate_ST: Array<number>;
    RollRate_ST: Array<number>;
    YawRate: number;
    PitchRate: number;
    RollRate: number;
    VertAccel_ST: Array<number>;
    LatAccel_ST: Array<number>;
    LongAccel_ST: Array<number>;
    VertAccel: number;
    LatAccel: number;
    LongAccel: number;
    dcStarter: boolean;
    dcTractionControlToggle: boolean;
    dcPitSpeedLimiterToggle: boolean;
    dcHeadlightFlash: boolean;
    dpRFTireChange: number;
    dpLFTireChange: number;
    dpRRTireChange: number;
    dpLRTireChange: number;
    dpFuelFill: number;
    dpFuelAutoFillEnabled: number;
    dpFuelAutoFillActive: number;
    dpWindshieldTearoff: number;
    dpFuelAddKg: number;
    dcToggleWindshieldWipers: boolean;
    dcTriggerWindshieldWipers: boolean;
    dpFastRepair: number;
    dcBrakeBias: number;
    dpLFTireColdPress: number;
    dpRFTireColdPress: number;
    dpLRTireColdPress: number;
    dpRRTireColdPress: number;
    dcABS: number;
    FuelUsePerHour: number;
    Voltage: number;
    WaterTemp: number;
    WaterLevel: number;
    FuelPress: number;
    OilTemp: number;
    OilPress: number;
    OilLevel: number;
    ManifoldPress: number;
    FuelLevel: number;
    Engine0_RPM: number;
    RFbrakeLinePress: number;
    RFcoldPressure: number;
    RFtempCL: number;
    RFtempCM: number;
    RFtempCR: number;
    RFwearL: number;
    RFwearM: number;
    RFwearR: number;
    LFbrakeLinePress: number;
    LFcoldPressure: number;
    LFtempCL: number;
    LFtempCM: number;
    LFtempCR: number;
    LFwearL: number;
    LFwearM: number;
    LFwearR: number;
    RRbrakeLinePress: number;
    RRcoldPressure: number;
    RRtempCL: number;
    RRtempCM: number;
    RRtempCR: number;
    RRwearL: number;
    RRwearM: number;
    RRwearR: number;
    LRbrakeLinePress: number;
    LRcoldPressure: number;
    LRtempCL: number;
    LRtempCM: number;
    LRtempCR: number;
    LRwearL: number;
    LRwearM: number;
    LRwearR: number;
    LRshockDefl: number;
    LRshockDefl_ST: Array<number>;
    LRshockVel: number;
    LRshockVel_ST: Array<number>;
    RRshockDefl: number;
    RRshockDefl_ST: Array<number>;
    RRshockVel: number;
    RRshockVel_ST: Array<number>;
    LFshockDefl: number;
    LFshockDefl_ST: Array<number>;
    LFshockVel: number;
    LFshockVel_ST: Array<number>;
    RFshockDefl: number;
    RFshockDefl_ST: Array<number>;
    RFshockVel: number;
    RFshockVel_ST: Array<number>;
  };
}
