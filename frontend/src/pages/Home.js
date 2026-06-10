import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?limit=8').then(({ data }) => setFeatured(data.products));
    api.get('/products/categories').then(({ data }) => setCategories(data));
  }, []);

  const catIcons = { Elektronik: '📱', Bilgisayar: '💻', Tablet: '📲', Aksesuar: '🎧' };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Akıllı Alışverişin<br /><span>Yeni Adresi</span></h1>
            <p>Yapay zeka destekli ürün önerileri ve kişiselleştirilmiş alışveriş deneyimi sizi bekliyor.</p>
            <div className="hero-btns">
              <Link to="/products" className="btn btn-primary">Alışverişe Başla</Link>
              <Link to="/products?category=Elektronik" className="btn btn-outline">Fırsatları Keşfet</Link>
            </div>
          </div>
          <div className="hero-visual">🛍️</div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="section container">
        <h2 className="page-title">Kategoriler</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <button key={cat} className="category-card" onClick={() => navigate(`/products?category=${cat}`)}>
              <span className="cat-icon">{catIcons[cat] || '🛒'}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Öne çıkan ürünler */}
      <section className="section container">
        <h2 className="page-title">Öne Çıkan Ürünler</h2>
        <div className="grid grid-4">
          {featured.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/products" className="btn btn-secondary">Tüm Ürünleri Gör</Link>
        </div>
      </section>

      {/* Banner */}
      <section className="ai-banner">
        <div className="container">
          <div>
            <h2>🤖 AI Alışveriş Asistanı</h2>
            <p>Sağ altta bulunan yapay zeka asistanımız size en uygun ürünleri bulmada yardımcı olur.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
