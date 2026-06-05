import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import './Dashboard.css';
import './Projects.css';

const STATUS_BADGE = { open:'badge-blue', in_progress:'badge-orange', completed:'badge-green', cancelled:'badge-red' };
const CATS = ['all','renovation','construction','plumbing','electrical','interior','other'];

export default function Projects() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', budget:'', category:'renovation', location:'' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    const params = {};
    if (filter !== 'all') params.category = filter;
    jobsAPI.getAll(params).then(r => setJobs(r.data.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, [filter]);

  const handleCreate = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await jobsAPI.create(form);
      setShowModal(false);
      setForm({ title:'', description:'', budget:'', category:'renovation', location:'' });
      load();
    } catch (err) { alert(err.response?.data?.message || 'Error creating job'); }
    finally { setSubmitting(false); }
  };

  const filtered = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-sub">Manage all your construction and renovation jobs.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Post a Job</button>
      </div>

      {/* Filters */}
      <div className="toolbar">
        <input className="search-input" placeholder="Search by name or location..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="cat-tabs">
          {CATS.map(c => (
            <button key={c} className={`cat-tab ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="projects-grid">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height:220, borderRadius:12 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding:48 }}>
          <div className="empty-state">
            <div className="empty-icon">🏗</div>
            <p>No projects found. Post your first job to get started.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>Post a Job</button>
          </div>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map(job => (
            <Link to={`/dashboard/projects/${job._id}`} key={job._id} className="project-card card">
              <div className="project-card-header">
                <div className="project-card-cat">{job.category}</div>
                <span className={`badge ${STATUS_BADGE[job.status] || 'badge-gray'}`}>{job.status.replace('_',' ')}</span>
              </div>
              <h3 className="project-card-title">{job.title}</h3>
              <p className="project-card-desc">{job.description.substring(0,100)}{job.description.length > 100 ? '...' : ''}</p>
              <div className="project-card-meta">
                <span>📍 {job.location}</span>
                <span>💰 KES {Number(job.budget).toLocaleString()}</span>
              </div>
              {job.status === 'in_progress' && (
                <div style={{ marginTop:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--gray-500)', marginBottom:6 }}>
                    <span>Progress</span><span>65%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width:'65%' }} /></div>
                </div>
              )}
              <div className="project-card-footer">
                <span style={{ fontSize:'0.78rem', color:'var(--gray-400)' }}>
                  {new Date(job.createdAt).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })}
                </span>
                <span style={{ color:'var(--blue)', fontSize:'0.82rem', fontWeight:600 }}>View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Job Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post a New Job</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input className="form-input" placeholder="e.g. 3-Bedroom House Construction" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="Describe the work needed..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required style={{ resize:'vertical' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div className="form-group">
                  <label className="form-label">Budget (KES)</label>
                  <input className="form-input" type="number" placeholder="500000" value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                    {['renovation','construction','plumbing','electrical','interior','other'].map(c=>(
                      <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="Nairobi, Westlands" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} required />
              </div>
              <div style={{ display:'flex', gap:12, justifyContent:'flex-end', marginTop:4 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Posting...' : 'Post Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
