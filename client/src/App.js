import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const [userEmail, setUserEmail] = useState(null);

  return (
    <div className="app-root">
      <div className="app-card">
        <header className="app-header">
          <h1>Stock Broker Client Dashboard</h1>
          <p className="app-subtitle">
            Real-time simulated stock price monitoring for subscribed tickers.
          </p>
        </header>

        {!userEmail ? (
          <Login onLogin={setUserEmail} />
        ) : (
          <Dashboard email={userEmail} onLogout={() => setUserEmail(null)} />
        )}

        <footer className="app-footer">
          <small>
            This dashboard is a demo application for academic purposes. Stock prices are randomly generated every second.
          </small>
        </footer>
      </div>
    </div>
  );
}
