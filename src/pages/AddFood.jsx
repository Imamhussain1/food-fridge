import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Image, Type, Tag, Package, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';

const AddFood = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    quantity: '',
    expiryDate: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = ['Dairy', 'Meat', 'Vegetables', 'Fruits', 'Snacks', 'Beverages', 'Grains'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const foodData = {
        ...formData,
        userEmail: user.email,
        addedDate: new Date().toISOString()
      };

      await api.post('/foods', foodData);
      toast.success('Food item added successfully!');
      navigate('/my-items');
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error('Failed to add food item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Add New Food Item
              </h1>
              <p className="text-gray-600">
                Add a new food item to your inventory
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="image" className="form-label">
                  Food Image URL
                </label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="title" className="form-label">
                  Food Title *
                </label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Enter food title"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="form-label">
                  Category *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input pl-10 appearance-none"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="form-label">
                  Quantity *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="e.g., 1kg, 500ml, 2 pieces"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="expiryDate" className="form-label">
                  Expiry Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    required
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="form-input pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="form-input pl-10 resize-none"
                    placeholder="Add any additional details about the food item..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/my-items')}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="spinner w-5 h-5" />
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Add Food</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddFood;