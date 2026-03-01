import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ActiveUsers = () => {
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
            <h5 className="card-title mb-0 text-white">Currently Logged In Citizens</h5>
            <p className="text-primary mb-0">Active user sessions right now</p>
          </div>
        </div>

        {status === 'loading' && <div className="text-white mb-3" style={{ opacity: 0.8 }}>Loading users...</div>}
        {status === 'failed' && <div className="text-danger mb-3">Error fetching users: {error}</div>}

        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
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
                    <td>{user.email}</td>
                    <td>{new Date(user.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
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
            <span className="text-white" style={{ opacity: 0.7, fontSize: '0.85rem' }}>Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, displayUsers.length)} of {displayUsers.length}</span>
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

export default ActiveUsers;
