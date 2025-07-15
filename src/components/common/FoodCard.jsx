import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Package, Tag, AlertTriangle } from 'lucide-react';

const FoodCard = ({ food, showSeeDetails = true }) => {
  const isExpired = new Date(food.expiryDate) < new Date();
  const isNearlyExpired = !isExpired && new Date(food.expiryDate) <= new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  const getBadgeStyle = () => {
    if (isExpired) return 'badge-expired';
    if (isNearlyExpired) return 'badge-nearly-expired';
    return 'badge-fresh';
  };

  const getBadgeText = () => {
    if (isExpired) return 'Expired';
    if (isNearlyExpired) return 'Nearly Expired';
    return 'Fresh';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img
          src={food.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500'}
          alt={food.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`badge ${getBadgeStyle()}`}>
            {getBadgeText()}
          </span>
        </div>
        {isExpired && (
          <div className="absolute top-4 left-4">
            <AlertTriangle className="h-6 w-6 text-error-500" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {food.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Tag className="h-4 w-4" />
            <span>{food.category}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>{food.quantity}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Expires: {formatDate(food.expiryDate)}</span>
          </div>
        </div>
        
        {showSeeDetails && (
          <Link
            to={`/food/${food._id}`}
            className="block w-full text-center btn-primary"
          >
            See Details
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default FoodCard;