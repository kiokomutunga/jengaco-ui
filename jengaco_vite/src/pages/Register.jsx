import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]   = useState({ name:'', email:'', phone:'', password:'', confirm:'', role:'user', location:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setError(''); setLoading(true);
    try {
      const { confirm, ...data } = form;
      await register(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
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
          <h2>Join thousands of clients building their dream spaces</h2>
          <p>Create your account and get started with a free project consultation today.</p>
        </div>
        <div className="auth-features">
          {['Free account setup','Post jobs in minutes','Receive bids from vetted professionals','Secure M-Pesa payments'].map(f => (
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
            <h1>Create account</h1>
            <p>Join Jenga Co and start building</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="John Kamau" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="john@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="07XX XXX XXX" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" placeholder="Nairobi, Kenya" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <select className="form-input" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="user">Homeowner / Client</option>
                <option value="professional">Construction Professional</option>
              </select>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-input" type="password" placeholder="Create password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} required />
              </div>
            </div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login" style={{ color:'var(--blue)', fontWeight:600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
