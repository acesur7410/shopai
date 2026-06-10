const router = require('express').Router();
const Anthropic = require('@anthropic-ai/sdk');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Ürün bağlamı hazırla (son 20 ürün)
    const products = await Product.find().limit(20).select('name category price description');
    const productContext = products
      .map((p) => `• ${p.name} (${p.category}) — ₺${p.price}: ${p.description.substring(0, 80)}`)
      .join('\n');

    const systemPrompt = `Sen ShopAI'nin yardımcı alışveriş asistanısın. Türkçe konuş.
Müşterilere ürün önerileri yap, fiyat bilgisi ver, sipariş ve iade konularında yardım et.
Samimi, kısa ve yardımsever ol.

Mevcut ürünlerimizden bazıları:
${productContext}

Eğer müşteri bir ürün soruyorsa yukarıdaki listeden öneri sun.`;

    const messages = [
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error('AI hata:', err.message);
    // API key yoksa fallback yanıt
    res.json({
      reply: 'Merhaba! Size nasıl yardımcı olabilirim? Ürünlerimiz, siparişleriniz veya iade işlemleri hakkında sorularınızı yanıtlayabilirim.',
    });
  }
});

// POST /api/ai/recommend
router.post('/recommend', protect, async (req, res) => {
  try {
    const { category, budget } = req.body;
    const query = {};
    if (category) query.category = { $regex: category, $options: 'i' };
    if (budget)   query.price    = { $lte: Number(budget) };

    const products = await Product.find(query).sort({ rating: -1 }).limit(6);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
