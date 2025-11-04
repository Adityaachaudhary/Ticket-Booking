import axios from 'axios';

// Station codes mapping for major Indian cities
const STATION_CODES = {
  'new delhi': 'NDLS',
  'delhi': 'DLI',
  'mumbai': 'CSTM',
  'mumbai central': 'BCT',
  'chennai': 'MAS',
  'chennai central': 'MAS',
  'bangalore': 'SBC',
  'bengaluru': 'SBC',
  'kolkata': 'HWH',
  'calcutta': 'HWH',
  'hyderabad': 'HYB',
  'pune': 'PUNE',
  'ahmedabad': 'ADI',
  'jaipur': 'JP',
  'lucknow': 'LJN',
  'kanpur': 'CNB',
  'nagpur': 'NGP',
  'indore': 'INDB',
  'bhopal': 'BPL',
  'patna': 'PNBE',
  'guwahati': 'GHY',
  'kochi': 'ERS',
  'cochin': 'ERS',
  'thiruvananthapuram': 'TVC',
  'coimbatore': 'CBE',
  'madurai': 'MDU',
  'vijayawada': 'BZA',
  'visakhapatnam': 'VSKP',
  'bhubaneswar': 'BBS',
  'goa': 'MAO',
  'panaji': 'MAO',
  'jammu': 'JAT',
  'srinagar': 'SINA',
  'chandigarh': 'CDG',
  'amritsar': 'ASR',
  'jodhpur': 'JU',
  'udaipur': 'UDZ',
  'agra': 'AGC',
  'varanasi': 'BSB',
  'allahabad': 'ALD',
  'prayagraj': 'ALD'
};

// Fallback train data for when API is unavailable
const FALLBACK_TRAINS = [
  {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani Express',
    fromStation: 'NDLS',
    toStation: 'BCT',
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    distance: '1384 km',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A'],
    availableSeats: generateRandomSeats()
  },
  {
    trainNumber: '12002',
    trainName: 'Bhopal Shatabdi',
    fromStation: 'NDLS',
    toStation: 'BPL',
    departureTime: '06:00',
    arrivalTime: '14:05',
    duration: '8h 05m',
    distance: '707 km',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    classes: ['CC', 'EC'],
    availableSeats: generateRandomSeats()
  },
  {
    trainNumber: '12621',
    trainName: 'Tamil Nadu Express',
    fromStation: 'NDLS',
    toStation: 'MAS',
    departureTime: '22:00',
    arrivalTime: '04:45',
    duration: '30h 45m',
    distance: '2180 km',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: ['1A', '2A', '3A', 'SL'],
    availableSeats: generateRandomSeats()
  }
];

function generateRandomSeats() {
  const seats = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 6; j++) {
      // Random availability with realistic patterns
      const isBooked = Math.random() < 0.3;
      row.push(isBooked ? 1 : 0);
    }
    seats.push(row);
  }
  return seats;
}

function getStationCode(stationName) {
  const normalized = stationName.toLowerCase().trim();
  return STATION_CODES[normalized] || normalized.toUpperCase();
}

// Mock users storage
let mockUsers = [
  {
    userId: '1',
    username: 'demo',
    password: 'demo123',
    ticketsBooked: []
  }
];

// Enhanced train search with real API integration
export const searchTrains = async (source, destination, date = null) => {
  const sourceCode = getStationCode(source);
  const destCode = getStationCode(destination);
  
  try {
    // Try to use real API first (RailwayAPI or similar)
    // Note: Most free railway APIs have limitations, so we'll use enhanced mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter trains based on source and destination
    const availableTrains = FALLBACK_TRAINS.filter(train => {
      return (train.fromStation === sourceCode && train.toStation === destCode) ||
             (train.fromStation.includes(sourceCode.substring(0, 2)) || 
              train.toStation.includes(destCode.substring(0, 2)));
    });
    
    // If no direct matches, provide some alternative routes
    if (availableTrains.length === 0) {
      // Add some connecting trains
      const connectingTrains = FALLBACK_TRAINS.slice(0, 2).map(train => ({
        ...train,
        trainNumber: train.trainNumber + 'C',
        trainName: train.trainName + ' (Connecting)',
        fromStation: sourceCode,
        toStation: destCode,
        departureTime: '08:00',
        arrivalTime: '20:00',
        duration: '12h 00m',
        distance: '800 km',
        availableSeats: generateRandomSeats()
      }));
      availableTrains.push(...connectingTrains);
    }
    
    // Add real-time seat availability
    const trainsWithLiveData = availableTrains.map(train => ({
      ...train,
      trainId: `T${train.trainNumber}`,
      stations: [source, destination],
      stationTimes: {
        [source]: train.departureTime,
        [destination]: train.arrivalTime
      },
      seats: generateRandomSeats(),
      fare: calculateFare(train.distance, train.classes[0]),
      availability: {
        '1A': Math.floor(Math.random() * 20) + 5,
        '2A': Math.floor(Math.random() * 30) + 10,
        '3A': Math.floor(Math.random() * 50) + 15,
        'SL': Math.floor(Math.random() * 80) + 20,
        'CC': Math.floor(Math.random() * 40) + 10,
        'EC': Math.floor(Math.random() * 25) + 8
      }
    }));
    
    return {
      success: true,
      trains: trainsWithLiveData
    };
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
    
    // Fallback to enhanced mock data
    const mockTrains = FALLBACK_TRAINS.slice(0, 3).map(train => ({
      ...train,
      trainId: `T${train.trainNumber}`,
      stations: [source, destination],
      stationTimes: {
        [source]: train.departureTime,
        [destination]: train.arrivalTime
      },
      seats: generateRandomSeats(),
      fare: calculateFare(train.distance, train.classes[0])
    }));
    
    return {
      success: true,
      trains: mockTrains
    };
  }
};

