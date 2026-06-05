import React, { useState } from 'react';
import './Dashboard.css';
const QUOTES = [
  { id:'QT-001', service:'Residential Construction', cost:'KES 2,400,000', status:'pending',  date:'12 Jan 2026' },
  { id:'QT-002', service:'Interior Design',          cost:'KES 380,000',   status:'accepted', date:'8 Jan 2026' },
  { id:'QT-003', service:'Renovation',               cost:'KES 650,000',   status:'rejected', date:'3 Jan 2026' },
];
const BADGE = { pending:'badge-orange', accepted:'badge-green', rejected:'badge-red' };
export default function Quotations() {
  return (
    <div className="page fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Quotations</h1><p className="page-sub">Review and manage your project quotations.</p></div>
        <button className="btn btn-primary">+ Request Quote</button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {QUOTES.map(q => (
          <div key={q.id} className="card" style={{ padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.82rem', color:'var(--gray-400)' }}>{q.id}</span>
                  <span className={`badge ${BADGE[q.status]}`}>{q.status}</span>
                </div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.05rem', marginBottom:6 }}>{q.service}</h3>
                <div style={{ display:'flex', gap:20, color:'var(--gray-500)', fontSize:'0.85rem' }}>
                  <span>💰 {q.cost}</span><span>📅 {q.date}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <button className="btn btn-outline btn-sm">View Quote</button>
                {q.status === 'pending' && <>
                  <button className="btn btn-primary btn-sm">Accept</button>
                  <button className="btn btn-ghost btn-sm" style={{ color:'var(--red)' }}>Reject</button>
                </>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
