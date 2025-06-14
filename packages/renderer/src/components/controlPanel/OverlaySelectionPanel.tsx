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

interface OverlaySelectionPanelProps {
  overlays: OverlayConfigExtended[];
  selectedOverlay: string | null;
  onSelectOverlay: (overlayId: string) => void;
}

export const OverlaySelectionPanel = ({ 
  overlays, 
  selectedOverlay, 
  onSelectOverlay 
}: OverlaySelectionPanelProps) => {
  return (
    <div style={{ width: '33.333333%', backgroundColor: '#1f2937', padding: '24px', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
        Available Overlays ({overlays.length})
      </h2>
      {overlays.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>Loading overlays...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {overlays.map((overlay) => (
            <div
              key={overlay.id}
              style={{
                padding: '16px',
                backgroundColor: selectedOverlay === overlay.id ? '#1e40af' : '#374151',
                borderRadius: '8px',
                cursor: 'pointer',
                border: selectedOverlay === overlay.id ? '2px solid #3b82f6' : '2px solid transparent'
              }}
              onClick={() => onSelectOverlay(overlay.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontWeight: 'bold' }}>{overlay.name}</h3>
                    {overlay.enabled && (
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                    )}
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '4px' }}>
                    {overlay.description}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
                    {overlay.size?.width}×{overlay.size?.height}px
                  </p>
                </div>
                <span style={{ color: '#9ca3af' }}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
