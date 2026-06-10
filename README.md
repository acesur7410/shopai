# 🛍️ ShopAI – Yapay Zeka Destekli E-Ticaret Platformu

İleri Web Programlama dersi final projesi. Node.js + Express.js (backend), React.js (frontend), MongoDB (veritabanı), Claude AI (chatbot & öneri).

---

## 📁 Proje Yapısı

```
shopai/
├── backend/
│   ├── models/       → MongoDB şema modelleri
│   ├── routes/       → API endpoint'leri
│   ├── middleware/   → JWT auth middleware
│   ├── server.js     → Ana sunucu dosyası
│   ├── seed.js       → Örnek veri yükleme scripti
│   └── .env.example  → Ortam değişkenleri şablonu
└── frontend/
    ├── public/
    └── src/
        ├── components/ → Navbar, ProductCard, Chatbot
        ├── context/    → Auth ve Cart context
        ├── pages/      → Tüm sayfa bileşenleri
        └── utils/      → Axios instance
```

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js v18+
- MongoDB (yerel kurulum veya MongoDB Atlas)

### 1. MongoDB Kurulumu
MongoDB Community Edition yüklü olmalı ve çalışıyor olmalı:
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

### 2. Backend Kurulumu
```bash
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env
# .env dosyasını düzenle: ANTHROPIC_API_KEY'i ekle (opsiyonel)

# Örnek verileri yükle
node seed.js

# Geliştirme modunda başlat
npm run dev
```
Backend http://localhost:5000 adresinde çalışır.

### 3. Frontend Kurulumu
```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Başlat
npm start
```
Frontend http://localhost:3000 adresinde açılır.

---

## 🔑 Test Hesapları

| Rol   | E-posta               | Şifre    |
|-------|-----------------------|----------|
| Admin | admin@shopai.com      | admin123 |
| Kullanıcı | user@shopai.com  | user123  |

---

## 🌐 API Endpoint'leri

| Yöntem | Endpoint                   | Açıklama              | Yetki     |
|--------|----------------------------|-----------------------|-----------|
| POST   | /api/auth/register         | Kayıt ol              | Herkese   |
| POST   | /api/auth/login            | Giriş yap             | Herkese   |
| GET    | /api/auth/me               | Profil bilgisi        | Giriş     |
| GET    | /api/products              | Ürün listesi          | Herkese   |
| GET    | /api/products/:id          | Ürün detayı           | Herkese   |
| POST   | /api/products              | Ürün ekle             | Admin     |
| PUT    | /api/products/:id          | Ürün güncelle         | Admin     |
| DELETE | /api/products/:id          | Ürün sil              | Admin     |
| POST   | /api/products/:id/reviews  | Yorum ekle            | Giriş     |
| GET    | /api/cart                  | Sepeti getir          | Giriş     |
| POST   | /api/cart                  | Sepete ekle           | Giriş     |
| PUT    | /api/cart/:itemId          | Miktar güncelle       | Giriş     |
| DELETE | /api/cart/:itemId          | Ürünü kaldır          | Giriş     |
| POST   | /api/orders                | Sipariş ver           | Giriş     |
| GET    | /api/orders/myorders       | Siparişlerim          | Giriş     |
| GET    | /api/orders/:id            | Sipariş detayı        | Giriş     |
| GET    | /api/orders                | Tüm siparişler        | Admin     |
| PUT    | /api/orders/:id/status     | Durum güncelle        | Admin     |
| POST   | /api/ai/chat               | AI chatbot            | Giriş     |
| POST   | /api/ai/recommend          | Ürün öneri            | Giriş     |

---

## 🤖 AI Özellikleri

- **Chatbot**: Sağ alttaki 🤖 butonu ile açılır. Ürün soruları, öneri ve yardım.
- **Claude API**: `backend/.env` dosyasında `ANTHROPIC_API_KEY` tanımlanmalı.
- **Fallback**: API key yoksa statik yanıt döner, uygulama çalışmaya devam eder.

---

## 🛠️ Kullanılan Teknolojiler

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, @anthropic-ai/sdk  
**Frontend:** React 18, React Router v6, Axios, CSS (vanilla)

---

## 📝 Geliştirme Notları

- Seed verisi 12 ürün ve 2 kullanıcı içerir
- Ödeme sistemi simüle edilmiştir (gerçek işlem yapılmaz)
- AI API anahtarı olmadan tüm özellikler (chatbot hariç) tam çalışır
- Admin paneli: `/admin` rotası, sadece admin rolündeki kullanıcılar erişebilir
