import React from 'react';
import type { OverlayConfig } from '../../types/overlays';
import type { IRacingSessionInfo } from '@iracing/*';
import './styles/AnchorMode.css';
import './styles/StatusCardPanel.css';

interface StatusCardPanelProps {
  isConnected: boolean;
  enabledCount: number;
  isAnchorMode: boolean;
  anchorIcon: string;
  toggleAnchorMode: () => void;
  stopSession: () => void;
  startSession: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overlays: any[];
  updateOverlayProperties?: (overlayConfig: OverlayConfig) => Promise<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  windowElectronAPI: any;
  isIracingConnected?: boolean;
  iracingSessionInfo?: IRacingSessionInfo;
}

export const StatusCardPanel: React.FC<StatusCardPanelProps> = ({
  isConnected,
  enabledCount,
  isAnchorMode,
  anchorIcon,
  toggleAnchorMode,
  stopSession,
  startSession,
  windowElectronAPI,
  isIracingConnected,
  iracingSessionInfo,
}) => (
  <div className="status-card">
    <div className="status-header">
      <div className="status-info">
        <h3>Session Status: {isConnected ? 'Active' : 'Inactive'}</h3>
        <p>
          {isConnected
            ? `Running ${enabledCount} overlay${enabledCount !== 1 ? 's' : ''}`
            : `${enabledCount} overlay${enabledCount !== 1 ? 's' : ''} ready to start`}
        </p>
        {/* iRacing SDK Status */}
        <div className="iracing-sdk-status">
          <span>
            iRacing: {isIracingConnected ? 'Connected' : 'Not Connected'}
          </span>
        </div>
        {/* iRacing Session Info */}
        {iracingSessionInfo && isIracingConnected && (
          <div className="iracing-session-info compact">
            <h4 style={{ marginBottom: '4px' }}>Track Info</h4>
            <p>
              {iracingSessionInfo.data.WeekendInfo.TrackDisplayName} -{' '}
              {iracingSessionInfo.data.WeekendInfo.TrackLength}
            </p>
            <p>
              Official:{' '}
              {iracingSessionInfo.data.WeekendInfo.Official ? 'Yes' : 'No'},
              Participants: {iracingSessionInfo.data.DriverInfo.Drivers.length}
            </p>
          </div>
        )}
      </div>
      <div className="status-controls">
        {isConnected && (
          <button
            className={`anchor-mode-button ${isAnchorMode ? 'anchor-mode-button--active' : ''}`}
            onClick={toggleAnchorMode}
          >
            <img
              src={anchorIcon}
              alt="Anchor"
              className="anchor-mode-button__icon"
            />
            {isAnchorMode ? 'Save Positions' : 'Position Overlays'}
          </button>
        )}
        <button
          className={`session-button ${
            enabledCount === 0 || !windowElectronAPI
              ? 'session-button--disabled'
              : isConnected
                ? 'session-button--stop'
                : 'session-button--start'
          }`}
          disabled={enabledCount === 0 || !windowElectronAPI}
          onClick={isConnected ? stopSession : startSession}
        >
          {!windowElectronAPI
            ? 'Electron Required'
            : isConnected
              ? 'Stop Session'
              : 'Start Session'}
        </button>
      </div>
    </div>
    <div
      className={`anchor-mode-indicator${isAnchorMode ? '' : ' anchor-mode-indicator--hidden'}`}
    >
      <p className="anchor-mode-indicator__text">
        Anchor Mode Active: Position your overlays where you want them, then
        click "Save Positions"
      </p>
    </div>
  </div>
);
