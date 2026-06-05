import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobsAPI, paymentsAPI } from '../../services/api';
import './Dashboard.css';

const STATUS_COLORS = {
  open:        'badge-blue',
  in_progress: 'badge-orange',
  completed:   'badge-green',
  cancelled:   'badge-red',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsAPI.getAll()
      .then(r => setJobs(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    active:    jobs.filter(j => j.status === 'in_progress').length,
    open:      jobs.filter(j => j.status === 'open').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    total:     jobs.length,
  };

  const recent = jobs.slice(0, 5);

  return (
    <div className="page fade-in">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-sub">Here's an overview of your construction projects.</p>
        </div>
        <Link to="/dashboard/projects" className="btn btn-primary">
          + New Project
        </Link>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'#EBF4FF', color:'var(--blue)' }}>🏗</div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '—' : stats.active}</div>
            <div className="stat-label">Active Projects</div>
          </div>
          <div className="stat-trend up">+2 this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'#FEF3C7', color:'var(--orange-dark)' }}>📋</div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '—' : stats.open}</div>
            <div className="stat-label">Open Jobs</div>
          </div>
          <div className="stat-trend up">Receiving bids</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'#D1FAE5', color:'#059669' }}>✓</div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '—' : stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-trend">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'#F3E8FF', color:'#7C3AED' }}>📁</div>
          <div className="stat-body">
            <div className="stat-value">{loading ? '—' : stats.total}</div>
            <div className="stat-label">Total Projects</div>
          </div>
          <div className="stat-trend">Since joining</div>
        </div>
      </div>

      <div className="dash-grid">
        {/* Recent projects */}
        <div className="card dash-panel">
          <div className="panel-header">
            <h3 className="panel-title">Recent Projects</h3>
            <Link to="/dashboard/projects" className="panel-link">View all →</Link>
          </div>
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:60, borderRadius:8 }} />)}
            </div>
          ) : recent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏗</div>
              <p>No projects yet. Post your first job to get started.</p>
              <Link to="/dashboard/projects" className="btn btn-primary btn-sm">Post a Job</Link>
            </div>
          ) : (
            <div className="project-list">
              {recent.map(job => (
                <Link to={`/dashboard/projects/${job._id}`} key={job._id} className="project-row">
                  <div className="project-row-info">
                    <div className="project-row-title">{job.title}</div>
                    <div className="project-row-meta">{job.category} · {job.location}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span className={`badge ${STATUS_COLORS[job.status] || 'badge-gray'}`}>{job.status.replace('_', ' ')}</span>
                    <span style={{ color:'var(--gray-400)', fontSize:'0.85rem' }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="card dash-panel">
          <div className="panel-header">
            <h3 className="panel-title">Recent Activity</h3>
          </div>
          <div className="activity-feed">
            {[
              { icon:'🏗', text:'Project "Home Extension" moved to In Progress', time:'2h ago', color:'#EBF4FF' },
              { icon:'💰', text:'Payment of KES 45,000 confirmed via M-Pesa', time:'5h ago', color:'#D1FAE5' },
              { icon:'📋', text:'New bid received from James Njoroge', time:'1d ago', color:'#FEF3C7' },
              { icon:'✅', text:'Foundation milestone approved', time:'2d ago', color:'#D1FAE5' },
              { icon:'💬', text:'New message from Project Manager', time:'3d ago', color:'#EDE9FE' },
            ].map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: a.color }}>{a.icon}</div>
                <div className="activity-body">
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ padding:28 }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:20 }}>Quick Actions</h3>
        <div className="quick-actions">
          {[
            { to:'/dashboard/projects',     icon:'🏗', label:'Post a Job',          color:'var(--blue)' },
            { to:'/dashboard/professionals',icon:'👷', label:'Find Professionals',  color:'#7C3AED' },
            { to:'/dashboard/payments',     icon:'💳', label:'Make Payment',        color:'#059669' },
            { to:'/dashboard/messages',     icon:'💬', label:'Send Message',        color:'var(--orange-dark)' },
          ].map(a => (
            <Link key={a.to} to={a.to} className="quick-action-btn">
              <div className="quick-action-icon" style={{ background:`${a.color}15`, color:a.color }}>{a.icon}</div>
              <span>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
