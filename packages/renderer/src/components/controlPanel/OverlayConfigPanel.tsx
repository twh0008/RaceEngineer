import type { OverlayCustomization } from '@/types/overlays';
import './styles/OverlayConfigPanel.css';


interface OverlayConfigPanelProps {
  selectedOverlay: OverlayCustomization;
  onUpdateConfig: (overlayId: string, key: string, value: string | number) => void;
}

export const OverlayConfigPanel = ({ 
  selectedOverlay, 
  onUpdateConfig 
}: OverlayConfigPanelProps) => {
  if (!selectedOverlay) {
    return (
      <div className="config-panel">
        <div className="empty">
          <div className="content">
            <h2 className="title">
              No Overlay Selected
            </h2>
            <p className="message">
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
        <div className="header">
          <div>
            <h2 className="header__title">
              {selectedOverlay.name}
            </h2>
            <p className="header__description">
              {selectedOverlay.description}
            </p>
          </div>
        </div>

        {/* Configuration Sections */}
        <div className="sections">
          
          {/* Size & Position Settings */}
          <div>
            <h3 className="section__title">
              Size & Position
            </h3>
            <div className="grid">
              <div>
                <label className="label">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={selectedOverlay.size?.width || ''}
                  onChange={(e) => onUpdateConfig(selectedOverlay.id, 'width', parseInt(e.target.value) || 0)}
                  className="input"
                  placeholder="Width in pixels"
                />
              </div>
              <div>
                <label className="label label--spaced">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={selectedOverlay.size?.height || ''}
                  onChange={(e) => onUpdateConfig(selectedOverlay.id, 'height', parseInt(e.target.value) || 0)}
                  className="input"
                  placeholder="Height in pixels"
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div>
            <h3 className="section__title">
              Appearance
            </h3>
            <div className="grid">
              <div className="field">
                <div>
                  <label className="label">
                    Text Color
                  </label>
                  <div className="color-container">
                    <input
                      type="color"
                      value={selectedOverlay.textColor}
                      onChange={(e) => onUpdateConfig(selectedOverlay.id, 'textColor', e.target.value)}
                      className="color-input"
                    />
                    <span className="color-value">
                      {selectedOverlay.textColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="label">
                    Background Color
                  </label>
                  <div className="color-container">
                    <input
                      type="color"
                      value={selectedOverlay.backgroundColor}
                      onChange={(e) => onUpdateConfig(selectedOverlay.id, 'backgroundColor', e.target.value)}
                      className="color-input"
                    />
                    <span className="color-value">
                      {selectedOverlay.backgroundColor}
                    </span>
                  </div>
                </div>
              </div>
              <div className="field">
                <div>
                  <label className="label">
                    Opacity: {selectedOverlay.opacity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={selectedOverlay.opacity}
                    onChange={(e) => onUpdateConfig(selectedOverlay.id, 'opacity', parseInt(e.target.value))}
                    className="range"
                  />
                </div>
                <div>
                  <label className="label">
                    Font Size: {selectedOverlay.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={selectedOverlay.fontSize}
                    onChange={(e) => onUpdateConfig(selectedOverlay.id, 'fontSize', parseInt(e.target.value))}
                    className="range"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div>
            <h3 className="section__title">
              Performance
            </h3>
            <div>
              <label className="label">
                Update Rate
              </label>
              <select
                value={selectedOverlay.updateRate}
                onChange={(e) => onUpdateConfig(selectedOverlay.id, 'updateRate', parseInt(e.target.value))}
                className="select"
              >
                <option value={50}>20 FPS (50ms)</option>
                <option value={100}>10 FPS (100ms)</option>
                <option value={200}>5 FPS (200ms)</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="section__title">
              Preview
            </h3>
            <div 
              className="preview"
              style={{
                backgroundColor: selectedOverlay.backgroundColor,
                color: selectedOverlay.textColor,
                opacity: selectedOverlay.opacity / 100,
                fontSize: `${selectedOverlay.fontSize}px`
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
