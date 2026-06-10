import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${search.trim()}`);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-shop">Shop</span><span className="logo-ai">AI</span>
        </Link>

        {/* Arama */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text" placeholder="Ürün, kategori ara..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        {/* Linkler */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/products">Ürünler</Link>

          {user ? (
            <>
              <Link to="/cart" className="cart-link">
                🛒 Sepet {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <Link to="/orders">Siparişlerim</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <div className="user-menu">
                <span className="user-name">👤 {user.name.split(' ')[0]}</span>
                <button className="btn btn-sm btn-outline" onClick={handleLogout}>Çıkış</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-outline">Giriş</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Üye Ol</Link>
            </>
          )}
        </div>

        {/* Mobil menü butonu */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}
