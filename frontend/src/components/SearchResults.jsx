import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { busAPI } from '../services/api';

function SearchResults() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params
  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get('source') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      setError('');
      try {
        const results = await busAPI.search(source, destination, date);
        setBuses(results);
      } catch (err) {
        setError(
          err.response?.data || 
          'Failed to retrieve bus services. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (source && destination && date) {
      fetchBuses();
    } else {
      setLoading(false);
      setError('Invalid search criteria. Please return to the homepage.');
    }
  }, [source, destination, date]);

  const handleBookClick = (busId) => {
    navigate(`/seats/${busId}`);
  };

  return (
    <div className="container py-5">
      {/* Back button and route header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <Link to="/" className="text-indigo-400 text-decoration-none small fw-bold d-flex align-items-center gap-1 mb-2">
            <i className="bi bi-arrow-left"></i> Change Route Search
          </Link>
          <h2 className="fw-bold text-dark mb-0">
            {source} <i className="bi bi-arrow-right text-indigo-400 mx-2 fs-5"></i> {destination}
          </h2>
          <p className="text-secondary small mb-0">
            <i className="bi bi-calendar-event me-1"></i> Travel Date: <strong className="text-dark">{date}</strong>
          </p>
        </div>
        <div className="bus-badge px-3 py-2">
          Found <strong className="text-dark">{buses.length}</strong> available services
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border spinner-glow mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary small">Scanning available bus inventory...</p>
        </div>
      )}

      {error && !loading && (
        <div className="glass-panel p-5 text-center my-4">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3"></i>
          <h4 className="fw-bold text-dark">Error Loading Buses</h4>
          <p className="text-secondary mb-4 small">{error}</p>
          <Link to="/" className="btn btn-primary-glow px-4">
            Return to Search
          </Link>
        </div>
      )}

      {!loading && !error && buses.length === 0 && (
        <div className="glass-panel p-5 text-center my-4 border-indigo-900 border-opacity-35">
          <div className="d-inline-flex align-items-center justify-content-center bg-indigo-950 text-indigo-400 rounded-circle mb-3" style={{ width: '70px', height: '70px' }}>
            <i className="bi bi-bus-front-fill fs-2"></i>
          </div>
          <h3 className="fw-bold text-dark mb-2">No Buses Found</h3>
          <p className="text-secondary small max-w-md mx-auto mb-4">
            We couldn't find any active departures for <strong>{source}</strong> to <strong>{destination}</strong> on <strong>{date}</strong>.
            Please try searching for other cities or check tomorrow's schedule.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-secondary-custom px-4 fw-bold small">
              Go Home
            </Link>
            <button 
              onClick={() => {
                // Try tomorrow
                const nextDay = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                navigate(`/search-results?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${nextDay}`);
              }}
              className="btn btn-primary-glow px-4 fw-bold small"
            >
              Check Tomorrow
            </button>
          </div>
        </div>
      )}

      {!loading && !error && buses.length > 0 && (
        <div className="d-grid gap-4">
          {buses.map((bus) => (
            <div className="bus-card p-4" key={bus.id}>
              <div className="row g-3 align-items-center">
                
                {/* Bus Logo & Identity */}
                <div className="col-lg-3 col-md-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-indigo-900 bg-opacity-30 rounded-3 p-3 text-indigo-400 d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px' }}>
                      <i className="bi bi-bus-front fs-2"></i>
                    </div>
                    <div>
                        <h4 className="fw-bold text-dark mb-1 fs-5">{bus.busName}</h4>
                      <span className="bus-badge">{bus.busNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Timings & Route details */}
                <div className="col-lg-4 col-md-5">
                  <div className="d-flex align-items-center justify-content-between px-3">
                    <div className="text-start">
                      <span className="text-secondary small d-block">DEPARTURE</span>
                      <strong className="bus-timings">{bus.departureTime}</strong>
                      <span className="text-secondary small d-block">{bus.source}</span>
                    </div>
                    <div className="d-flex flex-column align-items-center px-2 flex-grow-1">
                      <span className="text-indigo-500 small text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>DIRECT</span>
                      <div className="w-100 position-relative d-flex align-items-center justify-content-center">
                        <hr className="w-100 border-indigo-900 border-opacity-50 my-0" style={{ borderStyle: 'dashed' }} />
                        <i className="bi bi-chevron-right position-absolute text-indigo-400 bg-dark rounded-circle px-1" style={{ fontSize: '0.8rem' }}></i>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="text-secondary small d-block">ARRIVAL</span>
                      <strong className="bus-timings">{bus.arrivalTime}</strong>
                      <span className="text-secondary small d-block">{bus.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Availability info */}
                <div className="col-lg-2 col-md-3 text-md-center">
                  <span className="text-secondary small d-block">SEAT CAPACITY</span>
                  <div className="mt-1">
                    {bus.availableSeats > 0 ? (
                      <span className="text-success fw-bold">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        {bus.availableSeats} Seats left
                      </span>
                    ) : (
                      <span className="text-danger fw-bold">
                        <i className="bi bi-x-circle-fill me-1"></i>
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing & Booking Trigger */}
                <div className="col-lg-3 text-lg-end d-flex flex-wrap align-items-center justify-content-between justify-content-lg-end gap-3">
                  <div className="text-lg-end">
                    <span className="text-secondary small d-block">FARE PRICE</span>
                    <strong className="bus-fare">₹{bus.fare}</strong>
                  </div>
                  <button
                    onClick={() => handleBookClick(bus.id)}
                    className="btn btn-primary-glow px-4 fw-bold text-nowrap"
                    disabled={bus.availableSeats === 0}
                  >
                    <i className="bi bi-credit-card me-1"></i> Select Seats
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
