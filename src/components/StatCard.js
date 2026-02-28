import React from 'react';
import './StatCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Reusable card component for showing a single statistic.
 *
 * Props:
 * - title: string (e.g. "Total Citizens")
 * - value: string or number
 * - subtitle: optional string (e.g. "+156 this week")
 * - icon: optional FontAwesome icon definition (from free-solid-svg-icons)
 * - className: optional extra class (for coloring)
 */
const StatCard = ({ title, value, subtitle, icon, className = '' }) => {
  return (
    <div className={`stat-card ${className}`.trim()}>
      <div className="stat-card-content">
        <div className="stat-card-header">
          <span className="stat-card-title">{title}</span>
          {icon && (
            <span className="stat-card-icon">
              <FontAwesomeIcon icon={icon} />
            </span>
          )}
        </div>
        <div className="stat-card-value">{value}</div>
        {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};

export default StatCard;
