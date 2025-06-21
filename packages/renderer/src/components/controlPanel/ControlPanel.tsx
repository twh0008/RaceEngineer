import { useState, useEffect } from "react";
import { AVAILABLE_OVERLAYS, type OverlayConfig } from "../../types/overlays";
import { useElectron } from "../../hooks/useElectron";
import { OverlaySelectionPanel } from "./OverlaySelectionPanel";
import { OverlayConfigPanel } from "./OverlayConfigPanel";
import { StatusCardPanel } from "./statusCardPanel";
import dragHandle from "../../assets/drag-handle.svg";
import anchorIcon from "../../assets/anchor-icon.svg";
import "./styles/ControlPanel.css";
import "./styles/AnchorMode.css";

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
  const [isAnchorMode, setIsAnchorMode] = useState(false);
  const [savedPositions, setSavedPositions] = useState<Record<string, { x: number; y: number }>>({});
  const {
    createOverlay,
    closeOverlay,
    closeAllOverlays,
    getOverlayPosition, 
    saveOverlayPositions, 
    loadOverlayPositions,
    updateOverlayProperties
  } = useElectron();

  useEffect(() => {
    console.log("Available overlays:", AVAILABLE_OVERLAYS);
    
    // Load saved positions if available
    const loadSavedPositions = async () => {
      try {
        if (loadOverlayPositions) {
          const positions = await loadOverlayPositions();
          console.log("Loaded saved positions:", positions);
          setSavedPositions(positions || {});
          
          // Initialize overlays with saved positions
          const initialOverlays = AVAILABLE_OVERLAYS.map((overlay) => {
            const savedPosition = positions?.[overlay.id];
            
            return {
              id: overlay.id,
              name: overlay.name,
              description: overlay.description,
              enabled: false,
              position: savedPosition || { x: 100, y: 100 },
              size: overlay.defaultSize,
              config: {
                textColor: "#ffffff",
                backgroundColor: "#1f2937",
                opacity: 90,
                fontSize: 14,
                updateRate: 100,
              },
            };
          });
          
          console.log("Initial overlays:", initialOverlays);
          setOverlays(initialOverlays);
          if (initialOverlays.length > 0) {
            setSelectedOverlay(initialOverlays[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load saved positions:", error);
        
        // Fall back to default positions if loading fails
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
        
        console.log("Initial overlays (default):", initialOverlays);
        setOverlays(initialOverlays);
        if (initialOverlays.length > 0) {
          setSelectedOverlay(initialOverlays[0].id);
        }
      }
    };
    
    loadSavedPositions();
  }, [loadOverlayPositions]);    const toggleOverlay = async (overlayId: string) => {
    const overlay = overlays.find(o => o.id === overlayId);
    if (!overlay) return;

    // Update the overlay's enabled state
    const newEnabledState = !overlay.enabled;
    
    // Only create/close overlays if a session is active
    if (isConnected) {
      if (newEnabledState) {        // Overlay is being enabled - create it
        console.log("Creating overlay:", overlay.name);
        if (createOverlay) {
          try {
            // Set anchor mode flag when creating overlays if anchor mode is active
            const overlayWithAnchorMode = {
              ...overlay,
              anchorMode: isAnchorMode
            };
            
            const windowId = await createOverlay(overlayWithAnchorMode);
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
  const enabledCount = overlays.filter((o) => o.enabled).length;    const startSession = async () => {
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
        // Set anchor mode flag when creating overlays if anchor mode is active
        const overlayWithAnchorMode = {
          ...overlay,
          anchorMode: isAnchorMode
        };
        
        const windowId = await createOverlay(overlayWithAnchorMode);
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
  };const stopSession = async () => {
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
  };  const toggleAnchorMode = async () => {
    if (!isConnected) {
      console.log("Cannot toggle anchor mode when session is not active");
      return;
    }
    
    const newAnchorModeState = !isAnchorMode;
    setIsAnchorMode(newAnchorModeState);
      // Define newPositions outside the if block so we can use it for both cases
    const newPositions: Record<string, { x: number; y: number }> = {...savedPositions};
    
    if (!newAnchorModeState) {
      // Exiting anchor mode - save positions
      
      // Get positions of all active overlays
      for (const overlay of overlays) {
        if (overlay.enabled && overlay.windowId) {
          try {
            const position = await getOverlayPosition(overlay.id);
            if (position) {
              newPositions[overlay.id] = position;
              console.log(`Saved position for ${overlay.name}:`, position);
            }
          } catch (error) {
            console.error(`Failed to get position for ${overlay.name}:`, error);
          }
        }
      }
      
      // Save positions
      try {
        await saveOverlayPositions(newPositions);
        console.log("Saved all overlay positions");
        
        // Update state with new positions
        setSavedPositions(newPositions);
        setOverlays(prev => 
          prev.map(overlay => ({
            ...overlay,
            position: newPositions[overlay.id] || overlay.position
          }))
        );
      } catch (error) {
        console.error("Failed to save overlay positions:", error);
      }
    }
    
    // Update all active overlays with the new anchor mode state
    const enabledOverlays = overlays.filter(o => o.enabled);
    for (const overlay of enabledOverlays) {
      if (updateOverlayProperties) {
        try {
          // Include both anchor mode and position in the update
          const overlayWithUpdates = {
            ...overlay,
            anchorMode: newAnchorModeState,
            position: newPositions[overlay.id] || overlay.position
          };
          await updateOverlayProperties(overlayWithUpdates);
          console.log(`Updated overlay ${overlay.name} with anchor mode ${newAnchorModeState} and position:`, newPositions[overlay.id] || overlay.position);
        } catch (error) {
          console.error(`Failed to update overlay ${overlay.name}:`, error);
        }
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
        <StatusCardPanel
          isConnected={isConnected}
          enabledCount={enabledCount}
          isAnchorMode={isAnchorMode}
          anchorIcon={anchorIcon}
          toggleAnchorMode={toggleAnchorMode}
          stopSession={stopSession}
          startSession={startSession}
          overlays={overlays}
          updateOverlayProperties={updateOverlayProperties}
          windowElectronAPI={window.electronAPI}
        />
      </div>
      <div className="panel-layout">
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
  );
};
