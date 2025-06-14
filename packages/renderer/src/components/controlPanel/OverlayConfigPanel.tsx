import type { OverlayConfig } from '../../types/overlays';
import './styles/OverlayConfigPanel.css';

interface OverlayConfigExtended extends OverlayConfig {
  config: {
    textColor: string;
    backgroundColor: string;
    opacity: number;
    fontSize: number;
    updateRate: number;
  };
}

interface OverlayConfigPanelProps {
  selectedOverlay: OverlayConfigExtended | null | undefined;
  onUpdateConfig: (overlayId: string, key: string, value: string | number) => void;
}

export const OverlayConfigPanel = ({ 
  selectedOverlay, 
  onUpdateConfig 
}: OverlayConfigPanelProps) => {
  if (!selectedOverlay) {
    return (
      <div className="config-panel">
        <div className="config-panel-empty">
          <div className="config-panel-empty__content">
            <h2 className="config-panel-empty__title">
              No Overlay Selected
            </h2>
            <p className="config-panel-empty__message">
              Select an overlay from the left panel to configure its settings
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="config-panel">
      <div>
        {/* Header with Title */}
        <div className="config-panel-header">
          <div>
            <h2 className="config-panel-header__title">
              {selectedOverlay.name}
            </h2>
            <p className="config-panel-header__description">
              {selectedOverlay.description}
            </p>
          </div>
        </div>

        {/* Configuration Sections */}
        <div className="config-panel-sections">
          
          {/* Size & Position Settings */}
          <div>
            <h3 className="config-panel-section__title">
              Size & Position
            </h3>
            <div className="config-panel-grid">
              <div>
                <label className="config-panel-label">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={selectedOverlay.size?.width || ''}
                  onChange={(e) => onUpdateConfig(selectedOverlay.id, 'width', parseInt(e.target.value) || 0)}
                  className="config-panel-input"
                  placeholder="Width in pixels"
                />
              </div>
              <div>
                <label className="config-panel-label config-panel-label--spaced">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={selectedOverlay.size?.height || ''}
                  onChange={(e) => onUpdateConfig(selectedOverlay.id, 'height', parseInt(e.target.value) || 0)}
                  className="config-panel-input"
                  placeholder="Height in pixels"
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div>
            <h3 className="config-panel-section__title">
              Appearance
            </h3>
            <div className="config-panel-grid">
              <div className="config-panel-field">
                <div>
                  <label className="config-panel-label">
                    Text Color
                  </label>
                  <div className="config-panel-color-container">
                    <input
                      type="color"
                      value={selectedOverlay.config.textColor}
                      onChange={(e) => onUpdateConfig(selectedOverlay.id, 'textColor', e.target.value)}
                      className="config-panel-color-input"
                    />
                    <span className="config-panel-color-value">
                      {selectedOverlay.config.textColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="config-panel-label">
                    Background Color
                  </label>
                  <div className="config-panel-color-container">
                    <input
                      type="color"
                      value={selectedOverlay.config.backgroundColor}
                      onChange={(e) => onUpdateConfig(selectedOverlay.id, 'backgroundColor', e.target.value)}
                      className="config-panel-color-input"
                    />
                    <span className="config-panel-color-value">
                      {selectedOverlay.config.backgroundColor}
                    </span>
                  </div>
                </div>
              </div>
              <div className="config-panel-field">
                <div>
                  <label className="config-panel-label">
                    Opacity: {selectedOverlay.config.opacity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={selectedOverlay.config.opacity}
                    onChange={(e) => onUpdateConfig(selectedOverlay.id, 'opacity', parseInt(e.target.value))}
                    className="config-panel-range"
                  />
                </div>
                <div>
                  <label className="config-panel-label">
                    Font Size: {selectedOverlay.config.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={selectedOverlay.config.fontSize}
                    onChange={(e) => onUpdateConfig(selectedOverlay.id, 'fontSize', parseInt(e.target.value))}
                    className="config-panel-range"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div>
            <h3 className="config-panel-section__title">
              Performance
            </h3>
            <div>
              <label className="config-panel-label">
                Update Rate
              </label>
              <select
                value={selectedOverlay.config.updateRate}
                onChange={(e) => onUpdateConfig(selectedOverlay.id, 'updateRate', parseInt(e.target.value))}
                className="config-panel-select"
              >
                <option value={50}>20 FPS (50ms)</option>
                <option value={100}>10 FPS (100ms)</option>
                <option value={200}>5 FPS (200ms)</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="config-panel-section__title">
              Preview
            </h3>
            <div 
              className="config-panel-preview"
              style={{
                backgroundColor: selectedOverlay.config.backgroundColor,
                color: selectedOverlay.config.textColor,
                opacity: selectedOverlay.config.opacity / 100,
                fontSize: `${selectedOverlay.config.fontSize}px`
              }}
            >
              This is how your {selectedOverlay.name.toLowerCase()} will look with current settings.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
