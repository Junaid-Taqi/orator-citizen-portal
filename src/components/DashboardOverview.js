import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveCitizensAdmin } from '../Services/Slices/ActiveCitizensSlice';
import StatCard from './StatCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCheckCircle,
  faChartLine,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

const DashboardOverview = ({ user }) => {
  const dispatch = useDispatch();
  const { counters, status, error } = useSelector((state) => state.ActiveCitizens);

  const groupId = user?.groups?.[0]?.id;

  useEffect(() => {
    if (groupId && status === 'idle') {
      dispatch(fetchActiveCitizensAdmin({ groupId }));
    }
  }, [dispatch, groupId, status]);

  return (
    <div className="card border-secondary rounded-3 mb-4" style={{ background: 'rgba(45, 45, 80, 0.4)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-0 text-white" style={{ fontSize: '1.25rem' }}>Citizen Control Panel</h5>
            <p className="text-white mb-0" style={{ opacity: 0.8, fontSize: '0.85rem' }}>Monitor citizen engagement, track reports, and manage user activity</p>
          </div>
        </div>

        {status === 'loading' && <div className="text-white mb-3" style={{ opacity: 0.8 }}>Loading statistics...</div>}
        {status === 'failed' && <div className="text-danger mb-3">Error fetching statistics: {error}</div>}

        <div className="row g-3">
          <div className="col-12 col-sm-6 col-md-4">
            <StatCard
              title="Total Citizens"
              value={counters?.totalCitizens || 0}
              subtitle={counters?.totalCitizensSubtitle || ''}
              icon={faUsers}
              variant="blue"
            />
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <StatCard
              title="Active Today"
              value={counters?.activeToday || 0}
              subtitle={counters?.activeChangeSubtitle || ''}
              icon={faCheckCircle}
              variant="green"
            />
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <StatCard
              title="New This Week"
              value={counters?.newThisWeek || 0}
              subtitle={counters?.newWeekChangeSubtitle || ''}
              icon={faEye}
              variant="purple" // Changed variant so the 3 colors match nicely (blue, green, purple instead of orange for 4th)
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
