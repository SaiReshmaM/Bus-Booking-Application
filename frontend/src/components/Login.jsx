import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      onLoginSuccess(response);
      const redirect = sessionStorage.getItem('redirect_back');
      if (redirect) {
        sessionStorage.removeItem('redirect_back');
        navigate(redirect);
      } else if (response.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="glass-panel w-100" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-indigo-900 bg-opacity-50 text-indigo-400 rounded-circle mb-3 animate-float" style={{ width: '60px', height: '60px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <i className="bi bi-shield-lock-fill fs-2"></i>
          </div>
          <h2 className="fw-bold text-dark">Welcome Back</h2>
          <p className="text-secondary small">Login to search routes and secure your booking</p>
        </div>

        {error && (
          <div className="alert border border-danger border-opacity-15 bg-danger bg-opacity-10 text-dark small rounded-3 d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill fs-5 text-danger"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
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
                autoComplete="off"
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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
                Logging in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right"></i> Login to Account
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-2 border-top border-secondary border-opacity-15">
          <p className="text-secondary small mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 fw-bold text-decoration-none">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
