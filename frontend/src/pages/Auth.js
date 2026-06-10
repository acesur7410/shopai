import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2>🛍️ ShopAI'ye Giriş Yap</h2>
        <p className="auth-sub">Hesabınıza giriş yapın</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" placeholder="ornek@email.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" placeholder="••••••" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? '⏳ Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        <p className="auth-link">Hesabınız yok mu? <Link to="/register">Üye Ol</Link></p>
        <div className="demo-info">
          <p>Test hesabı: <strong>user@shopai.com</strong> / <strong>user123</strong></p>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Şifreler eşleşmiyor');
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız');
    } finally { setLoading(false); }
  };

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2>🎉 Yeni Hesap Oluştur</h2>
        <p className="auth-sub">Dakikalar içinde alışverişe başlayın</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad Soyad</label>
            <input placeholder="Ad Soyad" value={form.name} onChange={f('name')} required />
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" placeholder="ornek@email.com" value={form.email} onChange={f('email')} required />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" placeholder="En az 6 karakter" value={form.password} onChange={f('password')} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Şifre Tekrar</label>
            <input type="password" placeholder="Şifrenizi tekrar girin" value={form.confirm} onChange={f('confirm')} required />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? '⏳ Kaydediliyor...' : 'Üye Ol'}
          </button>
        </form>
        <p className="auth-link">Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link></p>
      </div>
    </div>
  );
}
