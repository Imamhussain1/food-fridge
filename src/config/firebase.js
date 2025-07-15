import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdJAJW3rhX7UjigkmaliVhzHGeJdIpMHo",
  authDomain: "food-fridge-8be96.firebaseapp.com",
  projectId: "food-fridge-8be96",
  storageBucket: "food-fridge-8be96.firebasestorage.app",
  messagingSenderId: "699551160882",
  appId: "1:699551160882:web:c4ac7e9de1b35d4ea73a2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();