import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Chatbot.css';

export default function Chatbot() {
  const { user } = useAuth();
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Merhaba! 👋 ShopAI asistanıyım. Size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    if (!user) { alert('Chatbot için giriş yapmanız gerekiyor.'); return; }

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6); // Son 6 mesajı gönder
      const { data } = await api.post('/ai/chat', { message: input, history });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Üzgünüm, şu an yanıt veremiyorum.' }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Toggle butonu */}
      <button className="chat-fab" onClick={() => setOpen(!open)}>
        {open ? '✕' : '🤖'}
        {!open && <span className="chat-fab-label">AI Asistan</span>}
      </button>

      {/* Chatbot penceresi */}
      {open && (
        <div className="chatbot">
          <div className="chatbot-header">
            <span>🤖 ShopAI Asistan</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <div className="chat-bubble">{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="chat-bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input">
            <input
              type="text" placeholder="Mesajınızı yazın..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button onClick={send} disabled={loading}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
