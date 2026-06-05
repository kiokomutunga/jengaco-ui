import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './Dashboard.css'
import './Professionals.css'

const SAMPLE = {
  _id:'p1',
  user_id:{ name:'James Njoroge', location:'Westlands, Nairobi', phone:'0712345678', email:'james@email.com' },
  trade:'Construction', experience:'10+', qualification:'NCA Registered Contractor',
  rating:4.8, review_count:24, is_verified:true,
  bio:'15 years of experience building quality residential and commercial structures across Nairobi and Central Kenya. I specialise in bungalows, maisonettes, and commercial developments. All my work comes with a 2-year structural warranty.',
  service_areas:['Nairobi','Kiambu','Murang\'a','Thika','Machakos'],
  portfolio_images:[],
}

const REVIEWS = [
  { name:'Grace Wanjiku', rating:5, comment:'James built our family home from scratch. Professional, on time and within budget. Highly recommend.', date:'Jan 2026' },
  { name:'David Ochieng', rating:5, comment:'Our office renovation was handled expertly. Communication was excellent throughout.', date:'Dec 2025' },
  { name:'Amina Hassan',  rating:4, comment:'Good quality work. Some delays at the start but he made up for it. Would use again.', date:'Nov 2025' },
]

export default function ProfessionalDetail() {
  const { id }    = useParams()
  const [tab, setTab] = useState('about')
  const prof = SAMPLE

  const avgRating = REVIEWS.reduce((s,r) => s+r.rating, 0) / REVIEWS.length

  return (
    <div className="page fade-in">
      <div className="breadcrumb">
        <Link to="/dashboard/professionals">Professionals</Link>
        <span>/</span>
        <span>{prof.user_id.name}</span>
      </div>

      {/* Profile header */}
      <div className="prof-header">
        <div className="prof-header-left">
          <div className="prof-header-avatar">{prof.user_id.name[0]}</div>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
              <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.4rem' }}>{prof.user_id.name}</h1>
              {prof.is_verified && <span className="verified-tag">✓ Verified</span>}
            </div>
            <div className="prof-header-meta">
              <span className="trade-tag">{prof.trade}</span>
              <span>·</span>
              <span>{prof.experience} years experience</span>
              <span>·</span>
              <span>📍 {prof.user_id.location}</span>
            </div>
            <div className="prof-header-meta" style={{ marginTop:6 }}>
              <span style={{ color:'var(--orange)' }}>{'★'.repeat(Math.round(avgRating))}</span>
              <span style={{ fontWeight:700 }}>{avgRating.toFixed(1)}</span>
              <span style={{ color:'var(--gray-400)', fontSize:'0.8rem' }}>({prof.review_count} reviews)</span>
            </div>
          </div>
        </div>
        <div className="prof-header-actions">
          <a href={`tel:${prof.user_id.phone}`} className="btn-action call" style={{ fontSize:'0.88rem', padding:'9px 20px' }}>
            📞 Call {prof.user_id.phone}
          </a>
          <Link to="/dashboard/messages" className="btn-action msg" style={{ fontSize:'0.88rem', padding:'9px 20px' }}>
            💬 Message
          </Link>
          <button className="btn btn-primary btn-sm">Hire for a Job</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key:'about',     label:'About' },
          { key:'portfolio', label:'Portfolio' },
          { key:'reviews',   label:`Reviews (${REVIEWS.length})` },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${tab===t.key?'active':''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'about' && (
        <div className="tab-grid">
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="detail-section">
              <h3>About</h3>
              <p style={{ color:'var(--gray-600)', lineHeight:1.8 }}>{prof.bio}</p>
            </div>
            <div className="detail-section">
              <h3>Service Areas</h3>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {prof.service_areas.map(a => (
                  <span key={a} style={{ background:'var(--gray-100)', padding:'4px 12px', borderRadius:99, fontSize:'0.82rem', color:'var(--gray-600)' }}>{a}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="detail-section">
              <h3>Professional Details</h3>
              {[
                ['Trade', prof.trade],
                ['Experience', `${prof.experience} years`],
                ['Qualification', prof.qualification],
                ['Location', prof.user_id.location],
                ['Phone', prof.user_id.phone],
                ['Email', prof.user_id.email],
              ].map(([l,v]) => (
                <div key={l} className="detail-row">
                  <span>{l}</span>
                  <span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="detail-section" style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', fontWeight:800, color:'var(--blue)', marginBottom:4 }}>{avgRating.toFixed(1)}</div>
              <div style={{ color:'var(--orange)', fontSize:'1.2rem', letterSpacing:2, marginBottom:6 }}>{'★'.repeat(Math.round(avgRating))}</div>
              <div style={{ color:'var(--gray-400)', fontSize:'0.82rem' }}>{prof.review_count} client reviews</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'portfolio' && (
        <div className="detail-section">
          <h3>Portfolio</h3>
          {prof.portfolio_images.length === 0 ? (
            <div className="empty-box" style={{ border:'none' }}>
              <div className="empty-icon">📷</div>
              <p>No portfolio images uploaded yet.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
              {prof.portfolio_images.map((url,i) => (
                <img key={i} src={url} alt="" style={{ width:'100%', height:150, objectFit:'cover', borderRadius:8 }} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="detail-section">
          <h3>Client Reviews</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {REVIEWS.map((r,i) => (
              <div key={i} className="review-row">
                <div className="review-top">
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div className="dl-avatar">{r.name[0]}</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.88rem' }}>{r.name}</div>
                      <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:'0.75rem', color:'var(--gray-400)' }}>{r.date}</span>
                </div>
                <p style={{ color:'var(--gray-600)', fontSize:'0.88rem', lineHeight:1.7, marginTop:8 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
