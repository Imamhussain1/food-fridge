import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingUp, Shield, Clock, Users } from 'lucide-react';
import CountUp from 'react-countup';
import FoodCard from '../components/common/FoodCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../config/api';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nearlyExpiredFoods, setNearlyExpiredFoods] = useState([]);
  const [expiredFoods, setExpiredFoods] = useState([]);
  const [stats, setStats] = useState({ expired: 0, nearlyExpired: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const slides = [
    {
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'Smart Food Management',
      subtitle: 'Track expiry dates and reduce food waste with our intelligent system'
    },
    {
      image: 'https://images.pexels.com/photos/1161547/pexels-photo-1161547.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'Never Let Food Go Bad',
      subtitle: 'Get timely notifications before your food expires'
    },
    {
      image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1200',
      title: 'Organize Your Fridge',
      subtitle: 'Keep your kitchen organized and your food fresh'
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const [nearlyExpiredRes, expiredRes, statsRes] = await Promise.all([
        api.get('/foods/nearly-expired'),
        api.get('/foods/expired'),
        api.get('/foods/stats')
      ]);

      setNearlyExpiredFoods(nearlyExpiredRes.data.foods.slice(0, 6));
      setExpiredFoods(expiredRes.data.foods.slice(0, 6));
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return <LoadingSpinner text="Loading home page..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10 }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <motion.h1
                  className="text-5xl md:text-7xl font-bold mb-6"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl mb-8"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link to="/fridge" className="btn-primary text-lg px-8 py-4">
                    Explore Fridge
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-error-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-error-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                <CountUp end={stats.expired} duration={2} />
              </div>
              <p className="text-gray-600">Expired Items</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-warning-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                <CountUp end={stats.nearlyExpired} duration={2} />
              </div>
              <p className="text-gray-600">Nearly Expired</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-success-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                <CountUp end={stats.total} duration={2} />
              </div>
              <p className="text-gray-600">Total Items</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nearly Expired Foods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Nearly Expired Items
            </h2>
            <p className="text-lg text-gray-600">
              Use these items soon to avoid waste
            </p>
          </motion.div>
          
          {nearlyExpiredFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearlyExpiredFoods.map((food, index) => (
                <motion.div
                  key={food._id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FoodCard food={food} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No nearly expired items found!</p>
            </div>
          )}
        </div>
      </section>

      {/* Expired Foods */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Expired Items
            </h2>
            <p className="text-lg text-gray-600">
              These items have passed their expiry date
            </p>
          </motion.div>
          
          {expiredFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredFoods.map((food, index) => (
                <motion.div
                  key={food._id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FoodCard food={food} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No expired items found!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose FreshKeep?
            </h2>
            <p className="text-lg text-gray-600">
              Advanced features to help you manage your food inventory
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Expiry Tracking
              </h3>
              <p className="text-gray-600">
                Never let food go bad again with our intelligent expiry date tracking system.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center p-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Secure Storage
              </h3>
              <p className="text-gray-600">
                Your food inventory data is securely stored and protected with advanced encryption.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center p-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Easy Sharing
              </h3>
              <p className="text-gray-600">
                Share your food inventory with family members and coordinate your meals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Food Storage Tips
            </h2>
            <p className="text-lg text-gray-600">
              Expert tips to keep your food fresh longer
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Refrigerator Organization
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Keep your fridge temperature at 37°F (3°C)</li>
                <li>• Store raw meat on the bottom shelf</li>
                <li>• Use clear containers for better visibility</li>
                <li>• Follow the "first in, first out" principle</li>
              </ul>
            </motion.div>
            
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Reduce Food Waste
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Plan your meals ahead of time</li>
                <li>• Use vegetables in soups and stews</li>
                <li>• Freeze items before they expire</li>
                <li>• Compost food scraps when possible</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;