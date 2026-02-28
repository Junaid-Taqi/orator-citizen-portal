import React from 'react';
import StatCard from './StatCard';
import {
  faUsers,
  faCheckCircle,
  faChartLine,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

const DashboardOverview = () => {
  return (
    <div className="row g-3">
      <div className="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Total Citizens"
          value="3,847"
          subtitle="+156 this week"
          icon={faUsers}
          variant="blue"
        />
      </div>
      <div className="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Active Today"
          value="892"
          subtitle="12.3% vs yesterday"
          icon={faCheckCircle}
          variant="green"
        />
      </div>
      <div className="col-12 col-sm-6 col-md-3">
        <StatCard
          title="Avg Engagement"
          value="78%"
          subtitle="5.2% this month"
          icon={faChartLine}
          variant="purple"
        />
      </div>
      <div className="col-12 col-sm-6 col-md-3">
        <StatCard
          title="New This Week"
          value="156"
          subtitle="8.7% vs last week"
          icon={faEye}
          variant="orange"
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
