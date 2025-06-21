import React from "react";
import type { OverlayConfig } from "../../types/overlays";
import "./styles/AnchorMode.css";
import "./styles/StatusCardPanel.css";

interface StatusCardPanelProps {
  isConnected: boolean;
  enabledCount: number;
  isAnchorMode: boolean;
  anchorIcon: string;
  toggleAnchorMode: () => void;
  stopSession: () => void;
  startSession: () => void;
  overlays: any[];
  updateOverlayProperties?: (overlayConfig: OverlayConfig) => Promise<string>;
  windowElectronAPI: any;
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
}) => (
  <div className="status-card">
    <div className="status-header">
      <div className="status-info">
        <h3>Session Status: {isConnected ? "Active" : "Inactive"}</h3>
        <p>
          {isConnected
            ? `Running ${enabledCount} overlay${enabledCount !== 1 ? "s" : ""}`
            : `${enabledCount} overlay${enabledCount !== 1 ? "s" : ""} ready to start`}
        </p>
      </div>
      <div className="status-controls">
        {isConnected && (
          <button
            className={`anchor-mode-button ${isAnchorMode ? 'anchor-mode-button--active' : ''}`}
            onClick={toggleAnchorMode}
          >
            <img src={anchorIcon} alt="Anchor" className="anchor-mode-button__icon" />
            {isAnchorMode ? "Save Positions" : "Position Overlays"}
          </button>
        )}
        <button
          className={`session-button ${
            enabledCount === 0 || !windowElectronAPI
              ? "session-button--disabled"
              : isConnected
              ? "session-button--stop"
              : "session-button--start"
          }`}
          disabled={enabledCount === 0 || !windowElectronAPI}
          onClick={isConnected ? stopSession : startSession}
        >
          {!windowElectronAPI
            ? "Electron Required"
            : isConnected
            ? "Stop Session"
            : "Start Session"}
        </button>
      </div>
    </div>
    {isAnchorMode && (
      <div className="anchor-mode-indicator">
        <p className="anchor-mode-indicator__text">
          Anchor Mode Active: Position your overlays where you want them, then click "Save Positions"
        </p>
      </div>
    )}
  </div>
);