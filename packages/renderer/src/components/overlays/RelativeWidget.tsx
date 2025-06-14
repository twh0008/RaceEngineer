import { useState, useEffect, useRef, useCallback } from "react";

interface RelativeData {
  position: number;
  driver: string;
  gap: string;
  lapTime: string;
  isPlayer?: boolean;
}

// Pool of driver names for random generation
const driverPool = [
  "M. VERSTAPPEN", "L. HAMILTON", "C. LECLERC", "G. RUSSELL", 
  "S. PEREZ", "F. ALONSO", "L. NORRIS", "O. PIASTRI",
  "C. SAINZ", "N. HULKENBERG", "V. BOTTAS", "A. ALBON",
  "E. OCON", "P. GASLY", "Y. TSUNODA", "K. MAGNUSSEN",
  "D. RICCIARDO", "L. STROLL", "Z. GUANYU", "N. DE VRIES"
];

export const RelativeWidget = () => {
  const [relativeData, setRelativeData] = useState<RelativeData[]>([]);
  const [playerPosition, setPlayerPosition] = useState(5);
  // Use refs instead of state to avoid re-renders
  const driversRef = useRef<string[]>([]);
  const gapsRef = useRef<number[]>([]);
  
  // Define updatePositionDisplay with useCallback to prevent recreating on each render
  const updatePositionDisplay = useCallback(() => {
    // Generate positions display
    const positions = [];
    for (let i = 0; i < 5; i++) {
      const actualPosition = playerPosition - 2 + i;
      const isPlayer = i === 2;
      
      if (isPlayer) {
        positions.push({
          position: actualPosition,
          driver: "YOU",
          gap: "0.000",
          lapTime: `1:3${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 900 + 100)}`,
          isPlayer: true
        });
      } else {
        const gap = gapsRef.current[i];
        const gapString = gap >= 0 ? `+${Math.abs(gap).toFixed(3)}` : `-${Math.abs(gap).toFixed(3)}`;
        
        positions.push({
          position: actualPosition,
          driver: driversRef.current[i],
          gap: gapString,
          lapTime: `1:3${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 900 + 100)}`
        });
      }
    }
    
    setRelativeData(positions);
  }, [playerPosition]);
    // Initialize or reset drivers when position changes
  useEffect(() => {
    const initializeDrivers = () => {
      const shuffledDrivers = [...driverPool].sort(() => Math.random() - 0.5);
      const driversAroundPlayer = [];
      const initialGaps = [];
      
      for (let i = 0; i < 5; i++) {
        if (i === 2) { // Player position (middle)
          driversAroundPlayer.push("YOU");
          initialGaps.push(0);
        } else {
          const driverIndex = Math.abs(i - 2) - 1;
          driversAroundPlayer.push(shuffledDrivers[driverIndex] || driverPool[driverIndex]);
          // Initial gaps: ahead drivers have positive gaps, behind have negative
          initialGaps.push((i - 2) * (1 + Math.random() * 2)); // 1-3 seconds apart
        }
      }
      
      driversRef.current = driversAroundPlayer;
      gapsRef.current = initialGaps;
      
      // Set initial relative data
      updatePositionDisplay();
    };
    
    initializeDrivers();
  }, [playerPosition, updatePositionDisplay]);
    // Update gap simulation on interval
  useEffect(() => {
    const updateRaceData = () => {
      if (driversRef.current.length === 0 || gapsRef.current.length === 0) return;
      
      // Simulate realistic gap changes with millisecond precision
      const newGaps = [...gapsRef.current];
      
      // Update gaps gradually (simulate racing dynamics)
      for (let i = 0; i < newGaps.length; i++) {
        if (i === 2) continue; // Skip player position
        
        // Small random change in gap (-0.05 to +0.05 seconds)
        const change = (Math.random() - 0.5) * 0.1;
        newGaps[i] += change;
        
        // Check for overtakes (gap gets very close to 0)
        if (Math.abs(newGaps[i]) < 0.1 && Math.random() < 0.2) {
          // Simulate overtake
          const isAhead = i < 2;
          if (isAhead && newGaps[i] > 0) {
            // Player overtakes car ahead
            setTimeout(() => setPlayerPosition(prev => Math.max(1, prev - 1)), 1000);
          } else if (!isAhead && newGaps[i] < 0) {
            // Car behind overtakes player
            setTimeout(() => setPlayerPosition(prev => Math.min(20, prev + 1)), 1000);
          }
        }
      }
      
      // Update the gaps without triggering re-render
      gapsRef.current = newGaps;
      
      // Update the UI display
      updatePositionDisplay();
    };
    
    // Update race data frequently for smooth gap changes
    const interval = setInterval(updateRaceData, 100); // Update every 100ms for smooth changes
    
    return () => clearInterval(interval);
  }, [updatePositionDisplay]); // Only depends on updatePositionDisplay, which includes playerPosition
  const containerStyle = {
    position: 'fixed' as const,
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    pointerEvents: 'auto' as const,
    cursor: 'move',
    userSelect: 'none' as const,
    WebkitAppRegion: 'drag' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '320px',
    margin: 'auto'
  };
  const widgetStyle = {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: '8px',
    border: '1px solid #374151',
    overflow: 'hidden'
  };

  const headerStyle = {
    backgroundColor: '#1f2937',
    padding: '8px 12px',
    borderBottom: '1px solid #374151'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as const
  };

  const rowStyle = (isPlayer?: boolean, isEven?: boolean) => ({
    backgroundColor: isPlayer 
      ? '#3b82f6' 
      : isEven 
        ? 'rgba(31, 41, 55, 0.6)' 
        : 'rgba(17, 24, 39, 0.6)',
    borderBottom: '1px solid #374151'
  });

  const cellStyle = {
    padding: '4px 8px',
    fontSize: '0.875rem',
    fontFamily: 'monospace'
  };

  const getGapColor = (gap: string) => {
    if (gap.startsWith('+')) return '#10b981'; // green
    if (gap.startsWith('-')) return '#ef4444'; // red
    return 'white';
  };

  return (
    <div style={containerStyle}>
      <div style={widgetStyle}>
        <div style={headerStyle}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            color: 'white' 
          }}>
            Relative Positions
          </h3>
        </div>
        
        <table style={tableStyle}>
          <tbody>
            {relativeData.map((driver, idx) => (
              <tr
                key={driver.position}
                style={rowStyle(driver.isPlayer, idx % 2 === 0)}
              >
                <td style={{ ...cellStyle, color: 'white', width: '40px' }}>
                  {driver.position}
                </td>
                <td style={{ 
                  ...cellStyle, 
                  color: driver.isPlayer ? 'white' : '#e5e7eb',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px'
                }}>
                  {driver.driver}
                </td>
                <td style={{ 
                  ...cellStyle, 
                  color: getGapColor(driver.gap),
                  textAlign: 'right',
                  width: '60px'
                }}>
                  {driver.gap}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
