import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="lnav">
      <div className="container lnav-inner">
        <Link to="/" className="lnav-logo">
          <div className="lnav-mark">JC</div>
          <div>
            <div className="lnav-name">Jenga Co</div>
            <div className="lnav-sub">Marketplace</div>
          </div>
        </Link>

        <div className={`lnav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#jobs"     onClick={() => setMenuOpen(false)}>Browse Jobs</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#how"      onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#contact"  onClick={() => setMenuOpen(false)}>Contact</a>
        </div>

        <div className="lnav-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm">My Dashboard</Link>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline-nav btn-sm">Login</Link>
              <Link to="/register" className="btn btn-orange btn-sm">Get Started</Link>
            </>
          )}
          <button className="lnav-burger" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  )
}
