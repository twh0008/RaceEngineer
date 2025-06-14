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
  const tyreStyle = {
    position: 'fixed' as const,
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    pointerEvents: 'auto' as const,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #374151',
    cursor: 'move',
    userSelect: 'none' as const,
    WebkitAppRegion: 'drag' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  };

  const tyreItemStyle = {
    textAlign: 'center' as const
  };

  const labelStyle = {
    fontSize: '0.875rem',
    color: '#9ca3af',
    marginBottom: '4px'
  };

  const barStyle = {
    height: '16px',
    borderRadius: '8px',
    marginBottom: '4px'
  };

  const valueStyle = {
    fontSize: '1.125rem',
    fontWeight: 'bold'
  };

  return (
    <div style={tyreStyle}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.125rem', fontWeight: 'bold' }}>Tyre Wear</h3>
      <div style={gridStyle}>
        {/* Front Left */}
        <div style={tyreItemStyle}>
          <div style={labelStyle}>FL</div>
          <div 
            style={{
              ...barStyle,
              backgroundColor: getWearColor(wear.frontLeft),
              width: `${wear.frontLeft}%`
            }} 
          />
          <div style={valueStyle}>{wear.frontLeft.toFixed(1)}%</div>
        </div>

        {/* Front Right */}
        <div style={tyreItemStyle}>
          <div style={labelStyle}>FR</div>
          <div 
            style={{
              ...barStyle,
              backgroundColor: getWearColor(wear.frontRight),
              width: `${wear.frontRight}%`
            }} 
          />
          <div style={valueStyle}>{wear.frontRight.toFixed(1)}%</div>
        </div>

        {/* Rear Left */}
        <div style={tyreItemStyle}>
          <div style={labelStyle}>RL</div>
          <div 
            style={{
              ...barStyle,
              backgroundColor: getWearColor(wear.rearLeft),
              width: `${wear.rearLeft}%`
            }} 
          />
          <div style={valueStyle}>{wear.rearLeft.toFixed(1)}%</div>
        </div>

        {/* Rear Right */}
        <div style={tyreItemStyle}>
          <div style={labelStyle}>RR</div>
          <div 
            style={{
              ...barStyle,
              backgroundColor: getWearColor(wear.rearRight),
              width: `${wear.rearRight}%`
            }} 
          />
          <div style={valueStyle}>{wear.rearRight.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};
