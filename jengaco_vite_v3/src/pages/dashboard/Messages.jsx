import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';
import './Messages.css';

const CONVERSATIONS = [
  { id:1, name:'James Njoroge', role:'Project Manager', lastMsg:'The foundation work starts Monday.', time:'2h', unread:2, avatar:'J' },
  { id:2, name:'Mary Wambui',   role:'Interior Designer', lastMsg:'I sent over the mood board.', time:'5h', unread:0, avatar:'M' },
  { id:3, name:'Peter Oduya',   role:'Contractor', lastMsg:'Site inspection done. Report attached.', time:'1d', unread:1, avatar:'P' },
];

const MESSAGES = {
  1: [
    { id:1, from:'them', text:'Good morning! I wanted to give you an update on the project.', time:'9:00 AM' },
    { id:2, from:'me',   text:'Morning James! Yes, please go ahead.', time:'9:05 AM' },
    { id:3, from:'them', text:'We completed the site preparation yesterday. Everything looks good.', time:'9:06 AM' },
    { id:4, from:'them', text:'The foundation work starts Monday morning.', time:'9:07 AM' },
    { id:5, from:'me',   text:'That is great news. Can you send photos of the site?', time:'9:10 AM' },
  ],
  2: [
    { id:1, from:'them', text:'Hi! I sent over the mood board for your review.', time:'2:30 PM' },
    { id:2, from:'me',   text:'Just saw it. I love the colour palette!', time:'4:00 PM' },
  ],
  3: [
    { id:1, from:'them', text:'Site inspection done. I will share the full report shortly.', time:'Yesterday' },
  ],
};

export default function Messages() {
  const [active, setActive]   = useState(1);
  const [input, setInput]     = useState('');
  const [msgs, setMsgs]       = useState(MESSAGES);
  const bottomRef             = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [active, msgs]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit' });
    setMsgs(prev => ({
      ...prev,
      [active]: [...(prev[active] || []), { id: Date.now(), from:'me', text: input.trim(), time: now }]
    }));
    setInput('');
  };

  const conv = CONVERSATIONS.find(c => c.id === active);

  return (
    <div className="page fade-in" style={{ padding:0 }}>
      <div className="messages-root">
        {/* Sidebar */}
        <div className="msg-sidebar">
          <div className="msg-sidebar-header">
            <h2>Messages</h2>
            <button className="btn btn-primary btn-sm">+ New</button>
          </div>
          <div className="msg-list">
            {CONVERSATIONS.map(c => (
              <button key={c.id} className={`msg-item ${active===c.id?'active':''}`} onClick={() => setActive(c.id)}>
                <div className="msg-avatar">{c.avatar}</div>
                <div className="msg-item-body">
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span className="msg-item-name">{c.name}</span>
                    <span className="msg-item-time">{c.time}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span className="msg-item-last">{c.lastMsg}</span>
                    {c.unread > 0 && <span className="msg-unread">{c.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="msg-chat">
          <div className="msg-chat-header">
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div className="msg-avatar lg">{conv?.avatar}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:'0.95rem' }}>{conv?.name}</div>
                <div style={{ fontSize:'0.78rem', color:'var(--green)' }}>● Online · {conv?.role}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn btn-ghost btn-sm">📎</button>
              <button className="btn btn-ghost btn-sm">📞</button>
            </div>
          </div>

          <div className="msg-body">
            {(msgs[active] || []).map(m => (
              <div key={m.id} className={`msg-bubble-row ${m.from==='me'?'me':''}`}>
                {m.from !== 'me' && <div className="msg-avatar sm">{conv?.avatar}</div>}
                <div className={`msg-bubble ${m.from==='me'?'mine':''}`}>
                  {m.text}
                  <span className="msg-time">{m.time}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="msg-input-row">
            <button className="btn btn-ghost btn-sm">📷</button>
            <button className="btn btn-ghost btn-sm">📎</button>
            <input
              className="msg-input"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button className="btn btn-primary btn-sm" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
