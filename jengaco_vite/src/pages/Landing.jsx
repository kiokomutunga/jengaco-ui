import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const SERVICES = [
  { icon: '🏠', title: 'Residential Construction', desc: 'Custom homes built to your exact specifications, on time and within budget.' },
  { icon: '🏢', title: 'Commercial Construction', desc: 'Office blocks, warehouses and retail spaces designed for productivity and longevity.' },
  { icon: '🔨', title: 'Renovation Services', desc: 'Transform your existing space with modern upgrades and quality finishes.' },
  { icon: '🎨', title: 'Interior Design', desc: 'Functional, beautiful interiors crafted by our experienced design team.' },
  { icon: '📐', title: 'Project Management', desc: 'End-to-end oversight from site prep to handover, keeping everything on track.' },
  { icon: '📏', title: 'Quantity Surveying', desc: 'Accurate cost planning and bill of quantities for any scale of project.' },
];

const STATS = [
  { value: '500+', label: 'Completed Projects' },
  { value: '15+',  label: 'Years Experience' },
  { value: '98%',  label: 'Client Satisfaction' },
  { value: '120+', label: 'Professional Staff' },
];

const TESTIMONIALS = [
  { name: 'Grace Wanjiku', role: 'Homeowner, Kiambu', text: 'Jenga Co built our family home from the ground up. The team was professional, communicative and delivered exactly what we envisioned.', rating: 5 },
  { name: 'David Ochieng',  role: 'Business Owner, Nairobi', text: 'Our office renovation was completed ahead of schedule. The project portal made it easy to track progress every single day.', rating: 5 },
  { name: 'Amina Hassan',   role: 'Property Developer', text: 'I have used Jenga Co for three commercial projects. Consistently excellent quality and a team that truly understands construction in Kenya.', rating: 5 },
];

export default function Landing() {
  const [activeTest, setActiveTest] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  return (
    <div className="landing">
      {/* ── Navbar ── */}
      <nav className="lnav">
        <div className="container lnav-inner">
          <div className="lnav-logo">
            <div className="lnav-mark">JC</div>
            <div>
              <div className="lnav-name">Jenga Co</div>
              <div className="lnav-sub">Construction</div>
            </div>
          </div>
          <div className="lnav-links">
            <a href="#services">Services</a>
            <a href="#why-us">Why Us</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="lnav-actions">
            <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay" />
          <div className="hero-pattern" />
        </div>
        <div className="container hero-inner">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Kenya's Premier Construction Partner
          </div>
          <h1 className="hero-title">
            Building Your Vision<br />
            <span className="hero-accent">Into Reality</span>
          </h1>
          <p className="hero-sub">
            Professional construction, renovation, and project management services across Kenya.
            From concept to completion, we build with precision and care.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-orange btn-lg">Get Started</Link>
            <a href="#contact" className="btn btn-outline-white btn-lg">Request Quote</a>
          </div>
          <div className="hero-stats">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">What We Do</div>
            <h2 className="section-title">Our Services</h2>
            <p className="section-sub">Comprehensive construction solutions tailored to your needs.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map(s => (
              <div key={s.title} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <a href="#contact" className="service-link">Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="why-section" id="why-us">
        <div className="container why-inner">
          <div className="why-content">
            <div className="section-eyebrow">Why Choose Us</div>
            <h2 className="section-title white">Built on Trust,<br />Delivered with Excellence</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32, lineHeight: 1.8 }}>
              For over 15 years, Jenga Co has been the construction partner Kenyan families and businesses trust for quality, transparency and on-time delivery.
            </p>
            <ul className="why-list">
              {['Certified and vetted construction professionals','Real-time project tracking via our digital platform','Transparent pricing with no hidden costs','M-Pesa integrated payment system','Post-handover support and warranty'].map(item => (
                <li key={item} className="why-item">
                  <span className="why-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn btn-orange btn-lg" style={{ marginTop: 32, display:'inline-flex' }}>
              Start Your Project
            </Link>
          </div>
          <div className="why-stats">
            {STATS.map(s => (
              <div key={s.label} className="why-stat-card">
                <div className="why-stat-value">{s.value}</div>
                <div className="why-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Client Stories</div>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div className="testimonials">
            <div className="test-card">
              <div className="test-stars">{'★'.repeat(TESTIMONIALS[activeTest].rating)}</div>
              <p className="test-text">"{TESTIMONIALS[activeTest].text}"</p>
              <div className="test-author">
                <div className="test-avatar">{TESTIMONIALS[activeTest].name[0]}</div>
                <div>
                  <div className="test-name">{TESTIMONIALS[activeTest].name}</div>
                  <div className="test-role">{TESTIMONIALS[activeTest].role}</div>
                </div>
              </div>
            </div>
            <div className="test-dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`test-dot ${i === activeTest ? 'active' : ''}`}
                  onClick={() => setActiveTest(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="contact-section" id="contact">
        <div className="container contact-inner">
          <div className="contact-info">
            <div className="section-eyebrow">Get In Touch</div>
            <h2 className="section-title">Start Your Project Today</h2>
            <p style={{ color: 'var(--gray-500)', marginBottom: 32, lineHeight: 1.8 }}>
              Tell us about your project and we will send you a detailed quotation within 24 hours.
            </p>
            <div className="contact-details">
              <div className="contact-item"><span>📍</span> Westlands, Nairobi, Kenya</div>
              <div className="contact-item"><span>📞</span> +254 700 000 000</div>
              <div className="contact-item"><span>✉️</span> hello@jengaco.co.ke</div>
              <div className="contact-item"><span>🕐</span> Mon – Fri: 8am – 6pm</div>
            </div>
          </div>
          <div className="contact-form card">
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 24 }}>Request a Quote</h3>
            <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="John Kamau" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="john@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" placeholder="07XX XXX XXX" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Project Description</label>
                <textarea className="form-input" rows={4} placeholder="Describe your project..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{ resize:'vertical' }} />
              </div>
              <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>
                Send Request
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="lnav-logo" style={{ marginBottom: 12 }}>
              <div className="lnav-mark">JC</div>
              <div>
                <div className="lnav-name">Jenga Co</div>
                <div className="lnav-sub">Construction</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', maxWidth: 260, lineHeight: 1.7 }}>
              Building Kenya's future with quality, integrity and innovation.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <div className="footer-col-title">Services</div>
              {['Residential','Commercial','Renovation','Interior Design','Project Management'].map(s => <a key={s} href="#services">{s}</a>)}
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              {['About Us','Our Team','Projects','Careers','Contact'].map(s => <a key={s} href="#contact">{s}</a>)}
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Account</div>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            © {new Date().getFullYear()} Jenga Co. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
