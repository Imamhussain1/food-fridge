import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Calendar, Tag, Package, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../config/api';
import toast from 'react-hot-toast';

const MyItems = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editingFood, setEditingFood] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyFoods();
  }, []);

  const fetchMyFoods = async () => {
    try {
      const response = await api.get(`/foods/user/${user.email}`);
      setFoods(response.data.foods);
    } catch (error) {
      console.error('Error fetching foods:', error);
      toast.error('Failed to load your food items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (foodId) => {
    setDeleteLoading(foodId);
    try {
      await api.delete(`/foods/${foodId}`);
      setFoods(foods.filter(food => food._id !== foodId));
      toast.success('Food item deleted successfully!');
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error('Failed to delete food item');
    } finally {
      setDeleteLoading(null);
      setShowDeleteModal(null);
    }
  };

  const handleUpdate = async (foodId, updatedData) => {
    try {
      const response = await api.put(`/foods/${foodId}`, updatedData);
      setFoods(foods.map(food => 
        food._id === foodId ? response.data.food : food
      ));
      toast.success('Food item updated successfully!');
      setEditingFood(null);
    } catch (error) {
      console.error('Error updating food:', error);
      toast.error('Failed to update food item');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const isNearlyExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 5 && daysDiff > 0;
  };

  if (loading) {
    return <LoadingSpinner text="Loading your food items..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                My Food Items
              </h1>
              <p className="text-gray-600">
                Manage your personal food inventory
              </p>
            </div>
            <Link
              to="/add-food"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Food</span>
            </Link>
          </div>
        </motion.div>

        {foods.length > 0 ? (
          <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Food Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {foods.map((food) => (
                    <tr key={food._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={food.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100'}
                            alt={food.title}
                            className="w-10 h-10 object-cover rounded-lg mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {food.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              Added: {formatDate(food.addedDate)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {food.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {food.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(food.expiryDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isExpired(food.expiryDate) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Expired
                          </span>
                        ) : isNearlyExpired(food.expiryDate) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Nearly Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                            Fresh
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setEditingFood(food)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(food._id)}
                          className="text-error-600 hover:text-error-900 p-1 rounded hover:bg-error-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No food items yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start building your food inventory by adding your first item
            </p>
            <Link to="/add-food" className="btn-primary">
              Add Your First Food Item
            </Link>
          </motion.div>
        )}

        {/* Edit Modal */}
        {editingFood && (
          <EditFoodModal
            food={editingFood}
            onUpdate={handleUpdate}
            onClose={() => setEditingFood(null)}
          />
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <DeleteConfirmModal
            foodId={showDeleteModal}
            onDelete={handleDelete}
            onClose={() => setShowDeleteModal(null)}
            loading={deleteLoading === showDeleteModal}
          />
        )}
      </div>
    </div>
  );
};

// Edit Food Modal Component
const EditFoodModal = ({ food, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    title: food.title,
    category: food.category,
    quantity: food.quantity,
    expiryDate: food.expiryDate.split('T')[0],
    description: food.description || '',
    image: food.image || ''
  });
  const [loading, setLoading] = useState(false);

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
      await onUpdate(food._id, formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Food Item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Food Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Quantity</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Updating...' : 'Update Food'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmModal = ({ foodId, onDelete, onClose, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this food item? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(foodId)}
            className="bg-error-600 text-white px-4 py-2 rounded-lg hover:bg-error-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MyItems;