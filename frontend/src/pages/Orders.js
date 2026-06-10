import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';
import './Orders.css';

const statusLabel = {
  beklemede: { label: 'Beklemede', badge: 'badge-warning' },
  onaylandı: { label: 'Onaylandı', badge: 'badge-info' },
  kargoya_verildi: { label: 'Kargoya Verildi', badge: 'badge-info' },
  teslim_edildi: { label: 'Teslim Edildi', badge: 'badge-success' },
  iptal: { label: 'İptal', badge: 'badge-danger' },
};

export function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-overlay"><div className="spinner" /></div>;

  return (
    <div className="orders-page container">
      <h1 className="page-title">Siparişlerim</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📦</div>
          <h3>Henüz siparişiniz yok</h3>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Alışverişe Başla</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((o) => {
            const s = statusLabel[o.status] || { label: o.status, badge: 'badge-info' };
            return (
              <Link to={`/orders/${o._id}`} key={o._id} className="order-card card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id">#{o._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{new Date(o.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <span className={`badge ${s.badge}`}>{s.label}</span>
                </div>
                <div className="order-items-preview">
                  {o.items.slice(0, 3).map((item, i) => (
                    <span key={i}>{item.name} x{item.quantity}</span>
                  ))}
                  {o.items.length > 3 && <span>+{o.items.length - 3} ürün daha</span>}
                </div>
                <div className="order-total">Toplam: <strong>₺{o.totalPrice.toLocaleString('tr-TR')}</strong></div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-overlay"><div className="spinner" /></div>;
  if (!order)  return <div className="container"><div className="alert alert-error">Sipariş bulunamadı</div></div>;

  const s = statusLabel[order.status] || { label: order.status, badge: 'badge-info' };

  return (
    <div className="order-detail container">
      <Link to="/orders" className="back-link">← Siparişlerim</Link>
      <div className="order-detail-header">
        <h1>Sipariş #{order._id.slice(-8).toUpperCase()}</h1>
        <span className={`badge ${s.badge}`}>{s.label}</span>
      </div>
      <div className="order-detail-grid">
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3>Ürünler</h3>
            {order.items.map((item, i) => (
              <div key={i} className="order-item-row">
                <img src={item.image || 'https://placehold.co/60x60/eee/999?text=Ürün'} alt={item.name} />
                <div className="flex-1">
                  <p>{item.name}</p>
                  <small>Adet: {item.quantity}</small>
                </div>
                <strong>₺{(item.price * item.quantity).toLocaleString('tr-TR')}</strong>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3>Teslimat Adresi</h3>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3>Özet</h3>
            <div className="summary-row"><span>Tarih</span><span>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</span></div>
            <div className="summary-row"><span>Ödeme</span><span>{order.isPaid ? '✓ Ödendi' : 'Bekliyor'}</span></div>
            <div className="summary-row total"><span>Toplam</span><span>₺{order.totalPrice.toLocaleString('tr-TR')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
