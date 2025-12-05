import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  logo: {
    type: String,
    default: '',
  },
  banner: {
    type: String,
    default: '',
  },
  theme: {
    name: {
      type: String,
      enum: ['light', 'dark', 'minimal', 'bold', 'custom'],
      default: 'light',
    },
    primaryColor: String,
    secondaryColor: String,
    accentColor: String,
    fontFamily: String,
    layout: {
      type: String,
      enum: ['grid', 'list', 'masonry'],
      default: 'grid',
    },
    customColors: {
      background: String,
      text: String,
      card: String,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isAIGenerated: {
    type: Boolean,
    default: true,
  },
  aiGeneratedData: {
    brandStory: String,
    tagline: String,
    mission: String,
    vision: String,
    colorPalette: {
      primary: [String],
      secondary: [String],
      accent: [String],
    },
    typography: [String],
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  analytics: {
    views: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
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

storeSchema.index({ owner: 1 });
storeSchema.index({ status: 1 });

const Store = mongoose.model('Store', storeSchema);

export default Store;

