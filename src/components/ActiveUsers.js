import { faClock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../Services/Localization/Localization';


const ActiveUsers = () => {
  const { t } = useTranslation();
  const { usersList, status, error } = useSelector((state) => state.ActiveCitizens);
  const [currentPage, setCurrentPage] = useState(1);

  // Fallback for empty list or loading state handled in UI
  const displayUsers = usersList || [];

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(displayUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = displayUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  return (
    <div className="card bg-secondary bg-opacity-10 border border-secondary rounded-3 mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-0 text-white">{t('currentlyLoggedInCitizens')}</h5>
            <p className="text-primary mb-0 fs-12">{t('activeUserSessions')}</p>
          </div>
        </div>

        {status === 'loading' && <div className="text-white mb-3" style={{ opacity: 0.8 }}>{t('loadingUsers')}</div>}
        {status === 'failed' && <div className="text-danger mb-3">{t('errorFetchingUsers')}: {error}</div>}

        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0 loggedInCitizensTable">
            <thead>
              <tr>
                <th>Citizen Name</th>
                <th>Email</th>
                <th>Login Time</th>
                <th>Reports</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.userId}>
                    <td style={{ textTransform: 'capitalize' }}>{user.name}</td>
                    <td className='text-primary'>{user.email}</td>
                    <td><FontAwesomeIcon icon={faClock} className="me-2 text-primary" /> {new Date(user.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                    <td>
                      <span className="badge bg-secondary">{user.reports}</span>
                    </td>
                  </tr>
                ))
              ) : (
                status === 'succeeded' && (
                  <tr>
                    <td colSpan="4" className="text-center text-white" style={{ opacity: 0.7, padding: '20px' }}>
                      No active citizens logged in today.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <span className="text-white fs-12" style={{ opacity: 0.7 }}>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, displayUsers.length)} of {displayUsers.length}</span>
            <div className="btn-group">
              <button className="btn btn-sm btn-outline-secondary text-white fs-12" onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
              <button className="btn btn-sm btn-secondary text-white fs-12" disabled>{currentPage}</button>
              <button className="btn btn-sm btn-outline-secondary text-white fs-12" onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveUsers;
