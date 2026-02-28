import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReportsAdmin } from '../Services/Slices/AdminReportsSlice';
import ReportsDataTable from './ReportsDataTable';
import StatCard from './StatCard';

const CitizenReportsTab = ({ user }) => {
    const dispatch = useDispatch();
    const { reportsList, counters, status, error } = useSelector((state) => state.AdminReports);

    const groupId = user?.groups?.[0]?.id;

    useEffect(() => {
        if (groupId && status === 'idle') {
            dispatch(fetchAllReportsAdmin({ groupId }));
        }
    }, [dispatch, groupId, status]);

    return (
        <div className="mb-4">
            {status === 'loading' && <div className="text-white mb-3">Loading reports...</div>}
            {status === 'failed' && <div className="text-danger mb-3">Error fetching reports: {error}</div>}



            <ReportsDataTable reports={reportsList} />
        </div>
    );
};

export default CitizenReportsTab;
