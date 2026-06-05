import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

const TRADES = [
  'Construction','Plumbing','Electrical','Interior Design',
  'Renovation','Roofing','Tiling','Painting','Carpentry',
  'Masonry','Landscaping','Quantity Surveying','Project Management'
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [form, setForm] = useState({
    name:'', email:'', phone:'', password:'', confirm:'',
    location:'', trade:'', experience:'', qualification:'', bio:''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return setError('Passwords do not match')
    setError('')
    setLoading(true)
    try {
      const { confirm, ...data } = form
      await register({ ...data, role })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-root">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-mark">JC</div>
          <div>
            <div className="auth-logo-name">Jenga Co</div>
            <div className="auth-logo-sub">Marketplace</div>
          </div>
        </Link>
        <div className="auth-hero-text">
          {role === 'professional'
            ? <><h2>Grow your business by connecting with clients who need your skills</h2><p>List your trade, set your location and start receiving job requests from homeowners near you.</p></>
            : <><h2>Find trusted construction professionals near you</h2><p>Post a job, receive bids, compare professionals by location and rating, and pay securely via M-Pesa.</p></>
          }
        </div>
        <div className="auth-features">
          {(role === 'professional'
            ? ['Create your professional profile','Set your trade and service area','Bid on jobs in your area','Get paid via M-Pesa']
            : ['Post jobs with photos','See professionals on a map','Compare bids side by side','Rate after the job is done']
          ).map(feat => (
            <div key={feat} className="auth-feature">
              <span className="auth-feature-dot" />
              {feat}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">

          {/* Step 1 — pick role */}
          {step === 1 && (
            <>
              <div className="auth-card-header">
                <h1>Join Jenga Co</h1>
                <p>How will you be using the platform?</p>
              </div>
              <div className="role-grid">
                <button
                  className={`role-btn ${role === 'user' ? 'active' : ''}`}
                  onClick={() => setRole('user')}
                >
                  <div className="role-icon">🏠</div>
                  <div className="role-title">I need work done</div>
                  <div className="role-desc">Post jobs and hire professionals</div>
                </button>
                <button
                  className={`role-btn ${role === 'professional' ? 'active' : ''}`}
                  onClick={() => setRole('professional')}
                >
                  <div className="role-icon">🔧</div>
                  <div className="role-title">I offer services</div>
                  <div className="role-desc">Bid for jobs and grow your business</div>
                </button>
              </div>
              <button
                className="btn btn-primary auth-submit"
                onClick={() => setStep(2)}
                disabled={!role}
                style={{ marginTop: 24 }}
              >
                Continue
              </button>
              <div className="auth-footer" style={{ marginTop: 16 }}>
                Already have an account? <Link to="/login">Sign in</Link>
              </div>
            </>
          )}

          {/* Step 2 — account details */}
          {step === 2 && (
            <>
              <div className="auth-card-header">
                <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
                <h1>{role === 'professional' ? 'Professional account' : 'Client account'}</h1>
                <p>Fill in your details to get started</p>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="John Kamau" value={form.name} onChange={e => f('name', e.target.value)} required />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="john@email.com" value={form.email} onChange={e => f('email', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="07XX XXX XXX" value={form.phone} onChange={e => f('phone', e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Your Location</label>
                  <input className="form-input" placeholder="e.g. Westlands, Nairobi" value={form.location} onChange={e => f('location', e.target.value)} required />
                </div>

                {role === 'professional' && (
                  <>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                      <div className="form-group">
                        <label className="form-label">Your Trade</label>
                        <select className="form-input" value={form.trade} onChange={e => f('trade', e.target.value)} required>
                          <option value="">Select trade</option>
                          {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Years of Experience</label>
                        <select className="form-input" value={form.experience} onChange={e => f('experience', e.target.value)} required>
                          <option value="">Select</option>
                          <option value="1-2">1 to 2 years</option>
                          <option value="3-5">3 to 5 years</option>
                          <option value="6-10">6 to 10 years</option>
                          <option value="10+">Over 10 years</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Qualifications / Certifications</label>
                      <input className="form-input" placeholder="e.g. NCA Registered, City and Guilds" value={form.qualification} onChange={e => f('qualification', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bio (shown on your profile)</label>
                      <textarea className="form-input" rows={3} placeholder="Describe your experience and the services you offer..." value={form.bio} onChange={e => f('bio', e.target.value)} style={{ resize:'vertical' }} />
                    </div>
                  </>
                )}

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-input" type="password" placeholder="Create password" value={form.password} onChange={e => f('password', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={e => f('confirm', e.target.value)} required />
                  </div>
                </div>

                <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
