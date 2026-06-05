import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../../services/api'
import './PublicJobs.css'

const FALLBACK = [
  { _id:'j1', title:'Fix leaking roof in Karen', category:'roofing',       location:'Karen, Nairobi',     budget:45000,  status:'open', createdAt:'2026-06-01', description:'Roof leaking after heavy rains. Need urgent repair before next rains.' },
  { _id:'j2', title:'Kitchen renovation',         category:'renovation',    location:'Westlands, Nairobi', budget:120000, status:'open', createdAt:'2026-05-30', description:'Full kitchen remodel — cabinets, countertops and tiling.' },
  { _id:'j3', title:'Electrical rewiring',         category:'electrical',    location:'Kilimani, Nairobi',  budget:35000,  status:'open', createdAt:'2026-05-29', description:'Old wiring needs replacement throughout the house.' },
  { _id:'j4', title:'Build perimeter wall',        category:'construction',  location:'Ruaka, Kiambu',      budget:280000, status:'open', createdAt:'2026-05-28', description:'50m perimeter wall with gate. Drawings available.' },
  { _id:'j5', title:'Plumbing for new bathroom',  category:'plumbing',      location:'Ngong Road, Nairobi',budget:55000,  status:'open', createdAt:'2026-05-27', description:'New bathroom installation including toilet, shower and sink.' },
  { _id:'j6', title:'Interior painting',           category:'painting',      location:'Thika Road, Nairobi',budget:28000,  status:'open', createdAt:'2026-05-26', description:'3-bedroom apartment interior walls and ceiling painting.' },
]

const CATS = ['All','Construction','Renovation','Plumbing','Electrical','Roofing','Painting','Interior']
const CAT_ICONS = { construction:'🏗', renovation:'🔨', plumbing:'🔧', electrical:'⚡', roofing:'🏠', painting:'🎨', interior:'🛋', other:'📦' }

export default function PublicJobs() {
  const [jobs, setJobs]     = useState(FALLBACK)
  const [cat, setCat]       = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    jobsAPI.getAll({ status:'open' })
      .then(r => { if (r.data.data?.length) setJobs(r.data.data) })
      .catch(() => {})
  }, [])

  const filtered = jobs.filter(j => {
    const matchCat    = cat === 'All' || j.category?.toLowerCase() === cat.toLowerCase()
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.location.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <section className="pj-section" id="jobs">
      <div className="container">
        <div className="pj-header">
          <div>
            <div className="section-eyebrow">Live on the Platform</div>
            <h2 className="section-title">Open Jobs Near You</h2>
            <p className="section-sub">Browse jobs posted by homeowners across Kenya. Sign up to bid on any of these.</p>
          </div>
          <Link to="/register?role=professional" className="btn btn-primary">
            Start Bidding Free →
          </Link>
        </div>

        <div className="pj-toolbar">
          <input
            className="pj-search"
            placeholder="Search by title or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="pj-cats">
          {CATS.map(c => (
            <button
              key={c}
              className={`pj-cat ${cat === c ? 'active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="pj-grid">
          {filtered.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'40px 0', color:'var(--gray-400)' }}>
              No jobs found for this search.
            </div>
          )}
          {filtered.map(job => (
            <div key={job._id} className="pj-card">
              <div className="pj-card-top">
                <div className="pj-cat-icon">{CAT_ICONS[job.category] || '📦'}</div>
                <div style={{ flex:1 }}>
                  <div className="pj-card-title">{job.title}</div>
                  <div className="pj-card-meta">
                    <span className="pj-tag">{job.category}</span>
                    <span>📍 {job.location}</span>
                  </div>
                </div>
                <div className="pj-budget">KES {Number(job.budget).toLocaleString()}</div>
              </div>
              <p className="pj-desc">{job.description?.substring(0,110)}{job.description?.length > 110 ? '...' : ''}</p>
              <div className="pj-footer">
                <span className="pj-date">{new Date(job.createdAt).toLocaleDateString('en-KE',{day:'numeric',month:'short'})}</span>
                <Link to="/register?role=professional" className="pj-bid-btn">
                  Bid for this job →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="pj-cta">
          <p>Have work that needs doing?</p>
          <Link to="/register?role=user" className="btn btn-orange">Post a Job Free</Link>
        </div>
      </div>
    </section>
  )
}
