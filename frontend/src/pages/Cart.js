import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import './Cart.css';

export default function Cart() {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({ street: '', city: '', zip: '' });
  const [ordering, setOrdering] = useState(false);
  const [error, setError]       = useState('');
  const [step, setStep]         = useState(1); // 1=sepet, 2=adres

  const handleOrder = async () => {
    if (!shipping.street || !shipping.city || !shipping.zip)
      return setError('Lütfen tüm adres bilgilerini doldurun.');
    setOrdering(true);
    try {
      const { data } = await api.post('/orders', { shippingAddress: shipping });
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Sipariş oluşturulamadı');
    } finally { setOrdering(false); }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '48px 0' }}>
        <div className="empty-state">
          <div className="icon">🛒</div>
          <h3>Sepetiniz boş</h3>
          <p>Ürünleri keşfetmeye başlayın.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Alışverişe Git</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="page-title">Sepetim</h1>

      <div className="cart-layout">
        {/* Ürünler */}
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item._id} className="cart-item card">
              <img src={item.image || 'https://placehold.co/80x80/eee/999?text=Ürün'} alt={item.name} />
              <div className="cart-item-info">
                <Link to={`/products/${item.product}`}><h4>{item.name}</h4></Link>
                <div className="item-price">₺{item.price.toLocaleString('tr-TR')}</div>
              </div>
              <div className="cart-item-actions">
                <div className="qty-control">
                  <button onClick={() => updateItem(item._id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateItem(item._id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-subtotal">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</div>
                <button className="remove-btn" onClick={() => removeItem(item._id)}>🗑</button>
              </div>
            </div>
          ))}
          <button className="btn btn-outline btn-sm" onClick={clearCart}>Sepeti Temizle</button>
        </div>

        {/* Özet & Adres */}
        <div className="cart-summary card">
          <h3>Sipariş Özeti</h3>
          <div className="summary-row"><span>Ara Toplam</span><span>₺{cart.totalPrice.toLocaleString('tr-TR')}</span></div>
          <div className="summary-row"><span>Kargo</span><span className="free">Ücretsiz</span></div>
          <div className="summary-row total"><span>Toplam</span><span>₺{cart.totalPrice.toLocaleString('tr-TR')}</span></div>

          {step === 1 ? (
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => setStep(2)}>
              Siparişi Tamamla →
            </button>
          ) : (
            <div className="address-form">
              <h4>Teslimat Adresi</h4>
              <input placeholder="Adres" value={shipping.street} onChange={(e) => setShipping({ ...shipping, street: e.target.value })} />
              <input placeholder="Şehir" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
              <input placeholder="Posta Kodu" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
              {error && <div className="alert alert-error">{error}</div>}
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleOrder} disabled={ordering}>
                {ordering ? '⏳ İşleniyor...' : '✓ Siparişi Ver'}
              </button>
              <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 8 }} onClick={() => setStep(1)}>Geri</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
