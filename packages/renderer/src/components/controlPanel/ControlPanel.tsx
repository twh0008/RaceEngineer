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
  windowId?: string; // Track the overlay window ID
}

export const ControlPanel = () => {
  const [overlays, setOverlays] = useState<OverlayConfigExtended[]>([]);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { createOverlay, closeOverlay, closeAllOverlays } = useElectron();

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
    }  }, []);
    const toggleOverlay = async (overlayId: string) => {
    const overlay = overlays.find(o => o.id === overlayId);
    if (!overlay) return;

    // Update the overlay's enabled state
    const newEnabledState = !overlay.enabled;
    
    // Only create/close overlays if a session is active
    if (isConnected) {
      if (newEnabledState) {
        // Overlay is being enabled - create it
        console.log("Creating overlay:", overlay.name);
        if (createOverlay) {
          try {
            const windowId = await createOverlay(overlay);
            console.log(`Created overlay: ${overlay.name}, windowId:`, windowId);
            
            // Update state with the window ID
            setOverlays((prev) =>
              prev.map((o) =>
                o.id === overlayId
                  ? { ...o, enabled: true, windowId }
                  : o
              )
            );
          } catch (error) {
            console.error(`Failed to create overlay ${overlay.name}:`, error);
            // Still update the enabled state even if creation fails
            setOverlays((prev) =>
              prev.map((o) =>
                o.id === overlayId
                  ? { ...o, enabled: true }
                  : o
              )
            );
          }
        } else {
          // Just update the state if createOverlay isn't available
          setOverlays((prev) =>
            prev.map((o) =>
              o.id === overlayId
                ? { ...o, enabled: true }
                : o
            )
          );
        }
      } else {
        // Overlay is being disabled - close only this specific overlay
        console.log("Closing overlay:", overlay.name);
        
        if (overlay.windowId && closeOverlay) {
          try {
            await closeOverlay(overlay.windowId);
            console.log(`Closed overlay: ${overlay.name}, windowId: ${overlay.windowId}`);
            
            // Update state to mark overlay as disabled and remove windowId
            setOverlays((prev) =>
              prev.map((o) =>
                o.id === overlayId
                  ? { ...o, enabled: false, windowId: undefined }
                  : o
              )
            );
          } catch (error) {
            console.error(`Failed to close overlay ${overlay.name}:`, error);
            // Still update the state even if closing fails
            setOverlays((prev) =>
              prev.map((o) =>
                o.id === overlayId
                  ? { ...o, enabled: false, windowId: undefined }
                  : o
              )
            );
          }
        } else {
          // Just update the state if windowId or closeOverlay isn't available
          setOverlays((prev) =>
            prev.map((o) =>
              o.id === overlayId
                ? { ...o, enabled: false, windowId: undefined }
                : o
            )
          );
        }
      }
    } else {
      // Session not active, just update the state
      setOverlays((prev) =>
        prev.map((o) =>
          o.id === overlayId
            ? { ...o, enabled: newEnabledState }
            : o
        )
      );
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
    
    // First set the connection state to active
    setIsConnected(true);
    
    // Find all enabled overlays
    const enabledOverlays = overlays.filter((o) => o.enabled);
    console.log("Enabled overlays:", enabledOverlays);
    
    if (enabledOverlays.length === 0) {
      console.log("No overlays enabled");
      return;
    }

    console.log("isElectron:", !!window.electronAPI);
    console.log("createOverlay function:", createOverlay);

    // Create all enabled overlays
    if (!createOverlay) {
      console.error("createOverlay function is not available");
      return;
    }

    // Create a copy of the overlays array to update window IDs
    const updatedOverlays = [...overlays];

    for (const overlay of enabledOverlays) {
      console.log("Creating overlay:", overlay.name);
      try {
        const windowId = await createOverlay(overlay);
        console.log(`Created overlay: ${overlay.name}, windowId:`, windowId);
        
        // Update the window ID in our copy
        const index = updatedOverlays.findIndex(o => o.id === overlay.id);
        if (index !== -1) {
          updatedOverlays[index] = {
            ...updatedOverlays[index],
            windowId
          };
        }
      } catch (error) {
        console.error(`Failed to create overlay ${overlay.name}:`, error);
      }
    }

    // Update the state with all window IDs
    setOverlays(updatedOverlays);
  };  const stopSession = async () => {
    console.log("Stopping session...");
    
    // First close all overlay windows
    if (closeAllOverlays) {
      try {
        await closeAllOverlays();
        console.log("Closed all overlays");
      } catch (error) {
        console.error("Failed to close overlays:", error);
      }
    }
    
    // Then update the connection state and clear all window IDs
    setIsConnected(false);
    
    // Clear all window IDs since they're all closed now
    setOverlays(prev => prev.map(overlay => ({
      ...overlay,
      windowId: undefined
    })));
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
        </div>        <div className="panel-layout">
          {/* Left Panel - Overlay Selection */}
          <OverlaySelectionPanel
            overlays={overlays}
            selectedOverlay={selectedOverlay}
            onSelectOverlay={setSelectedOverlay}
            onToggleOverlay={toggleOverlay}
          />

          {/* Right Panel - Overlay Configuration */}
          <OverlayConfigPanel
            selectedOverlay={selectedOverlayData}
            onUpdateConfig={updateOverlayConfig}
          />
        </div>
      </div>
    </div>
  );
};
