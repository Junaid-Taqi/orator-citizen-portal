import React from 'react';
import StatCard from './StatCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

// sample engagement metrics
const engagementData = [
  { title: 'News Article Views', value: '12,456', subtitle: '+15% this week' },
  { title: 'Reports Submitted', value: '487', subtitle: '+8% this week' },
  { title: 'Profile Updates', value: '234', subtitle: '+3% this week' },
  { title: 'Preferences Changed', value: '156', subtitle: '+12% this week' },
  { title: 'App Sessions', value: '8,932', subtitle: '+22% this week' },
];

const EngagementStats = () => {
  return (
    <div className="card bg-secondary bg-opacity-10 border border-secondary rounded-3 mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-0 text-white">Citizen Engagement</h5>
            <p className="text-white mb-0">Activity metrics across the citizen app</p>
          </div>
          <FontAwesomeIcon icon={faChartLine} className="text-white opacity-50" />
        </div>
        <div className="row g-3">
          {engagementData.map((stat) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-2" key={stat.title}>
              <StatCard
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                plain
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngagementStats;
