import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'
import './Projects.css'

const STATUS_BADGE = { open:'badge-blue', in_progress:'badge-orange', completed:'badge-green', cancelled:'badge-red' }
const CATS = ['All','Renovation','Construction','Plumbing','Electrical','Interior','Roofing','Painting','Other']

export default function Projects() {
  const { user } = useAuth()
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('All')
  const [search, setSearch]   = useState('')
  const [showModal, setShowModal] = useState(false)
  const [images, setImages]   = useState([])
  const [previews, setPreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title:'', description:'', budget:'',
    category:'renovation', location:'', urgency:'normal'
  })

  const isClient = user?.role === 'user' || user?.role === 'admin'
  const isPro    = user?.role === 'professional'

  const load = () => {
    setLoading(true)
    const params = {}
    if (filter !== 'All') params.category = filter.toLowerCase()
    jobsAPI.getAll(params)
      .then(r => setJobs(r.data.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [filter])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach(img => fd.append('images', img))
      await jobsAPI.create(fd)
      setShowModal(false)
      setForm({ title:'', description:'', budget:'', category:'renovation', location:'', urgency:'normal' })
      setImages([]); setPreviews([])
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting job')
    } finally { setSubmitting(false) }
  }

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isPro ? 'Available Jobs' : 'My Jobs'}</h1>
          <p className="page-sub">{isPro ? 'Browse open jobs and submit your bid.' : 'Post jobs and manage your projects.'}</p>
        </div>
        {isClient && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Post a Job</button>
        )}
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by title or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="trade-scroll">
        {CATS.map(c => (
          <button
            key={c}
            className={`trade-chip ${filter===c?'active':''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="jobs-list">
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:120, borderRadius:12 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-box">
          <div className="empty-icon">🏗</div>
          <p>{isClient ? 'You have no jobs yet. Post your first job to receive bids.' : 'No jobs match your search.'}</p>
          {isClient && <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>Post a Job</button>}
        </div>
      ) : (
        <div className="jobs-list">
          {filtered.map(job => (
            <Link to={`/dashboard/projects/${job._id}`} key={job._id} className="job-row">
              {job.images?.[0] && (
                <img src={job.images[0]} alt={job.title} className="job-row-img" />
              )}
              <div className="job-row-body">
                <div className="job-row-top">
                  <div>
                    <div className="job-row-title">{job.title}</div>
                    <div className="job-row-meta">
                      <span className="trade-tag">{job.category}</span>
                      <span>·</span>
                      <span>📍 {job.location}</span>
                      <span>·</span>
                      <span>{new Date(job.createdAt).toLocaleDateString('en-KE',{day:'numeric',month:'short'})}</span>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                    <span className={`badge ${STATUS_BADGE[job.status]||'badge-gray'}`}>{job.status.replace('_',' ')}</span>
                    <span className="budget-tag">KES {Number(job.budget).toLocaleString()}</span>
                  </div>
                </div>
                <p className="job-row-desc">{job.description?.substring(0,140)}{job.description?.length > 140 ? '...' : ''}</p>
                <div className="job-row-footer">
                  {job.urgency === 'urgent' && <span className="urgent-tag">Urgent</span>}
                  <span className="view-link">View Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post a Job</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input className="form-input" placeholder="e.g. Fix leaking roof in Karen" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="Describe the work needed in detail..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required style={{ resize:'vertical' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div className="form-group">
                  <label className="form-label">Budget (KES)</label>
                  <input className="form-input" type="number" placeholder="e.g. 50000" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {['renovation','construction','plumbing','electrical','interior','roofing','painting','other'].map(c=>(
                      <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" placeholder="e.g. Karen, Nairobi" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency</label>
                  <select className="form-input" value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value})}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Image upload */}
              <div className="form-group">
                <label className="form-label">Photos (up to 5)</label>
                <label className="upload-area">
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display:'none' }} />
                  {previews.length === 0 ? (
                    <div className="upload-placeholder">
                      <span style={{ fontSize:'1.5rem' }}>📷</span>
                      <span>Click to add photos of the work area</span>
                      <span style={{ fontSize:'0.75rem', color:'var(--gray-400)' }}>JPG, PNG or WEBP · Max 5MB each</span>
                    </div>
                  ) : (
                    <div className="upload-previews">
                      {previews.map((src, i) => (
                        <img key={i} src={src} alt="" className="upload-thumb" />
                      ))}
                      <div className="upload-add">+ Add more</div>
                    </div>
                  )}
                </label>
              </div>

              <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
