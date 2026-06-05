import React from 'react';
import './Dashboard.css';
const NOTIFS = [
  { icon:'📋', title:'New bid received',           desc:'James Njoroge submitted a bid of KES 2.1M on your project.', time:'2h ago',  color:'#EBF4FF', read:false },
  { icon:'💰', title:'Payment confirmed',          desc:'Your M-Pesa payment of KES 45,000 was received successfully.', time:'5h ago', color:'#D1FAE5', read:false },
  { icon:'🏗', title:'Project status updated',     desc:'Home Extension project moved to In Progress.', time:'1d ago', color:'#FEF3C7', read:true },
  { icon:'🔍', title:'Inspection scheduled',       desc:'Site inspection booked for Thursday 23rd Jan at 10am.', time:'2d ago', color:'#EDE9FE', read:true },
  { icon:'📄', title:'Document uploaded',          desc:'Foundation report uploaded to your project folder.', time:'3d ago', color:'#FEF3C7', read:true },
  { icon:'⭐', title:'Review request',             desc:'Your completed project is ready for a review.', time:'1w ago', color:'#D1FAE5', read:true },
];
export default function Notifications() {
  return (
    <div className="page fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Notifications</h1><p className="page-sub">Stay up to date with your project activity.</p></div>
        <button className="btn btn-ghost btn-sm">Mark all read</button>
      </div>
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {NOTIFS.map((n, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:16, padding:'18px 24px', borderBottom: i<NOTIFS.length-1?'1px solid var(--gray-100)':'none', background: n.read?'white':'var(--blue-muted)', transition:'background var(--transition)' }}>
            <div style={{ width:44, height:44, borderRadius:50, background:n.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{n.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                <div style={{ fontWeight: n.read ? 500 : 700, fontSize:'0.9rem', marginBottom:4 }}>{n.title}</div>
                <span style={{ fontSize:'0.75rem', color:'var(--gray-400)', whiteSpace:'nowrap' }}>{n.time}</span>
              </div>
              <p style={{ color:'var(--gray-500)', fontSize:'0.85rem', lineHeight:1.6 }}>{n.desc}</p>
            </div>
            {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--blue)', flexShrink:0, marginTop:6 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
