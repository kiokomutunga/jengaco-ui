import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-mark">JC</div>
            <div>
              <div className="auth-logo-name">Jenga Co</div>
              <div className="auth-logo-sub">Construction</div>
            </div>
          </Link>
        </div>
        <div className="auth-hero-text">
          <h2>Manage your construction projects with confidence</h2>
          <p>Track progress, communicate with your team, and make payments — all in one place.</p>
        </div>
        <div className="auth-features">
          {['Real-time project tracking','M-Pesa integrated payments','Direct messaging with contractors','Document management'].map(f => (
            <div key={f} className="auth-feature">
              <span className="auth-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Welcome back</h1>
            <p>Sign in to your Jenga Co account</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display:'flex', justifyContent:'space-between' }}>
                Password
                <a href="#forgot" style={{ color:'var(--blue)', fontWeight:500 }}>Forgot password?</a>
              </label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" style={{ fontSize:'0.85rem', color:'var(--gray-600)', cursor:'pointer' }}>Remember me</label>
            </div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register" style={{ color:'var(--blue)', fontWeight:600 }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
