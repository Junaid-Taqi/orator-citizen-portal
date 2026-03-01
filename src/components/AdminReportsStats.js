import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReportsAdmin } from '../Services/Slices/AdminReportsSlice';
import StatCard from './StatCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';

const AdminReportsStats = ({ user }) => {
    const dispatch = useDispatch();
    const { counters, status, error } = useSelector((state) => state.AdminReports);

    const groupId = user?.groups?.[0]?.id;

    useEffect(() => {
        if (groupId && status === 'idle') {
            dispatch(fetchAllReportsAdmin({ groupId }));
        }
    }, [dispatch, groupId, status]);

    return (
        <div className="card border-secondary rounded-3 mb-4" style={{ background: 'rgb(21 0 128 / 16%)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="card-title mb-0 text-white" style={{ fontSize: '1.25rem' }}>Report Statistics</h5>
                        <p className="text-primary mb-0 fs-12" style={{ opacity: 0.8 }}>Overview of citizen problem reports</p>
                    </div>
                    <FontAwesomeIcon icon={faCommentAlt} className="text-primary opacity-50" style={{ fontSize: '1.5rem' }} />
                </div>

                {status === 'loading' && <div className="text-white mb-3" style={{ opacity: 0.8 }}>Loading statistics...</div>}
                {status === 'failed' && <div className="text-danger mb-3">Error fetching statistics: {error}</div>}

                <div className="row g-3">
                    <div className="col-12 col-sm-6 col-md-4 col-lg-2 TotalReports" style={{ flex: '1' }}>
                        <StatCard
                            title="Total Reports"
                            value={counters?.total || 0}
                            plain={false}
                            variant="purple"
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-2" style={{ flex: '1' }}>
                        <StatCard
                            title="Pending"
                            value={counters?.pending || 0}
                            plain={false}
                            variant="orange"
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-2" style={{ flex: '1' }}>
                        <StatCard
                            title="In Progress"
                            value={counters?.inProgress || 0}
                            plain={false}
                            variant="blue"
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-2" style={{ flex: '1' }}>
                        <StatCard
                            title="Resolved"
                            value={counters?.resolved || 0}
                            plain={false}
                            variant="green"
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 col-lg-2" style={{ flex: '1' }}>
                        <StatCard
                            title="Rejected"
                            value={counters?.rejected || 0}
                            plain={false}
                            variant="purple"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportsStats;
