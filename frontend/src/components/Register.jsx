import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Register({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({ name, email, phone, password });
      // On success, login the user directly
      onRegisterSuccess(response);
      const redirect = sessionStorage.getItem('redirect_back');
      if (redirect) {
        sessionStorage.removeItem('redirect_back');
        navigate(redirect);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Registration failed. Email may already be registered.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <div className="glass-panel w-100" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-indigo-900 bg-opacity-50 text-indigo-400 rounded-circle mb-3 animate-float" style={{ width: '60px', height: '60px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <i className="bi bi-person-plus-fill fs-2"></i>
          </div>
          <h2 className="fw-bold text-dark">Create Account</h2>
          <p className="text-secondary small">Sign up to book tickets and manage reservations</p>
        </div>

        {error && (
          <div className="alert border border-danger border-opacity-15 bg-danger bg-opacity-10 text-dark small rounded-3 d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label form-label-custom">Full Name</label>
            <div className="position-relative">
              <span className="form-icon text-secondary">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-custom ps-5"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label form-label-custom">Email Address</label>
            <div className="position-relative">
              <span className="form-icon text-secondary">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control form-control-custom ps-5"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label form-label-custom">Phone Number</label>
            <div className="position-relative">
              <span className="form-icon text-secondary">
                <i className="bi bi-telephone"></i>
              </span>
              <input
                type="tel"
                className="form-control form-control-custom ps-5"
                placeholder="e.g. +91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label form-label-custom">Password</label>
            <div className="position-relative">
              <span className="form-icon text-secondary">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control form-control-custom ps-5"
                placeholder="At least 4 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-glow w-100 py-2.5 fw-bold d-flex justify-content-center align-items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Creating account...
              </>
            ) : (
              <>
                <i className="bi bi-rocket-takeoff"></i> Register & Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-2 border-top border-secondary border-opacity-15">
          <p className="text-secondary small mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 fw-bold text-decoration-none">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
