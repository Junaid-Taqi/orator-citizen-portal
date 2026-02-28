import React from 'react';

// example hard‑coded data; in a real app this would come from props or API
const sampleUsers = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    login: '09:15 AM',
    duration: '3h 42m',
    lastActive: '2 minutes ago',
    reports: 3,
    status: 'Active',
    statusColor: 'success',
  },
  {
    name: 'Michael Chen',
    email: 'm.chen@email.com',
    login: '08:30 AM',
    duration: '4h 27m',
    lastActive: '5 minutes ago',
    reports: 1,
    status: 'Active',
    statusColor: 'success',
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    login: '10:00 AM',
    duration: '2h 57m',
    lastActive: '12 minutes ago',
    reports: 5,
    status: 'Active',
    statusColor: 'success',
  },
  {
    name: 'David Thompson',
    email: 'd.thompson@email.com',
    login: '07:45 AM',
    duration: '5h 12m',
    lastActive: '1 hour ago',
    reports: 2,
    status: 'Idle',
    statusColor: 'warning',
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    login: '11:30 AM',
    duration: '1h 27m',
    lastActive: 'Just now',
    reports: 0,
    status: 'Active',
    statusColor: 'success',
  },
];

const ActiveUsers = ({ users = sampleUsers }) => {
  const activeCount = users.filter((u) => u.status === 'Active').length;

  return (
    <div className="card bg-secondary bg-opacity-10 border border-secondary rounded-3 mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-0 text-white">Currently Logged In Citizens</h5>
            <p className="text-white mb-0">Active user sessions right now</p>
          </div>
          <span className="badge bg-success align-self-start">{activeCount} Active</span>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-borderless align-middle mb-0">
            <thead>
              <tr>
                <th>Citizen Name</th>
                <th>Email</th>
                <th>Login Time</th>
                <th>Session Duration</th>
                <th>Last Active</th>
                <th>Reports</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.login}</td>
                  <td>{user.duration}</td>
                  <td>{user.lastActive}</td>
                  <td>
                    <span className="badge bg-secondary">{user.reports}</span>
                  </td>
                  <td>
                    <span className={`text-${user.statusColor}`}>{user.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsers;
