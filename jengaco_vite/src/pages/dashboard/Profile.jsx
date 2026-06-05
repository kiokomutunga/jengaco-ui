import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function Profile() {
  const { user }     = useAuth();
  const [tab, setTab] = useState('personal');
  const [form, setForm] = useState({
    name:     user?.name     || '',
    email:    user?.email    || '',
    phone:    '',
    location: '',
    company:  '',
    bio:      '',
  });

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Profile</h1><p className="page-sub">Manage your account details and preferences.</p></div>
      </div>

      {/* Profile header */}
      <div className="card" style={{ padding:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
          <div style={{ width:80, height:80, background:'var(--blue)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', fontWeight:800, color:'white', fontFamily:'var(--font-display)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.3rem', marginBottom:4 }}>{user?.name}</h2>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <span className="badge badge-blue" style={{ textTransform:'capitalize' }}>{user?.role}</span>
              <span style={{ color:'var(--gray-400)', fontSize:'0.85rem' }}>{user?.email}</span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" style={{ marginLeft:'auto' }}>Change Photo</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['personal','company','security','preferences'].map(t => (
          <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'personal' && (
        <div className="card" style={{ padding:28 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:24 }}>Personal Information</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {[['name','Full Name','John Kamau'],['email','Email','john@email.com'],['phone','Phone','07XX XXX XXX'],['location','Location','Nairobi, Kenya']].map(([key,label,ph]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" placeholder={ph} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} />
              </div>
            ))}
            <div className="form-group" style={{ gridColumn:'1/-1' }}>
              <label className="form-label">Bio</label>
              <textarea className="form-input" rows={3} placeholder="Tell us a bit about yourself..." value={form.bio} onChange={e => setForm({...form,bio:e.target.value})} style={{ resize:'vertical' }} />
            </div>
          </div>
          <div style={{ marginTop:24, display:'flex', justifyContent:'flex-end', gap:12 }}>
            <button className="btn btn-ghost">Cancel</button>
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      )}

      {tab === 'company' && (
        <div className="card" style={{ padding:28 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:24 }}>Company Details</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {[['Company Name','company','Kamau Developers'],['Registration No','reg','CPR/2021/00123'],['Industry','industry','Real Estate'],['Website','web','www.example.co.ke']].map(([label,key,ph]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" placeholder={ph} />
              </div>
            ))}
          </div>
          <div style={{ marginTop:24, display:'flex', justifyContent:'flex-end' }}>
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="card" style={{ padding:28 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:24 }}>Change Password</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:400 }}>
            {['Current Password','New Password','Confirm New Password'].map(label => (
              <div key={label} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" type="password" placeholder="••••••••" />
              </div>
            ))}
            <button className="btn btn-primary" style={{ alignSelf:'flex-start' }}>Update Password</button>
          </div>
        </div>
      )}

      {tab === 'preferences' && (
        <div className="card" style={{ padding:28 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:24 }}>Notification Preferences</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {['New bids received','Payment confirmations','Project status updates','Inspection reminders','New messages','Weekly project digest'].map(item => (
              <div key={item} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid var(--gray-100)' }}>
                <span style={{ fontSize:'0.9rem' }}>{item}</span>
                <label style={{ position:'relative', display:'inline-block', width:44, height:24, cursor:'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ opacity:0, width:0, height:0 }} />
                  <span style={{ position:'absolute', inset:0, background:'var(--blue)', borderRadius:99, transition:'0.2s' }} />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
