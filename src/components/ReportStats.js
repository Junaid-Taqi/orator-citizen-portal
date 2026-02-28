import React from 'react';
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
    <div className="mb-4">
      <h2 className="mb-1">Report Statistics</h2>
      <p className="text-muted mb-3">Overview of citizen problem reports</p>
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
          <StatCard
            title="Total Reports"
            value="487"
            icon={faFileAlt}
            variant="blue"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
          <StatCard
            title="Pending"
            value="23"
            icon={faHourglassHalf}
            variant="orange"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
          <StatCard
            title="In Progress"
            value="45"
            icon={faTools}
            variant="purple"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
          <StatCard
            title="Resolved"
            value="389"
            icon={faCheckCircle}
            variant="green"
          />
        </div>
        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
          <StatCard
            title="Rejected"
            value="30"
            icon={faTimesCircle}
            variant="orange"
          />
        </div>
      </div>
    </div>
  );
};

export default ReportStats;
