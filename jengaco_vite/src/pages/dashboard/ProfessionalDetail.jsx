import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dashboard.css';

const SAMPLE_PROF = {
  _id:'p1',
  user_id:{ name:'James Njoroge', location:'Nairobi', email:'james@example.com', phone:'0712 345 678' },
  skills:['construction','renovation','project management'],
  bio:'15 years of experience building quality residential and commercial structures across Nairobi and Central Kenya. Specialising in modern architectural designs and sustainable construction methods.',
  rating:4.8,
  review_count:24,
  is_verified:true,
  service_areas:['Nairobi','Kiambu','Murang\'a','Thika'],
  portfolio_images:[],
};

const REVIEWS = [
  { name:'Grace Wanjiku', rating:5, comment:'James built our family home from scratch. Professional, on time and within budget. Highly recommend.', date:'Jan 2026' },
  { name:'David Ochieng', rating:5, comment:'Our office renovation was handled expertly. Communication was excellent throughout.', date:'Dec 2025' },
  { name:'Amina Hassan',  rating:4, comment:'Good quality work. Minor delays but overall a solid contractor.', date:'Nov 2025' },
];

export default function ProfessionalDetail() {
  const { id } = useParams();
  const [tab, setTab] = useState('about');
  const prof = SAMPLE_PROF;

  return (
    <div className="page fade-in">
      <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.85rem', color:'var(--gray-400)', marginBottom:4 }}>
        <Link to="/dashboard/professionals" style={{ color:'var(--blue)' }}>Professionals</Link>
        <span>/</span>
        <span>{prof.user_id.name}</span>
      </div>

      {/* Header card */}
      <div className="card" style={{ padding:28 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:72, height:72, background:'var(--blue)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', fontWeight:800, color:'white', fontFamily:'var(--font-display)' }}>
              {prof.user_id.name[0]}
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.4rem' }}>{prof.user_id.name}</h1>
                {prof.is_verified && <span className="badge badge-green">✓ Verified</span>}
              </div>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap', color:'var(--gray-500)', fontSize:'0.85rem' }}>
                <span>📍 {prof.user_id.location}</span>
                <span>⭐ {prof.rating} ({prof.review_count} reviews)</span>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Link to="/dashboard/messages" className="btn btn-outline btn-sm">💬 Message</Link>
            <button className="btn btn-primary btn-sm">Hire Professional</button>
          </div>
        </div>
      </div>

      <div className="tabs">
        {['about','portfolio','reviews'].map(t => (
          <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
            {t==='reviews' && <span className="tab-count">{REVIEWS.length}</span>}
          </button>
        ))}
      </div>

      {tab === 'about' && (
        <div className="tab-grid">
          <div className="card" style={{ padding:24 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>About</h3>
            <p style={{ color:'var(--gray-600)', lineHeight:1.8, marginBottom:20 }}>{prof.bio}</p>
            <h4 style={{ fontWeight:700, marginBottom:12, fontSize:'0.9rem' }}>Skills</h4>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {prof.skills.map(s => <span key={s} className="badge badge-blue" style={{ textTransform:'capitalize' }}>{s}</span>)}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>Contact Info</h3>
              {[['📞','Phone',prof.user_id.phone],['✉️','Email',prof.user_id.email],['📍','Based in',prof.user_id.location]].map(([ic,l,v])=>(
                <div key={l} style={{ display:'flex', gap:10, marginBottom:12, fontSize:'0.88rem' }}>
                  <span>{ic}</span><div><div style={{ color:'var(--gray-400)', fontSize:'0.75rem' }}>{l}</div><div style={{ fontWeight:600 }}>{v}</div></div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:12 }}>Service Areas</h3>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {prof.service_areas.map(a => <span key={a} className="badge badge-gray">{a}</span>)}
              </div>
            </div>
            <div className="card" style={{ padding:24, textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color:'var(--blue)' }}>{prof.rating}</div>
              <div style={{ color:'var(--orange)', fontSize:'1.3rem', letterSpacing:2, marginBottom:6 }}>{'★'.repeat(Math.round(prof.rating))}</div>
              <div style={{ color:'var(--gray-400)', fontSize:'0.82rem' }}>{prof.review_count} verified reviews</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'portfolio' && (
        <div className="card" style={{ padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:20 }}>Portfolio</h3>
          {prof.portfolio_images.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📷</div><p>No portfolio images uploaded yet.</p></div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
              {prof.portfolio_images.map((url, i) => <img key={i} src={url} alt="" style={{ width:'100%', height:160, objectFit:'cover', borderRadius:8 }} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="card" style={{ padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:20 }}>Client Reviews</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ padding:16, background:'var(--gray-50)', borderRadius:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div className="dl-avatar">{r.name[0]}</div>
                    <div><div style={{ fontWeight:600, fontSize:'0.88rem' }}>{r.name}</div><div style={{ color:'var(--orange)', fontSize:'0.9rem' }}>{'★'.repeat(r.rating)}</div></div>
                  </div>
                  <span style={{ fontSize:'0.75rem', color:'var(--gray-400)' }}>{r.date}</span>
                </div>
                <p style={{ color:'var(--gray-600)', fontSize:'0.88rem', lineHeight:1.7 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
