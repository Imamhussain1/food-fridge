import express from 'express';
import jwt from 'jsonwebtoken';
import admin from '../config/firebase-admin.js';

const router = express.Router();

// Verify Firebase token and issue JWT
router.post('/verify-token', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Create JWT token
    const jwtToken = jwt.sign(
      { 
        uid: decodedToken.uid, 
        email: decodedToken.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      success: true, 
      token: jwtToken,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

export default router;