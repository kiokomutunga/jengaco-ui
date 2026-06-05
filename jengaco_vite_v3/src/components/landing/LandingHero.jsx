import React from 'react'
import { Link } from 'react-router-dom'
import './LandingHero.css'

const STATS = [
  { value:'500+', label:'Completed Projects' },
  { value:'15+',  label:'Years Experience'   },
  { value:'98%',  label:'Client Satisfaction'},
  { value:'120+', label:'Professionals'      },
]

export default function LandingHero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="hero-pattern" />
      <div className="container hero-inner">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Kenya's Premier Construction Marketplace
        </div>
        <h1 className="hero-title">
          Find Trusted Tradespeople<br />
          <span className="hero-accent">Near You</span>
        </h1>
        <p className="hero-sub">
          Post a job, receive bids from verified professionals, compare by location and rating, and pay securely via M-Pesa. No middlemen.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-orange btn-lg">Post a Job Free</Link>
          <a href="#jobs" className="btn btn-outline-white btn-lg">Browse Open Jobs</a>
        </div>
        <div className="hero-stats">
          {STATS.map(s => (
            <div key={s.label} className="hero-stat">
              <div className="hero-stat-value">{s.value}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
