import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { seatAPI, busAPI, bookingAPI } from '../services/api';

function SeatSelection({ user }) {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBusAndSeats = useCallback(async () => {
    try {
      setError('');
      const busDetails = await busAPI.getBusById(busId);
      setBus(busDetails);

      const seatLayout = await seatAPI.getSeats(busId);
      setSeats(seatLayout);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to fetch seat layout. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [busId]);

  useEffect(() => {
    fetchBusAndSeats();

    // Auto-refresh seats every 8 seconds to keep layout in sync
    const interval = setInterval(() => {
      fetchBusAndSeats();
    }, 8000);

    return () => clearInterval(interval);
  }, [busId, fetchBusAndSeats]);

  const handleSeatClick = (seat) => {
    if (seat.booked) return;

    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter(num => num !== seat.seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seat.seatNumber]);
    }
  };

  const handleProceedBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to proceed.');
      return;
    }

    if (!user) {
      sessionStorage.setItem('redirect_back', `/seats/${busId}`);
      sessionStorage.setItem('saved_selected_seats', JSON.stringify(selectedSeats));
      setError('You must be logged in to book seats. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    setBookingLoading(true);
    setError('');
    setSuccess('');

    try {
      const bookingRequestPayload = {
        userId: user.id,
        busId: parseInt(busId),
        seatNumbers: selectedSeats
      };

      const result = await bookingAPI.create(bookingRequestPayload);
      setSuccess('Seats reserved successfully! Redirecting...');

      setSelectedSeats([]);
      sessionStorage.removeItem('saved_selected_seats');

      setTimeout(() => {
        navigate(`/booking-confirmation/${result.id}`);
      }, 1500);

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during booking. Please try again.');
      }
      fetchBusAndSeats();
    } finally {
      setBookingLoading(false);
    }
  };

  // Restore cached seat selections after auth redirect
  useEffect(() => {
    const cachedSeats = sessionStorage.getItem('saved_selected_seats');
    if (cachedSeats && user) {
      setSelectedSeats(JSON.parse(cachedSeats));
      sessionStorage.removeItem('saved_selected_seats');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border spinner-glow mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary small">Assembling seat architecture...</p>
      </div>
    );
  }

  if (error && !bus) {
    return (
      <div className="container py-5">
        <div className="glass-panel text-center">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3"></i>
          <h3 className="fw-bold text-dark">Bus Not Found</h3>
          <p className="text-secondary small mb-4">{error}</p>
          <Link to="/" className="btn btn-primary-glow px-4">Return Home</Link>
        </div>
      </div>
    );
  }

  // Build rows of 4: [left1, left2, AISLE, right1, right2]
  const totalRows = Math.ceil(seats.length / 4);

  return (
    <div className="container py-5">
      <div className="row g-5">

        {/* Left Side: Seat Layout Grid */}
        <div className="col-lg-6">
          <div className="d-flex align-items-center gap-2 mb-4">
            <Link to={`/search-results?source=${bus.source}&destination=${bus.destination}&date=${bus.travelDate}`} className="text-secondary text-decoration-none fs-5">
              <i className="bi bi-chevron-left"></i>
            </Link>
            <div>
              <h2 className="fw-bold text-dark mb-0">Select Your Seats</h2>
              <p className="text-secondary small mb-0">{bus.busName} • {bus.busNumber} • {bus.totalSeats} seats</p>
            </div>
          </div>

          <div className="seat-map-container mb-4">
            {/* Bus Front Indicator */}
            <div className="driver-section">
              <span className="text-secondary small me-2 fw-medium align-self-center">FRONT</span>
              <div className="driver-wheel animate-float" title="Driver Cabin">
                <i className="bi bi-circle"></i>
              </div>
            </div>

            {/* Dynamic Seat Grid — 4 seats per row: [L1][L2] AISLE [R1][R2] */}
            <div className="seat-grid">
              {Array.from({ length: totalRows }, (_, rowIdx) => {
                const rowSeats = seats.slice(rowIdx * 4, rowIdx * 4 + 4);
                const leftSeats = rowSeats.slice(0, 2);
                const rightSeats = rowSeats.slice(2, 4);

                return (
                  <React.Fragment key={rowIdx}>
                    {/* Left pair */}
                    {leftSeats.map((seatObj) => {
                      const isSel = selectedSeats.includes(seatObj.seatNumber);
                      return (
                        <div
                          key={seatObj.id}
                          onClick={() => handleSeatClick(seatObj)}
                          className={`seat-item ${seatObj.booked ? 'booked' : isSel ? 'selected' : 'available'}`}
                          title={seatObj.booked ? `Seat ${seatObj.seatNumber} — Booked` : isSel ? `Seat ${seatObj.seatNumber} — Selected` : `Seat ${seatObj.seatNumber} — Available`}
                        >
                          {seatObj.seatNumber}
                        </div>
                      );
                    })}
                    {/* Fill empty left slots */}
                    {Array.from({ length: 2 - leftSeats.length }, (_, i) => (
                      <div key={`lpad-${i}`} className="seat-item" style={{ visibility: 'hidden' }}></div>
                    ))}

                    {/* Central Aisle */}
                    <div className="seat-gap d-flex align-items-center justify-content-center text-secondary small fw-bold" style={{ opacity: 0.15 }}>
                      AISLE
                    </div>

                    {/* Right pair */}
                    {rightSeats.map((seatObj) => {
                      const isSel = selectedSeats.includes(seatObj.seatNumber);
                      return (
                        <div
                          key={seatObj.id}
                          onClick={() => handleSeatClick(seatObj)}
                          className={`seat-item ${seatObj.booked ? 'booked' : isSel ? 'selected' : 'available'}`}
                          title={seatObj.booked ? `Seat ${seatObj.seatNumber} — Booked` : isSel ? `Seat ${seatObj.seatNumber} — Selected` : `Seat ${seatObj.seatNumber} — Available`}
                        >
                          {seatObj.seatNumber}
                        </div>
                      );
                    })}
                    {/* Fill empty right slots */}
                    {Array.from({ length: 2 - rightSeats.length }, (_, i) => (
                      <div key={`rpad-${i}`} className="seat-item" style={{ visibility: 'hidden' }}></div>
                    ))}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Seat Legends */}
          <div className="d-flex justify-content-center gap-4 py-2 border-top border-secondary border-opacity-10">
            <div className="seat-legend-item">
              <div className="legend-color legend-available"></div>
              <span className="text-secondary small">Available</span>
            </div>
            <div className="seat-legend-item">
              <div className="legend-color legend-selected"></div>
              <span className="text-secondary small">Selected</span>
            </div>
            <div className="seat-legend-item">
              <div className="legend-color legend-booked"></div>
              <span className="text-secondary small">Booked</span>
            </div>
          </div>
        </div>

        {/* Right Side: Fare Breakdown Summary Card */}
        <div className="col-lg-6">
          <div className="glass-panel h-100 d-flex flex-column justify-content-between">
            <div>
              <h3 className="fw-bold text-dark mb-4 pb-2 border-bottom border-secondary border-opacity-15">
                Journey Summary
              </h3>

              {error && (
                <div className="alert alert-danger border-0 bg-danger bg-opacity-15 text-danger small rounded-3 d-flex align-items-center gap-2 mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                  <div>{error}</div>
                </div>
              )}

              {success && (
                <div className="alert alert-success border-0 bg-success bg-opacity-15 text-success small rounded-3 d-flex align-items-center gap-2 mb-4" role="alert">
                  <i className="bi bi-check-circle-fill fs-5"></i>
                  <div>{success}</div>
                </div>
              )}

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <span className="text-secondary small d-block">ROUTE</span>
                    <span className="text-dark fw-bold">{bus.source} to {bus.destination}</span>
                  </div>
                  <div className="col-6">
                    <span className="text-secondary small d-block">DATE &amp; TIMINGS</span>
                    <span className="text-dark fw-bold">{bus.travelDate} @ {bus.departureTime}</span>
                  </div>
                  <div className="col-6 mt-3">
                    <span className="text-secondary small d-block">UNIT FARE</span>
                    <span className="text-dark fw-bold">₹{bus.fare} per seat</span>
                  </div>
                  <div className="col-6 mt-3">
                    <span className="text-secondary small d-block">OPERATOR</span>
                    <span className="text-dark fw-bold">{bus.busName} ({bus.busNumber})</span>
                  </div>
                </div>

              <div className="bg-secondary bg-opacity-10 p-3 rounded-3 mb-4 border border-secondary border-opacity-10">
                <span className="text-secondary small d-block mb-2">SELECTED SEATS</span>
                {selectedSeats.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {selectedSeats.map(seatCode => (
                      <span key={seatCode} className="badge bg-indigo-900 text-indigo-200 border border-indigo-700 px-3 py-2 fs-6 rounded-3">
                        {seatCode}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted small italic">No seats selected yet. Click on a seat to reserve.</span>
                )}
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-4 pt-3 border-top border-secondary border-opacity-15">
                <div>
                  <span className="text-secondary small d-block">TOTAL PAYABLE FARE</span>
                  <span className="text-muted small">₹{bus.fare} × {selectedSeats.length} seat(s)</span>
                </div>
                <strong className="fs-2 text-dark">₹{bus.fare * selectedSeats.length}</strong>
              </div>

              <button
                onClick={handleProceedBooking}
                className="btn btn-primary-glow w-100 py-3 fw-bold fs-5 d-flex align-items-center justify-content-center gap-2"
                disabled={selectedSeats.length === 0 || bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Executing Reservation...
                  </>
                ) : (
                  <>
                    <i className="bi bi-wallet2"></i> Book Ticket Now
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default SeatSelection;
