import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI, bidsAPI, reviewsAPI, paymentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';
import './Projects.css';
import './ProjectDetail.css';

const MILESTONES = ['Site Preparation','Foundation','Structural Works','Roofing','Finishing','Handover'];
const STATUS_BADGE = { open:'badge-blue', in_progress:'badge-orange', completed:'badge-green', cancelled:'badge-red' };

export default function ProjectDetail() {
  const { id }       = useParams();
  const { user }     = useAuth();
  const [job, setJob]     = useState(null);
  const [bids, setBids]   = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]     = useState('overview');
  const [showPayment, setShowPayment] = useState(false);
  const [payForm, setPayForm] = useState({ phone_number:'', payment_type:'full_payment' });
  const [paying, setPaying]   = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating:5, comment:'' });

  useEffect(() => {
    Promise.all([
      jobsAPI.getOne(id),
      bidsAPI.getForJob(id).catch(() => ({ data: { data: [] } })),
      reviewsAPI.getForJob(id).catch(() => ({ data: { data: [] } })),
    ]).then(([j, b, r]) => {
      setJob(j.data.data);
      setBids(b.data.data || []);
      setReviews(r.data.data || []);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAcceptBid = async (bidId) => {
    if (!window.confirm('Accept this bid? All other bids will be rejected.')) return;
    try {
      await bidsAPI.accept(bidId);
      const b = await bidsAPI.getForJob(id);
      setBids(b.data.data || []);
      const j = await jobsAPI.getOne(id);
      setJob(j.data.data);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handlePayment = async (e) => {
    e.preventDefault(); setPaying(true);
    try {
      await paymentsAPI.initiate({ job_id: id, ...payForm });
      setShowPayment(false);
      alert('STK push sent. Check your phone and enter your M-Pesa PIN.');
    } catch (err) { alert(err.response?.data?.message || 'Payment error'); }
    finally { setPaying(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await reviewsAPI.create({ job_id: id, ...reviewForm });
      setShowReview(false);
      const r = await reviewsAPI.getForJob(id);
      setReviews(r.data.data || []);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  if (loading) return <div className="page"><div className="skeleton" style={{ height:400, borderRadius:12 }} /></div>;
  if (!job)    return <div className="page"><div className="card" style={{padding:40, textAlign:'center'}}>Job not found.</div></div>;

  const isOwner = job.user_id?._id === user?._id || job.user_id === user?._id;
  const accepted = bids.find(b => b.status === 'accepted');
  const milestonesDone = job.status === 'completed' ? 6 : job.status === 'in_progress' ? 3 : 0;

  return (
    <div className="page fade-in">
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.85rem', color:'var(--gray-400)' }}>
        <Link to="/dashboard/projects" style={{ color:'var(--blue)' }}>Projects</Link>
        <span>/</span>
        <span>{job.title}</span>
      </div>

      {/* Header */}
      <div className="card" style={{ padding:28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
              <span className={`badge ${STATUS_BADGE[job.status] || 'badge-gray'}`}>{job.status.replace('_',' ')}</span>
              <span className="badge badge-blue">{job.category}</span>
              {job.payment_status === 'paid' && <span className="badge badge-green">✓ Paid</span>}
            </div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:800, marginBottom:6 }}>{job.title}</h1>
            <div style={{ display:'flex', gap:20, flexWrap:'wrap', color:'var(--gray-500)', fontSize:'0.85rem' }}>
              <span>📍 {job.location}</span>
              <span>💰 KES {Number(job.budget).toLocaleString()}</span>
              <span>📅 {new Date(job.createdAt).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'})}</span>
            </div>
          </div>
          {isOwner && (
            <div style={{ display:'flex', gap:10 }}>
              {job.status === 'in_progress' && job.payment_status === 'unpaid' && (
                <button className="btn btn-orange btn-sm" onClick={() => setShowPayment(true)}>💳 Pay Now</button>
              )}
              {job.status === 'completed' && (
                <button className="btn btn-outline btn-sm" onClick={() => setShowReview(true)}>⭐ Leave Review</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['overview','bids','images','reviews'].map(t => (
          <button key={t} className={`tab-btn ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
            {t==='bids' && bids.length > 0 && <span className="tab-count">{bids.length}</span>}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="tab-grid">
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>Description</h3>
              <p style={{ color:'var(--gray-600)', lineHeight:1.8 }}>{job.description}</p>
            </div>
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:20 }}>Project Milestones</h3>
              <div className="milestones">
                {MILESTONES.map((m, i) => (
                  <div key={m} className={`milestone ${i < milestonesDone ? 'done' : i === milestonesDone ? 'current' : ''}`}>
                    <div className="milestone-dot">{i < milestonesDone ? '✓' : i + 1}</div>
                    <div className="milestone-label">{m}</div>
                    {i < MILESTONES.length - 1 && <div className="milestone-line" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>Project Info</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  ['Status', job.status.replace('_',' ')],
                  ['Category', job.category],
                  ['Location', job.location],
                  ['Budget', `KES ${Number(job.budget).toLocaleString()}`],
                  ['Payment', job.payment_status],
                  ['Posted', new Date(job.createdAt).toLocaleDateString('en-KE')],
                ].map(([label, val]) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.88rem', paddingBottom:10, borderBottom:'1px solid var(--gray-100)' }}>
                    <span style={{ color:'var(--gray-500)' }}>{label}</span>
                    <span style={{ fontWeight:600, textTransform:'capitalize' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
            {accepted && (
              <div className="card" style={{ padding:24 }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>Assigned Professional</h3>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div className="dl-avatar">P</div>
                  <div>
                    <div style={{ fontWeight:600 }}>Professional</div>
                    <div style={{ fontSize:'0.82rem', color:'var(--gray-400)' }}>KES {Number(accepted.amount).toLocaleString()} · {accepted.estimated_duration} days</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bids tab */}
      {tab === 'bids' && (
        <div className="card" style={{ padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:20 }}>Bids Received ({bids.length})</h3>
          {bids.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📋</div><p>No bids received yet.</p></div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {bids.map(bid => (
                <div key={bid._id} className="bid-card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                    <div>
                      <div style={{ fontWeight:700, marginBottom:4 }}>KES {Number(bid.amount).toLocaleString()}</div>
                      <div style={{ fontSize:'0.82rem', color:'var(--gray-400)' }}>Est. {bid.estimated_duration} days</div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span className={`badge ${bid.status==='accepted'?'badge-green':bid.status==='rejected'?'badge-red':'badge-orange'}`}>{bid.status}</span>
                      {isOwner && bid.status === 'pending' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleAcceptBid(bid._id)}>Accept</button>
                      )}
                    </div>
                  </div>
                  <p style={{ color:'var(--gray-600)', fontSize:'0.88rem', lineHeight:1.7, marginTop:10 }}>{bid.proposal}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Images tab */}
      {tab === 'images' && (
        <div className="card" style={{ padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:20 }}>Project Images ({job.images?.length || 0})</h3>
          {!job.images?.length ? (
            <div className="empty-state"><div className="empty-icon">📷</div><p>No images uploaded yet.</p></div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:12 }}>
              {job.images.map((url, i) => (
                <img key={i} src={url} alt={`Project ${i+1}`} style={{ width:'100%', height:160, objectFit:'cover', borderRadius:8 }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews tab */}
      {tab === 'reviews' && (
        <div className="card" style={{ padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:20 }}>Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">⭐</div><p>No reviews yet.</p></div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {reviews.map(r => (
                <div key={r._id} style={{ padding:16, background:'var(--gray-50)', borderRadius:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ color:'var(--orange)', letterSpacing:2 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                    <span style={{ fontSize:'0.78rem', color:'var(--gray-400)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color:'var(--gray-600)', fontSize:'0.88rem', lineHeight:1.7 }}>{r.comment}</p>
                  <div style={{ fontSize:'0.78rem', color:'var(--gray-400)', marginTop:8, textTransform:'capitalize' }}>{r.review_type?.replace(/_/g,' ')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment modal */}
      {showPayment && (
        <div className="modal-backdrop" onClick={() => setShowPayment(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Pay via M-Pesa</h2>
              <button className="modal-close" onClick={() => setShowPayment(false)}>✕</button>
            </div>
            <div style={{ background:'var(--green-light)', border:'1px solid #6EE7B7', borderRadius:8, padding:16, marginBottom:20, fontSize:'0.88rem', color:'#065F46' }}>
              You will receive a prompt on your phone. Enter your M-Pesa PIN to confirm.
            </div>
            <form onSubmit={handlePayment} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">M-Pesa Phone Number</label>
                <input className="form-input" placeholder="07XX XXX XXX" value={payForm.phone_number} onChange={e=>setPayForm({...payForm,phone_number:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Type</label>
                <select className="form-input" value={payForm.payment_type} onChange={e=>setPayForm({...payForm,payment_type:e.target.value})}>
                  <option value="full_payment">Full Payment</option>
                  <option value="deposit">Deposit</option>
                  <option value="milestone">Milestone Payment</option>
                </select>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.9rem', padding:'12px 0', borderTop:'1px solid var(--gray-200)' }}>
                <span style={{ color:'var(--gray-500)' }}>Amount:</span>
                <span style={{ fontWeight:700, color:'var(--blue)' }}>KES {Number(accepted?.amount || job.budget).toLocaleString()}</span>
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowPayment(false)}>Cancel</button>
                <button type="submit" className="btn btn-orange" disabled={paying}>{paying ? 'Sending...' : 'Send STK Push'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review modal */}
      {showReview && (
        <div className="modal-backdrop" onClick={() => setShowReview(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Leave a Review</h2>
              <button className="modal-close" onClick={() => setShowReview(false)}>✕</button>
            </div>
            <form onSubmit={handleReview} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div style={{ display:'flex', gap:8 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setReviewForm({...reviewForm,rating:n})}
                      style={{ fontSize:'1.8rem', color: n<=reviewForm.rating ? 'var(--orange)' : 'var(--gray-200)', background:'none', transition:'color 0.15s' }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-input" rows={4} placeholder="Share your experience..." value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm,comment:e.target.value})} style={{ resize:'vertical' }} />
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowReview(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
