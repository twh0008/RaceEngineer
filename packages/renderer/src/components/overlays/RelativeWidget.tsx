import { useState, useEffect, useRef, useCallback } from "react";
import './styles/RelativeWidget.css';

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
  }, [updatePositionDisplay]);

  const getGapClassName = (gap: string): string => {
    if (gap.startsWith('+')) return 'relative-widget__gap--positive';
    if (gap.startsWith('-')) return 'relative-widget__gap--negative';
    return 'relative-widget__gap--neutral';
  };

  return (
    <div className="relative-widget">
      <div className="relative-widget__container">
        <div className="relative-widget__header">
          <h3 className="relative-widget__title">
            Relative Positions
          </h3>
        </div>
        
        <table className="relative-widget__table">
          <tbody>
            {relativeData.map((driver, idx) => (
              <tr
                key={driver.position}
                className={`relative-widget__row ${
                  driver.isPlayer 
                    ? 'relative-widget__row--player' 
                    : idx % 2 === 0 
                      ? 'relative-widget__row--even' 
                      : 'relative-widget__row--odd'
                }`}
              >
                <td className="relative-widget__cell relative-widget__position">
                  {driver.position}
                </td>
                <td className={`relative-widget__cell relative-widget__driver ${
                  driver.isPlayer ? 'relative-widget__driver--player' : ''
                }`}>
                  {driver.driver}
                </td>
                <td className={`relative-widget__cell relative-widget__gap ${getGapClassName(driver.gap)}`}>
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
