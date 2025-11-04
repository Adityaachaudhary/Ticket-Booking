import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const handleLogin = (userData) => {
    setUser(userData);
    setMessage(`Welcome ${userData.username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setMessage('Logged out successfully');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎟️ Ticket Booking System</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="container">
        {message && (
          <div className={`alert ${message.includes('Welcome') || message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <ErrorBoundary>
          {!user ? (
            <Login onLogin={handleLogin} setMessage={setMessage} />
          ) : (
            <Dashboard user={user} setUser={setUser} setMessage={setMessage} />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;