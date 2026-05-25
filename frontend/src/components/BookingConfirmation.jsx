import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';

function BookingConfirmation() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(false);
        setError('');
        // To query booking history or directly fetch.
        // Since getByUser retrieves a list, we can search our list or we'll fetch the target booking.
        // Wait, does our backend support fetching booking by ID?
        // Ah, our backend has bookingRepository.findById, and we return the booking from bookTicket.
        // Wait! Let's check: does the controller have GET /api/bookings/{bookingId}?
        // Let's check:
        // Auth: POST /api/auth/register, POST /api/auth/login
        // Bus: GET /api/buses, GET /api/buses/search
        // Seats: GET /api/seats/{busId}
        // Booking: POST /api/bookings, GET /api/bookings/user/{userId}, PUT /api/bookings/cancel/{bookingId}
        // Ah! There is no direct GET /api/bookings/{bookingId} API in the specs!
        // So how do we get the booking details?
        // We can fetch it by querying the user's booking history and finding the matching booking ID!
        // That is an incredibly clever, direct solution that perfectly works with the exact REST endpoints defined by the user without modifying them!
        // Let's implement this.
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
          setError('User session not found. Please log in.');
          return;
        }

        const history = await bookingAPI.getByUser(storedUser.id);
        const match = history.find(b => b.id === parseInt(bookingId));
        if (match) {
          setBooking(match);
        } else {
          setError(`Booking record #${bookingId} not found in your account history.`);
        }
      } catch (err) {
        setError('Failed to load transaction receipt details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border spinner-glow mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary small">Generating transaction voucher...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-5">
        <div className="glass-panel text-center">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3"></i>
          <h3 className="fw-bold text-dark">Booking Not Found</h3>
          <p className="text-secondary small mb-4">{error}</p>
          <Link to="/" className="btn btn-primary-glow px-4">Return Home</Link>
        </div>
      </div>
    );
  }

  const { bus, user, seatNumbers, bookingDate, totalAmount, status } = booking;
  const formattedSeats = seatNumbers.split(',').join(', ');
  const formattedDate = new Date(bookingDate).toLocaleString();

  return (
    <div className="container py-5">
      <div className="text-center mb-5 d-print-none">
        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-20 text-success rounded-circle mb-3 animate-float" style={{ width: '70px', height: '70px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <i className="bi bi-check-circle-fill fs-2"></i>
        </div>
        <h2 className="fw-bold text-dark">Booking Confirmed!</h2>
        <p className="text-secondary small">Your reservation is active. Have a safe and comfortable journey.</p>
      </div>

      <div className="receipt-card">
        {/* Receipt Header */}
        <div className="receipt-header">
          <h4 className="fw-bold text-white mb-1">
            <i className="bi bi-bus-front-fill me-2"></i> JetBus Boarding Pass
          </h4>
          <span className="badge bg-white bg-opacity-20 text-dark border border-white border-opacity-20 px-3 py-1.5 rounded-pill fs-7 fw-bold mt-2">
            BOOKING ID: #{bookingId}
          </span>
        </div>

        {/* Receipt Body */}
        <div className="receipt-body">
          <div className="receipt-row">
            <span className="receipt-label">PASSENGER NAME</span>
            <span className="receipt-value">{user.name}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">EMAIL ADDRESS</span>
            <span className="receipt-value">{user.email}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">CONTACT PHONE</span>
            <span className="receipt-value">{user.phone}</span>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-row">
            <span className="receipt-label">BUS OPERATOR</span>
            <span className="receipt-value">{bus.busName} ({bus.busNumber})</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">ROUTE</span>
            <span className="receipt-value">{bus.source} <i className="bi bi-arrow-right mx-1 text-indigo-400"></i> {bus.destination}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">TRAVEL DATE</span>
            <span className="receipt-value">{bus.travelDate}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">SCHEDULE TIMINGS</span>
            <span className="receipt-value text-indigo-300">{bus.departureTime} - {bus.arrivalTime}</span>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-row">
            <span className="receipt-label">ASSIGNED SEAT(S)</span>
            <span className="receipt-value text-success fw-bold">{formattedSeats}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">TRANSACTION DATE</span>
            <span className="receipt-value">{formattedDate}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">RESERVATION STATUS</span>
            <span className="receipt-value">
              <span className={`status-badge ${status === 'CONFIRMED' ? 'status-confirmed' : 'status-cancelled'}`}>
                {status}
              </span>
            </span>
          </div>

          <div className="receipt-divider"></div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="fs-5 fw-bold text-dark">TOTAL FARE PAID</span>
            <strong className="fs-3 text-success">₹{totalAmount}</strong>
          </div>
        </div>
      </div>

      {/* Printing & Action Controls */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mt-5 d-print-none">
        <button onClick={handlePrint} className="btn btn-secondary-custom px-4 fw-bold">
          <i className="bi bi-printer me-1"></i> Print Ticket
        </button>
        <Link to="/bookings" className="btn btn-secondary-custom px-4 fw-bold">
          <i className="bi bi-ticket-detailed me-1"></i> View Booking History
        </Link>
        <Link to="/" className="btn btn-primary-glow px-4 fw-bold">
          <i className="bi bi-search me-1"></i> Search Another Route
        </Link>
      </div>
    </div>
  );
}

export default BookingConfirmation;
