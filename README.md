# Food Expiry Management System

A comprehensive web application for managing food inventory and tracking expiry dates to reduce food waste.

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
git clone <repository-url>
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

# Edit with your actual values
nano server/.env
```

5. Configure Firebase
- Update `src/config/firebase.js` with your Firebase config
- Update `server/config/firebase-admin.js` with your service account

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

## Security Features

- JWT token authentication
- Protected API routes
- Input validation
- CORS configuration
- Secure cookie handling
- Firebase security rules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.