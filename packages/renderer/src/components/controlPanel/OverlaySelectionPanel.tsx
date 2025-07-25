import type { OverlayConfig } from '../../types/overlays';
import './styles/OverlaySelectionPanel.css';
import React from 'react';

interface OverlayConfigExtended extends OverlayConfig {
  config: {
    textColor: string;
    backgroundColor: string;
    opacity: number;
    fontSize: number;
    updateRate: number;
  };
}

interface OverlaySelectionPanelProps {
  overlays: OverlayConfigExtended[];
  selectedOverlay: string | null;
  onSelectOverlay: (overlayId: string) => void;
  onToggleOverlay: (overlayId: string) => void;
}

export const OverlaySelectionPanel = ({
  overlays,
  selectedOverlay,
  onSelectOverlay,
  onToggleOverlay,
}: OverlaySelectionPanelProps) => {
  const handleToggleClick = (e: React.MouseEvent, overlayId: string) => {
    e.stopPropagation(); // Prevent selection of the overlay when clicking the toggle
    onToggleOverlay(overlayId);
  };

  return (
    <div className="overlay-selection-panel">
      <h2 className="overlay-selection-panel__heading">
        Available Overlays ({overlays.length})
      </h2>
      {overlays.length === 0 ? (
        <p className="overlay-selection-panel__loading">Loading overlays...</p>
      ) : (
        <div className="overlay-selection-panel__list">
          {overlays.map((overlay) => (
            <div
              key={overlay.id}
              className={`overlay-selection-panel__item ${
                selectedOverlay === overlay.id
                  ? 'overlay-selection-panel__item--selected'
                  : ''
              } ${
                overlay.enabled ? 'overlay-selection-panel__item--enabled' : ''
              }`}
              onClick={() => onSelectOverlay(overlay.id)}
            >
              <div className="overlay-selection-panel__item-table">
                <div className="overlay-selection-panel__item-header-cell">
                  <h3 className="overlay-selection-panel__item-title">
                    {overlay.name}
                  </h3>
                </div>
                <div className="overlay-selection-panel__item-size-cell">
                  <span className="overlay-selection-panel__item-size">
                    {overlay.size?.width}×{overlay.size?.height}px
                  </span>
                </div>
                <div className="overlay-selection-panel__item-description-cell">
                  <p className="overlay-selection-panel__item-description">
                    {overlay.description}
                  </p>
                </div>
                <div className="overlay-selection-panel__controls-cell">
                  <div className="overlay-selection-panel__controls">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={overlay.enabled}
                        onChange={(e) => e.stopPropagation()} // Prevent selection when interacting with checkbox
                        onClick={(e) => handleToggleClick(e, overlay.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="overlay-selection-panel__arrow">→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
