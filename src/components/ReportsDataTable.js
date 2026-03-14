import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { serverUrl } from '../Services/Constants/Constants';
import { useTranslation } from '../Services/Localization/Localization';

const ReportsDataTable = ({ reports, user, onRefresh }) => {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [filterValidation, setFilterValidation] = useState('All Reports');
    const [actionLoadingByReport, setActionLoadingByReport] = useState({});
    const [actionError, setActionError] = useState('');
    const [actionDialog, setActionDialog] = useState({
        isOpen: false,
        type: '', // validation | status
        report: null,
        nextValidationStatus: null,
        nextStatus: null,
        validationRemarks: '',
        comment: '',
        rejectionReason: '',
        priority: 2,
        submitting: false,
        error: '',
    });
    const itemsPerPage = 10;
    const groupId = Number(user?.groups?.[0]?.id || 0);
    const adminUserId = Number(user?.userId || 0);

    // Formatting strings
    const getStatusString = (status) => {
        switch (status) {
            case 1: return 'Pending';
            case 2: return 'In Progress';
            case 3: return 'Resolved';
            case 4: return 'Rejected';
            default: return 'unknown';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 1: return 'badge fs-12 border border-warning text-warning bg-transparent rounded-pill px-3';
            case 2: return 'badge fs-12 bg-info text-white rounded-pill px-3';
            case 3: return 'badge fs-12 border border-success text-success bg-transparent rounded-pill px-3';
            case 4: return 'badge fs-12 border border-danger text-danger bg-transparent rounded-pill px-3';
            default: return 'badge fs-12 bg-secondary rounded-pill px-3';
        }
    };

    const getPriorityMeta = (priority) => {
        if (Number(priority) === 3) return { label: 'High', class: 'badge fs-12 border border-danger text-danger bg-transparent rounded-pill px-3' };
        if (Number(priority) === 1) return { label: 'Low', class: 'badge fs-12 border border-info text-info bg-transparent rounded-pill px-3' };
        return { label: 'Medium', class: 'badge fs-12 border border-warning text-warning bg-transparent rounded-pill px-3' };
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

    const formatDateTime = (value) => {
        if (!value) return 'N/A';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return 'N/A';
        return d.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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

    const withLoading = (reportId, loading) => {
        setActionLoadingByReport((prev) => ({ ...prev, [reportId]: loading }));
    };

    const getConfig = () => ({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
    });

    const openValidationDialog = (report, nextValidationStatus) => {
        setActionDialog({
            isOpen: true,
            type: 'validation',
            report,
            nextValidationStatus,
            nextStatus: null,
            validationRemarks: '',
            comment: nextValidationStatus === 1 ? 'Report authorized by municipality' : 'Report marked as not authorized',
            rejectionReason: '',
            priority: Number(report?.priority) || 2,
            submitting: false,
            error: '',
        });
    };

    const openStatusDialog = (report, nextStatus) => {
        setActionDialog({
            isOpen: true,
            type: 'status',
            report,
            nextValidationStatus: null,
            nextStatus,
            validationRemarks: '',
            comment: '',
            rejectionReason: nextStatus === 4 ? (report.rejectionReason || '') : '',
            priority: Number(report?.priority) || 2,
            submitting: false,
            error: '',
        });
    };

    const closeDialog = () => {
        if (actionDialog.submitting) return;
        setActionDialog({
            isOpen: false,
            type: '',
            report: null,
            nextValidationStatus: null,
            nextStatus: null,
            validationRemarks: '',
            comment: '',
            rejectionReason: '',
            priority: 2,
            submitting: false,
            error: '',
        });
    };

    const submitDialogAction = async () => {
        const report = actionDialog.report;
        if (!report) return;

        if (actionDialog.type === 'status' && actionDialog.nextStatus === 4 && !actionDialog.rejectionReason.trim()) {
            setActionDialog((prev) => ({ ...prev, error: 'Rejection reason is required.' }));
            return;
        }

        if (!groupId || !adminUserId) {
            setActionDialog((prev) => ({ ...prev, error: 'Missing group/admin context.' }));
            return;
        }

        setActionDialog((prev) => ({ ...prev, submitting: true, error: '' }));
        withLoading(report.reportId, true);
        setActionError('');

        try {
            if (actionDialog.type === 'validation') {
                await axios.post(
                    `${serverUrl}/o/adminSideCitizenReports/updateReportValidation`,
                    {
                        groupId: String(groupId),
                        adminUserId: String(adminUserId),
                        reportId: String(report.reportId),
                        validationStatus: String(actionDialog.nextValidationStatus),
                        validationRemarks: actionDialog.validationRemarks.trim(),
                    },
                    getConfig()
                );
            } else if (actionDialog.type === 'status') {
                await axios.post(
                    `${serverUrl}/o/adminSideCitizenReports/updateReportStatus`,
                    {
                        groupId: String(groupId),
                        adminUserId: String(adminUserId),
                        reportId: String(report.reportId),
                        status: String(actionDialog.nextStatus),
                        priority: String(actionDialog.priority || 2),
                        comment: actionDialog.comment.trim(),
                        rejectionReason: actionDialog.nextStatus === 4 ? actionDialog.rejectionReason.trim() : '',
                        assignedToUserId: report.assignedToUserId ? String(report.assignedToUserId) : null,
                        assignedToUserName: report.assignedToUserName || '',
                    },
                    getConfig()
                );
            }
            onRefresh?.();
            closeDialog();
        } catch (e) {
            setActionDialog((prev) => ({ ...prev, submitting: false, error: 'Failed to submit action.' }));
            setActionError('Failed to submit action.');
            withLoading(report.reportId, false);
        } finally {
            withLoading(report.reportId, false);
            setActionDialog((prev) => ({ ...prev, submitting: false }));
        }
    };

    const getDialogTitle = () => {
        if (actionDialog.type === 'validation') {
            return actionDialog.nextValidationStatus === 1 ? 'Validate Report' : 'Mark as Unvalidated';
        }
        if (actionDialog.type === 'status') {
            if (actionDialog.nextStatus === 2) return 'Move to In Progress';
            if (actionDialog.nextStatus === 3) return 'Resolve Report';
            if (actionDialog.nextStatus === 4) return 'Reject Report';
        }
        return 'Update Report';
    };

    const getAllowedActions = (report) => {
        const isValidated = Number(report.validationStatus) === 1;
        const status = Number(report.status);

        if (status === 1) {
            if (!isValidated) {
                return {
                    showValidate: true,
                    showUnvalidate: false,
                    showInProgress: false,
                    showResolve: false,
                    showReject: true,
                };
            }
            return {
                showValidate: false,
                showUnvalidate: true,
                showInProgress: true,
                showResolve: false,
                showReject: true,
            };
        }

        if (status === 2) {
            return {
                showValidate: false,
                showUnvalidate: false,
                showInProgress: false,
                showResolve: true,
                showReject: true,
            };
        }

        return {
            showValidate: false,
            showUnvalidate: false,
            showInProgress: false,
            showResolve: false,
            showReject: false,
        };
    };

    return (
        <div className="card bg-secondary bg-opacity-10 border border-secondary rounded-3 mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h5 className="card-title mb-0 text-white">{t('problemReportsTracking')}</h5>
                        <p className="text-primary mb-0 fs-12" style={{ opacity: 0.7 }}>{t('monitorAndValidateReports')}</p>
                    </div>
                    <FontAwesomeIcon icon={faEye} className="text-white opacity-50" />
                </div>
                {actionError && (
                    <div className="alert alert-danger py-2 px-3 mb-3" role="alert">
                        {actionError}
                    </div>
                )}

                <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-4">
                        <label className="text-white mb-1" style={{ fontSize: '0.85rem', opacity: 0.8 }}>{t('filterByStatus')}</label>
                        <select className="form-select bg-dark text-white border-secondary" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
                            <option>{t('allStatus')}</option>
                            <option>{t('pending')}</option>
                            <option>{t('inProgress')}</option>
                            <option>{t('resolved')}</option>
                            <option>{t('rejected')}</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-4">
                        <label className="text-white mb-1" style={{opacity: 0.8 }}>{t('filterByValidation')}</label>
                        <select className="form-select bg-dark text-white border-secondary" value={filterValidation} onChange={e => { setFilterValidation(e.target.value); setCurrentPage(1); }}>
                            <option>{t('allReports')}</option>
                            <option>Validated</option>
                            <option>{t('pending')}</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive" style={{ background: '#1F3D55' }}>
                    <table className="table table-borderless align-middle mb-0 reportDataTable" style={{ backgroundColor: 'transparent', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                        <thead>
                            <tr>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em'}}>{t('reportTitle')}</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{t('category')}</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{t('submittedBy')}</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{t('location')}</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{t('priority')}</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{t('status')}</th>
                                <th className="fw-normal" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{t('validated')}</th>
                                <th className="fw-normal text-center" style={{ color: '#A6B4C4', borderBottom: '1px solid rgba(144, 191, 231, 0.12)', padding: '1rem', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReports.length > 0 ? currentReports.map((report) => {
                                const priority = getPriorityMeta(report.priority);
                                const allowed = getAllowedActions(report);
                                return (
                                    <tr key={report.reportId}>
                                        <td>
                                            <div style={{ color: '#ADD8E6', fontSize: '12px', textTransform: 'capitalize' }}>{report.title}</div>
                                            <div style={{ color: '#8BB8D6', fontSize: '12px', marginTop: '2px' }}>{getTimeAgo(report.createDate)}</div>
                                        </td>
                                        <td style={{ color: '#ADD8E6', fontSize: '12px', padding: '1rem', textTransform: 'capitalize' }}>{report.category || 'N/A'}</td>
                                        <td style={{ color: '#ADD8E6', fontSize: '12px', padding: '1rem', textTransform: 'capitalize' }}>{report.citizenName}</td>
                                        <td style={{ color: '#ADD8E6', fontSize: '12px', padding: '1rem', textTransform: 'capitalize' }}>{report.locationText}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={priority.class} style={{ fontSize: '0.8rem' }}>{priority.label}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={getStatusBadgeClass(report.status)} style={{ fontSize: '12px' }}>{getStatusString(report.status)}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {getValidationContent(report.validationStatus)}
                                        </td>
                                        <td className="text-center">
                                            {allowed.showValidate && (
                                                <button
                                                    className="btn btn-sm btn-outline-success me-2"
                                                    title={t('validate')}
                                                    disabled={!!actionLoadingByReport[report.reportId]}
                                                    onClick={() => openValidationDialog(report, 1)}
                                                >
                                                    {t('validate')}
                                                </button>
                                            )}
                                            {allowed.showUnvalidate && (
                                                <button
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                    title={t('unvalidate')}
                                                    disabled={!!actionLoadingByReport[report.reportId]}
                                                    onClick={() => openValidationDialog(report, 0)}
                                                >
                                                    {t('unvalidate')}
                                                </button>
                                            )}
                                            {allowed.showInProgress && (
                                                <button
                                                    className="btn btn-sm btn-outline-warning me-2"
                                                    title="Move to In Progress"
                                                    disabled={!!actionLoadingByReport[report.reportId]}
                                                    onClick={() => openStatusDialog(report, 2)}
                                                >
                                                    {t('inProgress')}
                                                </button>
                                            )}
                                            {allowed.showResolve && (
                                                <button
                                                    className="btn btn-sm btn-outline-info me-2"
                                                    title={t('resolve')}
                                                    disabled={!!actionLoadingByReport[report.reportId]}
                                                    onClick={() => openStatusDialog(report, 3)}
                                                >
                                                    {t('resolve')}
                                                </button>
                                            )}
                                            {allowed.showReject && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    title={t('reject')}
                                                    disabled={!!actionLoadingByReport[report.reportId]}
                                                    onClick={() => openStatusDialog(report, 4)}
                                                >
                                                    {t('reject')}
                                                </button>
                                            )}
                                            {!allowed.showValidate && !allowed.showUnvalidate && !allowed.showInProgress && !allowed.showResolve && !allowed.showReject && (
                                                <span className="text-white-50" style={{ fontSize: '12px' }}>{t('noActions')}</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4" style={{ color: '#ADD8E6', opacity: 0.5, borderRadius: '10px' }}>{t('noReportsFound')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <span className="text-white" style={{ opacity: 0.7, fontSize: '0.85rem' }}>{t('showing')} {startIndex + 1} {t('to')} {Math.min(startIndex + itemsPerPage, filteredReports.length)} {t('of')} {filteredReports.length}</span>
                        <div className="btn-group">
                            <button className="btn btn-sm btn-outline-secondary text-white" onClick={handlePrev} disabled={currentPage === 1}>{t('previous')}</button>
                            <button className="btn btn-sm btn-secondary text-white" disabled>{currentPage}</button>
                            <button className="btn btn-sm btn-outline-secondary text-white" onClick={handleNext} disabled={currentPage === totalPages}>{t('next')}</button>
                        </div>
                    </div>
                )}
            </div>

            {actionDialog.isOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(0, 0, 0, 0.65)', zIndex: 1055 }}
                >
                    <div className="card bg-dark text-white border border-secondary" style={{ width: '100%', maxWidth: '560px', maxHeight: '85vh' }}>
                        <div className="card-body" style={{ overflowY: 'auto' }}>
                            <h5 className="mb-3">{getDialogTitle()}</h5>
                            <p className="text-white-50 mb-3" style={{ fontSize: '0.9rem' }}>
                                Report: <strong>{actionDialog.report?.title || 'N/A'}</strong>
                            </p>
                            <div className="border border-secondary rounded p-3 mb-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <div className="row g-2" style={{ fontSize: '0.9rem' }}>
                                    <div className="col-md-6">
                                        <div className="text-white-50">{t('reportId')}</div>
                                        <div>{actionDialog.report?.reportCode || `RPT-${actionDialog.report?.reportId || 'N/A'}`}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-white-50">{t('reportedBy')}</div>
                                        <div>{actionDialog.report?.citizenName || 'N/A'}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-white-50">{t('reportedDate')}</div>
                                        <div>{formatDateTime(actionDialog.report?.createDate)}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-white-50">{t('lastUpdated')}</div>
                                        <div>{formatDateTime(actionDialog.report?.modifiedDate)}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-white-50">{t('category')}</div>
                                        <div>{actionDialog.report?.category || 'N/A'}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-white-50">{t('location')}</div>
                                        <div>{actionDialog.report?.locationText || 'N/A'}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-white-50">{t('currentStatus')}</div>
                                        <div>{getStatusString(actionDialog.report?.status)}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-white-50">{t('validated')}</div>
                                        <div>{Number(actionDialog.report?.validationStatus) === 1 ? 'Validated' : 'Pending'}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-white-50">{t('currentPriority')}</div>
                                        <div>{getPriorityMeta(actionDialog.report?.priority).label}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-white-50">{t('resolvedDate')}</div>
                                        <div>{formatDateTime(actionDialog.report?.resolvedDate)}</div>
                                    </div>
                                    <div className="col-12">
                                        <div className="text-white-50">{t('description')}</div>
                                        <div>{actionDialog.report?.description || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            {actionDialog.type === 'validation' && (
                                <div className="mb-3">
                                    <label className="form-label">
                                        {t('validationRemarks')}
                                    </label>
                                    <textarea
                                        className="form-control bg-dark text-white border-secondary"
                                        rows="3"
                                        value={actionDialog.validationRemarks}
                                        onChange={(e) => setActionDialog((prev) => ({ ...prev, validationRemarks: e.target.value }))}
                                        placeholder={t('addValidationRemarks')}
                                        disabled={actionDialog.submitting}
                                    />
                                </div>
                            )}

                            {actionDialog.type === 'status' && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">{t('priority')}</label>
                                        <select
                                            className="form-select bg-dark text-white border-secondary"
                                            value={String(actionDialog.priority)}
                                            onChange={(e) => setActionDialog((prev) => ({ ...prev, priority: Number(e.target.value) }))}
                                            disabled={actionDialog.submitting}
                                        >
                                            <option value="1">{t('low')}</option>
                                            <option value="2">{t('medium')}</option>
                                            <option value="3">{t('high')}</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">{t('comment')}</label>
                                        <textarea
                                            className="form-control bg-dark text-white border-secondary"
                                            rows="3"
                                            value={actionDialog.comment}
                                            onChange={(e) => setActionDialog((prev) => ({ ...prev, comment: e.target.value }))}
                                            placeholder={t('addComment')}
                                            disabled={actionDialog.submitting}
                                        />
                                    </div>

                                    {actionDialog.nextStatus === 4 && (
                                        <div className="mb-3">
                                            <label className="form-label">
                                                {t('rejectionReason')} <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                className="form-control bg-dark text-white border-secondary"
                                                rows="3"
                                                value={actionDialog.rejectionReason}
                                                onChange={(e) => setActionDialog((prev) => ({ ...prev, rejectionReason: e.target.value }))}
                                                placeholder={t('addRejectionReason')}
                                                disabled={actionDialog.submitting}
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {actionDialog.error && (
                                <div className="alert alert-danger py-2 px-3 mb-3">
                                    {actionDialog.error}
                                </div>
                            )}

                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    className="btn btn-outline-light"
                                    onClick={closeDialog}
                                    disabled={actionDialog.submitting}
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={submitDialogAction}
                                    disabled={actionDialog.submitting}
                                >
                                    {actionDialog.submitting ? t('saving') : t('submit')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsDataTable;
