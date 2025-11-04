import React, { useState, useEffect } from 'react';
import { getBookings, cancelBooking } from '../services/trainApi';

const BookingManagement = ({ user, setUser, setMessage }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [user]);
  
  useEffect(() => {
    // Update bookings when user.ticketsBooked changes
    if (user && user.ticketsBooked) {
      setBookings(user.ticketsBooked);
      setLoading(false);
    }
  }, [user?.ticketsBooked]);

  const fetchBookings = async () => {
    try {
      if (user && user.ticketsBooked) {
        setBookings(user.ticketsBooked);
      } else {
        const result = await getBookings(user.userId);
        setBookings(result.bookings);
      }
      setLoading(false);
    } catch (error) {
      setMessage('Error fetching bookings');
      setLoading(false);
    }
  };

  const handleCancelBooking = async (ticketId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const result = await cancelBooking(ticketId, user.userId);
        if (result.success) {
          setMessage('Booking cancelled successfully!');
          
          // Update user state by removing the cancelled booking
          const updatedUser = {
            ...user,
            ticketsBooked: user.ticketsBooked.filter(ticket => ticket.ticketId !== ticketId)
          };
          setUser(updatedUser);
          
          fetchBookings(); // Refresh bookings
        } else {
          setMessage(result.message);
        }
      } catch (error) {
        setMessage('Error cancelling booking');
      }
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <h2>Loading your bookings...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>🎫 My Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="text-center">
            <p>No tickets booked yet!</p>
            <p>Search for trains and book your first ticket.</p>
          </div>
        ) : (
          <div>
            <p>You have {bookings.length} booking(s)</p>
            
            {bookings.map((ticket) => (
              <div key={ticket.ticketId} className="ticket-card">
                <div className="ticket-header">
                  <h3>🎟️ Ticket</h3>
                  <div className="ticket-id">
                    <span>🎫 {ticket.ticketId}</span>
                    {ticket.pnr && <span className="pnr-badge">PNR: {ticket.pnr}</span>}
                  </div>
                </div>
                
                <div className="ticket-details">
                  <div className="detail-item">
                    <div className="detail-label">🚉 From</div>
                    <div className="detail-value">{ticket.source}</div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">🏁 To</div>
                    <div className="detail-value">{ticket.destination}</div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">🚂 Train</div>
                    <div className="detail-value">{ticket.trainNumber || ticket.train?.trainNo} - {ticket.trainName || ticket.train?.trainName}</div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">🪑 Seat</div>
                    <div className="detail-value">{ticket.seatNumber || 'N/A'}</div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">🕐 Journey</div>
                    <div className="detail-value">{ticket.departureTime} - {ticket.arrivalTime}</div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">💰 Fare</div>
                    <div className="detail-value">₹{ticket.fare || 'N/A'}</div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-label">📅 Booked</div>
                    <div className="detail-value">{ticket.bookingTime}</div>
                  </div>
                  
                  {ticket.status && (
                    <div className="detail-item">
                      <div className="detail-label">✅ Status</div>
                      <div className="detail-value">
                        <span className="status-confirmed">{ticket.status}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleCancelBooking(ticket.ticketId)}
                  >
                    ❌ Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;