import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: String,
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [{
    url: String,
    publicId: String,
  }],
  category: {
    type: String,
    default: 'General',
  },
  tags: [String],
  isAIGenerated: {
    type: Boolean,
    default: false,
  },
  aiGeneratedData: {
    designPrompt: String,
    description: {
      seo: String,
      bullets: [String],
      highlights: [String],
    },
  },
  stock: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive'],
    default: 'active',
  },
  views: {
    type: Number,
    default: 0,
  },
  sales: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ store: 1 });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;