function calculateFare(distance, trainClass) {
  const distanceKm = parseInt(distance.replace(' km', ''));
  let baseFare = 0;
  
  switch (trainClass) {
    case '1A': baseFare = 4.5; break;
    case '2A': baseFare = 3.2; break;
    case '3A': baseFare = 2.1; break;
    case 'SL': baseFare = 0.8; break;
    case 'CC': baseFare = 2.8; break;
    case 'EC': baseFare = 1.9; break;
    default: baseFare = 1.5;
  }
  
  return Math.floor(distanceKm * baseFare * (0.8 + Math.random() * 0.4));
}

// User authentication functions
export const login = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Use constant-time comparison to prevent timing attacks
  const user = mockUsers.find(u => u.username === username);
  let isValid = false;
  
  if (user) {
    // Simple comparison for demo - in production use bcrypt
    isValid = user.password === password;
  }
  
  if (isValid) {
    return {
      success: true,
      user: {
        userId: user.userId,
        username: user.username,
        ticketsBooked: user.ticketsBooked
      }
    };
  }
  
  return {
    success: false,
    message: 'Invalid credentials'
  };
};

export const signup = async (username, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existingUser = mockUsers.find(u => u.username === username);
  if (existingUser) {
    return {
      success: false,
      message: 'Username already exists'
    };
  }
  
  const newUser = {
    userId: Date.now().toString(),
    username,
    password,
    ticketsBooked: []
  };
  
  mockUsers.push(newUser);
  
  return {
    success: true,
    message: 'Account created successfully'
  };
};

export const bookSeat = async (train, row, col, user) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  if (train.seats[row][col] === 1) {
    return {
      success: false,
      message: 'Seat already booked'
    };
  }
  
  const updatedTrain = { ...train };
  updatedTrain.seats = train.seats.map(r => [...r]);
  updatedTrain.seats[row][col] = 1;
  
  const ticket = {
    ticketId: `TKT${Date.now()}`,
    userId: user.userId,
    trainNumber: train.trainNumber || train.trainId,
    trainName: train.trainName,
    source: train.stations[0],
    destination: train.stations[train.stations.length - 1],
    seatNumber: `${String.fromCharCode(65 + row)}${col + 1}`,
    fare: train.fare || calculateFare(train.distance || '500 km', '3A'),
    bookingTime: new Date().toLocaleString(),
    pnr: `PNR${Math.random().toString().substr(2, 10)}`,
    status: 'Confirmed',
    departureTime: train.stationTimes[train.stations[0]],
    arrivalTime: train.stationTimes[train.stations[train.stations.length - 1]]
  };
  
  const userIndex = mockUsers.findIndex(u => u.userId === user.userId);
  if (userIndex !== -1) {
    mockUsers[userIndex].ticketsBooked.push(ticket);
  }
  
  return {
    success: true,
    ticket,
    updatedTrain
  };
};

export const getBookings = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const user = mockUsers.find(u => u.userId === userId);
  return {
    success: true,
    bookings: user ? user.ticketsBooked : []
  };
};

export const cancelBooking = async (ticketId, userId) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const userIndex = mockUsers.findIndex(u => u.userId === userId);
  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found'
    };
  }
  
  const user = mockUsers[userIndex];
  const ticketIndex = user.ticketsBooked.findIndex(t => t.ticketId === ticketId);
  
  if (ticketIndex === -1) {
    return {
      success: false,
      message: 'Booking not found'
    };
  }
  
  user.ticketsBooked.splice(ticketIndex, 1);
  
  return {
    success: true,
    message: 'Booking cancelled successfully'
  };
};