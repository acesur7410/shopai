import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

export default function Products() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal]           = useState(0);
  const [pages, setPages]           = useState(1);
  const [loading, setLoading]       = useState(true);

  const [params, setParams] = useSearchParams();
  const keyword  = params.get('keyword')  || '';
  const category = params.get('category') || '';
  const page     = Number(params.get('page')) || 1;

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({ keyword, category, page, limit: 12 });
    api.get(`/products?${q}`)
      .then(({ data }) => { setProducts(data.products); setTotal(data.total); setPages(data.pages); })
      .finally(() => setLoading(false));
  }, [keyword, category, page]);

  const setFilter = (key, val) => {
    const next = new URLSearchParams(params);
    next.set(key, val);
    next.set('page', '1');
    setParams(next);
  };

  const clearFilters = () => setParams({});

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <h3>Kategoriler</h3>
            <ul>
              <li className={!category ? 'active' : ''} onClick={() => setFilter('category', '')}>Tümü ({total})</li>
              {categories.map((c) => (
                <li key={c} className={category === c ? 'active' : ''} onClick={() => setFilter('category', c)}>{c}</li>
              ))}
            </ul>
            {(keyword || category) && (
              <button className="btn btn-outline btn-sm" onClick={clearFilters} style={{ marginTop: 16 }}>
                Filtreleri Temizle
              </button>
            )}
          </aside>

          {/* İçerik */}
          <main>
            <div className="products-header">
              <h2>
                {keyword ? `"${keyword}" araması` : category || 'Tüm Ürünler'}
                <span className="count"> — {total} ürün</span>
              </h2>
            </div>

            {loading ? (
              <div className="spinner-overlay"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>Ürün bulunamadı</h3>
                <p>Farklı arama terimleri deneyin.</p>
              </div>
            ) : (
              <div className="grid grid-4">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
            )}

            {/* Sayfalama */}
            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setFilter('page', p)}>{p}</button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
