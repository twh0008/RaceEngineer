import { useState, useEffect } from "react";
import { AVAILABLE_OVERLAYS, type OverlayConfig } from "../../types/overlays";
import { useElectron } from "../../hooks/useElectron";
import { OverlaySelectionPanel } from "./OverlaySelectionPanel";
import { OverlayConfigPanel } from "./OverlayConfigPanel";
import dragHandle from "../../assets/drag-handle.svg";
import "./styles/ControlPanel.css";

interface OverlayConfigExtended extends OverlayConfig {
  config: {
    textColor: string;
    backgroundColor: string;
    opacity: number;
    fontSize: number;
    updateRate: number;
  };
}

export const ControlPanel = () => {
  const [overlays, setOverlays] = useState<OverlayConfigExtended[]>([]);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { createOverlay, closeAllOverlays } = useElectron();

  useEffect(() => {
    console.log("Available overlays:", AVAILABLE_OVERLAYS);
    const initialOverlays = AVAILABLE_OVERLAYS.map((overlay) => ({
      id: overlay.id,
      name: overlay.name,
      description: overlay.description,
      enabled: false,
      position: { x: 100, y: 100 },
      size: overlay.defaultSize,
      config: {
        textColor: "#ffffff",
        backgroundColor: "#1f2937",
        opacity: 90,
        fontSize: 14,
        updateRate: 100,
      },
    }));
    console.log("Initial overlays:", initialOverlays);
    setOverlays(initialOverlays);
    if (initialOverlays.length > 0) {
      setSelectedOverlay(initialOverlays[0].id);
    }
  }, []);
  const toggleOverlay = async (overlayId: string) => {
    const overlay = overlays.find(o => o.id === overlayId);
    if (!overlay) return;

    setOverlays((prev) =>
      prev.map((o) =>
        o.id === overlayId
          ? { ...o, enabled: !o.enabled }
          : o
      )
    );

    // Create or close overlay window based on new enabled state
    if (!overlay.enabled) {
      // Currently disabled, about to enable - create overlay
      console.log("Creating overlay:", overlay.name);
      if (createOverlay) {
        try {
          const result = await createOverlay(overlay);
          console.log(`Created overlay: ${overlay.name}, result:`, result);
        } catch (error) {
          console.error(`Failed to create overlay ${overlay.name}:`, error);
        }
      }
    } else {
      // Currently enabled, about to disable - close overlay
      console.log("Closing overlay:", overlay.name);
      // Note: closeOverlay would need overlay window ID, for now we'll use closeAllOverlays
      // In a full implementation, we'd track window IDs per overlay
    }
  };

  const updateOverlayConfig = (
    overlayId: string,
    key: string,
    value: string | number
  ) => {
    setOverlays((prev) =>
      prev.map((overlay) => {
        if (overlay.id === overlayId) {
          if (key === "width" || key === "height") {
            return {
              ...overlay,
              size: {
                width: overlay.size?.width || 0,
                height: overlay.size?.height || 0,
                [key]: value as number,
              },
            };
          } else {
            return {
              ...overlay,
              config: {
                ...overlay.config,
                [key]: value,
              },
            };
          }
        }
        return overlay;
      })
    );
  };

  const selectedOverlayData = selectedOverlay
    ? overlays.find((o) => o.id === selectedOverlay)
    : null;
  const enabledCount = overlays.filter((o) => o.enabled).length;
  
  const startSession = async () => {
    console.log("Starting session...");
    console.log(
      "Enabled overlays:",
      overlays.filter((o) => o.enabled)
    );
    console.log("isElectron:", !!window.electronAPI);
    console.log("createOverlay function:", createOverlay);

    setIsConnected(true);
    const enabledOverlays = overlays.filter((o) => o.enabled);

    if (enabledOverlays.length === 0) {
      console.log("No overlays enabled");
      return;
    }

    for (const overlay of enabledOverlays) {
      console.log("Attempting to create overlay:", overlay.name);
      if (createOverlay) {
        try {
          const result = await createOverlay(overlay);
          console.log(`Created overlay: ${overlay.name}, result:`, result);
        } catch (error) {
          console.error(`Failed to create overlay ${overlay.name}:`, error);
        }
      } else {
        console.error("createOverlay function is not available");
      }
    }
  };

  const stopSession = async () => {
    setIsConnected(false);
    if (closeAllOverlays) {
      try {
        await closeAllOverlays();
        console.log("Closed all overlays");
      } catch (error) {
        console.error("Failed to close overlays:", error);
      }
    }
  };

  return (
    <div className="control-panel">
      {/* Add draggable title bar */}
      <div className="titlebar">
        <img
          src={dragHandle}
          alt="Drag"
          className="titlebar-icon"
        />
        <h1 className="titlebar-heading">
          Race Engineer Control Panel
        </h1>
      </div>

      <div className="panel-content">
        <div className="status-card">
          <div className="status-header">
            <div className="status-info">
              <h3>Session Status: {isConnected ? "Active" : "Inactive"}</h3>
              <p>
                {isConnected
                  ? `Running ${enabledCount} overlay${
                      enabledCount !== 1 ? "s" : ""
                    }`
                  : `${enabledCount} overlay${
                      enabledCount !== 1 ? "s" : ""
                    } ready to start`}
              </p>
            </div>
            <button
              className={`session-button ${
                enabledCount === 0 || !window.electronAPI
                  ? "session-button--disabled"
                  : isConnected
                  ? "session-button--stop"
                  : "session-button--start"
              }`}
              disabled={enabledCount === 0 || !window.electronAPI}
              onClick={isConnected ? stopSession : startSession}
            >
              {!window.electronAPI
                ? "Electron Required"
                : isConnected
                ? "Stop Session"
                : "Start Session"}
            </button>
          </div>
        </div>
        <div className="panel-layout">
          {/* Left Panel - Overlay Selection */}
          <OverlaySelectionPanel
            overlays={overlays}
            selectedOverlay={selectedOverlay}
            onSelectOverlay={setSelectedOverlay}
          />

          {/* Right Panel - Overlay Configuration */}
          <OverlayConfigPanel
            selectedOverlay={selectedOverlayData}
            onToggleOverlay={toggleOverlay}
            onUpdateConfig={updateOverlayConfig}
          />
        </div>
      </div>
    </div>
  );
};
