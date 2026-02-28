import React, { useState } from 'react';
import EngagementStats from './EngagementStats';
import ReportStats from './ReportStats';

const SectionTabs = () => {
  const [active, setActive] = useState('engagement');

  return (
    <div className="mb-4">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${active === 'engagement' ? 'active' : ''}`}
            onClick={() => setActive('engagement')}
          >
            Citizen Engagement
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${active === 'reports' ? 'active' : ''}`}
            onClick={() => setActive('reports')}
          >
            Citizen Reports
          </button>
        </li>
      </ul>
      {active === 'engagement' ? <EngagementStats /> : <ReportStats />}
    </div>
  );
};

export default SectionTabs;
