// Hybrid API: Real train data + Mock booking system

// Real Indian Railways station codes
const stationCodes = {
  'new delhi': 'NDLS',
  'mumbai central': 'BCT',
  'chennai central': 'MAS',
  'bangalore': 'SBC',
  'kolkata': 'HWH',
  'jaipur': 'JP',
  'pune': 'PUNE',
  'ahmedabad': 'ADI',
  'goa': 'MAO',
  'kochi': 'ERS'
};

// Mock users for booking
let mockUsers = [
  {
    userId: '1',
    username: 'demo',
    password: 'demo123',
    ticketsBooked: []
  }
];

// Real train data fallback
const realTrainDatabase = [
  { trainId: 'T12951', trainNo: '12951', trainName: 'Mumbai Rajdhani Express', stations: ['new delhi', 'mumbai central'], stationTimes: { 'new delhi': '16:55', 'mumbai central': '08:35' }, distance: '1384 km', duration: '15h 40m', seats: generateRealisticSeats(0.25) },
  { trainId: 'T12015', trainNo: '12015', trainName: 'Ajmer Shatabdi Express', stations: ['new delhi', 'jaipur'], stationTimes: { 'new delhi': '06:00', 'jaipur': '10:30' }, distance: '308 km', duration: '4h 30m', seats: generateRealisticSeats(0.15) },
  { trainId: 'T10103', trainNo: '10103', trainName: 'Mandovi Express', stations: ['mumbai central', 'goa'], stationTimes: { 'mumbai central': '07:10', 'goa': '19:05' }, distance: '765 km', duration: '11h 55m', seats: generateRealisticSeats(0.20) }
];

function generateRealisticSeats(occupancyRate = 0.3) {
  const seats = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 6; j++) {
      row.push(Math.random() < occupancyRate ? 1 : 0);
    }
    seats.push(row);
  }
  return seats;
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const generateId = () => Math.random().toString(36).substr(2, 9);

// Real API integration with fallback
export const searchTrains = async (source, destination) => {
  await delay(800);
  
  try {
    const realTrains = await fetchRealTrainData(source, destination);
    if (realTrains && realTrains.length > 0) {
      return { success: true, trains: realTrains };
    }
  } catch (error) {
    console.log('Using fallback data');
  }
  
  // Fallback to mock data
  const trains = realTrainDatabase.filter(train => 
    train.stations.includes(source.toLowerCase()) && 
    train.stations.includes(destination.toLowerCase())
  );
  
  return { success: true, trains };
};

async function fetchRealTrainData(source, destination) {
  const sourceCode = stationCodes[source.toLowerCase()] || source;
  const destCode = stationCodes[destination.toLowerCase()] || destination;
  
  try {
    const response = await fetch(`https://api.railwayapi.site/api/v1/trains/between/${sourceCode}/${destCode}`);
    if (response.ok) {
      const data = await response.json();
      return formatRealTrainData(data);
    }
  } catch (error) {
    return null;
  }
}

function formatRealTrainData(apiData) {
  return apiData.trains?.map(train => ({
    trainId: train.train_number,
    trainNo: train.train_number,
    trainName: train.train_name,
    stations: [train.from_station_name, train.to_station_name],
    stationTimes: {
      [train.from_station_name]: train.departure_time,
      [train.to_station_name]: train.arrival_time
    },
    distance: train.distance || '500 km',
    duration: train.travel_time || '8h 30m',
    seats: generateRealisticSeats(0.3)
  })) || [];
}

// Mock booking functions
export const login = async (username, password) => {
  await delay(500);
  const user = mockUsers.find(u => u.username === username && u.password === password);
  return user ? { success: true, user } : { success: false, message: 'Invalid credentials' };
};

export const bookSeat = async (train, row, col, user) => {
  await delay(400);
  
  if (train.seats[row][col] === 1) {
    return { success: false, message: 'Seat already booked!' };
  }
  
  const ticket = {
    ticketId: generateId(),
    userId: user.userId,
    source: train.stations[0],
    destination: train.stations[train.stations.length - 1],
    train: train,
    seatNumber: `${String.fromCharCode(65 + row)}${col + 1}`,
    fare: Math.floor(Math.random() * 2000) + 500,
    pnr: 'PNR' + Math.random().toString().substr(2, 10),
    status: 'Confirmed'
  };
  
  const userIndex = mockUsers.findIndex(u => u.userId === user.userId);
  if (userIndex !== -1) {
    mockUsers[userIndex].ticketsBooked.push(ticket);
  }
  
  return { success: true, ticket };
};

export const getBookings = async (userId) => {
  await delay(300);
  const user = mockUsers.find(u => u.userId === userId);
  return { success: true, bookings: user ? user.ticketsBooked : [] };
};

export const cancelBooking = async (ticketId, userId) => {
  await delay(400);
  const userIndex = mockUsers.findIndex(u => u.userId === userId);
  if (userIndex !== -1) {
    const ticketIndex = mockUsers[userIndex].ticketsBooked.findIndex(t => t.ticketId === ticketId);
    if (ticketIndex !== -1) {
      mockUsers[userIndex].ticketsBooked.splice(ticketIndex, 1);
      return { success: true, message: 'Booking cancelled!' };
    }
  }
  return { success: false, message: 'Booking not found!' };
};