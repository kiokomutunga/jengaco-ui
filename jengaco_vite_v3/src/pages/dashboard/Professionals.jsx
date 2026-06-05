import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { professionalsAPI } from '../../services/api'
import './Dashboard.css'
import './Professionals.css'

const SAMPLE = [
  { _id:'p1', user_id:{ name:'James Njoroge', location:'Westlands, Nairobi', phone:'0712345678', email:'james@email.com' }, trade:'Construction', experience:'10+', qualification:'NCA Registered', rating:4.8, review_count:24, is_verified:true, bio:'15 years building quality homes and commercial structures across Nairobi. Specialised in bungalows and maisonettes.', lat:-1.2676, lng:36.8119, distance:2.1 },
  { _id:'p2', user_id:{ name:'Mary Wambui',   location:'Kilimani, Nairobi',  phone:'0723456789', email:'mary@email.com'  }, trade:'Interior Design', experience:'6-10', qualification:'Diploma in Interior Design', rating:4.9, review_count:18, is_verified:true, bio:'Award-winning interior designer. Modern and functional spaces tailored to your budget.', lat:-1.2921, lng:36.7836, distance:3.4 },
  { _id:'p3', user_id:{ name:'Peter Oduya',   location:'Embakasi, Nairobi',  phone:'0734567890', email:'peter@email.com' }, trade:'Plumbing', experience:'6-10', qualification:'City and Guilds Certified', rating:4.6, review_count:31, is_verified:true, bio:'Fast and reliable plumbing. Available 7 days a week including emergencies.', lat:-1.3192, lng:36.8902, distance:5.7 },
  { _id:'p4', user_id:{ name:'Grace Achieng', location:'Ruaka, Kiambu',      phone:'0745678901', email:'grace@email.com' }, trade:'Renovation', experience:'3-5', qualification:'Diploma in Building Tech', rating:4.7, review_count:12, is_verified:false, bio:'Affordable renovations done right. Kitchen, bathrooms, flooring and more.', lat:-1.2031, lng:36.7794, distance:8.2 },
  { _id:'p5', user_id:{ name:'David Kamau',   location:'Thika Road, Nairobi',phone:'0756789012', email:'david@email.com' }, trade:'Electrical', experience:'6-10', qualification:'ERC Licensed Electrician', rating:4.5, review_count:19, is_verified:true, bio:'Fully licensed electrician. New installations, rewiring and fault finding.', lat:-1.2523, lng:36.8901, distance:4.3 },
  { _id:'p6', user_id:{ name:'Alice Muthoni', location:'Karen, Nairobi',     phone:'0767890123', email:'alice@email.com' }, trade:'Painting', experience:'3-5', qualification:'NCA Grade 5', rating:4.4, review_count:8, is_verified:false, bio:'Clean, precise painting and decorating for homes and offices.', lat:-1.3367, lng:36.7110, distance:9.8 },
]

const TRADES = ['All','Construction','Plumbing','Electrical','Interior Design','Renovation','Painting','Roofing','Carpentry']

