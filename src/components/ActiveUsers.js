import React from 'react';
import { useSelector } from 'react-redux';

const ActiveUsers = () => {
  const { usersList, status, error } = useSelector((state) => state.ActiveCitizens);

  // Fallback for empty list or loading state handled in UI
  const displayUsers = usersList || [];

  return (
    <div className="card bg-secondary bg-opacity-10 border border-secondary rounded-3 mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-0 text-white">Currently Logged In Citizens</h5>
            <p className="text-white mb-0">Active user sessions right now</p>
          </div>
        </div>

        {status === 'loading' && <div className="text-white mb-3" style={{ opacity: 0.8 }}>Loading users...</div>}
        {status === 'failed' && <div className="text-danger mb-3">Error fetching users: {error}</div>}

        <div className="table-responsive">
          <table className="table table-dark table-borderless align-middle mb-0">
            <thead>
              <tr>
                <th>Citizen Name</th>
                <th>Email</th>
                <th>Login Time</th>
                <th>Reports</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.length > 0 ? (
                displayUsers.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.loginTime).toLocaleString()}</td>
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
      </div>
    </div>
  );
};

export default ActiveUsers;
