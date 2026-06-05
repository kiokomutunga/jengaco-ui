import React from 'react'
import { Link } from 'react-router-dom'
import './HowItWorks.css'

const CLIENT_STEPS = [
  { n:'01', icon:'📝', title:'Post your job',          desc:'Describe the work, set a budget and add photos. Takes 2 minutes.' },
  { n:'02', icon:'📋', title:'Receive bids',            desc:'Verified professionals in your area send you their prices and proposals.' },
  { n:'03', icon:'✅', title:'Choose your professional', desc:'Compare by rating, location and price. Then accept the bid you like.' },
  { n:'04', icon:'💳', title:'Pay via M-Pesa',           desc:'Pay securely once the job is done to your satisfaction.' },
]

const PRO_STEPS = [
  { n:'01', icon:'👤', title:'Create your profile',   desc:'Add your trade, experience, qualifications and service area.' },
  { n:'02', icon:'🔍', title:'Browse available jobs',  desc:'See jobs posted near you filtered by trade.' },
  { n:'03', icon:'💬', title:'Submit your bid',         desc:'Send your price, timeline and a short proposal to the client.' },
  { n:'04', icon:'🌟', title:'Get hired and rated',     desc:'Complete the job, get paid and build your reputation.' },
]

export default function HowItWorks() {
  return (
    <section className="hiw-section" id="how">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">Simple Process</div>
          <h2 className="section-title">How It Works</h2>
        </div>

        <div className="hiw-tabs-root">
          <div className="hiw-side client-side">
            <div className="hiw-side-label">For Clients</div>
            <div className="hiw-steps">
              {CLIENT_STEPS.map(s => (
                <div key={s.n} className="hiw-step">
                  <div className="hiw-step-num">{s.n}</div>
                  <div className="hiw-step-icon">{s.icon}</div>
                  <div>
                    <div className="hiw-step-title">{s.title}</div>
                    <div className="hiw-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/register?role=user" className="btn btn-primary hiw-cta-btn">Post a Job Free</Link>
          </div>

          <div className="hiw-divider" />

          <div className="hiw-side pro-side">
            <div className="hiw-side-label pro">For Professionals</div>
            <div className="hiw-steps">
              {PRO_STEPS.map(s => (
                <div key={s.n} className="hiw-step">
                  <div className="hiw-step-num pro">{s.n}</div>
                  <div className="hiw-step-icon">{s.icon}</div>
                  <div>
                    <div className="hiw-step-title">{s.title}</div>
                    <div className="hiw-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/register?role=professional" className="btn btn-orange hiw-cta-btn">Join as a Pro</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
