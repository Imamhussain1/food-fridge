import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../config/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await api.post('/auth/verify-token', { idToken });
          
          if (response.data.success) {
            setUser(firebaseUser);
            Cookies.set('token', response.data.token, { expires: 7 });
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          setUser(null);
          Cookies.remove('token');
        }
      } else {
        setUser(null);
        Cookies.remove('token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      return result;
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (email, password, name, photoURL) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL
      });
      toast.success('Registration successful!');
      return result;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Google login successful!');
      return result;
    } catch (error) {
      toast.error('Google login failed. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('token');
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};