import React from 'react'
import { Link } from 'react-router-dom'
import './LandingFooter.css'

export default function LandingFooter() {
  return (
    <footer className="lf-root" id="contact">
      <div className="container lf-inner">
        <div className="lf-brand">
          <div className="lf-logo">
            <div className="lf-mark">JC</div>
            <div>
              <div className="lf-name">Jenga Co</div>
              <div className="lf-sub">Marketplace</div>
            </div>
          </div>
          <p className="lf-tagline">
            Connecting Kenyan homeowners with trusted tradespeople since 2010.
          </p>
          <div className="lf-contact">
            <div>📍 Westlands, Nairobi</div>
            <div>📞 +254 700 000 000</div>
            <div>✉️ hello@jengaco.co.ke</div>
          </div>
        </div>

        <div className="lf-links">
          <div className="lf-col">
            <div className="lf-col-title">For Clients</div>
            <a href="#jobs">Browse Jobs</a>
            <Link to="/register?role=user">Post a Job</Link>
            <a href="#how">How It Works</a>
          </div>
          <div className="lf-col">
            <div className="lf-col-title">For Professionals</div>
            <Link to="/register?role=professional">Join as a Pro</Link>
            <a href="#how">How Bidding Works</a>
          </div>
          <div className="lf-col">
            <div className="lf-col-title">Account</div>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="lf-bottom">
        <div className="container">
          © {new Date().getFullYear()} Jenga Co. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
