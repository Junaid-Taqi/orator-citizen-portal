import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Reusable card component for showing a single statistic.
 *
 * Props:
 * - title: string (e.g. "Total Citizens")
 * - value: string or number
 * - subtitle: optional string (e.g. "+156 this week")
 * - icon: optional FontAwesome icon definition (from free-solid-svg-icons)
 * - variant: optional string to select color gradient (blue, green, purple, orange)
 */
const colorMap = {
  blue: {
    background: 'linear-gradient(135deg, #2b3f60 0%, #1c2b48 100%)',
  },
  green: {
    background: 'linear-gradient(135deg, #2b603f 0%, #1b3f2b 100%)',
  },
  purple: {
    background: 'linear-gradient(135deg, #4b2b60 0%, #2b1b4b 100%)',
  },
  orange: {
    background: 'linear-gradient(135deg, #603f2b 0%, #3f2b1b 100%)',
  },
};

const StatCard = ({ title, value, subtitle, icon, variant = 'blue', plain = false }) => {
  // if plain card requested, use a transparent background with border instead of gradient
  const style = plain
    ? { background: 'transparent', border: '1px solid rgba(255,255,255,0.3)' }
    : colorMap[variant] || {};

  const cardClass = plain ? 'card text-white h-100 bg-transparent' : 'card text-white h-100';

  return (
    <div className={cardClass} style={style}>
      <div className="card-body d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0 text-white" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            {title}
          </h5>
          {icon && <FontAwesomeIcon icon={icon} />}
        </div>
        <div className="card-text" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
          {value}
        </div>
        {subtitle && (
          <div className="text-white" style={{ fontSize: '0.75rem', opacity: 0.7 }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
