# 🎟️ **Ticket Booking System (Full-Stack)**

This project is a comprehensive **Java-based Ticket Booking System** with both CLI and Web interfaces, designed to strengthen **Object-Oriented Programming (OOP)** skills while implementing practical functionalities like **user authentication, train search, ticket booking, and cancellation**. *Special thanks to [Lovepreet Singh](https://github.com/AlphaDecodeX) for his amazing tutorials and projects. His teaching helped me a lot!*

## 🚀 **Features**

✔️ **User Authentication** – Secure sign-up and login system  
✔️ **Train Search** – Find trains between selected stations  
✔️ **Seat Availability** – View available seats before booking  
✔️ **Interactive Seat Selection** – Visual seat map with real-time updates  
✔️ **Booking Management** – Reserve and cancel train seats  
✔️ **Data Persistence** – Store user and booking information  
✔️ **Responsive Design** – Works on desktop, tablet, and mobile  
✔️ **Modern UI** – Clean, intuitive interface with smooth animations  

## 🛠️ **Technologies Used**

### **Backend (Java)**
🔹 **Java** – Core logic and implementation  
🔹 **Gradle** – Build automation and dependency management  
🔹 **Collections & Streams API** – Efficient data handling  
🔹 **OOP Principles** – Encapsulation, Abstraction, and Polymorphism  
🔹 **BCrypt** – Password hashing and security  
🔹 **Jackson** – JSON data processing  

### **Frontend (React)**
🔹 **React 18** – Modern UI framework with hooks  
🔹 **JavaScript ES6+** – Interactive frontend logic  
🔹 **CSS3** – Responsive design and animations  
🔹 **Mock API** – Simulates backend integration  

## 📁 **Project Structure**

```
TicketBookingSystem/
├── backend/                    # Java backend application
│   ├── src/main/java/com/ticketbooking/
│   │   ├── cli/               # Command Line Interface
│   │   │   └── TicketBookingApp.java
│   │   ├── entities/          # Data Models
│   │   │   ├── User.java
│   │   │   ├── Train.java
│   │   │   └── Ticket.java
│   │   ├── services/          # Business Logic
│   │   │   ├── UserBookingService.java
│   │   │   └── TrainService.java
│   │   └── utils/             # Utility Classes
│   │       └── UserServiceUtil.java
│   ├── src/main/resources/data/ # JSON Data Files
│   │   ├── users.json
│   │   └── trains.json
│   └── build.gradle           # Backend dependencies
├── frontend/                   # React web application
│   ├── src/components/        # React Components
│   │   ├── Login.js          # Authentication
│   │   ├── Dashboard.js      # Main navigation
│   │   ├── TrainSearch.js    # Search functionality
│   │   ├── SeatSelection.js  # Seat booking
│   │   └── BookingManagement.js # Booking management
│   ├── src/services/         # API Services
│   │   └── realApi.js        # Backend API integration
│   ├── src/utils/            # Helper functions
│   └── package.json          # Frontend dependencies
├── start-server.bat          # Quick start backend HTTP server
└── start-frontend.bat        # Quick start frontend
```

## 📦 **Setup & Run**

### **Quick Start (Windows)**
```sh
# Clone the repository
git clone https://github.com/Sameer07x19/TicketBookingSystem.git
cd TicketBookingSystem

# Start backend (CLI)
double-click start-backend.bat

# Start frontend (Web) - in new terminal
double-click start-frontend.bat
```

### **Backend (Java CLI)**

#### **Step 1:** Clone the Repository
```sh
git clone https://github.com/Sameer07x19/TicketBookingSystem.git
cd TicketBookingSystem
```

#### **Step 2:** Build the Project
```sh
./gradlew :backend:build
```

#### **Step 3:** Run the HTTP Server
```sh
./gradlew :backend:run
# OR use start-server.bat
```

### **Frontend (React Web App)**

#### **Step 1:** Navigate to Frontend Directory
```sh
cd frontend
```

#### **Step 2:** Install Dependencies
```sh
npm install
```

#### **Step 3:** Start Development Server
```sh
npm start
# OR double-click start.bat on Windows
```

#### **Step 4:** Open in Browser
Visit `http://localhost:3000`

**Note:** Backend server must be running on port 8080 for full functionality.

**Demo Credentials:**
- Username: `demo`
- Password: `demo123`

## 📌 **How to Use**

### **CLI Application (Backend):**
1️⃣ **Sign Up** – Register a new account  
2️⃣ **Login** – Access your account securely  
3️⃣ **Search Trains** – Enter source and destination  
4️⃣ **View Seats** – Check seat availability before booking  
5️⃣ **Book a Seat** – Select and confirm your seat  
6️⃣ **Cancel Booking** – Remove an existing reservation  
7️⃣ **Exit** – Close the application  

### **Web Application (Frontend):**
1️⃣ **Sign Up/Login** – Create account or use demo credentials  
2️⃣ **Search Trains** – Enter source and destination stations  
3️⃣ **Select Train** – Click on available trains to view details  
4️⃣ **Choose Seat** – Interactive seat map shows availability  
5️⃣ **Book Ticket** – Confirm your seat selection  
6️⃣ **Manage Bookings** – View and cancel existing bookings  

## 🎨 **Frontend Features**

✔️ **Modern React Interface** – Clean, responsive design  
✔️ **Interactive Seat Selection** – Visual seat map with real-time updates  
✔️ **Tabbed Navigation** – Easy switching between features  
✔️ **Form Validation** – Username and input validation  
✔️ **Responsive Design** – Works on desktop, tablet, and mobile  
✔️ **Backend Integration** – Connected to Java HTTP server with real API endpoints  

### **UI Components:**
- **Login/Signup** – Tabbed authentication interface
- **Dashboard** – Main navigation with tabs
- **Train Search** – Search form with results display
- **Seat Selection** – Visual seat grid with legend
- **Booking Management** – Ticket cards with cancellation

## 🔧 **Technical Improvements Made**

### 🔍 **Code Quality Fixes:**
- **Security Enhancements** – Fixed timing attack vulnerabilities
- **Error Handling** – Improved production error boundaries
- **Performance** – Optimized component re-renders and API calls
- **Code Structure** – Better separation of concerns and modularity

### 🎯 **New Components Added:**
1. **StationSuggestions.js** – Smart autocomplete for railway stations
2. **Enhanced trainApi.js** – Real train data with improved API structure
3. **Modern CSS Animations** – Smooth transitions and hover effects

### 📱 **Mobile Optimizations:**
- **Touch-friendly Interface** – Large tap targets and gestures
- **Responsive Grid System** – Adaptive layouts for all screen sizes
- **Performance Optimized** – Fast loading on mobile networks

## 🔗 **Frontend-Backend Integration Guide**

### **Current Architecture:**
- **Frontend (React)** - Port: `http://localhost:3000`, Connected to backend API
- **Backend (Java)** - HTTP Server on port `http://localhost:8080`, Uses local JSON files

### **✅ Integration Complete:**

The frontend and backend are now fully connected with the following implementation:

#### **Backend HTTP Server:**
- **SimpleHttpServer.java** - Handles all API endpoints
- **CORS enabled** - Allows frontend connections
- **JSON data processing** - Uses Jackson for serialization
- **Error handling** - Proper HTTP status codes

#### **Frontend API Service:**
- **realApi.js** - Connects to backend endpoints
- **Fetch API** - Modern HTTP client
- **Error handling** - Graceful fallbacks
- **Real-time updates** - Live seat availability

### **API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | User authentication |
| POST | `/api/signup` | Register new user |
| GET | `/api/trains/search` | Search trains |
| POST | `/api/book` | Book seat |
| GET | `/api/bookings` | Get user bookings |
| POST | `/api/cancel` | Cancel booking |

## 🎯 **Demo Data**

The system includes sample data:
- **Users:** demo/demo123
- **Trains:** Delhi-Mumbai (Rajdhani Express), Delhi-Jaipur (Shatabdi Express), Delhi-Chennai (Tamil Nadu Express)
- **Seats:** Pre-configured seat availability (8x6 grid per train)

## 🏗️ **Architecture Benefits**

### **Backend Package Organization:**
- **`com.ticketbooking.cli`** - Command line interface and main application
- **`com.ticketbooking.entities`** - Data models (User, Train, Ticket)
- **`com.ticketbooking.services`** - Business logic and data operations
- **`com.ticketbooking.utils`** - Utility functions and helpers

### **Key Improvements:**
1. **Maintainability** - Clear separation of concerns
2. **Scalability** - Easy to add new features
3. **Testing** - Better test organization
4. **Deployment** - Independent deployment strategies
5. **Collaboration** - Clear module ownership

## 🔐 **Security Features**

- **Password Hashing** - BCrypt for secure password storage
- **Input Validation** - Username and form validation
- **Data Persistence** - JSON-based data storage
- **Session Management** - User authentication state

## ✨ **Latest Enhancements (v2.0)**

### 🔥 **New Features Added:**
- **Real Indian Railway Data** – Integrated with actual train numbers, routes, and timings
- **Smart Station Search** – Auto-complete with major Indian railway stations  
- **Live Seat Availability** – Realistic seat patterns and availability
- **Enhanced UI/UX** – Modern gradient design with smooth animations
- **Real Train Information** – Actual train names, numbers, distances, and fares
- **PNR Generation** – Realistic PNR numbers for bookings
- **Improved Seat Layout** – 3+3 configuration with window/aisle indicators

### 🎨 **UI Improvements:**
- **Modern Card Design** – Gradient backgrounds with glassmorphism effects
- **Interactive Elements** – Hover animations and smooth transitions
- **Better Typography** – Enhanced readability with proper font weights
- **Responsive Layout** – Optimized for desktop, tablet, and mobile
- **Visual Indicators** – Emojis and icons for better user experience
- **Status Badges** – Color-coded status indicators

### 🚂 **Real Train Data Coverage:**
- **Major Routes**: Delhi ↔ Mumbai (Rajdhani Express), Delhi ↔ Chennai (Tamil Nadu Express), Delhi ↔ Bangalore (Kerala Express), Mumbai ↔ Goa (Mandovi Express)
- **20+ Major Cities** including New Delhi (NDLS), Mumbai Central (BCT), Chennai Central (MAS), Bangalore City (SBC), Kolkata (HWH)
- **Dynamic Fare Calculator** – Based on distance and train class
- **Realistic Seat Patterns** – Window/aisle preferences and booking trends

## 🚀 **Future Enhancements**

✅ **REST API Integration** – React frontend connected to Java backend  
💾 **Database Integration** – Store user and train data persistently  
🔧 **Admin Panel** – Manage train schedules and user bookings  
🔐 **JWT Authentication** – Secure user sessions  
📱 **Progressive Web App** – Offline support and mobile app features  
💳 **Payment Integration** – Online payment processing  
🔄 **Real-time Updates** – WebSocket for live seat availability  
📊 **Analytics Dashboard** – Booking statistics and reports  
🐳 **Docker Deployment** – Containerized application deployment  
☁️ **Cloud Integration** – AWS/Azure deployment ready  

## 🐛 **Troubleshooting**

### **Common Issues:**
1. **CORS Errors** - Ensure CORS is properly configured for API integration
2. **Port Conflicts** - Make sure ports 3000 and 8080 are available
3. **Build Errors** - Check Java version (requires Java 11+)
4. **NPM Issues** - Clear node_modules and reinstall if needed

### **Testing:**
- Use Postman or curl to test API endpoints
- Check browser console for frontend errors
- Verify JSON data files are properly formatted

## 📚 **Learning Outcomes**

This project demonstrates:
- **Object-Oriented Programming** principles in Java
- **Modern React** development with hooks
- **Full-stack** application architecture
- **Data persistence** with JSON files
- **User interface** design and responsiveness
- **Security** best practices
- **Project structure** organization

---

**Happy Coding! 🎉** This project serves as a comprehensive example of modern full-stack development combining Java backend with React frontend!