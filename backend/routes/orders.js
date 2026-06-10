const router = require('express').Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// POST /api/orders — sipariş oluştur
router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Sepetiniz boş' });

    // Stok kontrolü ve güncelleme
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity)
        return res.status(400).json({ message: `${item.name} için yeterli stok yok` });
      product.stock -= item.quantity;
      await product.save();
    }

    const totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((i) => ({
        product: i.product, name: i.name,
        price: i.price, quantity: i.quantity, image: i.image,
      })),
      shippingAddress,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      isPaid: true,
      paidAt: new Date(),
    });

    // Sepeti temizle
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    // Sadece kendi siparişi veya admin görebilir
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Erişim reddedildi' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders  (admin — tüm siparişler)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status  (admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    order.status = status;
    if (status === 'teslim_edildi') { order.isDelivered = true; order.deliveredAt = new Date(); }
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
