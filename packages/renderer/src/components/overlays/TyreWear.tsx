import './styles/TyreWear.css';

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
    <div className="tyre-wear">
      <h3 className="tyre-wear__title">Tyre Wear</h3>
      <div className="tyre-wear__grid">
        {/* Front Left */}
        <div className="tyre-wear__item">
          <div className="tyre-wear__label">FL</div>
          <div
            className="tyre-wear__bar"
            style={{
              backgroundColor: getWearColor(wear.frontLeft),
              width: `${wear.frontLeft}%`,
            }}
          />
          <div className="tyre-wear__value">{wear.frontLeft.toFixed(1)}%</div>
        </div>

        {/* Front Right */}
        <div className="tyre-wear__item">
          <div className="tyre-wear__label">FR</div>
          <div
            className="tyre-wear__bar"
            style={{
              backgroundColor: getWearColor(wear.frontRight),
              width: `${wear.frontRight}%`,
            }}
          />
          <div className="tyre-wear__value">{wear.frontRight.toFixed(1)}%</div>
        </div>

        {/* Rear Left */}
        <div className="tyre-wear__item">
          <div className="tyre-wear__label">RL</div>
          <div
            className="tyre-wear__bar"
            style={{
              backgroundColor: getWearColor(wear.rearLeft),
              width: `${wear.rearLeft}%`,
            }}
          />
          <div className="tyre-wear__value">{wear.rearLeft.toFixed(1)}%</div>
        </div>

        {/* Rear Right */}
        <div className="tyre-wear__item">
          <div className="tyre-wear__label">RR</div>
          <div
            className="tyre-wear__bar"
            style={{
              backgroundColor: getWearColor(wear.rearRight),
              width: `${wear.rearRight}%`,
            }}
          />
          <div className="tyre-wear__value">{wear.rearRight.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};
