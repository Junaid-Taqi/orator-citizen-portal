import React from 'react';

const DashboardHeader = () => (
  <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#396C8D' }}>
    <div className="container-fluid">
      <span className="navbar-brand mb-0 h1 text-white">Municipality of Tisno</span>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          <li className="nav-item me-3">
            <span className="nav-link" style={{ cursor: 'pointer' }}>
              🔔
            </span>
          </li>
          <li className="nav-item dropdown">
            <span
              className="nav-link dropdown-toggle"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Admin User
            </span>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><span className="dropdown-item">admin@orator.com</span></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default DashboardHeader;
