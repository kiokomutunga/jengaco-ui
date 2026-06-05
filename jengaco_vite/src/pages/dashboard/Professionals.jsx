import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { professionalsAPI } from '../../services/api';
import './Dashboard.css';

const SAMPLE = [
  { _id:'p1', user_id:{ name:'James Njoroge', location:'Nairobi' }, skills:['construction','renovation'], rating:4.8, review_count:24, is_verified:true, bio:'15 years in residential and commercial construction across Nairobi and Central Kenya.' },
  { _id:'p2', user_id:{ name:'Mary Wambui',   location:'Kiambu'  }, skills:['interior','renovation'],    rating:4.9, review_count:18, is_verified:true, bio:'Award-winning interior designer with a passion for functional and beautiful spaces.' },
  { _id:'p3', user_id:{ name:'Peter Oduya',   location:'Mombasa' }, skills:['plumbing','electrical'],    rating:4.6, review_count:31, is_verified:true, bio:'Certified plumber and electrician. Fast, clean and reliable service.' },
  { _id:'p4', user_id:{ name:'Grace Achieng', location:'Kisumu'  }, skills:['construction','plumbing'],  rating:4.7, review_count:12, is_verified:false, bio:'Specialising in budget-friendly residential construction in Western Kenya.' },
];

export default function Professionals() {
  const [search, setSearch] = useState('');
  const [skill,  setSkill]  = useState('all');
  const [profs,  setProfs]  = useState(SAMPLE);

  const filtered = profs.filter(p => {
    const matchSearch = p.user_id.name.toLowerCase().includes(search.toLowerCase()) || p.user_id.location.toLowerCase().includes(search.toLowerCase());
    const matchSkill  = skill === 'all' || p.skills.includes(skill);
    return matchSearch && matchSkill;
  });

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Professionals</h1><p className="page-sub">Browse verified construction professionals.</p></div>
      </div>
      <div className="toolbar">
        <input className="search-input" placeholder="Search by name or location..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="cat-tabs">
          {['all','construction','renovation','plumbing','electrical','interior'].map(s => (
            <button key={s} className={`cat-tab ${skill===s?'active':''}`} onClick={() => setSkill(s)}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="projects-grid">
        {filtered.map(p => (
          <Link to={`/dashboard/professionals/${p._id}`} key={p._id} className="card" style={{ padding:24, display:'flex', flexDirection:'column', gap:14, transition:'transform 0.2s,box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div className="dl-avatar" style={{ width:48, height:48, fontSize:'1.1rem' }}>{p.user_id.name[0]}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.95rem' }}>{p.user_id.name}</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--gray-400)' }}>📍 {p.user_id.location}</div>
                </div>
              </div>
              {p.is_verified && <span className="badge badge-green">✓ Verified</span>}
            </div>
            <p style={{ color:'var(--gray-500)', fontSize:'0.85rem', lineHeight:1.6 }}>{p.bio}</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {p.skills.map(s => <span key={s} className="badge badge-blue" style={{ textTransform:'capitalize' }}>{s}</span>)}
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid var(--gray-100)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ color:'var(--orange)', fontSize:'1rem' }}>★</span>
                <span style={{ fontWeight:700, fontSize:'0.9rem' }}>{p.rating}</span>
                <span style={{ color:'var(--gray-400)', fontSize:'0.8rem' }}>({p.review_count} reviews)</span>
              </div>
              <span style={{ color:'var(--blue)', fontSize:'0.82rem', fontWeight:600 }}>View Profile →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
