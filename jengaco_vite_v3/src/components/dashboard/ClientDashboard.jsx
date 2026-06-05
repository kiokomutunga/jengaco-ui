import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jobsAPI } from '../../services/api'
import '../../pages/dashboard/Dashboard.css'

const STATUS_BADGE = {
  open:        'badge-blue',
  in_progress: 'badge-orange',
  completed:   'badge-green',
  cancelled:   'badge-red',
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsAPI.getAll()
      .then(r => setJobs(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    active:    jobs.filter(j => j.status === 'in_progress').length,
    open:      jobs.filter(j => j.status === 'open').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    total:     jobs.length,
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{greeting()}, {user?.name?.split(' ')[0]}</h1>
          <p className="page-sub">Here is an overview of your jobs.</p>
        </div>
        <Link to="/dashboard/projects" className="btn btn-primary">+ Post a Job</Link>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {[
          { label:'Active Jobs',   value:stats.active,    icon:'🏗', bg:'#EBF4FF', color:'var(--blue)'        },
          { label:'Awaiting Bids', value:stats.open,      icon:'📋', bg:'#FEF3C7', color:'var(--orange-dark)' },
          { label:'Completed',     value:stats.completed, icon:'✓',  bg:'#D1FAE5', color:'#059669'            },
          { label:'Total Posted',  value:stats.total,     icon:'📁', bg:'#F3E8FF', color:'#7C3AED'            },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background:s.bg, color:s.color }}>{s.icon}</div>
            <div className="stat-body">
              <div className="stat-value">{loading ? '—' : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Recent jobs */}
        <div style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:'var(--radius)', overflow:'hidden' }}>
          <div className="panel-header" style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)' }}>
            <span className="panel-title">My Recent Jobs</span>
            <Link to="/dashboard/projects" className="panel-link">View all</Link>
          </div>

          {loading ? (
            <div style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:52 }} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏗</div>
              <p>You have not posted any jobs yet.</p>
              <Link to="/dashboard/projects" className="btn btn-primary btn-sm">Post Your First Job</Link>
            </div>
          ) : (
            jobs.slice(0,6).map(job => (
              <Link to={`/dashboard/projects/${job._id}`} key={job._id} className="project-row">
                <div className="project-row-info">
                  <div className="project-row-title">{job.title}</div>
                  <div className="project-row-meta">
                    <span className="trade-tag" style={{ fontSize:'0.7rem' }}>{job.category}</span>
                    <span style={{ fontSize:'0.75rem', color:'var(--gray-400)' }}>· {job.location}</span>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                  <span style={{ fontWeight:700, fontSize:'0.82rem', color:'var(--blue)' }}>
                    KES {Number(job.budget).toLocaleString()}
                  </span>
                  <span className={`badge ${STATUS_BADGE[job.status]||'badge-gray'}`}>
                    {job.status.replace('_',' ')}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Quick actions */}
          <div style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:'var(--radius)', padding:20 }}>
            <div className="panel-title" style={{ marginBottom:14 }}>Quick Actions</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { to:'/dashboard/projects',      icon:'🏗', label:'Post a New Job'       },
                { to:'/dashboard/professionals', icon:'👷', label:'Find a Professional'  },
                { to:'/dashboard/payments',      icon:'💳', label:'Payment History'      },
                { to:'/dashboard/messages',      icon:'💬', label:'Messages'             },
                { to:'/dashboard/notifications', icon:'🔔', label:'Notifications'        },
              ].map(a => (
                <Link key={a.to} to={a.to} className="quick-link-row">
                  <span className="quick-link-icon">{a.icon}</span>
                  <span>{a.label}</span>
                  <span className="quick-link-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:'var(--radius)', padding:20 }}>
            <div className="panel-title" style={{ marginBottom:14 }}>Recent Activity</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { icon:'📋', text:'New bid received on your roof job',       time:'2h ago', c:'#EBF4FF' },
                { icon:'💰', text:'Payment of KES 45,000 confirmed via M-Pesa', time:'5h ago', c:'#D1FAE5' },
                { icon:'💬', text:'New message from James Njoroge',          time:'1d ago', c:'#EDE9FE' },
                { icon:'✅', text:'Kitchen renovation marked as complete',   time:'2d ago', c:'#D1FAE5' },
              ].map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{ background:a.c }}>{a.icon}</div>
                  <div className="activity-body">
                    <div className="activity-text">{a.text}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
