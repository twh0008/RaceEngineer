import type { OverlayConfig } from '../../types/overlays';

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
  onToggleOverlay: (overlayId: string) => void;
  onUpdateConfig: (overlayId: string, key: string, value: string | number) => void;
}

export const OverlayConfigPanel = ({ 
  selectedOverlay, 
  onToggleOverlay, 
  onUpdateConfig 
}: OverlayConfigPanelProps) => {
  if (!selectedOverlay) {
    return (
      <div style={{ width: '66.666667%', backgroundColor: '#1f2937', padding: '24px', borderRadius: '8px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          minHeight: '400px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#9ca3af', marginBottom: '8px' }}>
              No Overlay Selected
            </h2>
            <p style={{ color: '#6b7280' }}>
              Select an overlay from the left panel to configure its settings
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '66.666667%', backgroundColor: '#1f2937', padding: '24px', borderRadius: '8px' }}>
      <div>
        {/* Header with Title and Enable/Disable */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #374151'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px', fontWeight: 'bold' }}>
              {selectedOverlay.name}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              {selectedOverlay.description}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              color: selectedOverlay.enabled ? '#10b981' : '#ef4444',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {selectedOverlay.enabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              onClick={() => onToggleOverlay(selectedOverlay.id)}
              style={{
                backgroundColor: selectedOverlay.enabled ? '#ef4444' : '#10b981',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {selectedOverlay.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Configuration Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Size & Position Settings */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '12px' }}>
              Size & Position
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '6px' }}>
                  Width (px)
                </label>
                <input
                  type="number"
                  value={selectedOverlay.size?.width || ''}
                  onChange={(e) => onUpdateConfig(selectedOverlay.id, 'width', parseInt(e.target.value) || 0)}
                  style={{
                    width: '75%',
                    padding: '8px 12px',
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Width in pixels"
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '6px', marginLeft: '4px' }}>
                  Height (px)
                </label>
                <input
                  type="number"
                  value={selectedOverlay.size?.height || ''}
                  onChange={(e) => onUpdateConfig(selectedOverlay.id, 'height', parseInt(e.target.value) || 0)}
                  style={{
                    width: '75%',
                    padding: '8px 12px',
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Height in pixels"
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '12px' }}>
              Appearance
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '6px' }}>
                    Text Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={selectedOverlay.config.textColor}
                      onChange={(e) => onUpdateConfig(selectedOverlay.id, 'textColor', e.target.value)}
                      style={{
                        width: '40px',
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid #4b5563',
                        backgroundColor: '#374151',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                      {selectedOverlay.config.textColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '6px' }}>
                    Background Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={selectedOverlay.config.backgroundColor}
                      onChange={(e) => onUpdateConfig(selectedOverlay.id, 'backgroundColor', e.target.value)}
                      style={{
                        width: '40px',
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid #4b5563',
                        backgroundColor: '#374151',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>
                      {selectedOverlay.config.backgroundColor}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '6px' }}>
                    Opacity: {selectedOverlay.config.opacity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={selectedOverlay.config.opacity}
                    onChange={(e) => onUpdateConfig(selectedOverlay.id, 'opacity', parseInt(e.target.value))}
                    style={{
                      width: '75%',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: '#374151',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '6px' }}>
                    Font Size: {selectedOverlay.config.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={selectedOverlay.config.fontSize}
                    onChange={(e) => onUpdateConfig(selectedOverlay.id, 'fontSize', parseInt(e.target.value))}
                    style={{
                      width: '75%',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: '#374151',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '12px' }}>
              Performance
            </h3>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '6px' }}>
                Update Rate
              </label>
              <select
                value={selectedOverlay.config.updateRate}
                onChange={(e) => onUpdateConfig(selectedOverlay.id, 'updateRate', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <option value={50}>20 FPS (50ms)</option>
                <option value={100}>10 FPS (100ms)</option>
                <option value={200}>5 FPS (200ms)</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '12px' }}>
              Preview
            </h3>
            <div 
              style={{
                padding: '16px',
                borderRadius: '6px',
                border: '1px solid #4b5563',
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
