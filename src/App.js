import React from 'react';
import './App.css';

// top‑level components
import DashboardHeader from './components/DashboardHeader';
import DashboardOverview from './components/DashboardOverview';
import ReportStats from './components/ReportStats';

function App() {
  return (
    <div className="App">
      <DashboardHeader />
      <main className="app-main">
        <div className="page-header">
          <h2>Citizen Control Panel</h2>
          <p className="page-subtitle">Monitor citizen engagement, track reports, and manage user activity</p>
        </div>
        <DashboardOverview />
        <ReportStats />
      </main>
    </div>
  );
}

export default App;
