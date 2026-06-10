const router = require('express').Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// GET /api/cart
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price stock image');
    if (!cart) return res.json({ items: [], totalPrice: 0 });
    const totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    res.json({ items: cart.items, totalPrice: parseFloat(totalPrice.toFixed(2)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart  — ürün ekle veya miktarı artır
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Yetersiz stok' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        name:    product.name,
        price:   product.price,
        image:   product.image,
        quantity: Number(quantity),
      });
    }

    await cart.save();
    const totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    res.json({ items: cart.items, totalPrice: parseFloat(totalPrice.toFixed(2)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/cart/:itemId — miktar güncelle
router.put('/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Sepet bulunamadı' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Ürün sepette yok' });

    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();
    const totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    res.json({ items: cart.items, totalPrice: parseFloat(totalPrice.toFixed(2)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/:itemId — ürünü kaldır
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Sepet bulunamadı' });
    cart.items.pull(req.params.itemId);
    await cart.save();
    const totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    res.json({ items: cart.items, totalPrice: parseFloat(totalPrice.toFixed(2)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart — sepeti temizle
router.delete('/', protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Sepet temizlendi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
