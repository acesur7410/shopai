const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image:    { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items:         [orderItemSchema],
    shippingAddress: {
      street: { type: String, required: true },
      city:   { type: String, required: true },
      zip:    { type: String, required: true },
    },
    totalPrice:    { type: Number, required: true },
    status:        {
      type: String,
      enum: ['beklemede', 'onaylandı', 'kargoya_verildi', 'teslim_edildi', 'iptal'],
      default: 'beklemede',
    },
    isPaid:        { type: Boolean, default: false },
    paidAt:        { type: Date },
    isDelivered:   { type: Boolean, default: false },
    deliveredAt:   { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
