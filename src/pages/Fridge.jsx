import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List } from 'lucide-react';
import FoodCard from '../components/common/FoodCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../config/api';

const Fridge = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  const categories = ['All', 'Dairy', 'Meat', 'Vegetables', 'Fruits', 'Snacks', 'Beverages', 'Grains'];

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [foods, searchTerm, selectedCategory]);

  const fetchFoods = async () => {
    try {
      const response = await api.get('/foods');
      setFoods(response.data.foods);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFoods = () => {
    let filtered = [...foods];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(food => 
        food.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    setFilteredFoods(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return <LoadingSpinner text="Loading fridge contents..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Your Fridge
          </h1>
          <p className="text-gray-600">
            Manage and track all your food items
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search foods by name or category..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-600">
            Showing {filteredFoods.length} of {foods.length} items
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </p>
        </motion.div>

        {/* Food Grid/List */}
        {filteredFoods.length > 0 ? (
          <motion.div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredFoods.map((food, index) => (
              <motion.div
                key={food._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {viewMode === 'grid' ? (
                  <FoodCard food={food} />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                    <img
                      src={food.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200'}
                      alt={food.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{food.title}</h3>
                      <p className="text-sm text-gray-600">{food.category} • {food.quantity}</p>
                      <p className="text-sm text-gray-500">
                        Expires: {new Date(food.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {new Date(food.expiryDate) < new Date() && (
                        <span className="badge badge-expired">Expired</span>
                      )}
                      <Link
                        to={`/food/${food._id}`}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No food items found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search or filter criteria'
                : 'Start adding food items to your fridge'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Fridge;