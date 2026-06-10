const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User    = require('./models/User');
const Product = require('./models/Product');

const users = [
  { name: 'Admin',       email: 'admin@shopai.com',  password: 'admin123',  role: 'admin' },
  { name: 'Test Kullanıcı', email: 'user@shopai.com', password: 'user123',  role: 'user'  },
];

const products = [
  { name: 'iPhone 15 Pro', description: 'Apple\'ın en güçlü akıllı telefonu. A17 Pro çip, titanium tasarım.', price: 54999, category: 'Elektronik', stock: 15, image: 'https://placehold.co/400x400/1a1a2e/white?text=iPhone+15', rating: 4.8, numReviews: 120 },
  { name: 'Samsung Galaxy S24', description: 'Android\'in zirvesi. 200MP kamera, Snapdragon 8 Gen 3.', price: 42999, category: 'Elektronik', stock: 20, image: 'https://placehold.co/400x400/1a1a2e/white?text=Galaxy+S24', rating: 4.6, numReviews: 85 },
  { name: 'MacBook Air M3', description: '18 saat pil ömrü, M3 çip, fanless tasarım.', price: 47999, category: 'Bilgisayar', stock: 8, image: 'https://placehold.co/400x400/2c3e50/white?text=MacBook+Air', rating: 4.9, numReviews: 200 },
  { name: 'Dell XPS 15', description: '4K OLED ekran, Intel Core i9, RTX 4070.', price: 62999, category: 'Bilgisayar', stock: 5, image: 'https://placehold.co/400x400/2c3e50/white?text=Dell+XPS', rating: 4.5, numReviews: 60 },
  { name: 'Sony WH-1000XM5', description: 'Sektörün en iyi gürültü engelleme kulaklığı.', price: 11999, category: 'Aksesuar', stock: 30, image: 'https://placehold.co/400x400/16213e/white?text=Sony+XM5', rating: 4.7, numReviews: 340 },
  { name: 'Apple AirPods Pro 2', description: 'H2 çip ile gelişmiş gürültü engelleme ve şeffaflık modu.', price: 8999, category: 'Aksesuar', stock: 25, image: 'https://placehold.co/400x400/16213e/white?text=AirPods+Pro', rating: 4.6, numReviews: 210 },
  { name: 'iPad Pro 12.9"', description: 'M4 çip, Liquid Retina XDR ekran, Apple Pencil Pro desteği.', price: 38999, category: 'Tablet', stock: 12, image: 'https://placehold.co/400x400/0f3460/white?text=iPad+Pro', rating: 4.8, numReviews: 95 },
  { name: 'Samsung Galaxy Tab S9', description: 'Dynamic AMOLED 2X ekran, S Pen dahil.', price: 28999, category: 'Tablet', stock: 10, image: 'https://placehold.co/400x400/0f3460/white?text=Galaxy+Tab', rating: 4.5, numReviews: 70 },
  { name: 'Logitech MX Master 3S', description: 'Profesyonel kablosuz fare, 8000 DPI, sessiz tıklama.', price: 2999, category: 'Aksesuar', stock: 40, image: 'https://placehold.co/400x400/533483/white?text=MX+Master', rating: 4.7, numReviews: 180 },
  { name: 'Mechanical Gaming Keyboard', description: 'RGB aydınlatmalı, Cherry MX Blue switch, TKL tasarım.', price: 1799, category: 'Aksesuar', stock: 35, image: 'https://placehold.co/400x400/533483/white?text=Keyboard', rating: 4.4, numReviews: 90 },
  { name: 'LG 27" 4K Monitor', description: 'IPS panel, 144Hz, HDR600, USB-C 96W şarj.', price: 18999, category: 'Bilgisayar', stock: 7, image: 'https://placehold.co/400x400/1b4332/white?text=LG+Monitor', rating: 4.6, numReviews: 55 },
  { name: 'GoPro Hero 12', description: '5.3K video, HyperSmooth 6.0, 27MP fotoğraf.', price: 14999, category: 'Elektronik', stock: 18, image: 'https://placehold.co/400x400/1b4332/white?text=GoPro', rating: 4.5, numReviews: 130 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB bağlandı');

    await User.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Eski veriler silindi');

    // Kullanıcıları ekle (şifreler User modeli tarafından hashlenir)
    for (const u of users) {
      await User.create(u);
    }
    console.log('👤 Kullanıcılar eklendi');

    await Product.insertMany(products);
    console.log('📦 Ürünler eklendi');

    console.log('\n✅ Seed tamamlandı!');
    console.log('Admin: admin@shopai.com / admin123');
    console.log('User:  user@shopai.com  / user123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed hatası:', err.message);
    process.exit(1);
  }
}

seed();
