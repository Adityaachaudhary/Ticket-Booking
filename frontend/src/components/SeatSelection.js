import React, { useState } from 'react';

const SeatSelection = ({ train, onSeatBook, onBookingComplete }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [booking, setBooking] = useState(false);

  const handleSeatClick = (rowIndex, colIndex, seatValue) => {
    if (seatValue === 1 || booking) return; // Already booked or booking in progress
    
    setSelectedSeat({ row: rowIndex, col: colIndex });
  };

  const handleBookSeat = async () => {
    if (selectedSeat && !booking) {
      setBooking(true);
      try {
        await onSeatBook(selectedSeat.row, selectedSeat.col);
        setSelectedSeat(null);
        // Notify parent component that booking is complete
        if (onBookingComplete) {
          onBookingComplete();
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Booking failed:', error);
        }
      } finally {
        setBooking(false);
      }
    }
  };

  const getSeatLabel = (row, col) => {
    return `${String.fromCharCode(65 + row)}${col + 1}`;
  };

  return (
    <div className="card">
      <h3>🪑 Select Your Seat</h3>
      <div className="train-summary">
        <div className="train-title">
          <h4>🚂 {train.trainNumber || train.trainNo} - {train.trainName}</h4>
          <span className="train-class">AC 3-Tier</span>
        </div>
        <div className="route-info">
          <span className="route">📍 {train.stations.join(' → ')}</span>
          <span className="timing">🕐 {train.stationTimes[train.stations[0]]} - {train.stationTimes[train.stations[train.stations.length - 1]]}</span>
        </div>
      </div>
      
      <div className="seat-legend" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="seat available">A</div>
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="seat booked">B</div>
          <span>Booked</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="seat selected">S</div>
          <span>Selected</span>
        </div>
      </div>

      <div className="seat-container">
        <div className="coach-header">
          <h5>🚃 Coach A1 - AC 3-Tier</h5>
          <div className="seat-layout-info">
            <span className="window-label">🪟 Window</span>
            <span className="aisle-label">Aisle</span>
            <span className="aisle-gap">||</span>
            <span className="aisle-label">Aisle</span>
            <span className="window-label">Window 🪟</span>
          </div>
        </div>
        <div className="seat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', maxWidth: '420px', margin: '0 auto' }}>
          {train.seats.map((row, rowIndex) =>
            row.map((seat, colIndex) => {
              const isSelected = selectedSeat?.row === rowIndex && selectedSeat?.col === colIndex;
              const seatLabel = getSeatLabel(rowIndex, colIndex);
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`seat ${
                    seat === 0 ? 'available' : 'booked'
                  } ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSeatClick(rowIndex, colIndex, seat)}
                  style={{ 
                    cursor: seat === 1 || booking ? 'not-allowed' : 'pointer',
                    opacity: booking ? 0.7 : 1,
                    marginRight: colIndex === 2 ? '20px' : '0',
                    width: '50px',
                    height: '50px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isSelected ? '✓' : (seat === 1 ? '✗' : seatLabel)}
                </div>
              );
            })
          )}
        </div>
        <div className="seat-layout-legend">
          <div className="legend-item">
            <span className="legend-icon">🎫</span>
            <span>3+3 Seating Configuration</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">📋</span>
            <span>Seats A1-A3 & A4-A6 per row</span>
          </div>
        </div>
      </div>

      {selectedSeat && (
        <div className="booking-summary">
          <h4>Booking Summary</h4>
          <div className="booking-details">
            <div className="detail-row">
              <span className="detail-icon">🪑</span>
              <span><strong>Selected Seat:</strong> {getSeatLabel(selectedSeat.row, selectedSeat.col)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-icon">🚂</span>
              <span><strong>Train:</strong> {train.trainNumber || train.trainNo} - {train.trainName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-icon">📍</span>
              <span><strong>Route:</strong> {train.stations[0]} → {train.stations[train.stations.length - 1]}</span>
            </div>
            <div className="detail-row">
              <span className="detail-icon">🕐</span>
              <span><strong>Journey:</strong> {train.stationTimes[train.stations[0]]} - {train.stationTimes[train.stations[train.stations.length - 1]]}</span>
            </div>
            <div className="detail-row fare-row">
              <span className="detail-icon">💰</span>
              <span><strong>Fare:</strong> ₹{train.fare || '1,250'}</span>
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleBookSeat}
            disabled={booking}
          >
            {booking ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;