import React from 'react';
import StatCard from './StatCard';
import './DashboardOverview.css';
import {
  faUsers,
  faCheckCircle,
  faChartLine,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

const DashboardOverview = () => {
  return (
    <div className="dashboard-overview">
      <StatCard
        title="Total Citizens"
        value="3,847"
        subtitle="+156 this week"
        icon={faUsers}
        className="blue"
      />
      <StatCard
        title="Active Today"
        value="892"
        subtitle="12.3% vs yesterday"
        icon={faCheckCircle}
        className="green"
      />
      <StatCard
        title="Avg Engagement"
        value="78%"
        subtitle="5.2% this month"
        icon={faChartLine}
        className="purple"
      />
      <StatCard
        title="New This Week"
        value="156"
        subtitle="8.7% vs last week"
        icon={faEye}
        className="orange"
      />
    </div>
  );
};

export default DashboardOverview;
