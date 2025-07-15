import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
noteSchema.index({ foodId: 1, createdAt: -1 });

export default mongoose.model('Note', noteSchema);