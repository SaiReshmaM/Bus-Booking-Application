import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(null); // stores booking ID currently cancelling
  const [success, setSuccess] = useState('');

  const fetchBookings = useCallback(async () => {
    try {
      setError('');
      const list = await bookingAPI.getByUser(user.id);
      setBookings(list);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to retrieve booking history. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user, fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(`Are you sure you want to cancel your reservation for Booking #${bookingId}? This will immediately release your selected seats.`)) {
      return;
    }

    setCancelLoading(bookingId);
    setError('');
    setSuccess('');

    try {
      await bookingAPI.cancel(bookingId);
      setSuccess(`Booking #${bookingId} has been successfully cancelled. Your seats have been released.`);
      // Refresh list
      fetchBookings();
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to cancel booking. Please try again later.'
      );
    } finally {
      setCancelLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel py-5">
          <i className="bi bi-shield-exclamation text-warning fs-1 mb-3"></i>
          <h3 className="fw-bold text-dark">Access Denied</h3>
          <p className="text-secondary small mb-4">You must be logged in to view your bookings.</p>
          <Link to="/login" className="btn btn-primary-glow px-4">Log In Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">My Booking Portfolio</h2>
          <p className="text-secondary small mb-0">Review your ticket reservations and trip history status</p>
        </div>
        <Link to="/" className="btn btn-primary-glow btn-sm fw-bold px-4">
          <i className="bi bi-plus-lg me-1"></i> Book New Ticket
        </Link>
      </div>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-15 text-success small rounded-3 d-flex align-items-center gap-2 mb-4 animate-float" role="alert">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>{success}</div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-15 text-danger small rounded-3 d-flex align-items-center gap-2 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <div>{error}</div>
        </div>
      )}

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border spinner-glow mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary small">Synchronizing reservation portfolio...</p>
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="glass-panel p-5 text-center my-4 border-indigo-900 border-opacity-35">
          <div className="d-inline-flex align-items-center justify-content-center bg-indigo-950 text-indigo-400 rounded-circle mb-3" style={{ width: '70px', height: '70px' }}>
            <i className="bi bi-ticket-detailed fs-1"></i>
          </div>
          <h3 className="fw-bold text-dark mb-2">No Active Reservations</h3>
          <p className="text-secondary small max-w-md mx-auto mb-4">
            You haven't purchased any bus tickets yet. Start exploring journeys now to reserve your favorite seats!
          </p>
          <Link to="/" className="btn btn-primary-glow px-4 py-2 fw-bold">
            Search Buses
          </Link>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="table-responsive glass-panel p-3 border border-secondary border-opacity-10">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr className="text-indigo-300 small uppercase" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3">Operator / Bus Info</th>
                <th className="py-3">Journey Route</th>
                <th className="py-3">Travel Schedule</th>
                <th className="py-3 text-center">Seat(s)</th>
                <th className="py-3 text-end">Amount</th>
                <th className="py-3 text-center">Status</th>
                <th className="py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const isConfirmed = booking.status === 'CONFIRMED';
                return (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="py-3 px-3 fw-bold text-indigo-400">#{booking.id}</td>
                    <td className="py-3">
                      <div className="fw-bold text-light">{booking.bus.busName}</div>
                      <div className="text-secondary small">{booking.bus.busNumber}</div>
                    </td>
                    <td className="py-3">
                      <span className="fw-medium text-light">{booking.bus.source}</span>
                      <i className="bi bi-arrow-right mx-2 text-secondary" style={{ fontSize: '0.8rem' }}></i>
                      <span className="fw-medium text-light">{booking.bus.destination}</span>
                    </td>
                    <td className="py-3">
                      <div className="text-light fw-medium">{booking.bus.travelDate}</div>
                      <div className="text-indigo-400 small">{booking.bus.departureTime}</div>
                    </td>
                    <td className="py-3 text-center">
                      {booking.seatNumbers.split(',').map((seat, index) => (
                        <span key={index} className="badge bg-indigo-950 text-indigo-200 border border-indigo-800 rounded px-2.5 py-1.5 mx-1 small">
                          {seat.trim()}
                        </span>
                      ))}
                    </td>
                    <td className="py-3 text-end fw-bold text-light">₹{booking.totalAmount}</td>
                    <td className="py-3 text-center">
                      <span className={`status-badge ${isConfirmed ? 'status-confirmed' : 'status-cancelled'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {isConfirmed && (
                          <Link to={`/booking-confirmation/${booking.id}`} className="btn btn-outline-light btn-sm px-2.5 rounded fw-medium">
                            Pass
                          </Link>
                        )}
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn btn-danger btn-sm px-2.5 rounded fw-medium"
                          disabled={!isConfirmed || cancelLoading === booking.id}
                        >
                          {cancelLoading === booking.id ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                          ) : (
                            'Cancel'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
