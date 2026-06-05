import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobsAPI, bidsAPI, reviewsAPI, paymentsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'
import './Projects.css'
import './ProjectDetail.css'

const STATUS_BADGE = { open:'badge-blue', in_progress:'badge-orange', completed:'badge-green', cancelled:'badge-red' }
const MILESTONES = ['Site Preparation','Foundation','Structural Works','Roofing','Finishing','Handover']

// Inline Google Maps distance embed — no API key needed for embed
function LocationMap({ location }) {
  const query = encodeURIComponent(location + ', Kenya')
  return (
    <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid var(--gray-200)' }}>
      <iframe
        title="Job Location"
        width="100%"
        height="200"
        frameBorder="0"
        style={{ border:0 }}
        src={`https://maps.google.com/maps?q=${query}&output=embed&z=14`}
        allowFullScreen
      />
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [job, setJob]         = useState(null)
  const [bids, setBids]       = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('overview')
  const [showBidForm, setShowBidForm]     = useState(false)
  const [showPayment, setShowPayment]     = useState(false)
  const [showReview, setShowReview]       = useState(false)
  const [showMarkDone, setShowMarkDone]   = useState(false)
  const [bidForm, setBidForm]   = useState({ amount:'', estimated_duration:'', proposal:'' })
  const [payForm, setPayForm]   = useState({ phone_number:'', payment_type:'full_payment' })
  const [reviewForm, setReviewForm] = useState({ rating:5, comment:'' })
  const [submitting, setSubmitting] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  const load = async () => {
    try {
      const [j, b, r] = await Promise.all([
        jobsAPI.getOne(id),
        bidsAPI.getForJob(id).catch(() => ({ data:{ data:[] } })),
        reviewsAPI.getForJob(id).catch(() => ({ data:{ data:[] } })),
      ])
      setJob(j.data.data)
      setBids(b.data.data || [])
      setReviews(r.data.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const isOwner   = job?.user_id?._id === user?._id || job?.user_id === user?._id
  const isPro     = user?.role === 'professional'
  const isComplete = job?.status === 'completed'
  const accepted  = bids.find(b => b.status === 'accepted')
  const myBid     = bids.find(b => b.professional_id === user?._id || b.professional_id?._id === user?._id)
  const milestonesDone = job?.status === 'completed' ? 6 : job?.status === 'in_progress' ? 3 : 0
  const alreadyReviewed = reviews.some(r => r.reviewer_id === user?._id || r.reviewer_id?._id === user?._id)

  const handleBid = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await bidsAPI.submit({ job_id: id, ...bidForm })
      setShowBidForm(false)
      setBidForm({ amount:'', estimated_duration:'', proposal:'' })
      load()
    } catch (err) { alert(err.response?.data?.message || 'Error submitting bid') }
    finally { setSubmitting(false) }
  }

  const handleAccept = async (bidId) => {
    if (!window.confirm('Accept this bid? All other bids will be rejected.')) return
    try {
      await bidsAPI.accept(bidId)
      load()
    } catch (err) { alert(err.response?.data?.message || 'Error') }
  }

  const handleMarkDone = async () => {
    try {
      await jobsAPI.update(id, { status: 'completed' })
      setShowMarkDone(false)
      load()
    } catch (err) { alert(err.response?.data?.message || 'Error') }
  }

  const handlePayment = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await paymentsAPI.initiate({ job_id: id, ...payForm })
      setShowPayment(false)
      alert('STK push sent to your phone. Enter your M-Pesa PIN to confirm.')
    } catch (err) { alert(err.response?.data?.message || 'Payment error') }
    finally { setSubmitting(false) }
  }

  const handleReview = async (e) => {
    e.preventDefault(); setSubmitting(true)
    try {
      await reviewsAPI.create({ job_id: id, ...reviewForm })
      setShowReview(false)
      load()
    } catch (err) { alert(err.response?.data?.message || 'Error') }
    finally { setSubmitting(false) }
  }

  if (loading) return <div className="page"><div className="skeleton" style={{ height:400, borderRadius:12 }} /></div>
  if (!job)    return <div className="page"><div className="empty-box">Job not found.</div></div>

  return (
    <div className="page fade-in">
      <div className="breadcrumb">
        <Link to="/dashboard/projects">Jobs</Link>
        <span>/</span>
        <span>{job.title}</span>
      </div>

      {/* Header */}
      <div className="job-detail-header">
        <div className="job-detail-header-left">
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, flexWrap:'wrap' }}>
            <span className={`badge ${STATUS_BADGE[job.status]||'badge-gray'}`}>{job.status.replace('_',' ')}</span>
            <span className="trade-tag" style={{ textTransform:'capitalize' }}>{job.category}</span>
            {job.urgency === 'urgent' && <span className="urgent-tag">Urgent</span>}
            {job.payment_status === 'paid' && <span className="badge badge-green">Paid</span>}
          </div>
          <h1 className="job-detail-title">{job.title}</h1>
          <div className="job-detail-meta">
            <span>📍 {job.location}</span>
            <span>💰 KES {Number(job.budget).toLocaleString()}</span>
            <span>📅 Posted {new Date(job.createdAt).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'})}</span>
          </div>
        </div>
        <div className="job-detail-header-actions">
          {isPro && job.status === 'open' && !myBid && (
            <button className="btn btn-primary" onClick={() => setShowBidForm(true)}>Submit Bid</button>
          )}
          {isPro && myBid && (
            <div className="my-bid-pill">Your bid: KES {Number(myBid.amount).toLocaleString()}</div>
          )}
          {isOwner && job.status === 'in_progress' && (
            <button className="btn btn-orange btn-sm" onClick={() => setShowMarkDone(true)}>Mark as Done</button>
          )}
          {isOwner && job.status === 'in_progress' && job.payment_status === 'unpaid' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowPayment(true)}>💳 Pay</button>
          )}
          {isOwner && isComplete && !alreadyReviewed && (
            <button className="btn btn-outline btn-sm" onClick={() => setShowReview(true)}>⭐ Review</button>
          )}
        </div>
      </div>

      {/* Image gallery */}
      {job.images?.length > 0 && (
        <div className="img-gallery">
          <div className="img-main">
            <img src={job.images[imgIndex]} alt={job.title} />
          </div>
          {job.images.length > 1 && (
            <div className="img-thumbs">
              {job.images.map((src, i) => (
                <button key={i} className={`img-thumb ${i===imgIndex?'active':''}`} onClick={() => setImgIndex(i)}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {[
          { key:'overview', label:'Overview' },
          { key:'bids',     label:`Bids (${bids.length})` },
          { key:'map',      label:'Location' },
          { key:'reviews',  label:`Reviews (${reviews.length})` },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${tab===t.key?'active':''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="tab-grid">
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="detail-section">
              <h3>About this job</h3>
              <p style={{ color:'var(--gray-600)', lineHeight:1.8 }}>{job.description}</p>
            </div>
            {job.status !== 'open' && (
              <div className="detail-section">
                <h3>Progress</h3>
                <div className="milestones">
                  {MILESTONES.map((m, i) => (
                    <div key={m} className={`milestone ${i<milestonesDone?'done':i===milestonesDone?'current':''}`}>
                      <div className="milestone-dot">{i<milestonesDone?'✓':i+1}</div>
                      <div className="milestone-label">{m}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="detail-section">
              <h3>Job Details</h3>
              {[
                ['Status', job.status.replace('_',' ')],
                ['Category', job.category],
                ['Location', job.location],
                ['Budget', `KES ${Number(job.budget).toLocaleString()}`],
                ['Payment', job.payment_status || 'unpaid'],
                ['Posted', new Date(job.createdAt).toLocaleDateString('en-KE')],
              ].map(([l,v]) => (
                <div key={l} className="detail-row">
                  <span>{l}</span>
                  <span style={{ fontWeight:600, textTransform:'capitalize' }}>{v}</span>
                </div>
              ))}
            </div>
            {accepted && (
              <div className="detail-section">
                <h3>Hired Professional</h3>
                <div className="hired-pro">
                  <div className="dl-avatar">P</div>
                  <div>
                    <div style={{ fontWeight:700 }}>Accepted Bid</div>
                    <div style={{ fontSize:'0.82rem', color:'var(--gray-400)' }}>
                      KES {Number(accepted.amount).toLocaleString()} · {accepted.estimated_duration} days
                    </div>
                  </div>
                  <a href="tel:+254700000000" className="btn-action call" style={{ marginLeft:'auto' }}>📞 Call</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bids */}
      {tab === 'bids' && (
        <div className="detail-section">
          <h3>Bids Received ({bids.length})</h3>
          {bids.length === 0 ? (
            <div className="empty-box" style={{ border:'none' }}>
              <div className="empty-icon">📋</div>
              <p>No bids yet. Professionals will submit bids here.</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {bids.map(bid => (
                <div key={bid._id} className={`bid-row ${bid.status==='accepted'?'accepted':''}`}>
                  <div className="bid-row-top">
                    <div className="bid-amount">KES {Number(bid.amount).toLocaleString()}</div>
                    <div className="bid-duration">{bid.estimated_duration} days</div>
                    <span className={`badge ${bid.status==='accepted'?'badge-green':bid.status==='rejected'?'badge-red':'badge-orange'}`}>
                      {bid.status}
                    </span>
                    {isOwner && bid.status === 'pending' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleAccept(bid._id)}>Accept</button>
                    )}
                  </div>
                  <p className="bid-proposal">{bid.proposal}</p>
                  {isOwner && (
                    <div className="bid-actions">
                      <a href="tel:+254700000000" className="btn-action call">📞 Call Professional</a>
                      <Link to="/dashboard/messages" className="btn-action msg">💬 Message</Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Map */}
      {tab === 'map' && (
        <div className="detail-section">
          <h3>Job Location: {job.location}</h3>
          <p style={{ color:'var(--gray-500)', fontSize:'0.85rem', marginBottom:14 }}>
            This is where the work will be done. Use this to estimate travel time before submitting a bid.
          </p>
          <LocationMap location={job.location} />
        </div>
      )}

      {/* Reviews */}
      {tab === 'reviews' && (
        <div className="detail-section">
          <h3>Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <div className="empty-box" style={{ border:'none' }}>
              <div className="empty-icon">⭐</div>
              <p>{isComplete ? 'No reviews yet.' : 'Reviews are available after the job is marked complete.'}</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {reviews.map((r, i) => (
                <div key={i} className="review-row">
                  <div className="review-top">
                    <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                    <span style={{ fontSize:'0.75rem', color:'var(--gray-400)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color:'var(--gray-600)', fontSize:'0.88rem', lineHeight:1.7 }}>{r.comment}</p>
                  <div style={{ fontSize:'0.75rem', color:'var(--gray-400)', marginTop:6, textTransform:'capitalize' }}>
                    {r.review_type?.replace(/_/g,' ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bid form modal */}
      {showBidForm && (
        <div className="modal-backdrop" onClick={() => setShowBidForm(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit a Bid</h2>
              <button className="modal-close" onClick={() => setShowBidForm(false)}>✕</button>
            </div>
            <div className="bid-job-summary">
              <div className="bid-job-title">{job.title}</div>
              <div style={{ fontSize:'0.82rem', color:'var(--gray-500)' }}>📍 {job.location} · Budget: KES {Number(job.budget).toLocaleString()}</div>
            </div>
            <form onSubmit={handleBid} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div className="form-group">
                  <label className="form-label">Your Price (KES)</label>
                  <input className="form-input" type="number" placeholder="45000" value={bidForm.amount} onChange={e=>setBidForm({...bidForm,amount:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Days to Complete</label>
                  <input className="form-input" type="number" placeholder="7" value={bidForm.estimated_duration} onChange={e=>setBidForm({...bidForm,estimated_duration:e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Proposal</label>
                <textarea className="form-input" rows={4} placeholder="Describe your approach, relevant experience, and why you are the right person for this job..." value={bidForm.proposal} onChange={e=>setBidForm({...bidForm,proposal:e.target.value})} required style={{ resize:'vertical' }} />
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowBidForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Bid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mark done modal */}
      {showMarkDone && (
        <div className="modal-backdrop" onClick={() => setShowMarkDone(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()} style={{ maxWidth:420 }}>
            <div className="modal-header">
              <h2>Mark Job as Done?</h2>
              <button className="modal-close" onClick={() => setShowMarkDone(false)}>✕</button>
            </div>
            <p style={{ color:'var(--gray-600)', marginBottom:24, lineHeight:1.7 }}>
              This will mark the job as completed and open it for reviews. Only do this once the work has been finished and you are satisfied.
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowMarkDone(false)}>Cancel</button>
              <button className="btn btn-orange" onClick={handleMarkDone}>Yes, Mark as Done</button>
            </div>
          </div>
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
            <div className="mpesa-info">You will receive a prompt on your phone. Enter your M-Pesa PIN to confirm payment.</div>
            <form onSubmit={handlePayment} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">M-Pesa Phone Number</label>
                <input className="form-input" placeholder="07XX XXX XXX" value={payForm.phone_number} onChange={e=>setPayForm({...payForm,phone_number:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Type</label>
                <select className="form-input" value={payForm.payment_type} onChange={e=>setPayForm({...payForm,payment_type:e.target.value})}>
                  <option value="full_payment">Full Payment</option>
                  <option value="deposit">Deposit (50%)</option>
                  <option value="milestone">Milestone Payment</option>
                </select>
              </div>
              <div className="payment-total">
                <span>Amount</span>
                <span>KES {Number(accepted?.amount || job.budget).toLocaleString()}</span>
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowPayment(false)}>Cancel</button>
                <button type="submit" className="btn btn-orange" disabled={submitting}>{submitting ? 'Sending...' : 'Send STK Push'}</button>
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
            <p style={{ color:'var(--gray-500)', fontSize:'0.85rem', marginBottom:20 }}>
              You can only review a professional once the job is marked complete. Your review helps other clients make better decisions.
            </p>
            <form onSubmit={handleReview} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div style={{ display:'flex', gap:6 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setReviewForm({...reviewForm,rating:n})}
                      style={{ fontSize:'2rem', color:n<=reviewForm.rating?'var(--orange)':'var(--gray-200)', background:'none', border:'none', cursor:'pointer', lineHeight:1, transition:'color 0.15s' }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-input" rows={4} placeholder="How was the quality of work? Was the professional punctual and communicative?" value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm,comment:e.target.value})} style={{ resize:'vertical' }} />
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowReview(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Submitting...':'Submit Review'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
