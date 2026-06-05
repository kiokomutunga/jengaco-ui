import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

const NAV = [
  { to: '/dashboard',              icon: '⊞',  label: 'Dashboard' },
  { to: '/dashboard/projects',     icon: '🏗',  label: 'Projects' },
  { to: '/dashboard/quotations',   icon: '📋',  label: 'Quotations' },
  { to: '/dashboard/payments',     icon: '💳',  label: 'Payments' },
  { to: '/dashboard/professionals',icon: '👷',  label: 'Professionals' },
  { to: '/dashboard/messages',     icon: '💬',  label: 'Messages' },
  { to: '/dashboard/notifications',icon: '🔔',  label: 'Notifications' },
  { to: '/dashboard/profile',      icon: '👤',  label: 'Profile' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dl-root">
      {/* Overlay for mobile */}
      {open && <div className="dl-overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`dl-sidebar ${open ? 'open' : ''}`}>
        <div className="dl-logo">
          <div className="dl-logo-mark">JC</div>
          <div>
            <div className="dl-logo-name">Jenga Co</div>
            <div className="dl-logo-sub">Construction</div>
          </div>
        </div>

        <nav className="dl-nav">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) => `dl-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="dl-nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dl-sidebar-footer">
          <div className="dl-user-chip">
            <div className="dl-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <div className="dl-user-info">
              <div className="dl-user-name">{user?.name || 'User'}</div>
              <div className="dl-user-role">{user?.role || 'user'}</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm dl-logout" onClick={handleLogout}>
            ↩ Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="dl-main">
        {/* Header */}
        <header className="dl-header">
          <button className="dl-menu-btn" onClick={() => setOpen(true)}>☰</button>
          <div className="dl-header-right">
            <NavLink to="/dashboard/notifications" className="dl-header-icon">🔔</NavLink>
            <NavLink to="/dashboard/messages"      className="dl-header-icon">💬</NavLink>
            <NavLink to="/dashboard/profile">
              <div className="dl-avatar sm">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            </NavLink>
          </div>
        </header>

        <main className="dl-content fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="dl-bottom-nav">
        {NAV.slice(0, 5).map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => `dl-bottom-item ${isActive ? 'active' : ''}`}
          >
            <span className="dl-bottom-icon">{icon}</span>
            <span className="dl-bottom-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
