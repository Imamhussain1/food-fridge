import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  X, 
  Home, 
  Refrigerator, 
  Plus, 
  Package, 
  LogOut,
  User
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <motion.nav 
      className="bg-white shadow-lg sticky top-0 z-50"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Refrigerator className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">FreshKeep</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/fridge" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Refrigerator className="h-4 w-4" />
              <span>Fridge</span>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/add-food" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Food</span>
                </Link>
                <Link 
                  to="/my-items" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <Package className="h-4 w-4" />
                  <span>My Items</span>
                </Link>
                
                {/* User Avatar */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title={user.displayName || user.email}
                  >
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="User Avatar" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-600" />
                    )}
                  </button>
                  
                  {showUserMenu && (
                    <motion.div
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border"
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t"
          >
            <div className="space-y-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/fridge" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Refrigerator className="h-4 w-4" />
                <span>Fridge</span>
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/add-food" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Food</span>
                  </Link>
                  <Link 
                    to="/my-items" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    <span>My Items</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <Link 
                    to="/login" 
                    className="block text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block btn-primary text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;