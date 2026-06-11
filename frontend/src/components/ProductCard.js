import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { imgUrl } from '../utils/imageUrl';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!user) return setError('Giriş yapmanız gerekiyor');
    const result = await addToCart(product._id);
    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      setError(result.message);
      setTimeout(() => setError(''), 2000);
    }
  };

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));

  return (
    <div className="product-card card">
      <Link to={`/products/${product._id}`}>
        <div className="product-img-wrap">
<img src={imgUrl(product.image)} alt={product.name} />
        </div>
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <span className="stars">{stars}</span>
            <span className="review-count">({product.numReviews})</span>
          </div>
          <div className="product-price">₺{product.price.toLocaleString('tr-TR')}</div>
          {product.stock === 0 && <span className="out-of-stock">Stok Tükendi</span>}
        </div>
      </Link>
      {error && <div className="alert alert-error" style={{ margin: '0 12px 8px', fontSize: '0.8rem' }}>{error}</div>}
      <div className="product-card-footer">
        <button
          className={`btn ${added ? 'btn-success' : 'btn-primary'} btn-sm`}
          onClick={handleAdd}
          disabled={loading || product.stock === 0}
        >
          {added ? '✓ Eklendi' : '+ Sepete Ekle'}
        </button>
      </div>
    </div>
  );
}
