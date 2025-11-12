// Connected Backend API Service
const API_BASE_URL = 'http://localhost:8080/api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (username, password) => {
  await delay(300);
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Connection failed' };
  }
};

export const signup = async (username, password) => {
  await delay(300);
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Connection failed' };
  }
};

export const searchTrains = async (source, destination) => {
  await delay(500);
  try {
    const response = await fetch(`${API_BASE_URL}/trains/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
    return await response.json();
  } catch (error) {
    return { success: false, trains: [] };
  }
};

export const bookSeat = async (train, row, col, user) => {
  await delay(400);
  try {
    const response = await fetch(`${API_BASE_URL}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trainId: train.trainId,
        userId: user.userId,
        row: row,
        col: col
      })
    });
    const result = await response.json();
    
    if (result.success) {
      // Generate ticket info for frontend
      const ticket = {
        ticketId: `TKT${Math.random().toString().substr(2, 8)}`,
        source: train.stations[0],
        destination: train.stations[train.stations.length - 1],
        seatNumber: `${String.fromCharCode(65 + row)}${col + 1}`,
        pnr: `PNR${Math.random().toString().substr(2, 10)}`,
        trainName: train.trainName,
        fare: Math.floor(Math.random() * 2000) + 500
      };
      
      return { success: true, ticket, message: result.message };
    }
    
    return result;
  } catch (error) {
    return { success: false, message: 'Booking failed' };
  }
};

export const getBookings = async (userId) => {
  await delay(300);
  try {
    const response = await fetch(`${API_BASE_URL}/bookings?userId=${userId}`);
    return await response.json();
  } catch (error) {
    return { success: false, bookings: [] };
  }
};

export const cancelBooking = async (ticketId, userId) => {
  await delay(400);
  try {
    const response = await fetch(`${API_BASE_URL}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, userId })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Cancellation failed' };
  }
};