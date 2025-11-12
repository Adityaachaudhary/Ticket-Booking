// Real Train API Service using free Indian Railways API
const BACKEND_API_BASE = 'http://localhost:8080/api';

// Station codes mapping for major Indian cities
const stationCodes = {
  'new delhi': 'NDLS', 'delhi': 'NDLS',
  'mumbai': 'CSTM', 'mumbai central': 'BCT',
  'chennai': 'MAS', 'chennai central': 'MAS',
  'bangalore': 'SBC', 'bengaluru': 'SBC',
  'kolkata': 'HWH', 'calcutta': 'HWH',
  'jaipur': 'JP', 'pune': 'PUNE',
  'ahmedabad': 'ADI', 'goa': 'MAO',
  'kochi': 'ERS', 'hyderabad': 'HYB'
};

// Generate realistic seat layout
function generateSeats(occupancyRate = 0.3) {
  const seats = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 6; j++) {
      row.push(Math.random() < occupancyRate ? 1 : 0);
    }
    seats.push(row);
  }
  return seats;
}

// Fallback train data for demo
const fallbackTrains = [
  {
    trainId: 'T12951', trainNo: '12951', trainName: 'Mumbai Rajdhani Express',
    stations: ['New Delhi', 'Mumbai Central'],
    stationTimes: { 'New Delhi': '16:55', 'Mumbai Central': '08:35' },
    distance: '1384 km', duration: '15h 40m', fare: 2500,
    seats: generateSeats(0.25)
  },
  {
    trainId: 'T12015', trainNo: '12015', trainName: 'Ajmer Shatabdi Express',
    stations: ['New Delhi', 'Jaipur'],
    stationTimes: { 'New Delhi': '06:00', 'Jaipur': '10:30' },
    distance: '308 km', duration: '4h 30m', fare: 800,
    seats: generateSeats(0.15)
  },
  {
    trainId: 'T12621', trainNo: '12621', trainName: 'Tamil Nadu Express',
    stations: ['New Delhi', 'Chennai Central'],
    stationTimes: { 'New Delhi': '22:30', 'Chennai Central': '07:40' },
    distance: '2180 km', duration: '33h 10m', fare: 1800,
    seats: generateSeats(0.30)
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Search trains using real API with fallback
export const searchTrains = async (source, destination) => {
  await delay(800);
  
  try {
    // Try to use real API (currently using fallback as free APIs are limited)
    const trains = fallbackTrains.filter(train => 
      train.stations.some(station => station.toLowerCase().includes(source.toLowerCase())) &&
      train.stations.some(station => station.toLowerCase().includes(destination.toLowerCase()))
    );
    
    return { success: true, trains };
  } catch (error) {
    console.error('Train search error:', error);
    return { success: false, trains: [] };
  }
};

// Mock booking functions for frontend
export const login = async (username, password) => {
  await delay(500);
  try {
    const response = await fetch(`${BACKEND_API_BASE}/login`, {
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
  await delay(500);
  try {
    const response = await fetch(`${BACKEND_API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Connection failed' };
  }
};

export const bookSeat = async (train, row, col, user) => {
  await delay(400);
  try {
    const response = await fetch(`${BACKEND_API_BASE}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trainId: train.trainId,
        userId: user.userId,
        row, col
      })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Booking failed' };
  }
};

export const getBookings = async (userId) => {
  await delay(300);
  try {
    const response = await fetch(`${BACKEND_API_BASE}/bookings?userId=${userId}`);
    return await response.json();
  } catch (error) {
    return { success: false, bookings: [] };
  }
};

export const cancelBooking = async (ticketId, userId) => {
  await delay(400);
  try {
    const response = await fetch(`${BACKEND_API_BASE}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, userId })
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Cancellation failed' };
  }
};