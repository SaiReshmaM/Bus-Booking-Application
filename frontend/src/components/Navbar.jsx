import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container">
        <Link className="navbar-brand navbar-brand-custom" to="/">
          <i className="bi bi-bus-front-fill text-indigo-400"></i>
          <span>JetBus</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/" end>
                <i className="bi bi-search me-1"></i> Search Buses
              </NavLink>
            </li>
            {user && user.role === 'ROLE_ADMIN' && (
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/admin">
                  <i className="bi bi-shield-lock-fill me-1 text-indigo-300"></i> Admin Panel
                </NavLink>
              </li>
            )}
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/bookings">
                  <i className="bi bi-ticket-detailed me-1"></i> My Bookings
                </NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="text-light fw-medium">
                  <i className="bi bi-person-circle me-1 text-indigo-300"></i>
                  Hi, {user.name} {user.role === 'ROLE_ADMIN' && <span className="badge bg-indigo-900 text-indigo-300 ms-1" style={{ fontSize: '0.7rem' }}>Admin</span>}
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="btn btn-outline-danger btn-sm px-3 rounded-pill fw-bold"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-secondary-custom btn-sm px-4 fw-bold" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary-glow btn-sm px-4 fw-bold" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
