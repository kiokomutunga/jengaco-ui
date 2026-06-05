import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jobsAPI } from '../../services/api'
import '../../pages/dashboard/Dashboard.css'

const CAT_ICONS = { construction:'🏗', renovation:'🔨', plumbing:'🔧', electrical:'⚡', roofing:'🏠', painting:'🎨', interior:'🛋', other:'📦' }

export default function ProfessionalDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsAPI.getAll({ status:'open' })
      .then(r => setJobs(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
          <p className="page-sub">Here are jobs available in your area.</p>
        </div>
        <Link to="/dashboard/projects" className="btn btn-primary">Browse All Jobs</Link>
      </div>

      {/* Profile banner */}
      <div className="pro-banner">
        <div>
          <div className="pro-banner-title">
            {user?.trade || 'Professional'} · {user?.experience ? `${user.experience} yrs exp` : ''}
          </div>
          <div className="pro-banner-sub">
            {user?.location && `📍 ${user.location}`}
            {user?.qualification && ` · ${user.qualification}`}
          </div>
        </div>
        <Link
          to="/dashboard/profile"
          className="btn btn-sm"
          style={{ borderColor:'rgba(255,255,255,0.4)', color:'white', border:'1.5px solid rgba(255,255,255,0.35)', borderRadius:'var(--radius)' }}
        >
          Edit Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {[
          { label:'Open Jobs',   value: jobs.length,                                    icon:'🔍', bg:'#EBF4FF', color:'var(--blue)'        },
          { label:'Jobs Nearby', value: jobs.filter(j=>j.location?.includes('Nairobi')).length, icon:'📍', bg:'#FEF3C7', color:'var(--orange-dark)' },
          { label:'Bids Sent',   value: 0,                                              icon:'📋', bg:'#D1FAE5', color:'#059669'            },
          { label:'Completed',   value: 0,                                              icon:'✓',  bg:'#F3E8FF', color:'#7C3AED'            },
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
        {/* Available jobs to bid on */}
        <div style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:'var(--radius)', overflow:'hidden' }}>
          <div className="panel-header" style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-200)' }}>
            <span className="panel-title">Jobs You Can Bid On</span>
            <Link to="/dashboard/projects" className="panel-link">See all jobs</Link>
          </div>

          {loading ? (
            <div style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:72 }} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>No open jobs right now. Check back soon.</p>
            </div>
          ) : (
            jobs.slice(0,5).map(job => (
              <Link to={`/dashboard/projects/${job._id}`} key={job._id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px', borderBottom:'1px solid var(--gray-100)', textDecoration:'none', color:'inherit', transition:'background var(--transition)' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--gray-50)'}
                onMouseLeave={e=>e.currentTarget.style.background=''}
              >
                <div style={{ width:38, height:38, background:'var(--gray-50)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>
                  {CAT_ICONS[job.category] || '📦'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:3, color:'var(--gray-900)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.title}</div>
                  <div style={{ display:'flex', gap:8, fontSize:'0.76rem', color:'var(--gray-500)' }}>
                    <span className="trade-tag" style={{ fontSize:'0.68rem' }}>{job.category}</span>
                    <span>📍 {job.location}</span>
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontWeight:800, fontSize:'0.88rem', color:'var(--blue)' }}>KES {Number(job.budget).toLocaleString()}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--green)' }}>Open</div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:'var(--radius)', padding:20 }}>
            <div className="panel-title" style={{ marginBottom:14 }}>Quick Actions</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { to:'/dashboard/projects',      icon:'🔍', label:'Browse Available Jobs' },
                { to:'/dashboard/messages',      icon:'💬', label:'Check Messages'         },
                { to:'/dashboard/profile',       icon:'👤', label:'Update Your Profile'    },
                { to:'/dashboard/notifications', icon:'🔔', label:'Notifications'          },
              ].map(a => (
                <Link key={a.to} to={a.to} className="quick-link-row">
                  <span className="quick-link-icon">{a.icon}</span>
                  <span>{a.label}</span>
                  <span className="quick-link-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:'var(--radius)', padding:20 }}>
            <div className="panel-title" style={{ marginBottom:14 }}>Your Profile Strength</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { label:'Trade set',         done: !!user?.trade        },
                { label:'Location set',      done: !!user?.location     },
                { label:'Bio added',         done: !!user?.bio          },
                { label:'Qualification set', done: !!user?.qualification },
                { label:'Phone verified',    done: !!user?.phone        },
              ].map(item => (
                <div key={item.label} style={{ display:'flex', alignItems:'center', gap:10, fontSize:'0.84rem', color: item.done ? 'var(--gray-700)' : 'var(--gray-400)' }}>
                  <span style={{ width:18, height:18, borderRadius:'50%', background: item.done ? '#D1FAE5' : 'var(--gray-100)', color: item.done ? '#059669' : 'var(--gray-300)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', flexShrink:0 }}>
                    {item.done ? '✓' : '○'}
                  </span>
                  {item.label}
                </div>
              ))}
            </div>
            <Link to="/dashboard/profile" className="btn btn-outline btn-sm" style={{ marginTop:16, display:'block', textAlign:'center' }}>
              Complete Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
