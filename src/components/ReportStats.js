import React from 'react';
import './ReportStats.css';
import StatCard from './StatCard';
import {
  faFileAlt,
  faHourglassHalf,
  faTools,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

const ReportStats = () => {
  // In a real app these would come from props or a store
  return (
    <div className="report-stats">
      <h2>Report Statistics</h2>
      <p className="report-subheading">Overview of citizen problem reports</p>
      <div className="report-cards-container">
        <StatCard
          title="Total Reports"
          value="487"
          icon={faFileAlt}
          className="blue"
        />
        <StatCard
          title="Pending"
          value="23"
          icon={faHourglassHalf}
          className="orange"
        />
        <StatCard
          title="In Progress"
          value="45"
          icon={faTools}
          className="purple"
        />
        <StatCard
          title="Resolved"
          value="389"
          icon={faCheckCircle}
          className="green"
        />
        <StatCard
          title="Rejected"
          value="30"
          icon={faTimesCircle}
          className="orange"
        />
      </div>
    </div>
  );
};

export default ReportStats;
