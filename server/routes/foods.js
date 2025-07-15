import express from 'express';
import Food from '../models/Food.js';
import Note from '../models/Note.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all foods (public)
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find().sort({ addedDate: -1 });
    res.json({ foods });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nearly expired foods (public)
router.get('/nearly-expired', async (req, res) => {
  try {
    const fiveDaysFromNow = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const today = new Date();
    
    const foods = await Food.find({
      expiryDate: { $gte: today, $lte: fiveDaysFromNow }
    }).sort({ expiryDate: 1 });
    
    res.json({ foods });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expired foods (public)
router.get('/expired', async (req, res) => {
  try {
    const today = new Date();
    
    const foods = await Food.find({
      expiryDate: { $lt: today }
    }).sort({ expiryDate: -1 });
    
    res.json({ foods });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get food statistics (public)
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    const fiveDaysFromNow = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    
    const expired = await Food.countDocuments({
      expiryDate: { $lt: today }
    });
    
    const nearlyExpired = await Food.countDocuments({
      expiryDate: { $gte: today, $lte: fiveDaysFromNow }
    });
    
    const total = await Food.countDocuments();
    
    res.json({ expired, nearlyExpired, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get foods by user (private)
router.get('/user/:email', authMiddleware, async (req, res) => {
  try {
    const foods = await Food.find({ userEmail: req.params.email })
      .sort({ addedDate: -1 });
    res.json({ foods });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single food (public)
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json({ food });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new food (private)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json({ food });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update food (private)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    
    res.json({ food });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete food (private)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    
    // Also delete associated notes
    await Note.deleteMany({ foodId: req.params.id });
    
    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notes for a food item (public)
router.get('/:id/notes', async (req, res) => {
  try {
    const notes = await Note.find({ foodId: req.params.id })
      .sort({ createdAt: -1 });
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add note to food item (private)
router.post('/:id/notes', authMiddleware, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    
    // Check if user owns the food item
    if (food.userEmail !== req.body.userEmail) {
      return res.status(403).json({ error: 'Not authorized to add notes to this food item' });
    }
    
    const note = new Note({
      foodId: req.params.id,
      content: req.body.content,
      userEmail: req.body.userEmail,
      createdAt: new Date()
    });
    
    await note.save();
    res.status(201).json({ note });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;