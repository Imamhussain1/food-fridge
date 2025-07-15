import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Dairy', 'Meat', 'Vegetables', 'Fruits', 'Snacks', 'Beverages', 'Grains']
  },
  quantity: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  userEmail: {
    type: String,
    required: true
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
foodSchema.index({ userEmail: 1, addedDate: -1 });
foodSchema.index({ expiryDate: 1 });
foodSchema.index({ category: 1 });

export default mongoose.model('Food', foodSchema);