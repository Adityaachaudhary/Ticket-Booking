import React, { useState } from 'react';
import { searchTrains, bookSeat } from '../services/trainApi';
import SeatSelection from './SeatSelection';
import StationSuggestions from './StationSuggestions';

const TrainSearch = ({ user, setUser, setMessage }) => {
  const [searchData, setSearchData] = useState({
    source: '',
    destination: ''
  });
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showSeats, setShowSeats] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchData.source || !searchData.destination) {
      setMessage('Please enter both source and destination');
      return;
    }

    setLoading(true);
    try {
      const result = await searchTrains(searchData.source.toLowerCase(), searchData.destination.toLowerCase());
      setTrains(result.trains);
      setSelectedTrain(null);
      setShowSeats(false);
      
      if (result.trains.length === 0) {
        setMessage(`No trains available between ${searchData.source} and ${searchData.destination}`);
      } else {
        setMessage(`✅ Found ${result.trains.length} trains with live availability`);
      }
    } catch (error) {
      setMessage('❌ Error searching trains. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
    setShowSeats(true);
  };

  const handleSeatBook = async (row, col) => {
    try {
      const result = await bookSeat(selectedTrain, row, col, user);
      if (result.success) {
        setMessage(`🎉 Seat ${result.ticket.seatNumber} booked successfully! PNR: ${result.ticket.pnr}`);
        
        // Update the train seats
        const updatedTrains = trains.map(t => 
          t.trainId === selectedTrain.trainId ? result.updatedTrain : t
        );
        setTrains(updatedTrains);
        setSelectedTrain(result.updatedTrain);
        
        // Update user with new booking
        const updatedUser = {
          ...user,
          ticketsBooked: [...(user.ticketsBooked || []), result.ticket]
        };
        setUser(updatedUser);
        
        return result;
      } else {
        setMessage(`❌ ${result.message}`);
        throw new Error(result.message);
      }
    } catch (error) {
      setMessage('❌ Booking failed: ' + error.message);
      throw error;
    }
  };
  
  const handleBookingComplete = () => {
    // Refresh the seat display after booking
    setShowSeats(false);
    setTimeout(() => setShowSeats(true), 100);
  };

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <div className="card">
        <h2>🔍 Search Live Trains</h2>
        <p className="search-subtitle">Find real-time train availability between Indian Railway stations</p>
        <form onSubmit={handleSearch} className="grid grid-2">
          <div className="form-group">
            <label>🚉 Source Station</label>
            <StationSuggestions
              value={searchData.source}
              onChange={(value) => setSearchData({...searchData, source: value})}
              placeholder="Enter source station (e.g., Delhi, Mumbai)"
            />
          </div>
          
          <div className="form-group">
            <label>🏁 Destination Station</label>
            <StationSuggestions
              value={searchData.destination}
              onChange={(value) => setSearchData({...searchData, destination: value})}
              placeholder="Enter destination station (e.g., Chennai, Bangalore)"
            />
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '🔍 Searching...' : '🚂 Search Trains'}
            </button>
          </div>
        </form>
      </div>

      {trains.length > 0 && (
        <div className="card">
          <h3>🚂 Available Trains ({trains.length})</h3>
          {trains.map((train, index) => (
            <div
              key={train.trainId}
              className={`train-card ${selectedTrain?.trainId === train.trainId ? 'selected' : ''}`}
              onClick={() => handleTrainSelect(train)}
            >
              <div className="train-info">
                <div className="train-header">
                  <h3>🚂 {train.trainNumber || train.trainNo} - {train.trainName}</h3>
                  <div className="train-status">
                    <span className="status-badge">✅ Available</span>
                  </div>
                </div>
                <div className="train-route">
                  📍 <strong>{train.stations[0]}</strong> → <strong>{train.stations[train.stations.length - 1]}</strong>
                </div>
                <div className="train-details">
                  <div className="detail-item">
                    <span className="detail-label">🕐 Departure</span>
                    <span className="detail-value">{train.stationTimes[train.stations[0]]}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">🕐 Arrival</span>
                    <span className="detail-value">{train.stationTimes[train.stations[train.stations.length - 1]]}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">⏱️ Duration</span>
                    <span className="detail-value">{train.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📏 Distance</span>
                    <span className="detail-value">{train.distance}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">💰 Fare</span>
                    <span className="detail-value">₹{train.fare}</span>
                  </div>
                </div>
                {train.availability && (
                  <div className="availability-info">
                    <span className="availability-label">🪑 Available Seats:</span>
                    <div className="class-availability">
                      {Object.entries(train.availability).map(([className, count]) => (
                        count > 0 && (
                          <span key={className} className="class-badge">
                            {className}: {count}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSeats && selectedTrain && (
        <SeatSelection 
          train={selectedTrain} 
          onSeatBook={handleSeatBook}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
};

export default TrainSearch;