import { ControlPanel } from './components/controlPanel/ControlPanel';
import { TyreWear } from './components/overlays/TyreWear';
import { InputTelemetry } from './components/overlays/InputTelemetry';
import { RelativeWidget } from './components/overlays/RelativeWidget';
import { TestComponent } from './components/overlays/TestComponent';
import { TrackPositionOverlay } from './components/overlays/TrackPositionOverlay';
import './App.css';

function App() {
  // Check if this is an overlay window
  const urlParams = new URLSearchParams(window.location.search);
  const overlayId = urlParams.get('overlay');
  const isAnchorMode = urlParams.get('anchorMode') === 'true';

  // Create a position indicator component for anchor mode
  const AnchorModeIndicator = () => (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '8px',
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        zIndex: 9999,
        cursor: 'move',
        userSelect: 'none',
      }}
    >
      Positioning Mode - Drag to position this overlay
    </div>
  );

  // Mock data for overlays
  const mockTyreWear = {
    frontLeft: 85.2,
    frontRight: 83.1,
    rearLeft: 78.5,
    rearRight: 80.1,
  };

  // If overlay parameter is present, render the specific overlay
  if (overlayId) {
    console.log('App: Rendering overlay with ID:', overlayId);

    // Render the chosen overlay with the anchor mode indicator if needed
    const renderOverlay = () => {
      switch (overlayId) {
        case 'tyre-wear':
          console.log('App: Rendering TyreWear overlay');
          return <TyreWear wear={mockTyreWear} />;
        case 'input-telemetry':
          console.log('App: Rendering InputTelemetry overlay');
          return <InputTelemetry />;
        case 'relative-widget':
          console.log('App: Rendering RelativeWidget overlay');
          return <RelativeWidget />;
        case 'telemetry-dashboard':
          console.log('App: Rendering TestComponent overlay');
          return <TestComponent />;
        case 'track-position': {
          console.log('App: Rendering TrackPositionOverlay');
          const track = urlParams.get('track') || 'spa';
          return <TrackPositionOverlay trackName={track} />;
        }
        default:
          console.log('App: Unknown overlay ID:', overlayId);
          return (
            <div style={{ color: 'white', padding: '20px', fontSize: '16px' }}>
              Unknown overlay: {overlayId}
            </div>
          );
      }
    };

    return (
      <>
        {isAnchorMode && <AnchorModeIndicator />}
        {renderOverlay()}
      </>
    );
  }

  // Always render the ControlPanel regardless of overlay mode
  console.log('App: Rendering ControlPanel');
  return <ControlPanel />;
}

export default App;
