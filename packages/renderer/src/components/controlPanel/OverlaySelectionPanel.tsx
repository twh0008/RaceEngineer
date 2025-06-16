import './styles/OverlaySelectionPanel.css';
import { type OverlayCustomization } from '../../types/overlays';

interface OverlaySelectionPanelProps {
  overlays: OverlayCustomization[];
  selectedOverlay: string | null;
  onSelectOverlay: (overlayId: string) => void;
  onToggleOverlay: (overlayId: string) => void;
}

export const OverlaySelectionPanel = ({ 
  overlays, 
  selectedOverlay, 
  onSelectOverlay,
  onToggleOverlay
}: OverlaySelectionPanelProps) => {
  const handleToggleClick = (e: React.MouseEvent, overlayId: string) => {
    e.stopPropagation(); // Prevent selection of the overlay when clicking the toggle
    onToggleOverlay(overlayId);
  };

  return (
    <div className="overlay-selection-panel">
      <h2 className="heading">
        Available Overlays ({overlays.length})
      </h2>
      {overlays.length === 0 ? (
        <p className="loading">Loading overlays...</p>
      ) : (
        <div className="list">
          {overlays.map((overlay) => (            <div
              key={overlay.id}
              className={`item ${
                selectedOverlay === overlay.id ? 'item--selected' : ''
              } ${
                overlay.enabled ? 'item--enabled' : ''
              }`}
              onClick={() => onSelectOverlay(overlay.id)}
            >
              <div className="item-header">
                <div>
                  <div className="item-content">
                    <h3 className="item-title">{overlay.name}</h3>
                    {overlay.enabled && (
                      <div className="enabled-indicator"></div>
                    )}
                  </div>
                  <p className="item-description">
                    {overlay.description}
                  </p>
                  <p className="item-size">
                    {overlay.size?.width}×{overlay.size?.height}px
                  </p>
                </div>
                <div className="controls">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={overlay.enabled}
                      onChange={(e) => e.stopPropagation()} // Prevent selection when interacting with checkbox
                      onClick={(e) => handleToggleClick(e, overlay.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="arrow">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
