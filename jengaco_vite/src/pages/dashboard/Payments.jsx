import React, { useState, useEffect } from 'react';
import { jobsAPI, paymentsAPI } from '../../services/api';
import './Dashboard.css';
const SAMPLE = [
  { id:'TXN-001', date:'15 Jan 2026', method:'M-Pesa', amount:'KES 45,000', status:'completed', receipt:'QHG7TXY' },
  { id:'TXN-002', date:'10 Jan 2026', method:'M-Pesa', amount:'KES 120,000', status:'completed', receipt:'PKL3NMO' },
  { id:'TXN-003', date:'5 Jan 2026',  method:'M-Pesa', amount:'KES 18,500',  status:'pending',  receipt: null },
];
const BADGE = { completed:'badge-green', pending:'badge-orange', failed:'badge-red' };
export default function Payments() {
  return (
    <div className="page fade-in">
      <div className="page-header">
        <div><h1 className="page-title">Payments</h1><p className="page-sub">Track all your M-Pesa transactions.</p></div>
      </div>
      <div className="stat-grid" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        {[['Total Cost','KES 583,500','#EBF4FF','var(--blue)','💰'],['Amount Paid','KES 565,000','#D1FAE5','#059669','✓'],['Remaining','KES 18,500','#FEF3C7','var(--orange-dark)','⏳']].map(([l,v,bg,c,ic])=>(
          <div key={l} className="stat-card"><div className="stat-icon" style={{background:bg,color:c}}>{ic}</div><div className="stat-body"><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div></div>
        ))}
      </div>
      <div className="card">
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--gray-200)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700 }}>Transaction History</h3>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Transaction ID</th><th>Method</th><th>Amount</th><th>Status</th><th>Receipt</th></tr></thead>
            <tbody>
              {SAMPLE.map(t => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td style={{ fontFamily:'monospace', fontSize:'0.82rem' }}>{t.id}</td>
                  <td><span className="badge badge-blue">{t.method}</span></td>
                  <td style={{ fontWeight:600 }}>{t.amount}</td>
                  <td><span className={`badge ${BADGE[t.status]}`}>{t.status}</span></td>
                  <td>{t.receipt ? <button className="btn btn-ghost btn-sm" style={{ color:'var(--blue)' }}>↓ Receipt</button> : <span style={{ color:'var(--gray-300)' }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
