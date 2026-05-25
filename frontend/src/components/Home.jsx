import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  // Pre-fill search inputs with popular options
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setValidationError('');

    if (!source || !destination || !date) {
      setValidationError('Please select source, destination, and travel date');
      return;
    }

    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setValidationError('Source and destination cannot be the same');
      return;
    }

    // Redirect to search results page passing search criteria in query string
    navigate(
      `/search-results?source=${encodeURIComponent(source.trim())}&destination=${encodeURIComponent(
        destination.trim()
      )}&date=${date}`
    );
  };

  const handleQuickSearch = (src, dest) => {
    setSource(src);
    setDestination(dest);
    // Setting date to today's date
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    
    // Using setTimeout to allow state changes to register
    setTimeout(() => {
      navigate(
        `/search-results?source=${encodeURIComponent(src)}&destination=${encodeURIComponent(
          dest
        )}&date=${today}`
      );
    }, 50);
  };

  return (
    <div>
      {/* Hero Section */}
      <header className="search-banner text-center">
        <div className="container">
          <h1 className="hero-title animate-float">
            Travel Smart, Book <span>Instant</span>
          </h1>
          <p className="text-secondary fs-5 max-w-2xl mx-auto mb-5">
            Compare and book bus tickets across hundreds of destinations in seconds.
          </p>

          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8 text-start">
              <div className="glass-panel">
                <h4 className="fw-bold mb-4 text-dark">
                  <i className="bi bi-search me-2 text-indigo-400"></i> Search Bus Routes
                </h4>

                {validationError && (
                  <div className="alert alert-warning border-0 bg-warning bg-opacity-15 text-warning small py-2 rounded-3 mb-4">
                    <i className="bi bi-exclamation-circle-fill me-1"></i> {validationError}
                  </div>
                )}

                <form onSubmit={handleSearch} className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label form-label-custom">Leaving From</label>
                    <div className="position-relative">
                      <span className="position-absolute translate-middle-y top-50 start-0 ps-3 text-secondary">
                        <i className="bi bi-geo-alt"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-custom ps-5"
                        placeholder="e.g. Hyderabad"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label form-label-custom">Going To</label>
                    <div className="position-relative">
                      <span className="position-absolute translate-middle-y top-50 start-0 ps-3 text-secondary">
                        <i className="bi bi-geo"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-custom ps-5"
                        placeholder="e.g. Bangalore"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label form-label-custom">Travel Date</label>
                    <div className="position-relative">
                      <span className="position-absolute translate-middle-y top-50 start-0 ps-3 text-secondary">
                        <i className="bi bi-calendar3"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control form-control-custom ps-5"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12 mt-4 text-center">
                    <button type="submit" className="btn btn-primary-glow px-5 py-2.5 fw-bold">
                      <i className="bi bi-bus-front me-2"></i> Explore Available Buses
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Popular Routes Section */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">Popular Connections</h2>
          <p className="text-secondary small">Instant booking for our most-travelled weekend routes</p>
        </div>

        <div className="row g-4 justify-content-center">
          {[
            { from: 'Hyderabad', to: 'Bangalore', icon: 'bi-lightning-fill', desc: 'Sleeper & Luxury Buses' },
            { from: 'Hyderabad', to: 'Chennai', icon: 'bi-water', desc: 'Overnight Express Corridors' },
            { from: 'Bangalore', to: 'Pune', icon: 'bi-buildings', desc: 'Direct Highway Cruisers' },
          ].map((route, idx) => (
            <div className="col-md-4" key={idx}>
              <div 
                className="glass-panel p-4 text-center h-100 cursor-pointer d-flex flex-column justify-content-between align-items-center"
                style={{ cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                onClick={() => handleQuickSearch(route.from, route.to)}
              >
                <div className="bg-indigo-900 bg-opacity-40 text-indigo-400 rounded-circle p-3 mb-3 d-flex align-items-center justify-content-center" style={{ width: '55px', height: '55px' }}>
                  <i className={`bi ${route.icon} fs-4`}></i>
                </div>
                <div>
                  <h5 className="fw-bold text-dark mb-1">{route.from} <i className="bi bi-arrow-right text-indigo-400 mx-1"></i> {route.to}</h5>
                  <p className="text-secondary small mb-3">{route.desc}</p>
                </div>
                <span className="text-indigo-400 fw-bold small d-flex align-items-center gap-1">
                  Book Route <i className="bi bi-chevron-right"></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety & Premium features */}
      <section className="container pb-5">
        <div className="glass-panel py-4 px-5 border-indigo-900 border-opacity-35 bg-indigo-950 bg-opacity-10">
          <div className="row g-4 align-items-center text-center text-md-start">
            <div className="col-md-3 text-center">
              <i className="bi bi-shield-check text-indigo-400" style={{ fontSize: '3.5rem' }}></i>
            </div>
            <div className="col-md-9">
              <h4 className="fw-bold text-dark mb-2">Double Booking Prevention Guaranteed</h4>
              <p className="text-secondary mb-0 small">
                Our backend uses strong transactional lock checks to verify seat status in real-time. If someone is selecting the exact same seat concurrently, our engine resolves it immediately to prevent overlap bookings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
