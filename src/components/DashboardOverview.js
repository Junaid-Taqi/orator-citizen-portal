import React from 'react';
import StatCard from './StatCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCheckCircle,
  faChartLine,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

const DashboardOverview = () => {
  return (
    <div className="card border-secondary rounded-3 mb-4" style={{ background: 'rgba(45, 45, 80, 0.4)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-0 text-white" style={{ fontSize: '1.25rem' }}>Citizen Control Panel</h5>
            <p className="text-white mb-0" style={{ opacity: 0.8, fontSize: '0.85rem' }}>Monitor citizen engagement, track reports, and manage user activity</p>
          </div>
        </div>
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
              subtitle="↑ 12.3% vs yesterday"
              icon={faCheckCircle}
              variant="green"
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <StatCard
              title="Avg Engagement"
              value="78%"
              subtitle="↑ 5.2% this month"
              icon={faChartLine}
              variant="purple"
            />
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <StatCard
              title="New This Week"
              value="156"
              subtitle="↑ 8.7% vs last week"
              icon={faEye}
              variant="orange"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
