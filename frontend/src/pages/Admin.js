import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const EMPTY_FORM = { name: '', description: '', price: '', category: '', stock: '', image: '' };

export default function Admin() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const fileRef   = useRef(null);

  const [tab, setTab]           = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editing, setEditing]   = useState(null);
  const [msg, setMsg]           = useState({ text: '', type: 'success' });

  // Fotoğraf yükleme state'leri
  const [previewUrl, setPreviewUrl]     = useState('');
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
  }, [user]);

  useEffect(() => {
    if (tab === 'products') fetchProducts();
    if (tab === 'orders')   api.get('/orders').then(({ data }) => setOrders(data));
  }, [tab]);

  const fetchProducts = () =>
    api.get('/products?limit=100').then(({ data }) => setProducts(data.products));

  // ── Dosya seçildiğinde önizleme + otomatik yükle ──
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Önizleme
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    // Sunucuya yükle
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Dönen URL'yi forma kaydet
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Yükleme başarısız');
      setPreviewUrl('');
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl('');
    setUploadError('');
    setForm((prev) => ({ ...prev, image: '' }));
    if (fileRef.current) fileRef.current.value = '';
  };

  const saveProduct = async () => {
    setMsg({ text: '', type: 'success' });
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) {
        await api.put(`/products/${editing}`, payload);
        setMsg({ text: 'Ürün güncellendi ✓', type: 'success' });
      } else {
        await api.post('/products', payload);
        setMsg({ text: 'Ürün eklendi ✓', type: 'success' });
      }
      setForm(EMPTY_FORM);
      setEditing(null);
      setPreviewUrl('');
      fetchProducts();
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Hata oluştu', type: 'error' });
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const editProduct = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, image: p.image });
    setPreviewUrl(p.image || '');
    setMsg({ text: '', type: 'success' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setPreviewUrl('');
    setMsg({ text: '', type: 'success' });
  };

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
  };

  const f = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="admin-page container">
      <h1 className="page-title">Admin Paneli</h1>

      <div className="admin-tabs">
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>📦 Ürünler</button>
        <button className={tab === 'orders'   ? 'active' : ''} onClick={() => setTab('orders')}>📋 Siparişler</button>
      </div>

      {tab === 'products' && (
        <div className="admin-content">
          {/* ── Form ── */}
          <div className="card admin-form">
            <h3>{editing ? '✏️ Ürünü Düzenle' : '➕ Yeni Ürün Ekle'}</h3>

            {msg.text && (
              <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {msg.text}
              </div>
            )}

            <div className="form-grid">
              <input placeholder="Ürün Adı *"   value={form.name}        onChange={f('name')} />
              <input placeholder="Kategori *"   value={form.category}    onChange={f('category')} />
              <input type="number" placeholder="Fiyat ₺ *" value={form.price} onChange={f('price')} />
              <input type="number" placeholder="Stok *"    value={form.stock} onChange={f('stock')} />
              <textarea
                placeholder="Açıklama *"
                value={form.description}
                onChange={f('description')}
                rows={3}
                style={{ gridColumn: 'span 2' }}
              />
            </div>

            {/* ── Fotoğraf Yükleme Alanı ── */}
            <div className="upload-section">
              <label className="upload-label">Ürün Görseli</label>

              <div className="upload-area" onClick={() => fileRef.current?.click()}>
                {previewUrl ? (
                  <div className="upload-preview">
                    <img src={previewUrl} alt="Önizleme" />
                    <div className="upload-overlay">
                      <span>Değiştirmek için tıkla</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    {uploading ? (
                      <><div className="spinner" style={{ width: 32, height: 32 }} /><p>Yükleniyor...</p></>
                    ) : (
                      <><span className="upload-icon">📷</span><p>Fotoğraf seç veya sürükle</p><small>JPG, PNG, WEBP — maks. 5MB</small></>
                    )}
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>

              {uploading && <p className="upload-status">⏳ Sunucuya yükleniyor...</p>}
              {uploadError && <p className="upload-status error">❌ {uploadError}</p>}
              {form.image && !uploading && !uploadError && (
                <p className="upload-status success">✓ Görsel yüklendi</p>
              )}

              <div className="upload-actions">
                {previewUrl && (
                  <button className="btn btn-sm btn-outline" type="button" onClick={clearImage}>
                    🗑 Görseli Kaldır
                  </button>
                )}
                <span className="upload-or">— veya —</span>
                <input
                  placeholder="Görsel URL yapıştır (opsiyonel)"
                  value={form.image.startsWith('/uploads') ? '' : form.image}
                  onChange={(e) => { setForm((p) => ({ ...p, image: e.target.value })); setPreviewUrl(e.target.value); }}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-primary" onClick={saveProduct} disabled={uploading}>
                {editing ? '💾 Güncelle' : '➕ Ürünü Ekle'}
              </button>
              {editing && (
                <button className="btn btn-outline" onClick={cancelEdit}>İptal</button>
              )}
            </div>
          </div>

          {/* ── Ürün Tablosu ── */}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Görsel</th><th>Ürün</th><th>Kategori</th><th>Fiyat</th><th>Stok</th><th>İşlem</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={p.image || 'https://placehold.co/50x50/eee/999?text=?'}
                        alt={p.name}
                        className="table-thumb"
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₺{p.price.toLocaleString('tr-TR')}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => editProduct(p)}>Düzenle</button>
                      <button className="btn btn-sm btn-danger" style={{ marginLeft: 6 }} onClick={() => deleteProduct(p._id)}>Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Sipariş No</th><th>Müşteri</th><th>Toplam</th><th>Durum</th><th>Güncelle</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name || '-'}</td>
                  <td>₺{o.totalPrice.toLocaleString('tr-TR')}</td>
                  <td>{o.status}</td>
                  <td>
                    <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                      {['beklemede','onaylandı','kargoya_verildi','teslim_edildi','iptal'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
