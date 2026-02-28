import React from 'react';
import './DashboardHeader.css';

const DashboardHeader = () => (
  <header className="dashboard-header">
    <div className="header-left">
      <h1>Municipality of Tisno</h1>
      <span className="header-tagline">Monitor your digital signage network</span>
    </div>
    <div className="header-right">
      <span className="notification-bell">🔔</span>
      <div className="user-info">
        <span className="user-name">Admin User</span>
        <span className="user-email">admin@orator.com</span>
      </div>
    </div>
  </header>
);

export default DashboardHeader;
