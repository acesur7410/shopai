import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { imgUrl } from '../utils/imageUrl';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);
  const [review, setReview]   = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async () => {
    const result = await addToCart(product._id, qty);
    if (result.success) { setAdded(true); setTimeout(() => setAdded(false), 2000); }
  };

  const submitReview = async () => {
    try {
      await api.post(`/products/${id}/reviews`, review);
      setReviewMsg('Yorumunuz eklendi!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Hata oluştu');
    }
  };

  if (loading) return <div className="spinner-overlay"><div className="spinner" /></div>;
  if (!product) return <div className="container" style={{ padding: '40px 0' }}><div className="alert alert-error">Ürün bulunamadı</div></div>;

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="product-detail container">
      <Link to="/products" className="back-link">← Ürünlere Dön</Link>

      <div className="detail-grid">
        {/* Sol: Görsel */}
        <div className="detail-image">
          <img src={imgUrl(product.image)} alt={product.name} />
        </div>

        {/* Sağ: Bilgiler */}
        <div className="detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="detail-rating">
            <span className="stars">{stars(Math.round(product.rating))}</span>
            <span>{product.rating.toFixed(1)} ({product.numReviews} değerlendirme)</span>
          </div>

          <div className="detail-price">₺{product.price.toLocaleString('tr-TR')}</div>
          <p className="detail-desc">{product.description}</p>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="badge badge-success">✓ Stokta ({product.stock} adet)</span>
            ) : (
              <span className="badge badge-danger">Stok Tükendi</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="add-to-cart">
              <div className="qty-control">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
              </div>
              <button className={`btn ${added ? 'btn-success' : 'btn-primary'}`} onClick={handleAdd}>
                {added ? '✓ Sepete Eklendi!' : '🛒 Sepete Ekle'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Yorumlar */}
      <div className="reviews-section">
        <h2>Müşteri Yorumları ({product.numReviews})</h2>

        {product.reviews.length === 0 ? (
          <p className="no-reviews">Henüz yorum yapılmamış.</p>
        ) : (
          <div className="reviews-list">
            {product.reviews.map((r) => (
              <div key={r._id} className="review-card card">
                <div className="review-header">
                  <strong>{r.name}</strong>
                  <span className="stars">{stars(r.rating)}</span>
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user && (
          <div className="review-form card">
            <h3>Yorum Yap</h3>
            <select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
              {[5,4,3,2,1].map((n) => <option key={n} value={n}>{stars(n)} ({n} yıldız)</option>)}
            </select>
            <textarea
              rows={3} placeholder="Ürün hakkında ne düşünüyorsunuz?"
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              style={{ marginTop: 10 }}
            />
            {reviewMsg && <div className="alert alert-success" style={{ marginTop: 8 }}>{reviewMsg}</div>}
            <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={submitReview}>Yorumu Gönder</button>
          </div>
        )}
      </div>
    </div>
  );
}
