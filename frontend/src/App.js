import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import SearchResults from './components/SearchResults';
import SeatSelection from '../../../frontend/src/components/SeatSelection';
import BookingConfirmation from '../../../frontend/src/components/BookingConfirmation';
import MyBookings from '../../../frontend/src/components/MyBookings';
import Login from '../../../frontend/src/components/Login';
import Register from '../../../frontend/src/components/Register';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.clear();
  };

  return (
    <Router>
      <div className="d-flex flex-column min-height-vh-100" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/seats/:busId" element={<SeatSelection user={user} />} />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/" /> : <Register onRegisterSuccess={handleLoginSuccess} />} 
            />

            {/* Admin Route */}
            <Route 
              path="/admin" 
              element={user && user.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} 
            />

            {/* Protected Routes */}
            <Route 
              path="/booking-confirmation/:bookingId" 
              element={user ? <BookingConfirmation /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/bookings" 
              element={user ? <MyBookings user={user} /> : <Navigate to="/login" />} 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="py-4 mt-auto border-top border-secondary border-opacity-10 bg-secondary bg-opacity-10 d-print-none">
          <div className="container text-center text-secondary small">
            <p className="mb-1">© 2026 JetBus Reservation Systems. All rights reserved.</p>
            <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
              Built with Spring Boot 3, Java 17, H2 Database, React 18, and Axios.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