// Simple static map using OpenStreetMap tiles — no API key needed
function ProfessionalsMap({ professionals, selected, onSelect }) {
  return (
    <div className="prof-map-container">
      <div className="prof-map-header">
        <span style={{ fontWeight:600, fontSize:'0.88rem' }}>Professionals near you</span>
        <span style={{ fontSize:'0.78rem', color:'var(--gray-400)' }}>Based on your location</span>
      </div>
      <div className="prof-map-body">
        <iframe
          title="Professionals Map"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border:0, borderRadius:8 }}
          src="https://www.openstreetmap.org/export/embed.html?bbox=36.69%2C-1.38%2C36.95%2C-1.18&layer=mapnik&marker=-1.2921%2C36.8219"
          allowFullScreen
        />
        <div className="map-pins-overlay">
          {professionals.map((p, i) => (
            <button
              key={p._id}
              className={`map-pin ${selected === p._id ? 'active' : ''}`}
              style={{ top: `${20 + i * 12}%`, left: `${15 + (i % 3) * 28}%` }}
              onClick={() => onSelect(p._id)}
              title={p.user_id.name}
            >
              <div className="map-pin-dot" />
              <div className="map-pin-label">{p.user_id.name.split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Professionals() {
  const [search, setSearch]       = useState('')
  const [trade, setTrade]         = useState('All')
  const [view, setView]           = useState('list')
  const [selected, setSelected]   = useState(null)
  const [sortBy, setSortBy]       = useState('distance')
  const [profs] = useState(SAMPLE)

  const filtered = profs
    .filter(p => {
      const q = search.toLowerCase()
      return (
        (trade === 'All' || p.trade === trade) &&
        (p.user_id.name.toLowerCase().includes(q) ||
          p.user_id.location.toLowerCase().includes(q) ||
          p.trade.toLowerCase().includes(q))
      )
    })
    .sort((a, b) => sortBy === 'distance' ? a.distance - b.distance : b.rating - a.rating)

  const selectedProf = profs.find(p => p._id === selected)

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Find Professionals</h1>
          <p className="page-sub">Browse verified tradespeople near you and contact them directly.</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className={`view-toggle ${view==='list'?'active':''}`} onClick={() => setView('list')}>List</button>
          <button className={`view-toggle ${view==='map'?'active':''}`} onClick={() => setView('map')}>Map</button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="prof-toolbar">
        <input
          className="search-input"
          placeholder="Search by name, location or trade..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="form-input" style={{ width:'auto', minWidth:140 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="distance">Nearest first</option>
          <option value="rating">Highest rated</option>
        </select>
      </div>

      <div className="trade-scroll">
        {TRADES.map(t => (
          <button key={t} className={`trade-chip ${trade===t?'active':''}`} onClick={() => setTrade(t)}>{t}</button>
        ))}
      </div>

      {view === 'map' && (
        <div className="map-list-split">
          <ProfessionalsMap professionals={filtered} selected={selected} onSelect={setSelected} />
          <div className="map-list-panel">
            {filtered.map(p => (
              <button key={p._id} className={`map-list-item ${selected===p._id?'active':''}`} onClick={() => setSelected(p._id)}>
                <div className="mli-top">
                  <div className="mli-avatar">{p.user_id.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div className="mli-name">{p.user_id.name}</div>
                    <div className="mli-trade">{p.trade}</div>
                  </div>
                  <div className="mli-dist">{p.distance} km</div>
                </div>
                <div className="mli-loc">📍 {p.user_id.location}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="prof-list">
          {filtered.length === 0 && (
            <div style={{ padding:48, textAlign:'center', color:'var(--gray-500)' }}>No professionals found for this search.</div>
          )}
          {filtered.map(p => (
            <div key={p._id} className="prof-row">
              <div className="prof-row-avatar">{p.user_id.name[0]}</div>
              <div className="prof-row-body">
                <div className="prof-row-top">
                  <div>
                    <div className="prof-row-name">
                      {p.user_id.name}
                      {p.is_verified && <span className="verified-tag">✓ Verified</span>}
                    </div>
                    <div className="prof-row-meta">
                      <span className="trade-tag">{p.trade}</span>
                      <span>·</span>
                      <span>{p.experience} yrs exp</span>
                      <span>·</span>
                      <span>📍 {p.user_id.location}</span>
                      <span>·</span>
                      <span className="dist-tag">{p.distance} km away</span>
                    </div>
                  </div>
                  <div className="prof-row-rating">
                    <span className="star">★</span>
                    <span className="rating-val">{p.rating}</span>
                    <span className="rating-count">({p.review_count})</span>
                  </div>
                </div>

                {p.qualification && (
                  <div className="qual-tag">🎓 {p.qualification}</div>
                )}

                <p className="prof-row-bio">{p.bio}</p>

                <div className="prof-row-actions">
                  <a href={`tel:${p.user_id.phone}`} className="btn-action call">
                    📞 Call
                  </a>
                  <Link to="/dashboard/messages" className="btn-action msg">
                    💬 Message
                  </Link>
                  <Link to={`/dashboard/professionals/${p._id}`} className="btn-action view">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
