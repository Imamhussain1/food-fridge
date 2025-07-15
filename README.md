# Food Expiry Management System

A comprehensive full-stack web application for managing food inventory and tracking expiry dates to reduce food waste. Built with React, Node.js, MongoDB Atlas, and Firebase Authentication.

## 🚀 Live Demo
[Add your deployed app URL here]

## 📱 Screenshots
[Add screenshots of your application here]

## Features

### Authentication
- Firebase authentication with email/password
- Google OAuth integration
- JWT token-based API security
- Secure session management

### Food Management
- Add, edit, and delete food items
- Track expiry dates with visual indicators
- Categorize foods (Dairy, Meat, Vegetables, etc.)
- Image upload support
- Search and filter functionality

### Smart Notifications
- Nearly expired items (within 5 days)
- Expired items tracking
- Real-time countdown timers
- Statistical dashboard

### User Experience
- Responsive design for all devices
- Modern UI with smooth animations
- Dark/light theme support
- Intuitive navigation

## Tech Stack

### Frontend
- React.js with JavaScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Firebase Admin SDK
- CORS enabled

### Database
- MongoDB for data storage
- Optimized indexes for performance
- Flexible schema design

## Getting Started

### Prerequisites
- Node.js 16+ installed
- MongoDB running locally or cloud instance
- Firebase project configured

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/food-expiry-management.git
cd food-expiry-management
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
```

4. Configure environment variables
```bash
# Copy the example file
cp server/.env.example server/.env

# Add your MongoDB Atlas and Firebase credentials to server/.env
```

5. Set up your environment variables in `server/.env`:
```env
# MongoDB Atlas
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_firebase_project_id
# ... other Firebase config
```

6. Start the development servers
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/verify-token` - Verify Firebase token
- `POST /api/auth/logout` - Logout user

### Foods
- `GET /api/foods` - Get all foods
- `GET /api/foods/nearly-expired` - Get nearly expired foods
- `GET /api/foods/expired` - Get expired foods
- `GET /api/foods/stats` - Get food statistics
- `GET /api/foods/user/:email` - Get user's foods
- `GET /api/foods/:id` - Get single food
- `POST /api/foods` - Add new food (protected)
- `PUT /api/foods/:id` - Update food (protected)
- `DELETE /api/foods/:id` - Delete food (protected)

### Notes
- `GET /api/foods/:id/notes` - Get food notes
- `POST /api/foods/:id/notes` - Add note (protected)

## Project Structure

```
food-expiry-management/
├── src/
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── pages/
│   ├── context/
│   ├── config/
│   └── App.jsx
├── server/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── index.js
└── README.md
```

## 🔧 Technologies Used

- **Frontend**: React.js, Tailwind CSS, Framer Motion, React Router
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Auth with JWT
- **Deployment**: [Add your deployment platform]
- **Development**: Vite, ESLint, Nodemon

## Security Features

- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration
- Secure cookie handling
- Firebase security rules

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

[Your Name] - [Your GitHub Profile]