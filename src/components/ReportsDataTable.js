import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const ReportsDataTable = ({ reports }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [filterValidation, setFilterValidation] = useState('All Reports');
    const itemsPerPage = 8;

    // Formatting strings
    const getStatusString = (status) => {
        switch (status) {
            case 1: return 'pending';
            case 2: return 'in-progress';
            case 3: return 'resolved';
            case 4: return 'rejected';
            default: return 'unknown';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 1: return 'badge border border-warning text-warning bg-transparent rounded-pill px-3';
            case 2: return 'badge bg-info text-white rounded-pill px-3';
            case 3: return 'badge border border-success text-success bg-transparent rounded-pill px-3';
            case 4: return 'badge border border-danger text-danger bg-transparent rounded-pill px-3';
            default: return 'badge bg-secondary rounded-pill px-3';
        }
    };

    // Currently backend doesn't seem to return priority, we will mock it based on category or random for UI purpose, or just return medium. 
    // Let's create a deterministic mock priority based on reportId
    const getPriority = (id) => {
        const p = id % 3;
        if (p === 0) return { label: 'high', class: 'badge border border-danger text-danger bg-transparent rounded-pill px-3' };
        if (p === 1) return { label: 'medium', class: 'badge border border-warning text-warning bg-transparent rounded-pill px-3' };
        return { label: 'low', class: 'badge border border-info text-info bg-transparent rounded-pill px-3' };
    };

    const getValidationContent = (valStatus) => {
        if (valStatus === 1) return <span className="text-success"><FontAwesomeIcon icon={faCheckCircle} className="me-1" /> Yes</span>;
        return <span className="text-warning"><FontAwesomeIcon icon={faTimesCircle} className="me-1" style={{ transform: 'rotate(45deg)' }} /> Pending</span>;
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        if (diffInHours === 0) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    };

    // Filter Data
    let filteredReports = [...reports];
    if (filterStatus !== 'All Status') {
        const st = filterStatus === 'Pending' ? 1 : filterStatus === 'In Progress' ? 2 : filterStatus === 'Resolved' ? 3 : 4;
        filteredReports = filteredReports.filter(r => r.status === st);
    }
    if (filterValidation !== 'All Reports') {
        const vt = filterValidation === 'Validated' ? 1 : 0;
        filteredReports = filteredReports.filter(r => r.validationStatus === vt);
    }

    // Pagination logic
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
    const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

    return (
        <div className="card bg-secondary bg-opacity-10 border border-secondary rounded-3 mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h5 className="card-title mb-0 text-white">Problem Reports Tracking</h5>
                        <p className="text-white mb-0" style={{ opacity: 0.7, fontSize: '0.85rem' }}>Monitor and validate citizen-submitted reports</p>
                    </div>
                    <FontAwesomeIcon icon={faEye} className="text-white opacity-50" />
                </div>

                <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label className="text-white mb-1" style={{ fontSize: '0.85rem', opacity: 0.8 }}>Filter by Status</label>
                        <select className="form-select bg-dark text-white border-secondary" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="text-white mb-1" style={{ fontSize: '0.85rem', opacity: 0.8 }}>Filter by Validation</label>
                        <select className="form-select bg-dark text-white border-secondary" value={filterValidation} onChange={e => { setFilterValidation(e.target.value); setCurrentPage(1); }}>
                            <option>All Reports</option>
                            <option>Validated</option>
                            <option>Pending</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive" style={{ background: '#1F3D55', borderRadius: '12px', padding: '0 6px 6px 0' }}>
                    <table className="table table-dark table-borderless align-middle mb-0" style={{ backgroundColor: 'transparent', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                        <thead>
                            <tr>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Report Title</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Category</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Submitted By</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Location</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Priority</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Status</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Validated</th>
                                <th className="fw-normal text-center" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReports.length > 0 ? currentReports.map((report) => {
                                const priority = getPriority(report.reportId);
                                return (
                                    <tr key={report.reportId} style={{ background: 'rgba(45, 45, 80, 0.6)', backdropFilter: 'blur(8px)' }}>
                                        <td style={{ borderRadius: '10px 0 0 10px', padding: '1rem' }}>
                                            <div style={{ color: '#ADD8E6', fontWeight: 600, fontSize: '0.9rem' }}>{report.title}</div>
                                            <div style={{ color: '#8BB8D6', fontSize: '0.8rem', marginTop: '2px' }}>{getTimeAgo(report.createDate)}</div>
                                        </td>
                                        <td style={{ color: '#ADD8E6', fontSize: '0.9rem', padding: '1rem' }}>{report.category || 'N/A'}</td>
                                        <td style={{ color: '#ADD8E6', fontSize: '0.9rem', padding: '1rem' }}>{report.assignedToUserName || 'Citizen'}</td>
                                        <td style={{ color: '#ADD8E6', fontSize: '0.9rem', padding: '1rem' }}>{report.locationText}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={priority.class} style={{ fontSize: '0.8rem' }}>{priority.label}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={getStatusBadgeClass(report.status)} style={{ fontSize: '0.8rem' }}>{getStatusString(report.status)}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {getValidationContent(report.validationStatus)}
                                        </td>
                                        <td className="text-center" style={{ borderRadius: '0 10px 10px 0', padding: '1rem' }}>
                                            <button className="btn btn-sm btn-outline-danger me-2 rounded-circle" style={{ width: '32px', height: '32px', padding: 0 }} title="Reject">
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </button>
                                            <button className="btn btn-sm btn-outline-info rounded-circle" style={{ width: '32px', height: '32px', padding: 0 }} title="View">
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4" style={{ color: '#ADD8E6', opacity: 0.5, borderRadius: '10px' }}>No reports found matching criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <span className="text-white" style={{ opacity: 0.7, fontSize: '0.85rem' }}>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReports.length)} of {filteredReports.length}</span>
                        <div className="btn-group">
                            <button className="btn btn-sm btn-outline-secondary text-white" onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
                            <button className="btn btn-sm btn-secondary text-white" disabled>{currentPage}</button>
                            <button className="btn btn-sm btn-outline-secondary text-white" onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsDataTable;
