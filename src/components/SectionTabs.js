import React, { useState } from 'react';
import EngagementStats from './EngagementStats';
import CitizenReportsTab from './CitizenReportsTab';
import ActiveUsers from './ActiveUsers';

const SectionTabs = ({ user }) => {
  const [active, setActive] = useState('engagement');

  return (
    <div className="mb-4">
      <ul className="nav nav-tabs cc-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link cc-tab-btn ${active === 'engagement' ? 'active' : ''}`}
            onClick={() => setActive('engagement')}
          >
            Citizen Engagement
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link cc-tab-btn ${active === 'reports' ? 'active' : ''}`}
            onClick={() => setActive('reports')}
          >
            Citizen Reports
          </button>
        </li>
      </ul>
      {active === 'engagement' ? (
        <>
          <EngagementStats />
          <ActiveUsers />
        </>
      ) : (
        <CitizenReportsTab user={user} />
      )}
    </div>
  );
};

export default SectionTabs;

