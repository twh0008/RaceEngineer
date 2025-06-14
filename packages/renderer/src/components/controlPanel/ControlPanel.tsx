import { useState, useEffect } from "react";
import { AVAILABLE_OVERLAYS, type OverlayConfig } from "../../types/overlays";
import { useElectron } from "../../hooks/useElectron";
import { OverlaySelectionPanel } from "./OverlaySelectionPanel";
import { OverlayConfigPanel } from "./OverlayConfigPanel";
import dragHandle from "../../assets/drag-handle.svg";

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
    <div
      style={{
        maxWidth: "fit-content",
        maxHeight: "fit-content",
        backgroundColor: "#111827",
        color: "white",
        padding: "0", 
        margin: "0",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "none",
        borderRadius: "0",
        boxSizing: "border-box"
      }}
    >
      {/* Add draggable title bar */}
      <div
        className="titlebar"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: "#0f172a",
          borderBottom: "1px solid #1f2937",
          width: "100%"
        }}
      >
        <img
          src={dragHandle}
          alt="Drag"
          style={{ width: "16px", marginRight: "8px" }}
        />
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            margin: "0",
          }}
        >
          Race Engineer Control Panel
        </h1>
      </div>

      <div style={{ 
        padding: "16px", 
        flexGrow: 1,
        overflow: "auto",
        width: "100%"
      }}>
        <div
          style={{
            backgroundColor: "#1f2937",
            padding: "24px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ fontWeight: "bold" }}>
                Session Status: {isConnected ? "Active" : "Inactive"}
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
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
              style={{
                backgroundColor:
                  enabledCount === 0 || !window.electronAPI
                    ? "#6b7280"
                    : isConnected
                    ? "#ef4444"
                    : "#059669",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor:
                  enabledCount === 0 || !window.electronAPI
                    ? "not-allowed"
                    : "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
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
        <div style={{ display: "flex", gap: "24px", minHeight: "600px" }}>
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
