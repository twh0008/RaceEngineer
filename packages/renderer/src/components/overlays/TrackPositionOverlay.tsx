import { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';
import './styles/TrackPositionOverlay.css';

interface TrackPositionProps {
  trackName?: string;
}

// Track outline coordinates for F1 circuits - accurately scaled based on official layouts
// These are simplified SVG path coordinates scaled to fit in our overlay
const TRACK_PATHS = {
  // Spa-Francorchamps (accurate layout based on official F1 circuit map)
  spa: 'M 20,20 L 28,18 C 30,22 32,26 34,30 L 40,40 C 42,44 46,48 50,52 C 54,56 60,60 66,64 L 72,68 C 76,72 80,76 84,80 C 88,84 92,88 96,92 L 104,100 C 108,104 112,108 116,112 L 120,116 C 116,120 112,124 108,128 C 104,132 100,136 96,140 L 92,144 C 88,148 84,152 80,156 L 72,164 C 68,168 64,172 60,176 C 56,180 52,184 48,188 L 40,196 C 36,192 32,188 28,184 C 24,180 20,176 16,172 L 12,168 C 8,164 4,160 4,156 C 8,152 12,148 16,144 L 20,140 C 24,136 28,132 32,128 C 36,124 40,120 44,116 L 48,112 C 52,108 56,104 60,100 C 64,96 68,92 72,88 L 76,84 C 80,80 84,76 88,72 L 92,68 C 96,64 100,60 104,56 L 108,52 C 112,48 114,44 116,40',
  monza:
    'M 30,50 L 60,30 L 100,20 L 140,30 L 160,50 L 180,80 L 190,120 L 180,160 L 150,190 L 100,200 L 50,180 L 30,150 L 40,120 L 70,110 L 100,120 L 120,140 L 130,170 L 120,190 L 90,190 L 60,170 L 50,140 L 60,110 L 90,90 L 130,90 L 160,110 L 170,140 L 160,170 L 130,180 L 90,170 L 70,140 L 80,110 L 100,100 L 130,110 L 140,130 L 130,150 L 100,150 L 80,130 L 90,100',
  monaco:
    'M 40,80 L 70,60 L 110,50 L 150,60 L 170,80 L 180,110 L 170,140 L 150,160 L 120,170 L 90,160 L 70,140 L 60,110 L 70,80 L 90,60 L 110,50 L 140,60 L 160,80 L 170,110 L 160,140 L 130,160 L 100,150 L 80,130 L 70,100 L 80,70 L 100,60 L 130,70 L 140,90 L 130,110 L 110,120 L 90,110 L 80,90 L 90,70',
  silverstone:
    'M 40,70 L 80,50 L 130,40 L 180,50 L 210,80 L 230,120 L 220,160 L 190,190 L 150,200 L 100,190 L 60,160 L 40,120 L 50,80 L 80,60 L 120,60 L 150,80 L 160,110 L 150,140 L 120,160 L 80,150 L 60,120 L 70,90 L 90,70 L 120,70 L 140,90 L 140,120 L 120,140 L 90,140 L 70,120 L 70,90',
  suzuka:
    'M 40,90 C 60,60 100,50 140,70 C 170,90 180,130 160,160 C 140,180 110,180 90,160 C 70,140 70,110 90,90 C 110,70 140,70 160,90 C 180,110 180,140 160,160 C 140,180 110,180 90,160 C 70,140 70,110 90,90',
};

// Track sectors for Spa (based on official F1 sector divisions)
const SPA_SECTORS = [
  {
    name: 'Sector 1',
    path: 'M 20,20 L 28,18 C 30,22 32,26 34,30 L 40,40 C 42,44 46,48 50,52',
    color: '#4CAF50',
  },
  {
    name: 'Sector 2',
    path: 'M 50,52 C 54,56 60,60 66,64 L 72,68 C 76,72 80,76 84,80 C 88,84 92,88 96,92 L 104,100',
    color: '#FFC107',
  },
  {
    name: 'Sector 3',
    path: 'M 104,100 C 108,104 112,108 116,112 L 120,116 C 116,120 112,124 108,128 C 104,132 100,136 96,140 L 92,144 C 88,148 84,152 80,156 L 72,164',
    color: '#F44336',
  },
];

// Famous corners/sections for Spa with accurate positions
const SPA_CORNERS = [
  { name: 'La Source', x: 24, y: 20, description: 'Hairpin Turn 1' },
  { name: 'Eau Rouge', x: 34, y: 30, description: 'Uphill left-right' },
  { name: 'Raidillon', x: 40, y: 40, description: 'Top of the hill' },
  { name: 'Kemmel', x: 54, y: 56, description: 'Long straight' },
  { name: 'Les Combes', x: 76, y: 72, description: 'Turn 5-7 combo' },
  { name: 'Bruxelles', x: 88, y: 84, description: 'Downhill right' },
  { name: 'Pouhon', x: 104, y: 100, description: 'Double left' },
  { name: 'Fagnes', x: 112, y: 112, description: 'Chicane' },
  { name: 'Stavelot', x: 60, y: 100, description: 'Double right' },
  { name: 'Blanchimont', x: 36, y: 180, description: 'High-speed left' },
  { name: 'Bus Stop', x: 12, y: 156, description: 'Final chicane' },
];

export const TrackPositionOverlay: React.FC<TrackPositionProps> = ({
  trackName = 'spa',
}) => {
  const [carPosition, setCarPosition] = useState(0); // 0-1 position around track
  const [lapCount, setLapCount] = useState(1);
  const [hoveredCorner, setHoveredCorner] = useState<string | null>(null);
  const [carSpeed, setCarSpeed] = useState(0); // km/h
  const [currentSector, setCurrentSector] = useState(1);
  const animationRef = useRef<number | null>(null);
  const trackPath =
    TRACK_PATHS[trackName as keyof typeof TRACK_PATHS] || TRACK_PATHS.spa;
  // Calculate position along the track path
  const getPositionOnTrack = (progress: number) => {
    const svgPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    svgPath.setAttribute('d', trackPath);

    const pathLength = svgPath.getTotalLength();
    const point = svgPath.getPointAtLength(pathLength * progress);

    return { x: point.x, y: point.y };
  };
  // Simulate speed variations around the track
  const getSpeedFactor = useCallback(
    (progress: number) => {
      if (trackName === 'spa') {
        // Slow down for key corners in Spa
        if (progress > 0.02 && progress < 0.07) return 0.6; // La Source
        if (progress > 0.28 && progress < 0.34) return 0.7; // Les Combes
        if (progress > 0.56 && progress < 0.62) return 0.7; // Pouhon
        if (progress > 0.78 && progress < 0.83) return 0.65; // Bus Stop

        // Full speed on straights
        if (progress > 0.1 && progress < 0.25) return 1.3; // Kemmel Straight
        if (progress > 0.68 && progress < 0.76) return 1.2; // Blanchimont

        // Default speed
        return 1.0;
      }
      return 1.0;
    },
    [trackName]
  );
  // Determine which sector the car is in (for Spa)
  const getCurrentSector = useCallback(
    (progress: number) => {
      if (trackName === 'spa') {
        if (progress < 0.33) return 1; // Sector 1
        if (progress < 0.66) return 2; // Sector 2
        return 3; // Sector 3
      }
      return 1;
    },
    [trackName]
  );

  // Animate car around track
  useEffect(() => {
    const baseSpeed = 0.0004; // Base speed factor
    let startTime: number;
    let progress = carPosition;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Get speed variation based on track position
      const speedFactor = getSpeedFactor(progress);

      // Update progress (0 to 1 represents a full lap)
      progress = (carPosition + elapsed * baseSpeed * speedFactor) % 1;

      // Check if we completed a lap
      if (progress < carPosition) {
        setLapCount((prev) => prev + 1);
      }

      // Calculate simulated car speed (in km/h)
      // Spa is ~7km, so one full lap (progress=1.0) at baseSpeed would take time T
      // Speed = distance/time = 7km / T = 7 * baseSpeed * speedFactor * constant
      const speedConstant = 30000; // Calibration constant
      const calculatedSpeed = Math.floor(
        speedFactor * baseSpeed * speedConstant
      );
      setCarSpeed(calculatedSpeed);

      // Update current sector
      setCurrentSector(getCurrentSector(progress));

      setCarPosition(progress);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [carPosition, getSpeedFactor, getCurrentSector]);

  // Get current position coordinates
  const carCoordinates = getPositionOnTrack(carPosition);

  return (
    <div className="track-position">
      <div className="track-position__overlay">
        <div className="track-position__header">
          <h3 className="track-position__title">
            <span>Track Position - {trackName.toUpperCase()}</span>
            <span className="track-position__lap">Lap {lapCount}</span>
          </h3>
        </div>

        <div className="track-position__svg-container">
          <svg
            viewBox="0 0 120 200"
            style={{ width: '100%', height: '100%' }}
            overflow="visible"
          >
            {/* Track outline */}
            <path d={trackPath} className="track-position__track" />

            {/* Track sectors (Spa-specific) */}
            {trackName === 'spa' &&
              SPA_SECTORS.map((sector, idx) => (
                <path
                  key={`sector-${idx}`}
                  d={sector.path}
                  className="track-position__sector"
                  style={{ stroke: sector.color }}
                />
              ))}

            {/* Car position marker */}
            <circle
              cx={carCoordinates.x}
              cy={carCoordinates.y}
              r="5"
              className="track-position__car"
            />

            {/* Direction arrow */}
            <circle
              cx={carCoordinates.x}
              cy={carCoordinates.y}
              r="10"
              className="track-position__car-direction"
            />

            {/* Corner markers for Spa */}
            {trackName === 'spa' &&
              SPA_CORNERS.map((corner, idx) => (
                <g key={`corner-${idx}`}>
                  <circle
                    cx={corner.x}
                    cy={corner.y}
                    r="4"
                    className={`track-position__corner ${
                      hoveredCorner === corner.name
                        ? 'track-position__corner--active'
                        : ''
                    }`}
                    onMouseEnter={() => setHoveredCorner(corner.name)}
                    onMouseLeave={() => setHoveredCorner(null)}
                  />
                  {hoveredCorner === corner.name && (
                    <g>
                      <rect
                        x={corner.x + 10}
                        y={corner.y - 20}
                        width="100"
                        height="40"
                        rx="5"
                        className="track-position__corner-tooltip"
                      />
                      <text
                        x={corner.x + 15}
                        y={corner.y - 5}
                        className="track-position__corner-name"
                      >
                        {corner.name}
                      </text>
                      <text
                        x={corner.x + 15}
                        y={corner.y + 10}
                        className="track-position__corner-description"
                      >
                        {corner.description}
                      </text>
                    </g>
                  )}
                </g>
              ))}

            {/* Show DRS zones for Spa */}
            {trackName === 'spa' && (
              <>
                <path
                  d="M 46,48 L 66,64"
                  className="track-position__drs-zone"
                />
                <path
                  d="M 36,184 L 16,156"
                  className="track-position__drs-zone"
                />
                <text x="50" y="45" className="track-position__drs-label">
                  DRS ZONE 1
                </text>
                <text x="25" y="170" className="track-position__drs-label">
                  DRS ZONE 2
                </text>
              </>
            )}
          </svg>

          {/* Track information tooltip */}
          <div className="track-position__info">
            <div className="track-position__info-row">
              <span>Track:</span>
              <span className="track-position__info-value">
                {trackName.toUpperCase()}
              </span>
            </div>
            <div className="track-position__info-row">
              <span>Lap:</span>
              <span className="track-position__info-value">{lapCount}</span>
            </div>
            <div className="track-position__info-row">
              <span>Sector:</span>
              <span
                className={`track-position__info-value track-position__sector-${currentSector}`}
              >
                {currentSector}
              </span>
            </div>
            <div className="track-position__info-row">
              <span>Speed:</span>
              <span className="track-position__info-value">
                {carSpeed} km/h
              </span>
            </div>
            <div className="track-position__info-row">
              <span>Pos:</span>
              <span className="track-position__info-value">
                {Math.floor(carPosition * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
