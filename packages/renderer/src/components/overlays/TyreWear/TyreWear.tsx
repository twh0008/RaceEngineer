import './TyreWear.css';

interface TyreWearProps {
  wear: {
    frontLeft: number;
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
}

export const TyreWear = ({ wear }: TyreWearProps) => {
  const getWearColor = (wear: number) => {
    if (wear > 70) return '#10b981'; // green
    if (wear > 40) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };
  return (
    <div className="overlay-base">
      <h3 className="overlay-title">Tyre Wear</h3>
      <div className="overlay-grid overlay-grid--2col">        {/* Front Left */}
        <div className="overlay-section">
          <div className="overlay-label">FL</div>
          <div 
            className="bar"
            style={{
              backgroundColor: getWearColor(wear.frontLeft),
              width: `${wear.frontLeft}%`
            }} 
          />
          <div className="overlay-value">{wear.frontLeft.toFixed(1)}%</div>
        </div>        {/* Front Right */}
        <div className="overlay-section">
          <div className="overlay-label">FR</div>
          <div 
            className="bar"
            style={{
              backgroundColor: getWearColor(wear.frontRight),
              width: `${wear.frontRight}%`
            }} 
          />
          <div className="overlay-value">{wear.frontRight.toFixed(1)}%</div>
        </div>        {/* Rear Left */}
        <div className="overlay-section">
          <div className="overlay-label">RL</div>
          <div 
            className="bar"
            style={{
              backgroundColor: getWearColor(wear.rearLeft),
              width: `${wear.rearLeft}%`
            }} 
          />
          <div className="overlay-value">{wear.rearLeft.toFixed(1)}%</div>
        </div>        {/* Rear Right */}
        <div className="overlay-section">
          <div className="overlay-label">RR</div>
          <div 
            className="bar"
            style={{
              backgroundColor: getWearColor(wear.rearRight),
              width: `${wear.rearRight}%`
            }} 
          />
          <div className="overlay-value">{wear.rearRight.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};
