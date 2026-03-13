import React, { useState } from 'react';
import CitizenReportsTab from './CitizenReportsTab';
import ActiveUsers from './ActiveUsers';
import { useTranslation } from '../Services/Localization/Localization';

const SectionTabs = ({ user }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState('engagement');

  return (
    <div className="mb-4">
      <ul className="nav nav-tabs cc-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link cc-tab-btn fs-12 ${active === 'engagement' ? 'active' : ''}`}
            onClick={() => setActive('engagement')}
          >
            {t('citizenEngagement')}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link cc-tab-btn fs-12 ${active === 'reports' ? 'active' : ''}`}
            onClick={() => setActive('reports')}
          >
            {t('citizenReports')}
          </button>
        </li>
      </ul>
      {active === 'engagement' ? (
        <ActiveUsers />
      ) : (
        <CitizenReportsTab user={user} />
      )}
    </div>
  );
};

export default SectionTabs;

