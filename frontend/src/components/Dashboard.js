import React, { useState } from 'react';
import TrainSearch from './TrainSearch';
import BookingManagement from './BookingManagement';

const Dashboard = ({ user, setUser, setMessage }) => {
  const [activeTab, setActiveTab] = useState('search');

  const tabs = [
    { id: 'search', label: 'Search Trains', icon: '🔍' },
    { id: 'bookings', label: 'My Bookings', icon: '🎫' }
  ];

  return (
    <div>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'search' && (
        <TrainSearch user={user} setUser={setUser} setMessage={setMessage} />
      )}

      {activeTab === 'bookings' && (
        <BookingManagement user={user} setUser={setUser} setMessage={setMessage} />
      )}
    </div>
  );
};

export default Dashboard;